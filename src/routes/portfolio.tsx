import { createFileRoute, Link } from "@tanstack/react-router";
import { EntityPage } from "@/components/entity-page";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — Creative Project Management" },
      { name: "description", content: "Featured creative and project management work." },
    ],
  }),
  component: PortfolioPage,
});

function PortfolioPage() {
  return (
    <EntityPage title="Portfolio">
      <p className="mb-6 text-muted-foreground">
        Featured projects. Storybook Chronicles is the flagship case study.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          to="/storybook-chronicles"
          className="rounded-2xl border border-border bg-card p-5 hover:border-primary"
        >
          <span className="text-xs uppercase text-muted-foreground">Featured project</span>
          <h3 className="mt-1 text-lg font-semibold">Storybook Chronicles</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            A multigenerational action-fantasy saga — worldbuilding, characters, and
            long-form narrative planning.
          </p>
        </Link>
        <div className="rounded-2xl border border-dashed border-border bg-card/50 p-5 text-sm text-muted-foreground">
          More projects coming soon.
        </div>
      </div>
    </EntityPage>
  );
}