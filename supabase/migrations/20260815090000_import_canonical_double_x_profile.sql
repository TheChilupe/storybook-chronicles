-- Import only the creator-approved canonical Double X / DX profile.
-- Source priority: current creator clarification, then Story 1 Expansion Notes,
-- then the older Master Lore Index entry.
--
-- This migration deliberately creates no faction, location, character
-- relationship, character-faction, or character-location records. No portrait
-- is assigned because no approved Double X asset exists in the repository.

DO $$
DECLARE
  double_x_id uuid;
  story_one_id uuid;
  regeneration_id uuid;
  enhanced_physical_id uuid;
  combat_training_id uuid;
  candidate_count integer;
BEGIN
  SELECT id INTO STRICT story_one_id
  FROM public.stories
  WHERE slug = 'rush' AND number = 1;

  SELECT count(*), (array_agg(id))[1]
  INTO candidate_count, double_x_id
  FROM public.characters
  WHERE lower(trim(slug)) IN ('double-x', 'doublex', 'dx')
     OR lower(trim(name)) IN ('double x', 'double-x', 'dx')
     OR lower(trim(coalesce(alias, ''))) IN ('double x', 'double-x', 'dx');

  IF candidate_count > 1 THEN
    RAISE EXCEPTION
      'Double X migration found % candidates; manual reconciliation is required',
      candidate_count;
  ELSIF candidate_count = 0 THEN
    INSERT INTO public.characters (slug, name, alias)
    VALUES ('double-x', 'Double X', 'DX')
    RETURNING id INTO double_x_id;
  END IF;

  UPDATE public.characters
  SET
    slug = 'double-x',
    name = 'Double X',
    alias = 'DX',
    role = 'Major Antagonist',
    story_id = story_one_id,
    primary_story_id = story_one_id,
    eyebrow = 'Story 1 · Major Antagonist · First Supervillain',
    tagline = 'The failed manufactured superhero who chooses to become the world''s first supervillain.',
    canon_summary_md = $md$Double X is the Order's failed attempt to manufacture the world's first superhero, transformed by decades of regenerative warfare into a psychologically shattered weapon. When he witnesses Rush become a hero through nothing more than power, audacity, and belief in himself, DX becomes obsessed with the young speedster. Inspired by Rush's self-determination, DX chooses his own identity in return: the world's first supervillain. His campaign is part vengeance, part madness, and part deliberate trial. By attacking Rush's family, reputation, infrastructure, morality, and restraint, DX attempts to prove whether Rush truly deserves to be called a hero. His greatest danger is not that he can survive Rush's violence, but that his regeneration teaches Rush how easy lethal force can become when death stops appearing permanent.$md$,
    identity_md = $md$**Name:** Double X

**Common Alias:** DX

**Real Name:** Classified

**Age:** Mid-40s

**Classification:** Major Antagonist

**Primary Story:** Story 1

## Personality

- Traumatized and jaded
- Highly intelligent in combat
- Violent and psychologically unstable
- Determined, obsessive, and strategically perceptive
- Fascinated by, envious of, and inspired by Rush
- Resentful of institutional control
- Possessive of his confrontation with Rush
- Theatrical only when it serves his chosen supervillain identity$md$,
    story_role_md = $md$Double X enters after Rush has become a significant presence in Legnous City and transforms the stakes of Story 1. He is not simply a regenerating opponent: he attacks the money, infrastructure, planning, relationships, reputation, restraint, and family security that allow Rush to operate.

Rush becomes a superhero by choosing to try, without an institution manufacturing or approving him. That self-determination inspires and enrages DX, who deliberately chooses the identity of the world's first supervillain. He builds a brutal trial around Rush's heroic claim: if Rush can defeat him without losing what makes him a hero, then Rush deserves the title.

DX also demonstrates the lethal reality of Rush's speed. Because he can regenerate from injuries that would kill an ordinary opponent, Rush can use levels of force he normally suppresses. The physical conflict tests Rush's power; its moral consequences test his identity.$md$,
    core_conflict_md = $md$The Order created DX to represent humanity's future, judged him unfit to be a hero, and spent decades teaching him that his true value was surviving violence. When Rush becomes the self-made hero DX was denied the chance to be, DX chooses villainy and demands that Rush prove the title is deserved.$md$,
    spoiler_md = $md$## Background and Origin

Double X was one of the Order's earliest major enhanced individuals. The organization originally intended him to become the world's first superhero, not an assassin. After judging the project a failure—whether because of his temperament, instability, violence, incompatibility with its heroic vision, or some combination—the Order repurposed him as a soldier, black-ops operative, assassin, and enhanced weapon.

For more than twenty years, DX conducted covert operations, eliminated people connected to crystal knowledge or crystal hoarding, secured territory, assisted the Order's expansion, helped establish facilities and infrastructure, and survived missions ordinary operatives could not.

## Psychological Break

Decades of gunshots, burns, explosions, crushing trauma, mutilation, and other normally fatal injuries repeatedly destroyed DX's body. His regeneration rebuilt that body, but his mind did not recover in the same way. Experiencing death without its permanence or release left him deeply traumatized, unstable, fascinated by death, and envious of people who are allowed to die. His madness is the accumulated cost of regenerative warfare and institutional exploitation, not random insanity.

## Rush as Catalyst and Trial

Rush becomes what DX was supposed to be without being selected, manufactured, commissioned, or approved. Inspired by Rush choosing heroism, DX chooses villainy and declares himself the world's first supervillain. He does not merely want to murder Rush; he wants to challenge, expose, push, and test him. In DX's warped logic, defeating Double X is Rush's superhero certification.

