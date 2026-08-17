-- Import the creator-approved final nine Phase 1 Story 1 characters.
-- This migration creates no factions, worlds, locations, affiliations,
-- character relationships, quotes, key moments, or media records.

DO $$
DECLARE
  story_one_id uuid;
  death_cloak_id uuid;
  dread_id uuid;
  karim_id uuid;
  ren_id uuid;
  blue_id uuid;
  tommy_id uuid;
  malcolm_id uuid;
  ultra_id uuid;
  purple_id uuid;
  candidate_count integer;
BEGIN
  SELECT id INTO STRICT story_one_id FROM public.stories WHERE slug = 'rush' AND number = 1;

  SELECT count(*), (array_agg(id))[1] INTO candidate_count, death_cloak_id FROM public.characters
  WHERE lower(trim(slug)) = 'death-cloak' OR lower(trim(name)) = 'death cloak' OR lower(trim(coalesce(alias, ''))) = 'death cloak';
  IF candidate_count > 1 THEN RAISE EXCEPTION 'Death Cloak migration found % candidates', candidate_count;
  ELSIF candidate_count = 0 THEN INSERT INTO public.characters (slug,name) VALUES ('death-cloak','Death Cloak') RETURNING id INTO death_cloak_id; END IF;
  UPDATE public.characters SET
    slug='death-cloak', name='Death Cloak', alias=NULL, role='Villain', story_id=story_one_id, primary_story_id=story_one_id,
    eyebrow='Story 1 · Villain · Umbra Assassin Leader', tagline='The inherited leader of a shadow-powered assassin tradition and a coordinated threat to Apex.',
    canon_summary_md=$md$Death Cloak is the masked leader of an elite assassin network known to outsiders only through an identifier: the Black Footprint. Its members wield Umbra, an otherworldly shadow power whose presence on Earth alarms those who understand what it represents. The skull-like mask and title of Death Cloak are passed from leader to leader, making the current bearer part of a much older tradition. His mastery of two-dimensional movement, shadow travel, durability-piercing attacks and Umbra weaponry makes the Black Footprint dangerous enough to challenge the full Apex team. More importantly, their emergence reveals that Earth's growing superhuman age is beginning to intersect with powers and histories far beyond anything humanity created itself.$md$,
    identity_md=$md$**Name:** Death Cloak

**Real Name:** Unknown

**Classification:** Villain

**Primary Story:** Story 1

Death Cloak is the current bearer of an inherited mantle. Its extraordinarily durable, black skull-like mask passes from one leader to another as a symbol of leadership; Umbra, not the mask, provides the bearer’s abilities. The Black Footprint is an outside identifier for the network’s recognizable operational pattern, not a confirmed self-chosen organization name.

## Personality

Disciplined, ruthless, professional, highly trained, proud of assassination as a craft, and confident in the traditions behind his role. His violence is deliberate rather than random or insane.$md$,
    story_role_md=$md$Death Cloak and associated Black Footprint assassins are an Apex team threat rather than a personal Rush nemesis. Their coordinated attack requires specialization, protection, battlefield coordination, teamwork, and tactical adaptation.

His appearance reveals that Earth did not create every power system now appearing within it. Umbra behaves differently from known crystal powers, can appear across multiple people, carries an unusual physical cost, and has a history that should not normally be present on Earth.$md$,
    core_conflict_md=$md$Death Cloak’s disciplined mastery makes him dangerous, but the greater threat is what his inherited mantle and Umbra tradition reveal about Earth’s incomplete understanding of power.$md$,
    spoiler_md=$md$The deeper origin of Umbra, the true name and history of the assassin network, the origin of the mask, earlier Death Cloaks, and the succession tradition remain unresolved for later expansion.$md$,
    portrait_url=NULL, accent_color=NULL, canon_status='canon', last_synced_at='2026-08-16T10:00:00-04:00'::timestamptz, status='published', archived_at=NULL
  WHERE id=death_cloak_id;

  SELECT count(*), (array_agg(id))[1] INTO candidate_count, dread_id FROM public.characters
  WHERE lower(trim(slug))='dread' OR lower(trim(name)) IN ('dread','haymitch graunt','elias grant') OR lower(trim(coalesce(alias,''))) IN ('dread','haymitch graunt','elias grant');
  IF candidate_count > 1 THEN RAISE EXCEPTION 'Dread migration found % candidates', candidate_count;
  ELSIF candidate_count = 0 THEN INSERT INTO public.characters (slug,name,alias) VALUES ('dread','Haymitch Graunt','Dread') RETURNING id INTO dread_id; END IF;
  UPDATE public.characters SET
    slug='dread', name='Haymitch Graunt', alias='Dread', role='Villain / Later Redeemed Supporting Character', story_id=story_one_id, primary_story_id=story_one_id,
    eyebrow='Story 1 · Villain · Fear-Based Psychic', tagline='An emotionally perceptive psychic who turns the hidden fears of people and institutions into weapons.',
    canon_summary_md=$md$Haymitch Graunt, known as Dread, is a fear-based psychic whose extraordinary emotional intelligence was twisted into a weapon after a childhood of abandonment and experimentation by the Order. Capable of entering minds, amplifying terror, manipulating perception, and turning emotional vulnerabilities against entire crowds, Dread wages a psychological campaign against the institutions of Legnous that he believes were built upon forgotten suffering.$md$,
    identity_md=$md$**Name:** Haymitch Graunt

