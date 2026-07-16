import { createFileRoute } from "@tanstack/react-router";
import { EntityPage } from "@/components/entity-page";

export const Route = createFileRoute("/storybook-chronicles/development-process")({
  head: () => ({ meta: [{ title: "Development Process — Storybook Chronicles" }] }),
  component: DevelopmentProcessPage,
});

function DevelopmentProcessPage() {
  return (
    <EntityPage title="Development Process">
      <p className="text-muted-foreground">
        Placeholder — planning workflow, tools, and iteration notes coming soon.
      </p>
    </EntityPage>
  );
}