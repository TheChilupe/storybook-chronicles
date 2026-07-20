import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { adminCharactersQO } from "@/lib/queries";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { data: rows = [], isLoading } = useQuery(adminCharactersQO);

  const active = rows.filter((r) => !r.archived_at);
  const total = active.length;
  const published = active.filter((r) => r.status === "published").length;
  const drafts = active.filter((r) => r.status === "draft" || r.status === "imported").length;
  const needsReview = active.filter((r) => r.status === "needs_review").length;
  const archived = rows.length - active.length;

  const cards = [
    { label: "Total characters", value: total },
    { label: "Published", value: published },
    { label: "Drafts", value: drafts },
    { label: "Needs review", value: needsReview },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold sm:text-3xl">Admin dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review and publish structured Codex content. This portal is owner-only.
        </p>
      </header>

      <section aria-label="Overview" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{c.label}</p>
            <p className="mt-2 text-3xl font-semibold">
              {isLoading ? "…" : c.value}
            </p>
          </div>
        ))}
      </section>

      {archived > 0 && (
        <p className="text-xs text-muted-foreground">{archived} archived character{archived === 1 ? "" : "s"}.</p>
      )}

      <section aria-label="Manage content" className="grid gap-3 sm:grid-cols-2">
        <Link
          to="/admin/characters"
          className="group rounded-2xl border border-border bg-card p-5 transition hover:border-primary"
        >
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Characters</p>
          <p className="mt-1 text-lg font-semibold">Manage characters →</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Search, filter, edit, publish, and archive character profiles.
          </p>
        </Link>
        {[
          { label: "Stories", note: "Coming later" },
          { label: "Factions", note: "Coming later" },
          { label: "Worlds", note: "Coming later" },
          { label: "Power systems", note: "Coming later" },
          { label: "Timeline", note: "Coming later" },
        ].map((f) => (
          <div
            key={f.label}
            className="rounded-2xl border border-dashed border-border bg-card/60 p-5 opacity-70"
            aria-disabled="true"
          >
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{f.label}</p>
            <p className="mt-1 text-lg font-semibold text-muted-foreground">{f.note}</p>
          </div>
        ))}
      </section>
    </div>
  );
}