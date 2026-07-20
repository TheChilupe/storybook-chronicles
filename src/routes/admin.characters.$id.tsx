import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import {
  adminCharacterQO,
  adminStoriesLiteQO,
  characterQO,
} from "@/lib/queries";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/characters/$id")({
  ssr: false,
  loader: async ({ params, context }) => {
    const row = await context.queryClient.ensureQueryData(adminCharacterQO(params.id));
    if (!row) throw notFound();
    return { id: row.id };
  },
  component: CharacterEditor,
  notFoundComponent: () => (
    <div className="rounded-2xl border border-border bg-card p-10 text-center">
      <h1 className="text-xl font-semibold">Character not found</h1>
      <Link to="/admin/characters" className="mt-4 inline-block text-sm underline">
        Back to characters
      </Link>
    </div>
  ),
});

type Tab =
  | "basics"
  | "identity"
  | "narrative"
  | "powers"
  | "progression"
  | "story-progression"
  | "relationships"
  | "key-moments"
  | "quotes"
  | "story-appearances"
  | "media"
  | "publishing";

const TABS: Array<{ id: Tab; label: string; editable: boolean }> = [
  { id: "basics", label: "Basics", editable: true },
  { id: "identity", label: "Identity", editable: true },
  { id: "narrative", label: "Narrative", editable: true },
  { id: "media", label: "Media", editable: true },
  { id: "publishing", label: "Publishing", editable: true },
  { id: "powers", label: "Powers", editable: false },
  { id: "progression", label: "Progression", editable: false },
  { id: "story-progression", label: "Story progression", editable: false },
  { id: "relationships", label: "Relationships", editable: false },
  { id: "key-moments", label: "Key moments", editable: false },
  { id: "quotes", label: "Quotes", editable: false },
  { id: "story-appearances", label: "Story appearances", editable: false },
];

type EditableFields = {
  slug: string;
  name: string;
  alias: string;
  role: string;
  eyebrow: string;
  tagline: string;
  accent_color: string;
  canon_status: string;
  primary_story_id: string | null;
  canon_summary_md: string;
  identity_md: string;
  story_role_md: string;
  core_conflict_md: string;
  spoiler_md: string;
  portrait_url: string;
};

