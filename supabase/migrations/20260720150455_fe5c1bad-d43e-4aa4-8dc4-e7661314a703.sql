
ALTER TABLE public.characters
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS archived_at timestamptz,
  ADD COLUMN IF NOT EXISTS updated_by uuid;

-- Backfill existing rows so nothing disappears from the codex.
UPDATE public.characters SET status = 'published' WHERE status = 'draft';

ALTER TABLE public.characters
  DROP CONSTRAINT IF EXISTS characters_status_chk;
ALTER TABLE public.characters
  ADD CONSTRAINT characters_status_chk
  CHECK (status IN ('draft','imported','needs_review','published'));

CREATE INDEX IF NOT EXISTS characters_status_idx ON public.characters(status);
CREATE INDEX IF NOT EXISTS characters_archived_at_idx ON public.characters(archived_at);
