-- Replace the temporary Rush seed with the canonical Talon Zone / Rush profile.
-- Source: https://app.notion.com/p/845e5d887865471686700fd655925093
-- This migration deliberately updates slug "rush" in place; it never inserts a second Rush.

DO $$
DECLARE
  rush_id uuid;
BEGIN
  SELECT id INTO STRICT rush_id FROM public.characters WHERE slug = 'rush';

  UPDATE public.characters
  SET
    name = 'Talon Zone',
    alias = 'Rush',
    role = 'First modern hero, Omega-connected guardian, and legacy protagonist',
    story_id = (SELECT id FROM public.stories WHERE slug = 'rush'),
    primary_story_id = (SELECT id FROM public.stories WHERE slug = 'rush'),
    eyebrow = 'Story 1 Protagonist · Heroic Age Founder',
    tagline = 'A fame-hungry speedster reshaped by tragedy, faith, fatherhood, and cosmic responsibility.',
    canon_summary_md = $md$Talon Zone, better known as **Rush**, is the first major protagonist of *Storybook Chronicles* and the character who launches the modern heroic age. He begins as a young, reckless, arrogant speedster chasing fame, money, status, and the title of “greatest man alive.” Over time, tragedy, power, faith, fatherhood, guilt, and cosmic responsibility reshape him into one of the saga’s most important legacy figures.

Rush starts as a self-made hero who steals power and turns himself into a public phenomenon. His rise brings superheroes into the public eye, disrupts the criminal underworld, exposes crystal-powered conspiracies, and eventually connects Earth to deeper cosmic forces such as Omegas, Storybooks, Builder, Jagon, and Eos.

Across the saga, Talon evolves from a fame-hungry young man into an Omega, father figure, mythic human ancestor, and symbolic bridge between Earth’s heroic age and the larger galactic story.$md$,
    identity_md = $md$**Real Name:** Talon Zone

**Hero Name:** Rush

**Other Names / Possible Identities:** Tylanous Zone; The Fast Man; Blue Hurricane; Eos Alpha / Omega-connected figure

**Race / Being:** African American human; Alpha; later Omega-connected

**Primary Power:** Super speed

**Omega Factor:** Cosmic Motion

**Core Desire:** To become the greatest man alive

**Central Contradiction:** Talon’s mind screams that he is a god, but his faith reminds him he is not. He is arrogant enough to challenge kings, gods, heroes, governments, and cosmic forces, but spiritually grounded enough to seek forgiveness, purpose, and divine meaning.$md$,
    story_role_md = $md$Rush is Story 1’s main character and the first major hero of the modern era. His reckless rise exposes the crystal underworld, makes heroism public, and creates consequences that follow him through trial, exile, grief, and Omega-level responsibility.

By Story 2 he is an older father, mentor, business figure, honorary H.A.T.S. member, independent guardian of humanity, and living symbol of the Hero Era. He raises Azul—the child of his greatest enemy—and helps reform society for the next generation, but there is too much blood on his hands to call him an uncomplicated hero.

In later stories he becomes a bridge between humanity and the galaxy and an elder influence on the final age. Those later roles remain incomplete where the canonical profile contains open questions or undeveloped sections.$md$,
    core_conflict_md = $md$Talon wants to be more than human, but his faith, guilt, family, and responsibility constantly challenge his ego. He knows he has sinned and failed, yet believes his strength was given for a purpose.$md$,
    spoiler_md = $md$## Power Progression

1. **Human Speedster:** Rush gains super speed from stolen technology or an external device. Physical strain, inexperience, and limited understanding constrain him.
2. **Trained Speedster / Public Hero:** Training enables high-speed combat, evasion, and overwhelming movement and reflexes.
3. **Alpha Connection:** He connects to a realm of pure speed, motion, and possibility that he later calls **the Rush**.
4. **Omega Connection:** After the Purple Man / Eos tragedy, he absorbs or inherits a connection to Eos and the Omega legacy.

