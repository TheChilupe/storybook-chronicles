import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import cloudBg from "@/assets/main-cloud-bg.jpg";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — Creative Project Management Case Studies" },
      {
        name: "description",
        content:
          "Real projects demonstrating Project Management, Product Thinking, AI-assisted workflows, and creative development.",
      },
      { property: "og:title", content: "Portfolio — Creative Project Management Case Studies" },
      {
        property: "og:description",
        content:
          "Storybook Chronicles is the flagship case study in a growing Creative Project Management portfolio.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PortfolioPage,
});

const metrics: { label: string; value: string }[] = [
  { label: "Years in Development", value: "15+" },
  { label: "Stories Planned", value: "4" },
  { label: "Characters Designed", value: "100+" },
  { label: "AI Tools Used", value: "10+" },
  { label: "Documentation", value: "Growing" },
  { label: "Primary PM Tools", value: "ClickUp · Notion · GitHub" },
];

const demonstrates = [
  "Long-term Roadmap Planning",
  "Milestone Tracking",
  "Documentation Systems",
  "AI-assisted Development",
  "Creative Direction",
  "Information Architecture",
  "Tool Evaluation",
  "Budget Management",
  "Scope Management",
  "Continuous Improvement",
];

const skills: { skill: string; demo: string }[] = [
  { skill: "Project Planning", demo: "Multi-year roadmap, milestone planning, release planning" },
  { skill: "Documentation", demo: "Master Lore Index, Notion Wiki, project documentation" },
  { skill: "Information Architecture", demo: "Character database, navigation, knowledge organization" },
  { skill: "AI Workflow Design", demo: "ChatGPT, Claude, Lovable, prompt engineering, iterative development" },
  { skill: "Risk Management", demo: "Scope control, canon consistency, long-term planning" },
  { skill: "GitHub", demo: "Version control and repository management" },
  { skill: "ClickUp", demo: "Task planning, milestone tracking" },
  { skill: "Product Thinking", demo: "Portfolio architecture, UX improvements, prioritization" },
  { skill: "Creative Direction", demo: "Character concepts, visual identity, worldbuilding" },
  { skill: "Concept Art Production", demo: "AI-generated artwork and design iteration" },
  { skill: "Technical Research", demo: "Evaluating AI tools, PM software, and emerging technologies" },
  { skill: "Budget & Scope Management", demo: "Managing subscriptions, software costs, and keeping the project within scope" },
  {
    skill: "Stakeholder Communication",
    demo: "Professional PM experience collaborating with teams, documenting decisions, and communicating project progress",
  },
];

const workflow = [
  "Vision",
  "Research",
  "Planning",
  "Documentation",
  "AI Collaboration",
  "Development",
  "Testing",
  "Iteration",
];

const roadmap: { project: string; status: string; description: string }[] = [
  {
    project: "AI Portfolio Expansion",
    status: "Planning",
    description: "Additional AI-assisted product management case studies across new domains.",
  },
  {
    project: "Interactive Lore Experience",
    status: "Concept",
    description: "Reader-facing interactive layer on top of the Storybook Chronicles codex.",
  },
  {
    project: "Future Product Case Study",
    status: "Coming Soon",
    description: "A dedicated software product case study documented end to end.",
  },
];

