
ALTER TABLE public.characters
  ADD CONSTRAINT characters_slug_format_chk CHECK (slug ~ '^[a-z0-9-]+$');

ALTER TABLE public.characters
  ADD CONSTRAINT characters_accent_color_format_chk CHECK (accent_color IS NULL OR accent_color ~ '^#[0-9A-Fa-f]{6}$');

ALTER TABLE public.characters
  ADD COLUMN notion_page_id text;

CREATE UNIQUE INDEX characters_notion_page_id_key ON public.characters(notion_page_id) WHERE notion_page_id IS NOT NULL;

COMMENT ON COLUMN public.characters.story_id IS 'LEGACY: superseded by primary_story_id and character_stories join. Retained for backward compatibility.';
