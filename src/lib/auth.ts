import { supabase } from "@/integrations/supabase/client";

export const ALLOWED_EMAIL = "thechilupe@gmail.com";

export type AuthState = {
  loading: boolean;
  email: string | null;
  allowed: boolean;
};

export function isAllowed(email: string | null | undefined) {
  return (email ?? "").toLowerCase() === ALLOWED_EMAIL;
}

export async function signOut() {
  await supabase.auth.signOut();
}