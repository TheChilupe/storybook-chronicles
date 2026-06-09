import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { isAllowed } from "@/lib/auth";
import logo from "@/assets/logo-white.png";

export const Route = createFileRoute("/reset")({
  head: () => ({ meta: [{ title: "Reset password — Storybook Codex" }] }),
  component: ResetPage,
});

function ResetPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // Supabase parses the recovery token from the URL hash and emits PASSWORD_RECOVERY.
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setInfo(null);
    setBusy(true);
    try {
      const { data, error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      if (!isAllowed(data.user?.email)) {
        await supabase.auth.signOut();
        setErr("This codex is private.");
        return;
      }
      setInfo("Password updated. Redirecting…");
      setTimeout(() => navigate({ to: "/" }), 800);
    } catch (e: any) {
      setErr(e.message ?? "Could not update password");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-2xl border border-border bg-card p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <img src={logo} alt="" className="h-14 w-14" />
          <h1 className="mt-3 text-xl font-semibold">Set a new password</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            {ready ? "Enter a new password for your account." : "Waiting for recovery link…"}
          </p>
        </div>
        <label className="block text-sm">
          <span className="text-muted-foreground">New password</span>
          <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
        </label>
        {err && <p className="text-sm text-[color:var(--destructive)]">{err}</p>}
        {info && <p className="text-sm text-muted-foreground">{info}</p>}
        <button disabled={busy || !ready} className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50">
          {busy ? "…" : "Update password"}
        </button>
      </form>
    </div>
  );
}