-- Phase 2 初始数据库结构：账户资料、人设资产、素材、内容、计划和 AI 任务记录。
-- 执行位置：Supabase SQL Editor 或 supabase db push。

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.personas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  ip_name text,
  industry_identity text,
  target_customers text,
  products_services text,
  expression_style text,
  forbidden_expressions text,
  moment_goals text,
  common_cta text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint personas_user_id_unique unique (user_id)
);

create table if not exists public.persona_images (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  storage_path text not null,
  public_url text,
  description text,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.materials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  material_type text not null,
  title text,
  body text,
  storage_path text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.moments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  moment_type text,
  title text,
  body text,
  image_storage_path text,
  image_url text,
  angle_summary text,
  self_comment_suggestion text,
  comment_suggestion text,
  private_chat_suggestion text,
  status text not null default 'generated',
  scheduled_at timestamptz,
  published_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_type text not null,
  title text not null,
  status text not null default 'draft',
  starts_on date,
  ends_on date,
  inputs jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.plan_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id uuid not null references public.plans(id) on delete cascade,
  moment_id uuid references public.moments(id) on delete set null,
  item_order integer not null default 0,
  purpose text,
  suggested_at timestamptz,
  status text not null default 'pending',
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_generation_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  job_type text not null,
  status text not null default 'pending',
  input_summary jsonb not null default '{}'::jsonb,
  output_result jsonb,
  error_message text,
  duration_ms integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists personas_user_id_idx on public.personas(user_id);
create index if not exists persona_images_user_id_idx on public.persona_images(user_id);
create index if not exists materials_user_id_type_idx on public.materials(user_id, material_type);
create index if not exists moments_user_id_scheduled_at_idx on public.moments(user_id, scheduled_at);
create index if not exists moments_user_id_status_idx on public.moments(user_id, status);
create index if not exists plans_user_id_type_idx on public.plans(user_id, plan_type);
create index if not exists plan_items_plan_id_idx on public.plan_items(plan_id);
create index if not exists ai_generation_jobs_user_id_type_idx on public.ai_generation_jobs(user_id, job_type);

create or replace trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create or replace trigger personas_set_updated_at
before update on public.personas
for each row execute function public.set_updated_at();

create or replace trigger persona_images_set_updated_at
before update on public.persona_images
for each row execute function public.set_updated_at();

create or replace trigger materials_set_updated_at
before update on public.materials
for each row execute function public.set_updated_at();

create or replace trigger moments_set_updated_at
before update on public.moments
for each row execute function public.set_updated_at();

create or replace trigger plans_set_updated_at
before update on public.plans
for each row execute function public.set_updated_at();

create or replace trigger plan_items_set_updated_at
before update on public.plan_items
for each row execute function public.set_updated_at();

create or replace trigger ai_generation_jobs_set_updated_at
before update on public.ai_generation_jobs
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, new.raw_user_meta_data->>'display_name')
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.personas enable row level security;
alter table public.persona_images enable row level security;
alter table public.materials enable row level security;
alter table public.moments enable row level security;
alter table public.plans enable row level security;
alter table public.plan_items enable row level security;
alter table public.ai_generation_jobs enable row level security;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "personas_all_own" on public.personas for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "persona_images_all_own" on public.persona_images for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "materials_all_own" on public.materials for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "moments_all_own" on public.moments for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "plans_all_own" on public.plans for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "plan_items_all_own" on public.plan_items for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "ai_generation_jobs_all_own" on public.ai_generation_jobs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('persona-images', 'persona-images', false, 10485760, array['image/jpeg', 'image/png', 'image/webp']),
  ('material-images', 'material-images', false, 10485760, array['image/jpeg', 'image/png', 'image/webp']),
  ('generated-images', 'generated-images', false, 10485760, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "persona_images_storage_own" on storage.objects
for all using (bucket_id = 'persona-images' and auth.uid()::text = (storage.foldername(name))[1])
with check (bucket_id = 'persona-images' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "material_images_storage_own" on storage.objects
for all using (bucket_id = 'material-images' and auth.uid()::text = (storage.foldername(name))[1])
with check (bucket_id = 'material-images' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "generated_images_storage_own" on storage.objects
for all using (bucket_id = 'generated-images' and auth.uid()::text = (storage.foldername(name))[1])
with check (bucket_id = 'generated-images' and auth.uid()::text = (storage.foldername(name))[1]);