**Signature technique — Zip:** movement so fast that it appears to slower observers as instantaneous teleportation.

## Relationships Across Time

- **Ezra (brother):** One of Talon’s deepest emotional anchors. The Order kidnaps him and tests him for crystal compatibility. His later death or loss in connection with the Purple Man tragedy shatters Talon’s pride. The canonical profile flags further details for expansion.
- **Room (partner):** A criminal who becomes Rush’s partner. Their connection entangles Rush’s early heroics with theft, crystal smuggling, evidence tampering, and the consequences of Seasons 1–3.
- **Azul (adopted son / first son):** Central to Talon’s father era. Talon assures him that adoption does not make him replaceable and connects sibling responsibility to the grief of losing Ezra.
- **M. Malcolm / The Master:** Introduces Rush to hidden Omega history and reframes the Purple Man / Eos tragedy.
- **Eos / Purple Man:** Both enemy and inheritance. The tragedy destroys Rush’s public image, kills loved ones, and forces cosmic responsibility upon him.
- **Blue Knight:** A spiritual parallel. Rush steals power and forges a legend; Blue Knight receives power through faith and guidance. Both embody legacy and sacrifice.
- **Rider:** The Tylanous Zone mystery links Talon to Rider, ancient Elysium, and humanity’s mythic galactic history.
- **King of Elysium:** Friend and rival through whom Talon helps establish a human–Elysian bridge.
- **Tim Malcolm:** A younger Omega whom elder Talon is intended to mentor in responsibility, humility, and faith; the Story 4 material remains incomplete.

## Canon completeness