function CharacterEditor() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: row, isLoading } = useQuery(adminCharacterQO(id));
  const { data: stories = [] } = useQuery(adminStoriesLiteQO);
  const [tab, setTab] = useState<Tab>("basics");
  const [form, setForm] = useState<EditableFields | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!row) return;
    setForm({
      slug: row.slug ?? "",
      name: row.name ?? "",
      alias: row.alias ?? "",
      role: row.role ?? "",
      eyebrow: row.eyebrow ?? "",
      tagline: row.tagline ?? "",
      accent_color: row.accent_color ?? "#2563eb",
      canon_status: row.canon_status ?? "canon",
      primary_story_id: row.primary_story_id ?? null,
      canon_summary_md: row.canon_summary_md ?? "",
      identity_md: row.identity_md ?? "",
      story_role_md: row.story_role_md ?? "",
      core_conflict_md: (row as { core_conflict_md?: string | null }).core_conflict_md ?? "",
      spoiler_md: row.spoiler_md ?? "",
      portrait_url: row.portrait_url ?? "",
    });
    setDirty(false);
  }, [row]);

  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  if (isLoading || !form || !row) {
    return <div className="rounded-2xl border border-border bg-card p-8 text-muted-foreground">Loading character…</div>;
  }

  const update = <K extends keyof EditableFields>(k: K, v: EditableFields[K]) => {
    setForm((f) => (f ? { ...f, [k]: v } : f));
    setDirty(true);
  };

  const invalidate = async () => {
    await Promise.all([
      qc.invalidateQueries({ queryKey: ["admin", "characters"] }),
      qc.invalidateQueries({ queryKey: ["admin", "character", id] }),
      qc.invalidateQueries({ queryKey: ["characters"] }),
      qc.invalidateQueries({ queryKey: ["character", form.slug] }),
      qc.invalidateQueries({ queryKey: ["character", row.slug] }),
    ]);
  };

  const saveCore = async () => {
    setError(null); setNotice(null); setSaving(true);
    try {
      if (!/^[a-z0-9-]+$/.test(form.slug)) throw new Error("Slug must be lowercase letters, numbers, and dashes only.");
      if (!/^#[0-9A-Fa-f]{6}$/.test(form.accent_color)) throw new Error("Accent color must be a 6-digit hex like #2563eb.");
      if (!form.name.trim()) throw new Error("Name is required.");

      const { data: userRes } = await supabase.auth.getUser();
      const patch = {
        slug: form.slug.trim(),
        name: form.name.trim(),
        alias: form.alias.trim() || null,
        role: form.role.trim() || null,
        eyebrow: form.eyebrow.trim() || null,
        tagline: form.tagline.trim() || null,
        accent_color: form.accent_color.trim(),
        canon_status: form.canon_status,
        primary_story_id: form.primary_story_id,
        canon_summary_md: form.canon_summary_md,
        identity_md: form.identity_md,
        story_role_md: form.story_role_md,
        core_conflict_md: form.core_conflict_md,
        spoiler_md: form.spoiler_md,
        portrait_url: form.portrait_url.trim() || null,
        updated_by: userRes.user?.id ?? null,
      } as const;
      const { error: upErr } = await supabase.from("characters").update(patch).eq("id", id);
      if (upErr) throw upErr;
      await invalidate();
      setDirty(false);
      setNotice("Changes saved.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const setStatus = async (nextStatus: string, confirmText?: string) => {
    if (confirmText && !window.confirm(confirmText)) return;
    setError(null); setNotice(null); setSaving(true);
    try {
      const { data: userRes } = await supabase.auth.getUser();
      const { error: e2 } = await supabase
        .from("characters")
        .update({ status: nextStatus, updated_by: userRes.user?.id ?? null })
        .eq("id", id);
      if (e2) throw e2;
      await invalidate();
      setNotice(`Status set to ${nextStatus.replace("_", " ")}.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Status change failed.");
    } finally {
      setSaving(false);
    }
  };

  const archive = async () => {
    if (!window.confirm(`Archive "${row.name}"? It will disappear from the public codex but remain in the database.`)) return;
    setSaving(true);
    try {
      const { data: userRes } = await supabase.auth.getUser();
      const { error: e2 } = await supabase
        .from("characters")
        .update({ archived_at: new Date().toISOString(), updated_by: userRes.user?.id ?? null })
        .eq("id", id);
      if (e2) throw e2;
      await invalidate();
      navigate({ to: "/admin/characters" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Archive failed.");
      setSaving(false);
    }
  };

  const unarchive = async () => {
    setSaving(true);
    try {
      const { error: e2 } = await supabase.from("characters").update({ archived_at: null }).eq("id", id);
      if (e2) throw e2;
      await invalidate();
      setNotice("Restored from archive.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Restore failed.");
    } finally {
      setSaving(false);
    }
  };

  const hardDelete = async () => {
    const confirmName = window.prompt(
      `Type the character's display name to confirm permanent deletion.\n\nThis cascades to eras, quotes, key moments, relationships, story notes, and portrait references.\n\nExpected: ${row.name}`,
    );
    if (confirmName !== row.name) {
      if (confirmName != null) window.alert("Name did not match. Deletion cancelled.");
      return;
    }
    setSaving(true);
    try {
      const { error: e2 } = await supabase.from("characters").delete().eq("id", id);
      if (e2) throw e2;
      await invalidate();
      navigate({ to: "/admin/characters" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed.");
      setSaving(false);
    }
  };

  const slugChanged = form.slug !== row.slug;
  const isPublished = row.status === "published";

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link to="/admin/characters" className="text-xs text-muted-foreground hover:underline">
            ← Back to characters
          </Link>
          <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">{row.name}</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Last updated {new Date(row.updated_at).toLocaleString()} · status <span className="font-medium">{row.status}</span>
            {row.archived_at && <> · archived {new Date(row.archived_at).toLocaleDateString()}</>}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href={`/characters/${row.slug}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-border px-3 py-2 text-sm hover:bg-secondary"
          >
            Preview →
          </a>
          <button
            type="button"
            onClick={saveCore}
            disabled={saving || !dirty}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            {saving ? "Saving…" : dirty ? "Save changes" : "Saved"}
          </button>
        </div>
      </div>

      {error && <Banner tone="error">{error}</Banner>}
      {notice && <Banner tone="ok">{notice}</Banner>}

      <div className="rounded-2xl border border-border bg-card">
        <TabBar tab={tab} setTab={setTab} />
        <div className="p-4 sm:p-6">
          {tab === "basics" && (
            <BasicsForm form={form} update={update} stories={stories} slugChanged={slugChanged} isPublished={isPublished} />
          )}
          {tab === "identity" && <IdentityForm form={form} update={update} />}
          {tab === "narrative" && <NarrativeForm form={form} update={update} />}
          {tab === "media" && <MediaForm form={form} update={update} slug={row.slug} />}
          {tab === "publishing" && (
            <PublishingPanel
              form={form}
              status={row.status}
              archivedAt={row.archived_at}
              saving={saving}
              setStatus={setStatus}
              archive={archive}
              unarchive={unarchive}
              hardDelete={hardDelete}
              dirty={dirty}
              onSaveFirst={saveCore}
            />
          )}
          {(tab === "powers" ||
            tab === "progression" ||
            tab === "story-progression" ||
            tab === "relationships" ||
            tab === "key-moments" ||
            tab === "quotes" ||
            tab === "story-appearances") && <ReadOnlyPlaceholder tab={tab} />}
        </div>
      </div>
    </div>
  );
}

function TabBar({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  return (
    <>
      {/* Desktop tabs */}
      <div className="hidden overflow-x-auto border-b border-border md:block">
        <div className="flex min-w-max">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm transition ${
                tab === t.id
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
              {!t.editable && <span className="ml-2 rounded-full bg-muted px-1.5 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">Read-only</span>}
            </button>
          ))}
        </div>
      </div>
      {/* Mobile select */}
      <div className="border-b border-border p-3 md:hidden">
        <label className="sr-only" htmlFor="tab-select">Section</label>
        <select
          id="tab-select"
          value={tab}
          onChange={(e) => setTab(e.target.value as Tab)}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        >
          {TABS.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
              {!t.editable ? " (read-only)" : ""}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

const inputCls = "w-full rounded-md border border-border bg-background px-3 py-2 text-sm";

function BasicsForm({
  form,
  update,
  stories,
  slugChanged,
  isPublished,
}: {
  form: EditableFields;
  update: <K extends keyof EditableFields>(k: K, v: EditableFields[K]) => void;
  stories: Array<{ id: string; slug: string; number: number | null; title: string }>;
  slugChanged: boolean;
  isPublished: boolean;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Field label="Display name">
        <input className={inputCls} value={form.name} onChange={(e) => update("name", e.target.value)} />
      </Field>
      <Field label="Alias / hero name">
        <input className={inputCls} value={form.alias} onChange={(e) => update("alias", e.target.value)} />
      </Field>
      <Field label="Slug" hint={slugChanged && isPublished ? "⚠ Changing the slug of a published character breaks existing links." : "Lowercase letters, numbers, and dashes only."}>
        <input className={inputCls} value={form.slug} onChange={(e) => update("slug", e.target.value)} />
      </Field>
      <Field label="Accent color" hint="6-digit hex.">
        <div className="flex items-center gap-2">
          <input type="color" value={form.accent_color} onChange={(e) => update("accent_color", e.target.value)} className="h-9 w-12 cursor-pointer rounded border border-border bg-background" />
          <input className={inputCls} value={form.accent_color} onChange={(e) => update("accent_color", e.target.value)} />
        </div>
      </Field>
      <Field label="Eyebrow" hint="Small label above the display name on the hero.">
        <input className={inputCls} value={form.eyebrow} onChange={(e) => update("eyebrow", e.target.value)} />
      </Field>
      <Field label="Narrative role">
        <input className={inputCls} value={form.role} onChange={(e) => update("role", e.target.value)} />
      </Field>
      <Field label="Primary story">
        <select
          className={inputCls}
          value={form.primary_story_id ?? ""}
          onChange={(e) => update("primary_story_id", e.target.value || null)}
        >
          <option value="">— None —</option>
          {stories.map((s) => (
            <option key={s.id} value={s.id}>
              {s.number != null ? `${s.number}. ${s.title}` : s.title}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Canon status">
        <select className={inputCls} value={form.canon_status} onChange={(e) => update("canon_status", e.target.value)}>
          <option value="canon">Canon</option>
          <option value="non-canon">Non-canon</option>
        </select>
      </Field>
      <div className="md:col-span-2">
        <Field label="Tagline" hint="One-line pull quote shown near the hero and overview.">
          <input className={inputCls} value={form.tagline} onChange={(e) => update("tagline", e.target.value)} />
        </Field>
      </div>
    </div>
  );
}

function IdentityForm({
  form,
  update,
}: {
  form: EditableFields;
  update: <K extends keyof EditableFields>(k: K, v: EditableFields[K]) => void;
}) {
  return (
    <div className="space-y-4">
      <Field label="Identity (markdown)" hint="Renders as the 'Character Identity' section. A leading blockquote line becomes a pull quote.">
        <textarea
          className={`${inputCls} min-h-[220px] font-mono text-sm leading-6`}
          value={form.identity_md}
          onChange={(e) => update("identity_md", e.target.value)}
        />
      </Field>
    </div>
  );
}

function NarrativeForm({
  form,
  update,
}: {
  form: EditableFields;
  update: <K extends keyof EditableFields>(k: K, v: EditableFields[K]) => void;
}) {
  return (
    <div className="space-y-4">
      <Field label="Overview (markdown)" hint="Shown as the top 'Overview' section on the public profile.">
        <textarea
          className={`${inputCls} min-h-[180px] font-mono text-sm leading-6`}
          value={form.canon_summary_md}
          onChange={(e) => update("canon_summary_md", e.target.value)}
        />
      </Field>
      <Field label="Core conflict (markdown)" hint="Stylized pull-quote section that appears near the top of the profile.">
        <textarea
          className={`${inputCls} min-h-[120px] font-mono text-sm leading-6`}
          value={form.core_conflict_md}
          onChange={(e) => update("core_conflict_md", e.target.value)}
        />
      </Field>
      <Field label="Story role (markdown)" hint="Shown as the 'Story Role' section.">
        <textarea
          className={`${inputCls} min-h-[160px] font-mono text-sm leading-6`}
          value={form.story_role_md}
          onChange={(e) => update("story_role_md", e.target.value)}
        />
      </Field>
      <Field label="Spoiler body (markdown)" hint="Rendered behind the Reveal Spoilers toggle.">
        <textarea
          className={`${inputCls} min-h-[140px] font-mono text-sm leading-6`}
          value={form.spoiler_md}
          onChange={(e) => update("spoiler_md", e.target.value)}
        />
      </Field>
    </div>
  );
}

function MediaForm({
  form,
  update,
  slug,
}: {
  form: EditableFields;
  update: <K extends keyof EditableFields>(k: K, v: EditableFields[K]) => void;
  slug: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function upload(file: File) {
    setUploading(true); setUploadError(null);
    try {
      const ext = (file.name.split(".").pop() || "png").toLowerCase();
      const path = `characters/${slug}-${Date.now()}.${ext}`;
      const up = await supabase.storage.from("lore-images").upload(path, file, { upsert: true, contentType: file.type });
      if (up.error) throw up.error;
      const signed = await supabase.storage.from("lore-images").createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
      if (signed.error || !signed.data?.signedUrl) throw signed.error ?? new Error("Failed to sign URL");
      update("portrait_url", signed.data.signedUrl);
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,220px)_minmax(0,1fr)]">
      <div>
        <div className="aspect-[2/3] w-full overflow-hidden rounded-xl border border-border bg-muted">
          {form.portrait_url ? (
            <img src={form.portrait_url} alt="" className="h-full w-full object-cover object-top" />
          ) : (
            <div className="grid h-full w-full place-items-center text-xs text-muted-foreground">No portrait</div>
          )}
        </div>
      </div>
      <div className="space-y-4">
        <label className={`inline-flex cursor-pointer items-center rounded-md border border-border bg-background px-3 py-2 text-sm hover:border-primary ${uploading ? "pointer-events-none opacity-60" : ""}`}>
          {uploading ? "Uploading…" : "Upload new portrait"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) void upload(f); }}
          />
        </label>
        {uploadError && <p className="text-sm text-destructive">{uploadError}</p>}
        <Field label="Portrait URL" hint="Set manually if needed. Upload above auto-fills this. Remember to save.">
          <input className={inputCls} value={form.portrait_url} onChange={(e) => update("portrait_url", e.target.value)} />
        </Field>
        {form.portrait_url && (
          <button
            type="button"
            onClick={() => update("portrait_url", "")}
            className="text-xs text-muted-foreground underline hover:text-foreground"
          >
            Remove portrait reference
          </button>
        )}
      </div>
    </div>
  );
}

function PublishingPanel({
  form,
  status,
  archivedAt,
  saving,
  setStatus,
  archive,
  unarchive,
  hardDelete,
  dirty,
  onSaveFirst,
}: {
  form: EditableFields;
  status: string;
  archivedAt: string | null;
  saving: boolean;
  setStatus: (s: string, confirmText?: string) => Promise<void>;
  archive: () => Promise<void>;
  unarchive: () => Promise<void>;
  hardDelete: () => Promise<void>;
  dirty: boolean;
  onSaveFirst: () => Promise<void>;
}) {
  const missing: string[] = [];
  if (!form.canon_summary_md.trim()) missing.push("Overview");
  if (!form.portrait_url) missing.push("Portrait");
  if (!form.primary_story_id) missing.push("Primary story");

  const doPublish = async () => {
    if (dirty) {
      if (!window.confirm("You have unsaved changes. Save first, then publish?")) return;
      await onSaveFirst();
    }
    if (missing.length) {
      if (!window.confirm(`Publish anyway? Missing recommended fields:\n\n• ${missing.join("\n• ")}`)) return;
    }
    await setStatus("published");
  };

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Current status</h2>
        <p className="mt-2 text-lg font-semibold capitalize">{status.replace("_", " ")}</p>
        {archivedAt && <p className="mt-1 text-sm text-amber-500">Archived on {new Date(archivedAt).toLocaleDateString()}.</p>}
        {missing.length > 0 && (
          <p className="mt-2 text-sm text-muted-foreground">
            Recommended before publishing: <span className="text-foreground">{missing.join(", ")}</span>.
          </p>
        )}
      </section>

      <section className="flex flex-wrap gap-2">
        <ActionBtn onClick={() => setStatus("draft")} disabled={saving || status === "draft"}>Save as Draft</ActionBtn>
        <ActionBtn onClick={() => setStatus("needs_review")} disabled={saving || status === "needs_review"}>Mark Needs Review</ActionBtn>
        <ActionBtn onClick={doPublish} disabled={saving || (status === "published" && !dirty)} primary>Publish</ActionBtn>
        {status === "published" && (
          <ActionBtn onClick={() => setStatus("draft", "Unpublish this character? It will disappear from the public codex.")} disabled={saving}>
            Unpublish
          </ActionBtn>
        )}
      </section>

      <section className="rounded-xl border border-destructive/40 bg-destructive/5 p-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-destructive">Danger zone</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {archivedAt ? (
            <ActionBtn onClick={unarchive} disabled={saving}>Restore from archive</ActionBtn>
          ) : (
            <ActionBtn onClick={archive} disabled={saving}>Archive character</ActionBtn>
          )}
          <ActionBtn onClick={hardDelete} disabled={saving} destructive>
            Delete permanently…
          </ActionBtn>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Archive hides the character from public views but keeps all data. Permanent deletion cascades to eras, quotes, key moments, relationships, and story notes.
        </p>
      </section>
    </div>
  );
}

function ActionBtn({
  onClick,
  disabled,
  children,
  primary,
  destructive,
}: {
  onClick: () => void | Promise<void>;
  disabled?: boolean;
  children: React.ReactNode;
  primary?: boolean;
  destructive?: boolean;
}) {
  const cls = destructive
    ? "bg-destructive text-destructive-foreground hover:opacity-90"
    : primary
      ? "bg-primary text-primary-foreground hover:opacity-90"
      : "border border-border bg-background hover:bg-secondary";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50 ${cls}`}
    >
      {children}
    </button>
  );
}

function ReadOnlyPlaceholder({ tab }: { tab: string }) {
  const label = tab.replace(/-/g, " ");
  return (
    <div className="rounded-xl border border-dashed border-border bg-background/40 p-6 text-sm text-muted-foreground">
      <p className="font-medium capitalize text-foreground">{label}</p>
      <p className="mt-2">
        This section is read-only in Admin V0.1. The repeatable editors for eras, story notes, key moments, quotes, relationships, and story appearances will ship in V0.2. Existing data continues to render on the public profile.
      </p>
    </div>
  );
}

function Banner({ tone, children }: { tone: "error" | "ok"; children: React.ReactNode }) {
  const cls =
    tone === "error"
      ? "border-destructive/50 bg-destructive/10 text-destructive"
      : "border-emerald-500/40 bg-emerald-500/10 text-emerald-500";
  return <div className={`rounded-md border px-3 py-2 text-sm ${cls}`}>{children}</div>;
}

// Silence unused-import warning: characterQO reserved for future preview.
void characterQO;