function PortfolioPage() {
  return (
    <div className="bg-background text-foreground">
      <SiteHeader />

      {/* Hero */}
      <section
        className="relative overflow-hidden px-6 py-20 sm:py-28"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(11,15,23,0.6), rgba(11,15,23,0.9) 80%, var(--color-background)), url(${cloudBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.7), transparent 60%), radial-gradient(1px 1px at 70% 60%, rgba(255,255,255,0.6), transparent 60%), radial-gradient(1.5px 1.5px at 40% 80%, rgba(255,255,255,0.5), transparent 60%), radial-gradient(1px 1px at 85% 20%, rgba(255,255,255,0.65), transparent 60%), radial-gradient(1px 1px at 10% 75%, rgba(255,255,255,0.55), transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl">
          <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
            Portfolio
          </span>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            Portfolio
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-foreground/80">
            Real projects demonstrating Project Management, Product Thinking,
            AI-assisted workflows, and creative development.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        {/* Featured Project */}
        <section
          className="relative overflow-hidden rounded-3xl border border-border p-8 sm:p-12"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in oklab, var(--color-primary) 14%, var(--color-card)) 0%, var(--color-card) 55%, color-mix(in oklab, var(--color-accent) 10%, var(--color-card)) 100%)",
            backdropFilter: "blur(6px)",
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-40"
            style={{
              background:
                "radial-gradient(circle, color-mix(in oklab, var(--color-primary) 60%, transparent) 0%, transparent 70%)",
            }}
          />
          <span className="relative text-xs uppercase tracking-[0.25em] text-primary">
            Featured Case Study
          </span>
          <h2 className="relative mt-3 text-3xl font-semibold sm:text-4xl">
            Storybook Chronicles
          </h2>
          <p className="relative mt-2 text-lg text-foreground/80">
            A Living Product Management Case Study
          </p>
          <div className="relative mt-6 max-w-3xl space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            <p>
              Storybook Chronicles is my flagship long-term project and serves
              as the foundation of my Creative Project Management portfolio.
            </p>
            <p>
              Originally conceived as a fictional universe, the project has
              evolved into a practical sandbox where I develop and apply
              real-world project management, product development, AI
              collaboration, information architecture, and software delivery
              skills.
            </p>
            <p>
              Every system, workflow, roadmap, and design decision documented
              throughout this website reflects how I approach planning,
              execution, and continuous improvement.
            </p>
            <p>
              As I continue to grow professionally, this portfolio will expand
              with additional projects, but Storybook Chronicles will remain
              the cornerstone that demonstrates my process from vision to
              execution.
            </p>
          </div>
          <div className="relative mt-8 flex flex-wrap gap-3">
            <Link
              to="/storybook-chronicles"
              className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow hover:opacity-90"
            >
              View Case Study
            </Link>
            <Link
              to="/storybook-chronicles"
              className="rounded-md border border-border bg-background/40 px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary"
            >
              Explore Storybook Chronicles
            </Link>
          </div>
        </section>

        {/* Project Metrics */}
        <section className="mt-20">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold sm:text-3xl">Project Metrics</h2>
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              At a glance
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {metrics.map((m) => (
              <div
                key={m.label}
                className="rounded-2xl border border-border bg-card/70 p-6 backdrop-blur transition hover:border-primary/50"
              >
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                  {m.label}
                </dt>
                <dd className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
                  {m.value}
                </dd>
              </div>
            ))}
          </div>
        </section>

        {/* What This Project Demonstrates */}
        <section className="mt-20">
          <h2 className="text-2xl font-semibold sm:text-3xl">
            What This Project Demonstrates
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            This project showcases how I manage a long-term creative product
            while balancing planning, documentation, learning, budgeting,
            scope, and continuous iteration.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {demonstrates.map((d, i) => (
              <div
                key={d}
                className="rounded-2xl border border-border bg-card p-5 transition hover:border-primary/50"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-xs font-semibold text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-base font-semibold">{d}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skills Demonstrated */}
        <section className="mt-20">
          <h2 className="text-2xl font-semibold sm:text-3xl">Skills Demonstrated</h2>
          <p className="mt-4 max-w-3xl text-muted-foreground">
            Concrete evidence of each skill applied through this project.
          </p>
          <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card">
            <div className="hidden grid-cols-[minmax(180px,1fr)_2fr] gap-4 border-b border-border bg-secondary/40 px-6 py-3 text-xs uppercase tracking-wider text-muted-foreground sm:grid">
              <div>Skill</div>
              <div>Demonstrated Through</div>
            </div>
            <ul className="divide-y divide-border">
              {skills.map((s) => (
                <li
                  key={s.skill}
                  className="grid gap-1 px-6 py-4 sm:grid-cols-[minmax(180px,1fr)_2fr] sm:gap-4"
                >
                  <div className="text-sm font-semibold text-foreground">{s.skill}</div>
                  <div className="text-sm text-muted-foreground">{s.demo}</div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Workflow */}
        <section className="mt-20">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold sm:text-3xl">How I Build Products</h2>
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Workflow
            </span>
          </div>
          <div className="relative">
            <div
              aria-hidden
              className="absolute left-4 top-4 bottom-4 w-px bg-gradient-to-b from-primary/60 via-border to-primary/20 lg:left-0 lg:right-0 lg:top-1/2 lg:h-px lg:w-full lg:bg-gradient-to-r"
            />
            <ol className="relative grid gap-4 lg:grid-cols-8">
              {workflow.map((step, i) => (
                <li key={step} className="relative">
                  <div className="flex items-center gap-4 rounded-2xl border border-border bg-card/80 p-4 backdrop-blur transition hover:border-primary/60 lg:flex-col lg:items-start">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/50 bg-primary/15 text-xs font-semibold text-primary">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm font-semibold text-foreground">{step}</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Future Roadmap */}
        <section className="mt-20">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold sm:text-3xl">Looking Ahead</h2>
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Roadmap
            </span>
          </div>
          <p className="max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Storybook Chronicles is only the beginning. Future projects will
            expand this portfolio into a broader collection of project
            management case studies, AI-assisted workflows, software
            development projects, and creative experiments that continue
            strengthening both my technical and leadership skills.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {roadmap.map((r) => (
              <div
                key={r.project}
                className="relative overflow-hidden rounded-2xl border border-dashed border-border bg-card/40 p-6 transition hover:border-primary/40"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    Upcoming
                  </span>
                  <span className="rounded-full border border-primary/40 bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                    {r.status}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-semibold">{r.project}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{r.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Closing CTA */}
        <section className="mt-20 rounded-2xl border border-border bg-card p-8 text-center sm:p-12">
          <h2 className="text-2xl font-semibold sm:text-3xl">
            Want the full story?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Dive into the flagship case study, review my resume, or get in
            touch about creative and project management work.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/storybook-chronicles"
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              View Case Study
            </Link>
            <Link
              to="/resume"
              className="rounded-md border border-border px-4 py-2 text-sm font-semibold hover:bg-secondary"
            >
              Resume
            </Link>
            <Link
              to="/contact"
              className="rounded-md border border-border px-4 py-2 text-sm font-semibold hover:bg-secondary"
            >
              Contact
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}