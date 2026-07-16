import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import cloudBg from "@/assets/main-cloud-bg.jpg";

export const Route = createFileRoute("/resume")({
  head: () => ({
    meta: [
      { title: "Resume — Creative Project Management Portfolio" },
      {
        name: "description",
        content:
          "Professional resume summary for Alexander Chilupe — Creative Project Manager, product builder, and creator of Storybook Chronicles.",
      },
      {
        property: "og:title",
        content: "Resume — Creative Project Management Portfolio",
      },
      {
        property: "og:description",
        content:
          "Professional resume summary for Alexander Chilupe — Creative Project Manager, product builder, and creator of Storybook Chronicles.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ResumePage,
});

const placeholderSections = [
  {
    title: "Professional Summary",
    body: "A brief overview of my career focus, strengths, and what I bring to project management and creative product teams. (To be populated from my official resume.)",
  },
  {
    title: "Work Experience",
    body: "Detailed roles, responsibilities, and achievements from my professional history. (To be populated from my official resume.)",
  },
  {
    title: "Education",
    body: "Academic background, degrees, and relevant coursework. (To be populated from my official resume.)",
  },
  {
    title: "Certifications",
    body: "Professional certifications, training, and credentials. (To be populated from my official resume.)",
  },
  {
    title: "Technical Skills",
    body: "Software, tools, and technical competencies relevant to project management and product development. (To be populated from my official resume.)",
  },
  {
    title: "Project Management Skills",
    body: "Core PM competencies such as planning, risk management, stakeholder communication, and agile practices. (To be populated from my official resume.)",
  },
];

function ResumePage() {
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
            Resume
          </span>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            Resume
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-foreground/80">
            A summary of my professional experience, project management journey, and technical skills.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
        {/* Professional Experience */}
        <section>
          <h2 className="text-2xl font-semibold sm:text-3xl">Professional Experience</h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            This page highlights my professional background and complements the project work showcased
            throughout this portfolio. A downloadable PDF version of my resume will also be available.
          </p>
        </section>

        {/* Placeholder Sections */}
        <section className="mt-16">
          <div className="grid gap-6 sm:grid-cols-2">
            {placeholderSections.map((section) => (
              <div
                key={section.title}
                className="rounded-2xl border border-border bg-card p-6 transition hover:border-primary/40"
              >
                <h3 className="text-lg font-semibold text-foreground">{section.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{section.body}</p>
                <div className="mt-4 inline-flex items-center rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-muted-foreground">
                  Awaiting final resume content
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Resume Actions */}
        <section className="mt-16 rounded-2xl border border-border bg-card p-8 sm:p-12">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold sm:text-3xl">Download My Resume</h2>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                A PDF version of my full resume will be available here once finalized. Replace the
                placeholder link below with the actual file URL.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow hover:opacity-90"
              >
                Download Resume
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-md border border-border bg-background/40 px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary"
              >
                Contact Me
              </Link>
            </div>
          </div>
        </section>

        {/* Closing Statement */}
        <section className="mt-16 text-center">
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Interested in learning more about my experience or discussing future opportunities? Feel
            free to reach out through the Contact page.
          </p>
          <div className="mt-6">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-md border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary"
            >
              Get in Touch
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
