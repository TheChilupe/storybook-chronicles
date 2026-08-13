/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { adminFactionsQO, adminLocationsQO } from "@/lib/queries";

type Kind = "faction" | "location";
const inputCls = "w-full rounded-md border border-border bg-background px-3 py-2 text-sm";

const config = {
  faction: {
    plural: "Factions",
    table: "factions",
    query: adminFactionsQO,
    base: "/admin/factions",
  },
  location: {
    plural: "Locations",
    table: "worlds",
    query: adminLocationsQO,
    base: "/admin/locations",
  },
} as const;

export function AdminLoreList({ kind }: { kind: Kind }) {
  const c = config[kind];
  const { data: rows = [], isLoading, error } = useQuery(c.query as any);
  const [search, setSearch] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const filtered = useMemo(
    () =>
      (rows as any[]).filter((row) => {
        if (showArchived !== Boolean(row.archived_at)) return false;
        const q = search.trim().toLowerCase();
        return (
          !q ||
          `${row.name} ${row.slug} ${row.abbreviation ?? ""} ${row.organization_type ?? ""} ${row.location_type ?? ""}`
            .toLowerCase()
            .includes(q)
        );
      }),
    [rows, search, showArchived],
  );
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">{c.plural}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isLoading ? "Loading…" : `${filtered.length} of ${(rows as any[]).length}`}
          </p>
        </div>
        <Link
          to={`${c.base}/new` as any}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          + Create {kind}
        </Link>
      </div>
      {error && (
        <p className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          Could not load {c.plural.toLowerCase()}: {error instanceof Error ? error.message : "Unknown query error"}
        </p>
      )}
      <div className="rounded-2xl border border-border bg-card p-4">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search ${c.plural.toLowerCase()}`}
          className={inputCls}
        />
        <label className="mt-3 inline-flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={showArchived}
            onChange={(e) => setShowArchived(e.target.checked)}
          />{" "}
          Show archived only
        </label>
      </div>
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {filtered.map((row: any) => (
          <Link
            key={row.id}
            to={`${c.base}/${row.id}` as any}
            className="flex items-center justify-between gap-4 border-b border-border p-4 last:border-0 hover:bg-secondary/50"
          >
            <div>
              <div className="font-medium">
                {row.name}
                {row.abbreviation ? ` (${row.abbreviation})` : ""}
              </div>
              <div className="text-xs text-muted-foreground">
                {row.organization_type || row.location_type || row.slug}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs capitalize">{row.status.replace("_", " ")}</div>
              <div className="text-xs text-muted-foreground">Edit →</div>
            </div>
          </Link>
        ))}
        {!isLoading && filtered.length === 0 && (
          <p className="p-8 text-center text-sm text-muted-foreground">
            No matching {c.plural.toLowerCase()}.
          </p>
        )}
      </div>
    </div>
  );
}

export function AdminLoreEditor({ kind, id }: { kind: Kind; id?: string }) {
  const c = config[kind];
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: rows = [] } = useQuery(c.query as any);
  const current = (rows as any[]).find((r) => r.id === id);
  const [form, setForm] = useState<any>(null);
  const value =
    form ??
    (current
      ? {
          name: current.name,
          slug: current.slug,
          abbreviation: current.abbreviation ?? "",
          organization_type: current.organization_type ?? "",
          location_type: current.location_type ?? "",
          parent_world_id: current.parent_world_id ?? "",
          summary_md: current.summary_md ?? "",
          spoiler_md: current.spoiler_md ?? "",
          canon_status: current.canon_status,
          status: current.status,
        }
      : {
          name: "",
          slug: "",
          abbreviation: "",
          organization_type: "",
          location_type: "",
          parent_world_id: "",
          summary_md: "",
          spoiler_md: "",
          canon_status: "canon",
          status: "draft",
        });
  const set = (key: string, v: string) => setForm({ ...value, [key]: v });
  async function save(e: React.FormEvent) {
    e.preventDefault();
    const payload: any = {
      name: value.name.trim(),
      slug: value.slug.trim(),
      summary_md: value.summary_md,
      spoiler_md: value.spoiler_md,
      canon_status: value.canon_status,
      status: value.status,
    };
    if (kind === "faction")
      Object.assign(payload, {
        abbreviation: value.abbreviation.trim() || null,
        organization_type: value.organization_type.trim() || null,
      });
    else
      Object.assign(payload, {
        location_type: value.location_type.trim() || null,
        parent_world_id: value.parent_world_id || null,
      });
    const result = id
      ? await supabase.from(c.table).update(payload).eq("id", id).select("id").single()
      : await supabase.from(c.table).insert(payload).select("id").single();
    if (result.error) return window.alert(result.error.message);
    await qc.invalidateQueries({ queryKey: ["admin", c.plural.toLowerCase()] });
    navigate({ to: `${c.base}/${result.data.id}` as any });
  }
  async function toggleArchive() {
    if (!id) return;
    const archived_at = current?.archived_at ? null : new Date().toISOString();
    const { error } = await supabase.from(c.table).update({ archived_at }).eq("id", id);
    if (error) return window.alert(error.message);
    await qc.invalidateQueries({ queryKey: ["admin", c.plural.toLowerCase()] });
    setForm(null);
  }
  if (id && !current) return <p className="text-sm text-muted-foreground">Loading…</p>;
  return (
    <div className="max-w-3xl space-y-4">
      <Link to={c.base as any} className="text-xs text-muted-foreground hover:underline">
        ← Back to {c.plural.toLowerCase()}
      </Link>
      <h1 className="text-2xl font-semibold">{id ? `Edit ${kind}` : `Create ${kind}`}</h1>
      <form onSubmit={save} className="space-y-4 rounded-2xl border border-border bg-card p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Display name">
            <input
              required
              className={inputCls}
              value={value.name}
              onChange={(e) => set("name", e.target.value)}
            />
          </Field>
          <Field label="Slug">
            <input
              required
              pattern="[a-z0-9-]+"
              className={inputCls}
              value={value.slug}
              onChange={(e) => set("slug", e.target.value)}
            />
          </Field>
        </div>
        {kind === "faction" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Abbreviation">
              <input
                className={inputCls}
                value={value.abbreviation}
                onChange={(e) => set("abbreviation", e.target.value)}
              />
            </Field>
            <Field label="Organization type">
              <input
                className={inputCls}
                value={value.organization_type}
                onChange={(e) => set("organization_type", e.target.value)}
              />
            </Field>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Location type">
              <input
                className={inputCls}
                value={value.location_type}
                onChange={(e) => set("location_type", e.target.value)}
              />
            </Field>
            <Field label="Parent location">
              <select
                className={inputCls}
                value={value.parent_world_id}
                onChange={(e) => set("parent_world_id", e.target.value)}
              >
                <option value="">— None —</option>
                {(rows as any[])
                  .filter((r) => r.id !== id && !r.archived_at)
                  .map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
              </select>
            </Field>
          </div>
        )}
        <Field label="Public summary">
          <textarea
            className={`${inputCls} min-h-40`}
            value={value.summary_md}
            onChange={(e) => set("summary_md", e.target.value)}
          />
        </Field>
        <Field label="Spoiler-controlled notes">
          <textarea
            className={`${inputCls} min-h-28`}
            value={value.spoiler_md}
            onChange={(e) => set("spoiler_md", e.target.value)}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Status">
            <select
              className={inputCls}
              value={value.status}
              onChange={(e) => set("status", e.target.value)}
            >
              <option value="draft">Draft</option>
              <option value="needs_review">Needs review</option>
              <option value="published">Published</option>
            </select>
          </Field>
          <Field label="Canon status">
            <select
              className={inputCls}
              value={value.canon_status}
              onChange={(e) => set("canon_status", e.target.value)}
            >
              <option value="canon">Canon</option>
              <option value="non-canon">Non-canon</option>
            </select>
          </Field>
        </div>
        <div className="flex flex-wrap justify-between gap-2">
          <div>
            {id && (
              <button
                type="button"
                onClick={toggleArchive}
                className="rounded-md border border-border px-4 py-2 text-sm"
              >
                {current?.archived_at ? "Restore" : "Archive"}
              </button>
            )}
          </div>
          <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            Save changes
          </button>
        </div>
      </form>
      <p className="text-xs text-muted-foreground">
        Character relationships are intentionally not managed or inferred here.
      </p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium">{label}</span>
      {children}
    </label>
  );
}
