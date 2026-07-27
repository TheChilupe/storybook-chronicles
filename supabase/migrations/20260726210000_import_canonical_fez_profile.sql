-- Import the canonical Fez profile from the Master Lore Index.
-- Source: https://app.notion.com/p/487996221828459ebad6990dc873e4b7
--
-- Fez's Notion image is exposed through a temporary signed URL. It is
-- deliberately not stored here: portrait_url remains unchanged on a reused
-- row and NULL on a new row.

DO $$
DECLARE
  fez_id uuid;
  giver_id uuid;
  jennifer_id uuid;
  rush_id uuid;
  story_one_id uuid;
  lower_body_power_id uuid;
BEGIN
  SELECT id INTO STRICT story_one_id
  FROM public.stories
  WHERE slug = 'rush';

  -- Prefer the canonical slug, then the Notion identity, then an existing
  -- placeholder named Fez. This updates the placeholder created for Jennifer's
  -- relationship rather than inserting a duplicate.
  SELECT id INTO fez_id
  FROM public.characters
  WHERE slug = 'fez'
     OR notion_page_id = '48799622-1828-459e-bad6-990dc873e4b7'
     OR lower(trim(name)) = 'fez'
     OR lower(trim(coalesce(alias, ''))) = 'fez'
  ORDER BY
    CASE
      WHEN slug = 'fez' THEN 0
      WHEN notion_page_id = '48799622-1828-459e-bad6-990dc873e4b7' THEN 1
      ELSE 2
    END,
    created_at
  LIMIT 1;

  IF fez_id IS NULL THEN
    INSERT INTO public.characters (slug, name)
    VALUES ('fez', 'Fez')
    RETURNING id INTO fez_id;
  END IF;

  UPDATE public.characters
  SET
    slug = 'fez',
    name = 'Fez',
    alias = NULL,
    role = 'Story 1 antagonist and recurring early villain for Rush',
    story_id = story_one_id,
    primary_story_id = story_one_id,
    eyebrow = 'Story 1 · Antagonist · Recurring Early Villain',
    tagline = 'A debt-trapped thief whose devastating kicks and hunger for freedom make him a dangerous but morally complicated opponent.',
    canon_summary_md = $md$**Fez** is a 28-year-old Hispanic thief, Story 1 antagonist, and recurring early villain for Rush. He works under the Giver, who granted him enhanced strength and endurance concentrated primarily in his lower body.

Fez’s criminal decisions are driven less by pure cruelty than by desperation. He owes debts to **two different gangs** and joined the Giver because he needed a way out of his financial trouble. Although tough, irritable, and willing to commit violent crimes, he longs for adventure and freedom beyond the obligations controlling his life. His necessity-driven choices, occasional empathy, and sense of honor give him a complex morality without establishing a redemption arc.$md$,
    identity_md = $md$**Name:** Fez

**Age:** 28

**Ethnicity:** Hispanic

**Occupation:** Thief working under the Giver

**Primary Story:** Story 1

**Classification:** Antagonist; recurring early villain for Rush

## Appearance

Fez is bald, rugged, and athletic. Tattoos cover his arm and neck, and a scar marks his lower lip. He generally scowls, appears irritable, and carries a tough demeanor with an underlying hint of desperation. His practical, durable clothing is suited to physical confrontations and high-action criminal work.$md$,
    story_role_md = $md$Fez is introduced in episode one during the bank robbery stopped by Rush. The confrontation displays Fez’s enhanced strength and establishes him as one of the recurring early challenges in Rush’s heroic career. Their encounters center on intense physical confrontations and a personal rivalry.

Throughout the Story 1 / Season 1 outline, Fez’s debts to two gangs create urgency behind his work for the Giver and the risks he takes. He partners with Jennifer, combining his strength with her teleportation to form an effective criminal team. The partnership is tactically effective but morally complicated: Jennifer’s canonical profile establishes that their dynamic includes manipulation and exploitation, so it is not treated as an uncomplicated or healthy relationship.

The source outlines recurring heists, growing desperation, bolder risks, a possible climactic showdown, and hints of future conflict and character growth. Those broad arc statements remain development material rather than confirmed later events, later-story appearances, or redemption.$md$,
    core_conflict_md = $md$Fez wants freedom, adventure, and a life beyond coercion, but debts to two gangs and dependence on the Giver keep driving him toward criminal work, escalating risks, and morally compromised partnerships.$md$,
    spoiler_md = $md$## Background, Motivations, and Personality

