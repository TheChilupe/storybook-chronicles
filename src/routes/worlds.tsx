import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { worldsQO } from "@/lib/queries";
import { EntityPage } from "@/components/entity-page";

export const Route = createFileRoute("/worlds")({
  head: () => ({ meta: [{ title: "Worlds — Storybook Codex" }] }),
  component: WorldsPage,
});

function WorldsPage() {
  const { data = [] } = useQuery(worldsQO);
  return (
    <EntityPage title="Worlds">
      {data.length === 0
        ? <p className="text-muted-foreground">No worlds yet. Add them from the Admin page.</p>
        : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {data.map((w: any) => (
              <li key={w.id} className="rounded-xl border border-border bg-card p-4">
                <h3 className="font-semibold">{w.name}</h3>
                <p className="text-sm text-muted-foreground">{w.summary_md?.slice(0, 140)}</p>
              </li>
            ))}
          </ul>
        )}
    </EntityPage>
  );
}