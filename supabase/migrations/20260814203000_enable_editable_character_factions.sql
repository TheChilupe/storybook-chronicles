-- Gate 3A: editable Character <-> Faction affiliations.
-- This migration is additive and deliberately creates no affiliation rows.

ALTER TABLE public.character_factions
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS is_spoiler boolean NOT NULL DEFAULT false;

-- The composite primary key already prevents duplicate character/faction pairs
-- and indexes character-first lookups. Add the reverse lookup used by factions.
CREATE INDEX IF NOT EXISTS character_factions_faction_id_idx
  ON public.character_factions (faction_id);

ALTER TABLE public.character_factions ENABLE ROW LEVEL SECURITY;

-- Table privileges let the existing owner policy authorize CRUD. Authenticated
-- non-owners receive the privileges too, but RLS continues to reject mutations.
REVOKE ALL ON public.character_factions FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.character_factions TO authenticated;
GRANT SELECT ON public.character_factions TO anon;

DROP POLICY IF EXISTS "public read non-spoiler" ON public.character_factions;
CREATE POLICY "public read non-spoiler"
  ON public.character_factions
  FOR SELECT
  TO anon, authenticated
  USING (is_spoiler = false);
