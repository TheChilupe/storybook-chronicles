
-- Allowlist helper
create or replace function public.is_owner()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(auth.jwt() ->> 'email', '') = 'thechilupe@gmail.com'
$$;

-- STORIES
create table public.stories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  number int not null,
  title text not null,
  tagline text,
  summary_md text default '',
  summary_spoiler_md text default '',
  cover_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- CHARACTERS
create table public.characters (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  alias text,
  role text,
  story_id uuid references public.stories(id) on delete set null,
  eyebrow text,
  tagline text,
  canon_summary_md text default '',
  identity_md text default '',
  story_role_md text default '',
  spoiler_md text default '',
  portrait_url text,
  accent_color text default '#2563eb',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- FACTIONS
create table public.factions (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  summary_md text default '',
  spoiler_md text default '',
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- WORLDS
create table public.worlds (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  summary_md text default '',
  spoiler_md text default '',
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- POWER SYSTEMS
create table public.power_systems (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  summary_md text default '',
  spoiler_md text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- SPOILER NOTES
create table public.spoiler_notes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body_md text default '',
  related_story_id uuid references public.stories(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- updated_at trigger
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

do $$
declare t text;
begin
  for t in select unnest(array['stories','characters','factions','worlds','power_systems','spoiler_notes'])
  loop
    execute format('create trigger trg_%I_updated before update on public.%I for each row execute function public.touch_updated_at()', t, t);
  end loop;
end $$;

-- RLS: only allowlisted email
alter table public.stories enable row level security;
alter table public.characters enable row level security;
alter table public.factions enable row level security;
alter table public.worlds enable row level security;
alter table public.power_systems enable row level security;
alter table public.spoiler_notes enable row level security;

do $$
declare t text;
begin
  for t in select unnest(array['stories','characters','factions','worlds','power_systems','spoiler_notes'])
  loop
    execute format($p$create policy "owner all" on public.%I for all to authenticated using (public.is_owner()) with check (public.is_owner())$p$, t);
  end loop;
end $$;

-- Storage bucket (private)
insert into storage.buckets (id, name, public) values ('lore-images', 'lore-images', false)
on conflict (id) do nothing;

create policy "lore-images owner read" on storage.objects for select to authenticated
  using (bucket_id = 'lore-images' and public.is_owner());
create policy "lore-images owner write" on storage.objects for insert to authenticated
  with check (bucket_id = 'lore-images' and public.is_owner());
create policy "lore-images owner update" on storage.objects for update to authenticated
  using (bucket_id = 'lore-images' and public.is_owner());
create policy "lore-images owner delete" on storage.objects for delete to authenticated
  using (bucket_id = 'lore-images' and public.is_owner());

-- Seed initial data
insert into public.stories (slug, number, title, tagline, summary_md) values
('rush', 1, 'Rush', 'The birth of the modern heroic age.',
'Story 1 follows Talon Zone / Rush as he becomes the first major modern hero and sparks the heroic age.'),
('azul', 2, 'Azul', 'The blessed generation chooses rebellion.',
'A genius villain-protagonist shaped by faith, rebellion, and crystal power.'),
('blue-knight', 3, 'Blue Knight', 'Heroism is tested against the galaxy.',
'Builder''s chosen warrior carries heroic duty into the galaxy.'),
('tim-malcolm', 4, 'Tim Malcolm', 'Destiny itself cannot be trusted.',
'The Last Omega, a reluctant chosen one who wants a normal life.');

insert into public.characters (slug, name, alias, role, story_id, eyebrow, tagline, canon_summary_md, identity_md, story_role_md, accent_color) values
('rush', 'Talon Zone', 'Rush', 'First modern hero / protagonist',
  (select id from public.stories where slug='rush'),
  'Story 1 Protagonist',
  'The first modern hero and the spark of the heroic age.',
  'Talon Zone, better known as Rush, is the first major protagonist of Storybook Chronicles and the character who launches the modern heroic age.',
  '**Hero Name:** Rush\n\n**Primary Story:** Story 1\n\n**Role:** First modern hero / protagonist\n\n**Core Theme:** Ambition, faith, legacy, and power',
  'Rush begins as a reckless speedster chasing greatness and evolves into one of the foundational figures of the entire saga.',
  '#facc15'),
('azul', 'Azul Zone', null, 'Villain-protagonist',
  (select id from public.stories where slug='azul'),
  'Story 2 Protagonist',
  'A genius villain-protagonist shaped by faith, rebellion, and crystal power.',
  'Azul is the protagonist of Story 2 — a brilliant, conflicted figure whose rebellion reshapes the blessed generation.',
  '**Primary Story:** Story 2\n\n**Role:** Villain-protagonist\n\n**Core Theme:** Faith, rebellion, free will',
  'Azul''s arc defines the moral fracture at the heart of the blessed generation.',
  '#3b82f6'),
('blue-knight', 'Blue Knight', null, 'Chosen warrior',
  (select id from public.stories where slug='blue-knight'),
  'Story 3 Protagonist',
  'Builder''s chosen warrior and the protagonist of Story 3.',
  'Blue Knight is Builder''s chosen warrior, carrying the heroic age into galactic-scale conflict.',
  '**Primary Story:** Story 3\n\n**Role:** Chosen warrior\n\n**Core Theme:** Duty, faith, sacrifice',
  'Blue Knight tests whether heroism can survive contact with cosmic powers.',
  '#0ea5e9'),
('tim-malcolm', 'Tim Malcolm', 'The Last Omega', 'Reluctant chosen one',
  (select id from public.stories where slug='tim-malcolm'),
  'Story 4 Protagonist',
  'The Last Omega, a reluctant chosen one who wants a normal life.',
  'Tim Malcolm is the Last Omega — a reluctant figure who rejects the destiny forced upon him.',
  '**Primary Story:** Story 4\n\n**Role:** The Last Omega\n\n**Core Theme:** Free will, destiny, refusal',
  'Tim''s refusal of destiny reframes the meaning of chosen-one narratives in the entire saga.',
  '#a855f7');
