-- Apply once before deploying this version. Transactional and safe to re-run.
-- Only dropdown_* objects are changed; other Neurora projects are untouched.
-- If duplicate paypal_order_id values exist, the transaction aborts for manual review.
begin;

create or replace function public.dropdown_is_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.dropdown_profiles where id = auth.uid() and is_admin);
$$;
revoke all on function public.dropdown_is_admin() from public;
grant execute on function public.dropdown_is_admin() to anon, authenticated;

drop policy if exists "dropdown: public read profiles" on public.dropdown_profiles;
drop policy if exists "dropdown: private profiles" on public.dropdown_profiles;
create policy "dropdown: private profiles" on public.dropdown_profiles for select
  using (auth.uid() = id or public.dropdown_is_admin());
revoke update on public.dropdown_profiles from anon, authenticated;
grant update(full_name, avatar_url) on public.dropdown_profiles to authenticated;

-- Only the trusted payment server can grant/revoke a paid entitlement.
drop policy if exists "dropdown: insert own purchase" on public.dropdown_purchases;
drop policy if exists "dropdown: admin full purchases" on public.dropdown_purchases;
drop policy if exists "dropdown: admin read purchases" on public.dropdown_purchases;
create policy "dropdown: admin read purchases" on public.dropdown_purchases for select using (public.dropdown_is_admin());
revoke insert,update,delete on public.dropdown_purchases from anon, authenticated;
grant select on public.dropdown_purchases to authenticated;
grant select,insert,update,delete on public.dropdown_purchases to service_role;
grant select on public.dropdown_courses to service_role;
create unique index if not exists dropdown_unique_paypal_order on public.dropdown_purchases(paypal_order_id);
create index if not exists dropdown_purchase_access on public.dropdown_purchases(user_id,course_id,status);

-- Purchased courses remain available if subsequently hidden from the catalog.
drop policy if exists "dropdown: read published courses" on public.dropdown_courses;
create policy "dropdown: read published courses" on public.dropdown_courses for select using (
  is_published or public.dropdown_is_admin() or exists (
    select 1 from public.dropdown_purchases p where p.course_id=dropdown_courses.id and p.user_id=auth.uid() and p.status='completed'
  )
);
-- Recreate admin policies without profile recursion.
drop policy if exists "dropdown: admin full courses" on public.dropdown_courses;
create policy "dropdown: admin full courses" on public.dropdown_courses for all using(public.dropdown_is_admin()) with check(public.dropdown_is_admin());
drop policy if exists "dropdown: admin full modules" on public.dropdown_course_modules;
create policy "dropdown: admin full modules" on public.dropdown_course_modules for all using(public.dropdown_is_admin()) with check(public.dropdown_is_admin());
drop policy if exists "dropdown: admin full lessons" on public.dropdown_lessons;
create policy "dropdown: admin full lessons" on public.dropdown_lessons for all using(public.dropdown_is_admin()) with check(public.dropdown_is_admin());
drop policy if exists "dropdown: admin full downloads" on public.dropdown_free_downloads;
create policy "dropdown: admin full downloads" on public.dropdown_free_downloads for all using(public.dropdown_is_admin()) with check(public.dropdown_is_admin());
drop policy if exists "dropdown: admin full messages" on public.dropdown_contact_messages;
create policy "dropdown: admin full messages" on public.dropdown_contact_messages for all using(public.dropdown_is_admin()) with check(public.dropdown_is_admin());
grant select,insert,update,delete on public.dropdown_courses,public.dropdown_course_modules,public.dropdown_free_downloads,public.dropdown_contact_messages to authenticated;
grant insert,update,delete on public.dropdown_lessons to authenticated;

drop policy if exists "dropdown: read modules" on public.dropdown_course_modules;
create policy "dropdown: read modules" on public.dropdown_course_modules for select using (
  exists(select 1 from public.dropdown_courses c where c.id=course_id)
);
drop policy if exists "dropdown: read lessons" on public.dropdown_lessons;
create policy "dropdown: read lessons" on public.dropdown_lessons for select using (
  exists(select 1 from public.dropdown_course_modules m where m.id=module_id)
);
-- Syllabus is public; video URLs and lesson resources are released only by the RPC below.
revoke select on public.dropdown_lessons from public,anon,authenticated;
grant select(id,module_id,title,description,video_duration,order_index,is_free,created_at) on public.dropdown_lessons to anon,authenticated;
create or replace function public.dropdown_lesson_media(p_course_id uuid)
returns table(id uuid, video_id text, resources jsonb)
language sql stable security definer set search_path = '' as $$
  select l.id,l.video_id,l.resources from public.dropdown_lessons l
  join public.dropdown_course_modules m on m.id=l.module_id
  join public.dropdown_courses c on c.id=m.course_id
  where c.id=p_course_id and (
    public.dropdown_is_admin() or (c.is_published and l.is_free) or exists(
      select 1 from public.dropdown_purchases p where p.course_id=c.id and p.user_id=auth.uid() and p.status='completed'
    )
  );
