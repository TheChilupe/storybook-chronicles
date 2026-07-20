import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { adminStoriesLiteQO } from "@/lib/queries";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/characters/new")({
  ssr: false,
  component: NewCharacterPage,
});

function slugify(v: string) {
  return v
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function NewCharacterPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: stories = [] } = useQuery(adminStoriesLiteQO);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [alias, setAlias] = useState("");
  const [primaryStoryId, setPrimaryStoryId] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const effectiveSlug = slugTouched ? slug : slugify(name);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) { setError("Name is required."); return; }
    if (!/^[a-z0-9-]+$/.test(effectiveSlug)) { setError("Slug must be lowercase letters, numbers, and dashes."); return; }
    setSaving(true);
    try {
      // Uniqueness check.
      const { data: existing, error: e1 } = await supabase
        .from("characters").select("id").eq("slug", effectiveSlug).maybeSingle();
      if (e1) throw e1;
      if (existing) throw new Error(`A character already uses the slug "${effectiveSlug}".`);

      const { data: userRes } = await supabase.auth.getUser();
      const { data: created, error: e2 } = await supabase
        .from("characters")
        .insert({
          slug: effectiveSlug,
          name: name.trim(),
          alias: alias.trim() || null,
          canon_status: "canon",
          status: "draft",
          primary_story_id: primaryStoryId || null,
          updated_by: userRes.user?.id ?? null,
        })
        .select("id")
        .single();
      if (e2) throw e2;
      await qc.invalidateQueries({ queryKey: ["admin", "characters"] });
      navigate({ to: "/admin/characters/$id", params: { id: created.id } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed.");
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-4">
      <div>
        <Link to="/admin/characters" className="text-xs text-muted-foreground hover:underline">
          ← Back to characters
        </Link>
        <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">Create character</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          New characters start as <span className="font-medium">Draft</span> and stay hidden from the public codex until published.
        </p>
      </div>

      <form onSubmit={submit} className="space-y-4 rounded-2xl border border-border bg-card p-5">
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Display name</span>
          <input
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Alias / hero name (optional)</span>
          <input
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Slug</span>
          <input
            className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm"
            value={effectiveSlug}
            onChange={(e) => { setSlug(e.target.value); setSlugTouched(true); }}
          />
          <span className="mt-1 block text-xs text-muted-foreground">
            Auto-generated from the name until you edit it. Lowercase letters, numbers, and dashes only.
          </span>
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Primary story (optional)</span>
          <select
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            value={primaryStoryId}
            onChange={(e) => setPrimaryStoryId(e.target.value)}
          >
            <option value="">— None —</option>
            {stories.map((s) => (
              <option key={s.id} value={s.id}>
                {s.number != null ? `${s.number}. ${s.title}` : s.title}
              </option>
            ))}
          </select>
        </label>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <Link to="/admin/characters" className="rounded-md border border-border px-4 py-2 text-sm hover:bg-secondary">Cancel</Link>
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            {saving ? "Creating…" : "Create draft"}
          </button>
        </div>
      </form>
    </div>
  );
}