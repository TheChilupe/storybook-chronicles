-- Public Codex V1: deliberately narrow, read-only projections.
-- Base tables remain owner-only; anon can read only these visitor-safe views.

CREATE OR REPLACE VIEW public.public_codex_stories
WITH (security_barrier = true, security_invoker = false) AS
SELECT id, slug, number, title, tagline, summary_md, cover_image_url, canon_status
FROM public.stories
WHERE canon_status = 'canon';

CREATE OR REPLACE VIEW public.public_codex_characters
WITH (security_barrier = true, security_invoker = false) AS
SELECT id, slug, name, alias, role, story_id, primary_story_id, eyebrow, tagline,
       canon_summary_md, identity_md, story_role_md, core_conflict_md,
       portrait_url, accent_color, canon_status
FROM public.characters
WHERE canon_status = 'canon'
  AND status = 'published'
  AND archived_at IS NULL;

CREATE OR REPLACE VIEW public.public_codex_factions
WITH (security_barrier = true, security_invoker = false) AS
SELECT id, slug, name, abbreviation, organization_type, summary_md, image_url, canon_status
FROM public.factions
WHERE canon_status = 'canon'
  AND status = 'published'
  AND archived_at IS NULL;

CREATE OR REPLACE VIEW public.public_codex_locations
WITH (security_barrier = true, security_invoker = false) AS
SELECT id, slug, name, location_type, parent_world_id, summary_md, image_url, canon_status
FROM public.worlds
WHERE canon_status = 'canon'
  AND status = 'published'
  AND archived_at IS NULL;

CREATE OR REPLACE VIEW public.public_codex_power_systems
WITH (security_barrier = true, security_invoker = false) AS
SELECT id, slug, name, summary_md, canon_status
FROM public.power_systems
WHERE canon_status = 'canon';

CREATE OR REPLACE VIEW public.public_codex_character_stories
WITH (security_barrier = true, security_invoker = false) AS
SELECT cs.character_id, cs.story_id, cs.role
FROM public.character_stories cs
JOIN public.characters c ON c.id = cs.character_id
JOIN public.stories s ON s.id = cs.story_id
WHERE c.canon_status = 'canon' AND c.status = 'published' AND c.archived_at IS NULL
  AND s.canon_status = 'canon';

CREATE OR REPLACE VIEW public.public_codex_character_factions
WITH (security_barrier = true, security_invoker = false) AS
SELECT cf.character_id, cf.faction_id, cf.role, cf.description
FROM public.character_factions cf
JOIN public.characters c ON c.id = cf.character_id
JOIN public.factions f ON f.id = cf.faction_id
WHERE cf.is_spoiler = false
  AND c.canon_status = 'canon' AND c.status = 'published' AND c.archived_at IS NULL
  AND f.canon_status = 'canon' AND f.status = 'published' AND f.archived_at IS NULL;

CREATE OR REPLACE VIEW public.public_codex_character_powers
WITH (security_barrier = true, security_invoker = false) AS
SELECT cp.character_id, cp.power_system_id, cp.notes
FROM public.character_powers cp
JOIN public.characters c ON c.id = cp.character_id
JOIN public.power_systems p ON p.id = cp.power_system_id
WHERE c.canon_status = 'canon' AND c.status = 'published' AND c.archived_at IS NULL
  AND p.canon_status = 'canon';

CREATE OR REPLACE VIEW public.public_codex_character_eras
WITH (security_barrier = true, security_invoker = false) AS
SELECT e.id, e.character_id, e.era_label, e.identity, e.function_md, e.story_id, e.sort_order
FROM public.character_eras e
JOIN public.characters c ON c.id = e.character_id
WHERE e.is_spoiler = false
  AND c.canon_status = 'canon' AND c.status = 'published' AND c.archived_at IS NULL;

CREATE OR REPLACE VIEW public.public_codex_character_story_notes
WITH (security_barrier = true, security_invoker = false) AS
SELECT n.id, n.character_id, n.story_id, n.role_label, n.summary_md, n.sort_order
FROM public.character_story_notes n
JOIN public.characters c ON c.id = n.character_id
JOIN public.stories s ON s.id = n.story_id
WHERE n.is_spoiler = false
  AND c.canon_status = 'canon' AND c.status = 'published' AND c.archived_at IS NULL
  AND s.canon_status = 'canon';

CREATE OR REPLACE VIEW public.public_codex_character_key_moments
WITH (security_barrier = true, security_invoker = false) AS
SELECT m.id, m.character_id, m.story_id, m.title, m.summary_md, m.sort_order
FROM public.character_key_moments m
JOIN public.characters c ON c.id = m.character_id
WHERE m.is_spoiler = false
  AND c.canon_status = 'canon' AND c.status = 'published' AND c.archived_at IS NULL;

CREATE OR REPLACE VIEW public.public_codex_character_quotes
WITH (security_barrier = true, security_invoker = false) AS
SELECT q.id, q.character_id, q.quote_md, q.context_md, q.sort_order
FROM public.character_quotes q
JOIN public.characters c ON c.id = q.character_id
WHERE q.is_spoiler = false
  AND c.canon_status = 'canon' AND c.status = 'published' AND c.archived_at IS NULL;

CREATE OR REPLACE VIEW public.public_codex_character_relationships
WITH (security_barrier = true, security_invoker = false) AS
SELECT r.id, r.character_id, r.related_character_id, r.relation_label,
       r.inverse_label, r.sort_order
FROM public.character_relationships r
JOIN public.characters c ON c.id = r.character_id
JOIN public.characters related ON related.id = r.related_character_id
WHERE r.is_spoiler = false
  AND c.canon_status = 'canon' AND c.status = 'published' AND c.archived_at IS NULL
  AND related.canon_status = 'canon' AND related.status = 'published'
  AND related.archived_at IS NULL;

REVOKE ALL ON public.stories, public.characters, public.factions, public.worlds,
  public.power_systems, public.spoiler_notes, public.character_stories,
  public.character_factions, public.character_worlds, public.character_powers,
  public.character_eras, public.character_story_notes, public.character_key_moments,
  public.character_quotes, public.character_relationships FROM anon;

GRANT SELECT ON public.public_codex_stories, public.public_codex_characters,
  public.public_codex_factions, public.public_codex_locations,
  public.public_codex_power_systems, public.public_codex_character_stories,
  public.public_codex_character_factions, public.public_codex_character_powers,
  public.public_codex_character_eras, public.public_codex_character_story_notes,
  public.public_codex_character_key_moments, public.public_codex_character_quotes,
  public.public_codex_character_relationships TO anon, authenticated;
