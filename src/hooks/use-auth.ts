import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { isAllowed, type AuthState } from "@/lib/auth";

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({ loading: true, email: null, allowed: false });

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      const email = session?.user?.email ?? null;
      setState({ loading: false, email, allowed: isAllowed(email) });
    });
    supabase.auth.getSession().then(({ data }) => {
      const email = data.session?.user?.email ?? null;
      setState({ loading: false, email, allowed: isAllowed(email) });
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return state;
}