DX attacks Rush's family, reputation, infrastructure, morality, restraint, finances, logistics, planning, and dependence on Room. He also becomes a crisis large enough to divide the attention of governments, law enforcement, the Order, and other institutions that might otherwise focus on controlling Rush. This is possessive, not kind: nobody gets to take DX's hero before he is finished with him.

## Healing Blood and DNA Overwrite

DX's blood has regenerative properties. Sufficient contact can rapidly heal another person's injuries, including extremely serious damage. Excessive absorption carries biological and psychological consequences: his biology begins interfering with or overwriting the recipient's, and extreme exposure can transfer mania, aggression, destructive impulses, and severe instability. Early theories may mistake the effect for cloning, bodily replacement, or DX taking control of another body.

## Defeat and Legacy

DX pushes Rush until Rush stops protecting him from the lethal consequences of super speed. Rush may kill him, watch him regenerate, and kill him again. That cycle teaches Rush what killing feels like when death appears temporary, leaving spiritual, emotional, and behavioral scars.

Rush ultimately defeats DX. Surviving and defeating a major supervillain helps legitimize Rush publicly and makes him viable for Apex recruitment. This fulfills DX's warped test: the Order failed to create the world's first superhero with Double X, but Double X helps create one by becoming the supervillain Rush has to defeat.$md$,
    portrait_url = NULL,
    accent_color = NULL,
    canon_status = 'canon',
    last_synced_at = '2026-08-15T09:00:00-04:00'::timestamptz,
    status = 'published',
    archived_at = NULL
  WHERE id = double_x_id;

  DELETE FROM public.character_stories
  WHERE character_id = double_x_id AND story_id <> story_one_id;

  INSERT INTO public.character_stories (character_id, story_id, role)
  VALUES (
    double_x_id,
    story_one_id,
    'Major antagonist, self-declared first supervillain, and defining test of Rush''s heroism'
  )
  ON CONFLICT (character_id, story_id) DO UPDATE
  SET role = EXCLUDED.role;

  -- The approved source establishes no structured eras, story notes, key
  -- moments, or quotes. Keep those unsupported sections empty.
  DELETE FROM public.character_eras WHERE character_id = double_x_id;
  DELETE FROM public.character_story_notes WHERE character_id = double_x_id;
  DELETE FROM public.character_key_moments WHERE character_id = double_x_id;
  DELETE FROM public.character_quotes WHERE character_id = double_x_id;

  INSERT INTO public.power_systems
    (slug, name, summary_md, spoiler_md, canon_status, notion_source_url, last_synced_at)
  VALUES
    (
      'regenerative-healing-factor',
      'Regenerative Healing Factor',
      'An extraordinary healing factor that allows recovery from catastrophic and normally fatal injuries, including gunshots, burns, explosions, severe trauma, and otherwise lethal damage. The ability makes permanent death extremely difficult and is both DX''s defining power and a profound source of trauma.',
      'DX''s blood can rapidly heal injuries in another person. Excessive absorption can cause DNA interference or overwrite and transfer mania, aggression, destructive impulses, and severe psychological instability.',
      'canon', NULL, '2026-08-15T09:00:00-04:00'::timestamptz
    ),
    (
      'enhanced-physical-abilities',
      'Enhanced Physical Abilities',
      'Enhanced strength, speed, agility, endurance, and reflexes above normal and peak-human standards. These enhancements are dangerous in combination with regeneration, combat experience, tactical knowledge, and a willingness to absorb catastrophic injury, but they are not DX''s defining source of power.',
      NULL,
      'canon', NULL, '2026-08-15T09:00:00-04:00'::timestamptz
    ),
    (
      'elite-combat-training',
      'Elite Combat Training',
      'Decades of military and covert-service expertise encompassing hand-to-hand combat, firearms, tactical operations, assassination, covert warfare, military strategy, and battlefield adaptability. DX fights like an experienced professional killer rather than a theatrical superhero.',
      NULL,
      'canon', NULL, '2026-08-15T09:00:00-04:00'::timestamptz
    )
  ON CONFLICT (slug) DO UPDATE
  SET
    name = EXCLUDED.name,
    summary_md = EXCLUDED.summary_md,
    spoiler_md = EXCLUDED.spoiler_md,
    canon_status = EXCLUDED.canon_status,
    notion_source_url = EXCLUDED.notion_source_url,
    last_synced_at = EXCLUDED.last_synced_at;

  SELECT id INTO STRICT regeneration_id
  FROM public.power_systems WHERE slug = 'regenerative-healing-factor';
  SELECT id INTO STRICT enhanced_physical_id
  FROM public.power_systems WHERE slug = 'enhanced-physical-abilities';
  SELECT id INTO STRICT combat_training_id
  FROM public.power_systems WHERE slug = 'elite-combat-training';

  DELETE FROM public.character_powers
  WHERE character_id = double_x_id
    AND power_system_id NOT IN (regeneration_id, enhanced_physical_id, combat_training_id);

  INSERT INTO public.character_powers (character_id, power_system_id, notes)
  VALUES
    (
      double_x_id,
      regeneration_id,
      'DX can recover from catastrophic and normally fatal injuries. Regeneration is his defining ability and allows him to survive damage that would permanently kill an ordinary opponent.'
    ),
    (
      double_x_id,
      enhanced_physical_id,
      'DX has enhanced strength, speed, agility, endurance, and reflexes, but his primary danger comes from combining them with regeneration and experience.'
    ),
    (
      double_x_id,
      combat_training_id,
      'More than twenty years of military, black-ops, assassination, and covert-warfare experience make DX a tactical and adaptable professional combatant.'
    )
  ON CONFLICT (character_id, power_system_id) DO UPDATE
  SET notes = EXCLUDED.notes;
END $$;
