---
name: supabase-rls-security
description: >-
  Guides the implementation, auditing, and verification of Supabase SSR clients, database schemas,
  and Row-Level Security (RLS) policies for user profiles, orders, and administrative dashboard access.
  Use whenever setting up database migrations, authentication guards, or querying protected customer data.
---

# Supabase Integration & Row-Level Security (RLS)

This skill provides guidelines and patterns for integrating Supabase into **LA CAVE** with Next.js 16 App Router, ensuring data protection and zero privilege escalation.

## 1. Schema Architecture & Relations

```sql
-- 1. Profiles (linked to auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  role text default 'customer' check (role in ('customer', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Champagnes (Catalog)
create table public.champagnes (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  name text not null,
  house text not null,
  vintage text,
  dosage text,
  terroir text,
  price numeric(10, 2) not null,
  stock integer default 0 not null,
  image_url text not null,
  description text,
  tasting_notes jsonb,
  is_featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Orders
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete set null,
  customer_email text not null,
  customer_name text not null,
  shipping_address jsonb not null,
  total_amount numeric(10, 2) not null,
  status text default 'pending' check (status in ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Order Items
create table public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  champagne_id uuid references public.champagnes(id) on delete set null,
  name text not null,
  quantity integer not null,
  unit_price numeric(10, 2) not null
);
```

## 2. Row-Level Security (RLS) Policies

All tables MUST have `alter table <name> enable row level security;`.

- **Champagnes Table**:
  - `SELECT`: Publicly accessible (`true`).
  - `INSERT / UPDATE / DELETE`: Only authenticated users with `role = 'admin'` in `profiles`.
- **Profiles Table**:
  - `SELECT`: Users can read their own profile (`auth.uid() = id`), or admins can read all.
  - `UPDATE`: Users can update only their own profile.
- **Orders Table**:
  - `SELECT`: Users can see only their own orders (`auth.uid() = user_id`), or admins can see all.
  - `INSERT`: Authenticated users or checkout service role can insert orders.
  - `UPDATE`: Only admins can update order status (e.g. from `pending` to `shipped`).
- **Order Items Table**:
  - `SELECT`: Users can see items belonging to their orders (`order_id in (select id from public.orders where user_id = auth.uid())`), or admins can see all.

## 3. SSR Client Configuration for Next.js 16

Utilize `@supabase/ssr` with cookie storage handlers:
- Browser Client (`createBrowserClient`) for client-side interactions.
- Server Client (`createServerClient`) with `cookies` from `next/headers` for Server Components and Route Handlers.

## 4. Evaluation Demonstration

To demonstrate this skill during evaluation:
- Run: `« Vérifie les règles RLS et la sécurité Supabase avec supabase-rls-security »`
- The agent verifies that customer queries are locked by `auth.uid()` and that unauthorized requests to admin endpoints fail.
