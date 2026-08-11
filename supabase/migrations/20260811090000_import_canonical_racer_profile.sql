-- Import only the canonical Racer profile from Storybook Codex Character
-- Migration Batch 01.
-- Source: https://app.notion.com/p/38ea0ec99e0980739ef1ef3ea7e91ea9
--
-- The source concept art was copied into permanent project storage at
-- /images/characters/racer-concept.png. No temporary signed URL is persisted.

DO $$
DECLARE
  racer_id uuid;
  rush_id uuid;
  story_one_id uuid;
  acceleration_id uuid;
  candidate_count integer;
BEGIN
  SELECT id INTO STRICT story_one_id FROM public.stories WHERE slug = 'rush';
  SELECT id INTO STRICT rush_id FROM public.characters WHERE slug = 'rush';

  SELECT count(*), (array_agg(id))[1]
  INTO candidate_count, racer_id
  FROM public.characters
  WHERE slug = 'racer' OR lower(trim(name)) = 'racer';

  IF candidate_count > 1 THEN
    RAISE EXCEPTION
      'Racer migration found % candidates; manual reconciliation is required',
      candidate_count;
  ELSIF candidate_count = 0 THEN
    INSERT INTO public.characters (slug, name, alias)
    VALUES ('racer', 'Racer', NULL)
    RETURNING id INTO racer_id;
  END IF;

  UPDATE public.characters
  SET
    slug = 'racer',
    name = 'Racer',
    alias = NULL,
    role = 'Supporting Character',
    story_id = story_one_id,
    primary_story_id = story_one_id,
    eyebrow = 'Story 1 · Supporting Character · Founding Crew Member',
    tagline = 'His dream is simply to go faster than anyone else.',
    canon_summary_md = $md$Racer is one of Rush's earliest allies and a founding member of the original crew. He is a powered street racer, mechanic, and getaway specialist whose Omega-derived ability allows him to amplify the acceleration of nearly any object or vehicle he operates.

Charismatic, cocky, energetic, and loyal, Racer lives for movement, danger, machines, and impossible challenges. Unlike Rush, he has little interest in fame or leadership. His dream is simply to go faster than anyone else.$md$,
    identity_md = $md$**Primary Name:** Racer

**Real Name:** TBD

**Age:** Early twenties

**Height:** Approximately 5'10"

**Occupation / Function:** Street racer, mechanic, getaway specialist

**Alignment / Story Function:** Supporting Character; early Rush ally

## Appearance

Racer has a lean runner's physique with light muscular definition, built for agility rather than brute strength. He wears a modern textured mohawk with short faded sides and dark hair with subtle silver or blue highlights.

His face shows a slightly crooked nose from previous crashes, small facial scars, a scar through one eyebrow, a split lower lip, and two or three gold replacement teeth visible when he smiles.

His accessories include oil-slick mirrored sunglasses, fingerless driving gloves, a racing watch, and a custom key fob clipped to his belt. He wears a fitted racing-style jacket with small fictional sponsor patches, a dark fitted shirt, racing pants, and low-profile driving shoes. The design draws from professional motorsports while remaining grounded in street culture.

## Personality

Racer is charismatic, cocky, energetic, reckless, loyal, and a friendly competitor. He laughs easily, enjoys danger, and often acts before thinking. He is motivated by freedom, adrenaline, machines, movement, exploration, and challenge rather than greed.

## Skills

- Exceptional driving
- Street racing
- Mechanics
- Vehicle modification
- Getaway driving
- Handling a wide range of vehicles
- High-risk maneuvering

## Signature Vehicle and Garage

Racer's signature vehicle is a customized black Nissan GT-R (R35). It is heavily modified over time and functions as his personal masterpiece. Racer values customization and skill over luxury.

His private garage contains vehicles from different stages of his life and functions as a timeline of his growth rather than a trophy room.$md$,
    story_role_md = $md$In Season 1, Racer's worldview centers on adrenaline and speed. He becomes known for public races with Rush and serves as an ally, driver, mechanic, getaway specialist, and founding member of the original crew.

Racer represents freedom through movement. While Rush explores freedom through responsibility, Racer explores freedom through exploration.$md$,
    core_conflict_md = NULL,
    spoiler_md = $md$## Season 2 — Speed as Rescue

The Purple War changes Racer's understanding of speed. He begins using it for rescue, civilian transportation, supply delivery, and rebuilding. His outlook becomes: **“I can use my speed to save people.”**

## Season 3 — Speed as Human Advancement

Racer gradually distances himself from organized crime and works more closely with engineers and mechanics. A NASA-like space agency eventually recruits him to assist with experimental launch systems. His acceleration-enhancing ability helps humanity rebuild its space program and return to space. His outlook becomes: **“My speed can move humanity forward.”**

By the end of Season 3, Racer lives above or beside an auto repair shop owned by his girlfriend. Her name is not established.