**Known As:** Dread

**Classification:** Villain / Later Redeemed Supporting Character

**Primary Story:** Story 1

Haymitch was an abandoned child who survived poor, forgotten, vulnerable, and unprotected beneath Legnous. His exceptional natural emotional intelligence existed before his powers: he instinctively understands fear, insecurity, shame, grief, anger, desire, dependency, and interpersonal vulnerability.

The Order eventually took custody of Haymitch and weaponized his psychic and emotional potential through experimentation. No structured Order affiliation is created.$md$,
    story_role_md=$md$Dread is the major psychological antagonist before the Purple War creates physical collapse. He attacks Apex, the Order, political leadership, public memory, heroic propaganda, civic confidence, and Legnous’s curated self-image because he believes progress was built over suffering society refuses to acknowledge.

The Companion is a protective mental construct and split personality representing survival, rage, aggression, hatred, protection, and the strength Haymitch needed as a powerless child. It is not an external demon or separate character.$md$,
    core_conflict_md=$md$Haymitch possesses the emotional sensitivity that could have made him a counselor, mediator, leader, or trusted friend. Trauma and experimentation turn that gift into Dread’s greatest weapon while ensuring he still feels portions of the suffering he inflicts.$md$,
    spoiler_md=$md$## Approved Full Overview

Haymitch Graunt, known as Dread, is a fear-based psychic whose extraordinary emotional intelligence was twisted into a weapon after a childhood of abandonment and experimentation by the Order. Capable of entering minds, amplifying terror, manipulating perception, and turning emotional vulnerabilities against entire crowds, Dread wages a psychological campaign against the institutions of Legnous that he believes were built upon forgotten suffering. Yet his path changes after the Purple War, when his powers force him to experience the overwhelming grief left behind by a truly catastrophic monster. Humbled by suffering far beyond anything he intended to create, Haymitch begins turning the same abilities once used to spread fear toward helping others survive it, transforming his story from villainy into a difficult pursuit of redemption.

## Purple War and Redemption

Haymitch survives to feel the immense grief, terror, survivor guilt, rage, hopelessness, mourning, and trauma left by the Purple Man. The scale humbles him and ends his active villainous path. He begins learning to help people process fear and trauma rather than exploiting them. This is a difficult pursuit of redemption, not instant forgiveness; his crimes remain real and victims owe him nothing.

Lifeline becomes important to this healing arc. Haymitch can understand her post-Purple trauma and agoraphobia from the perspectives of both victim and manipulator. Their relationship begins uneasily and may later become romantic.

As Haymitch becomes healthier, the Companion gradually fades because the frightened child no longer needs that protector. It is not defeated, killed, or destroyed.$md$,
    portrait_url=NULL, accent_color=NULL, canon_status='canon', last_synced_at='2026-08-16T10:00:00-04:00'::timestamptz, status='published', archived_at=NULL
  WHERE id=dread_id;

  SELECT count(*), (array_agg(id))[1] INTO candidate_count, karim_id FROM public.characters
  WHERE lower(trim(slug))='karim-al-hassan' OR lower(trim(name)) IN ('karim al-hassan','karim') OR lower(trim(coalesce(alias,'')))='karim';
  IF candidate_count > 1 THEN RAISE EXCEPTION 'Karim migration found % candidates', candidate_count;
  ELSIF candidate_count = 0 THEN INSERT INTO public.characters (slug,name) VALUES ('karim-al-hassan','Karim Al-Hassan') RETURNING id INTO karim_id; END IF;
  UPDATE public.characters SET
    slug='karim-al-hassan', name='Karim Al-Hassan', alias=NULL, role='Supporting Character', story_id=story_one_id, primary_story_id=story_one_id,
    eyebrow='Story 1 · Supporting Character · Operational Leader', tagline='The visionary operator who turns Adam Story’s enormous ambitions into real-world action.',
    canon_summary_md=$md$Karim Al-Hassan is the charismatic operational leader of the Order and the man responsible for turning Adam Story's enormous vision into real-world action. A genuine believer in humanity's potential, Karim pursues advancement not for personal power but because he believes the species must become capable of surviving a universe far more dangerous than most people realize. His greatest strength is inspiring progress. His greatest flaw is how far he is willing to reach for it.$md$,
    identity_md=$md$**Name:** Karim Al-Hassan

**Classification:** Supporting Character

**Primary Story:** Story 1

**Occupation / Function:** Operational leader and public face of the Order

Karim is intelligent, charismatic, optimistic, ambitious, inspiring, curious, and visionary. He is motivated by humanity’s improvement rather than greed, domination, or personal fame.$md$,
    story_role_md=$md$Karim oversees strategy, projects, partnerships, funding, logistics, departments, and execution while Adam focuses on cosmic and existential concerns. Many regard Karim as Adam’s likely successor, and Adam views him almost like a son. Karim’s loyalty follows evidence rather than blind worship: proof of supernatural phenomena, cosmic beings, and hidden threats makes him fascinated rather than merely afraid.

