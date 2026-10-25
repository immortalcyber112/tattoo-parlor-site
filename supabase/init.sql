-- Parliament Tattoos: admin user table and row level security.
-- Run once in the Supabase SQL Editor.

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- A signed in user can only read their own admin row.
drop policy if exists "read own admin row" on public.admin_users;
create policy "read own admin row"
  on public.admin_users for select
  to authenticated
  using (auth.uid() = user_id);

-- Nobody can insert, update or delete through the API. Add admins in the SQL editor only.
-- (No insert/update/delete policies are created, so RLS blocks those.)

-- Helper: true when the current user is an admin.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;
