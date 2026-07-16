import { createFileRoute } from "@tanstack/react-router";
import { EntityPage } from "@/components/entity-page";

export const Route = createFileRoute("/storybook-chronicles/timeline")({
  head: () => ({ meta: [{ title: "Timeline — Storybook Chronicles" }] }),
  component: TimelinePage,
});

function TimelinePage() {
  return (
    <EntityPage title="Timeline">
      <p className="text-muted-foreground">
        Placeholder — chronological event timeline coming soon.
      </p>
    </EntityPage>
  );
}