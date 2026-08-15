-- Import only the creator-approved canonical H / Mercenary H profile.
-- Source priority: current creator clarification, then Story 1 Expansion Notes,
-- then the older Master Lore Index entry.
--
-- The retired blindness concept is deliberately excluded: H has normal vision,
-- and energy sensing supplements rather than replaces sight. This migration
-- creates no faction, location, or character relationship records and assigns
-- no portrait because no approved current H asset exists in the repository.

DO $$
DECLARE
  h_id uuid;
  story_one_id uuid;
  story_two_id uuid;
  localized_speed_id uuid;
  energy_sensing_id uuid;
  martial_arts_id uuid;
  candidate_count integer;
BEGIN
  SELECT id INTO STRICT story_one_id
  FROM public.stories
  WHERE slug = 'rush' AND number = 1;

  SELECT id INTO STRICT story_two_id
  FROM public.stories
  WHERE slug = 'azul' AND number = 2;

  SELECT count(*), (array_agg(id))[1]
  INTO candidate_count, h_id
  FROM public.characters
  WHERE lower(trim(slug)) IN ('h', 'mercenary-h', 'mercenaryh')
     OR lower(trim(name)) IN ('h', 'mercenary h', 'mercenary-h')
     OR lower(trim(coalesce(alias, ''))) IN ('h', 'mercenary h', 'mercenary-h');

  IF candidate_count > 1 THEN
    RAISE EXCEPTION
      'H migration found % candidates; manual reconciliation is required',
      candidate_count;
  ELSIF candidate_count = 0 THEN
    INSERT INTO public.characters (slug, name, alias)
    VALUES ('h', 'H', 'Mercenary H')
    RETURNING id INTO h_id;
  END IF;

  UPDATE public.characters
  SET
    slug = 'h',
    name = 'H',
    alias = 'Mercenary H',
    role = 'Supporting Character',
    story_id = story_one_id,
    primary_story_id = story_one_id,
    eyebrow = 'Story 1 · Supporting Character · World-Famous Mercenary',
    tagline = 'Rush''s rival, training partner, and second genuine friend of his new heroic life.',
    canon_summary_md = $md$H is a world-famous mercenary and martial-arts obsessive whose speed manifests through extraordinary precision rather than Rush's raw travel and acceleration. Primarily contracted by the Order, H initially encounters Rush as an opponent but becomes fascinated by the young speedster's improvisation and potential. Their repeated battles grow into rivalry, training, and eventually one of Rush's earliest genuine friendships, with H becoming the second friend Rush gains through his new life as a hero. Beneath H's disciplined professional exterior is an enthusiastic student of martial arts movies, manga, combat theory, and food, the latter fueled by the enormous caloric demands of his abilities. Together, H and Rush become co-researchers of speed, developing techniques neither could discover alone. Unknown to Rush at first, H's history reaches further back: before Double X fully descended into madness, H worked for him and trained beside him, making H a quiet bridge between the failed hero who became the first supervillain and the self-made hero who would ultimately defeat him.$md$,
    identity_md = $md$**Name:** H

**Known As:** Mercenary H

**Real Name:** Unknown

**Age:** 28

**Occupation:** Mercenary

**Classification:** Supporting Character

**Primary Story:** Story 1

**Story Appearances:** Story 1, Story 2

**Vision:** Normal. Energy sensing is an additional combat sense that supplements ordinary sight.

## Personality

- Disciplined, observant, and calm under pressure
- Professional, confident, precise, and difficult to intimidate
- Intelligent, competitive, and curious about combat
- Emotionally controlled while working without being emotionally flat
- Deeply enthusiastic about martial arts movies, fight choreography, manga, combat-focused anime, weapons, history, and technique theory
- A serious foodie who remembers restaurants, regional meals, and worthwhile places to eat

## Professional Code

