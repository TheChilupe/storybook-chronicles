
-- 1) Core conflict on characters
ALTER TABLE public.characters ADD COLUMN IF NOT EXISTS core_conflict_md text;

-- Shared updated_at trigger already exists: public.touch_updated_at()

-- 2) character_eras
CREATE TABLE public.character_eras (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id uuid NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  era_label text NOT NULL,
  identity text NOT NULL,
  function_md text NOT NULL DEFAULT '',
  story_id uuid REFERENCES public.stories(id) ON DELETE SET NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_spoiler boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX character_eras_character_idx ON public.character_eras(character_id, sort_order);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.character_eras TO authenticated;
GRANT ALL ON public.character_eras TO service_role;
ALTER TABLE public.character_eras ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owner all" ON public.character_eras FOR ALL TO authenticated USING (is_owner()) WITH CHECK (is_owner());
CREATE TRIGGER trg_character_eras_updated BEFORE UPDATE ON public.character_eras
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 3) character_relationships
CREATE TABLE public.character_relationships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id uuid NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  related_character_id uuid NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  relation_label text NOT NULL,
  inverse_label text,
  sort_order integer NOT NULL DEFAULT 0,
  is_spoiler boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT character_relationships_no_self CHECK (character_id <> related_character_id),
  CONSTRAINT character_relationships_unique_pair UNIQUE (character_id, related_character_id)
);
CREATE INDEX character_relationships_character_idx ON public.character_relationships(character_id, sort_order);
CREATE INDEX character_relationships_related_idx ON public.character_relationships(related_character_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.character_relationships TO authenticated;
GRANT ALL ON public.character_relationships TO service_role;
ALTER TABLE public.character_relationships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owner all" ON public.character_relationships FOR ALL TO authenticated USING (is_owner()) WITH CHECK (is_owner());
CREATE TRIGGER trg_character_relationships_updated BEFORE UPDATE ON public.character_relationships
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 4) character_story_notes
CREATE TABLE public.character_story_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id uuid NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  story_id uuid NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  role_label text,
  summary_md text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  is_spoiler boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT character_story_notes_unique UNIQUE (character_id, story_id)
);
CREATE INDEX character_story_notes_character_idx ON public.character_story_notes(character_id, sort_order);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.character_story_notes TO authenticated;
GRANT ALL ON public.character_story_notes TO service_role;
ALTER TABLE public.character_story_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owner all" ON public.character_story_notes FOR ALL TO authenticated USING (is_owner()) WITH CHECK (is_owner());
CREATE TRIGGER trg_character_story_notes_updated BEFORE UPDATE ON public.character_story_notes
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 5) character_key_moments
CREATE TABLE public.character_key_moments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id uuid NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  title text NOT NULL,
  story_id uuid REFERENCES public.stories(id) ON DELETE SET NULL,
  summary_md text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  is_spoiler boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX character_key_moments_character_idx ON public.character_key_moments(character_id, sort_order);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.character_key_moments TO authenticated;
GRANT ALL ON public.character_key_moments TO service_role;
ALTER TABLE public.character_key_moments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owner all" ON public.character_key_moments FOR ALL TO authenticated USING (is_owner()) WITH CHECK (is_owner());
CREATE TRIGGER trg_character_key_moments_updated BEFORE UPDATE ON public.character_key_moments
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 6) character_quotes
CREATE TABLE public.character_quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id uuid NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  quote_md text NOT NULL,
  context_md text,
  sort_order integer NOT NULL DEFAULT 0,
  is_spoiler boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX character_quotes_character_idx ON public.character_quotes(character_id, sort_order);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.character_quotes TO authenticated;
GRANT ALL ON public.character_quotes TO service_role;
ALTER TABLE public.character_quotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owner all" ON public.character_quotes FOR ALL TO authenticated USING (is_owner()) WITH CHECK (is_owner());
CREATE TRIGGER trg_character_quotes_updated BEFORE UPDATE ON public.character_quotes
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
