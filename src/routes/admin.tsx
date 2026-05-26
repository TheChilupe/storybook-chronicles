import { createFileRoute } from "@tanstack/react-router";
import { EntityPage } from "@/components/entity-page";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Storybook Codex" }] }),
  component: () => (
    <EntityPage title="Admin">
      <p className="text-muted-foreground">
        Editor coming next. For now you can manage stories, characters, factions, worlds, power systems, and spoiler notes directly from the database in Cloud — every page on this site reads live.
      </p>
    </EntityPage>
  ),
});