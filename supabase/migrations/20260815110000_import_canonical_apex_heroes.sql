-- Import the creator-approved Story 1 Apex hero batch: Aegis, Lifeline,
-- Prism, Insight, and Resolve.
--
-- This migration deliberately creates no faction, world, location, character
-- relationship, character-faction, or media records. Apex affiliations remain
-- creator-managed through Gate 3A. No portrait is assigned because no approved
-- asset for these characters exists in the repository.

DO $$
DECLARE
  story_one_id uuid;
  aegis_id uuid;
  lifeline_id uuid;
  prism_id uuid;
  insight_id uuid;
  resolve_id uuid;
  candidate_count integer;
BEGIN
  SELECT id INTO STRICT story_one_id
  FROM public.stories
  WHERE slug = 'rush' AND number = 1;

  SELECT count(*), (array_agg(id))[1] INTO candidate_count, aegis_id
  FROM public.characters
  WHERE lower(trim(slug)) = 'aegis'
     OR lower(trim(name)) IN ('aegis', 'ricky nolan')
     OR lower(trim(coalesce(alias, ''))) = 'aegis';
  IF candidate_count > 1 THEN
    RAISE EXCEPTION 'Aegis migration found % candidates; manual reconciliation is required', candidate_count;
  ELSIF candidate_count = 0 THEN
    INSERT INTO public.characters (slug, name, alias)
    VALUES ('aegis', 'Ricky Nolan', 'Aegis') RETURNING id INTO aegis_id;
  END IF;

  UPDATE public.characters SET
    slug = 'aegis', name = 'Ricky Nolan', alias = 'Aegis',
    role = 'Supporting Character', story_id = story_one_id, primary_story_id = story_one_id,
    eyebrow = 'Story 1 · Supporting Character · Apex Rank 2',
    tagline = 'Apex''s reassuring public shield, built to stand between ordinary people and danger.',
    canon_summary_md = $md$Aegis is Apex's Rank 2 hero and one of the organization's most recognizable public protectors. Specializing in force fields, impact absorption, civilian rescue, and defensive combat, he embodies the reassuring image of a hero who stands between ordinary people and danger. Beneath his noble public persona is a proud, sometimes anxious young man whose need for structure becomes increasingly important as Apex begins to collapse.$md$,
    identity_md = $md$**Hero Name:** Aegis

**Real Name:** Ricky Nolan

**Classification:** Supporting Character

**Primary Story:** Story 1

**Apex Rank:** 2

**Background:** Mixed white and Hispanic

## Personality

Aegis is proud, noble, charismatic, protective, playful, and comfortable projecting confidence on a public stage. Interviews make him anxious despite that stage presence, and he relies on stable structures when circumstances become chaotic.

## Origin

Ricky participated in a youth police program. After his younger sister was killed by a stray bullet during gang violence, he committed himself to becoming the shield that could stand between civilians and danger.$md$,
    story_role_md = $md$Aegis serves as Apex's leading defensive and rescue specialist. He generates protection, absorbs impacts, controls dangerous situations, and prioritizes civilians rather than seeking raw destructive force.

He and Rush have a public friendship shaped by playful friction and training. Aegis also helps introduce Rush socially to the Zealots. These connections do not establish a structured faction membership or character relationship record.$md$,
    core_conflict_md = $md$Aegis's reassuring public identity depends on confidence and institutional stability. As Apex begins to collapse, his pride and anxiety force him to confront what remains of that identity when the structure supporting it can no longer be trusted.$md$,
    spoiler_md = $md$## Purple War and Aftermath

Aegis survives the Purple War, but survival leaves him carrying guilt while Lifeline's condition and Apex's collapse destroy much of the stability he relied upon.

By Season 3, he moves toward law enforcement and later uses the alias Guardian. Guardian is a later identity only and is not created as a separate character by this migration.

