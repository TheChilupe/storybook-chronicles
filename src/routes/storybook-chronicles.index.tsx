import { createFileRoute, Link } from "@tanstack/react-router";
import { EntityPage } from "@/components/entity-page";
import { Markdown } from "@/components/markdown";

export const Route = createFileRoute("/storybook-chronicles/")({
  component: StorybookChroniclesHub,
});

const SECTIONS: { to: string; label: string; blurb: string }[] = [
  { to: "/storybook-chronicles", label: "Series Overview", blurb: "The premise, themes, and shape of the saga." },
  { to: "/stories", label: "Stories", blurb: "Main story arcs across the chronicle." },
  { to: "/characters", label: "Characters", blurb: "Heroes, antagonists, and supporting cast." },
  { to: "/factions", label: "Factions", blurb: "Groups, orders, and alliances." },
  { to: "/worlds", label: "Worlds", blurb: "Settings across Earth and the cosmos." },
  { to: "/power-systems", label: "Power Systems", blurb: "The rules that govern abilities and forces." },
  { to: "/storybook-chronicles/timeline", label: "Timeline", blurb: "Key events in chronological order." },
  { to: "/storybook-chronicles/development-process", label: "Development Process", blurb: "How the project is planned and built." },
];

function StorybookChroniclesHub() {
  return (
    <EntityPage title="Storybook Chronicles">
      <p className="mb-6 text-sm uppercase tracking-wider text-muted-foreground">
        Featured portfolio project
      </p>
      <section className="mb-8 rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-3 text-xl font-semibold">Series Overview</h2>
        <Markdown>
          {`Storybook Chronicles is a multigenerational action-fantasy saga about power, faith, legacy, free will, and the danger of false gods. It serves as a case study in long-form creative project management: worldbuilding, character arcs, faction dynamics, and iterative story development.`}
        </Markdown>
      </section>
      <h2 className="mb-4 text-xl font-semibold">Sections</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {SECTIONS.map((s) => (
          <Link
            key={s.to}
            to={s.to as any}
            className="rounded-2xl border border-border bg-card p-5 hover:border-primary"
          >
            <h3 className="text-lg font-semibold">{s.label}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.blurb}</p>
          </Link>
        ))}
      </div>
    </EntityPage>
  );
}