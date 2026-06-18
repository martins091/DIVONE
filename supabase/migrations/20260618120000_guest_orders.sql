create extension if not exists "pgcrypto";

alter table public.orders
  alter column user_id drop not null;

alter table public.orders
  drop constraint if exists orders_user_id_fkey;

alter table public.orders
  add constraint orders_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete set null;

alter table public.orders
  add column if not exists guest_access_token text not null default encode(gen_random_bytes(24), 'hex');

create unique index if not exists orders_guest_access_token_idx
on public.orders (guest_access_token);

drop policy if exists "Users can create their orders" on public.orders;
create policy "Users can create their orders"
on public.orders for insert
with check (user_id = auth.uid() or user_id is null or public.is_admin());

drop policy if exists "Users can create their order items" on public.order_items;
create policy "Users can create their order items"
on public.order_items for insert
with check (
  public.is_admin()
  or exists (
    select 1
    from public.orders
    where orders.id = order_items.order_id
      and (orders.user_id = auth.uid() or orders.user_id is null)
  )
);

create or replace function public.get_order_for_tracking(
  p_order_id uuid,
  p_guest_access_token text default null
)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'id', o.id,
    'order_number', o.order_number,
    'user_id', o.user_id,
    'guest_access_token', o.guest_access_token,
    'subtotal', o.subtotal,
    'tax', o.tax,
    'shipping', o.shipping,
    'total', o.total,
    'status', o.status,
    'shipping_address', o.shipping_address,
    'payment_method', o.payment_method,
    'payment_status', o.payment_status,
    'tracking_number', o.tracking_number,
    'notes', o.notes,
    'created_at', o.created_at,
    'order_items', coalesce(
      (
        select jsonb_agg(to_jsonb(oi) order by oi.created_at)
        from public.order_items oi
        where oi.order_id = o.id
      ),
      '[]'::jsonb
    )
  )
  from public.orders o
  where o.id = p_order_id
    and (
      public.is_admin()
      or o.user_id = auth.uid()
      or o.guest_access_token = p_guest_access_token
    );
$$;

create or replace function public.confirm_order_payment(
  p_order_id uuid,
  p_guest_access_token text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_order public.orders;
begin
  update public.orders
  set
    status = 'pending',
    payment_status = 'pending',
    updated_at = now()
  where id = p_order_id
    and (
      public.is_admin()
      or user_id = auth.uid()
      or guest_access_token = p_guest_access_token
    )
  returning * into updated_order;

  if updated_order.id is null then
    return null;
  end if;

  return public.get_order_for_tracking(p_order_id, p_guest_access_token);
end;
$$;

grant execute on function public.get_order_for_tracking(uuid, text) to anon, authenticated;
grant execute on function public.confirm_order_payment(uuid, text) to anon, authenticated;

create or replace function public.create_guest_order(
  p_subtotal numeric,
  p_tax numeric,
  p_shipping numeric,
  p_total numeric,
  p_shipping_address jsonb,
  p_payment_method text,
  p_items jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  new_order public.orders;
begin
  insert into public.orders (
    user_id,
    subtotal,
    tax,
    shipping,
    total,
    shipping_address,
    payment_method,
    payment_status,
    status
  )
  values (
    null,
    p_subtotal,
    p_tax,
    p_shipping,
    p_total,
    coalesce(p_shipping_address, '{}'::jsonb),
    coalesce(p_payment_method, 'bank_transfer'),
    'pending',
    'pending'
  )
  returning * into new_order;

  insert into public.order_items (
    order_id,
    product_id,
    product_name,
    price,
    quantity,
    size,
    color,
    image
  )
  select
    new_order.id,
    case
      when item->>'productId' ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
      then (item->>'productId')::uuid
      else null
    end,
    coalesce(item->>'productName', item->>'name', 'Product'),
    coalesce((item->>'price')::numeric, 0),
    coalesce((item->>'quantity')::integer, 1),
    nullif(item->>'size', ''),
    nullif(item->>'color', ''),
    nullif(item->>'image', '')
  from jsonb_array_elements(coalesce(p_items, '[]'::jsonb)) as item;

  return public.get_order_for_tracking(new_order.id, new_order.guest_access_token);
end;
$$;

grant execute on function public.create_guest_order(numeric, numeric, numeric, numeric, jsonb, text, jsonb) to anon, authenticated;

create or replace function public.lookup_order_for_tracking(
  p_order_reference text,
  p_contact text
)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select public.get_order_for_tracking(o.id, o.guest_access_token)
  from public.orders o
  where (
      o.order_number = trim(p_order_reference)
      or o.id::text = trim(p_order_reference)
    )
    and (
      lower(coalesce(o.shipping_address->>'email', '')) = lower(trim(p_contact))
      or regexp_replace(coalesce(o.shipping_address->>'phone', ''), '\D', '', 'g') =
        regexp_replace(trim(p_contact), '\D', '', 'g')
    )
  limit 1;
$$;

grant execute on function public.lookup_order_for_tracking(text, text) to anon, authenticated;

notify pgrst, 'reload schema';