H values loyalty to accepted contracts, avoids unnecessary killing, maintains personal boundaries regarding targets, respects worthy opponents, and does not kill women or children. His morality begins with professional honor rather than superhero ethics.$md$,
    story_role_md = $md$H first meets Rush through professional conflict. Rush may be faster across distance and still lose exchanges because H has superior timing, precision, positioning, reaction, discipline, and technical combat knowledge. Their confrontations develop from opponents to recurring rivals, willing sparring partners, training partners, and friends. H remains Rush's peer rather than becoming a sidekick, mentor, subordinate hero, or permanent team member.

H is the second genuine friend Rush gains specifically through his superhero life. He becomes foundational to Rush's early years: a rival, physical measuring stick, frequent training partner, and co-researcher of speed and movement mechanics. Rush often proposes unusual possibilities through improvisation; H tests, counters, and refines them into controlled technique. Neither is solely responsible for their discoveries.

H is a famous and respected mercenary rather than an anonymous gun-for-hire. His contracts can involve high-risk retrieval, protection, intelligence, combat, enhanced targets, and assassination within his personal rules. The Order is his primary recurring client, but he is not established here as a formal member.

His abilities demand enormous energy and calories. Food is both biological maintenance and a genuine interest developed through extensive travel. Shared meals after difficult training give H and Rush an ordinary friendship beyond combat.$md$,
    core_conflict_md = $md$H begins by measuring integrity through professional discipline and loyalty to accepted contracts. His friendship with Rush forces him to confront that honoring a contract and doing the right thing are not always the same.$md$,
    spoiler_md = $md$## Double X History

Before meeting Rush, H worked for Double X and trained with him during a period when DX was still comparatively sane and functional. H knew the professional soldier, experienced fighter, employer, and training partner who existed before DX's complete psychological collapse. The exact contracts, dates, first meeting, and emotional dimensions of that history remain unspecified.

Double X influenced H's development as a fighter; H later becomes one of the most important people helping Rush master his abilities. There was no deliberate plan for H to train Rush. The connection is historical and thematic: the failed hero indirectly influences the self-made hero through H.

## Order, Adam, and Stackston

H is primarily contracted by the Order and has a significant professional and historical connection to Adam through that work. This gives him access, familiarity, contacts, and exposure to sensitive operations, but does not establish formal faction membership or define the exact emotional and contractual dimensions of the relationship.

H becomes one of the first people to suspect that Rush may be connected to the Stackston Incident. His access and relationship with Adam help place him in a position to investigate. What he discovers creates a conflict between professional obligation and loyalty to Rush: whether to reveal the information or protect his friend. The exact disclosure scene and outcome remain unresolved.

## Speed Research

H and Rush's fights become experiments involving speed barriers, striking force, stamina limits, vibration, molecular interaction, phasing, velocity synchronization, movement efficiency, and controlled air-pressure communication. Phasing is learned gradually, remains difficult, dangerous, and stamina-intensive, and is not treated as H's default early ability. Their pressure-wave experiments begin with clicks, whistles, pulses, and shockwave patterns rather than a separate named power.

H's movement abilities ultimately connect to the same Speed Realm associated with Rush, but the broader cosmology is outside this profile.

## Long-Term Change

