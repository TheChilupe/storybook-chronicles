-- The Public Codex views exist in PostgreSQL, but staging PostgREST retained a
-- stale schema cache after their creation. Reload metadata without changing
-- any tables, policies, grants, or lore records.
NOTIFY pgrst, 'reload schema';
