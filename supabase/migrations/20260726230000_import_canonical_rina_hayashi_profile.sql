-- Import the canonical Rina Hayashi / PsiStar profile from the Master Lore Index.
-- Source: https://app.notion.com/p/5bcc1fda6d944382a9714b192c3f09b2
--
-- Rina's Notion image and page icon are temporary signed URLs. They are not
-- stored here: portrait_url remains unchanged on a reused row and NULL on a
-- new row.

DO $$
DECLARE
  rina_id uuid;
  room_id uuid;
  rush_id uuid;
  story_one_id uuid;
  tactile_telekinesis_id uuid;
  apex_dynamics_id uuid;
BEGIN
  SELECT id INTO STRICT story_one_id
  FROM public.stories
  WHERE slug = 'rush';

  -- This project mixes real-name and hero-name slugs, so use the requested
  -- real-name slug. Match both identities to reuse any Rina/PsiStar placeholder.
  SELECT id INTO rina_id
  FROM public.characters
  WHERE slug IN ('rina-hayashi', 'psistar', 'psi-star')
     OR notion_page_id = '5bcc1fda-6d94-4382-a971-4b192c3f09b2'
     OR lower(trim(name)) = 'rina hayashi'
     OR lower(regexp_replace(trim(coalesce(alias, '')), '[^a-zA-Z0-9]+', '', 'g')) = 'psistar'
  ORDER BY
    CASE
      WHEN slug = 'rina-hayashi' THEN 0
      WHEN notion_page_id = '5bcc1fda-6d94-4382-a971-4b192c3f09b2' THEN 1
      WHEN slug IN ('psistar', 'psi-star') THEN 2
      ELSE 3
    END,
    created_at
  LIMIT 1;

  IF rina_id IS NULL THEN
    INSERT INTO public.characters (slug, name, alias)
    VALUES ('rina-hayashi', 'Rina Hayashi', 'PsiStar')
    RETURNING id INTO rina_id;
  END IF;

  UPDATE public.characters
  SET
    slug = 'rina-hayashi',
    name = 'Rina Hayashi',
    alias = 'PsiStar',
    role = 'Story 1 supporting character and hero',
    story_id = story_one_id,
    primary_story_id = story_one_id,
    eyebrow = 'Story 1 · Supporting Character · Hero',
    tagline = 'A sheltered corporate hero whose search for Rush becomes her first step toward defining heroism for herself.',
    canon_summary_md = $md$**Rina Hayashi**, hero name **PsiStar**, is a Story 1 supporting character and hero in her **early twenties**. She is half white and half Japanese. Apex Dynamics raised her from a young age in a lavish, sheltered environment, grooming her to become a professional hero and a possible leader of its hero team.

Rina is professional, dutiful, idealistic, and eager to live up to demanding heroic standards. Her privileged upbringing and careful training also leave her naive about ordinary people’s struggles and the uncontrolled world outside Apex Dynamics. The emergence of Rush disrupts the leadership path planned for her and pushes her toward her first major act of independence: leaving Apex Dynamics to search for him.$md$,
    identity_md = $md$**Real Name:** Rina Hayashi

**Hero Name:** PsiStar

**Age:** Early 20s

**Ethnicity:** Half white, half Japanese

**Primary Story:** Story 1

**Classification:** Supporting character; hero

## Appearance

Rina has a sleek, athletic build and carries herself with grace and precision. Her stylish, high-tech hero costume reflects her tactile telekinetic abilities and uses a star motif associated with the name PsiStar.$md$,
    story_role_md = $md$Episode 1’s chaos and Rush’s unexpected emergence as a hero disrupt the leadership path Apex Dynamics planned for Rina, delaying the prominence for which she had been raised and groomed. Frustrated with being placed on standby, she takes her first major act of defiance: leaving Apex Dynamics to search for Rush rather than remaining within the organization’s controlled plan.

Rina is introduced in Episode 3 while searching for Rush. Room is searching as well, and his street knowledge sharply contrasts with her sheltered upbringing. Rina is a fish out of water; their shared search creates tension and opportunities for her to learn how ordinary people navigate a world Apex Dynamics did not prepare her to understand. Their relationship is not framed as romantic.

Her broader arc concerns professionalism, idealism, growing independence, and a more nuanced understanding of heroism. The source proposes a later decision between bringing Rush into Apex Dynamics and supporting his independence, but does not confirm her final choice. Encounters with unnamed allies and enemies, the exact meeting with Rush, and broad future growth remain general development material rather than separate completed events.$md$,
    core_conflict_md = $md$Rina sincerely wants to meet the highest standards of heroism, but the loyalty, grooming, privilege, and pressure that shaped those standards conflict with her growing need to understand the real world and choose her own heroic path.$md$,
    spoiler_md = $md$## Background, Motivations, and Personality

