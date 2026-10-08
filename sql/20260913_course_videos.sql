-- Collega i video reali disponibili in Google Drive.
-- Ripetibile: gli update sono naturalmente idempotenti e le ricostruzioni
-- cancellano e ricreano le lezioni dei corsi indicati.
begin;

-- Max/MSP: collega i 12 video reali alle lezioni esistenti.
update public.dropdown_lessons set video_id='https://drive.google.com/file/d/1nR1rnI7lT9VUKt3lhk6Vsp2yTogVqje2/view',resources='[{"title":"Dispense Lezione 1","url":"https://drive.google.com/file/d/1QgG2cqheEJsn_FTaehmmmuSOFgUyu_0l/view"}]'::jsonb where id='11eaf956-ded7-4091-93b6-094c4d152528';
update public.dropdown_lessons set video_id='https://drive.google.com/file/d/1lP5K4ATstFFTCDA5CiOJQ1zQtYo6n0wN/view',resources='[
  {"title":"Dispense Lezione 2","url":"https://drive.google.com/file/d/13hn997pApB8VgLSgo18tW8tg1vBLxgMG/view"},
  {"title":"Patch - Generazione randomica","url":"https://drive.google.com/file/d/1UQlVfL8yZxuSH3wuiuMu1R63m7nk6QI_/view"},
  {"title":"Patch - Mixer 4 canali","url":"https://drive.google.com/file/d/1zL01ZGoYfJTcrYWtYmHBVNknspn6aIWb/view"},
  {"title":"Patch - Pan","url":"https://drive.google.com/file/d/1PCV8jTmwktaHjX3cD7KTM6SemsyVt4CP/view"}
]'::jsonb where id='a65923e6-03c2-4196-8e36-c0c60c20a26b';
update public.dropdown_lessons set video_id='https://drive.google.com/file/d/1iNcbztJs8956ZthO9xPFa-Zk1gdfgc7H/view',resources='[{"title":"Dispense Lezione 3","url":"https://drive.google.com/file/d/1BUNgbM8QSssLMye2d-hsDolQXr7c2kD1/view"}]'::jsonb where id='5f8aada6-b302-4ad0-9b73-cd31d0fe27f9';
update public.dropdown_lessons set video_id='https://drive.google.com/file/d/1D3gIxE8Dpd-s1yUdYwNTYvy3V6ZXGYwY/view',resources='[{"title":"Dispense Lezione 4","url":"https://drive.google.com/file/d/1ouAIKk4QU2xSk_ND9uxVVDf5cuoE9FL7/view"}]'::jsonb where id='14fc7d18-9a97-4fdb-9a27-41096f4cc3f3';
update public.dropdown_lessons set video_id='https://drive.google.com/file/d/1WCV2LFP4IKy-ibBzfYE-PmmRLSjKPMlw/view',resources='[{"title":"Dispense Lezione 5","url":"https://drive.google.com/file/d/1wGTaJ93eP6rJ7AZEazLZrwFaIey9UQ32/view"}]'::jsonb where id='e675fbfb-d001-48bc-8ee5-62c4aa55bc14';
update public.dropdown_lessons set video_id='https://drive.google.com/file/d/1pC1TRO1Bq3bhVmEmoXlRjdzPEleh7hLH/view',resources='[
  {"title":"Dispense Lezione 6","url":"https://drive.google.com/file/d/1CXTQ5pC1Q_5JI1MVhqBPCbdS_1_nLRgV/view"},
  {"title":"Patch - Sintetizzatore","url":"https://drive.google.com/file/d/1-UGp3AxU2mP0_MzyBP9IhwPGgm6OPM6Z/view"},
  {"title":"Patch - Voices","url":"https://drive.google.com/file/d/1X4NHfG3DJ6aLKUsNAqOAxmhZZUuhTimg/view"}
]'::jsonb where id='83dda781-2ac4-43bf-9c91-2434ce3c9264';
update public.dropdown_lessons set video_id='https://drive.google.com/file/d/1i8O3_yN_i8qZyXGBRAm8SIjoi2_PXVsy/view',resources='[{"title":"Dispense Lezione 7","url":"https://drive.google.com/file/d/18CsSAQTHvgJeLHWJrjbK1WnRnpFmMEC9/view"}]'::jsonb where id='0d4f2f39-9e6b-4b8c-8710-39d49405b756';
update public.dropdown_lessons set video_id='https://drive.google.com/file/d/1zEztcuCligdvv1m4bqLen-dWTPYt4_KJ/view',resources='[
  {"title":"Dispense Lezione 8","url":"https://drive.google.com/file/d/1HpvtA8D0C7B7VcIVY2rIN6uqokDJ1TMz/view"},
  {"title":"Patch - Eq 10 Bande","url":"https://drive.google.com/drive/folders/1v3pIGJ-z9yYQ3uQIQ90EcKgtzsf2c2o6"}
]'::jsonb where id='f9cdd7f9-b23d-4f97-993b-61b2de8c1d11';
update public.dropdown_lessons set video_id='https://drive.google.com/file/d/1h8ytSO1957WgeCHvTVJsNi8Ry4gg5nw1/view',resources='[{"title":"Dispense Lezione 9","url":"https://drive.google.com/file/d/19xHcNr2jfDQ35ol-SEAixiU05KXUurmg/view"}]'::jsonb where id='64318105-8584-4084-8643-d286913b3550';
update public.dropdown_lessons set video_id='https://drive.google.com/file/d/1IYlXWHkJCUpU4hVaZu36pewXe30BtJaL/view',resources='[
  {"title":"Dispense Lezione 10","url":"https://drive.google.com/file/d/1hd7LAXmaBjDjEum0v5dCIK1Y6EQMnmv1/view"},
  {"title":"Patch - Effetti e delay multibanda","url":"https://drive.google.com/drive/folders/1sC7NA3MMNznLj7681lydRzgg_aKu9Xmk"}
]'::jsonb where id='72ede6fb-6041-4fce-86e0-c722da29f486';
update public.dropdown_lessons set video_id='https://drive.google.com/file/d/1t3uPuUs2krFkyvZfEIQbmir75uMobSCC/view',resources='[{"title":"Dispense Lezione 11","url":"https://drive.google.com/file/d/1wpkDkYFnleLs5VIqPUKCONvGp9Z7u-M6/view"}]'::jsonb where id='2870b1e3-fd3b-4e00-a0d5-46d1cc2d2e5b';
update public.dropdown_lessons set video_id='https://drive.google.com/file/d/1QuKADgvq-KfJqCMOcphLHNOTx2ev0iE-/view',resources='[
  {"title":"Dispense Lezione 12","url":"https://drive.google.com/file/d/1Ci9YY8iRdI-CvpIyADYatSpiHsrwuFJo/view"},
  {"title":"Patch - Compressore completo","url":"https://drive.google.com/drive/folders/1HbdawmAB2fOBNMn96ILKkELjF1bNYWXq"}
]'::jsonb where id='84654943-6b43-4080-8d64-052d0ba67abd';

