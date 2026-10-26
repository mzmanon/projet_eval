create table if not exists public.product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  author text not null check (char_length(trim(author)) between 1 and 40),
  rating smallint not null check (rating between 1 and 5),
  title text check (title is null or char_length(title) <= 80),
  message text not null check (char_length(trim(message)) between 1 and 600),
  verified boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  unique (product_id, user_id)
);

create index if not exists product_reviews_product_created_idx
  on public.product_reviews (product_id, created_at desc);

alter table public.product_reviews enable row level security;

drop policy if exists "Anyone can read product reviews" on public.product_reviews;
create policy "Anyone can read product reviews"
  on public.product_reviews for select
  using (true);

drop policy if exists "Customers can create their own product reviews" on public.product_reviews;
create policy "Customers can create their own product reviews"
  on public.product_reviews for insert to authenticated
  with check (auth.uid() = user_id and verified = false);

drop policy if exists "Customers can edit their own product reviews" on public.product_reviews;
create policy "Customers can edit their own product reviews"
  on public.product_reviews for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id and verified = false);

drop policy if exists "Customers can remove their own product reviews" on public.product_reviews;
create policy "Customers can remove their own product reviews"
  on public.product_reviews for delete to authenticated
  using (auth.uid() = user_id);

create table if not exists public.product_review_replies (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references public.product_reviews(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  author text not null check (char_length(trim(author)) between 1 and 40),
  message text not null check (char_length(trim(message)) between 1 and 600),
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists product_review_replies_review_created_idx
  on public.product_review_replies (review_id, created_at asc);

alter table public.product_review_replies enable row level security;

grant select on public.product_reviews, public.product_review_replies to anon, authenticated;
grant insert, update, delete on public.product_reviews to authenticated;
grant insert, delete on public.product_review_replies to authenticated;

drop policy if exists "Anyone can read product review replies" on public.product_review_replies;
create policy "Anyone can read product review replies"
  on public.product_review_replies for select
  using (true);

drop policy if exists "Customers can create their own review replies" on public.product_review_replies;
create policy "Customers can create their own review replies"
  on public.product_review_replies for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Customers can remove their own review replies" on public.product_review_replies;
create policy "Customers can remove their own review replies"
  on public.product_review_replies for delete to authenticated
  using (auth.uid() = user_id);
