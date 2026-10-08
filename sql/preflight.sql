-- Read-only checks before migration. Never delete payment records automatically.
select paypal_order_id,count(*) from public.dropdown_purchases
where paypal_order_id is not null group by paypal_order_id having count(*)>1;
select c.slug,count(l.id) as lessons,count(nullif(trim(l.video_id),'')) as videos
from public.dropdown_courses c left join public.dropdown_course_modules m on m.course_id=c.id
left join public.dropdown_lessons l on l.module_id=m.id group by c.slug order by c.slug;
