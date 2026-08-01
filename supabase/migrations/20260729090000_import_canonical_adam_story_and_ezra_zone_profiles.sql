-- Import the canonical Adam Story, The Giver, and Ezra Zone profiles.
--
-- Adam Story and The Giver intentionally use separate character rows to
-- represent one person through two narrative identities. The existing Giver
-- UUID is preserved so prior relationship foreign keys remain continuous.
-- Their shared identity remains spoiler-only because structured relationship
-- rendering is not currently safe for secret-identity reveals.

DO $$
DECLARE
  adam_id uuid;
  giver_id uuid;
  ezra_id uuid;
  rush_id uuid;
  room_id uuid;
  jennifer_id uuid;
  fez_id uuid;
  story_one_id uuid;
  order_id uuid;
  erasure_id uuid;
  immortality_id uuid;
  natural_red_crystal_id uuid;
  physical_augmentation_id uuid;
  red_crystal_id uuid;
  candidate_count integer;
  existing_power_name text;
  existing_faction_name text;
BEGIN
  SELECT id INTO STRICT story_one_id
  FROM public.stories
  WHERE slug = 'rush';

  -- Adam is deliberately matched without considering Giver identifiers.
  SELECT count(*), (array_agg(id))[1]
  INTO candidate_count, adam_id
  FROM public.characters
  WHERE slug = 'adam-story'
     OR lower(trim(name)) = 'adam story';

  IF candidate_count > 1 THEN
    RAISE EXCEPTION
      'Adam Story migration found % Adam candidates; manual reconciliation is required',
      candidate_count;
  ELSIF candidate_count = 0 THEN
    INSERT INTO public.characters (slug, name, alias)
    VALUES ('adam-story', 'Adam Story', NULL)
    RETURNING id INTO adam_id;
  END IF;

  -- Preserve the existing Giver UUID. Never merge this row into Adam Story.
  SELECT count(*), (array_agg(id))[1]
  INTO candidate_count, giver_id
  FROM public.characters
  WHERE slug = 'giver'
     OR lower(trim(name)) IN ('giver', 'the giver')
     OR lower(trim(coalesce(alias, ''))) IN ('giver', 'the giver');

  IF candidate_count > 1 THEN
    RAISE EXCEPTION
      'Giver migration found % Giver candidates; manual reconciliation is required to preserve relationship continuity',
      candidate_count;
  ELSIF candidate_count = 0 THEN
    INSERT INTO public.characters (slug, name, alias)
    VALUES ('giver', 'The Giver', NULL)
    RETURNING id INTO giver_id;
  END IF;

  SELECT count(*), (array_agg(id))[1]
  INTO candidate_count, ezra_id
  FROM public.characters
  WHERE slug IN ('ezra-zone', 'ezra')
     OR lower(trim(name)) = 'ezra zone';

  IF candidate_count > 1 THEN
    RAISE EXCEPTION
      'Ezra Zone migration found % Ezra candidates; manual reconciliation is required',
      candidate_count;
  ELSIF candidate_count = 0 THEN
    INSERT INTO public.characters (slug, name, alias)
    VALUES ('ezra-zone', 'Ezra Zone', NULL)
    RETURNING id INTO ezra_id;
  END IF;

  IF adam_id = giver_id OR adam_id = ezra_id OR giver_id = ezra_id THEN
    RAISE EXCEPTION
      'Adam Story, The Giver, and Ezra Zone must resolve to three independent character UUIDs';
  END IF;

  SELECT id INTO STRICT rush_id
  FROM public.characters
  WHERE slug = 'rush';

  SELECT id INTO STRICT room_id
  FROM public.characters
  WHERE slug = 'room';

  SELECT id INTO STRICT jennifer_id
  FROM public.characters
  WHERE slug = 'jennifer';

  SELECT id INTO STRICT fez_id
  FROM public.characters
  WHERE slug = 'fez';

  UPDATE public.characters
  SET
    slug = 'adam-story',
    name = 'Adam Story',
    alias = NULL,
    role = 'Scientist, philanthropist, investor, educator, and political visionary',
    story_id = story_one_id,
    primary_story_id = story_one_id,
    eyebrow = 'Story 1 · Public Visionary · Human Advancement Advocate',
    tagline = 'An immortal visionary urging humanity to evolve before the future overtakes it.',
    canon_summary_md = $md$Adam Story is an immortal scientist, philanthropist, investor, educator, and political visionary whose influence helped shape Legnous City’s entry into the superhuman era. He argues that humanity must evolve quickly enough to survive the dangers waiting beyond its world.

