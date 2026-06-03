-- YerLab database schema (PostgreSQL / Supabase).
-- The MVP API runs on an in-memory seeded store by default; apply this schema and
-- set DATABASE_URL to use real Postgres. Tables are added per milestone:
--   M2: users, regions, crops, crop_region
--   M3: disease_scans
--   M4: listings, listing_photos

-- ---- M2: calculator reference + users ----

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  telegram_id bigint unique not null,
  username text,
  first_name text,
  language_code text,
  created_at timestamptz not null default now()
);

create table if not exists regions (
  id serial primary key,
  name_uz text not null,
  name_ru text not null,
  name_en text not null
);

create table if not exists crops (
  id serial primary key,
  name_uz text not null,
  name_ru text not null,
  name_en text not null,
  difficulty text not null check (difficulty in ('easy','medium','hard')),
  water_need text not null check (water_need in ('low','medium','high')),
  min_water_level int not null,            -- 0 none, 1 rain, 2 limited, 3 reliable
  harvest_days_min int not null,
  harvest_days_max int not null,
  investment_per_sotka_uzs int not null,
  yield_kg_per_sotka numeric not null,
  price_per_kg_uzs int not null,
  good_for_consumption boolean not null default true,
  good_for_profit boolean not null default true,
  notes_uz text not null default '',
  notes_ru text not null default ''
);

create table if not exists crop_region (
  crop_id int not null references crops(id) on delete cascade,
  region_id int not null references regions(id) on delete cascade,
  suitability text not null check (suitability in ('low','medium','high')),
  primary key (crop_id, region_id)
);

-- ---- M3: disease detection log ----

create table if not exists disease_scans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  image_url text,
  result_json jsonb not null,
  confidence_band text not null check (confidence_band in ('low','medium','high')),
  created_at timestamptz not null default now()
);