Karim believes advancement is a responsibility. Humanity must live longer, become stronger, think faster, understand more, and survive what lies beyond conventional knowledge.$md$,
    core_conflict_md=$md$If greater dangers genuinely exist beyond humanity, how far should humanity go to prepare for them? Karim’s strength is inspiring progress; his flaw is how far he is willing to reach for it.$md$,
    spoiler_md=$md$## Department Zero and the Purple Disaster

Karim is one of the few trusted with Department Zero. Research informed by Rush and H’s speed work attempts to study the source behind movement-based powers and instead opens a doorway that releases or enables the Purple Man. Department Zero is devastated, researchers die, and Karim is permanently injured.

Before the disaster, Karim believes humanity should evolve. After it, he believes humanity must evolve because it is dangerously unprepared.

Karim later tries to share responsibility rather than let Rush bear the catastrophe alone. He publicly admits major Order wrongdoing surrounding the Purple Man while protecting deeper secrets about Adam.$md$,
    portrait_url=NULL, accent_color=NULL, canon_status='canon', last_synced_at='2026-08-16T10:00:00-04:00'::timestamptz, status='published', archived_at=NULL
  WHERE id=karim_id;

  SELECT count(*), (array_agg(id))[1] INTO candidate_count, ren_id FROM public.characters
  WHERE lower(trim(slug)) IN ('ren-hayashi','sideline','sightline','deadlock') OR lower(trim(name)) IN ('ren hayashi','sideline','sightline','deadlock') OR lower(trim(coalesce(alias,''))) IN ('sideline','sightline','deadlock');
  IF candidate_count > 1 THEN RAISE EXCEPTION 'Ren migration found % candidates', candidate_count;
  ELSIF candidate_count = 0 THEN INSERT INTO public.characters (slug,name,alias) VALUES ('ren-hayashi','Ren Hayashi','Sideline') RETURNING id INTO ren_id; END IF;
  UPDATE public.characters SET
    slug='ren-hayashi', name='Ren Hayashi', alias='Sideline', role='Villain / Mercenary', story_id=story_one_id, primary_story_id=story_one_id,
    eyebrow='Story 1 · Villain · Precision Mercenary', tagline='A small-object telekinetic whose precision makes ordinary surroundings lethal.',
    canon_summary_md=$md$Ren Hayashi, known as Sideline, is a precision-focused mercenary and the older brother of Apex leader Rina Hayashi. His limited tactile telekinesis allows him to transform ordinary small objects into lethal projectiles, while his unusual eyes can permanently mark targets for pursuit. Though Rina possesses far greater raw power, Ren's intelligence, accuracy and willingness to kill make him one of the few opponents capable of attacking both her abilities and the person behind them.$md$,
    identity_md=$md$**Name:** Ren Hayashi

**Alias:** Sideline

**Classification:** Villain / Mercenary

**Primary Story:** Story 1

Ren is a freelance mercenary frequently contracted by the Order without being established as a formal member. He and H are professional associates who know one another and may exchange information; they are not automatically close friends.

Crosshair-like pupil markings allow Ren to maintain up to two specially marked targets, one per eye. Marked targets can be located or influenced by his power; deeper mechanics remain unresolved.$md$,
    story_role_md=$md$Ren is Rina Hayashi’s older brother and an emotional and tactical foil. Rina has far greater raw power; Ren is more precise, calculated, accurate, and willing to kill. His return connects her polished Apex identity to a family history she wants buried.

Early in Season 2, Ren is hired to eliminate a former Order scientist who became a traitor. Hero intervention leaves him as a recurring mercenary threat.$md$,
    core_conflict_md=$md$Ren cannot match Rina’s raw strength, so he attacks through precision, intelligence, emotional pressure, and the lethal use of small objects others overlook.$md$,
    spoiler_md=$md$One of Ren’s two marks is effectively reserved for Rina so he can always find her; the other remains available for an active target. Ren dies protecting Rina during the Purple War.$md$,
    portrait_url=NULL, accent_color=NULL, canon_status='canon', last_synced_at='2026-08-16T10:00:00-04:00'::timestamptz, status='published', archived_at=NULL
  WHERE id=ren_id;

  SELECT count(*), (array_agg(id))[1] INTO candidate_count, blue_id FROM public.characters
  WHERE lower(trim(slug)) IN ('blue','bluevian-miles') OR lower(trim(name)) IN ('blue','bluevian miles') OR lower(trim(coalesce(alias,''))) IN ('blue','bluevian miles');
  IF candidate_count > 1 THEN RAISE EXCEPTION 'Blue migration found % candidates', candidate_count;
  ELSIF candidate_count = 0 THEN INSERT INTO public.characters (slug,name,alias) VALUES ('bluevian-miles','Bluevian Miles','Blue') RETURNING id INTO blue_id; END IF;
  UPDATE public.characters SET
    slug='bluevian-miles', name='Bluevian Miles', alias='Blue', role='Major Antagonist / Tragic Rival', story_id=story_one_id, primary_story_id=story_one_id,
    eyebrow='Story 1 · Major Antagonist · Tragic Rival', tagline='A scarred vector manipulator whose survival becomes a moral reckoning for Rush.',
    canon_summary_md=$md$Blue is an African-American scientist and vector manipulator who survives catastrophic injury with the support of advanced armor. His control over direction and magnitude allows him to redirect movement, negate momentum, fly, and compensate for a heavily damaged body. He emerges as a tragic rival whose greatest threat is not revenge alone, but the moral questions his survival forces Rush to face.$md$,
    identity_md=$md$**Name:** Bluevian Miles

