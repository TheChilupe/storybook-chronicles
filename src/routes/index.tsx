import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import cloudBg from "@/assets/main-cloud-bg.jpg";
import logo from "@/assets/logo-white.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Alexander Chilupe — Creative Project Manager" },
      {
        name: "description",
        content:
          "Alexander Chilupe — Creative Project Manager focused on AI-assisted product development, information architecture, and long-term creative systems.",
      },
      { property: "og:title", content: "Alexander Chilupe — Creative Project Manager" },
      {
        property: "og:description",
        content:
          "Portfolio of Alexander Chilupe. Flagship case study: the Storybook Chronicles Codex.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const capabilities = [
  {
    title: "Project Management",
    body: "Scoping, roadmaps, milestones, and delivery for creative and technical work — end to end.",
  },
  {
    title: "Product & Information Architecture",
    body: "Turning sprawling ideas into structured systems, taxonomies, and navigable digital products.",
  },
  {
    title: "AI-Assisted Workflows",
    body: "Using ChatGPT, Claude, and Lovable as force multipliers across planning, writing, and shipping.",
  },
  {
    title: "Creative Development",
    body: "Worldbuilding, narrative design, and long-form creative systems that scale across years of work.",
  },
];

const process = [
  "Vision",
  "Discovery",
  "Planning",
  "Architecture",
  "Build",
  "Test",
  "Iterate",
];

function Index() {
  return (
    <div className="bg-background text-foreground">
      <SiteHeader />

      {/* Hero */}
      <section
        className="relative overflow-hidden px-6 py-24 sm:py-32"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(11,15,23,0.55), rgba(11,15,23,0.9) 80%, var(--color-background)), url(${cloudBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.7), transparent 60%), radial-gradient(1px 1px at 70% 60%, rgba(255,255,255,0.6), transparent 60%), radial-gradient(1.5px 1.5px at 40% 80%, rgba(255,255,255,0.5), transparent 60%), radial-gradient(1px 1px at 85% 20%, rgba(255,255,255,0.65), transparent 60%), radial-gradient(1px 1px at 10% 75%, rgba(255,255,255,0.55), transparent 60%)",
          }}
        />
        <div className="relative mx-auto flex max-w-5xl flex-col items-start gap-6">
          <img
            src={logo}
            alt=""
            className="h-16 w-16 drop-shadow-[0_0_35px_rgba(120,170,255,0.5)]"
          />
          <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
            Portfolio
          </span>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Alexander Chilupe
          </h1>
          <p className="text-xl font-medium text-primary sm:text-2xl">
            Creative Project Manager
          </p>
          <p className="max-w-2xl text-base text-foreground/80 sm:text-lg">
            AI-assisted product development, information architecture, and
            long-term creative systems — helping ambitious ideas become
            structured, shippable products.
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            <Link
              to="/portfolio"
              className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow hover:opacity-90"
            >
              View My Work
            </Link>
            <Link
              to="/storybook-chronicles"
              className="rounded-md border border-border bg-background/40 px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary"
            >
              Explore Storybook Chronicles
            </Link>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-20">
        {/* Featured Project */}
        <section className="rounded-2xl border border-border bg-card p-8 sm:p-10">
          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Featured Case Study
            </span>
            <h2 className="text-3xl font-semibold sm:text-4xl">
              Storybook Chronicles Codex
            </h2>
            <p className="max-w-3xl text-lg text-muted-foreground">
              Turning an interconnected fictional universe into a structured
              digital product.
            </p>
          </div>

          <dl className="mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                Role
              </dt>
              <dd className="mt-1 text-sm text-foreground/90">
                Creator · Product Owner · Project Manager · Information Architect
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                Tools
              </dt>
              <dd className="mt-1 flex flex-wrap gap-2">
                {["Notion", "ChatGPT", "Claude", "Lovable", "GitHub", "VS Code", "Supabase"].map(
                  (t) => (
                    <span
                      key={t}
                      className="rounded-full border border-border bg-background px-2.5 py-0.5 text-xs text-foreground/80"
                    >
                      {t}
                    </span>
                  ),
                )}
              </dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/storybook-chronicles"
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              View Case Study
            </Link>
            <Link
              to="/stories"
              className="rounded-md border border-border px-4 py-2 text-sm font-semibold hover:bg-secondary"
            >
              Explore the Codex
            </Link>
          </div>
        </section>

        {/* Core Capabilities */}
        <section className="mt-20">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold sm:text-3xl">Core Capabilities</h2>
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              What I do
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {capabilities.map((c) => (
              <div
                key={c.title}
                className="rounded-2xl border border-border bg-card p-6 transition hover:border-primary/60"
              >
                <h3 className="text-lg font-semibold">{c.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{c.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Process */}
        <section className="mt-20">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold sm:text-3xl">Process</h2>
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              How I work
            </span>
          </div>
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-3">
            {process.map((step, i) => (
              <li key={step} className="flex items-center gap-2">
                <span className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium">
                  <span className="mr-2 text-xs text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {step}
                </span>
                {i < process.length - 1 && (
                  <span aria-hidden className="text-muted-foreground">
                    →
                  </span>
                )}
              </li>
            ))}
          </ol>
        </section>

        {/* Closing CTA */}
        <section className="mt-20 rounded-2xl border border-border bg-card p-8 text-center sm:p-12">
          <h2 className="text-2xl font-semibold sm:text-3xl">Let's build something ambitious.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Explore the full portfolio, read my resume, or get in touch to
            discuss creative and project management work.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/portfolio"
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              View Portfolio
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
