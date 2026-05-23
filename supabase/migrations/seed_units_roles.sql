insert into public.units (name, code, parent_unit_id)
values
  ('פלוגה', 'company', null)
on conflict (code) do update
set
  name = excluded.name,
  updated_at = now();

insert into public.units (name, code, parent_unit_id)
values
  ('מחלקה 1', 'platoon_1', (select id from public.units where code = 'company')),
  ('מחלקה 2', 'platoon_2', (select id from public.units where code = 'company')),
  ('מחלקה 3', 'platoon_3', (select id from public.units where code = 'company')),
  ('מחלקה 4', 'platoon_4', (select id from public.units where code = 'company')),
  ('לוגיסטיקה', 'logistics', (select id from public.units where code = 'company')),
  ('רפואה', 'medical', (select id from public.units where code = 'company')),
  ('קשר', 'communications', (select id from public.units where code = 'company')),
  ('רכב', 'vehicles', (select id from public.units where code = 'company'))
on conflict (code) do update
set
  name = excluded.name,
  parent_unit_id = excluded.parent_unit_id,
  updated_at = now();

insert into public.roles (name, description, permission_level)
values
  ('מ״פ', 'מפקד פלוגה', 100),
  ('סמ״פ', 'סגן מפקד פלוגה', 90),
  ('ע. מ״פ', 'עוזר מפקד פלוגה', 80),
  ('רס״פ / לוגיסטיקה', 'אחראי לוגיסטיקה פלוגתי', 75),
  ('חובש פלוגתי', 'אחראי רפואה פלוגתי', 70),
  ('קשר פלוגתי', 'אחראי קשר פלוגתי', 70),
  ('ב.קוד / נהג', 'בעל קוד או נהג פלוגתי', 60),
  ('מ״מ 1', 'מפקד מחלקה 1', 70),
  ('מ״מ 2', 'מפקד מחלקה 2', 70),
  ('מ״מ 3', 'מפקד מחלקה 3', 70),
  ('מ״מ 4', 'מפקד מחלקה 4', 70),
  ('סמל 1', 'סמל מחלקה 1', 60),
  ('סמל 2', 'סמל מחלקה 2', 60),
  ('סמל 3', 'סמל מחלקה 3', 60),
  ('סמל 4', 'סמל מחלקה 4', 60),
  ('מ״כ 1א', 'מפקד כיתה 1א', 50),
  ('מ״כ 1ב', 'מפקד כיתה 1ב', 50),
  ('מ״כ 1ג', 'מפקד כיתה 1ג', 50),
  ('מ״כ 1ד', 'מפקד כיתה 1ד', 50),
  ('מ״כ 2א', 'מפקד כיתה 2א', 50),
  ('מ״כ 2ב', 'מפקד כיתה 2ב', 50),
  ('מ״כ 2ג', 'מפקד כיתה 2ג', 50),
  ('מ״כ 2ד', 'מפקד כיתה 2ד', 50),
  ('מ״כ 3א', 'מפקד כיתה 3א', 50),
  ('מ״כ 3ב', 'מפקד כיתה 3ב', 50),
  ('מ״כ 3ג', 'מפקד כיתה 3ג', 50),
  ('מ״כ 3ד', 'מפקד כיתה 3ד', 50),
  ('מ״כ 4א', 'מפקד כיתה 4א', 50),
  ('מ״כ 4ב', 'מפקד כיתה 4ב', 50),
  ('מ״כ 4ג', 'מפקד כיתה 4ג', 50),
  ('מ״כ 4ד', 'מפקד כיתה 4ד', 50)
on conflict (name) do update
set
  description = excluded.description,
  permission_level = excluded.permission_level,
  updated_at = now();