-- PulseAí — autenticação e autorização para uso real
-- Execute uma vez no SQL Editor do Supabase.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

grant execute on function public.is_admin() to authenticated;

-- Garante perfil ao criar conta. A função nunca permite criar admin publicamente.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role public.user_role;
begin
  requested_role := case
    when new.raw_user_meta_data->>'role' = 'business' then 'business'::public.user_role
    when new.raw_user_meta_data->>'role' = 'driver' then 'driver'::public.user_role
    else 'user'::public.user_role
  end;

  insert into public.profiles (id, role, full_name, email, city)
  values (
    new.id,
    requested_role,
    coalesce(nullif(new.raw_user_meta_data->>'full_name',''), split_part(new.email,'@',1)),
    new.email,
    'Floriano, PI'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Admin pode consultar e gerenciar todos os perfis.
drop policy if exists "Admin gerencia perfis" on public.profiles;
create policy "Admin gerencia perfis" on public.profiles
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Negócios: proprietário e admin.
drop policy if exists "Admin gerencia negocios" on public.businesses;
create policy "Admin gerencia negocios" on public.businesses
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Motoristas: o próprio motorista e admin.
drop policy if exists "Motorista le proprio cadastro" on public.drivers;
create policy "Motorista le proprio cadastro" on public.drivers
for select to authenticated
using (profile_id = auth.uid() or public.is_admin());

drop policy if exists "Motorista cria proprio cadastro" on public.drivers;
create policy "Motorista cria proprio cadastro" on public.drivers
for insert to authenticated
with check (profile_id = auth.uid() and approved = false);

drop policy if exists "Motorista atualiza proprio cadastro" on public.drivers;
create policy "Motorista atualiza proprio cadastro" on public.drivers
for update to authenticated
using (profile_id = auth.uid() or public.is_admin())
with check (profile_id = auth.uid() or public.is_admin());

-- Eventos e itens de cardápio: leitura pública apenas quando publicados/ativos.
drop policy if exists "Eventos publicados leitura publica" on public.events;
create policy "Eventos publicados leitura publica" on public.events
for select to anon, authenticated
using (status = 'published' or public.is_admin() or exists (
  select 1 from public.businesses b where b.id = events.business_id and b.owner_id = auth.uid()
));

drop policy if exists "Parceiro gerencia eventos" on public.events;
create policy "Parceiro gerencia eventos" on public.events
for all to authenticated
using (public.is_admin() or exists (
  select 1 from public.businesses b where b.id = events.business_id and b.owner_id = auth.uid()
))
with check (public.is_admin() or exists (
  select 1 from public.businesses b where b.id = events.business_id and b.owner_id = auth.uid()
));

drop policy if exists "Cardapio ativo leitura publica" on public.menu_items;
create policy "Cardapio ativo leitura publica" on public.menu_items
for select to anon, authenticated
using (active = true);

drop policy if exists "Parceiro gerencia cardapio" on public.menu_items;
create policy "Parceiro gerencia cardapio" on public.menu_items
for all to authenticated
using (public.is_admin() or exists (
  select 1 from public.businesses b where b.id = menu_items.business_id and b.owner_id = auth.uid()
))
with check (public.is_admin() or exists (
  select 1 from public.businesses b where b.id = menu_items.business_id and b.owner_id = auth.uid()
));

-- Solicitações de transporte.
drop policy if exists "Usuario cria transporte" on public.transport_requests;
create policy "Usuario cria transporte" on public.transport_requests
for insert to authenticated
with check (user_id = auth.uid());

drop policy if exists "Participantes leem transporte" on public.transport_requests;
create policy "Participantes leem transporte" on public.transport_requests
for select to authenticated
using (
  user_id = auth.uid()
  or public.is_admin()
  or exists (select 1 from public.drivers d where d.id = transport_requests.driver_id and d.profile_id = auth.uid())
  or (status = 'pending' and exists (select 1 from public.drivers d where d.profile_id = auth.uid() and d.approved = true and d.available = true))
);

drop policy if exists "Motorista atualiza transporte" on public.transport_requests;
create policy "Motorista atualiza transporte" on public.transport_requests
for update to authenticated
using (public.is_admin() or exists (select 1 from public.drivers d where d.profile_id = auth.uid()))
with check (public.is_admin() or exists (select 1 from public.drivers d where d.profile_id = auth.uid()));

-- Admin consulta métricas completas.
drop policy if exists "Admin le analytics" on public.analytics_events;
create policy "Admin le analytics" on public.analytics_events
for select to authenticated
using (public.is_admin());

-- Torne a sua conta administradora manualmente após criar o login:
-- update public.profiles set role = 'admin' where email = 'SEU_EMAIL_AQUI';
