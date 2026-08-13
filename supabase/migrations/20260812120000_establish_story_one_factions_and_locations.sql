-- Story 1 faction and location foundation.
-- `worlds` remains the internal legacy table; the product calls these Locations.
-- This migration deliberately does not write character_factions or character_worlds.

ALTER TABLE public.factions
  ADD COLUMN IF NOT EXISTS abbreviation text,
  ADD COLUMN IF NOT EXISTS organization_type text,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'published',
  ADD COLUMN IF NOT EXISTS archived_at timestamptz;

ALTER TABLE public.worlds
  ADD COLUMN IF NOT EXISTS location_type text,
  ADD COLUMN IF NOT EXISTS parent_world_id uuid REFERENCES public.worlds(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'published',
  ADD COLUMN IF NOT EXISTS archived_at timestamptz;

ALTER TABLE public.factions DROP CONSTRAINT IF EXISTS factions_status_chk;
ALTER TABLE public.factions ADD CONSTRAINT factions_status_chk
  CHECK (status IN ('draft', 'imported', 'needs_review', 'published'));
ALTER TABLE public.worlds DROP CONSTRAINT IF EXISTS worlds_status_chk;
ALTER TABLE public.worlds ADD CONSTRAINT worlds_status_chk
  CHECK (status IN ('draft', 'imported', 'needs_review', 'published'));

CREATE INDEX IF NOT EXISTS factions_status_idx ON public.factions(status);
CREATE INDEX IF NOT EXISTS factions_archived_at_idx ON public.factions(archived_at);
CREATE INDEX IF NOT EXISTS worlds_status_idx ON public.worlds(status);
CREATE INDEX IF NOT EXISTS worlds_archived_at_idx ON public.worlds(archived_at);
CREATE INDEX IF NOT EXISTS worlds_parent_world_id_idx ON public.worlds(parent_world_id);

DO $migration$
DECLARE
  order_id uuid;
  apex_id uuid;
  legnous_id uuid;
  candidate_count integer;
BEGIN
  SELECT count(*), (array_agg(id))[1] INTO candidate_count, order_id
  FROM public.factions WHERE lower(trim(slug)) = 'the-order' OR lower(trim(name)) = 'the order';
  IF candidate_count > 1 THEN RAISE EXCEPTION 'Found % Order candidates; reconcile duplicates manually', candidate_count; END IF;
  IF candidate_count = 0 THEN
    INSERT INTO public.factions (slug, name) VALUES ('the-order', 'The Order') RETURNING id INTO order_id;
  END IF;
  UPDATE public.factions SET
    slug = 'the-order', name = 'The Order', organization_type = 'Secret organization / institution',
    summary_md = 'A hidden and internally varied organization devoted to accelerating human advancement and preparing humanity for threats beyond ordinary understanding. Its work spans science, medicine, technology, research, influence, enhanced individuals, supernatural phenomena, and long-term human development. The Order favors influence, networks, contractors, researchers, businesses, politicians, specialists, and partnerships rather than public visibility.',
    canon_status = 'canon', status = 'published', archived_at = NULL
  WHERE id = order_id;

  SELECT count(*), (array_agg(id))[1] INTO candidate_count, apex_id
  FROM public.factions WHERE lower(trim(slug)) = 'apex-dynamics' OR lower(trim(name)) = 'apex dynamics';
  IF candidate_count > 1 THEN RAISE EXCEPTION 'Found % Apex Dynamics candidates; reconcile duplicates manually', candidate_count; END IF;
  IF candidate_count = 0 THEN
    INSERT INTO public.factions (slug, name) VALUES ('apex-dynamics', 'Apex Dynamics') RETURNING id INTO apex_id;
  END IF;
  UPDATE public.factions SET
    slug = 'apex-dynamics', name = 'Apex Dynamics', organization_type = 'Corporation / hero institution',
    summary_md = 'An organization involved in professionalizing, training, supporting, researching, sponsoring, and publicly presenting superhuman heroism. Apex represents institutionalized heroism and the attempt to make extraordinary individuals part of organized public life.',
    canon_status = 'canon', status = 'published', archived_at = NULL
  WHERE id = apex_id;

  INSERT INTO public.factions (slug, name, abbreviation, organization_type, summary_md, canon_status, status)
  VALUES
    ('legnous-city-police-department', 'Legnous City Police Department', 'LCPD', 'Government / Law Enforcement', 'The primary law-enforcement institution of Legnous City. The LCPD represents conventional law, public safety, investigation, emergency response, and civic order as Legnous enters the superhuman era. The department is not incompetent; its challenge is that traditional policing was never designed for crystals, superhuman threats, teleportation, vigilantes, hidden organizations, and rapidly changing forms of power.', 'canon', 'published'),
    ('the-zealots', 'The Zealots', NULL, 'Enhanced street faction / gang', 'A street-level enhanced group associated with crystal-infused tattoo experimentation, strength culture, accessible superhuman power, body obsession, and the spread of enhancement into ordinary social life. Their origin is social and accidental rather than an elaborate institutional plan.', 'canon', 'published')
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name, abbreviation = EXCLUDED.abbreviation,
    organization_type = EXCLUDED.organization_type, summary_md = EXCLUDED.summary_md,
    canon_status = 'canon', status = 'published', archived_at = NULL;

  SELECT count(*), (array_agg(id))[1] INTO candidate_count, legnous_id
  FROM public.worlds WHERE lower(trim(slug)) = 'legnous-city' OR lower(trim(name)) = 'legnous city';
  IF candidate_count > 1 THEN RAISE EXCEPTION 'Found % Legnous City candidates; reconcile duplicates manually', candidate_count; END IF;
  IF candidate_count = 0 THEN
    INSERT INTO public.worlds (slug, name) VALUES ('legnous-city', 'Legnous City') RETURNING id INTO legnous_id;
  END IF;
  UPDATE public.worlds SET
    slug = 'legnous-city', name = 'Legnous City', location_type = 'City', parent_world_id = NULL,
    summary_md = 'The central setting of Story 1. Legnous is a rapidly developing city shaped by ambition and memory: the tension between structured ambition that remembers consequences and builds better, and unchecked ambition that forgets the past and pursues progress regardless of cost. It is a living city, not merely a superhero backdrop.',
    canon_status = 'canon', status = 'published', archived_at = NULL
  WHERE id = legnous_id;

  INSERT INTO public.worlds (slug, name, location_type, parent_world_id, summary_md, canon_status, status)
  VALUES
    ('the-foundry', 'The Foundry', 'District', legnous_id, 'The working-class engine of Legnous City: factories, warehouses, rail infrastructure, small businesses, gyms, side hustles, neighborhood communities, gangs, and street-level ambition. It is rough, competitive, and sometimes dangerous, but not a hopeless slum. Its thematic question is: What are you building?', 'canon', 'published'),
    ('entertainment-district', 'Entertainment District', 'District', legnous_id, 'A massive leisure, nightlife, tourism, entertainment, and luxury ecosystem of clubs, hotels, theaters, gaming spaces, music, tourism, luxury living, and hidden criminal infrastructure. Its identity is escape: the ways ambition, money, time, identity, influence, and information can be spent, wasted, or transformed.', 'canon', 'published'),
    ('financial-district', 'Financial District', 'District', legnous_id, 'The political, corporate, medical, transportation, economic, and media heart of Legnous City. It represents ambition converted into ownership and contains major institutions, businesses, infrastructure, finance, corporate power, healthcare, emergency services, development, and civic influence.', 'canon', 'published'),
    ('legnous-underground', 'Legnous Underground', 'Hidden region / undercity', legnous_id, 'A vast hidden network beneath Legnous containing official sewer infrastructure as well as abandoned tunnels, forgotten areas, hidden communities, criminal routes, and deeper concealed spaces.', 'canon', 'published'),
    ('maddies-memorial-park', 'Maddie’s Memorial Park', 'Park / Civic Landmark', legnous_id, 'A major public remembrance space containing gardens, memorials, benches, plant life, and places dedicated to the people, sacrifices, tragedies, and history of Legnous. The park represents memory, humility, grief, life, and the responsibility to remember consequences.', 'canon', 'published')
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name, location_type = EXCLUDED.location_type,
    parent_world_id = EXCLUDED.parent_world_id, summary_md = EXCLUDED.summary_md,
    canon_status = 'canon', status = 'published', archived_at = NULL;
END
$migration$;