**Known As:** Blue

**Classification:** Major Antagonist / Tragic Rival

**Primary Story:** Story 1

**Ethnicity:** African American

**Height:** Approximately 5'9" without armor; approximately 6'3" armored

Blue is a scientist who worked at a technology firm or startup researching alternative energy and advanced technology connected to Order funding. He survives severe burns and scarring, extensive nerve damage, chronic pain, PTSD, fragmented memory, and a heavily damaged body. Advanced armor protects and physically supports him.$md$,
    story_role_md=$md$Blue is more than a revenge-driven enemy. He becomes a witness, prosecutor, and moral reckoning who asks whether the good Rush accomplished can outweigh the consequences beneath his heroic identity. Double X tests whether Rush can become a hero; Purple tests whether he can survive being one; Blue tests whether becoming Rush was worth the cost.$md$,
    core_conflict_md=$md$Blue carries catastrophic physical and psychological damage while watching a celebrated heroic age grow above events whose cost he understands personally.$md$,
    spoiler_md=$md$## Approved Full Overview

Bluevian Miles is Talon Zone's former childhood friend, the sole surviving witness to the hidden truth behind the Stackston Incident, and eventually one of Rush's greatest moral adversaries. Catastrophically injured by the event that gave Rush his powers, Blue survives through advanced armor and extraordinary vector manipulation. While Rush becomes the celebrated face of the Hero Era, Blue spends years rebuilding in secret, carrying the evidence of what that heroic life cost before it ever began.

## Stackston and Recovery

Blue and Talon were childhood friends who later graduated college. Blue helped develop the blue-crystal gauntlet that Talon stole. The resulting Stackston catastrophe severely injured Blue, killed many people, spread wider crystal consequences, and became the hidden truth beneath Rush’s origin. Blue is the sole surviving witness able to explain it.

He spends Season 1 unconscious or recovering in an Order medical facility while police believe the victims dead. After Double X’s defeat, he awakens, sees Rush on television, and identifies him as Talon, giving Adam the crucial Stackston connection. Adam and Karim later educate him about the Order and wider threats. Lifeline assists his recovery in a platonic relationship.

## Purple War

Blue catches falling Ezra by negating his momentum, fights beside him, seriously challenges the Purple Man, damages his armor, and eventually faces Rush. Later Divinity direction and Blue Knight material remain outside this Phase 1 profile.$md$,
    portrait_url=NULL, accent_color=NULL, canon_status='canon', last_synced_at='2026-08-16T10:00:00-04:00'::timestamptz, status='published', archived_at=NULL
  WHERE id=blue_id;

  SELECT count(*), (array_agg(id))[1] INTO candidate_count, tommy_id FROM public.characters
  WHERE lower(trim(slug)) IN ('tommy-malcolm','hawks','dominion') OR lower(trim(name)) IN ('tommy malcolm','hawks','dominion') OR lower(trim(coalesce(alias,''))) IN ('hawks','dominion');
  IF candidate_count > 1 THEN RAISE EXCEPTION 'Tommy migration found % candidates', candidate_count;
  ELSIF candidate_count = 0 THEN INSERT INTO public.characters (slug,name,alias) VALUES ('tommy-malcolm','Tommy Malcolm','Hawks') RETURNING id INTO tommy_id; END IF;
  UPDATE public.characters SET
    slug='tommy-malcolm', name='Tommy Malcolm', alias='Hawks', role='Supporting Character / Vigilante / Investigator', story_id=story_one_id, primary_story_id=story_one_id,
    eyebrow='Story 1 · Supporting Character · Vigilante Investigator', tagline='A polished philanthropist whose secret discipline and investigation challenge Rush’s improvisation.',
    canon_summary_md=$md$Tommy Malcolm is the charismatic heir to one of Legnous City’s most important families and the secret vigilante known as Hawks. Where Rush attacks problems through speed and improvisation, Hawks approaches them through investigation, preparation, and relentless discipline. Their clashing philosophies gradually develop into a complicated friendship.$md$,
    identity_md=$md$**Name:** Tommy Malcolm

**Alias:** Hawks

**Age:** Mid-20s during Story 1

**Classification:** Supporting Character / Vigilante / Investigator

**Primary Story:** Story 1

Tommy is wealthy, charismatic, philanthropic, polished, publicly admired, and the bright public face of the Malcolm legacy. As Hawks he is investigative, surgical, hyper-prepared, suspicious, disciplined, extremely skilled, and willing to work outside conventional law.

Tommy witnessed his mother’s death as a child; its exact cause remains unresolved. He later spent roughly seven years studying martial arts, investigation, strategy, meditation, crystals, supernatural phenomena, and hidden history.$md$,
    story_role_md=$md$Hawks investigates white-collar and hidden criminal activity, especially around the Entertainment District, Room, the Order, power anomalies, and unusual organizations. Room treats his serious attention as a reason to escape rather than confront him.