Calm, philosophical, charismatic, and thoughtful, Adam speaks about humanity’s future with conviction. He is capable of warmth and projects confidence without presenting himself as a tyrant, criminal, or supernatural authority.$md$,
    identity_md = $md$**Name:** Adam Story

**Age:** More than 100 years old

**Apparent Age:** Late thirties

**Height:** 5'9"

**Ethnicity:** White American

**Primary Story:** Story 1

**Public Roles:** Scientist, philanthropist, investor, educator, political visionary, and advocate for human advancement

## Appearance

Adam has a broad, bulky build and brown hair marked by prominent white aging streaks. His eyes are commonly hidden behind shades, shadow, or a hat.$md$,
    story_role_md = $md$Adam’s public work places him among the scientific, financial, educational, philanthropic, and political forces shaping Legnous City’s response to the superhuman era. He advocates rapid human advancement, supports crystal research, investigates the Stackston Incident, and studies Rush as evidence that the world is changing.

His political influence includes mayoral or campaign material and a philosophical contrast with Malcolm’s more restrained vision. Adam presents these efforts as preparation for humanity’s future.$md$,
    core_conflict_md = $md$Adam wants humanity to advance quickly enough to survive the future, but his public vision raises questions about how much risk society should accept in the name of progress.$md$,
    spoiler_md = $md$## Shared Identity

**Adam Story and The Giver are the same person.** The website uses two profiles to preserve their different narrative identities: Adam Story is the public visionary, while The Giver is his secret underground persona. The connection is intentionally absent from public aliases, summaries, metadata, and structured relationships.

## Hidden Authority

As The Giver, Adam is the **Boundless King** of Legnous City’s hidden world and the founder and ultimate authority of the Order. He has influenced humanity’s evolution through hidden research, crystal experimentation, criminal networks, institutional power, and dangerous long-term planning.

Adam is the human Storybook known as **the Eraser**. His authority concerns removal, nullification, undoing, and erasure. He has committed horrific acts while genuinely believing that humanity must survive.

Builder humbled Adam early in his Storybook life. Beginning selected him for the Storybook role, and Alexander Story is his conceptual counterpart. Adam’s hidden plans prepare humanity for Omega entities, Elysium, Jagon, Conqueror, and other cosmic civilizations.

## Future Development

Future material positions Adam as a shadow protector whose death or defeat weakens Earth’s defenses. His absence helps expose Earth to greater galactic danger. These future events and relationships remain incomplete development material.$md$,
    accent_color = '#334155',
    canon_status = 'canon',
    last_synced_at = '2026-07-29T09:00:00-04:00'::timestamptz,
    status = 'published',
    archived_at = NULL
  WHERE id = adam_id;

  UPDATE public.characters
  SET
    slug = 'giver',
    name = 'The Giver',
    alias = NULL,
    role = 'Boundless King and immortal underworld power broker',
    story_id = story_one_id,
    primary_story_id = story_one_id,
    eyebrow = 'Story 1 · Boundless King · Underworld Power Broker',
    tagline = 'He gives people access to power, opportunity, and danger, then watches what they become.',
    canon_summary_md = $md$The Giver, known in the hidden world as the **Boundless King**, is an immortal power broker whose influence reaches through Legnous City’s criminal networks, enhanced individuals, secret research circles, and underground institutions. He does not merely control territory. He gives people access to power, opportunity, and danger, then watches what they become.

His authority is not limited to one gang, district, business, country, or form of power. He rules through access, knowledge, favors, secrets, power distribution, research, criminal relationships, institutional influence, and supernatural authority.$md$,
    identity_md = $md$**Name:** The Giver

**Title:** Boundless King

**Age:** More than 100 years old

**Apparent Age:** Late thirties

**Primary Story:** Story 1

**Role:** Immortal underworld ruler, power broker, dangerous research patron, and shadow protector

**Reach:** Criminal networks, enhanced individuals, secret research circles, underground institutions, and wider systems of influence$md$,
    story_role_md = $md$The Giver operates as a hidden ruler and power broker in Legnous City. Known underground as the Boundless King, he facilitates powers, employs or supports enhanced criminals, manipulates criminal networks, and sponsors dangerous research in pursuit of accelerated human evolution.

He grants or facilitates powers for Jennifer and Fez, remains connected to Room’s underworld activity, studies Rush as an agent of chaos and potential, investigates the Stackston Incident, and advances crystal research through criminal and institutional networks. He is a calm, philosophical authority capable of unsettling kindness and terrible decisions rather than a conventional territorial gang boss.$md$,
    core_conflict_md = $md$The Giver wants humanity strong enough to survive what lies beyond Earth, but his willingness to distribute dangerous power and commit atrocities turns preparation into exploitation.$md$,
    spoiler_md = $md$## Shared Identity