Apex Dynamics raised Rina from a young age in a lavish and sheltered environment. The organization trained and groomed her to be a hero, favored her as a possible leader of its hero team, and made that planned leadership path central to her expectations for herself.

Rina is professional and dutiful. She believes strongly in heroic ideals, works hard to embody them, tries not to hold grudges, follows orders, and is regarded as the “goodie two-shoes” of her team. Her idealism is sincere, but her sheltered and privileged upbringing makes her naive about ordinary hardship and the complexities of heroism outside a controlled corporate environment.

Her motivations combine loyalty and ambition with a genuine desire to be worthy of the role she was given. Rush’s emergence delays the future Apex planned for her. Frustration at remaining on standby helps turn her search for Rush into both an attempt to understand his disruption and her first act of defiance against organizational control.

## Powers and Boundaries

### Tactile Telekinesis

Rina manipulates objects **through physical contact**. Her power grants enhanced strength, dexterity, precision, and fine control over whatever she is touching. Contact is the defining boundary: this is not unrestricted ranged telekinesis, and the profile does not establish that she can manipulate distant objects without touching them.

Her power supports feats of physical strength and graceful, precise object control, fitting both her athletic build and highly trained professional style. No later powers or expansions are asserted.

## Relationship Context

- **Room:** Both search for Rush in Episode 3. Room’s street knowledge contrasts with Rina’s sheltered upbringing, leaving her dependent on experience she does not have and creating room for tension and learning. No romance is established.
- **Apex Dynamics:** Her guardian, trainer, sponsor, and source of pressure. Rina is loyal to the organization and was groomed as a possible team leader, but leaving to find Rush shows growing independence and willingness to challenge the plan imposed upon her.
- **Rush:** His sudden emergence disrupts the leadership path Apex designed for Rina and motivates her search. The profile treats their eventual meeting and her possible choice about his independence as pivotal development material; it does not establish romance or confirm her final decision.

## Development Material

