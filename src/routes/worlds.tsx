import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { locationsQO } from "@/lib/queries";
import { EntityPage } from "@/components/entity-page";
import { Markdown } from "@/components/markdown";
import { PublicQueryError } from "@/components/public-query-error";

export const Route = createFileRoute("/worlds")({
  head: () => ({ meta: [{ title: "Locations — Storybook Codex" }] }),
  component: LocationsPage,
});

export function LocationsPage() {
  const { data = [], isError } = useQuery(locationsQO);
  return (
    <EntityPage title="Locations">
      <p className="mb-6 text-muted-foreground">
        Cities, districts, landmarks, facilities, hidden regions, planets, realms, and other
        settings across Storybook Chronicles.
      </p>
      {isError ? (
        <PublicQueryError content="locations" />
      ) : data.length === 0 ? (
        <p className="text-muted-foreground">No locations yet.</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {data.map((w: any) => (
            <li key={w.id} className="rounded-xl border border-border bg-card p-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                {w.location_type}
                {w.parent?.name ? ` · ${w.parent.name}` : ""}
              </p>
              <h3 className="mt-1 font-semibold">{w.name}</h3>
              <div className="mt-2 text-sm text-muted-foreground">
                <Markdown>{w.summary_md ?? ""}</Markdown>
              </div>
            </li>
          ))}
        </ul>
      )}
    </EntityPage>
  );
}