Fez works as a thief under the Giver after receiving enhanced strength and endurance from him. He joined out of desperation: debts to two separate, unnamed gangs created severe financial pressure and made the Giver’s offer seem like a route out. The gangs are deliberately left unnamed because the canonical profile supplies no names.

He is determined, tough, generally irritable, and prone to scowling, but his desperation is visible beneath that exterior. He yearns for adventure, excitement, freedom, and new horizons. Debt and obligation cloud his judgment, leading him to take dangerous risks and make questionable choices.

Fez is a criminal but not motivated solely by malice. The profile describes actions driven by necessity and allows for empathy and honor. These qualities make his morality complex without confirming that he reforms or receives a redemption arc.

## Powers, Feats, and Limitations

### Lower-Body-Enhanced Strength and Endurance

The Giver granted Fez superhuman strength and endurance, with the bulk of that power concentrated **below his waist**, particularly in his legs. His listed feats include:

- Kicks powerful enough to break through walls.
- Kicks capable of flipping semi-trucks.

His enhanced endurance and leg strength make him extremely dangerous at close range, but the uneven concentration of power is also a limitation. Opponents who recognize and exploit his reliance on his lower body can reduce his advantage.

### Combat Style

Fez is skilled in hand-to-hand combat and builds his fighting style around powerful lower-body strikes. He closes distance, overpowers opponents physically, and uses devastating kicks as his defining attacks. He is also proficient with a knife, giving him a conventional close-quarters weapon when strength alone is insufficient or poorly positioned.

His other limitations are psychological and situational: debt, fear of consequences, dependence on the Giver, and increasing desperation can cloud his judgment and push him into reckless decisions.

## Relationship Context

- **The Giver:** Fez works for the figure who granted his powers. Their relationship is based on necessity and mutual benefit, but Fez resents his dependence on the Giver.
- **Jennifer:** His teleporting partner in crime. Their strength-and-mobility combination makes them an effective heist team, but the relationship is morally complicated by Jennifer’s manipulation and exploitation of Fez as muscle.
- **Rush:** Fez is a recurring early villain and physical rival for Rush. Their relationship begins with the episode-one bank robbery and is defined by repeated, intense confrontations.

## Development Material

