-- PulseAí — schema inicial para MVP real
-- Rodar este arquivo no Supabase SQL Editor.

create extension if not exists pgcrypto;

-- Tipos base
create type public.user_role as enum ('user', 'business', 'driver', 'admin');
create type public.business_status as enum ('pending', 'approved', 'blocked');
create type public.event_status as enum ('draft', 'published', 'finished', 'cancelled');
create type public.vibe_reaction_type as enum ('bombando', 'energia_alta', 'acolhedor', 'seguro', 'publico_incrivel', 'atendimento_top');
create type public.transport_kind as enum ('so_ida', 'so_volta', 'ida_volta');
create type public.vehicle_preference as enum ('carro', 'moto', 'mais_rapido');
create type public.transport_status as enum ('pending', 'accepted', 'on_route', 'finished', 'cancelled');
create type public.order_status as enum ('pending', 'sent_to_business', 'paid', 'cancelled');

-- Perfis de usuário, parceiro, motorista e admin
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null default 'user',
  full_name text not null,
  email text,
  phone text,
  city text,
  residential_address text,
  avatar_url text,
  preferences jsonb not null default '{}'::jsonb,
  points integer not null default 0,
  level text not null default 'Curioso Urbano',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete set null,
  owner_name text,
  name text not null,
  category text not null,
  description text,
  whatsapp text,
  address text not null,
  city text not null,
  latitude numeric(10,7),
  longitude numeric(10,7),
  cover_image_url text,
  status public.business_status not null default 'pending',
  is_partner boolean not null default false,
  rating numeric(3,2) not null default 5.0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  title text not null,
  description text,
  category text not null,
  event_date date not null,
  start_time time not null,
  end_time time,
  address text not null,
  city text not null,
  latitude numeric(10,7),
  longitude numeric(10,7),
  cover_image_url text,
  music_genre text,
  environment_type text,
  estimated_capacity_percent integer check (estimated_capacity_percent between 0 and 100),
  cashback_percent numeric(5,2) default 0,
  price numeric(10,2),
  reservation_enabled boolean not null default true,
  ticket_enabled boolean not null default false,
  is_live boolean not null default false,
  status public.event_status not null default 'draft',
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  event_id uuid references public.events(id) on delete cascade,
  type text not null check (type in ('combo','bebida','prato','petisco','promocao','ingresso','reserva')),
  title text not null,
  description text,
  price numeric(10,2) not null default 0,
  image_url text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  business_id uuid references public.businesses(id) on delete cascade,
  event_id uuid references public.events(id) on delete cascade,
  points integer not null default 25,
  created_at timestamptz not null default now()
);

create table if not exists public.reactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  business_id uuid references public.businesses(id) on delete cascade,
  event_id uuid references public.events(id) on delete cascade,
  type public.vibe_reaction_type not null,
  created_at timestamptz not null default now()
);

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  business_id uuid references public.businesses(id) on delete cascade,
  event_id uuid references public.events(id) on delete cascade,
  menu_item_id uuid references public.menu_items(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint favorites_has_target check (business_id is not null or event_id is not null or menu_item_id is not null)
);

create table if not exists public.drivers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  full_name text not null,
  phone text not null,
  city text not null,
  vehicle_type public.vehicle_preference not null,
  vehicle_model text,
  plate text,
  available boolean not null default false,
  rating numeric(3,2) not null default 5.0,
  approved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.transport_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  event_id uuid references public.events(id) on delete set null,
  driver_id uuid references public.drivers(id) on delete set null,
  passenger_name text,
  origin text not null,
  destination text not null,
  transport_kind public.transport_kind not null,
  vehicle_preference public.vehicle_preference not null default 'mais_rapido',
  scheduled_at timestamptz,
  status public.transport_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  business_id uuid not null references public.businesses(id) on delete cascade,
  event_id uuid references public.events(id) on delete set null,
  customer_name text,
  customer_phone text,
  total numeric(10,2) not null default 0,
  status public.order_status not null default 'pending',
  whatsapp_sent_at timestamptz,
  payment_provider text,
  payment_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  menu_item_id uuid references public.menu_items(id) on delete set null,
  title text not null,
  quantity integer not null default 1,
  unit_price numeric(10,2) not null default 0,
  created_at timestamptz not null default now()
);