H and Rush continue training and experimenting through major portions of Story 1 and Story 2. As Rush's later Omega-level power grows, the enormous difference in scale changes the old training dynamic. H does not become useless; the emotional consequence is that someone who was once Rush's most meaningful physical measuring stick can no longer serve in exactly the same way.$md$,
    portrait_url = NULL,
    accent_color = NULL,
    canon_status = 'canon',
    last_synced_at = '2026-08-15T10:00:00-04:00'::timestamptz,
    status = 'published',
    archived_at = NULL
  WHERE id = h_id;

  DELETE FROM public.character_stories
  WHERE character_id = h_id
    AND story_id NOT IN (story_one_id, story_two_id);

  INSERT INTO public.character_stories (character_id, story_id, role)
  VALUES
    (
      h_id,
      story_one_id,
      'Supporting character, early antagonist, rival, training partner, and foundational friend of Rush'
    ),
    (
      h_id,
      story_two_id,
      'Returning supporting character and long-term speed research and training partner'
    )
  ON CONFLICT (character_id, story_id) DO UPDATE
  SET role = EXCLUDED.role;

  -- No structured eras, story notes, key moments, or quotes are established by
  -- the approved source. Keep those unsupported sections empty.
  DELETE FROM public.character_eras WHERE character_id = h_id;
  DELETE FROM public.character_story_notes WHERE character_id = h_id;
  DELETE FROM public.character_key_moments WHERE character_id = h_id;
  DELETE FROM public.character_quotes WHERE character_id = h_id;

  INSERT INTO public.power_systems
    (slug, name, summary_md, spoiler_md, canon_status, notion_source_url, last_synced_at)
  VALUES
    (
      'localized-super-speed',
      'Localized Super Speed',
      'Movement-based super speed expressed through reaction, precision, localized body movement, timing, rapid strikes, defensive motion, high-speed combinations, projectile interception, accelerated weapon use, and minute positional adjustment. Unlike Rush''s emphasis on travel, acceleration, momentum, and crossing distance, H explores what speed can do within a fight.',
      'H and Rush gradually research advanced vibration and phasing mechanics together. These techniques are difficult, dangerous, stamina-intensive, and not part of H''s default early mastery.',
      'canon', NULL, '2026-08-15T10:00:00-04:00'::timestamptz
    ),
    (
      'energy-sensing',
      'Energy Sensing',
      'A supplemental supernatural and combat sense used alongside normal vision. H can perceive nearby energetic changes, motion, active power use, living bodies, incoming attacks, physical tension, and movement shifts. It is not telepathy and does not literally read minds or intentions.',
      NULL,
      'canon', NULL, '2026-08-15T10:00:00-04:00'::timestamptz
    ),
    (
      'martial-arts-mastery',
      'Martial Arts Mastery',
      'Elite martial skill developed through continual study of existing and unusual fighting systems, weapons, counterattacks, grappling, precision strikes, movement efficiency, technique theory, and usable principles found in fictional combat concepts. H remains an evolving student rather than an already perfect fighter.',
      NULL,
      'canon', NULL, '2026-08-15T10:00:00-04:00'::timestamptz
    )
  ON CONFLICT (slug) DO UPDATE
  SET
    name = EXCLUDED.name,
    summary_md = EXCLUDED.summary_md,
    spoiler_md = EXCLUDED.spoiler_md,
    canon_status = EXCLUDED.canon_status,
    notion_source_url = EXCLUDED.notion_source_url,
    last_synced_at = EXCLUDED.last_synced_at;

  SELECT id INTO STRICT localized_speed_id
  FROM public.power_systems WHERE slug = 'localized-super-speed';
  SELECT id INTO STRICT energy_sensing_id
  FROM public.power_systems WHERE slug = 'energy-sensing';
  SELECT id INTO STRICT martial_arts_id
  FROM public.power_systems WHERE slug = 'martial-arts-mastery';

  DELETE FROM public.character_powers
  WHERE character_id = h_id
    AND power_system_id NOT IN (localized_speed_id, energy_sensing_id, martial_arts_id);

  INSERT INTO public.character_powers (character_id, power_system_id, notes)
  VALUES
    (
      h_id,
      localized_speed_id,
      'H specializes in combat-scale timing, reaction, precision, and localized movement rather than Rush''s raw travel and acceleration. The ability creates enormous caloric demands.'
    ),
    (
      h_id,
      energy_sensing_id,
      'Energy sensing supplements H''s normal sight and combines with martial training and enhanced reactions to make him extraordinarily difficult to surprise.'
    ),
    (
      h_id,
      martial_arts_id,
      'H combines power, technique, experience, and curiosity. He continually experiments instead of treating mastery as a finished state.'
    )
  ON CONFLICT (character_id, power_system_id) DO UPDATE
  SET notes = EXCLUDED.notes;
END $$;