Tommy and Rush clash, develop mutual respect, cooperate repeatedly, and form a genuine but complicated friendship. Rush represents instinct, chaos, loyalty, and improvisation; Tommy represents preparation, systems, investigation, and order.$md$,
    core_conflict_md=$md$Tommy turns grief into disciplined purpose, but the fragments of knowledge given by his father place him near forces and questions that preparation alone cannot fully control.$md$,
    spoiler_md=$md$## Approved Full Overview

Tommy Malcolm is the charismatic heir to one of Legnous City's most important families and the secret vigilante known as Hawks. Where Rush attacks problems through speed and improvisation, Hawks approaches them through investigation, preparation, and relentless discipline. Their clashing philosophies gradually develop into a complicated friendship, while Tommy's hidden inheritance as the son of the Omega known as the Master places him far closer to the supernatural forces shaping Story 1 than even he initially understands.

Tommy is the son of M. Malcolm, the Master, and begins with fragments rather than complete cosmic knowledge. During the Purple War he takes a dangerous stand against the Purple Man and suffers catastrophic damage to his leg, arm, and back. Near death, dormant inherited Wind / Atmospheric Boundary Manipulation awakens; its first major expression launches the Purple Man beyond the clouds.$md$,
    portrait_url=NULL, accent_color=NULL, canon_status='canon', last_synced_at='2026-08-16T10:00:00-04:00'::timestamptz, status='published', archived_at=NULL
  WHERE id=tommy_id;

  SELECT count(*), (array_agg(id))[1] INTO candidate_count, malcolm_id FROM public.characters
  WHERE lower(trim(slug)) IN ('m-malcolm','malcolm','the-master') OR lower(trim(name)) IN ('m. malcolm','malcolm','the master') OR lower(trim(coalesce(alias,'')))='the master';
  IF candidate_count > 1 THEN RAISE EXCEPTION 'Malcolm migration found % candidates', candidate_count;
  ELSIF candidate_count = 0 THEN INSERT INTO public.characters (slug,name,alias) VALUES ('m-malcolm','M. Malcolm','The Master') RETURNING id INTO malcolm_id; END IF;
  UPDATE public.characters SET
    slug='m-malcolm', name='M. Malcolm', alias='The Master', role='Supporting Character / Political Leader / Hidden Guardian', story_id=story_one_id, primary_story_id=story_one_id,
    eyebrow='Story 1 · Supporting Character · Civic Guardian', tagline='A former mayor who answers accelerating power with stewardship, memory, and restraint.',
    canon_summary_md=$md$M. Malcolm is a former mayor, co-architect of Legnous City, father of Tommy Malcolm, and one of the city’s most important hidden guardians. His aged body conceals enduring psychic power and a philosophy built around restraint. Malcolm represents stewardship in a world racing toward superhuman evolution, repeatedly asking not whether humanity can become more powerful, but whether it understands what it is becoming.$md$,
    identity_md=$md$**Name:** M. Malcolm

**Title / Alias:** The Master

**Classification:** Supporting Character / Political Leader / Hidden Guardian

**Primary Story:** Story 1

Malcolm is a former mayor, major civic figure, co-architect and co-founder of Legnous, father of Tommy Malcolm, and hidden guardian of the city. Charles Legnous gave him friendship and renewed purpose; protecting their city is deeply personal.$md$,
    story_role_md=$md$During Season 2, Malcolm becomes Adam’s political and philosophical rival. Adam represents acceleration, evolution, science, and the future; Malcolm represents stewardship, responsibility, memory, public trust, and controlled progress. Malcolm is not anti-progress—he is anti-recklessness.

After the Purple War, Malcolm becomes central to restoring civic order and, under the current Story 1 direction, becomes mayor or is declared the election victor. He can respect Rush’s restitution while believing unrestricted godlike power outside institutions remains dangerous.$md$,
    core_conflict_md=$md$Malcolm’s central question is not whether humanity can gain power, but whether it understands what it is becoming. His instinct for command has matured into a philosophy of restraint.$md$,
    spoiler_md=$md$## Approved Full Overview

M. Malcolm is a former mayor, co-architect of Legnous City, father of Tommy Malcolm, and one of Earth's most powerful hidden guardians. Secretly the ancient Omega known as the Master, Malcolm possesses Command, a form of psychic authority capable of imposing his will upon minds, matter and even environmental forces. By the time of Story 1, however, the once-dominating nature of that power has become a philosophy of restraint. Malcolm represents stewardship in a world racing toward superhuman evolution, repeatedly asking not whether humanity can become more powerful, but whether it understands what it is becoming.

Malcolm’s aged body remains weaker than his psychic Command. He once used Command globally not to enslave humanity but to strengthen resistance to mind control, psychic coercion, hypnosis, neural command, and similar domination.

