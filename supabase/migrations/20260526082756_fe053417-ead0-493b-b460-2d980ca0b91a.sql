
create or replace function public.is_owner()
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select coalesce(auth.jwt() ->> 'email', '') = 'thechilupe@gmail.com'
$$;

revoke execute on function public.is_owner() from public, anon, authenticated;
grant execute on function public.is_owner() to authenticated;
