create extension if not exists "pgcrypto";

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', auth.jwt() -> 'user_metadata' ->> 'role') = 'admin';
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text,
  last_name text,
  full_name text,
  phone text,
  address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  price numeric(12, 2) not null check (price >= 0),
  original_price numeric(12, 2) check (original_price is null or original_price >= 0),
  category text not null,
  images text[] not null default '{}',
  sizes text[] not null default '{}',
  colors text[] not null default '{}',
  stock integer not null default 0 check (stock >= 0),
  rating numeric(3, 2) not null default 0 check (rating >= 0 and rating <= 5),
  reviews jsonb not null default '[]'::jsonb,
  is_new boolean not null default true,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text,
  price numeric(12, 2) not null check (price >= 0),
  quantity integer not null default 1 check (quantity > 0),
  size text,
  color text,
  image text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists cart_items_unique_variant
on public.cart_items (cart_id, product_id, coalesce(size, ''), coalesce(color, ''));

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default ('DIV-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10))),
  user_id uuid not null references auth.users(id) on delete cascade,
  subtotal numeric(12, 2) not null check (subtotal >= 0),
  tax numeric(12, 2) not null default 0 check (tax >= 0),
  shipping numeric(12, 2) not null default 0 check (shipping >= 0),
  total numeric(12, 2) not null check (total >= 0),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  shipping_address jsonb not null default '{}'::jsonb,
  payment_method text,
  payment_status text not null default 'pending' check (payment_status in ('pending', 'completed', 'failed')),
  tracking_number text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  price numeric(12, 2) not null check (price >= 0),
  quantity integer not null default 1 check (quantity > 0),
  size text,
  color text,
  image text,
  created_at timestamptz not null default now()
);

create table if not exists public.payment_confirmations (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null,
  phone text not null,
  email text not null,
  transaction_reference text not null unique,
  screenshot_url text not null,
  amount numeric(12, 2) not null check (amount >= 0),
  status text not null default 'pending' check (status in ('pending', 'verified', 'rejected')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists set_carts_updated_at on public.carts;
create trigger set_carts_updated_at
before update on public.carts
for each row execute function public.set_updated_at();

drop trigger if exists set_cart_items_updated_at on public.cart_items;
create trigger set_cart_items_updated_at
before update on public.cart_items
for each row execute function public.set_updated_at();

drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

drop trigger if exists set_payment_confirmations_updated_at on public.payment_confirmations;
create trigger set_payment_confirmations_updated_at
before update on public.payment_confirmations
for each row execute function public.set_updated_at();

create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, first_name, last_name, full_name)
  values (
    new.id,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    coalesce(new.raw_user_meta_data ->> 'full_name', trim(concat(new.raw_user_meta_data ->> 'first_name', ' ', new.raw_user_meta_data ->> 'last_name')))
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.create_profile_for_new_user();

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payment_confirmations enable row level security;

drop policy if exists "Profiles are readable by owner or admin" on public.profiles;
create policy "Profiles are readable by owner or admin"
on public.profiles for select
using (id = auth.uid() or public.is_admin());

drop policy if exists "Profiles are editable by owner or admin" on public.profiles;
create policy "Profiles are editable by owner or admin"
on public.profiles for update
using (id = auth.uid() or public.is_admin())
with check (id = auth.uid() or public.is_admin());

drop policy if exists "Profiles can be inserted by owner or admin" on public.profiles;
create policy "Profiles can be inserted by owner or admin"
on public.profiles for insert
with check (id = auth.uid() or public.is_admin());

drop policy if exists "Products are publicly readable" on public.products;
create policy "Products are publicly readable"
on public.products for select
using (is_active = true or public.is_admin());

drop policy if exists "Admins can manage products" on public.products;
create policy "Admins can manage products"
on public.products for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Users can read their cart" on public.carts;
create policy "Users can read their cart"
on public.carts for select
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "Users can create their cart" on public.carts;
create policy "Users can create their cart"
on public.carts for insert
with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "Users can update their cart" on public.carts;
create policy "Users can update their cart"
on public.carts for update
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "Users can delete their cart" on public.carts;
create policy "Users can delete their cart"
on public.carts for delete
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "Users can read their cart items" on public.cart_items;
create policy "Users can read their cart items"
on public.cart_items for select
using (
  public.is_admin()
  or exists (select 1 from public.carts where carts.id = cart_items.cart_id and carts.user_id = auth.uid())
);

drop policy if exists "Users can manage their cart items" on public.cart_items;
create policy "Users can manage their cart items"
on public.cart_items for all
using (
  public.is_admin()
  or exists (select 1 from public.carts where carts.id = cart_items.cart_id and carts.user_id = auth.uid())
)
with check (
  public.is_admin()
  or exists (select 1 from public.carts where carts.id = cart_items.cart_id and carts.user_id = auth.uid())
);

drop policy if exists "Users can read their orders" on public.orders;
create policy "Users can read their orders"
on public.orders for select
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "Users can create their orders" on public.orders;
create policy "Users can create their orders"
on public.orders for insert
with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "Admins can update orders" on public.orders;
create policy "Admins can update orders"
on public.orders for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Users can read their order items" on public.order_items;
create policy "Users can read their order items"
on public.order_items for select
using (
  public.is_admin()
  or exists (select 1 from public.orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
);

drop policy if exists "Users can create their order items" on public.order_items;
create policy "Users can create their order items"
on public.order_items for insert
with check (
  public.is_admin()
  or exists (select 1 from public.orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
);

drop policy if exists "Users can read their payment confirmations" on public.payment_confirmations;
create policy "Users can read their payment confirmations"
on public.payment_confirmations for select
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "Users can create payment confirmations" on public.payment_confirmations;
create policy "Users can create payment confirmations"
on public.payment_confirmations for insert
with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "Admins can update payment confirmations" on public.payment_confirmations;
create policy "Admins can update payment confirmations"
on public.payment_confirmations for update
using (public.is_admin())
with check (public.is_admin());

create index if not exists products_category_idx on public.products (category);
create index if not exists products_featured_idx on public.products (is_featured);
create index if not exists orders_user_created_idx on public.orders (user_id, created_at desc);
create index if not exists payment_confirmations_user_idx on public.payment_confirmations (user_id);
