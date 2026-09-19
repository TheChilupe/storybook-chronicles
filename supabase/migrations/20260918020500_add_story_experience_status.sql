-- Phase 2: Story-centered public experience.
-- Canon status answers "is this part of canon?"
-- Experience status answers "can a visitor enter this story experience?"

ALTER TABLE public.stories
ADD COLUMN IF NOT EXISTS experience_status text NOT NULL DEFAULT 'locked';

ALTER TABLE public.stories
DROP CONSTRAINT IF EXISTS stories_experience_status_check;

ALTER TABLE public.stories
ADD CONSTRAINT stories_experience_status_check
CHECK (
  experience_status IN (
    'available',
    'locked',
    'coming-soon'
  )
);

-- Story 1 is the initial public experience.
-- Stories 2-4 remain visible as locked teasers.
UPDATE public.stories
SET experience_status = CASE
  WHEN number = 1 THEN 'available'
  ELSE 'locked'
END
WHERE number BETWEEN 1 AND 4;

COMMENT ON COLUMN public.stories.experience_status IS
'Controls whether the public Storybook experience is available, locked, or coming soon. Independent from canon status.';

-- Preserve the existing visitor-safe projection while exposing the new
-- experience state needed by the Storybook landing page.
CREATE OR REPLACE VIEW public.public_codex_stories
WITH (security_barrier = true, security_invoker = false) AS
SELECT
  id,
  slug,
  number,
  title,
  tagline,
  summary_md,
  cover_image_url,
  canon_status,
  experience_status
FROM public.stories
WHERE canon_status = 'canon';

GRANT SELECT ON public.public_codex_stories TO anon, authenticated;