- **Story 3:** Incomplete. The arrival, galactic bridge, Tylanous mystery, and relationships are canonical profile material, but several sections and open questions remain undeveloped. The timing and mechanism of Talon’s apparent travel into the ancient past are unresolved; he has a strict rule against time travel.
- **Story 4:** Incomplete. Talon’s elder role, family life, political influence, mentorship of Tim, and intended final conflict are outlined, but the profile explicitly says this section should remain lighter until more material is added.$md$,
    accent_color = '#facc15',
    canon_status = 'canon',
    notion_source_url = 'https://app.notion.com/p/845e5d887865471686700fd655925093',
    notion_page_id = '845e5d88-7865-4716-8670-0fd655925093',
    last_synced_at = '2026-07-22T00:00:00-04:00'::timestamptz,
    status = 'published',
    archived_at = NULL
  WHERE id = rush_id;

  -- Temporary Rush detail rows may be rebuilt; the canonical character row remains intact.
  DELETE FROM public.character_eras WHERE character_id = rush_id;
  DELETE FROM public.character_story_notes WHERE character_id = rush_id;
  DELETE FROM public.character_key_moments WHERE character_id = rush_id;
  DELETE FROM public.character_quotes WHERE character_id = rush_id;
  DELETE FROM public.character_relationships WHERE character_id = rush_id;
  DELETE FROM public.character_stories WHERE character_id = rush_id;

  INSERT INTO public.character_stories (character_id, story_id, role)
  SELECT rush_id, s.id, x.role
  FROM (VALUES
    ('rush', 'Main protagonist; young hero era'),
    ('azul', 'Omega-connected father, mentor, and guardian'),
    ('blue-knight', 'Galactic legacy figure and human bridge — incomplete canon'),
    ('tim-malcolm', 'Elder influence and Omega mentor — incomplete canon')
  ) AS x(slug, role)
  JOIN public.stories s ON s.slug = x.slug;

  INSERT INTO public.character_eras (character_id, era_label, identity, function_md, story_id, sort_order, is_spoiler)
  SELECT rush_id, x.era_label, x.identity, x.function_md, s.id, x.sort_order, x.is_spoiler
  FROM (VALUES
    ('Story 1', 'Young Rush / Hero Era', 'First major superhero, arrogant speedster, and public disruptor.', 'rush', 1, false),
    ('Story 2', 'Omega / Father Era', 'Older Talon: father figure, mentor to Azul, guardian of humanity, and survivor of loss.', 'azul', 2, true),
    ('Story 3 — Incomplete', 'Galactic Legacy / Tylanous Connections', 'Mythic figure tied to Elysium, Rider, and humanity’s place in the galaxy. Specific mechanisms and several scenes remain unresolved.', 'blue-knight', 3, true),
    ('Story 4 — Incomplete', 'Elder / Mythic Influence', 'Legacy figure on Earth whose advisory, political, mentoring, and final-war roles are outlined but not fully developed.', 'tim-malcolm', 4, true)
  ) AS x(era_label, identity, function_md, story_slug, sort_order, is_spoiler)
  JOIN public.stories s ON s.slug = x.story_slug;

  INSERT INTO public.character_story_notes (character_id, story_id, role_label, summary_md, sort_order, is_spoiler)
  SELECT rush_id, s.id, x.role_label, x.summary_md, x.sort_order, x.is_spoiler
  FROM (VALUES
    ('rush', 'Main protagonist / founder of the Hero Era', $md$Rush steals or obtains the source of his speed, trains his body, and publicly debuts by stopping a superpowered bank robbery. He discovers energy crystals, partners with Room against the crystal trade, confronts the Order after Ezra is kidnapped, and defeats H.

Season 2 presents a seasoned and famous hero whose ego, loyalty to Room, blurred morality, and bond with Ezra culminate in the Purple Man / Eos tragedy and Omega-level responsibility.

Season 3 opens with public blame and prosecution. Talon loses his money, rights, and citizenship. He admits he deserves punishment but rejects prison because he believes his power would be wasted there, making him a morally complex fugitive rather than an innocent victim.$md$, 1, true),
    ('azul', 'Omega-connected father and guardian', $md$Older Talon is a father, business figure, mentor, honorary H.A.T.S. member, and independent protector whom institutions can request but not command. He raises Azul as his first son, provides family, faith, education, resources, and opportunity, and remains active in reform and threats beyond local hero work.

Confirmed foundations include the Azul adoption conversation, family life, and the M. Malcolm flashback revealing Eos as one of the Five Great Omegas and Malcolm as the former Master. His opening Armageddon responsibilities, current Crucible Pact involvement, recognition of Azul’s chosen path, and the trigger for his direct return remain **incomplete/open questions**.$md$, 2, true),
    ('blue-knight', 'Galactic bridge, scout, conqueror, and founder — incomplete', $md$**Incomplete canonical outline.** Blue Knight fights to open a gateway for Rush, whose arrival changes the galactic conflict. Talon inspires and advises Blue Knight, opens dialogue with Azul and the Conquest, forms a friendship and rivalry with the King of Elysium, and claims space for humanity’s new galactic age.

The ancient Traveler is identified in the profile as Talon under the name Tylanous Zone, linking him to Rider and Elysium’s origins. How he reached the distant past remains unresolved because Talon forbids time travel. Several relationship and key-scene sections are still placeholders; no additional events are asserted here.$md$, 3, true),
    ('tim-malcolm', 'Elder influence and Omega mentor — incomplete', $md$**Incomplete canonical outline.** Talon stays primarily on Earth with his family while retaining galactic political influence and advising human heroes. He is intended to mentor Tim as a fellow Omega, teaching responsibility without fixation on being chosen and grounding him in faith in God’s sovereignty above Storybooks, Jagon, Builder, and Omegas.

Talon and Reaver are outlined as the characters capable of opposing the Storybook Setting in the finale. The profile contains placeholder headings and explicitly says this era should remain lighter until more Story 4 material is added. The repeated Rush/Malcolm/Omega scene is a thematic echo from a Story 2 flashback, not new Story 4 history.$md$, 4, true)
  ) AS x(story_slug, role_label, summary_md, sort_order, is_spoiler)
  JOIN public.stories s ON s.slug = x.story_slug;

  INSERT INTO public.character_key_moments (character_id, title, story_id, summary_md, sort_order, is_spoiler)
  SELECT rush_id, x.title, s.id, x.summary_md, x.sort_order, x.is_spoiler
  FROM (VALUES
    ('Rush’s Public Debut', 'rush', 'Story 1, Season 1: Rush stops a superpowered bank robbery and publicly establishes his hero persona.', 1, false),
    ('Rush and Room Enter the Crystal Underworld', 'rush', 'Rush learns about energy crystals, fights tattooed crystal villains, and partners with Room, beginning the crime/hero blurred-morality thread.', 2, true),
    ('The Order Kidnaps Rush’s Brother', 'rush', 'The Order takes Ezra and tests him for crystal compatibility, giving Rush personal stakes.', 3, true),
    ('Talon and Young Azul', 'azul', 'In a Story 2 flashback, Talon reassures Azul that he is his first son, teaches sibling responsibility, and quietly connects the lesson to grief over Ezra.', 4, true),
    ('Rush Meets M. Malcolm', 'azul', 'After the Purple Man tragedy, an enraged Rush confronts M. Malcolm. Young Tommy Malcolm softens the confrontation; Malcolm reveals Eos was one of the Five Great Omegas and that he was once the Master. This flashback is echoed in Story 4.', 5, true),
    ('The Trial of Talon Zone', 'rush', 'Story 1, Season 3 opens with Rush blamed for the Purple Man tragedy. His past crimes are exposed in a media-spectacle trial.', 6, true),
    ('Prison Walk: “Do I Belong in Prison?”', 'rush', 'During transport to a meta-human prison, Talon admits he deserves imprisonment, then decides his power would be wasted there.', 7, true),
    ('Rush Breaks Free', 'rush', 'Talon breaks his restraints, prays for a different punishment, kills an attacking guard, and publicly declares that prison would waste his time.', 8, true),
    ('Talon Challenges the King of Elysium — Incomplete Placement', 'blue-knight', 'Likely Story 3 / Tylanous-era moment showing Talon’s mythic arrogance and galactic legacy. The canonical profile marks the placement as likely rather than final.', 9, true)
  ) AS x(title, story_slug, summary_md, sort_order, is_spoiler)
  JOIN public.stories s ON s.slug = x.story_slug;

  INSERT INTO public.character_quotes (character_id, quote_md, context_md, sort_order, is_spoiler) VALUES
    (rush_id, '“Sorry. I could be doing more. Prison would be a waste of time.”', 'Story 1, Season 3: Rush rejects imprisonment while acknowledging guilt.', 1, true),
    (rush_id, '“Jealous? What do I have to be jealous of? You’re just another boy with a crown, while my name now stands amongst your pantheon.”', 'Challenge to the King of Elysium; likely Story 3 / Tylanous era, with placement incomplete.', 2, true);

  -- The relationship table can only target characters that already have profiles.
  -- Rich prose above preserves every canonical relationship, while these cards link available rows.
  INSERT INTO public.character_relationships
    (character_id, related_character_id, relation_label, inverse_label, sort_order, is_spoiler)
  SELECT rush_id, c.id, x.relation_label, x.inverse_label, x.sort_order, true
  FROM (VALUES
    ('ezra-zone', 'Brother and emotional anchor', 'Older brother', 1),
    ('azul', 'Adopted son / first son', 'Adoptive father', 2),
    ('blue-knight', 'Spiritual parallel, ally, and mentee', 'Inspired ally and mentee', 3),
    ('tim-malcolm', 'Fellow Omega and intended mentor — incomplete', 'Elder Omega mentor', 4)
  ) AS x(slug, relation_label, inverse_label, sort_order)
  JOIN public.characters c ON c.slug = x.slug AND c.id <> rush_id;
END $$;