The profile proposes various heists, growing frustration, increasing desperation, bolder moves, a climactic Season 1 showdown, and future conflict or character growth. These are directions and hints, not confirmation of exact later events, new powers, later-story appearances, named gangs, or redemption.$md$,
    accent_color = '#d97706',
    canon_status = 'canon',
    notion_source_url = 'https://app.notion.com/p/487996221828459ebad6990dc873e4b7',
    notion_page_id = '48799622-1828-459e-bad6-990dc873e4b7',
    last_synced_at = '2026-07-26T21:00:00-04:00'::timestamptz,
    status = 'published',
    archived_at = NULL
  WHERE id = fez_id;

  -- Replace only Fez's incomplete details. Incoming relationship rows from
  -- Jennifer and every Rush, Room, and Jennifer profile row remain intact.
  DELETE FROM public.character_eras WHERE character_id = fez_id;
  DELETE FROM public.character_story_notes WHERE character_id = fez_id;
  DELETE FROM public.character_key_moments WHERE character_id = fez_id;
  DELETE FROM public.character_quotes WHERE character_id = fez_id;
  DELETE FROM public.character_relationships WHERE character_id = fez_id;
  DELETE FROM public.character_stories WHERE character_id = fez_id;
  DELETE FROM public.character_powers WHERE character_id = fez_id;

  INSERT INTO public.character_stories (character_id, story_id, role)
  VALUES (
    fez_id,
    story_one_id,
    'Antagonist and recurring early villain; debt-driven criminal enforcer'
  );

  INSERT INTO public.character_eras
    (character_id, era_label, identity, function_md, story_id, sort_order, is_spoiler)
  VALUES
    (fez_id, 'Before Story 1', 'Debtor and desperate thief',
     'Debts to two unnamed gangs push Fez into criminal work and make the Giver’s offer a necessity-driven route toward escape.', story_one_id, 1, true),
    (fez_id, 'Story 1 — Introduction', 'The Giver’s lower-body powerhouse',
     'Fez debuts in the episode-one bank robbery, where his enhanced kicks establish him as an early physical threat to Rush.', story_one_id, 2, false),
    (fez_id, 'Story 1 — Recurring Antagonist', 'Jennifer’s partner and Rush’s recurring early villain',
     'His strength complements Jennifer’s mobility, while debt, manipulation, and resentment keep their effective partnership morally complicated.', story_one_id, 3, true),
    (fez_id, 'Possible Season 1 Direction — Unconfirmed', 'Increasingly desperate rival',
     'The source proposes escalating risks, a climactic confrontation, and future conflict, but does not confirm the exact events or a redemption outcome.', story_one_id, 4, true);

  INSERT INTO public.character_story_notes
    (character_id, story_id, role_label, summary_md, sort_order, is_spoiler)
  VALUES (
    fez_id,
    story_one_id,
    'Antagonist / recurring early villain for Rush',
    $md$Fez enters Story 1 during the episode-one bank robbery stopped by Rush. His enhanced lower-body strength and endurance make him a formidable close-range opponent and establish a physical rivalry with the new hero.

Debts to two unnamed gangs are a major driver of Fez’s continued criminal choices and his dependence on the Giver. His partnership with Jennifer combines his strength and knife proficiency with her teleportation, producing an effective criminal team while her manipulation and exploitation make the relationship morally complicated.

The canonical outline anticipates recurring confrontations and increasing desperation. Its proposed heists, climactic showdown, and future-conflict hints are retained as development material rather than completed events.$md$,
    1,
    true
  );

  INSERT INTO public.character_key_moments
    (character_id, title, story_id, summary_md, sort_order, is_spoiler)
  VALUES
    (fez_id, 'Accepting Power from the Giver', story_one_id,
     'Desperate to escape debts owed to two gangs, Fez works for the Giver and receives enhanced strength and endurance concentrated primarily in his lower body.', 1, true),
    (fez_id, 'The Episode-One Bank Robbery', story_one_id,
     'Fez is introduced during the robbery stopped by Rush, demonstrating his enhanced strength and beginning their recurring physical rivalry.', 2, false),
    (fez_id, 'Partnering with Jennifer', story_one_id,
     'Fez’s strength and Jennifer’s teleportation make them an effective criminal team, though manipulation and exploitation complicate the partnership.', 3, true);

  INSERT INTO public.power_systems
    (slug, name, summary_md, canon_status, notion_source_url, last_synced_at)
  VALUES
    ('lower-body-enhancement', 'Lower-Body Enhancement',
     'Superhuman strength and endurance concentrated primarily below the waist, enabling devastating kicks and close-range combat.',
     'canon', 'https://app.notion.com/p/487996221828459ebad6990dc873e4b7',
     '2026-07-26T21:00:00-04:00'::timestamptz)
  ON CONFLICT (slug) DO NOTHING;

  SELECT id INTO STRICT lower_body_power_id
  FROM public.power_systems
  WHERE slug = 'lower-body-enhancement';

  INSERT INTO public.character_powers (character_id, power_system_id, notes)
  VALUES (
    fez_id,
    lower_body_power_id,
    'Enhanced strength and endurance are concentrated primarily in Fez’s lower body. Canonical feats: kicks that break through walls and kicks capable of flipping semi-trucks. He uses lower-body-focused hand-to-hand combat and is proficient with a knife. Reliance on his legs is exploitable, while debt and desperation impair judgment.'
  );

  SELECT id INTO STRICT rush_id
  FROM public.characters
  WHERE slug = 'rush';

  SELECT id INTO STRICT jennifer_id
  FROM public.characters
  WHERE slug = 'jennifer';

  -- Reuse the Giver placeholder established by prior character imports. Keep a
  -- defensive fallback for databases where those migrations were customized.
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
      'The Giver is the mysterious figure who granted Fez enhanced strength and endurance and employs him as a thief.',
      '**Known Alias:** The Giver\n\n**Real Name:** Unknown',
      'canon', 'needs_review', '#312e81'
    )
    RETURNING id INTO giver_id;
  END IF;

  INSERT INTO public.character_relationships
    (character_id, related_character_id, relation_label, inverse_label, sort_order, is_spoiler)
  VALUES
    (fez_id, giver_id, 'Power source and resented employer of necessity', 'Empowered debtor and criminal employee', 1, true),
    (fez_id, jennifer_id, 'Effective but morally complicated criminal partner', 'Effective partner she manipulates and exploits', 2, true),
    (fez_id, rush_id, 'Recurring early adversary and physical rival', 'Recurring early villain and physical rival', 3, true);
END $$;
