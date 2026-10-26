-- ==============================================================================
-- LA CAVE — Stripe Checkout & historique des commandes
-- Migration compatible avec le schéma Supabase minimal existant :
--
--   public.orders      (id uuid, user_id uuid, total_amount numeric,
--                       status text, created_at timestamptz)
--   public.order_items (id uuid, order_id uuid, product_id uuid,
--                       product_name text, unit_price numeric, quantity int)
--
-- Toutes les colonnes dont l'application a besoin sont ajoutées si elles
-- manquent. La migration ne référence jamais une colonne avant de l'avoir
-- créée (d'où l'absence de `customer_email` dans un index tant que la colonne
-- n'existe pas). Elle ne touche ni à `profiles` ni à `champagnes`.
--
-- Idempotente : peut être rejouée sans erreur.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. COLONNES MANQUANTES SUR public.orders
-- ------------------------------------------------------------------------------
alter table public.orders
  add column if not exists customer_name text,
  add column if not exists customer_email text,
  add column if not exists customer_phone text,
  add column if not exists shipping_address jsonb,
  add column if not exists special_instructions text,
  add column if not exists subtotal_amount numeric(10, 2) not null default 0,
  add column if not exists shipping_amount numeric(10, 2) not null default 0,
  add column if not exists currency text not null default 'eur',
  add column if not exists payment_status text not null default 'unpaid',
  add column if not exists stripe_session_id text,
  add column if not exists stripe_payment_intent_id text,
  add column if not exists paid_at timestamp with time zone,
  add column if not exists updated_at timestamp with time zone not null default now(),
  add column if not exists order_number text;

-- `created_at` doit pouvoir être omis par les inserts (valeur par défaut).
alter table public.orders
  alter column created_at set default now();

-- Les commandes invité ont user_id = null : la colonne doit être nullable.
-- On retire aussi les éventuelles contraintes NOT NULL héritées sur des
-- colonnes que l'API ne renseigne pas.
do $$
declare
  col record;
begin
  for col in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'orders'
      and is_nullable = 'NO'
      and column_name not in (
        'id',
        'total_amount',
        'status',
        'created_at',
        'payment_status',
        'currency',
        'subtotal_amount',
        'shipping_amount',
        'updated_at'
      )
  loop
    execute format(
      'alter table public.orders alter column %I drop not null',
      col.column_name
    );
  end loop;
end $$;

-- `orders.user_id` doit référencer les comptes d'authentification (et non une
-- table `profiles` dont la structure n'est pas garantie). On remplace toute
-- clé étrangère existante sur user_id.
do $$
declare
  fk record;
begin
  for fk in
    select con.conname
    from pg_constraint con
    join pg_class rel on rel.oid = con.conrelid
    join pg_namespace nsp on nsp.oid = rel.relnamespace
    where nsp.nspname = 'public'
      and rel.relname = 'orders'
      and con.contype = 'f'
      and exists (
        select 1
        from pg_attribute att
        where att.attrelid = rel.oid
          and att.attname = 'user_id'
          and att.attnum = any (con.conkey)
      )
  loop
    execute format('alter table public.orders drop constraint %I', fk.conname);
  end loop;

  alter table public.orders
    add constraint orders_user_id_fkey
    foreign key (user_id) references auth.users (id) on delete set null;
end $$;

-- ------------------------------------------------------------------------------
-- 2. STATUTS
-- ------------------------------------------------------------------------------
-- Remplace d'éventuelles contraintes CHECK existantes sur le statut.
do $$
declare
  chk record;
begin
  for chk in
    select con.conname
    from pg_constraint con
    join pg_class rel on rel.oid = con.conrelid
    join pg_namespace nsp on nsp.oid = rel.relnamespace
    where nsp.nspname = 'public'
      and rel.relname = 'orders'
      and con.contype = 'c'
      and pg_get_constraintdef(con.oid) ilike '%status%'
  loop
    execute format('alter table public.orders drop constraint %I', chk.conname);
  end loop;
end $$;

alter table public.orders
  drop constraint if exists orders_status_check;
alter table public.orders
  add constraint orders_status_check
  check (
    status in ('pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled')
  );

alter table public.orders
  drop constraint if exists orders_payment_status_check;
alter table public.orders
  add constraint orders_payment_status_check
  check (
    payment_status in ('unpaid', 'processing', 'paid', 'failed', 'refunded')
  );

-- ------------------------------------------------------------------------------
-- 3. INDEX SUR public.orders
-- ------------------------------------------------------------------------------
create unique index if not exists orders_stripe_session_id_key
  on public.orders (stripe_session_id)
  where stripe_session_id is not null;

create unique index if not exists orders_order_number_key
  on public.orders (order_number)
  where order_number is not null;

create index if not exists orders_user_id_idx on public.orders (user_id);
create index if not exists orders_customer_email_idx
  on public.orders (lower(customer_email));
create index if not exists orders_created_at_idx
  on public.orders (created_at desc);

-- ------------------------------------------------------------------------------
-- 4. COLONNES MANQUANTES SUR public.order_items
-- ------------------------------------------------------------------------------
alter table public.order_items
  add column if not exists champagne_id uuid,
  add column if not exists champagne_slug text,
  add column if not exists name text,
  add column if not exists house text,
  add column if not exists vintage text,
  add column if not exists image_url text;

-- L'application ne renseigne pas `id` : il doit être généré.
alter table public.order_items
  alter column id set default gen_random_uuid();

-- Les anciennes colonnes produit (product_id/product_name) ne sont plus
-- renseignées par l'API : on lève leurs éventuelles contraintes NOT NULL.
do $$
declare
  col record;
begin
  for col in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'order_items'
      and is_nullable = 'NO'
      and column_name not in ('id', 'order_id', 'unit_price', 'quantity')
  loop
    execute format(
      'alter table public.order_items alter column %I drop not null',
      col.column_name
    );
  end loop;
end $$;

-- Reprise éventuelle des lignes historiques.
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'order_items'
      and column_name = 'product_name'
  ) then
    execute 'update public.order_items
             set name = coalesce(name, product_name)
             where name is null';
  end if;
