import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { isAllowed, ALLOWED_EMAIL } from "@/lib/auth";
import logo from "@/assets/logo-white.png";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Storybook Codex" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session && isAllowed(data.session.user.email)) navigate({ to: "/" });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!isAllowed(email)) { setErr("This codex is private."); return; }
    setBusy(true);
    try {
      const fn = mode === "signin" ? supabase.auth.signInWithPassword : supabase.auth.signUp;
      const { error } = await fn({ email, password });
      if (error) throw error;
      navigate({ to: "/" });
    } catch (e: any) {
      setErr(e.message ?? "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-2xl border border-border bg-card p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <img src={logo} alt="" className="h-14 w-14" />
          <h1 className="mt-3 text-xl font-semibold">Storybook Chronicles Codex</h1>
          <p className="mt-1 text-xs text-muted-foreground">Private lore bible — access restricted.</p>
        </div>
        <label className="block text-sm">
          <span className="text-muted-foreground">Email</span>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder={ALLOWED_EMAIL} />
        </label>
        <label className="block text-sm">
          <span className="text-muted-foreground">Password</span>
          <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
        </label>
        {err && <p className="text-sm text-[color:var(--destructive)]">{err}</p>}
        <button disabled={busy} className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50">
          {busy ? "…" : mode === "signin" ? "Sign in" : "Create account"}
        </button>
        <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="block w-full text-center text-xs text-muted-foreground hover:text-foreground">
          {mode === "signin" ? "First time? Create your account" : "Have an account? Sign in"}
        </button>
      </form>
    </div>
  );
}