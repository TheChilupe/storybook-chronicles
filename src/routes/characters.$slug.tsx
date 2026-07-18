import { createFileRoute, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { characterQO } from "@/lib/queries";
import { toCharacterModel, storyLabel } from "@/lib/character-model";
import { EntityPage } from "@/components/entity-page";
import { Markdown } from "@/components/markdown";
import { SpoilerSection } from "@/components/spoiler-section";

export const Route = createFileRoute("/characters/$slug")({
  component: CharPage,
});

function CharPage() {
  const { slug } = Route.useParams();
  const { data: row } = useQuery(characterQO(slug));
  if (row === null) throw notFound();
  if (!row) return <EntityPage title="Loading…"><p /></EntityPage>;
  const c = row;
  const m = toCharacterModel(c);
  const primaryLabel = storyLabel(m.primaryStory);
  return (
    <EntityPage title={`${c.name}${c.alias ? ` / ${c.alias}` : ""}`}>
      <div className="rounded-2xl border border-border bg-card p-6 flex gap-6 items-start" style={{ borderTop: `4px solid ${m.accent ?? "hsl(var(--primary))"}` }}>
        <div
          className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted"
          style={m.portraitUrl ? undefined : { backgroundColor: m.accent ?? "hsl(var(--primary))" }}
        >
          {m.portraitUrl ? (
            <img src={m.portraitUrl} alt={`${c.name} portrait`} className="h-full w-full object-cover" />
          ) : (
            <span className="text-2xl font-semibold text-white/95">{m.initials}</span>
          )}
        </div>
        <div className="flex-1">
          {c.eyebrow && <p className="text-xs uppercase tracking-wider text-muted-foreground">{c.eyebrow}</p>}
          {c.tagline && <p className="mt-2 text-lg text-muted-foreground">{c.tagline}</p>}
          {(primaryLabel || m.factions.length > 0 || m.powers.length > 0) && (
            <dl className="mt-4 grid gap-2 text-sm">
              {primaryLabel && (
                <div className="flex gap-2"><dt className="text-muted-foreground">Primary story:</dt><dd>{primaryLabel}</dd></div>
              )}
              {m.factions.length > 0 && (
                <div className="flex gap-2"><dt className="text-muted-foreground">Factions:</dt><dd>{m.factions.map((f) => f.name).join(", ")}</dd></div>
              )}
              {m.powers.length > 0 && (
                <div className="flex gap-2"><dt className="text-muted-foreground">Powers:</dt><dd>{m.powers.map((p) => p.name).join(", ")}</dd></div>
              )}
            </dl>
          )}
        </div>
      </div>
      {c.canon_summary_md && (
        <section className="mt-6 rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-2 text-lg font-semibold">Canon Summary</h2>
          <Markdown>{c.canon_summary_md}</Markdown>
        </section>
      )}
      {c.identity_md && (
        <section className="mt-4 rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-2 text-lg font-semibold">Character Identity</h2>
          <Markdown>{c.identity_md}</Markdown>
        </section>
      )}
      {c.story_role_md && (
        <section className="mt-4 rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-2 text-lg font-semibold">Story Role</h2>
          <Markdown>{c.story_role_md}</Markdown>
        </section>
      )}
      <SpoilerSection scope={`char-${c.slug}`} body={c.spoiler_md ?? ""} />
    </EntityPage>
  );
}