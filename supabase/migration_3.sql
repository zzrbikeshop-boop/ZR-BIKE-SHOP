-- Run once in Supabase > SQL Editor (after migration_2.sql)
alter table products add column if not exists description text;
alter table orders add column if not exists commune text;
alter table orders add column if not exists delivery_type text default 'home';
alter table orders add column if not exists delivery_fee numeric default 0;
