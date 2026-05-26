import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { storiesQO } from "@/lib/queries";
import { EntityPage } from "@/components/entity-page";

export const Route = createFileRoute("/stories")({
  head: () => ({ meta: [{ title: "Stories — Storybook Codex" }] }),
  component: StoriesIndex,
});

function StoriesIndex() {
  const { data = [] } = useQuery(storiesQO);
  return (
    <EntityPage title="Stories">
      <div className="grid gap-4 sm:grid-cols-2">
        {data.map((s) => (
          <Link key={s.id} to={"/stories/$slug" as any} params={{ slug: s.slug } as any}
            className="rounded-2xl border border-border bg-card p-5 hover:border-primary">
            <span className="text-xs uppercase text-muted-foreground">Story {s.number}</span>
            <h3 className="mt-1 text-lg font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.tagline}</p>
          </Link>
        ))}
      </div>
    </EntityPage>
  );
}