During the Purple War he recognizes Tommy’s awakened power, reveals his abilities publicly, disrupts catastrophic atmospheric effects, calls the Purple Man back for the final confrontation, and joins humanity’s alliance. His complete ancient kingship, Elysium history, family tree, and later destiny remain outside Phase 1.$md$,
    portrait_url=NULL, accent_color=NULL, canon_status='canon', last_synced_at='2026-08-16T10:00:00-04:00'::timestamptz, status='published', archived_at=NULL
  WHERE id=malcolm_id;

  SELECT count(*), (array_agg(id))[1] INTO candidate_count, ultra_id FROM public.characters
  WHERE lower(trim(slug))='ultra' OR lower(trim(name))='ultra' OR lower(trim(coalesce(alias,'')))='ultra';
  IF candidate_count > 1 THEN RAISE EXCEPTION 'Ultra migration found % candidates', candidate_count;
  ELSIF candidate_count = 0 THEN INSERT INTO public.characters (slug,name) VALUES ('ultra','Ultra') RETURNING id INTO ultra_id; END IF;
  UPDATE public.characters SET
    slug='ultra', name='Ultra', alias=NULL, role='Supporting Character / Independent Hero / Global Protector', story_id=story_one_id, primary_story_id=story_one_id,
    eyebrow='Story 1 · Independent Hero · Global Protector', tagline='Humanity’s greatest natural superhuman, guided by an instinctive desire to help.',
    canon_summary_md=$md$Ultra is humanity's greatest natural superhuman and a living expression of the classic superhero ideal: overwhelming power guided by an almost instinctive desire to help. Stateless, independent and capable of responding to disasters anywhere on Earth or beyond it, Ultra becomes both a global symbol of hope and a geopolitical problem no institution can truly control. His extraordinary compassion makes him beloved, but his tendency to act before considering political or long-term consequences eventually brings him into conflict with Rush and a world learning that good intentions become frightening when backed by godlike power.$md$,
    identity_md=$md$**Name:** Ultra

**Real Name:** Unknown / TBD

**Race:** Human / Natural Superhuman

**Age:** Late 30s during Story 1

**Height:** 6'5" / 196 cm

**Classification:** Supporting Character / Independent Hero / Global Protector

Ultra has a powerful but proportional build, short dark-brown slightly wavy hair, a maintained short beard, and warm brown eyes that glow gold-white primarily during heat vision. He appears reassuring rather than intimidating.

Compassionate, optimistic, patient, charismatic, protective, warm, confident without arrogance, easy to trust, and quick to forgive. His weaknesses include trust, emotional vulnerability, naivety, acting before considering systemic consequences, and assuming help is inherently good.$md$,
    story_role_md=$md$Ultra responds wherever people need help regardless of nationality, politics, distance, danger, or permission. He belongs to no government, nation, or Apex, making him simultaneously a celebrity, symbol of hope, geopolitical problem, and unpredictable independent responder.

Ultra and Rush initially clash, including an encounter in Africa that produces a massive shockwave and a later stadium confrontation. Those conflicts eventually develop into genuine friendship.$md$,
    core_conflict_md=$md$Ultra’s instinct is always to help, but overwhelming independent power makes even compassionate action politically and systemically consequential. Good intentions do not automatically answer who should decide how that power is used.$md$,
    spoiler_md=$md$Ultra eventually becomes one of Rush’s closest friends. His deeper future family, children, bloodline, Conqueror conflict, and later cosmic material remain outside the Phase 1 Story 1 slice.$md$,
    portrait_url=NULL, accent_color=NULL, canon_status='canon', last_synced_at='2026-08-16T10:00:00-04:00'::timestamptz, status='published', archived_at=NULL
  WHERE id=ultra_id;

  SELECT count(*), (array_agg(id))[1] INTO candidate_count, purple_id FROM public.characters
  WHERE lower(trim(slug)) IN ('purple-man','eos','eon') OR lower(trim(name)) IN ('purple man','eos','eon') OR lower(trim(coalesce(alias,''))) IN ('purple man','eos','eon');
  IF candidate_count > 1 THEN RAISE EXCEPTION 'Purple Man migration found % candidates', candidate_count;
  ELSIF candidate_count = 0 THEN INSERT INTO public.characters (slug,name) VALUES ('purple-man','Purple Man') RETURNING id INTO purple_id; END IF;
  UPDATE public.characters SET
    slug='purple-man', name='Purple Man', alias=NULL, role='Major Antagonist / Catastrophic Threat', story_id=story_one_id, primary_story_id=story_one_id,
    eyebrow='Story 1 · Major Antagonist · Catastrophic Threat', tagline='A starving, unstable catastrophe released by forces humanity touched without understanding.',
    canon_summary_md=$md$Released through the Order’s experiments, the Purple Man emerges as a starving and animalistic catastrophe before rapidly regaining intelligence. His impossible movement and unstable authority over space, time, gravity, and motion ignite the Purple War, force every layer of civilization into a final alliance, and end the Hero Era.$md$,
    identity_md=$md$**Display Name:** Purple Man

**Classification:** Major Antagonist / Catastrophic Threat

**Primary Story:** Story 1

When released, the Purple Man is starved, unstable, incomplete, animalistic, emaciated, impossibly fast, only partly conscious, and largely unable to communicate. His movement is catastrophically destructive, and early phasing attempts can release destructive energy effects.$md$,
    story_role_md=$md$The Purple War forces civilization to recognize that no existing layer can defeat the threat alone. Rush and H, Apex, criminals and villains, police, the Order, Zealots, militaries, governments, and a final alliance all contribute. No single faction wins; heroes alone are not enough.