-- Métricas/eventos de analytics para o painel do parceiro e admin
create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  business_id uuid references public.businesses(id) on delete cascade,
  event_id uuid references public.events(id) on delete cascade,
  type text not null check (type in ('view','click','route_click','share','whatsapp_click','favorite','order','checkin')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Views úteis para dashboards
create or replace view public.business_dashboard_metrics as
select
  b.id as business_id,
  b.name as business_name,
  count(distinct e.id) filter (where e.status = 'published') as published_events,
  count(a.id) filter (where a.type = 'view') as views,
  count(a.id) filter (where a.type = 'click') as clicks,
  count(c.id) as checkins,
  count(o.id) as orders,
  coalesce(sum(o.total),0) as revenue,
  count(r.id) as reactions
from public.businesses b
left join public.events e on e.business_id = b.id
left join public.analytics_events a on a.business_id = b.id
left join public.checkins c on c.business_id = b.id
left join public.orders o on o.business_id = b.id
left join public.reactions r on r.business_id = b.id
group by b.id, b.name;

create or replace view public.event_vibe_scores as
select
  e.id as event_id,
  e.title,
  count(c.id) * 3
    + count(r.id) filter (where r.type = 'bombando') * 4
    + count(r.id) filter (where r.type = 'energia_alta') * 3
    + count(a.id) filter (where a.type = 'favorite') * 2
    + count(a.id) filter (where a.type = 'route_click') * 2
    + count(a.id) filter (where a.type = 'share') * 2
    + count(a.id) filter (where a.type = 'view') as score
from public.events e
left join public.checkins c on c.event_id = e.id
left join public.reactions r on r.event_id = e.id
left join public.analytics_events a on a.event_id = e.id
group by e.id, e.title;

-- Storage buckets sugeridos
insert into storage.buckets (id, name, public)
values
  ('avatars', 'avatars', true),
  ('business-covers', 'business-covers', true),
  ('event-covers', 'event-covers', true),
  ('menu-items', 'menu-items', true)
on conflict (id) do nothing;

-- RLS básico
alter table public.profiles enable row level security;
alter table public.businesses enable row level security;
alter table public.events enable row level security;
alter table public.menu_items enable row level security;
alter table public.checkins enable row level security;
alter table public.reactions enable row level security;
alter table public.favorites enable row level security;
alter table public.drivers enable row level security;
alter table public.transport_requests enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.analytics_events enable row level security;

-- Políticas abertas o suficiente para MVP piloto, mantendo dono/admin com controle.
-- Revisar antes de produção pública.
create policy "Perfis podem ler o proprio perfil" on public.profiles for select using (auth.uid() = id);
create policy "Perfis podem atualizar o proprio perfil" on public.profiles for update using (auth.uid() = id);
create policy "Perfis podem inserir o proprio perfil" on public.profiles for insert with check (auth.uid() = id);

create policy "Negocios publicados podem ser lidos" on public.businesses for select using (status = 'approved' or owner_id = auth.uid());
create policy "Parceiro cria negocio" on public.businesses for insert with check (owner_id = auth.uid() or owner_id is null);
create policy "Parceiro atualiza proprio negocio" on public.businesses for update using (owner_id = auth.uid());

create policy "Eventos publicados podem ser lidos" on public.events for select using (status = 'published' or exists(select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid()));
create policy "Parceiro cria eventos do negocio" on public.events for insert with check (exists(select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid()));
create policy "Parceiro atualiza eventos do negocio" on public.events for update using (exists(select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid()));

create policy "Cardapios ativos podem ser lidos" on public.menu_items for select using (active = true or exists(select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid()));
create policy "Parceiro gerencia cardapio" on public.menu_items for all using (exists(select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid()));

create policy "Usuario cria checkin" on public.checkins for insert with check (auth.uid() = user_id);
create policy "Usuario le proprios checkins" on public.checkins for select using (auth.uid() = user_id or exists(select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid()));

create policy "Usuario cria reacao" on public.reactions for insert with check (auth.uid() = user_id or user_id is null);
create policy "Reacoes podem ser lidas" on public.reactions for select using (true);

create policy "Usuario gerencia favoritos" on public.favorites for all using (auth.uid() = user_id);

create policy "Motoristas podem ler proprio cadastro" on public.drivers for select using (profile_id = auth.uid() or approved = true);
create policy "Motoristas criam cadastro" on public.drivers for insert with check (profile_id = auth.uid() or profile_id is null);
create policy "Motoristas atualizam proprio cadastro" on public.drivers for update using (profile_id = auth.uid());

create policy "Usuario cria solicitacao de transporte" on public.transport_requests for insert with check (auth.uid() = user_id or user_id is null);
create policy "Usuario ou motorista le corrida" on public.transport_requests for select using (auth.uid() = user_id or exists(select 1 from public.drivers d where d.id = driver_id and d.profile_id = auth.uid()) or status = 'pending');
create policy "Motorista atualiza corrida aceita" on public.transport_requests for update using (exists(select 1 from public.drivers d where d.id = driver_id and d.profile_id = auth.uid()) or status = 'pending');

create policy "Usuario cria pedido" on public.orders for insert with check (auth.uid() = user_id or user_id is null);
create policy "Usuario ou parceiro le pedido" on public.orders for select using (auth.uid() = user_id or exists(select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid()));
create policy "Parceiro atualiza pedido" on public.orders for update using (exists(select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid()));

create policy "Itens do pedido seguem pedido" on public.order_items for select using (exists(select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or exists(select 1 from public.businesses b where b.id = o.business_id and b.owner_id = auth.uid()))));
create policy "Criar itens de pedido" on public.order_items for insert with check (true);

create policy "Analytics insert publico MVP" on public.analytics_events for insert with check (true);
create policy "Parceiro le analytics do negocio" on public.analytics_events for select using (exists(select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid()));