The canonical page proposes encounters with unnamed allies and enemies, adaptation to ordinary life, increased independence, an eventual meeting with Rush, and a decision between returning him to Apex Dynamics or supporting his independent path. These are broad arc directions, not confirmation of distinct encounters, the decision’s outcome, later-story appearances, attained leadership status, or new powers.$md$,
    accent_color = '#a855f7',
    canon_status = 'canon',
    notion_source_url = 'https://app.notion.com/p/5bcc1fda6d944382a9714b192c3f09b2',
    notion_page_id = '5bcc1fda-6d94-4382-a971-4b192c3f09b2',
    last_synced_at = '2026-07-26T23:00:00-04:00'::timestamptz,
    status = 'published',
    archived_at = NULL
  WHERE id = rina_id;

  -- Replace only Rina's incomplete details. No other character, relationship,
  -- story, power, or faction membership rows are modified.
  DELETE FROM public.character_eras WHERE character_id = rina_id;
  DELETE FROM public.character_story_notes WHERE character_id = rina_id;
  DELETE FROM public.character_key_moments WHERE character_id = rina_id;
  DELETE FROM public.character_quotes WHERE character_id = rina_id;
  DELETE FROM public.character_relationships WHERE character_id = rina_id;
  DELETE FROM public.character_stories WHERE character_id = rina_id;
  DELETE FROM public.character_powers WHERE character_id = rina_id;
  DELETE FROM public.character_factions WHERE character_id = rina_id;

  INSERT INTO public.character_stories (character_id, story_id, role)
  VALUES (
    rina_id,
    story_one_id,
    'Supporting character and hero; sheltered Apex trainee developing independence'
  );

  INSERT INTO public.character_eras
    (character_id, era_label, identity, function_md, story_id, sort_order, is_spoiler)
  VALUES
    (rina_id, 'Before Story 1', 'Apex Dynamics’ groomed hero and possible team leader',
     'Raised in privilege and trained from a young age to embody professional heroism and follow an Apex-designed leadership path.', story_one_id, 1, true),
    (rina_id, 'Story 1 — Episode 1 Impact', 'Heroic successor displaced by Rush’s emergence',
     'Rush’s unexpected public arrival disrupts Apex Dynamics’ plans and places Rina’s expected rise on hold.', story_one_id, 2, false),
    (rina_id, 'Story 1 — Episode 3', 'Defiant hero searching for Rush',
     'Rina leaves Apex in her first major act of defiance and enters an unfamiliar street-level world where Room’s experience contrasts with her sheltered naivety.', story_one_id, 3, true),
    (rina_id, 'Possible Decision Point — Unconfirmed', 'Hero choosing between institutional loyalty and independence',
     'The source proposes a choice involving Rush and Apex Dynamics but does not confirm the outcome, final leadership status, or later direction.', story_one_id, 4, true);

  INSERT INTO public.character_story_notes
    (character_id, story_id, role_label, summary_md, sort_order, is_spoiler)
  VALUES (
    rina_id,
    story_one_id,
    'Supporting hero / Apex Dynamics trainee developing independence',
    $md$Rina’s planned path toward leadership is disrupted by the emergence of Rush in Episode 1. Her frustration with remaining on standby leads to her first major act of defiance: leaving Apex Dynamics to search for him.

Introduced in Episode 3, Rina searches alongside Room. His street knowledge exposes how sheltered she is and challenges her corporate understanding of heroism and ordinary life. The contrast creates tension and learning without establishing romance.

The profile’s encounters with unnamed allies and enemies, meeting with Rush, broader growth, and decision between institutional loyalty and Rush’s independence are retained as development material. No final choice is asserted.$md$,
    1,
    true
  );

  INSERT INTO public.character_key_moments
    (character_id, title, story_id, summary_md, sort_order, is_spoiler)
  VALUES
    (rina_id, 'Rush Disrupts Apex’s Plan', story_one_id,
     'The events of Episode 1 and Rush’s unexpected emergence throw Apex Dynamics’ plans into disarray and delay the leadership path designed for Rina.', 1, false),
    (rina_id, 'Leaving Apex Dynamics', story_one_id,
     'Tired of remaining on standby, Rina commits her first major act of defiance by leaving the organization to search for Rush.', 2, true),
    (rina_id, 'Searching with Room', story_one_id,
     'In Episode 3, Rina’s sheltered worldview meets Room’s street knowledge as both search for Rush; their contrast creates tension and an opportunity for learning.', 3, true);

  INSERT INTO public.power_systems
    (slug, name, summary_md, canon_status, notion_source_url, last_synced_at)
  VALUES
    ('tactile-telekinesis', 'Tactile Telekinesis',
     'Contact-bound telekinetic manipulation that grants enhanced strength, dexterity, precision, and fine control over whatever the user touches.',
     'canon', 'https://app.notion.com/p/5bcc1fda6d944382a9714b192c3f09b2',
     '2026-07-26T23:00:00-04:00'::timestamptz)
  ON CONFLICT (slug) DO NOTHING;

  SELECT id INTO STRICT tactile_telekinesis_id
  FROM public.power_systems
  WHERE slug = 'tactile-telekinesis';

  INSERT INTO public.character_powers (character_id, power_system_id, notes)
  VALUES (
    rina_id,
    tactile_telekinesis_id,
    'Rina manipulates objects through physical contact. Her power enhances strength, dexterity, precision, and fine control over whatever she touches. It is explicitly contact-bound, not unrestricted ranged telekinesis; no later expansions are confirmed.'
  );

  SELECT id INTO STRICT room_id
  FROM public.characters
  WHERE slug = 'room';

  SELECT id INTO STRICT rush_id
  FROM public.characters
  WHERE slug = 'rush';

  INSERT INTO public.character_relationships
    (character_id, related_character_id, relation_label, inverse_label, sort_order, is_spoiler)
  VALUES
    (rina_id, room_id, 'Streetwise search partner and worldview contrast', 'Sheltered hero and search partner', 1, true),
    (rina_id, rush_id, 'Disruptive emerging hero she leaves Apex to find', 'Apex-trained hero searching for him', 2, true);

  -- Apex Dynamics is an organization, so model it through the existing faction
  -- tables instead of fabricating a character target for character_relationships.
  SELECT id INTO apex_dynamics_id
  FROM public.factions
  WHERE slug = 'apex-dynamics'
     OR lower(trim(name)) = 'apex dynamics'
  ORDER BY CASE WHEN slug = 'apex-dynamics' THEN 0 ELSE 1 END, created_at
  LIMIT 1;

  IF apex_dynamics_id IS NULL THEN
    INSERT INTO public.factions (
      slug, name, summary_md, spoiler_md, canon_status,
      notion_source_url, last_synced_at
    )
    VALUES (
      'apex-dynamics',
      'Apex Dynamics',
      'The organization that raised, trained, sponsored, and groomed Rina Hayashi from a young age to become a professional hero and possible team leader.',
      'Rina is loyal to Apex Dynamics but experiences institutional pressure and begins asserting independence when she leaves to search for Rush. Her final position toward the organization is unresolved.',
      'canon',
      'https://app.notion.com/p/de95cea6f09042eaa992f3df753554b9',
      '2026-07-26T23:00:00-04:00'::timestamptz
    )
    RETURNING id INTO apex_dynamics_id;
  END IF;

  INSERT INTO public.character_factions (character_id, faction_id, role)
  VALUES (
    rina_id,
    apex_dynamics_id,
    'Loyal, groomed hero and possible team leader developing independence under pressure'
  );
END $$;