The Purple Man represents the consequences of touching forces humanity does not understand, stolen power, divine pride, catastrophic escalation, the collapse of the Hero Era, and Rush’s temptation to rewrite consequences.$md$,
    core_conflict_md=$md$The Purple Man is not merely the strongest villain. He is the catastrophic result of humanity opening a doorway into authority over space, time, and motion that it neither understood nor owned.$md$,
    spoiler_md=$md$## Approved Full Overview

The Purple Man is the broken Story 1 manifestation of Eos, an ancient Omega whose authority over space, time and motion lies behind forces humanity has begun touching without fully understanding. Released through the Order's experiments, he emerges as a starving and animalistic catastrophe before rapidly regaining intelligence and recognizing humanity's movement-powered individuals as thieves carrying fragments of what once belonged to him. His awakening ignites the Purple War and ends the Hero Era.

## Eos and Learning

Eos is the underlying ancient Omega associated with space, time, motion, gravity, and temporal authority. The exact ontology among ancient Eos, corruption, death or remnant state, Speed Realm existence, the Purple Man manifestation, and Rush’s later inheritance remains unresolved.

During the war he evolves cognitively from an animalistic state, seeks knowledge, and learns language at impossible speed in a library. He identifies Rush and Blue as thieves carrying power connected to his domain and demands their surrender.

## Speed Realm Endgame

