import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { charactersQO } from "@/lib/queries";
import { EntityPage } from "@/components/entity-page";

export const Route = createFileRoute("/characters")({
  head: () => ({ meta: [{ title: "Characters — Storybook Codex" }] }),
  component: CharactersIndex,
});

function CharactersIndex() {
  const { data = [] } = useQuery(charactersQO);
  return (
    <EntityPage title="Characters">
      <p className="mb-6 text-muted-foreground">Browse the cast across the Storybook Chronicles.</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((c) => (
          <Link key={c.id} to={"/characters/$slug" as any} params={{ slug: c.slug } as any}
            className="rounded-2xl border border-border bg-card p-5 hover:border-primary"
            style={{ borderTop: `4px solid ${c.accent_color}` }}>
            {c.eyebrow && <span className="text-xs uppercase text-muted-foreground">{c.eyebrow}</span>}
            <h3 className="mt-1 text-lg font-semibold">{c.name}{c.alias ? ` / ${c.alias}` : ""}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{c.tagline}</p>
          </Link>
        ))}
      </div>
    </EntityPage>
  );
}