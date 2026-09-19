-- ====================================================================
-- BumpBuddy — Supabase Production Database Schema
-- Run this SQL in your Supabase SQL Editor (Dashboard > SQL Editor)
-- ====================================================================

-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- 1. Profiles Table
create table if not exists public.profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id text not null unique,
  mama_name text not null default 'Mama',
  papa_name text not null default 'Papa',
  hpht date not null,
  insurance_type text default 'bpjs',
  hospital_name text,
  hospital_address text,
  doctor_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Weekly Checklist Completions
create table if not exists public.checklist_completions (
  id uuid primary key default uuid_generate_v4(),
  user_id text not null,
  item_id text not null,
  completed_at timestamptz default now(),
  unique(user_id, item_id)
);

-- 3. USG Milestone Status
create table if not exists public.usg_completions (
  id uuid primary key default uuid_generate_v4(),
  user_id text not null,
  usg_id text not null,
  completed_at timestamptz default now(),
  unique(user_id, usg_id)
);

-- 4. Hospital Bag Completions
create table if not exists public.hospital_bag_completions (
  id uuid primary key default uuid_generate_v4(),
  user_id text not null,
  item_id text not null,
  packed_at timestamptz default now(),
  unique(user_id, item_id)
);

-- 5. Custom Hospital Bag Items
create table if not exists public.custom_bag_items (
  id uuid primary key default uuid_generate_v4(),
  user_id text not null,
  category text not null check (category in ('mama', 'baby', 'papa')),
  title text not null,
  created_at timestamptz default now()
);

-- 6. Doctor Visits Log
create table if not exists public.doctor_visits (
  id uuid primary key default uuid_generate_v4(),
  user_id text not null,
  date date not null,
  week integer not null,
  blood_pressure text,
  mother_weight text,
  baby_weight text,
  doctor_notes text,
  doctor_name text,
  created_at timestamptz default now()
);

-- 7. Questions for Doctor (Tanya Dokter)
create table if not exists public.doctor_questions (
  id uuid primary key default uuid_generate_v4(),
  user_id text not null,
  text text not null,
  is_answered boolean default false,
  note text default '',
  created_at timestamptz default now()
);

-- 8. Daily Hydration & Vitamin Logs
create table if not exists public.daily_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id text not null,
  date date not null,
  water_glasses integer default 0,
  took_vitamin boolean default false,
  updated_at timestamptz default now(),
  unique(user_id, date)
);

-- ====================================================================
-- Indices for High Performance
-- ====================================================================
create index if not exists idx_profiles_user on public.profiles(user_id);
create index if not exists idx_checklist_user on public.checklist_completions(user_id);
create index if not exists idx_usg_user on public.usg_completions(user_id);
create index if not exists idx_hbag_user on public.hospital_bag_completions(user_id);
create index if not exists idx_custom_bag_user on public.custom_bag_items(user_id);
create index if not exists idx_doctor_visits_user on public.doctor_visits(user_id);
create index if not exists idx_doctor_questions_user on public.doctor_questions(user_id);
create index if not exists idx_daily_logs_user on public.daily_logs(user_id, date);

-- ====================================================================
-- Row Level Security (RLS)
-- Enables secure public access via anon key or authenticated users
-- ====================================================================
alter table public.profiles enable row level security;
alter table public.checklist_completions enable row level security;
alter table public.usg_completions enable row level security;
alter table public.hospital_bag_completions enable row level security;
alter table public.custom_bag_items enable row level security;
alter table public.doctor_visits enable row level security;
alter table public.doctor_questions enable row level security;
alter table public.daily_logs enable row level security;

-- Permissive policies for web client sync (anon or authenticated)
create policy "Allow all operations for anon client on profiles" on public.profiles for all using (true) with check (true);
create policy "Allow all operations for anon client on checklist_completions" on public.checklist_completions for all using (true) with check (true);
create policy "Allow all operations for anon client on usg_completions" on public.usg_completions for all using (true) with check (true);
create policy "Allow all operations for anon client on hospital_bag_completions" on public.hospital_bag_completions for all using (true) with check (true);
create policy "Allow all operations for anon client on custom_bag_items" on public.custom_bag_items for all using (true) with check (true);
create policy "Allow all operations for anon client on doctor_visits" on public.doctor_visits for all using (true) with check (true);
create policy "Allow all operations for anon client on doctor_questions" on public.doctor_questions for all using (true) with check (true);
create policy "Allow all operations for anon client on daily_logs" on public.daily_logs for all using (true) with check (true);