**The Giver and Adam Story are the same person.** The website uses two profiles to preserve their different narrative identities: The Giver is the secret underground persona of the public visionary Adam Story. The connection remains spoiler-only because the current structured relationship display cannot protect a secret-identity link.

## Storybook Identity

The Giver is the human Storybook known as **the Eraser**. Beginning selected him for the Storybook role. Alexander Story is his conceptual counterpart, and Builder humbled him early in his Storybook life.

## The Order and Hidden Operations

He founded the Order and remains its ultimate authority. Department Zero, Karim, Blue, the Order’s deeper operations, and his influence on the conditions that contribute to the Purple Man’s release remain hidden or future-facing material.

The Giver is connected to the organization behind Ezra Zone’s kidnapping and crystal experimentation. That relationship remains here rather than in public structured relationships so Ezra’s origin is not exposed.

## Future Development

Future material positions him as an adversary of Azul and a shadow protector whose death or defeat weakens Earth. His absence makes the planet more visible to Conqueror and greater galactic danger. These events remain spoiler-sensitive development material.$md$,
    accent_color = '#312e81',
    canon_status = 'canon',
    last_synced_at = '2026-07-29T09:00:00-04:00'::timestamptz,
    status = 'published',
    archived_at = NULL
  WHERE id = giver_id;

  UPDATE public.characters
  SET
    slug = 'ezra-zone',
    name = 'Ezra Zone',
    alias = NULL,
    role = 'Story 1 supporting character, student athlete, and Talon Zone’s younger brother',
    story_id = story_one_id,
    primary_story_id = story_one_id,
    eyebrow = 'Story 1 · Supporting Character · Student Athlete',
    tagline = 'A driven young man determined to preserve a future of his own.',
    canon_summary_md = $md$Ezra Zone is Talon Zone’s younger brother, a high-school senior and football player preparing for university and a future of his own. His life is shaped by family, ambition, and the growing superhuman world around him, but he is far more cautious than Talon about allowing power to consume his identity.

Ambitious, driven, supportive, resilient, brave, and future-oriented, Ezra plans to attend university in Legnous City and move in with Talon to reduce expenses. His education, athletics, relationships, and personal goals give him a life beyond heroism.$md$,
    identity_md = $md$**Name:** Ezra Zone

**Age at Introduction:** 17

**Primary Story:** Story 1

**Role:** Supporting character

**Family:** Younger brother of Talon Zone

**Education:** High-school senior planning to attend university in Legnous City

**Athletics:** Football player

## Appearance

Ezra has an athletic build, a youthful appearance, dreadlocks with half-red coloration, and a determined expression. The source supports only the design note “dreads half red”; it does not establish the exact pattern, cause, length, clothing, costume, armor, or additional features.$md$,
    story_role_md = $md$Ezra begins Story 1 as a high-school senior and football player who looks up to Talon and does not initially know that his older brother is Rush. He plans to attend a local university and move in with Talon to reduce expenses.

His ambitions and caution distinguish him from Talon. Ezra values school, sports, family, and the ordinary future he is building, making him less eager to let extraordinary events define his identity.$md$,
    core_conflict_md = $md$Ezra wants to preserve the ordinary future he has worked toward even as extraordinary events begin pulling him toward a larger role.$md$,
    spoiler_md = $md$## Kidnapping and Experimentation

During a senior trip, Ezra is kidnapped by members of the Order and subjected to crystal-related experimentation. The experiment reveals that he naturally generates Red Crystal energy inside his body rather than merely absorbing or storing an external supply.

Ezra can use that energy to enhance strength, durability, stamina, and general physical performance while avoiding the ordinary side effects associated with Red Crystal use. The material does not define capacity, recharge rate, transformations, named techniques, exhaustion mechanics, numerical feats, or a clean upper limit.

Rush intervenes to rescue Ezra. He then begins adjusting to powers and to the larger superhuman world Talon had concealed from him.

## Season 2 and Purple War Development

Ezra is considered as a possible Apex candidate but does not immediately want a vigilante life. He is powerful, cautious about testing his limits, and reluctant to sacrifice school and personal dreams. Development material moves him toward one of the story’s strongest physical power sets and a top-tier combat role without settling every stage.

During the Purple War, Ezra becomes one of the few fighters capable of physically challenging the Purple Man. He dies during the conflict, and his death represents the emotional collapse of the Hero Era for Rush.

