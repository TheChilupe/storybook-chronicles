import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { powerSystemsQO } from "@/lib/queries";
import { EntityPage } from "@/components/entity-page";

export const Route = createFileRoute("/power-systems")({
  head: () => ({ meta: [{ title: "Power Systems — Storybook Codex" }] }),
  component: PowersPage,
});

function PowersPage() {
  const { data = [] } = useQuery(powerSystemsQO);
  return (
    <EntityPage title="Power Systems">
      {data.length === 0
        ? <p className="text-muted-foreground">No power systems yet. Add them from the Admin page.</p>
        : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {data.map((p: any) => (
              <li key={p.id} className="rounded-xl border border-border bg-card p-4">
                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-sm text-muted-foreground">{p.summary_md?.slice(0, 140)}</p>
              </li>
            ))}
          </ul>
        )}
    </EntityPage>
  );
}