Aegis has a crush on Rina, but the details and development of that thread are later-story spoiler material and remain unstructured here.$md$,
    portrait_url = NULL, accent_color = NULL, canon_status = 'canon',
    last_synced_at = '2026-08-15T11:00:00-04:00'::timestamptz,
    status = 'published', archived_at = NULL
  WHERE id = aegis_id;

  SELECT count(*), (array_agg(id))[1] INTO candidate_count, lifeline_id
  FROM public.characters
  WHERE lower(trim(slug)) = 'lifeline'
     OR lower(trim(name)) IN ('lifeline', 'sarah-lin bailey')
     OR lower(trim(coalesce(alias, ''))) = 'lifeline';
  IF candidate_count > 1 THEN
    RAISE EXCEPTION 'Lifeline migration found % candidates; manual reconciliation is required', candidate_count;
  ELSIF candidate_count = 0 THEN
    INSERT INTO public.characters (slug, name, alias)
    VALUES ('lifeline', 'Sarah-Lin Bailey', 'Lifeline') RETURNING id INTO lifeline_id;
  END IF;

  UPDATE public.characters SET
    slug = 'lifeline', name = 'Sarah-Lin Bailey', alias = 'Lifeline',
    role = 'Supporting Character', story_id = story_one_id, primary_story_id = story_one_id,
    eyebrow = 'Story 1 · Supporting Character · Apex Rank 3',
    tagline = 'Apex''s compassionate healer, carrying an extraordinary but finite reserve of life force.',
    canon_summary_md = $md$Lifeline is Apex's Rank 3 hero, a former music artist whose desire to heal people through song becomes literal after receiving powers through Apex. Gifted with an enormous reserve of healing life force alongside telepathy and emotional communication, she becomes one of the organization's most valuable support heroes. Her compassion is also her vulnerability: she experiences tremendous guilt when she cannot save someone, and the Purple War eventually forces her to confront the horrifying reality that even extraordinary healing has limits.$md$,
    identity_md = $md$**Hero Name:** Lifeline

**Real Name:** Sarah-Lin Bailey

**Classification:** Supporting Character

**Primary Story:** Story 1

**Apex Rank:** 3

## Background and Personality

Sarah-Lin was raised as a music artist and recruited through an Apex talent show. She wanted her music to help people heal emotionally; Apex transformed that aspiration into literal healing power.

She is compassionate and emotionally perceptive, with a strong need to help others. That compassion makes every person she cannot save feel like a personal failure.$md$,
    story_role_md = $md$Lifeline is one of Apex's most valuable support heroes. Her healing reserve, telepathy, and ability to stabilize emotions make her essential during rescues, recovery, and crises. Her power is vast but not limitless: treatment costs vary with the injury, effective healing requires anatomical knowledge, and depletion can leave her without enough life force for the next person who needs her.$md$,
    core_conflict_md = $md$Lifeline defines herself through helping and healing others, but her finite reserve makes perfect rescue impossible. She must face the difference between extraordinary responsibility and an impossible obligation to save everyone.$md$,
    spoiler_md = $md$## Recovery Connections

Lifeline develops an important nonromantic recovery relationship with Blue. Its details belong to later spoiler material and are not represented as a structured relationship here.

## Purple War and Aftermath

During the Purple War, Lifeline is nearly killed, suffers broken arms, and endures severe triage trauma as the demand for healing exceeds even her extraordinary capacity. The aftermath includes agoraphobia, her dismissal from Apex, and a possible future romance with Dread. These developments remain spoiler-controlled and no relationship is created.$md$,
    portrait_url = NULL, accent_color = NULL, canon_status = 'canon',
    last_synced_at = '2026-08-15T11:00:00-04:00'::timestamptz,
    status = 'published', archived_at = NULL
  WHERE id = lifeline_id;

  SELECT count(*), (array_agg(id))[1] INTO candidate_count, prism_id
  FROM public.characters
  WHERE lower(trim(slug)) = 'prism'
     OR lower(trim(name)) IN ('prism', 'claire fraser')
     OR lower(trim(coalesce(alias, ''))) = 'prism';
  IF candidate_count > 1 THEN
    RAISE EXCEPTION 'Prism migration found % candidates; manual reconciliation is required', candidate_count;
  ELSIF candidate_count = 0 THEN
    INSERT INTO public.characters (slug, name, alias)
    VALUES ('prism', 'Claire Fraser', 'Prism') RETURNING id INTO prism_id;
  END IF;

  UPDATE public.characters SET
    slug = 'prism', name = 'Claire Fraser', alias = 'Prism',
    role = 'Supporting Character', story_id = story_one_id, primary_story_id = story_one_id,
    eyebrow = 'Story 1 · Supporting Character · Apex Rank 5',
    tagline = 'Apex''s hard-light capture specialist, built for control rather than destruction.',
    canon_summary_md = $md$Prism is Apex's Rank 5 hero and its hard-light capture specialist, creating restraints, chains, shackles, and cages designed to render dangerous opponents powerless. Bright, proud, steadfast, and openly emotional, she brings a fierce competitive energy to the team and embraces Rush's tendency to turn training into games. Her role within Apex emphasizes capture and control rather than raw destruction.$md$,
    identity_md = $md$**Hero Name:** Prism

**Real Name:** Claire Fraser

**Classification:** Supporting Character

**Primary Story:** Story 1

**Apex Rank:** 5

## Personality

