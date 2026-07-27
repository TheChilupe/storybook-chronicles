-- Import the canonical Jennifer profile from the Master Lore Index.
-- Source: https://app.notion.com/p/c2a733353e1b4469aebac9e978e6b77e
--
-- Jennifer's Notion image is exposed through a temporary signed URL. It is
-- deliberately not stored here: portrait_url remains unchanged on a reused
-- row and NULL on a new row.

DO $$
DECLARE
  jennifer_id uuid;
  giver_id uuid;
  fez_id uuid;
  rush_id uuid;
  story_one_id uuid;
  teleportation_id uuid;
BEGIN
  SELECT id INTO STRICT story_one_id
  FROM public.stories
  WHERE slug = 'rush';

  -- Prefer the canonical slug, then the Notion identity, then an existing
  -- placeholder named Jennifer. Reusing a row avoids a duplicate character.
  SELECT id INTO jennifer_id
  FROM public.characters
  WHERE slug = 'jennifer'
     OR notion_page_id = 'c2a73335-3e1b-4469-aeba-c9e978e6b77e'
     OR lower(trim(name)) = 'jennifer'
     OR lower(trim(coalesce(alias, ''))) = 'jennifer'
  ORDER BY
    CASE
      WHEN slug = 'jennifer' THEN 0
      WHEN notion_page_id = 'c2a73335-3e1b-4469-aeba-c9e978e6b77e' THEN 1
      ELSE 2
    END,
    created_at
  LIMIT 1;

  IF jennifer_id IS NULL THEN
    INSERT INTO public.characters (slug, name)
    VALUES ('jennifer', 'Jennifer')
    RETURNING id INTO jennifer_id;
  END IF;

  UPDATE public.characters
  SET
    slug = 'jennifer',
    name = 'Jennifer',
    alias = NULL,
    role = 'Story 1 antagonist and recurring wild card',
    story_id = story_one_id,
    primary_story_id = story_one_id,
    eyebrow = 'Story 1 · Antagonist · Recurring Wild Card',
    tagline = 'A ruthless survivor whose blink teleportation, ambition, and tactical manipulation make every alliance conditional.',
    canon_summary_md = $md$**Jennifer** is a 26-year-old thief, Story 1 antagonist, and recurring wild card. At fourteen she ran away from home and became a victim of human trafficking. The experience hardened her survival instinct and taught her to pursue safety through power, leverage, and control.

She survived through theft, eventually stealing a blue crystal from the Giver. He offered her work in exchange for participating in his experiments, which gave her teleportation. Jennifer is ambitious, wild, cunning, and unpredictable. Although she usually acts in her own interest, she can cooperate temporarily when doing so advances her immediate goals; that pragmatism does not make her an ally or imply a redemption arc.$md$,
    identity_md = $md$**Name:** Jennifer

**Age:** 26

**Primary Story:** Story 1

**Classification:** Antagonist; recurring wild card

## Appearance

Jennifer is attractive and confident, with a wild and unpredictable demeanor. She wears practical but provocative street clothing suited to quick escapes and high-action situations, deliberately using her physical appeal as one of her tools for distracting and manipulating others.

## Background

Jennifer ran away from home at fourteen and became a victim of human trafficking. That traumatic past hardened her and shaped a ruthless survivor’s mentality. She turned to thievery to stay alive, developing the skill and cunning that eventually allowed her to steal a blue crystal from the Giver.

The theft brought her to the Giver’s attention. He offered her a job in exchange for participation in his experiments; she accepted and gained teleportation powers.$md$,
    story_role_md = $md$Jennifer enters Story 1 as the wild card in the bank robbery that Rush stops. She is a main antagonist to Rush: their encounters test her existing line-of-sight teleportation and lead to the development of energy sensing, which expands the destinations she can reach.

Her ambition is to accumulate enough power that she can never again be subjugated. She plans heists, pursues valuable items and crystals, and draws Fez into a criminal partnership in which she uses him as muscle for the gang she wants to build. Their connection includes partnership, seduction, manipulation, and exploitation; it is not presented as a healthy romance.

Jennifer remains unpredictable and self-interested. She may temporarily cooperate with Rush, other antagonists, or anyone else when a shared objective benefits her, but those arrangements are conditional rather than evidence of loyalty, heroism, or redemption. Broad future alliances, betrayals, and claims about her underworld influence remain development material unless separately confirmed.$md$,
    core_conflict_md = $md$Jennifer wants enough power and control to ensure that no one can subjugate her again, but the ruthless survival methods she learned after exploitation lead her to manipulate and exploit other people—including Fez—in pursuit of that security.$md$,
    spoiler_md = $md$## Motivations and Personality

Jennifer is fiercely ambitious, wild, cunning, and difficult to predict. Her central motivation is to become powerful enough that she can never again be controlled or victimized. Her traumatic past created a ruthless survivor’s mentality: she will do whatever she believes is necessary to reach her goals.

Her morality is complex but consistently self-interested. She can show empathy and cooperate with others when doing so aligns with her goals. Such cooperation is temporary and transactional; it does not change her classification as an antagonist.

