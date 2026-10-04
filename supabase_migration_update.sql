-- ====================================================================
-- BUMIL CERIA - SUPABASE MIGRATION UPDATE
-- Jalankan query ini di SQL Editor Supabase Dashboard Anda.
-- Query ini HANYA mencakup 5 tabel baru dan pengaturannya:
-- 1. kick_sessions (Hitung Tendangan Janin)
-- 2. contraction_records (Pencatat Kontraksi 5-1-1)
-- 3. labor_budget (Simulasi & Tabungan Persalinan)
-- 4. usg_records (Pencatatan Biometri USG Janin)
-- 5. maternal_vitals (Tanda Vital & Kesehatan Ibu - Buku KIA)
-- ====================================================================

-- 1. Tabel Hitung Tendangan Janin (Cardiff Kick Counter)
create table if not exists public.kick_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id text not null,
  date date not null,
  kicks integer not null default 10,
  duration_seconds integer default 0,
  notes text default '',
  created_at timestamptz default now()
);

-- 2. Tabel Pencatat Kontraksi (5-1-1 Rule)
create table if not exists public.contraction_records (
  id uuid primary key default uuid_generate_v4(),
  user_id text not null,
  start_time timestamptz not null,
  duration_seconds integer not null,
  interval_minutes numeric(5,2),
  intensity text default 'sedang',
  created_at timestamptz default now()
);

-- 3. Tabel Tabungan & Target Biaya Persalinan
create table if not exists public.labor_budget (
  id uuid primary key default uuid_generate_v4(),
  user_id text not null unique,
  current_savings numeric(12,2) default 0,
  target_override numeric(12,2),
  updated_at timestamptz default now()
);

-- 4. Tabel Perkembangan USG & Biometri Janin
create table if not exists public.usg_records (
  id uuid primary key default uuid_generate_v4(),
  user_id text not null,
  date date not null,
  week integer not null,
  doctor_name text,
  clinic_name text,
  crl numeric(6,2),          -- Crown-Rump Length (mm)
  bpd numeric(6,2),          -- Biparietal Diameter (mm)
  hc numeric(6,2),           -- Head Circumference (mm)
  ac numeric(6,2),           -- Abdominal Circumference (mm)
  fl numeric(6,2),           -- Femur Length (mm)
  efw integer,               -- Estimated Fetal Weight / TBJ (gram)
  djj integer,               -- Denyut Jantung Janin / FHR (bpm)
  afi numeric(5,2),          -- Amniotic Fluid Index (cm)
  placenta text,             -- Letak & Maturitas Plasenta
  gender text,               -- Jenis Kelamin
  notes text,                -- Catatan Tambahan Dokter
  created_at timestamptz default now()
);

-- 5. Tabel Tanda Vital & Kondisi Kesehatan Ibu (Standar Buku KIA)
create table if not exists public.maternal_vitals (
  id uuid primary key default uuid_generate_v4(),
  user_id text not null,
  date date not null,
  week integer not null,
  systolic integer,          -- Tensi Sistolik (mmHg)
  diastolic integer,         -- Tensi Diastolik (mmHg)
  weight numeric(5,2),       -- Berat Badan Ibu (kg)
  lila numeric(5,2),         -- Lingkar Lengan Atas (cm) - Standar KIA ≥23.5cm
  hemoglobin numeric(4,2),   -- Kadar Hb (g/dL) - Standar KIA ≥11.0g/dL
  blood_sugar integer,       -- Gula Darah Sewaktu (mg/dL)
  symptoms text,             -- Keluhan Fisik
  notes text,                -- Catatan Khusus Bidan/Dokter
  created_at timestamptz default now()
);

-- ====================================================================
-- Indices (Indeks Performa Pencarian Cepat)
-- ====================================================================
create index if not exists idx_kick_sessions_user on public.kick_sessions(user_id);
create index if not exists idx_contraction_records_user on public.contraction_records(user_id);
create index if not exists idx_labor_budget_user on public.labor_budget(user_id);
create index if not exists idx_usg_records_user on public.usg_records(user_id, date);
create index if not exists idx_maternal_vitals_user on public.maternal_vitals(user_id, date);

-- ====================================================================
-- Row Level Security (RLS)
-- ====================================================================
alter table public.kick_sessions enable row level security;
alter table public.contraction_records enable row level security;
alter table public.labor_budget enable row level security;
alter table public.usg_records enable row level security;
alter table public.maternal_vitals enable row level security;

-- ====================================================================
-- Policies (Kebijakan Akses Sync Client)
-- ====================================================================
create policy "Allow all operations for anon client on kick_sessions" 
  on public.kick_sessions for all using (true) with check (true);

create policy "Allow all operations for anon client on contraction_records" 
  on public.contraction_records for all using (true) with check (true);

create policy "Allow all operations for anon client on labor_budget" 
  on public.labor_budget for all using (true) with check (true);

create policy "Allow all operations for anon client on usg_records" 
  on public.usg_records for all using (true) with check (true);

create policy "Allow all operations for anon client on maternal_vitals" 
  on public.maternal_vitals for all using (true) with check (true);