Prism is bright, proud, steadfast, openly emotional, and fiercely competitive. She embraces Rush's habit of turning training into games and brings that same energy to her place within Apex.$md$,
    story_role_md = $md$Prism is Apex's capture-and-control specialist. Her hard-light restraints, chains, shackles, and cages are designed to immobilize dangerous opponents and render them powerless without relying on raw destruction.$md$,
    core_conflict_md = $md$Prism's pride and steadfast loyalty make her a vivid part of Apex's competitive team identity, while her capture-focused role asks her to prove that control and restraint can matter as much as destructive power.$md$,
    spoiler_md = $md$## Purple War

Prism dies during the Purple War. The sequence of her death and its narrative meaning are later-story spoiler material: her loss demonstrates the cost of Apex's collapse and the war's ability to destroy even steadfast heroes whose powers are built around control.$md$,
    portrait_url = NULL, accent_color = NULL, canon_status = 'canon',
    last_synced_at = '2026-08-15T11:00:00-04:00'::timestamptz,
    status = 'published', archived_at = NULL
  WHERE id = prism_id;

  SELECT count(*), (array_agg(id))[1] INTO candidate_count, insight_id
  FROM public.characters
  WHERE lower(trim(slug)) = 'insight'
     OR lower(trim(name)) IN ('insight', 'hinata')
     OR lower(trim(coalesce(alias, ''))) = 'insight';
  IF candidate_count > 1 THEN
    RAISE EXCEPTION 'Insight migration found % candidates; manual reconciliation is required', candidate_count;
  ELSIF candidate_count = 0 THEN
    INSERT INTO public.characters (slug, name, alias)
    VALUES ('insight', 'Hinata', 'Insight') RETURNING id INTO insight_id;
  END IF;

  UPDATE public.characters SET
    slug = 'insight', name = 'Hinata', alias = 'Insight',
    role = 'Supporting Character', story_id = story_one_id, primary_story_id = story_one_id,
    eyebrow = 'Story 1 · Supporting Character · Apex Tactical Specialist',
    tagline = 'A precognitive martial artist who values effective analysis over celebrity.',
    canon_summary_md = $md$Insight is an Apex hero, tactical specialist, and precognitive martial artist who deliberately avoids the organization's public Top Five because he values effectiveness and intellectual challenge more than celebrity. Able to see as far as five minutes into the future, he compresses his perception to mere seconds during combat, allowing him to analyze changing futures in real time. Insight becomes a natural intellectual companion to H and Hawks and teaches Rush the rapid situational analysis that later becomes essential to surviving enemies far beyond ordinary human capability.$md$,
    identity_md = $md$**Hero Name:** Insight

**Real Name:** Hinata

**Surname:** Unresolved

**Classification:** Supporting Character

**Primary Story:** Story 1

**Apex Standing:** Official hero outside the public Top Five by choice

**Background:** Asian; nationality is not established

## Personality and Skills

Insight is analytical, intellectually curious, disciplined, and more interested in effectiveness than celebrity. He is an accomplished martial artist and brings combat analysis, tactics, and investigation to his work. Those trained skills remain distinct from his supernatural precognition.$md$,
    story_role_md = $md$Insight serves as an Apex tactical specialist and precognitive combatant. He becomes a natural intellectual companion to H and Hawks; those connections are textual only and do not create structured relationships.

He teaches Rush a rapid situational-analysis discipline known as Quick Thought. The method later becomes essential when Rush faces threats too powerful for ordinary reactions alone. During the Hero Era, Insight also holds a detective license.$md$,
    core_conflict_md = $md$Insight chooses intellectual challenge and practical effectiveness over Apex celebrity, placing him inside the organization while deliberately remaining outside the status structure represented by its public Top Five.$md$,
    spoiler_md = $md$## Eos and the Purple War

Insight's precognition later connects to Eos and a fragment of the Purple domain. The exact mechanics and implications remain spoiler material.

