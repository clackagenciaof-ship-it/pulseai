-- PulseAí — políticas complementares do Supabase
-- Rode este arquivo no SQL Editor depois de schema.sql e seed.sql.

create policy if not exists "Eventos publicados podem ser lidos" on public.events
for select using (status = 'published');

create policy if not exists "Menu ativo pode ser lido" on public.menu_items
for select using (active = true);

create policy if not exists "Motoristas disponiveis podem ser lidos" on public.drivers
for select using (approved = true or available = true);

insert into storage.buckets (id, name, public)
values
  ('pulseai-uploads', 'pulseai-uploads', true),
  ('avatars', 'avatars', true),
  ('business-covers', 'business-covers', true),
  ('event-covers', 'event-covers', true),
  ('menu-items', 'menu-items', true)
on conflict (id) do update set public = excluded.public;

create policy if not exists "Ler imagens publicas do PulseAi" on storage.objects
for select using (bucket_id in ('pulseai-uploads', 'avatars', 'business-covers', 'event-covers', 'menu-items'));

create policy if not exists "Enviar imagens autenticado PulseAi" on storage.objects
for insert to authenticated with check (bucket_id in ('pulseai-uploads', 'avatars', 'business-covers', 'event-covers', 'menu-items'));