-- VCV Rack (Synth Modulare Completo): sostituisce il programma dimostrativo
-- con le 9 lezioni reali disponibili in Drive.
delete from public.dropdown_user_progress where lesson_id in (
  select l.id from public.dropdown_lessons l
  join public.dropdown_course_modules m on m.id=l.module_id
  join public.dropdown_courses c on c.id=m.course_id
  where c.slug='synth-modulare-completo'
);
delete from public.dropdown_lessons l using public.dropdown_course_modules m, public.dropdown_courses c
  where l.module_id=m.id and m.course_id=c.id and c.slug='synth-modulare-completo';
delete from public.dropdown_course_modules m using public.dropdown_courses c
  where m.course_id=c.id and c.slug='synth-modulare-completo';
insert into public.dropdown_course_modules(course_id,title,order_index)
select c.id,'Lezioni del corso',1 from public.dropdown_courses c where c.slug='synth-modulare-completo';
insert into public.dropdown_lessons(module_id,title,video_id,video_duration,order_index,is_free)
select m.id,v.title,v.video_id,v.duration,v.order_index,v.is_free
from public.dropdown_course_modules m
join public.dropdown_courses c on c.id=m.course_id and c.slug='synth-modulare-completo'
join (values
  ('Lezione 1','https://drive.google.com/file/d/1LRyNVoe1DBJJm2NYOyTUj69S0wNyF1Um/view',60,1,true),
  ('Lezione 2','https://drive.google.com/file/d/16sRNPQ2HDF0tTiwEGQCDUsV0bz3nAU7D/view',60,2,true),
  ('Lezione 3','https://drive.google.com/file/d/1xaeo-d9DaXm7d8rTDZ-S3Gs49YCcVBnN/view',60,3,false),
  ('Lezione 4','https://drive.google.com/file/d/1oPIctDTLuqGdGOHiaTR78KF-Iycx7Rfi/view',60,4,false),
  ('Lezione 5','https://drive.google.com/file/d/1XkyvLo2r5IyRF0WbaEduyZ1xHjhLxO_A/view',60,5,false),
  ('Lezione 6.1','https://drive.google.com/file/d/13-mBY5Tqssgeo8CFBD0yaHWf3p1N_j6b/view',60,6,false),
  ('Lezione 7.1','https://drive.google.com/file/d/1-MWqcWrDNEuLO6ILbFVuwq-K0KFYyGnE/view',60,7,false),
  ('Lezione 8','https://drive.google.com/file/d/1IoFg3CeymXXQXHRBRQe4WucRkgqE71Uz/view',60,8,false),
  ('Lezione 9','https://drive.google.com/file/d/1WQ-3USdwEh7hPxOZmoCEI_2NF6REL2AN/view',60,9,false)
) as v(title,video_id,duration,order_index,is_free) on true;

