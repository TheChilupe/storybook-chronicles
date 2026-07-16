import { createFileRoute } from "@tanstack/react-router";
import { EntityPage } from "@/components/entity-page";

export const Route = createFileRoute("/resume")({
  head: () => ({
    meta: [
      { title: "Resume — Creative Project Management Portfolio" },
      { name: "description", content: "Resume and experience." },
    ],
  }),
  component: ResumePage,
});

function ResumePage() {
  return (
    <EntityPage title="Resume">
      <p className="text-muted-foreground">Placeholder — resume content coming soon.</p>
    </EntityPage>
  );
}