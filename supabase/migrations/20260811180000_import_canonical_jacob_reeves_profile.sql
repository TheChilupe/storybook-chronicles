-- Import only the canonical Jacob Reeves / Ladderman profile from Storybook
-- Codex Character Migration Batch 01.
-- Source: https://app.notion.com/p/1f8c063349fe427b8041f28315611a2b
-- Export state: Canon / Cleaned / Supporting Character.
--
-- The source concept art was copied into permanent project storage at
-- /images/characters/jacob-reeves-concept.png. No temporary signed URL is
-- persisted. The Giver origin and the Naomi Carter connection are stored only
-- in spoiler-controlled fields. This migration never creates Naomi, Ren, or an
-- LCPD faction.

DO $$
DECLARE
  jacob_id uuid;
  story_one_id uuid;
  ladder_generation_id uuid;
  naomi_id uuid;
  candidate_count integer;
  naomi_candidate_count integer;
BEGIN
  SELECT id INTO STRICT story_one_id
  FROM public.stories
  WHERE slug = 'rush';

  SELECT count(*), (array_agg(id))[1]
  INTO candidate_count, jacob_id
  FROM public.characters
  WHERE slug IN ('jacob-reeves', 'jacob-ladderman-reeves')
     OR lower(trim(name)) IN (
       'jacob reeves',
       'officer jacob reeves',
       'officer jacob "ladderman" reeves'
     )
     OR lower(trim(coalesce(alias, ''))) = 'ladderman';

  IF candidate_count > 1 THEN
    RAISE EXCEPTION
      'Jacob Reeves migration found % candidates; manual reconciliation is required',
      candidate_count;
  ELSIF candidate_count = 0 THEN
    INSERT INTO public.characters (slug, name, alias)
    VALUES ('jacob-reeves', 'Jacob Reeves', 'Ladderman')
    RETURNING id INTO jacob_id;
  END IF;

  UPDATE public.characters
  SET
    slug = 'jacob-reeves',
    name = 'Jacob Reeves',
    alias = 'Ladderman',
    role = 'Supporting Character',
    story_id = story_one_id,
    primary_story_id = story_one_id,
    eyebrow = 'Story 1 · Supporting Character · Police Officer',
    tagline = 'An earnest officer whose unusual power gives heroism a new shape.',
    canon_summary_md = $md$Jacob Reeves, known as **Ladderman**, is a good-hearted police officer in his mid-thirties. He grew up loving comic books and dreaming of becoming a superhero. Believing superpowers were not real, he pursued police work as his way to uphold the law, save lives, and become a hero of justice.

Jacob can generate ladders from his body, primarily in wood or steel. He uses them to reach high places, rescue people, and improvise barriers or bridges. He is earnest, courageous, quick to act, and willing to risk himself for civilians, though his black-and-white view of the law and his enthusiasm can make him naive and reckless.$md$,
    identity_md = $md$**Name:** Jacob Reeves

**Alias:** Ladderman

**Age:** Mid-thirties

**Occupation:** Police Officer

**Classification:** Supporting Character

**Primary Story:** Story 1

## Appearance

Jacob has a lean, strong physique typical of a dedicated police officer. He has short brown hair, a friendly and earnest expression, and maintains a neat, professional appearance in uniform.

## Personality

- Good-hearted and naive
- Sees the law in black-and-white terms
- Quick to act, sometimes before considering the consequences
- Courageous and self-sacrificing
- Earnest and enthusiastic$md$,
    story_role_md = $md$Jacob is introduced as an officer handling the aftermath of a warehouse cleared by Rush. He arrests several unconscious thugs and takes an interest in the larger investigation.

His unusual ability creates lighthearted rescue and chase situations, but his courage is genuine. He repeatedly puts his life on the line for civilians, and his determination can inspire others. When he crosses paths with Rush, their shared recklessness is complicated by Jacob's real legal authority.$md$,
    core_conflict_md = $md$Jacob sincerely wants to be a pillar of justice, but his eagerness to help and his black-and-white understanding of the law can leave him unprepared for complicated situations.$md$,
    spoiler_md = $md$## Origin

