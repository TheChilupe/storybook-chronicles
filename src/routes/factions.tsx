import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { factionsQO } from "@/lib/queries";
import { EntityPage } from "@/components/entity-page";

export const Route = createFileRoute("/factions")({
  head: () => ({ meta: [{ title: "Factions — Storybook Codex" }] }),
  component: FactionsPage,
});

function FactionsPage() {
  const { data = [] } = useQuery(factionsQO);
  return (
    <EntityPage title="Factions">
      {data.length === 0
        ? <p className="text-muted-foreground">No factions yet. Add them from the Admin page.</p>
        : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {data.map((f: any) => (
              <li key={f.id} className="rounded-xl border border-border bg-card p-4">
                <h3 className="font-semibold">{f.name}</h3>
                <p className="text-sm text-muted-foreground">{f.summary_md?.slice(0, 140)}</p>
              </li>
            ))}
          </ul>
        )}
    </EntityPage>
  );
}