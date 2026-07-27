-- Import the canonical Room profile from the Master Lore Index.
-- Source: https://app.notion.com/p/f27ae0d020624008b1485deae3d7a3a3
--
-- Room's Notion images are temporary signed URLs. They are deliberately not
-- stored here; portrait_url remains unchanged on an existing placeholder and
-- NULL on a new row.

DO $$
DECLARE
  room_id uuid;
  rush_id uuid;
  giver_id uuid;
  story_one_id uuid;
  teleportation_id uuid;
BEGIN
  SELECT id INTO STRICT story_one_id
  FROM public.stories
  WHERE slug = 'rush';

  -- Prefer the canonical slug, then the Notion identity, then a placeholder
  -- whose name or alias is Room. This reuses an existing row instead of
  -- creating a duplicate.
  SELECT id INTO room_id
  FROM public.characters
  WHERE slug = 'room'
     OR notion_page_id = 'f27ae0d0-2062-4008-b148-5deae3d7a3a3'
     OR lower(trim(name)) = 'room'
     OR lower(trim(coalesce(alias, ''))) = 'room'
  ORDER BY
    CASE
      WHEN slug = 'room' THEN 0
      WHEN notion_page_id = 'f27ae0d0-2062-4008-b148-5deae3d7a3a3' THEN 1
      ELSE 2
    END,
    created_at
  LIMIT 1;

  IF room_id IS NULL THEN
    INSERT INTO public.characters (slug, name, alias)
    VALUES ('room', 'Unknown', 'Room')
    RETURNING id INTO room_id;
  END IF;

  UPDATE public.characters
  SET
    slug = 'room',
    name = 'Unknown',
    alias = 'Room',
    role = 'Major ally of Rush and underground transporter',
    story_id = story_one_id,
    primary_story_id = story_one_id,
    eyebrow = 'Story 1 · Major Ally',
    tagline = 'A cold, strategic underground transporter who bends controlled spaces to escape the Giver’s influence.',
    canon_summary_md = $md$**Room** is an alias; his real name is unknown. A mixed-race (Black and white) underground transporter, he uses pocket-space teleportation to move goods and people through the criminal underworld. The mysterious Giver granted his powers and initially controlled his operations.

Room is cold, shrewd, intelligent, and strategic, but he forms a genuine partnership with Rush. His drive for independence leads him toward the dangerous crystal trade, where he hopes to build a power base beyond the Giver’s control. He is a major ally of Rush in Story 1.$md$,
    identity_md = $md$**Alias:** Room

**Real Name:** Unknown

**Race / Ethnicity:** Mixed race (Black and white)

**Occupation:** Underground transporter

**Primary Story:** Story 1

**Role:** Major ally of Rush

## Appearance

Room dresses to remain inconspicuous and ready for quick escapes. Dark, practical clothing covers everything except his eyes: a face mask matched to his clothing, protective gloves for handling boxes and other materials, boots suited to quick movement, a sleek jacket with urban designs, and baggy pants. He has sharp features and a calm, calculated demeanor.

His palette parallels Rush’s but is darker, centered on deep navy blue.$md$,
    story_role_md = $md$Room begins Story 1 as a reliable underground transporter working for the Giver. When he is sent to retrieve stolen crystals, he meets Rush, recognizes the young man’s potential, and proposes a partnership. Their combined operations use Room’s teleportation for heists and escapes while mutual distrust gradually becomes reliance on each other’s strengths.

Room’s ambitions in the crystal trade bring pressure from rival gangs, law enforcement, other crystal-seeking groups, and potentially the Giver. His knowledge of six types of energized crystals—and his belief that the trade can secure his independence—drives much of his narrative.$md$,
    core_conflict_md = $md$Room wants independence from the Giver, but the power, access, and criminal work on which he relies were shaped by the Giver’s control. His calculated need for autonomy pushes him into a volatile crystal trade where genuine trust may be as necessary as strategy.$md$,
    spoiler_md = $md$## Background and Motivation

Room received his teleportation powers from the mysterious figure known as the Giver. The details of that transaction and the Giver’s motives remain secret. Room built a reputation as an efficient, reliable transporter of goods and services in the criminal underworld, but he is dissatisfied with the Giver’s control. He sees the crystal trade as a route to power and independence.

## Powers and Abilities — Episode 9 Baseline

### Pocket-Space Teleportation

Room creates a warped-space bubble roughly 20 by 20 feet at his current level. He can displace himself, objects, and people inside it to a location he knows, has seen, or can visualize. Waves of distortion pour outward like heat ripples bending reality. Unlike Jennifer’s instant “blink” teleportation, Room’s power is controlled and localized—he reshuffles a bounded space.

