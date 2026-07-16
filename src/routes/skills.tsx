import { createFileRoute } from "@tanstack/react-router";
import { EntityPage } from "@/components/entity-page";

export const Route = createFileRoute("/skills")({
  head: () => ({
    meta: [
      { title: "Skills — Creative Project Management Portfolio" },
      { name: "description", content: "Skills and capabilities." },
    ],
  }),
  component: SkillsPage,
});

function SkillsPage() {
  return (
    <EntityPage title="Skills">
      <p className="text-muted-foreground">Placeholder — skills matrix coming soon.</p>
    </EntityPage>
  );
}