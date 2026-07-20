import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { adminCharactersQO, adminStoriesLiteQO, type AdminCharacterRow } from "@/lib/queries";

export const Route = createFileRoute("/admin/characters/")({
  component: AdminCharactersList,
});

const STATUS_LABEL: Record<string, string> = {
  draft: "Draft",
  imported: "Imported",
  needs_review: "Needs review",
  published: "Published",
};

const STATUS_TONE: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  imported: "bg-amber-500/15 text-amber-500",
  needs_review: "bg-orange-500/15 text-orange-500",
  published: "bg-emerald-500/15 text-emerald-500",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_TONE[status] ?? "bg-muted text-muted-foreground"}`}>
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}

function AdminCharactersList() {
  const navigate = useNavigate();
  const { data: rows = [], isLoading } = useQuery(adminCharactersQO);
  const { data: stories = [] } = useQuery(adminStoriesLiteQO);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [storyFilter, setStoryFilter] = useState<string>("all");
  const [canonFilter, setCanonFilter] = useState<string>("all");
  const [showArchived, setShowArchived] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (rows as AdminCharacterRow[]).filter((r) => {
      if (!showArchived && r.archived_at) return false;
      if (showArchived && !r.archived_at) return false;
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (canonFilter !== "all" && r.canon_status !== canonFilter) return false;
      if (storyFilter !== "all" && r.primary_story?.id !== storyFilter) return false;
      if (q) {
        const hay = `${r.name} ${r.alias ?? ""} ${r.slug}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [rows, search, statusFilter, storyFilter, canonFilter, showArchived]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">Characters</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isLoading ? "Loading…" : `${filtered.length} of ${rows.length} character${rows.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate({ to: "/admin/characters/new" })}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          + Create character
        </button>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block text-sm">
            <span className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">Search</span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Name, alias, or slug"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">Status</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="all">All statuses</option>
              <option value="draft">Draft</option>
              <option value="imported">Imported</option>
              <option value="needs_review">Needs review</option>
              <option value="published">Published</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">Canon</span>
            <select
              value={canonFilter}
              onChange={(e) => setCanonFilter(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="all">All</option>
              <option value="canon">Canon</option>
              <option value="non-canon">Non-canon</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">Primary story</span>
            <select
              value={storyFilter}
              onChange={(e) => setStoryFilter(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="all">All stories</option>
              {stories.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.number != null ? `${s.number}. ${s.title}` : s.title}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="mt-3 inline-flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={showArchived}
            onChange={(e) => setShowArchived(e.target.checked)}
            className="h-4 w-4"
          />
          Show archived only
        </label>
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-2xl border border-border bg-card md:block">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Character</th>
              <th className="px-4 py-3 text-left">Slug</th>
              <th className="px-4 py-3 text-left">Primary story</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Canon</th>
              <th className="px-4 py-3 text-left">Updated</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Thumb r={r} />
                    <div className="min-w-0">
                      <div className="truncate font-medium">{r.name}</div>
                      {r.alias && (
                        <div className="truncate text-xs text-muted-foreground">{r.alias}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{r.slug}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {r.primary_story
                    ? r.primary_story.number != null
                      ? `${r.primary_story.number}. ${r.primary_story.title}`
                      : r.primary_story.title
                    : "—"}
                </td>
                <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                <td className="px-4 py-3 text-muted-foreground">{r.canon_status}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {new Date(r.updated_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    to="/admin/characters/$id"
                    params={{ id: r.id }}
                    className="rounded-md border border-border px-3 py-1.5 text-xs hover:bg-secondary"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {!isLoading && filtered.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-muted-foreground">No characters match these filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="grid gap-3 md:hidden">
        {filtered.map((r) => (
          <Link
            key={r.id}
            to="/admin/characters/$id"
            params={{ id: r.id }}
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 transition hover:border-primary"
          >
            <Thumb r={r} />
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium">{r.name}</div>
              <div className="truncate text-xs text-muted-foreground">{r.alias || r.slug}</div>
              <div className="mt-1 flex items-center gap-2">
                <StatusBadge status={r.status} />
                <span className="text-xs text-muted-foreground">
                  {new Date(r.updated_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Link>
        ))}
        {!isLoading && filtered.length === 0 && (
          <div className="rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
            No characters match these filters.
          </div>
        )}
      </div>
    </div>
  );
}

function Thumb({ r }: { r: AdminCharacterRow }) {
  const accent = r.accent_color ?? "#2563eb";
  if (r.portrait_url) {
    return (
      <img
        src={r.portrait_url}
        alt=""
        className="h-12 w-12 shrink-0 rounded-md object-cover"
        loading="lazy"
      />
    );
  }
  const initials = (r.alias || r.name || "?").split(/\s+/).slice(0, 2).map((s) => s[0]).join("").toUpperCase();
  return (
    <div
      className="grid h-12 w-12 shrink-0 place-items-center rounded-md text-sm font-semibold text-white"
      style={{ backgroundColor: accent }}
    >
      {initials}
    </div>
  );
}