$$;
revoke all on function public.dropdown_lesson_media(uuid) from public;
grant execute on function public.dropdown_lesson_media(uuid) to anon,authenticated;

create or replace function public.dropdown_can_track(p_lesson_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.dropdown_lessons l
    join public.dropdown_course_modules m on m.id=l.module_id
    join public.dropdown_purchases p on p.course_id=m.course_id
    where l.id=p_lesson_id and nullif(trim(l.video_id),'') is not null
      and p.user_id=auth.uid() and p.status='completed');
$$;
revoke all on function public.dropdown_can_track(uuid) from public;
grant execute on function public.dropdown_can_track(uuid) to authenticated;
drop policy if exists "dropdown: manage own progress" on public.dropdown_user_progress;
drop policy if exists "dropdown: read own progress" on public.dropdown_user_progress;
drop policy if exists "dropdown: insert own progress" on public.dropdown_user_progress;
drop policy if exists "dropdown: update own progress" on public.dropdown_user_progress;
create policy "dropdown: read own progress" on public.dropdown_user_progress for select using(auth.uid()=user_id);
create policy "dropdown: insert own progress" on public.dropdown_user_progress for insert with check(auth.uid()=user_id and public.dropdown_can_track(lesson_id));
create policy "dropdown: update own progress" on public.dropdown_user_progress for update using(auth.uid()=user_id) with check(auth.uid()=user_id and public.dropdown_can_track(lesson_id));


create or replace function public.dropdown_stamp_progress()
returns trigger language plpgsql set search_path = '' as $$
begin
  if new.completed then
    if TG_OP='INSERT' then new.completed_at=now();
    elsif not old.completed then new.completed_at=now();
    else new.completed_at=old.completed_at; end if;
  else new.completed_at=null; end if;
  new.updated_at=now();
  return new;
end;
$$;
drop trigger if exists dropdown_progress_timestamp on public.dropdown_user_progress;
create trigger dropdown_progress_timestamp before insert or update on public.dropdown_user_progress
for each row execute function public.dropdown_stamp_progress();

create or replace function public.dropdown_certificate(p_slug text)
returns table(student_name text,course_title text,completed_at timestamptz,certificate_id text)
language sql stable security definer set search_path = '' as $$
  select coalesce(nullif(trim(pr.full_name),''),'Studente Dropdown Academy'),c.title,max(up.completed_at),
    'DD-'||upper(substr(md5(auth.uid()::text||':'||c.id::text),1,16))
  from public.dropdown_courses c
  join public.dropdown_course_modules m on m.course_id=c.id
  join public.dropdown_lessons l on l.module_id=m.id
  join public.dropdown_profiles pr on pr.id=auth.uid()
  left join public.dropdown_user_progress up on up.lesson_id=l.id and up.user_id=auth.uid()
  where c.slug=p_slug and exists(select 1 from public.dropdown_purchases p
    where p.user_id=auth.uid() and p.course_id=c.id and p.status='completed')
  group by c.id,c.title,pr.full_name
  having count(l.id)>0 and bool_and(coalesce(up.completed,false))
    and bool_and(nullif(trim(l.video_id),'') is not null) and max(up.completed_at) is not null;
$$;
revoke all on function public.dropdown_certificate(text) from public;
grant execute on function public.dropdown_certificate(text) to authenticated;

-- Bounds are enforced on the database as well as in the form.
drop policy if exists "dropdown: insert contact message" on public.dropdown_contact_messages;
create policy "dropdown: insert contact message" on public.dropdown_contact_messages for insert with check(
    status='unread' and char_length(name) between 2 and 120 and char_length(email) between 3 and 254
    and char_length(subject) between 3 and 200 and char_length(message) between 10 and 10000
);
commit;
