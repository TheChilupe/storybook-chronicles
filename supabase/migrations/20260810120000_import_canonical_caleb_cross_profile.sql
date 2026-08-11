-- Import only the canonical Caleb Cross / Six Second Judgment profile from
-- Storybook Codex Character Migration Batch 01.
--
-- The export establishes no portrait, detailed biography, long-term
-- progression, quote, faction, or spoiler content. Those fields and sections
-- intentionally remain empty.

DO $$
DECLARE
  caleb_id uuid;
  rush_id uuid;
  story_one_id uuid;
  judgment_shot_id uuid;
  candidate_count integer;
BEGIN
  SELECT id INTO STRICT story_one_id
  FROM public.stories
  WHERE slug = 'rush';

  SELECT id INTO STRICT rush_id
  FROM public.characters
  WHERE slug = 'rush';

  SELECT count(*), (array_agg(id))[1]
  INTO candidate_count, caleb_id
  FROM public.characters
  WHERE slug = 'caleb-cross'
     OR lower(trim(name)) = 'caleb cross'
     OR lower(trim(coalesce(alias, ''))) = 'six second judgment';

  IF candidate_count > 1 THEN
    RAISE EXCEPTION
      'Caleb Cross migration found % candidates; manual reconciliation is required',
      candidate_count;
  ELSIF candidate_count = 0 THEN
    INSERT INTO public.characters (slug, name, alias)
    VALUES ('caleb-cross', 'Caleb Cross', 'Six Second Judgment')
    RETURNING id INTO caleb_id;
  END IF;

  UPDATE public.characters
  SET
    slug = 'caleb-cross',
    name = 'Caleb Cross',
    alias = 'Six Second Judgment',
    role = 'Antagonist',
    story_id = story_one_id,
    primary_story_id = story_one_id,
    eyebrow = 'Story 1 · Season 2 · Antagonist',
    tagline = 'Nothing is faster than his shot.',
    canon_summary_md = $md$Caleb Cross is a cowboy-style gunslinger and minor Story 1 villain who hunts Rush during Season 2. He wants to collect a bounty and prove that nothing is faster than his shot.

Caleb exists as a precision threat rather than a raw-power threat. His judgment shots are fast enough that Rush cannot simply rely on outrunning the projectile. Rush must react to Caleb's aim, avoid the line of fire, and approach carefully.$md$,
    identity_md = $md$**Name:** Caleb Cross

**Alias:** Six Second Judgment

**Classification:** Antagonist; minor villain

**Primary Story:** Story 1

**Story Placement:** Season 2

## Appearance

Caleb is a cowboy / gunslinger figure. No additional physical description is established.

## Personality and Motivation

Caleb is competitive, reputation-driven, and bounty motivated. He wants to prove that nothing is faster than his shot.

## Skills

- Firearm use
- Gunslinger-style combat
- Precision shooting
- Bounty hunting / target pursuit$md$,
    story_role_md = $md$Caleb appears as a minor villain before the midpoint of Story 1, Season 2.

His narrative function is fight scaling. He demonstrates that Rush's increasing speed does not remove the need for prediction, positioning, caution, and combat intelligence.$md$,
    core_conflict_md = NULL,
    spoiler_md = NULL,
    portrait_url = NULL,
    accent_color = NULL,
    canon_status = 'canon',
    last_synced_at = '2026-08-10T12:00:00-04:00'::timestamptz,
    status = 'published',
    archived_at = NULL
  WHERE id = caleb_id;

  DELETE FROM public.character_stories
  WHERE character_id = caleb_id
    AND story_id <> story_one_id;

  INSERT INTO public.character_stories (character_id, story_id, role)
  VALUES (
    caleb_id,
    story_one_id,
    'Season 2 minor villain and fight-scaling opponent'
  )
  ON CONFLICT (character_id, story_id) DO UPDATE
  SET role = EXCLUDED.role;

  -- The export establishes no progression, key moments, quotes, or story-note
  -- rows beyond the profile-level Story 1 role above.
  DELETE FROM public.character_eras WHERE character_id = caleb_id;
  DELETE FROM public.character_story_notes WHERE character_id = caleb_id;
  DELETE FROM public.character_key_moments WHERE character_id = caleb_id;
  DELETE FROM public.character_quotes WHERE character_id = caleb_id;
  DELETE FROM public.character_factions WHERE character_id = caleb_id;

  INSERT INTO public.power_systems
    (slug, name, summary_md, spoiler_md, canon_status, notion_source_url, last_synced_at)
  VALUES (
    'judgment-shot',
    'Judgment Shot',
    'A near-instant enhanced firearm shot. Up to six charged rounds can be fired through one firearm before the gun breaks or becomes unusable.',
    NULL,
    'canon',
    NULL,
    '2026-08-10T12:00:00-04:00'::timestamptz
  )
  ON CONFLICT (slug) DO NOTHING;

  SELECT id INTO STRICT judgment_shot_id
  FROM public.power_systems
  WHERE slug = 'judgment-shot';

  DELETE FROM public.character_powers
  WHERE character_id = caleb_id
    AND power_system_id <> judgment_shot_id;

  INSERT INTO public.character_powers (character_id, power_system_id, notes)
  VALUES (
    caleb_id,
    judgment_shot_id,
    'Caleb can charge a firearm and fire a near-instant enhanced shot. The shots are faster than Rush at this point in Season 2. He can fire up to six charged rounds through a firearm; after six, the gun breaks or becomes unusable and he must obtain or switch to a new gun. Rush must evade where Caleb is pointing rather than try to outrun a fired projectile. Caleb''s advantage is based on shot speed, aim, timing, and positioning rather than superior overall speed.'
  )
  ON CONFLICT (character_id, power_system_id) DO UPDATE
  SET notes = EXCLUDED.notes;

  -- Caleb has exactly one established outgoing relationship in this export.
  DELETE FROM public.character_relationships
  WHERE character_id = caleb_id
    AND related_character_id <> rush_id;

  INSERT INTO public.character_relationships
    (id, character_id, related_character_id, relation_label, inverse_label, sort_order, is_spoiler)
  VALUES (
    'ca1eb001-0000-4000-8000-000000000001'::uuid,
    caleb_id,
    rush_id,
    'Target / opponent',
    NULL,
    1,
    false
  )
  ON CONFLICT (character_id, related_character_id) DO UPDATE
  SET
    relation_label = EXCLUDED.relation_label,
    inverse_label = EXCLUDED.inverse_label,
    sort_order = EXCLUDED.sort_order,
    is_spoiler = EXCLUDED.is_spoiler;
END $$;
