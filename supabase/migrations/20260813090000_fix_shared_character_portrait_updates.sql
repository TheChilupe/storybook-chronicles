-- Character Admin uploads must persist portrait_url through the Data API.
-- RLS remains the authorization boundary: only the allowlisted owner satisfies
-- the existing authenticated "owner all" policy.

ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;

REVOKE UPDATE ON TABLE public.characters FROM anon;
GRANT UPDATE ON TABLE public.characters TO authenticated;