## Hidden Relationship Context

- **The Giver:** Hidden authority behind the organization that targets and experiments on Ezra.
- **Room:** Ally through Rush’s network.
- **Jennifer:** Possible Purple War ally through evacuation operations; this remains qualified future material.
- **The Order:** Kidnapper, experimenter, and continuing threat. Ezra is a target, not a member.
- **Apex Dynamics:** Possible future recruiter. Ezra is considered as a candidate, not confirmed as a member.

## Proposed Relationship — Needs Review

Proposed relationship / needs review: the older profile associates Savannah Aurora with managing the public narrative around Ezra’s abilities, but the June expansion material does not strongly reinforce this relationship.$md$,
    accent_color = '#dc2626',
    canon_status = 'canon',
    last_synced_at = '2026-07-29T09:00:00-04:00'::timestamptz,
    status = 'published',
    archived_at = NULL
  WHERE id = ezra_id;

  -- Replace only outgoing data for these profiles. Incoming relationships to
  -- the preserved Giver UUID, including Room/Jennifer/Fez rows, are untouched.
  DELETE FROM public.character_stories
  WHERE character_id IN (adam_id, giver_id, ezra_id)
    AND story_id <> story_one_id;

  INSERT INTO public.character_stories (character_id, story_id, role)
  VALUES
    (adam_id, story_one_id,
     'Public scientist, philanthropist, investor, educator, and political visionary'),
    (giver_id, story_one_id,
     'Boundless King, underworld power broker, and hidden driver of human advancement'),
    (ezra_id, story_one_id,
     'Supporting character, student athlete, and Talon Zone’s younger brother')
  ON CONFLICT (character_id, story_id) DO UPDATE
  SET role = EXCLUDED.role;

  -- Stable IDs make public structured sections repeatable without regenerating
  -- rows on a manual rerun. No spoiler-sensitive structured rows are inserted.
  IF EXISTS (
    SELECT 1
    FROM public.character_eras
    WHERE id IN (
      'ad290001-0000-4000-8000-000000000001'::uuid,
      'ad290001-0000-4000-8000-000000000002'::uuid,
      '6e290001-0000-4000-8000-000000000001'::uuid,
      '6e290001-0000-4000-8000-000000000002'::uuid,
      'e2290001-0000-4000-8000-000000000001'::uuid
    )
      AND character_id NOT IN (adam_id, giver_id, ezra_id)
  ) THEN
    RAISE EXCEPTION
      'Stable Adam/Giver/Ezra era UUID collides with another character';
  END IF;

  DELETE FROM public.character_eras
  WHERE character_id IN (adam_id, giver_id, ezra_id)
    AND id NOT IN (
      'ad290001-0000-4000-8000-000000000001'::uuid,
      'ad290001-0000-4000-8000-000000000002'::uuid,
      '6e290001-0000-4000-8000-000000000001'::uuid,
      '6e290001-0000-4000-8000-000000000002'::uuid,
      'e2290001-0000-4000-8000-000000000001'::uuid
    );

  INSERT INTO public.character_eras
    (id, character_id, era_label, identity, function_md, story_id, sort_order, is_spoiler)
  VALUES
    ('ad290001-0000-4000-8000-000000000001', adam_id,
     'Before Story 1', 'Immortal public visionary',
     'Builds influence through science, investment, education, philanthropy, and politics while advocating for rapid human advancement.',
     story_one_id, 1, false),
    ('ad290001-0000-4000-8000-000000000002', adam_id,
     'Story 1 — Public Role', 'Scientist and political advocate responding to a changing world',
     'Investigates the Stackston Incident, supports crystal research, and studies Rush as public evidence that humanity’s circumstances are changing.',
     story_one_id, 2, false),
    ('6e290001-0000-4000-8000-000000000001', giver_id,
     'Before Story 1', 'Boundless King of Legnous City’s hidden world',
     'Builds authority through access, secrets, favors, research, power distribution, and connections spanning criminal and institutional systems.',
     story_one_id, 1, false),
    ('6e290001-0000-4000-8000-000000000002', giver_id,
     'Story 1', 'Immortal power broker accelerating human evolution',
     'Facilitates powers, sponsors dangerous research, studies Rush, and manipulates underworld and institutional networks as a long-term planner.',
     story_one_id, 2, false),
    ('e2290001-0000-4000-8000-000000000001', ezra_id,
     'Early Story 1', 'High-school senior, football player, and Talon’s younger brother',
     'Plans for university and a shared home with Talon while pursuing school, sports, family, and a future beyond heroism.',
     story_one_id, 1, false)
  ON CONFLICT (id) DO UPDATE
  SET
    character_id = EXCLUDED.character_id,
    era_label = EXCLUDED.era_label,
    identity = EXCLUDED.identity,
    function_md = EXCLUDED.function_md,
    story_id = EXCLUDED.story_id,
    sort_order = EXCLUDED.sort_order,
    is_spoiler = EXCLUDED.is_spoiler;

  DELETE FROM public.character_story_notes
  WHERE character_id IN (adam_id, giver_id, ezra_id)
    AND story_id <> story_one_id;

  INSERT INTO public.character_story_notes
    (character_id, story_id, role_label, summary_md, sort_order, is_spoiler)
  VALUES
    (adam_id, story_one_id, 'Public visionary and advocate for human advancement',
     $md$Adam shapes Legnous City’s response to the emerging superhuman era through science, investment, education, philanthropy, and political influence. His public work includes crystal research, investigation of the Stackston Incident, interest in Rush, and philosophical opposition to Malcolm’s more restrained vision.$md$,
     1, false),
    (giver_id, story_one_id, 'Boundless King and immortal underworld power broker',
     $md$The Giver shapes Legnous City’s hidden world through access, knowledge, favors, secrets, enhanced criminals, dangerous research, and institutional influence. He facilitates powers for Jennifer and Fez, remains connected to Room, and studies Rush as an agent of chaos and potential.$md$,
     1, false),
    (ezra_id, story_one_id, 'Student athlete and Talon Zone’s younger brother',
     $md$Ezra begins Story 1 focused on football, graduation, university in Legnous City, and moving in with Talon to reduce expenses. He looks up to his brother while retaining ambitions, responsibilities, and a future of his own.$md$,
     1, false)
  ON CONFLICT (character_id, story_id) DO UPDATE
  SET
    role_label = EXCLUDED.role_label,
    summary_md = EXCLUDED.summary_md,
    sort_order = EXCLUDED.sort_order,
    is_spoiler = EXCLUDED.is_spoiler;

  DELETE FROM public.character_key_moments
  WHERE character_id IN (adam_id, giver_id, ezra_id)
    AND id NOT IN (
      'ad290002-0000-4000-8000-000000000001'::uuid,
      'ad290002-0000-4000-8000-000000000002'::uuid,
      '6e290002-0000-4000-8000-000000000001'::uuid,
      '6e290002-0000-4000-8000-000000000002'::uuid,
      'e2290002-0000-4000-8000-000000000001'::uuid
    );

  IF EXISTS (
    SELECT 1
    FROM public.character_key_moments
    WHERE id IN (
      'ad290002-0000-4000-8000-000000000001'::uuid,
      'ad290002-0000-4000-8000-000000000002'::uuid,
      '6e290002-0000-4000-8000-000000000001'::uuid,
      '6e290002-0000-4000-8000-000000000002'::uuid,
      'e2290002-0000-4000-8000-000000000001'::uuid
    )
      AND character_id NOT IN (adam_id, giver_id, ezra_id)
  ) THEN
    RAISE EXCEPTION
      'Stable Adam/Giver/Ezra key-moment UUID collides with another character';
  END IF;

  INSERT INTO public.character_key_moments
    (id, character_id, title, story_id, summary_md, sort_order, is_spoiler)
  VALUES
    ('ad290002-0000-4000-8000-000000000001', adam_id,
     'Investigating the Stackston Incident', story_one_id,
     'Adam investigates the incident as Legnous City confronts evidence that its world is changing.',
     1, false),
    ('ad290002-0000-4000-8000-000000000002', adam_id,
     'Studying Rush’s Emergence', story_one_id,
     'Adam treats Rush as evidence supporting his public argument that humanity must prepare for rapid change.',
     2, false),
    ('6e290002-0000-4000-8000-000000000001', giver_id,
     'Becoming the Boundless King', story_one_id,
     'The Giver’s reach grows beyond territorial control into a network of access, secrets, power distribution, research, and institutional influence.',
     1, false),
    ('6e290002-0000-4000-8000-000000000002', giver_id,
     'Distributing Dangerous Opportunity', story_one_id,
     'The Giver facilitates power and opportunity for people in Legnous City’s hidden world, then studies what their choices produce.',
     2, false),
    ('e2290002-0000-4000-8000-000000000001', ezra_id,
     'Planning a Future in Legnous City', story_one_id,
     'Ezra prepares for university, expects to move in with Talon, and pursues football and an independent future.',
     1, false)
  ON CONFLICT (id) DO UPDATE
  SET
    character_id = EXCLUDED.character_id,
    title = EXCLUDED.title,
    story_id = EXCLUDED.story_id,
    summary_md = EXCLUDED.summary_md,
    sort_order = EXCLUDED.sort_order,
    is_spoiler = EXCLUDED.is_spoiler;

  DELETE FROM public.character_quotes
  WHERE character_id IN (adam_id, giver_id, ezra_id)
    AND id <> '6e290003-0000-4000-8000-000000000001'::uuid;

  IF EXISTS (
    SELECT 1
    FROM public.character_quotes
    WHERE id = '6e290003-0000-4000-8000-000000000001'::uuid
      AND character_id <> giver_id
  ) THEN
    RAISE EXCEPTION
      'Stable Giver quote UUID collides with another character';
  END IF;

  INSERT INTO public.character_quotes
    (id, character_id, quote_md, context_md, sort_order, is_spoiler)
  VALUES (
    '6e290003-0000-4000-8000-000000000001',
    giver_id,
    'The ends don’t justify the means… but they have to.',
    'The Giver’s central contradiction: he recognizes the moral cost of his methods while continuing to treat them as necessary for humanity’s survival.',
    1,
    false
  )
  ON CONFLICT (id) DO UPDATE
  SET
    character_id = EXCLUDED.character_id,
    quote_md = EXCLUDED.quote_md,
    context_md = EXCLUDED.context_md,
    sort_order = EXCLUDED.sort_order,
    is_spoiler = EXCLUDED.is_spoiler;

  -- Validate every shared power slug before a scoped upsert. A slug carrying an
  -- unrelated display name is treated as a conflict rather than silently linked.
  SELECT name INTO existing_power_name
  FROM public.power_systems
  WHERE slug = 'erasure';

  IF FOUND AND lower(trim(existing_power_name)) <> 'erasure' THEN
    RAISE EXCEPTION
      'Power slug erasure already exists with incompatible name "%"',
      existing_power_name;
  END IF;

  INSERT INTO public.power_systems
    (slug, name, summary_md, spoiler_md, canon_status, last_synced_at)
  VALUES (
    'erasure',
    'Erasure',
    'Contact-bound authority to remove, nullify, undo, edit, or erase matter, effects, alterations, powers, and created phenomena.',
    'Its theoretical conceptual authority is broader than demonstrated Story 1 uses. Physical contact, self-restraint, resistance, judgment, cost, consequences, and unresolved limits prevent treating it as unrestricted casual erasure.',
    'canon',
    '2026-07-29T09:00:00-04:00'::timestamptz
  )
  ON CONFLICT (slug) DO UPDATE
  SET
    name = EXCLUDED.name,
    summary_md = EXCLUDED.summary_md,
    spoiler_md = EXCLUDED.spoiler_md,
    canon_status = EXCLUDED.canon_status,
    last_synced_at = EXCLUDED.last_synced_at
  RETURNING id INTO erasure_id;

  SELECT name INTO existing_power_name
  FROM public.power_systems
  WHERE slug = 'immortality';

  IF FOUND AND lower(trim(existing_power_name)) <> 'immortality' THEN
    RAISE EXCEPTION
      'Power slug immortality already exists with incompatible name "%"',
      existing_power_name;
  END IF;

  INSERT INTO public.power_systems
    (slug, name, summary_md, spoiler_md, canon_status, last_synced_at)
  VALUES (
    'immortality',
    'Immortality',
    'Life beyond a normal human span while retaining a relatively young appearance.',
    'The source establishes more than a century of life and the appearance of a man in his late thirties. Regeneration, resurrection, injury recovery, and exact mechanics remain undefined.',
    'canon',
    '2026-07-29T09:00:00-04:00'::timestamptz
  )
  ON CONFLICT (slug) DO UPDATE
  SET
    name = EXCLUDED.name,
    summary_md = EXCLUDED.summary_md,
    spoiler_md = EXCLUDED.spoiler_md,
    canon_status = EXCLUDED.canon_status,
    last_synced_at = EXCLUDED.last_synced_at
  RETURNING id INTO immortality_id;

  SELECT name INTO existing_power_name
  FROM public.power_systems
  WHERE slug = 'natural-red-crystal-energy-generation';

  IF FOUND
     AND lower(trim(existing_power_name)) <> 'natural red crystal energy generation' THEN
    RAISE EXCEPTION
      'Power slug natural-red-crystal-energy-generation already exists with incompatible name "%"',
      existing_power_name;
  END IF;

  INSERT INTO public.power_systems
    (slug, name, summary_md, spoiler_md, canon_status, last_synced_at)
  VALUES (
    'natural-red-crystal-energy-generation',
    'Natural Red Crystal Energy Generation',
    'Natural production of Red Crystal energy inside the body rather than absorption or storage of an external supply.',
    'The energy can support physical augmentation without ordinary Red Crystal side effects. Capacity, recharge, transformations, techniques, exhaustion, and upper limits remain undefined.',
    'canon',
    '2026-07-29T09:00:00-04:00'::timestamptz
  )
  ON CONFLICT (slug) DO UPDATE
  SET
    name = EXCLUDED.name,
    summary_md = EXCLUDED.summary_md,
    spoiler_md = EXCLUDED.spoiler_md,
    canon_status = EXCLUDED.canon_status,
    last_synced_at = EXCLUDED.last_synced_at
  RETURNING id INTO natural_red_crystal_id;

  SELECT name INTO existing_power_name
  FROM public.power_systems
  WHERE slug = 'physical-augmentation';

  IF FOUND AND lower(trim(existing_power_name)) <> 'physical augmentation' THEN
    RAISE EXCEPTION
      'Power slug physical-augmentation already exists with incompatible name "%"',
      existing_power_name;
  END IF;

  INSERT INTO public.power_systems
    (slug, name, summary_md, spoiler_md, canon_status, last_synced_at)
  VALUES (
    'physical-augmentation',
    'Physical Augmentation',
    'Energy-driven enhancement of strength, durability, stamina, and general physical performance.',
    'The system does not establish numerical feats, named techniques, transformations, or a clean upper limit.',
    'canon',
    '2026-07-29T09:00:00-04:00'::timestamptz
  )
  ON CONFLICT (slug) DO UPDATE
  SET
    name = EXCLUDED.name,
    summary_md = EXCLUDED.summary_md,
    spoiler_md = EXCLUDED.spoiler_md,
    canon_status = EXCLUDED.canon_status,
    last_synced_at = EXCLUDED.last_synced_at
  RETURNING id INTO physical_augmentation_id;

  SELECT name INTO existing_power_name
  FROM public.power_systems
  WHERE slug = 'red-crystal';

  IF FOUND AND lower(trim(existing_power_name)) <> 'red crystal' THEN
    RAISE EXCEPTION
      'Power slug red-crystal already exists with incompatible name "%"',
      existing_power_name;
  END IF;

  INSERT INTO public.power_systems
    (slug, name, summary_md, spoiler_md, canon_status, last_synced_at)
  VALUES (
    'red-crystal',
    'Red Crystal',
    'An energized crystal associated with physical enhancement and sought by researchers, criminals, and enhancement institutions.',
    'This shared record intentionally does not define the complete crystal cosmology, every side effect, or every possible application.',
    'canon',
    '2026-07-29T09:00:00-04:00'::timestamptz
  )
  ON CONFLICT (slug) DO UPDATE
  SET
    name = EXCLUDED.name,
    summary_md = EXCLUDED.summary_md,
    spoiler_md = EXCLUDED.spoiler_md,
    canon_status = EXCLUDED.canon_status,
    last_synced_at = EXCLUDED.last_synced_at
  RETURNING id INTO red_crystal_id;

  -- Adam has no public structured powers. Ezra's three power records exist for
  -- future use but remain unlinked because character_powers is not spoiler-safe.
  DELETE FROM public.character_powers
  WHERE character_id IN (adam_id, ezra_id);

  DELETE FROM public.character_powers
  WHERE character_id = giver_id
    AND power_system_id NOT IN (erasure_id, immortality_id);

  INSERT INTO public.character_powers (character_id, power_system_id, notes)
  VALUES
    (giver_id, erasure_id,
     'The Giver can remove, nullify, undo, edit, or erase what he touches. Supported uses include erasing matter, nullifying supernatural effects, suppressing access to powers, undoing alterations, removing created phenomena, and countering creation abilities. Contact is required; theoretical authority, demonstrated use, self-restraint, resistance, cost, consequences, and unresolved limits must remain distinct.'),
    (giver_id, immortality_id,
     'The Giver has lived for more than a century while retaining the appearance of a man in his late thirties. Regeneration, resurrection, injury recovery, and exact immortal mechanics are not established.')
  ON CONFLICT (character_id, power_system_id) DO UPDATE
  SET notes = EXCLUDED.notes;

  -- Match The Order by canonical slug or exact name. A single name-only match
  -- can be normalized safely because any competing canonical slug would have
  -- increased candidate_count and failed this migration.
  SELECT count(*), (array_agg(id))[1]
  INTO candidate_count, order_id
  FROM public.factions
  WHERE slug = 'the-order'
     OR lower(trim(name)) = 'the order';

  IF candidate_count > 1 THEN
    RAISE EXCEPTION
      'Migration found % Order faction candidates; manual reconciliation is required',
      candidate_count;
  ELSIF candidate_count = 0 THEN
    INSERT INTO public.factions
      (slug, name, summary_md, spoiler_md, canon_status, last_synced_at)
    VALUES (
      'the-order',
      'The Order',
      'The Order is a hidden and internally varied organization dedicated to accelerating human advancement. Its work includes science, medicine, technology, crystal research, influence, containment, and the study of phenomena beyond conventional human understanding.',
      'It is capable of extraordinary progress, coercion, ethical failure, and atrocity, but it is not reducible to a simple villain faction.',
      'canon',
      '2026-07-29T09:00:00-04:00'::timestamptz
    )
    RETURNING id INTO order_id;
  ELSE
    SELECT name INTO STRICT existing_faction_name
    FROM public.factions
    WHERE id = order_id;

    IF lower(trim(existing_faction_name)) <> 'the order' THEN
      RAISE EXCEPTION
        'Faction slug the-order already exists with incompatible name "%"',
        existing_faction_name;
    END IF;

    UPDATE public.factions
    SET
      slug = 'the-order',
      name = 'The Order',
      summary_md = 'The Order is a hidden and internally varied organization dedicated to accelerating human advancement. Its work includes science, medicine, technology, crystal research, influence, containment, and the study of phenomena beyond conventional human understanding.',
      spoiler_md = 'It is capable of extraordinary progress, coercion, ethical failure, and atrocity, but it is not reducible to a simple villain faction.',
      canon_status = 'canon',
      last_synced_at = '2026-07-29T09:00:00-04:00'::timestamptz
    WHERE id = order_id;
  END IF;

  -- Only The Giver receives the public Order affiliation. Adam and Ezra retain
  -- sensitive faction context exclusively in spoiler_md.
  DELETE FROM public.character_factions
  WHERE character_id IN (adam_id, ezra_id);

  DELETE FROM public.character_factions
  WHERE character_id = giver_id
    AND faction_id <> order_id;

  INSERT INTO public.character_factions (character_id, faction_id, role)
  VALUES (giver_id, order_id, 'Founder and ultimate authority')
  ON CONFLICT (character_id, faction_id) DO UPDATE
  SET role = EXCLUDED.role;

  -- The current relationship renderer ignores is_spoiler. Adam therefore gets
  -- no structured relationships, and Ezra gets only his safe public family row.
  -- Incoming rows pointing to giver_id are not touched.
  DELETE FROM public.character_relationships
  WHERE character_id = adam_id;

  DELETE FROM public.character_relationships
  WHERE character_id = ezra_id
    AND related_character_id <> rush_id;

  DELETE FROM public.character_relationships r
  USING public.characters related
  WHERE r.character_id = giver_id
    AND related.id = r.related_character_id
    AND related.slug NOT IN (
      'rush',
      'jennifer',
      'fez',
      'room'
    );

  INSERT INTO public.character_relationships
    (character_id, related_character_id, relation_label, inverse_label, sort_order, is_spoiler)
  VALUES
    (giver_id, rush_id,
     'Subject of interest, potential instrument, and eventual research partner',
     'Underworld observer and eventual research partner', 1, false),
    (giver_id, jennifer_id,
     'Power beneficiary and experimental participant',
     'Power broker and experimenter', 2, false),
    (giver_id, fez_id,
     'Empowered criminal employee',
     'Power source and underworld employer', 3, false),
    (giver_id, room_id,
     'Underworld connection and indirect operative',
     'Underworld authority and former controller', 4, false),
    (ezra_id, rush_id,
     'Older brother, protector, mentor, and emotional anchor',
     'Younger brother and emotional anchor', 1, false)
  ON CONFLICT (character_id, related_character_id) DO UPDATE
  SET
    relation_label = EXCLUDED.relation_label,
    inverse_label = EXCLUDED.inverse_label,
    sort_order = EXCLUDED.sort_order,
    is_spoiler = EXCLUDED.is_spoiler;

  -- Optional cosmic and future relationships remain in spoiler prose. They are
  -- omitted from structured rows because relationship spoiler flags are not
  -- currently enforced by the frontend. No placeholder characters are created.
END $$;
