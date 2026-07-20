-- PulseAí — autenticação e autorização alinhadas ao projeto ativo
-- Projeto: mkwtqforzirfcxvsqenf
-- Este arquivo documenta o que já foi aplicado no Supabase.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where auth_user_id = auth.uid()
      and role = 'admin'
      and is_active = true
  );
$$;

grant execute on function public.is_admin() to authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role text;
  new_profile_id uuid;
begin
  requested_role := case
    when new.raw_user_meta_data->>'role' = 'business' then 'negocio'
    when new.raw_user_meta_data->>'role' = 'driver' then 'motorista'
    else 'usuario'
  end;

  insert into public.profiles (
    auth_user_id,
    role,
    full_name,
    phone,
    city,
    state,
    is_active
  ) values (
    new.id,
    requested_role,
    coalesce(nullif(new.raw_user_meta_data->>'full_name',''), split_part(new.email,'@',1)),
    nullif(new.raw_user_meta_data->>'phone',''),
    coalesce(nullif(new.raw_user_meta_data->>'city',''), 'Floriano'),
    'PI',
    true
  )
  on conflict (auth_user_id) do update set
    full_name = excluded.full_name,
    phone = coalesce(excluded.phone, public.profiles.phone),
    city = coalesce(excluded.city, public.profiles.city),
    updated_at = now()
  returning id into new_profile_id;

  if requested_role = 'negocio' then
    insert into public.businesses (
      owner_profile_id,
      name,
      description,
      categories,
      address,
      city,
      state,
      phone,
      whatsapp,
      is_active
    ) values (
      new_profile_id,
      coalesce(nullif(new.raw_user_meta_data->>'business_name',''), 'Novo estabelecimento'),
      'Cadastro realizado pelo portal PulseAí.',
      array[coalesce(nullif(new.raw_user_meta_data->>'category',''), 'Outros')],
      nullif(new.raw_user_meta_data->>'address',''),
      coalesce(nullif(new.raw_user_meta_data->>'city',''), 'Floriano'),
      'PI',
      nullif(new.raw_user_meta_data->>'phone',''),
      nullif(new.raw_user_meta_data->>'phone',''),
      true
    );
  elsif requested_role = 'motorista' then
    insert into public.drivers (
      profile_id,
      display_name,
      phone,
      vehicle_type,
      vehicle_label,
      plate,
      status,
      is_active
    ) values (
      new_profile_id,
      coalesce(nullif(new.raw_user_meta_data->>'full_name',''), split_part(new.email,'@',1)),
      nullif(new.raw_user_meta_data->>'phone',''),
      nullif(new.raw_user_meta_data->>'vehicle_type',''),
      nullif(new.raw_user_meta_data->>'vehicle_type',''),
      upper(nullif(new.raw_user_meta_data->>'plate','')),
      'offline',
      true
    )
    on conflict (profile_id) do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Políticas administrativas aplicadas no projeto.
drop policy if exists admin_profiles_all on public.profiles;
create policy admin_profiles_all on public.profiles
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists admin_businesses_all on public.businesses;
create policy admin_businesses_all on public.businesses
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists admin_drivers_all on public.drivers;
create policy admin_drivers_all on public.drivers
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists admin_events_all on public.events;
create policy admin_events_all on public.events
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists admin_ride_requests_all on public.ride_requests;
create policy admin_ride_requests_all on public.ride_requests
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Conta proprietária já definida como admin no banco ativo.
