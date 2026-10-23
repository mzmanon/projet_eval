-- ==============================================================================
-- LA CAVE — Haute Champagne Database Schema & Row-Level Security (RLS)
-- Target: Supabase Postgres
-- ==============================================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. ENUMS
do $$ begin
  create type public.user_role as enum ('customer', 'sommelier', 'admin');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.order_status as enum ('pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled');
exception
  when duplicate_object then null;
end $$;

-- 3. PROFILES TABLE (linked to auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  phone text,
  role public.user_role default 'customer'::public.user_role not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Profiles Policies
create policy "Users can view their own profile or admins can view all"
  on public.profiles
  for select
  using (
    auth.uid() = id or 
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create policy "Users can update their own profile"
  on public.profiles
  for update
  using (auth.uid() = id);

-- 4. CHAMPAGNES (Catalog)
create table if not exists public.champagnes (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  name text not null,
  house text not null,
  vintage text default 'Non Millésimé' not null,
  dosage text default 'Brut' not null,
  format text default 'Bouteille (75cl)' not null,
  price numeric(10, 2) not null check (price >= 0),
  stock integer default 0 not null check (stock >= 0),
  alcohol_by_volume text default '12.0% vol.' not null,
  terroir text not null,
  grapes text not null,
  cellar_aging text not null,
  description text not null,
  tasting_notes jsonb not null default '{}'::jsonb,
  image_url text not null,
  is_featured boolean default false not null,
  is_rare boolean default false not null,
  score integer check (score between 50 and 100),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on champagnes
alter table public.champagnes enable row level security;

-- Champagnes Policies
create policy "Catalog is publicly readable by anyone"
  on public.champagnes
  for select
  using (true);

create policy "Only administrators can insert or update champagnes"
  on public.champagnes
  for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- 5. ORDERS TABLE
create table if not exists public.orders (
  id text primary key, -- e.g. LC-2026-849201
  user_id uuid references public.profiles(id) on delete set null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  shipping_address jsonb not null,
  total_amount numeric(10, 2) not null check (total_amount >= 0),
  status public.order_status default 'pending'::public.order_status not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on orders
alter table public.orders enable row level security;

-- Orders Policies
create policy "Users can view their own orders or admins can view all"
  on public.orders
  for select
  using (
    auth.uid() = user_id or
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create policy "Authenticated users can create orders"
  on public.orders
  for insert
  with check (
    auth.uid() = user_id or user_id is null
  );

create policy "Only admins can update order status"
  on public.orders
  for update
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- 6. ORDER ITEMS TABLE
create table if not exists public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id text references public.orders(id) on delete cascade not null,
  champagne_id uuid references public.champagnes(id) on delete set null,
  name text not null,
  house text not null,
  vintage text not null,
  unit_price numeric(10, 2) not null,
  quantity integer not null check (quantity > 0),
  image_url text not null
);

-- Enable RLS on order items
alter table public.order_items enable row level security;

create policy "Users can view items of their own orders"
  on public.order_items
  for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id and (
        orders.user_id = auth.uid() or
        exists (
          select 1 from public.profiles
          where profiles.id = auth.uid() and profiles.role = 'admin'
        )
      )
    )
  );