Insight dies during the Purple War. His death belongs to the war's later-story consequences and must not be exposed in public summary content.$md$,
    portrait_url = NULL, accent_color = NULL, canon_status = 'canon',
    last_synced_at = '2026-08-15T11:00:00-04:00'::timestamptz,
    status = 'published', archived_at = NULL
  WHERE id = insight_id;

  SELECT count(*), (array_agg(id))[1] INTO candidate_count, resolve_id
  FROM public.characters
  WHERE lower(trim(slug)) = 'resolve'
     OR lower(trim(name)) IN ('resolve', 'tyson miles')
     OR lower(trim(coalesce(alias, ''))) = 'resolve';
  IF candidate_count > 1 THEN
    RAISE EXCEPTION 'Resolve migration found % candidates; manual reconciliation is required', candidate_count;
  ELSIF candidate_count = 0 THEN
    INSERT INTO public.characters (slug, name, alias)
    VALUES ('resolve', 'Tyson Miles', 'Resolve') RETURNING id INTO resolve_id;
  END IF;

  UPDATE public.characters SET
    slug = 'resolve', name = 'Tyson Miles', alias = 'Resolve',
    role = 'Supporting Character', story_id = story_one_id, primary_story_id = story_one_id,
    eyebrow = 'Story 1 · Supporting Character · Apex Electrical Powerhouse',
    tagline = 'An abrasive Apex hero whose criticism of celebrity never becomes admiration for Rush.',
    canon_summary_md = $md$Resolve is an Apex hero and electrical powerhouse whose resentment toward Rush masks several legitimate concerns about fame, institutional favoritism, and the danger of elevating an extraordinarily powerful but poorly understood young hero too quickly. Jealous, proud, and frequently abrasive toward Rush, Resolve never becomes his friend or admirer. Yet when the Purple War strips away rankings and celebrity, Resolve ultimately proves his heroism not through recognition but through protecting ordinary citizens.$md$,
    identity_md = $md$**Hero Name:** Resolve

**Real Name:** Tyson Miles

**Classification:** Supporting Character

**Primary Story:** Story 1

**Apex Standing:** Official hero outside the public Top Five

**Background:** Black / African-American

## Personality

Resolve is proud, jealous, abrasive, perceptive, and deeply concerned with whether institutions distribute recognition fairly. His belief that racial unfairness influences public and institutional treatment is his perspective, not an objective conclusion asserted by this profile.$md$,
    story_role_md = $md$Resolve challenges Rush's rapid elevation within the heroic establishment. Some of his objections are rooted in jealousy, but his concerns about fame, institutional favoritism, and granting status to an extraordinarily powerful, poorly understood young hero remain valid questions. He never becomes Rush's friend, admirer, or reconciled ally.$md$,
    core_conflict_md = $md$Resolve wants recognition and resents the attention Rush receives, yet his criticism contains real concerns that cannot be dismissed simply because jealousy shapes how he expresses them. His ultimate test is whether he will act heroically when rank and recognition no longer matter.$md$,
    spoiler_md = $md$## Purple War

