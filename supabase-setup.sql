-- =====================================================================
--  OUR WORLD  –  Supabase setup   (run ONCE)
--  Supabase dashboard  ->  SQL Editor  ->  New query  ->  paste  ->  Run
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1) FRIEND CONNECTION  (why you two could message but not become friends)
-- ---------------------------------------------------------------------
alter table public.friend_requests
  add column if not exists receiver_id uuid references auth.users(id) on delete cascade;

-- old requests were saved WITHOUT a receiver, so nobody could ever see/accept them
delete from public.friend_requests where receiver_id is null;

alter table public.friend_requests enable row level security;

drop policy if exists "fr_select" on public.friend_requests;
drop policy if exists "fr_insert" on public.friend_requests;
drop policy if exists "fr_update" on public.friend_requests;
drop policy if exists "fr_delete" on public.friend_requests;

create policy "fr_select" on public.friend_requests for select to authenticated
  using (auth.uid() = sender_id or auth.uid() = receiver_id);
create policy "fr_insert" on public.friend_requests for insert to authenticated
  with check (auth.uid() = sender_id);
create policy "fr_update" on public.friend_requests for update to authenticated
  using (auth.uid() = receiver_id) with check (auth.uid() = receiver_id);
create policy "fr_delete" on public.friend_requests for delete to authenticated
  using (auth.uid() = sender_id or auth.uid() = receiver_id);


-- ---------------------------------------------------------------------
-- 2) PROFILES  (each of you must be able to READ the other one's profile)
-- ---------------------------------------------------------------------
alter table public.profiles enable row level security;

drop policy if exists "profiles_read_all"   on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;

create policy "profiles_read_all"   on public.profiles for select to authenticated using (true);
create policy "profiles_insert_own" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update to authenticated
  using (auth.uid() = id) with check (auth.uid() = id);


-- ---------------------------------------------------------------------
-- 3) MESSAGE REACTIONS  (the ☺ button under every message)
-- ---------------------------------------------------------------------
create table if not exists public.message_reactions (
  id         bigint generated always as identity primary key,
  message_id text not null,
  user_id    uuid not null default auth.uid() references auth.users(id) on delete cascade,
  emoji      text not null,
  created_at timestamptz not null default now(),
  unique (message_id, user_id)
);

alter table public.message_reactions enable row level security;

drop policy if exists "react_select" on public.message_reactions;
drop policy if exists "react_insert" on public.message_reactions;
drop policy if exists "react_update" on public.message_reactions;
drop policy if exists "react_delete" on public.message_reactions;

create policy "react_select" on public.message_reactions for select to authenticated using (true);
create policy "react_insert" on public.message_reactions for insert to authenticated with check (auth.uid() = user_id);
create policy "react_update" on public.message_reactions for update to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "react_delete" on public.message_reactions for delete to authenticated using (auth.uid() = user_id);


-- ---------------------------------------------------------------------
-- CHECKS (run separately if you want to look around)
--   select id, name from public.profiles;        -- must be EXACTLY 2 rows (you + him)
--   select * from public.friend_requests;        -- after sending: sender_id AND receiver_id filled
-- ---------------------------------------------------------------------
