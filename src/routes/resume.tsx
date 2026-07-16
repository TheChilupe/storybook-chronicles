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

const professionalSummary =
  "Creative Project Manager and product builder with a track record of turning ambiguous ideas into shipped systems. I bridge the gap between creative vision and structured execution — planning roadmaps, coordinating cross-functional stakeholders, and building the tools, docs, and rituals that keep teams aligned. Creator of Storybook Chronicles, a long-form worldbuilding platform that doubles as a live case study in scope management, information architecture, and iterative delivery.";

type ExperienceEntry = {
  role: string;
  company: string;
  period: string;
  location: string;
  bullets: string[];
};

const experience: ExperienceEntry[] = [
  {
    role: "Creator & Project Lead",
    company: "Storybook Chronicles (Independent Project)",
    period: "2023 — Present",
    location: "Remote",
    bullets: [
      "Defined the product vision, information architecture, and content roadmap for a multi-year worldbuilding platform.",
      "Designed the data model, authentication flows, and lore-management workflow; shipped iteratively from concept to a public portfolio site.",
      "Managed scope across writing, design, and engineering workstreams as a single-person team — prioritizing ruthlessly against a public milestone plan.",
    ],
  },
  {
    role: "[DRAFT — Project Manager Role]",
    company: "[Company Name]",
    period: "[Start] — [End]",
    location: "[City, State]",
    bullets: [
      "[Placeholder] Led cross-functional delivery of [initiative] across [teams], hitting [metric] under [constraint].",
      "[Placeholder] Owned roadmap, stakeholder communication, and risk tracking for [product / program].",
      "[Placeholder] Introduced [ritual / tool / process] that reduced [pain] by [measurable outcome].",
    ],
  },
  {
    role: "[DRAFT — Prior Role]",
    company: "[Company Name]",
    period: "[Start] — [End]",
    location: "[City, State]",
    bullets: [
      "[Placeholder] Coordinated [scope] across [stakeholders], delivering [outcome].",
      "[Placeholder] Built [system / process] to improve [metric].",
    ],
  },
];

const education = [
  {
    school: "[DRAFT — Institution Name]",
    credential: "[Degree, Field of Study]",
    period: "[Year] — [Year]",
    note: "[Optional: honors, relevant coursework, or focus area]",
  },
];

const certifications = [
  "[DRAFT] Project Management Professional (PMP) — [Issuer, Year]",
  "[DRAFT] Certified ScrumMaster (CSM) — [Issuer, Year]",
  "[DRAFT] Additional certification — [Issuer, Year]",
];

const technicalSkills = [
  "Notion, Linear, Jira, Asana",
  "Figma, FigJam, Miro",
  "GitHub, Git workflows",
  "Supabase, Postgres basics",
  "TypeScript / React (working literacy)",
  "Airtable, Google Workspace",
];

const pmSkills = [
  "Roadmapping & milestone planning",
  "Scope definition & prioritization",
  "Stakeholder communication",
  "Risk identification & mitigation",
  "Agile / Scrum / Kanban rituals",
  "Documentation & information architecture",
  "Cross-functional facilitation",
  "Product discovery & user research",
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
        {/* Draft notice */}
        <div className="rounded-xl border border-dashed border-border bg-card/40 p-4 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Draft resume.</span>{" "}
          Content marked <span className="font-mono text-xs">[DRAFT]</span> or in{" "}
          <span className="font-mono text-xs">[brackets]</span> is placeholder copy to be replaced with
          verified work history and credentials.
        </div>

        {/* Professional Summary */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold sm:text-3xl">Professional Summary</h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {professionalSummary}
          </p>
        </section>

        {/* Work Experience */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold sm:text-3xl">Work Experience</h2>
          <div className="mt-8 space-y-6">
            {experience.map((job) => (
              <article
                key={`${job.role}-${job.company}`}
                className="rounded-2xl border border-border bg-card p-6 transition hover:border-primary/40 sm:p-8"
              >
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{job.role}</h3>
                    <p className="text-sm text-muted-foreground">{job.company}</p>
                  </div>
                  <div className="text-sm text-muted-foreground sm:text-right">
                    <div>{job.period}</div>
                    <div className="text-xs">{job.location}</div>
                  </div>
                </div>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
                  {job.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* Education & Certifications */}
        <section className="mt-16 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="text-xl font-semibold">Education</h2>
            <div className="mt-4 space-y-4">
              {education.map((e, i) => (
                <div key={i}>
                  <div className="font-medium text-foreground">{e.school}</div>
                  <div className="text-sm text-muted-foreground">{e.credential}</div>
                  <div className="text-xs text-muted-foreground">{e.period}</div>
                  {e.note && (
                    <div className="mt-1 text-xs text-muted-foreground/80">{e.note}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="text-xl font-semibold">Certifications</h2>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {certifications.map((c, i) => (
                <li key={i} className="leading-relaxed">
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Skills */}
        <section className="mt-16 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="text-xl font-semibold">Technical Skills</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {technicalSkills.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-muted-foreground"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="text-xl font-semibold">Project Management Skills</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {pmSkills.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-muted-foreground"
                >
                  {s}
                </span>
              ))}
            </div>
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
