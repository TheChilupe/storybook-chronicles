-- Allow the existing owner-only Location Admin to write through the Data API.
-- `worlds` remains the internal table name. RLS is the authorization boundary;
-- anon receives no mutation privileges and authenticated mutations still have
-- to satisfy public.is_owner().

ALTER TABLE public.worlds ENABLE ROW LEVEL SECURITY;

REVOKE INSERT, UPDATE, DELETE ON TABLE public.worlds FROM anon;
GRANT INSERT, UPDATE, DELETE ON TABLE public.worlds TO authenticated;

DROP POLICY IF EXISTS "owner all" ON public.worlds;
CREATE POLICY "owner all"
  ON public.worlds
  FOR ALL
  TO authenticated
  USING (public.is_owner())
  WITH CHECK (public.is_owner());