end $$;

create index if not exists order_items_order_id_idx
  on public.order_items (order_id);

-- Clé étrangère order_items.order_id -> orders.id (ajoutée seulement si absente).
do $$
begin
  if not exists (
    select 1
    from pg_constraint con
    join pg_class rel on rel.oid = con.conrelid
    join pg_namespace nsp on nsp.oid = rel.relnamespace
    where nsp.nspname = 'public'
      and rel.relname = 'order_items'
      and con.contype = 'f'
      and exists (
        select 1
        from pg_attribute att
        where att.attrelid = rel.oid
          and att.attname = 'order_id'
          and att.attnum = any (con.conkey)
      )
  ) then
    alter table public.order_items
      add constraint order_items_order_id_fkey
      foreign key (order_id) references public.orders (id) on delete cascade;
  end if;
end $$;

-- ------------------------------------------------------------------------------
-- 5. HORODATAGE DE MISE À JOUR DES COMMANDES
-- ------------------------------------------------------------------------------
create or replace function public.touch_orders_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at
  before update on public.orders
  for each row
  execute function public.touch_orders_updated_at();

-- ------------------------------------------------------------------------------
-- 6. ROW LEVEL SECURITY
-- ------------------------------------------------------------------------------
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- On repart de politiques connues pour garantir l'isolation par utilisateur.
do $$
declare
  pol record;
begin
  for pol in
    select policyname, tablename
    from pg_policies
    where schemaname = 'public'
      and tablename in ('orders', 'order_items')
  loop
    execute format(
      'drop policy if exists %I on public.%I',
      pol.policyname,
      pol.tablename
    );
  end loop;
end $$;

create policy "Users can view their own orders"
  on public.orders
  for select
  to authenticated
  using (
    auth.uid() = user_id
    or (
      user_id is null
      and coalesce(auth.jwt() ->> 'email', '') <> ''
      and lower(customer_email) = lower(auth.jwt() ->> 'email')
    )
  );

create policy "Users can view items of their own orders"
  on public.order_items
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.orders
      where orders.id = order_items.order_id
        and (
          orders.user_id = auth.uid()
          or (
            orders.user_id is null
            and coalesce(auth.jwt() ->> 'email', '') <> ''
            and lower(orders.customer_email) = lower(auth.jwt() ->> 'email')
          )
        )
    )
  );

-- Lecture seule côté client. Les écritures passent par le service_role,
-- qui contourne RLS, dans les Route Handlers.
grant select on public.orders to authenticated;
grant select on public.order_items to authenticated;

-- ------------------------------------------------------------------------------
-- 7. COMMENTAIRES
-- ------------------------------------------------------------------------------
comment on column public.orders.order_number is
  'Référence lisible de la commande (LC-AAAA-XXXXXX).';
comment on column public.orders.payment_status is
  'Statut du paiement Stripe : unpaid, processing, paid, failed, refunded.';
comment on column public.orders.stripe_session_id is
  'Identifiant de la Checkout Session Stripe (cs_...).';
comment on column public.order_items.champagne_slug is
  'Slug du catalogue au moment de la commande.';