He can also open a portal to his personal pocket dimension and create anchors others can use, allowing that space to serve as a transportation hub.

### Spatial Awareness

Room constantly knows what is inside his bubble, including objects, weight, and airflow. This passive 360-degree mental map makes ambushes difficult even when he is not consciously teleporting.

### Reflex Augmentation and Danger Sense

His spatial mapping gives him faster-than-human reactions, though not reactions on Rush’s level. Under stress, his awareness warns him when bullets, strikes, explosions, or other threats are about to intrude into his space. This is spatial threat detection, not precognition.

### Strengths

Room’s mobility, surprise, precision, intelligence, and habit of thinking several steps ahead make him valuable in escapes, stealth operations, and tactical encounters.

## Combat Style

Room avoids killing because he considers it messy and likely to create further consequences. He negotiates first, uses trickery second, escapes third, and fights last. When forced to fight, he favors non-lethal takedowns: tasers, chokeholds, or teleporting opponents into walls or ceilings with only enough force to incapacitate them.

## Personality

Room is cold, shrewd, ambitious, analytical, and sparing with emotion. Despite that reserve, his partnership with Rush is genuine, and he recognizes the value of combining their strengths.

## Limitations and Unconfirmed Possibilities

The canonical page proposes—but does **not** confirm—that teleportation may require Room to see, know, or accurately visualize a destination, or that his range may be limited in some circumstances. It also proposes that a wrong or incomplete mental image could cause failure or the dangerous placement of matter into a solid object. These remain possible constraints or foreshadowing, not established canon.

## Development Notes and Foreshadowing

The page proposes that Room may eventually balance his cold strategy with genuine alliance and trust as his relationship with Rush deepens. It also foreshadows that the Giver’s enhancement could allow Room’s current room-sized field to grow to city-block or even dimensional scale, but Room does not yet understand that possible potential. Neither future growth nor the proposed endpoint of his emotional development is confirmed.