Racer's passion never disappears; its purpose changes from adrenaline, to rescue, to human advancement.$md$,
    portrait_url = '/images/characters/racer-concept.png',
    accent_color = NULL,
    notion_page_id = '38ea0ec9-9e09-8073-9ef1-ef3ea7e91ea9'::uuid,
    notion_source_url = 'https://app.notion.com/p/38ea0ec99e0980739ef1ef3ea7e91ea9',
    canon_status = 'canon',
    last_synced_at = '2026-08-11T09:00:00-04:00'::timestamptz,
    status = 'published',
    archived_at = NULL
  WHERE id = racer_id;

  DELETE FROM public.character_stories
  WHERE character_id = racer_id AND story_id <> story_one_id;

  INSERT INTO public.character_stories (character_id, story_id, role)
  VALUES (racer_id, story_one_id,
    'Supporting character, early Rush ally, and founding crew member')
  ON CONFLICT (character_id, story_id) DO UPDATE SET role = EXCLUDED.role;

  DELETE FROM public.character_eras WHERE character_id = racer_id;
  INSERT INTO public.character_eras
    (id, character_id, era_label, identity, function_md, story_id, sort_order, is_spoiler)
  VALUES
    ('ace10001-0000-4000-8000-000000000001', racer_id,
     'Season 1', 'Speed as adrenaline',
     'Lives for movement, public races, machines, danger, and impossible challenges while serving as Rush’s ally, driver, mechanic, and getaway specialist.',
     story_one_id, 1, false),
    ('ace10001-0000-4000-8000-000000000002', racer_id,
     'Season 2', 'Speed as rescue',
     'The Purple War changes his understanding of speed; he transports civilians, delivers supplies, and assists rebuilding efforts.',
     story_one_id, 2, true),
    ('ace10001-0000-4000-8000-000000000003', racer_id,
     'Season 3', 'Speed as human advancement',
     'Distances himself from organized crime, works with engineers and mechanics, and helps humanity rebuild its space program.',
     story_one_id, 3, true);

  DELETE FROM public.character_story_notes WHERE character_id = racer_id;
  DELETE FROM public.character_key_moments WHERE character_id = racer_id;
  DELETE FROM public.character_quotes WHERE character_id = racer_id;
  INSERT INTO public.character_quotes
    (id, character_id, quote_md, context_md, sort_order, is_spoiler)
  VALUES
    ('ace10002-0000-4000-8000-000000000001', racer_id,
     'The driver makes the car.', 'Racer’s philosophy on customization and skill.', 1, false),
    ('ace10002-0000-4000-8000-000000000002', racer_id,
     'I want to go faster.', 'Season 1', 2, false),
    ('ace10002-0000-4000-8000-000000000003', racer_id,
     'I can use my speed to save people.', 'Season 2', 3, true),
    ('ace10002-0000-4000-8000-000000000004', racer_id,
     'My speed can move humanity forward.', 'Season 3', 4, true);

  DELETE FROM public.character_factions WHERE character_id = racer_id;

  INSERT INTO public.power_systems
    (slug, name, summary_md, spoiler_md, canon_status, notion_source_url, last_synced_at)
  VALUES (
    'acceleration-manipulation',
    'Acceleration Manipulation',
    'The ability to dramatically increase the rate at which an object accelerates. Its defining quality is how quickly Racer or a target object reaches speed, not simply maximum-speed enhancement.',
    NULL,
    'canon',
    'https://app.notion.com/p/38ea0ec99e0980739ef1ef3ea7e91ea9',
    '2026-08-11T09:00:00-04:00'::timestamptz
  )
  ON CONFLICT (slug) DO NOTHING;

  SELECT id INTO STRICT acceleration_id
  FROM public.power_systems WHERE slug = 'acceleration-manipulation';

  DELETE FROM public.character_powers
  WHERE character_id = racer_id AND power_system_id <> acceleration_id;
  INSERT INTO public.character_powers (character_id, power_system_id, notes)
  VALUES (
    racer_id,
    acceleration_id,
    'Racer dramatically increases how quickly an object accelerates. He commonly applies the ability to himself, but specializes in transferring acceleration into vehicles and machinery including cars, motorcycles, trucks, bicycles, skateboards, boats, and aircraft. The source defines no stamina cost, cooldown, maximum multiplier, mass threshold, or technical ceiling.'
  )
  ON CONFLICT (character_id, power_system_id) DO UPDATE SET notes = EXCLUDED.notes;

  DELETE FROM public.character_relationships
  WHERE character_id = racer_id AND related_character_id <> rush_id;
  INSERT INTO public.character_relationships
    (id, character_id, related_character_id, relation_label, inverse_label, sort_order, is_spoiler)
  VALUES (
    'ace10003-0000-4000-8000-000000000001', racer_id, rush_id,
    'Ally / friend / founding crew connection', NULL, 1, false
  )
  ON CONFLICT (character_id, related_character_id) DO UPDATE
  SET relation_label = EXCLUDED.relation_label,
      inverse_label = EXCLUDED.inverse_label,
      sort_order = EXCLUDED.sort_order,
      is_spoiler = EXCLUDED.is_spoiler;
END $$;