Resolve dies protecting ordinary civilians during the Purple War, proving his heroism through action rather than recognition. The exact mechanism of his death remains unresolved and is deliberately not hard-coded here.$md$,
    portrait_url = NULL, accent_color = NULL, canon_status = 'canon',
    last_synced_at = '2026-08-15T11:00:00-04:00'::timestamptz,
    status = 'published', archived_at = NULL
  WHERE id = resolve_id;

  -- The approved batch is exclusively Story 1 and establishes no structured
  -- eras, notes, key moments, or quotations.
  DELETE FROM public.character_stories
  WHERE character_id IN (aegis_id, lifeline_id, prism_id, insight_id, resolve_id)
    AND story_id <> story_one_id;

  INSERT INTO public.character_stories (character_id, story_id, role) VALUES
    (aegis_id, story_one_id, 'Supporting Apex hero, Rank 2 defensive specialist, and public protector'),
    (lifeline_id, story_one_id, 'Supporting Apex hero, Rank 3 healer, and emotional support specialist'),
    (prism_id, story_one_id, 'Supporting Apex hero, Rank 5 hard-light capture specialist'),
    (insight_id, story_one_id, 'Supporting Apex tactical specialist and precognitive martial artist'),
    (resolve_id, story_one_id, 'Supporting Apex electrical powerhouse and critic of Rush''s rapid elevation')
  ON CONFLICT (character_id, story_id) DO UPDATE SET role = EXCLUDED.role;

  DELETE FROM public.character_eras WHERE character_id IN (aegis_id, lifeline_id, prism_id, insight_id, resolve_id);
  DELETE FROM public.character_story_notes WHERE character_id IN (aegis_id, lifeline_id, prism_id, insight_id, resolve_id);
  DELETE FROM public.character_key_moments WHERE character_id IN (aegis_id, lifeline_id, prism_id, insight_id, resolve_id);
  DELETE FROM public.character_quotes WHERE character_id IN (aegis_id, lifeline_id, prism_id, insight_id, resolve_id);

  INSERT INTO public.power_systems
    (slug, name, summary_md, spoiler_md, canon_status, notion_source_url, last_synced_at)
  VALUES
    ('force-field-generation', 'Force Field Generation', 'Creates protective force fields used for civilian rescue, defensive combat, shielding, and standing between people and incoming danger.', NULL, 'canon', NULL, '2026-08-15T11:00:00-04:00'::timestamptz),
    ('impact-absorption', 'Impact Absorption', 'Absorbs incoming physical impacts, reinforcing Aegis''s role as a defensive protector and rescue specialist.', NULL, 'canon', NULL, '2026-08-15T11:00:00-04:00'::timestamptz),
    ('healing-life-force-manipulation', 'Healing / Life Force Manipulation', 'Uses an enormous but finite daily reserve of life force to heal others. Different injuries have different costs, effective treatment depends on anatomical knowledge, the reserve restores slowly, and heavy use can leave it depleted for hours. A passive effect provides limited healing to people nearby, while focused training improves deliberate treatment.', 'The Purple War forces demand beyond Lifeline''s available reserve and confronts her with the limits of even extraordinary healing.', 'canon', NULL, '2026-08-15T11:00:00-04:00'::timestamptz),
    ('telepathy', 'Telepathy', 'Supports direct mental communication and allows Lifeline to perceive and communicate with others beyond ordinary speech.', NULL, 'canon', NULL, '2026-08-15T11:00:00-04:00'::timestamptz),
    ('emotional-stabilization', 'Emotional Stabilization', 'Uses emotional communication to help calm and stabilize people during distress, recovery, and crisis.', NULL, 'canon', NULL, '2026-08-15T11:00:00-04:00'::timestamptz),
    ('hard-light-constructs', 'Hard-Light Constructs', 'Creates capture-focused restraints, chains, shackles, and cages designed to immobilize dangerous opponents and render them powerless. The established ability emphasizes capture and control, not lasers, flight, or unsupported weapons.', NULL, 'canon', NULL, '2026-08-15T11:00:00-04:00'::timestamptz),
    ('precognition', 'Precognition', 'True supernatural perception of possible events as far as roughly five minutes into the future. During combat, Insight compresses that window to mere seconds so he can analyze changing futures in real time. Martial arts, tactics, investigation, and combat analysis are trained skills rather than separate expressions of this power.', 'The ability later connects to Eos and a fragment of the Purple domain; its exact mechanics remain unresolved.', 'canon', NULL, '2026-08-15T11:00:00-04:00'::timestamptz),
    ('electricity-generation-and-emission', 'Electricity Generation and Emission', 'Generates and emits electricity through electric waves, energy bursts, electromagnetic shockwaves, stunning discharges, and overload effects. No additional electrical abilities are established here.', NULL, 'canon', NULL, '2026-08-15T11:00:00-04:00'::timestamptz)
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name, summary_md = EXCLUDED.summary_md, spoiler_md = EXCLUDED.spoiler_md,
    canon_status = EXCLUDED.canon_status, notion_source_url = EXCLUDED.notion_source_url,
    last_synced_at = EXCLUDED.last_synced_at;

  DELETE FROM public.character_powers
  WHERE character_id IN (aegis_id, lifeline_id, prism_id, insight_id, resolve_id);

  INSERT INTO public.character_powers (character_id, power_system_id, notes)
  SELECT aegis_id, id, CASE slug
    WHEN 'force-field-generation' THEN 'Aegis uses force fields for shielding, civilian rescue, and defensive control.'
    ELSE 'Aegis absorbs impacts while protecting civilians and controlling defensive engagements.' END
  FROM public.power_systems WHERE slug IN ('force-field-generation', 'impact-absorption')
  UNION ALL
  SELECT lifeline_id, id, CASE slug
    WHEN 'healing-life-force-manipulation' THEN 'Lifeline''s healing reserve is enormous but finite, injury costs vary, and depletion can last for hours.'
    WHEN 'telepathy' THEN 'Telepathy supports Lifeline''s mental communication and emotionally attentive support role.'
    ELSE 'Emotional communication allows Lifeline to calm and stabilize people in distress.' END
  FROM public.power_systems WHERE slug IN ('healing-life-force-manipulation', 'telepathy', 'emotional-stabilization')
  UNION ALL
  SELECT prism_id, id, 'Prism creates hard-light restraints and containment structures for capture rather than raw destruction.'
  FROM public.power_systems WHERE slug = 'hard-light-constructs'
  UNION ALL
  SELECT insight_id, id, 'Insight can look roughly five minutes ahead or compress perception to seconds for changing real-time combat analysis.'
  FROM public.power_systems WHERE slug = 'precognition'
  UNION ALL
  SELECT resolve_id, id, 'Resolve emits electrical waves, bursts, electromagnetic shockwaves, stunning discharges, and overload effects.'
  FROM public.power_systems WHERE slug = 'electricity-generation-and-emission';
END $$;