Alongside his partner, Detective Naomi Carter, Jacob follows the crystal trade and the trail surrounding Rush, Room, Hawks, and their enemies. When the investigation corners them with the Giver, the Giver is amused by Jacob's spirit and determination and bestows a power on him as a joke on the name **Ladderman**.$md$,
    portrait_url = '/images/characters/jacob-reeves-concept.png',
    accent_color = NULL,
    notion_page_id = '1f8c0633-49fe-427b-8041-f28315611a2b'::uuid,
    notion_source_url = 'https://app.notion.com/p/1f8c063349fe427b8041f28315611a2b',
    canon_status = 'canon',
    last_synced_at = '2026-08-11T18:00:00-04:00'::timestamptz,
    status = 'published',
    archived_at = NULL
  WHERE id = jacob_id;

  DELETE FROM public.character_stories
  WHERE character_id = jacob_id AND story_id <> story_one_id;

  INSERT INTO public.character_stories (character_id, story_id, role)
  VALUES (
    jacob_id,
    story_one_id,
    'Supporting police officer, rescue presence, and grounded authority figure'
  )
  ON CONFLICT (character_id, story_id) DO UPDATE
  SET role = EXCLUDED.role;

  -- The export establishes no eras, story-note rows, key moments, or quotes.
  DELETE FROM public.character_eras WHERE character_id = jacob_id;
  DELETE FROM public.character_story_notes WHERE character_id = jacob_id;
  DELETE FROM public.character_key_moments WHERE character_id = jacob_id;
  DELETE FROM public.character_quotes WHERE character_id = jacob_id;

  INSERT INTO public.power_systems
    (slug, name, summary_md, spoiler_md, canon_status, notion_source_url, last_synced_at)
  VALUES (
    'ladder-generation',
    'Ladder Generation',
    'The ability to generate ladders from the user''s body, primarily in wood or steel, for climbing, rescue, barriers, bridges, and other improvised uses. The power has no established stamina cost, but repeated use weakens the user''s skin until rest allows recovery.',
    NULL,
    'canon',
    'https://app.notion.com/p/1f8c063349fe427b8041f28315611a2b',
    '2026-08-11T18:00:00-04:00'::timestamptz
  )
  ON CONFLICT (slug) DO UPDATE
  SET
    name = EXCLUDED.name,
    summary_md = EXCLUDED.summary_md,
    spoiler_md = EXCLUDED.spoiler_md,
    canon_status = EXCLUDED.canon_status,
    notion_source_url = EXCLUDED.notion_source_url,
    last_synced_at = EXCLUDED.last_synced_at;

  SELECT id INTO STRICT ladder_generation_id
  FROM public.power_systems
  WHERE slug = 'ladder-generation';

  DELETE FROM public.character_powers
  WHERE character_id = jacob_id
    AND power_system_id <> ladder_generation_id;

  INSERT INTO public.character_powers (character_id, power_system_id, notes)
  VALUES (
    jacob_id,
    ladder_generation_id,
    'Jacob creates ladders from his body, primarily from wood or steel. He can use them to reach high places, rescue people, and improvise barriers or bridges. There is no established stamina cost. He feels the ladders emerge from his body, and constant use weakens his skin; after some rest, he recovers.'
  )
  ON CONFLICT (character_id, power_system_id) DO UPDATE
  SET notes = EXCLUDED.notes;

  -- Link Naomi only when one existing row resolves cleanly. Never create her,
  -- and keep this source-established partnership hidden until spoiler reveal.
  SELECT count(*), (array_agg(id))[1]
  INTO naomi_candidate_count, naomi_id
  FROM public.characters
  WHERE slug IN ('naomi-carter', 'detective-naomi-carter')
     OR lower(trim(name)) IN ('naomi carter', 'detective naomi carter');

  IF naomi_candidate_count = 1 THEN
    INSERT INTO public.character_relationships
      (id, character_id, related_character_id, relation_label, inverse_label,
       sort_order, is_spoiler)
    VALUES (
      '1add3001-0000-4000-8000-000000000001'::uuid,
      jacob_id,
      naomi_id,
      'Partner / fellow investigator',
      'Partner / fellow investigator',
      1,
      true
    )
    ON CONFLICT (character_id, related_character_id) DO UPDATE
    SET
      relation_label = EXCLUDED.relation_label,
      inverse_label = EXCLUDED.inverse_label,
      sort_order = EXCLUDED.sort_order,
      is_spoiler = EXCLUDED.is_spoiler;
  END IF;
END $$;
