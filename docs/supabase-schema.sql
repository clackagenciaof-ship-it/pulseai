create table profiles (
  id uuid primary key default gen_random_uuid(),
  role text not null,
  name text not null,
  email text,
  phone text,
  address text,
  created_at timestamptz default now()
);

create table partners (
  id uuid primary key default gen_random_uuid(),
  business_name text not null,
  category text,
  document text,
  instagram text,
  address text,
  status text default 'pending',
  created_at timestamptz default now()
);

create table drivers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  vehicle_type text,
  plate text,
  status text default 'pending',
  created_at timestamptz default now()
);

create table experiences (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid references partners(id),
  title text not null,
  category text not null,
  description text,
  address text,
  starts_at timestamptz,
  ends_at timestamptz,
  status text default 'draft',
  created_at timestamptz default now()
);

create table menu_items (
  id uuid primary key default gen_random_uuid(),
  experience_id uuid references experiences(id),
  type text,
  name text not null,
  price numeric(10,2),
  detail text,
  image_url text,
  created_at timestamptz default now()
);

create table ride_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  driver_id uuid references drivers(id),
  experience_id uuid references experiences(id),
  ride_type text,
  status text default 'requested',
  created_at timestamptz default now()
);