Thematically, Rush expands outward through speed and space-time distortion while Room expands inward through controlled spaces and potentially larger domains; they represent opposing philosophies of motion.$md$,
    accent_color = '#172554',
    canon_status = 'canon',
    notion_source_url = 'https://app.notion.com/p/f27ae0d020624008b1485deae3d7a3a3',
    notion_page_id = 'f27ae0d0-2062-4008-b148-5deae3d7a3a3',
    last_synced_at = '2026-07-23T00:00:00-04:00'::timestamptz,
    status = 'published',
    archived_at = NULL
  WHERE id = room_id;

  -- Replace temporary/incomplete Room detail rows while leaving every Rush row
  -- intact.
  DELETE FROM public.character_eras WHERE character_id = room_id;
  DELETE FROM public.character_story_notes WHERE character_id = room_id;
  DELETE FROM public.character_key_moments WHERE character_id = room_id;
  DELETE FROM public.character_quotes WHERE character_id = room_id;
  DELETE FROM public.character_relationships WHERE character_id = room_id;
  DELETE FROM public.character_stories WHERE character_id = room_id;
  DELETE FROM public.character_powers WHERE character_id = room_id;

  INSERT INTO public.character_stories (character_id, story_id, role)
  VALUES (room_id, story_one_id, 'Major ally of Rush; underground transporter');

  INSERT INTO public.character_eras
    (character_id, era_label, identity, function_md, story_id, sort_order, is_spoiler)
  VALUES
    (room_id, 'Story 1 — Introduction', 'The Giver’s underground transporter',
     'A controlled and reliable criminal transporter who wants to escape the Giver’s influence.', story_one_id, 1, false),
    (room_id, 'Story 1 — Partnership', 'Rush’s major ally and crystal-trade partner',
     'Room combines his spatial control with Rush’s speed while distrust begins to develop into a genuine alliance.', story_one_id, 2, true),
    (room_id, 'Possible Future — Unconfirmed', 'Independent operator with a larger spatial domain',
     'The source page proposes greater power scale and deeper trust, but treats both as future possibility rather than confirmed canon.', story_one_id, 3, true);

  INSERT INTO public.character_story_notes
    (character_id, story_id, role_label, summary_md, sort_order, is_spoiler)
  VALUES
    (room_id, story_one_id, 'Major ally of Rush / underground transporter',
     $md$Room is introduced transporting for the Giver and demonstrating controlled pocket-space teleportation. A mission to recover stolen crystals brings him into conflict with Rush; seeing Rush’s potential and pursuing his own independence, Room proposes a partnership.

They target groups holding crystals, using Room’s abilities for heists, tactical control, and escapes. Room’s attempt to establish himself in the crystal trade faces rival gangs, law enforcement, other interested entities, and the threat of renewed control or confrontation from the Giver. The season outline proposes growing trust between Room and Rush without treating the relationship’s later depth as settled.$md$,
     1, true);

  INSERT INTO public.character_key_moments
    (character_id, title, story_id, summary_md, sort_order, is_spoiler)
  VALUES
    (room_id, 'Working as the Giver’s Transporter', story_one_id,
     'Room is introduced as an efficient underground transporter whose powers and early operations are controlled by the Giver.', 1, false),
    (room_id, 'Meeting Rush', story_one_id,
     'Sent to retrieve stolen crystals, Room encounters Rush, recognizes his potential, and proposes a partnership.', 2, true),
    (room_id, 'Entering the Crystal Trade', story_one_id,
     'Room and Rush begin targeting groups with crystal supplies, using Room’s spatial abilities to support heists and escapes.', 3, true),
    (room_id, 'Building Trust with Rush', story_one_id,
     'The initially distrustful partners begin to understand and rely on each other’s strengths; the eventual depth of that trust remains developmental material.', 4, true),
    (room_id, 'Drawing the Giver’s Attention', story_one_id,
     'Room’s independent actions may lead to confrontation and revelations about his past with the Giver; the canonical outline presents this as a potential development.', 5, true);

  INSERT INTO public.character_quotes
    (character_id, quote_md, context_md, sort_order, is_spoiler)
  VALUES
    (room_id, 'Dead men don’t pay debts.',
     'Room’s non-lethal combat philosophy: negotiation first, trickery second, escape third, and fighting last.', 1, false);

  INSERT INTO public.power_systems
    (slug, name, summary_md, canon_status, notion_source_url, last_synced_at)
  VALUES
    ('pocket-space-teleportation', 'Pocket-Space Teleportation',
     'Controlled displacement through a bounded warped-space field and a personal pocket dimension.',
     'canon', 'https://app.notion.com/p/f27ae0d020624008b1485deae3d7a3a3',
     '2026-07-23T00:00:00-04:00'::timestamptz)
  ON CONFLICT (slug) DO NOTHING;

  SELECT id INTO STRICT teleportation_id
  FROM public.power_systems
  WHERE slug = 'pocket-space-teleportation';

  INSERT INTO public.character_powers (character_id, power_system_id, notes)
  VALUES (
    room_id,
    teleportation_id,
    'Episode 9 baseline: a roughly 20x20-foot warped-space bubble, pocket-dimension portals and anchors, passive spatial awareness, augmented reflexes, and spatial danger sense. Destination knowledge/visualization, range limits, failure modes, and future growth are explicitly unconfirmed possibilities.'
  );

  SELECT id INTO STRICT rush_id
  FROM public.characters
  WHERE slug = 'rush';

  INSERT INTO public.character_relationships
    (character_id, related_character_id, relation_label, inverse_label, sort_order, is_spoiler)
  VALUES
    (room_id, rush_id, 'Genuine partner and major ally', 'Partner and major ally', 1, true);

  -- The relationship schema only accepts character targets. Reuse a Giver row
  -- when present; otherwise create the smallest possible non-published
  -- placeholder, without inventing a real name, motives, or other details.
  SELECT id INTO giver_id
  FROM public.characters
  WHERE slug = 'giver'
     OR lower(trim(name)) IN ('giver', 'the giver')
     OR lower(trim(coalesce(alias, ''))) IN ('giver', 'the giver')
  ORDER BY CASE WHEN slug = 'giver' THEN 0 ELSE 1 END, created_at
  LIMIT 1;

  IF giver_id IS NULL THEN
    INSERT INTO public.characters (
      slug, name, alias, role, eyebrow, tagline, canon_summary_md, identity_md,
      story_role_md, canon_status, status, accent_color
    )
    VALUES (
      'giver', 'Unknown', 'The Giver', 'Mysterious power-granting controller',
      'Story 1 · Mysterious Figure',
      'The mysterious figure who granted Room’s powers and controlled his early operations.',
      'The Giver is a mysterious figure who granted Room his teleportation powers. The transaction, the Giver’s motives, and further identity details are unknown.',
      '**Known Alias:** The Giver\n\n**Real Name:** Unknown',
      'The Giver controls Room’s early operations. Room’s desire to escape that influence drives his pursuit of independence.',
      'canon', 'needs_review', '#312e81'
    )
    RETURNING id INTO giver_id;
  END IF;

  INSERT INTO public.character_relationships
    (character_id, related_character_id, relation_label, inverse_label, sort_order, is_spoiler)
  VALUES
    (room_id, giver_id, 'Power source and controlling figure', 'Empowered and controlled transporter', 2, true);
END $$;
