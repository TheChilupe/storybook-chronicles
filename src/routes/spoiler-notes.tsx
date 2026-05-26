import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { spoilerNotesQO } from "@/lib/queries";
import { EntityPage } from "@/components/entity-page";
import { Markdown } from "@/components/markdown";
import { useSpoilers } from "@/lib/spoilers";

export const Route = createFileRoute("/spoiler-notes")({
  head: () => ({ meta: [{ title: "Spoiler Notes — Storybook Codex" }] }),
  component: SpoilerNotesPage,
});

function SpoilerNotesPage() {
  const { data = [] } = useQuery(spoilerNotesQO);
  const { global, setGlobal } = useSpoilers();
  return (
    <EntityPage title="Spoiler Notes">
      <div className="mb-4">
        <button onClick={() => setGlobal(!global)} className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-secondary">
          {global ? "Hide all spoilers" : "Reveal all spoilers"}
        </button>
      </div>
      {data.length === 0
        ? <p className="text-muted-foreground">No spoiler notes yet.</p>
        : (
          <div className="space-y-4">
            {data.map((n: any) => (
              <article key={n.id} className="spoiler-box">
                <h2 className="mb-2 text-lg font-semibold">{n.title}</h2>
                {global ? <Markdown>{n.body_md ?? ""}</Markdown> : <p className="text-sm text-muted-foreground">Hidden.</p>}
              </article>
            ))}
          </div>
        )}
    </EntityPage>
  );
}