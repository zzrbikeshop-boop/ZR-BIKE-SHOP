-- Run in Supabase > SQL Editor
create table products (
  id uuid primary key default gen_random_uuid(),
  name_ar text not null, name_en text,
  price numeric not null,
  old_price numeric,            -- if set (> price) the product appears in "Sale"
  image_url text, images text[], description text, in_stock boolean default true, category text,
  is_new boolean default true,
  created_at timestamptz default now()
);
create table orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null, phone text not null,
  wilaya text not null, commune text, address text,
  delivery_type text default 'home', delivery_fee numeric default 0,
  items jsonb not null, total numeric not null,
  status text not null default 'new'
    check (status in ('new','confirmed','shipped','delivered','cancelled')),
  created_at timestamptz default now()
);
create table reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null, text_ar text not null, text_en text,
  rating int default 5, created_at timestamptz default now()
);
alter table products enable row level security;
alter table orders enable row level security;
alter table reviews enable row level security;

create policy "public read products" on products for select using (true);
create policy "public read reviews"  on reviews  for select using (true);
create policy "anyone can order"     on orders   for insert with check (true);
create policy "owner products" on products for all to authenticated using (true) with check (true);
create policy "owner reviews"  on reviews  for all to authenticated using (true) with check (true);
create policy "owner read orders"   on orders for select to authenticated using (true);
create policy "owner update orders" on orders for update to authenticated using (true);

insert into storage.buckets (id, name, public) values ('products','products',true);
create policy "public read images" on storage.objects for select using (bucket_id='products');
create policy "owner upload images" on storage.objects for insert to authenticated with check (bucket_id='products');

insert into reviews (name,text_ar,text_en) values
('Karim','وصلتني القطع في 3 أيام إلى وهران، جودة ممتازة.','Parts reached Oran in 3 days, great quality.'),
('Amina','سلسلة وفرامل بسعر معقول وخدمة محترمة.','Chain and brakes at a fair price, respectful service.'),
('Yacine','التوصيل لولايتي كان سريع والدفع عند الاستلام.','Fast delivery to my wilaya, pay on delivery.');

create policy "owner delete orders" on orders for delete to authenticated using (true);
