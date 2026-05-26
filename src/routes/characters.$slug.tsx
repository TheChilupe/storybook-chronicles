import { createFileRoute, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { characterQO } from "@/lib/queries";
import { EntityPage } from "@/components/entity-page";
import { Markdown } from "@/components/markdown";
import { SpoilerSection } from "@/components/spoiler-section";

export const Route = createFileRoute("/characters/$slug")({
  component: CharPage,
});

function CharPage() {
  const { slug } = Route.useParams();
  const { data: c } = useQuery(characterQO(slug));
  if (c === null) throw notFound();
  if (!c) return <EntityPage title="Loading…"><p /></EntityPage>;
  return (
    <EntityPage title={`${c.name}${c.alias ? ` / ${c.alias}` : ""}`}>
      <div className="rounded-2xl border border-border bg-card p-6" style={{ borderTop: `4px solid ${c.accent_color}` }}>
        {c.eyebrow && <p className="text-xs uppercase tracking-wider text-muted-foreground">{c.eyebrow}</p>}
        <p className="mt-2 text-lg text-muted-foreground">{c.tagline}</p>
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