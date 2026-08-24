import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { factionsQO } from "@/lib/queries";
import { EntityPage } from "@/components/entity-page";
import { Markdown } from "@/components/markdown";
import { PublicQueryError } from "@/components/public-query-error";

export const Route = createFileRoute("/factions")({
  head: () => ({ meta: [{ title: "Factions — Storybook Codex" }] }),
  component: FactionsPage,
});

function FactionsPage() {
  const { data = [], isError } = useQuery(factionsQO);
  return (
    <EntityPage title="Factions">
      {isError ? (
        <PublicQueryError content="factions" />
      ) : data.length === 0 ? (
        <p className="text-muted-foreground">No factions yet.</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {data.map((f: any) => (
            <li key={f.id} className="rounded-xl border border-border bg-card p-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                {f.organization_type}
              </p>
              <h3 className="mt-1 font-semibold">
                {f.name}
                {f.abbreviation ? ` (${f.abbreviation})` : ""}
              </h3>
              <div className="mt-2 text-sm text-muted-foreground">
                <Markdown>{f.summary_md ?? ""}</Markdown>
              </div>
            </li>
          ))}
        </ul>
      )}
    </EntityPage>
  );
}
