import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import cloudBg from "@/assets/main-cloud-bg.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About the Builder — Alexander Chilupe" },
      {
        name: "description",
        content:
          "Meet Alexander Chilupe — a Creative Project Manager, creative builder, and creator of Storybook Chronicles.",
      },
      {
        property: "og:title",
        content: "About the Builder — Alexander Chilupe",
      },
      {
        property: "og:description",
        content:
          "Meet Alexander Chilupe — a Creative Project Manager, creative builder, and creator of Storybook Chronicles.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: AboutPage,
});

const quickFacts = [
  { label: "Location", value: "Ohio" },
  { label: "Profession", value: "Project Manager" },
  { label: "Education", value: "Business Administration" },
  { label: "Certification Goal", value: "PMP Candidate" },
  { label: "Focus", value: "Creative Product Management" },
  { label: "Specialty", value: "AI-Assisted Workflows" },
  { label: "Interests", value: "Game Design, Worldbuilding, Product Development" },
  {
    label: "Tools",
    value: ["ClickUp", "Notion", "GitHub", "Lovable", "Claude", "ChatGPT", "VS Code", "Supabase"],
  },
];

const timeline = [
  {
    year: "2010",
    text: "Began creating the earliest version of Storybook Chronicles with my younger brother.",
  },
  {
    year: "2023",
    text: "Transitioned into professional Project Management and began applying structured delivery practices to my work.",
  },
  {
    year: "2024",
    text: "Started documenting Storybook Chronicles as an organized long-term creative project.",
  },
  {
    year: "2025",
    text: "Expanded the project into a formal codex, lore database, and digital product concept.",
  },
  {
    year: "2026",
    text: "Began building a Creative Project Management portfolio using Storybook Chronicles as the flagship case study.",
  },
];

function AboutPage() {
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
        <div className="relative mx-auto max-w-5xl">
          <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
            About the Builder
          </span>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            I turn ambitious ideas into structured, achievable projects.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-foreground/80">
            I'm a Project Manager and creative builder with a background in business and software
            development. I enjoy organizing complex ideas, designing practical systems, and using
            technology and AI-assisted workflows to move projects from vision to execution.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
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

      <main className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
        {/* My Story */}
        <section>
          <h2 className="text-2xl font-semibold sm:text-3xl">Where Storybook Chronicles Began</h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Storybook Chronicles began years ago as a simple idea shared between my younger brother
            and me. We spent countless hours imagining worlds, characters, and adventures inspired by
            the stories we loved growing up.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Because we are nine years apart, the project became more than a creative hobby. It became
            something we could build together and a way to bridge the gap between us.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Over time, the project grew far beyond storytelling. It became my personal laboratory
            for learning product management, AI-assisted development, information architecture,
            worldbuilding, and long-term project planning.
          </p>
        </section>

        {/* What the Website Represents */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold sm:text-3xl">From Passion Project to Digital Product</h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            This website represents that journey. It showcases not only the universe I am creating,
            but also the systems, workflows, and technical skills I have developed while bringing it
            to life.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            My goal is to build products that combine creativity with thoughtful execution. Whether
            managing software projects professionally or designing an original fictional universe, I
            enjoy solving complex problems, organizing information, and turning ideas into experiences
            people can explore.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Storybook Chronicles is the flagship project that ties those passions together, and this
            website marks the first major step toward turning a lifelong vision into something
            tangible.
          </p>
        </section>

        {/* Quick Facts */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold sm:text-3xl">Quick Facts</h2>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            {quickFacts.map((fact) => (
              <div
                key={fact.label}
                className="rounded-xl border border-border bg-card p-5 transition hover:border-primary/40"
              >
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                  {fact.label}
                </dt>
                <dd className="mt-2">
                  {Array.isArray(fact.value) ? (
                    <div className="flex flex-wrap gap-2">
                      {fact.value.map((v) => (
                        <span
                          key={v}
                          className="rounded-full border border-border bg-background px-2.5 py-0.5 text-xs text-foreground/80"
                        >
                          {v}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm font-medium text-foreground">{fact.value}</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* My Philosophy */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold sm:text-3xl">How I Approach Complex Work</h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            I believe the best projects begin with a compelling vision, but succeed because of
            thoughtful planning and consistent execution.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Storybook Chronicles has taught me that large goals are not completed in a single
            leap. They are built one milestone at a time through clear priorities, documentation,
            testing, feedback, and iteration.
          </p>
        </section>

        {/* Journey Timeline */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold sm:text-3xl">My Journey</h2>
          <div className="relative mt-8 pl-8">
            <div className="absolute left-[5px] top-2 bottom-2 w-px bg-border" />
            {timeline.map((item) => (
              <div key={item.year} className="relative pb-10 last:pb-0">
                <div className="absolute -left-[1px] top-1.5 h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
                <div className="flex flex-col gap-1 pl-6 sm:flex-row sm:gap-6">
                  <span className="min-w-[4rem] text-base font-semibold text-primary">
                    {item.year}
                  </span>
                  <p className="text-base text-foreground/90">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Closing CTA */}
        <section className="mt-20 rounded-2xl border border-border bg-card p-8 text-center sm:p-12">
          <h2 className="text-2xl font-semibold sm:text-3xl">Building the Next Chapter</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            I am continuing to develop Storybook Chronicles while strengthening my skills in
            project management, product thinking, AI-assisted development, and digital creation.
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
              View Resume
            </Link>
            <Link
              to="/contact"
              className="rounded-md border border-border px-4 py-2 text-sm font-semibold hover:bg-secondary"
            >
              Contact Me
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
