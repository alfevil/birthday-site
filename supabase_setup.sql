-- 1. Create table for Music Queue
create table public.music_queue (
  id text primary key,
  track text not null,
  author text,
  "timestamp" text,
  played boolean default false,
  likes integer default 0,
  "addedAt" bigint
);

-- 2. Create table for Wheel History
create table public.wheel_history (
  id integer primary key generated always as identity,
  result_text text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Create table for RSVP (Optional backup, though we send straight to Telegram)
create table public.rsvps (
  id integer primary key generated always as identity,
  name text not null,
  alco text,
  food text,
  note text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. Disable RLS (Row Level Security) so guests can read/write without auth
-- Security is not strict here since it's a private birthday site.
alter table public.music_queue disable row level security;
alter table public.wheel_history disable row level security;
alter table public.rsvps disable row level security;

-- 5. Enable Realtime for the tables
alter publication supabase_realtime add table public.music_queue;
alter publication supabase_realtime add table public.wheel_history;
