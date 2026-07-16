import { createFileRoute } from "@tanstack/react-router";
import { EntityPage } from "@/components/entity-page";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Creative Project Management Portfolio" },
      { name: "description", content: "Get in touch." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <EntityPage title="Contact">
      <p className="text-muted-foreground">Placeholder — contact form / links coming soon.</p>
    </EntityPage>
  );
}