-- Restore table-level read privileges required by the existing owner-only RLS
-- policies. PostgreSQL privileges and RLS both apply: this grant permits the
-- authenticated role to attempt reads, while public.is_owner() continues to
-- restrict returned rows to the allowlisted account.

GRANT SELECT ON
  public.stories,
  public.characters,
  public.factions,
  public.worlds,
  public.power_systems,
  public.spoiler_notes,
  public.character_stories,
  public.character_factions,
  public.character_worlds,
  public.character_powers,
  public.character_eras,
  public.character_relationships,
  public.character_story_notes,
  public.character_key_moments,
  public.character_quotes
TO authenticated;