## Powers and Limitations

### Teleportation — Initial Range

Jennifer begins with instant “blink” teleportation to any destination within her line of sight. Line of sight is the defining early limitation: without seeing a destination, she cannot initially teleport to it.

### Energy Sensing — Later Expansion

After facing Rush, Jennifer develops the ability to sense energy. This expands her teleportation reach beyond direct sight to places she can sense within roughly **300 feet**. The later ability increases her options but remains locally range-bound by what she can sense; it is not unlimited travel.

### Combat Tactics

Jennifer combines teleportation with physical attacks and environmental hazards. She changes angles without warning, evades retaliation, and can teleport other people with her, placing them in dangerous positions or situations. Outside direct combat, she uses charm, sexual appeal, distraction, and cunning to manipulate adversaries and partners.

## Relationship Context

- **The Giver:** Jennifer stole one of his blue crystals. He then offered her a job in exchange for experimental participation, becoming both the source of her powers and someone who treats her as a useful asset and test subject. Their relationship is transactional and based on mutual benefit.
- **Fez:** Jennifer’s partner, initially on equal footing. She seduces and manipulates him into serving as muscle for the gang she wants to build. Their dynamic mixes practical partnership with manipulation and exploitation and must not be simplified into a healthy romance.
- **Rush:** One of Jennifer’s principal adversaries. Their shared connection to energy crystals creates a distinctive link, and their battles contribute to her energy-sensing development. She can be a resource or a hindrance and may cooperate temporarily when their interests align, while remaining an antagonist.

## Development Material