-- Ableton Live Masterclass: sostituisce il programma dimostrativo
-- con i 12 video reali disponibili in Drive.
delete from public.dropdown_user_progress where lesson_id in (
  select l.id from public.dropdown_lessons l
  join public.dropdown_course_modules m on m.id=l.module_id
  join public.dropdown_courses c on c.id=m.course_id
  where c.slug='ableton-live-masterclass'
);
delete from public.dropdown_lessons l using public.dropdown_course_modules m, public.dropdown_courses c
  where l.module_id=m.id and m.course_id=c.id and c.slug='ableton-live-masterclass';
delete from public.dropdown_course_modules m using public.dropdown_courses c
  where m.course_id=c.id and c.slug='ableton-live-masterclass';
insert into public.dropdown_course_modules(course_id,title,order_index)
select c.id,'Lezioni del corso',1 from public.dropdown_courses c where c.slug='ableton-live-masterclass';
insert into public.dropdown_lessons(module_id,title,video_id,video_duration,order_index,is_free)
select m.id,v.title,v.video_id,v.duration,v.order_index,v.is_free
from public.dropdown_course_modules m
join public.dropdown_courses c on c.id=m.course_id and c.slug='ableton-live-masterclass'
join (values
  ('La modalità Live','https://drive.google.com/file/d/1ge-eMkQ20qP_SDx4H90bDyVoCURVxHAr/view',30,1,true),
  ('Editor Clip e Arrangiamento','https://drive.google.com/file/d/1menLP-kqtocnOE9te6ozhG5S5FoEtEv1/view',30,2,true),
  ('La Toolbar','https://drive.google.com/file/d/1B_WdH8ipcPU4dbmzlKrgdAgbEM8gD8hu/view',30,3,false),
  ('La Registrazione','https://drive.google.com/file/d/150ODVQsg0CNSVplA6lL_j-4OZUrCLHqu/view',30,4,false),
  ('One Synth One Song: Analog','https://drive.google.com/file/d/1uu2Mos7k8iUvnqs-UVY6KAwx8Pl_5rUP/view',30,5,false),
  ('One Synth One Song: Analog - parte 2','https://drive.google.com/file/d/19qDOIfAAJO09JMCFh-q5TtRmFHjHF9o-/view',30,6,false),
  ('La sintesi FM con Operator','https://drive.google.com/file/d/1K2YwufQDGRbD_Z49k1IsUf70aMmNUywd/view',30,7,false),
  ('Mpulse, drum machine','https://drive.google.com/file/d/1ldc0fMur0uixOEkcQmXxdPVgam2kS_ss/view',30,8,false),
  ('Wavetable','https://drive.google.com/file/d/1SumxRGS9pJgy2hwSAEotSuP9D0hSsnCp/view',30,9,false),
  ('Tutti gli effetti analizzati','https://drive.google.com/file/d/1DlZv5JnbnszDohRpNh-X6SDTp53I3eWD/view',30,10,false),
  ('Brano completo con Operator','https://drive.google.com/file/d/1WFPyVximVoKEEYmZrxRqGyBwEL6O9ghC/view',30,11,false),
  ('Melodic Techno con Wavetable','https://drive.google.com/file/d/10TkxTBy2kh6_b-K9Fvfk7GokocGU5XyJ/view',30,12,false)
) as v(title,video_id,duration,order_index,is_free) on true;

commit;
