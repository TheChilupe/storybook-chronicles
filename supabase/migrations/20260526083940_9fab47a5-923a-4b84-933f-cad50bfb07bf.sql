
-- Sync metadata fields on stories
ALTER TABLE public.stories
  ADD COLUMN IF NOT EXISTS canon_status text NOT NULL DEFAULT 'canon',
  ADD COLUMN IF NOT EXISTS notion_source_url text,
  ADD COLUMN IF NOT EXISTS last_synced_at timestamptz;

-- Sync metadata + primary_story_id on characters
ALTER TABLE public.characters
  ADD COLUMN IF NOT EXISTS canon_status text NOT NULL DEFAULT 'canon',
  ADD COLUMN IF NOT EXISTS notion_source_url text,
  ADD COLUMN IF NOT EXISTS last_synced_at timestamptz,
  ADD COLUMN IF NOT EXISTS primary_story_id uuid REFERENCES public.stories(id) ON DELETE SET NULL;

-- Backfill primary_story_id from existing story_id
UPDATE public.characters SET primary_story_id = story_id WHERE primary_story_id IS NULL AND story_id IS NOT NULL;

-- Sync metadata fields on the remaining lore tables
ALTER TABLE public.factions
  ADD COLUMN IF NOT EXISTS canon_status text NOT NULL DEFAULT 'canon',
  ADD COLUMN IF NOT EXISTS notion_source_url text,
  ADD COLUMN IF NOT EXISTS last_synced_at timestamptz;

ALTER TABLE public.worlds
  ADD COLUMN IF NOT EXISTS canon_status text NOT NULL DEFAULT 'canon',
  ADD COLUMN IF NOT EXISTS notion_source_url text,
  ADD COLUMN IF NOT EXISTS last_synced_at timestamptz;

ALTER TABLE public.power_systems
  ADD COLUMN IF NOT EXISTS canon_status text NOT NULL DEFAULT 'canon',
  ADD COLUMN IF NOT EXISTS notion_source_url text,
  ADD COLUMN IF NOT EXISTS last_synced_at timestamptz;

ALTER TABLE public.spoiler_notes
  ADD COLUMN IF NOT EXISTS canon_status text NOT NULL DEFAULT 'canon',
  ADD COLUMN IF NOT EXISTS notion_source_url text,
  ADD COLUMN IF NOT EXISTS last_synced_at timestamptz;

-- Join tables
CREATE TABLE IF NOT EXISTS public.character_stories (
  character_id uuid NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  story_id uuid NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  role text,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (character_id, story_id)
);

CREATE TABLE IF NOT EXISTS public.character_factions (
  character_id uuid NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  faction_id uuid NOT NULL REFERENCES public.factions(id) ON DELETE CASCADE,
  role text,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (character_id, faction_id)
);

CREATE TABLE IF NOT EXISTS public.character_worlds (
  character_id uuid NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  world_id uuid NOT NULL REFERENCES public.worlds(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (character_id, world_id)
);

CREATE TABLE IF NOT EXISTS public.character_powers (
  character_id uuid NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  power_system_id uuid NOT NULL REFERENCES public.power_systems(id) ON DELETE CASCADE,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (character_id, power_system_id)
);

-- RLS on join tables — owner only
ALTER TABLE public.character_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_factions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_worlds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_powers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner all" ON public.character_stories  FOR ALL TO authenticated USING (public.is_owner()) WITH CHECK (public.is_owner());
CREATE POLICY "owner all" ON public.character_factions FOR ALL TO authenticated USING (public.is_owner()) WITH CHECK (public.is_owner());
CREATE POLICY "owner all" ON public.character_worlds   FOR ALL TO authenticated USING (public.is_owner()) WITH CHECK (public.is_owner());
CREATE POLICY "owner all" ON public.character_powers   FOR ALL TO authenticated USING (public.is_owner()) WITH CHECK (public.is_owner());

-- Backfill character_stories from existing primary story relationship
INSERT INTO public.character_stories (character_id, story_id, role)
SELECT c.id, c.story_id, c.role
FROM public.characters c
WHERE c.story_id IS NOT NULL
ON CONFLICT DO NOTHING;