Rush and the Purple Man enter the Speed Realm, where Rush confronts Eos. Rush becomes extreme enough to consume or fuse with Eos in some unresolved form and returns transformed. Ezra dies after Rush returns. Rush is tempted to use time to undo events, refuses to rewrite history, and later vows before God not to use time travel that way.$md$,
    portrait_url=NULL, accent_color=NULL, canon_status='canon', last_synced_at='2026-08-16T10:00:00-04:00'::timestamptz, status='published', archived_at=NULL
  WHERE id=purple_id;

  DELETE FROM public.character_stories WHERE character_id IN (death_cloak_id,dread_id,karim_id,ren_id,blue_id,tommy_id,malcolm_id,ultra_id,purple_id) AND story_id<>story_one_id;
  INSERT INTO public.character_stories (character_id,story_id,role) VALUES
    (death_cloak_id,story_one_id,'Villain, Umbra assassin leader, and coordinated Apex team threat'),
    (dread_id,story_one_id,'Psychological villain and later redeemed supporting character'),
    (karim_id,story_one_id,'Supporting character and operational leader of the Order'),
    (ren_id,story_one_id,'Villain, mercenary, and precision-focused foil to Rina'),
    (blue_id,story_one_id,'Major antagonist, tragic rival, witness, and moral reckoning for Rush'),
    (tommy_id,story_one_id,'Supporting vigilante investigator and complicated friend of Rush'),
    (malcolm_id,story_one_id,'Supporting political leader, civic guardian, and advocate of restraint'),
    (ultra_id,story_one_id,'Independent hero, global protector, and developing friend of Rush'),
    (purple_id,story_one_id,'Major antagonist, catastrophic Purple War threat, and end of the Hero Era')
  ON CONFLICT (character_id,story_id) DO UPDATE SET role=EXCLUDED.role;

  DELETE FROM public.character_eras WHERE character_id IN (death_cloak_id,dread_id,karim_id,ren_id,blue_id,tommy_id,malcolm_id,ultra_id,purple_id);
  DELETE FROM public.character_story_notes WHERE character_id IN (death_cloak_id,dread_id,karim_id,ren_id,blue_id,tommy_id,malcolm_id,ultra_id,purple_id);
  DELETE FROM public.character_key_moments WHERE character_id IN (death_cloak_id,dread_id,karim_id,ren_id,blue_id,tommy_id,malcolm_id,ultra_id,purple_id);
  DELETE FROM public.character_quotes WHERE character_id IN (death_cloak_id,dread_id,karim_id,ren_id,blue_id,tommy_id,malcolm_id,ultra_id,purple_id);

  INSERT INTO public.power_systems (slug,name,summary_md,spoiler_md,canon_status,notion_source_url,last_synced_at) VALUES
    ('umbra-manipulation','Umbra Manipulation','Otherworldly shadow power supporting concealment, two-dimensional surface movement, extraordinary movement through shadow, simple offensive blades or tendrils, body and weapon coating, and durability-bypassing contact. Strong sustained illumination disrupts effective use without making any ordinary flashlight an instant victory.','Heavy or excessive use gradually petrifies portions of the user’s body. The deeper metaphysical cause remains unresolved.','canon',NULL,'2026-08-16T10:00:00-04:00'::timestamptz),
    ('psychic-fear-manipulation','Psychic Fear Manipulation','Creates and amplifies fear, perceives emotional vulnerabilities, intrudes telepathically into thoughts and memories, distorts perception through hallucination, and spreads targeted panic or collapse through groups. Its precision depends on Haymitch’s preexisting emotional intelligence.','Entering minds exposes Haymitch to portions of the fear and suffering he creates, preserving the empathy that later supports redemption.','canon',NULL,'2026-08-16T10:00:00-04:00'::timestamptz),
    ('limited-tactile-telekinesis','Limited Tactile Telekinesis','A quick psychic bubble catches nearby small material—such as bullets, knives, bricks, rocks, dirt, sand, or debris—and launches it with exceptional speed, accuracy, and creativity. It is not large-object telekinesis. Crosshair-like eyes can maintain up to two marked targets, one per eye.','One mark is effectively reserved for Rina while the other remains available for an active target. Deeper marking mechanics remain unresolved.','canon',NULL,'2026-08-16T10:00:00-04:00'::timestamptz),
    ('vector-manipulation','Vector Manipulation','Manipulates the direction and magnitude of motion, enabling vector redirection, movement modification, momentum negation, flight, and compensation for a damaged body. Advanced armor provides support and protection rather than an unrelated superpower.',NULL,'canon',NULL,'2026-08-16T10:00:00-04:00'::timestamptz),
    ('wind-atmospheric-boundary-manipulation','Wind / Atmospheric Boundary Manipulation','Dormant inherited authority over wind and atmospheric boundaries. Phase 1 establishes only an initial torrent powerful enough to launch the Purple Man beyond the clouds.',NULL,'canon',NULL,'2026-08-16T10:00:00-04:00'::timestamptz),
    ('command','Command','Extraordinary psychic authority capable of imposing intent through mind, aura, voice, or will upon thoughts, biological systems, objects, matter, environmental forces, and hostile psychic effects. Malcolm’s aged body is weaker while Command remains immense.','Malcolm once used Command globally to strengthen humanity’s resistance to direct mental domination rather than enslave it.','canon',NULL,'2026-08-16T10:00:00-04:00'::timestamptz),
    ('natural-superhuman-physiology','Natural Superhuman Physiology','A natural superhuman system encompassing atmospheric, orbital, and deep-space flight; extreme strength and travel speed including faster-than-light travel; adaptive durability and recovery; enhanced telescopic, microscopic, thermal, electromagnetic, radio-wave, and X-ray-like vision; adjustable heat vision; super hearing; breath and oxygen control; and a Guardian Field that distributes force through rescued people or supported objects.','Limits include immense caloric requirements; draining heat vision and oxygen production; a brief adaptive-durability response window; combat processing below Rush’s specialty; crystal-radiation interference with senses; susceptibility to conceptual, spiritual, magical, and reality-level forces; and exploitable compassion. There is no singular kryptonite-style weakness.','canon',NULL,'2026-08-16T10:00:00-04:00'::timestamptz),
    ('space-time-motion-authority','Space, Time, and Motion Authority','Catastrophic authority expressed in Story 1 through extreme movement, phasing, space manipulation, time manipulation, gravity and motion manipulation, unstable energy or state effects, restoration through reclaimed power, and rapidly returning awareness. It does not imply every ancient feat is demonstrated by the Purple Man.','This authority belongs to Eos, the underlying ancient Omega. Exact manifestation and inheritance mechanics remain intentionally unresolved.','canon',NULL,'2026-08-16T10:00:00-04:00'::timestamptz)
  ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name,summary_md=EXCLUDED.summary_md,spoiler_md=EXCLUDED.spoiler_md,canon_status=EXCLUDED.canon_status,notion_source_url=NULL,last_synced_at=EXCLUDED.last_synced_at;

  DELETE FROM public.character_powers WHERE character_id IN (death_cloak_id,dread_id,karim_id,ren_id,blue_id,tommy_id,malcolm_id,ultra_id,purple_id);
  INSERT INTO public.character_powers (character_id,power_system_id,notes)
  SELECT death_cloak_id,id,'High-level Umbra practitioner specializing in concealment, 2D movement, shadow travel, weaponization, coating, and durability bypass.' FROM public.power_systems WHERE slug='umbra-manipulation'
  UNION ALL SELECT dread_id,id,'Haymitch exploits specific emotional vulnerabilities rather than relying on a generic fear aura.' FROM public.power_systems WHERE slug='psychic-fear-manipulation'
  UNION ALL SELECT ren_id,id,'Ren weaponizes small nearby objects and maintains no more than two marked targets.' FROM public.power_systems WHERE slug='limited-tactile-telekinesis'
  UNION ALL SELECT blue_id,id,'Vector control redirects motion, negates momentum, enables flight, and helps Blue operate despite catastrophic injury.' FROM public.power_systems WHERE slug='vector-manipulation'
  UNION ALL SELECT tommy_id,id,'Dormant power first awakens near death during the Purple War; later development remains outside Phase 1.' FROM public.power_systems WHERE slug='wind-atmospheric-boundary-manipulation'
  UNION ALL SELECT malcolm_id,id,'Malcolm’s body has aged, but his psychic Command remains extraordinarily powerful and restrained.' FROM public.power_systems WHERE slug='command'
  UNION ALL SELECT ultra_id,id,'Ultra’s broad natural abilities are unified by fine control, adaptive protection, rescue utility, and significant energetic costs.' FROM public.power_systems WHERE slug='natural-superhuman-physiology'
  UNION ALL SELECT purple_id,id,'Story 1 manifestation only; ancient Eos capabilities beyond demonstrated Purple War relevance are excluded.' FROM public.power_systems WHERE slug='space-time-motion-authority';
END $$;