The canonical page proposes continued gang-building, strategic heists, power struggles, interactions with other villains, temporary alliances, betrayals, and growing underworld significance. These are arc directions rather than a license to assert additional completed events, later-story appearances, stable alliances, or redemption.$md$,
    accent_color = '#7c3aed',
    canon_status = 'canon',
    notion_source_url = 'https://app.notion.com/p/c2a733353e1b4469aebac9e978e6b77e',
    notion_page_id = 'c2a73335-3e1b-4469-aeba-c9e978e6b77e',
    last_synced_at = '2026-07-26T19:00:00-04:00'::timestamptz,
    status = 'published',
    archived_at = NULL
  WHERE id = jennifer_id;

  -- Replace only Jennifer's temporary/incomplete details. Rush and Room rows,
  -- including their own relationships and powers, remain untouched.
  DELETE FROM public.character_eras WHERE character_id = jennifer_id;
  DELETE FROM public.character_story_notes WHERE character_id = jennifer_id;
  DELETE FROM public.character_key_moments WHERE character_id = jennifer_id;
  DELETE FROM public.character_quotes WHERE character_id = jennifer_id;
  DELETE FROM public.character_relationships WHERE character_id = jennifer_id;
  DELETE FROM public.character_stories WHERE character_id = jennifer_id;
  DELETE FROM public.character_powers WHERE character_id = jennifer_id;

  INSERT INTO public.character_stories (character_id, story_id, role)
  VALUES (
    jennifer_id,
    story_one_id,
    'Antagonist and recurring wild card; conditional temporary collaborator'
  );

  INSERT INTO public.character_eras
    (character_id, era_label, identity, function_md, story_id, sort_order, is_spoiler)
  VALUES
    (jennifer_id, 'Before Story 1', 'Runaway survivor and skilled thief',
     'After exploitation beginning at age fourteen, Jennifer survives through theft and develops a ruthless need for power and control.', story_one_id, 1, true),
    (jennifer_id, 'Story 1 — Introduction', 'Line-of-sight teleporter and bank-robbery wild card',
     'Jennifer enters as an unpredictable antagonist whose instant teleportation is initially limited to visible destinations.', story_one_id, 2, false),
    (jennifer_id, 'Story 1 — Power Development', 'Energy-sensing teleporter',
     'Her encounters with Rush lead to energy sensing, extending teleportation to sensed destinations within roughly 300 feet.', story_one_id, 3, true),
    (jennifer_id, 'Story 1 — Recurring Role', 'Gang-builder and conditional collaborator',
     'She pursues power with Fez as partner and exploited muscle, remaining an antagonist who cooperates only when immediate interests align.', story_one_id, 4, true);

  INSERT INTO public.character_story_notes
    (character_id, story_id, role_label, summary_md, sort_order, is_spoiler)
  VALUES (
    jennifer_id,
    story_one_id,
    'Antagonist / recurring wild card',
    $md$Jennifer is introduced during the bank robbery stopped by Rush, demonstrating line-of-sight teleportation, physical combat, tactical repositioning, and manipulation. Their conflict contributes to the emergence of her energy-sensing ability, expanding her teleportation reach to sensed locations within roughly 300 feet.

She aims to build enough power to become untouchable. She draws Fez into a gang-building partnership and uses his strength in planned heists, but their dynamic also involves seduction, manipulation, and exploitation. Jennifer remains a recurring antagonist whose cooperation with others is temporary and self-serving.

The source outlines possible future heists, alliances, betrayals, villain interactions, and underworld power struggles. Those broad directions are retained as development material rather than asserted as completed canon.$md$,
    1,
    true
  );

  INSERT INTO public.character_key_moments
    (character_id, title, story_id, summary_md, sort_order, is_spoiler)
  VALUES
    (jennifer_id, 'Stealing the Giver’s Blue Crystal', story_one_id,
     'Jennifer’s theft brings her to the Giver’s attention; she accepts work and experimental participation in exchange for power.', 1, true),
    (jennifer_id, 'The Story 1 Bank Robbery', story_one_id,
     'Jennifer is introduced as the robbery’s wild card, using instant line-of-sight teleportation and manipulation before Rush stops the crime.', 2, false),
    (jennifer_id, 'Developing Energy Sensing', story_one_id,
     'After facing Rush, Jennifer gains energy sensing and can teleport to places she senses within roughly 300 feet, expanding beyond direct sight without becoming unlimited.', 3, true),
    (jennifer_id, 'Recruiting Fez as Muscle', story_one_id,
     'Jennifer turns an initially equal partnership into a dynamic where seduction and manipulation help her exploit Fez as muscle for the gang she wants to build.', 4, true);

  INSERT INTO public.power_systems
    (slug, name, summary_md, canon_status, notion_source_url, last_synced_at)
  VALUES
    ('blink-teleportation', 'Blink Teleportation',
     'Instant teleportation that begins with line-of-sight destinations and later expands through short-range energy sensing.',
     'canon', 'https://app.notion.com/p/c2a733353e1b4469aebac9e978e6b77e',
     '2026-07-26T19:00:00-04:00'::timestamptz)
  ON CONFLICT (slug) DO NOTHING;

  SELECT id INTO STRICT teleportation_id
  FROM public.power_systems
  WHERE slug = 'blink-teleportation';

  INSERT INTO public.character_powers (character_id, power_system_id, notes)
  VALUES (
    jennifer_id,
    teleportation_id,
    'Initial limit: destinations within line of sight. Later development after facing Rush: energy sensing expands her reach to locations she can sense within roughly 300 feet. She uses rapid repositioning, physical attacks, environmental hazards, and teleporting other people into danger.'
  );

  SELECT id INTO STRICT rush_id
  FROM public.characters
  WHERE slug = 'rush';

  -- Reuse a Giver row created by the Room import or any earlier placeholder.
  SELECT id INTO giver_id
  FROM public.characters
  WHERE slug = 'giver'
     OR lower(trim(name)) IN ('giver', 'the giver')
     OR lower(trim(coalesce(alias, ''))) IN ('giver', 'the giver')
  ORDER BY CASE WHEN slug = 'giver' THEN 0 ELSE 1 END, created_at
  LIMIT 1;

  IF giver_id IS NULL THEN
    INSERT INTO public.characters (
      slug, name, alias, role, eyebrow, canon_summary_md, identity_md,
      canon_status, status, accent_color
    )
    VALUES (
      'giver', 'Unknown', 'The Giver', 'Mysterious power-granting experimenter',
      'Story 1 · Mysterious Figure',
      'The Giver is the mysterious figure whose experiment granted Jennifer teleportation after she stole one of his blue crystals.',
      '**Known Alias:** The Giver\n\n**Real Name:** Unknown',
      'canon', 'needs_review', '#312e81'
    )
    RETURNING id INTO giver_id;
  END IF;

  -- Fez needs a character target for the relationship table. Reuse any
  -- existing Fez row; otherwise create a minimal, non-published placeholder
  -- without adding a surname, powers, biography, or unsupported aliases.
  SELECT id INTO fez_id
  FROM public.characters
  WHERE slug = 'fez'
     OR lower(trim(name)) = 'fez'
     OR lower(trim(coalesce(alias, ''))) = 'fez'
  ORDER BY CASE WHEN slug = 'fez' THEN 0 ELSE 1 END, created_at
  LIMIT 1;

  IF fez_id IS NULL THEN
    INSERT INTO public.characters (
      slug, name, role, eyebrow, canon_summary_md, canon_status, status,
      accent_color
    )
    VALUES (
      'fez', 'Fez', 'Jennifer’s criminal partner and muscle',
      'Story 1 · Character Placeholder',
      'Fez is Jennifer’s criminal partner. Their relationship combines partnership with her manipulation and exploitation of him as muscle for the gang she wants to build.',
      'canon', 'needs_review', '#1d4ed8'
    )
    RETURNING id INTO fez_id;
  END IF;

  INSERT INTO public.character_relationships
    (character_id, related_character_id, relation_label, inverse_label, sort_order, is_spoiler)
  VALUES
    (jennifer_id, giver_id, 'Transactional power source and experimenter', 'Empowered asset and experiment subject', 1, true),
    (jennifer_id, fez_id, 'Partner she manipulates and exploits as muscle', 'Partner manipulated and exploited as muscle', 2, true),
    (jennifer_id, rush_id, 'Primary adversary and conditional temporary collaborator', 'Recurring antagonist and conditional temporary collaborator', 3, true);
END $$;
