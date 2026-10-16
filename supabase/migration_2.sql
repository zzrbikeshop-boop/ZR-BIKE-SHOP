-- Run once if you already ran schema.sql
alter table products add column if not exists images text[];
alter table products add column if not exists in_stock boolean default true;
