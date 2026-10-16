-- Run once in Supabase > SQL Editor: lets the owner delete orders
create policy "owner delete orders" on orders for delete to authenticated using (true);
