-- Comments left on the public portfolio (contact form "visitor feedback").
-- Moderated: only shown on the site once `approved = true`.
create table if not exists public.comments (
  id text primary key,
  name text not null,
  email text not null,
  project_id text not null,
  comment text not null,
  rating integer not null check (rating between 1 and 5),
  created_at timestamptz not null default now(),
  approved boolean not null default false
);

create index if not exists comments_approved_created_at_idx
  on public.comments (approved, created_at desc);

alter table public.comments enable row level security;
-- No policies for anon/authenticated: this table is only ever read/written
-- server-side (Vercel serverless functions) using the service_role key,
-- which bypasses RLS. The public site never talks to Supabase directly.

-- Sliding-window rate limiting for the public contact form and comment
-- form, keyed by client IP (mirrors the previous 5 requests / 15 min
-- express-rate-limit behavior).
create table if not exists public.rate_limit_events (
  id bigint generated always as identity primary key,
  ip text not null,
  created_at timestamptz not null default now()
);

create index if not exists rate_limit_events_ip_created_at_idx
  on public.rate_limit_events (ip, created_at);

alter table public.rate_limit_events enable row level security;
-- Same rationale: service_role only, no anon/authenticated policies.
