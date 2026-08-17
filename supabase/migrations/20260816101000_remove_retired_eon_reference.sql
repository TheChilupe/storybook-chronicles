-- Remove the retired Eon wording from the already-applied local Purple Man
-- profile. A clean database also receives the corrected source migration first.
UPDATE public.characters
SET spoiler_md = replace(
  spoiler_md,
  'Eos—not the retired name Eon—is the underlying ancient Omega',
  'Eos is the underlying ancient Omega'
)
WHERE slug = 'purple-man'
  AND spoiler_md LIKE '%Eos—not the retired name Eon—is the underlying ancient Omega%';
