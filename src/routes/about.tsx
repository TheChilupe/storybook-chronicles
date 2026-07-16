import { createFileRoute } from "@tanstack/react-router";
import { EntityPage } from "@/components/entity-page";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Creative Project Management Portfolio" },
      { name: "description", content: "About the creator behind the Storybook Chronicles portfolio." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <EntityPage title="About">
      <p className="text-muted-foreground">
        Placeholder — a short bio and creative philosophy will live here.
      </p>
    </EntityPage>
  );
}