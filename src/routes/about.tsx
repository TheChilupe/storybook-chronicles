import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import cloudBg from "@/assets/main-cloud-bg.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Alexander Chilupe — Project Manager & Creative Builder" },
      {
        name: "description",
        content:
          "Meet Alexander Chilupe, an Implementation Project Manager and creative builder based in Cleveland, Ohio.",
      },
      {
        property: "og:title",
        content: "About Alexander Chilupe — Project Manager & Creative Builder",
      },
      {
        property: "og:description",
        content:
          "Project management, product thinking, software literacy, AI-assisted workflows, and the story behind Storybook Chronicles.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: AboutPage,
});

const resumeUrl = "/Alexander_Chilupe_2026_Resume_Public.pdf";
const chapters = [
  [
    "Project Management",
    "Project management was not originally the career path I expected, but it taught me how organizations turn ideas into outcomes. It developed how I plan, coordinate, communicate with stakeholders, manage risk, and translate complexity into actionable work through implementation and delivery.",
  ],
  [
    "Software Development",
    "After college, I wanted a skill that allowed me to build things directly. I completed a Software Developer Certificate through We Can Code IT. Software development became technical literacy: a way to communicate with technical teams, understand architecture and implementation constraints, prototype ideas, and work more effectively across technical projects.",
  ],
  [
    "Product",
    "Product became the name for a skillset I had already been practicing. Through Storybook Chronicles and independent projects, I became increasingly interested in product thinking, user experience, information architecture, and systems design. I discovered that I enjoy not only creating ideas, but structuring, preserving, maintaining, and growing them.",
  ],
  [
    "AI-Assisted Workflows",
    "AI is not merely a convenience. I use AI-assisted workflows to reduce the time, production effort, and upfront cost required to prototype ideas across concept art, software, webpages, product concepts, writing systems, research, planning, and animation experiments.",
  ],
] as const;
const career = [
  ["Current", "June 2026 — Present", "Implementation Project Manager", "ECHO Health, Inc."],
  ["Previous", "October 2023 — June 2026", "Project Manager", "Blue Technologies Smart Solutions"],
  [
    "Independent",
    "January 2025 — Present",
    "Independent Project Manager / Automation Consultant",
    "Independent",
  ],
] as const;
const credentials = [
  [
    "Bachelor of Business Administration",
    "Marketing & Communication Minor",
    "Malone University · Canton, Ohio",
    "May 2022",
  ],
  ["Certified iManage Project Manager", "Professional credential", "", ""],
  ["PMP Exam Preparation", "35 contact hours completed", "", ""],
  ["Software Developer Certificate", "We Can Code IT", "", "August 2023"],
] as const;
const skillPath = [
  "Business",
  "Project Management",
  "Software",
  "Product",
  "AI",
  "Creative Systems",
];
const labSkills = [
  "Project management",
  "Product thinking",
  "Information architecture",
  "AI-assisted development",
  "Software",
  "Visual direction",
  "Creative operations",
  "Storytelling",
  "Long-term knowledge management",
];

function Heading({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <h2 className="text-2xl font-semibold sm:text-3xl">{children}</h2>
      <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
    </div>
  );
}

function AboutPage() {
  return (
    <div className="bg-background text-foreground">
      <SiteHeader />
      <section
        className="relative overflow-hidden px-6 py-20 sm:py-28 lg:py-32"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(11,15,23,.52), rgba(11,15,23,.92) 82%, var(--color-background)), url(${cloudBg})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,.7), transparent 60%), radial-gradient(1px 1px at 70% 60%, rgba(255,255,255,.6), transparent 60%), radial-gradient(1.5px 1.5px at 40% 80%, rgba(255,255,255,.5), transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl">
          <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
            About · Cleveland, Ohio
          </span>
          <h1 className="mt-5 text-4xl font-bold sm:text-6xl">Alexander Chilupe</h1>
          <p className="mt-4 text-lg font-medium text-primary sm:text-2xl">
            Implementation Project Manager / Creative Project Manager
          </p>
          <p className="mt-8 max-w-3xl text-xl font-medium leading-relaxed sm:text-2xl">
            Professionally a Project Manager, personally a creative builder.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-foreground/80 sm:text-lg">
            My background spans business, project management, software development, product
            thinking, AI-assisted workflows, and creative development. I enjoy organizing complex
            ideas, building practical systems, learning technology, and turning ambitious ideas into
            something structured and usable.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <External href={resumeUrl} primary>
              View Resume
            </External>
            <External href="https://www.linkedin.com/in/alexander-chilupe-64a89313b/">
              LinkedIn
            </External>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <section>
          <Heading label="My story">The disciplines that shaped how I work</Heading>
          <div className="grid gap-x-10 gap-y-5 lg:grid-cols-2">
            {chapters.map(([title, body], i) => (
              <article
                key={title}
                className="border-t border-border py-6 sm:grid sm:grid-cols-[3rem_1fr] sm:gap-4"
              >
                <span className="text-sm font-semibold text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="mt-2 text-xl font-semibold sm:mt-0">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
                    {body}
                  </p>
                </div>
              </article>
            ))}
          </div>
          <blockquote className="mt-8 rounded-2xl border border-primary/30 bg-primary/10 p-6 text-base leading-relaxed text-foreground/90 sm:p-8 sm:text-lg">
            “AI-assisted workflows let me prototype ideas that would otherwise require significantly
            more time, specialized labor, or upfront cost. I do not see AI as replacing expertise. I
            use it to shorten the distance between an idea and the point where expert collaboration
            becomes valuable.”
          </blockquote>
        </section>

        <section className="mt-20">
          <Heading label="Career journey">From implementation to product thinking</Heading>
          <p className="max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            My work has progressed across healthcare payments, enterprise technology implementation,
            cloud and document-management implementations, automation, and cross-functional
            delivery. The common thread is helping teams move complex work toward a clear, usable
            outcome.
          </p>
          <ol className="mt-8 overflow-hidden rounded-2xl border border-border bg-card">
            {career.map(([label, period, role, company]) => (
              <li
                key={role}
                className="grid gap-2 border-b border-border p-6 last:border-b-0 sm:grid-cols-[minmax(10rem,.8fr)_1.2fr] sm:gap-8"
              >
                <div>
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    {label}
                  </span>
                  <p className="mt-1 text-sm text-primary">{period}</p>
                </div>
                <div>
                  <h3 className="font-semibold">{role}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{company}</p>
                </div>
              </li>
            ))}
          </ol>
          <External href={resumeUrl} className="mt-6">
            View Full Resume
          </External>
        </section>

        <section className="mt-20">
          <Heading label="Education & credentials">Foundations and continued learning</Heading>
          <div className="grid gap-4 sm:grid-cols-2">
            {credentials.map(([title, detail, institution, date]) => (
              <article key={title} className="rounded-2xl border border-border bg-card p-6">
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{detail}</p>
                {institution && <p className="mt-1 text-sm text-muted-foreground">{institution}</p>}
                {date && (
                  <p className="mt-4 text-xs uppercase tracking-wider text-primary">{date}</p>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <Heading label="Skills I’ve collected">An overlapping set of perspectives</Heading>
          <p className="max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            I see my path less as a traditional ladder and more as an accumulation of useful
            perspectives. These disciplines increasingly overlap in how I understand problems, guide
            projects, and build practical systems.
          </p>
          <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            {skillPath.map((skill, i) => (
              <li key={skill} className="rounded-xl border border-border bg-card p-4 lg:min-h-28">
                <span className="text-xs font-semibold text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-2 text-sm font-semibold">{skill}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-20 overflow-hidden rounded-2xl border border-border bg-card p-7 sm:p-10">
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            What I’m building
          </span>
          <div className="mt-4 grid gap-8 lg:grid-cols-[1.1fr_.9fr] lg:gap-12">
            <div>
              <h2 className="text-3xl font-semibold sm:text-4xl">Storybook Chronicles</h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                Storybook Chronicles is my long-term personal laboratory: an interconnected creative
                IP and digital product ecosystem that I am building, organizing, and maintaining
                over time. It is where creative work meets the systems needed to preserve and grow
                it.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to="/storybook-chronicles"
                  className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
                >
                  Explore Storybook Chronicles
                </Link>
                <Link
                  to="/portfolio"
                  className="rounded-md border border-border px-4 py-2 text-sm font-semibold hover:bg-secondary"
                >
                  View Portfolio
                </Link>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Practiced through the project
              </p>
              <ul className="mt-4 grid gap-x-5 sm:grid-cols-2">
                {labSkills.map((skill) => (
                  <li key={skill} className="border-t border-border py-3 text-sm">
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-20 grid overflow-hidden rounded-2xl border border-border bg-card lg:grid-cols-[.85fr_1.15fr]">
          <div className="border-b border-border p-7 sm:p-10 lg:border-r lg:border-b-0">
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Resume</span>
            <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">Professional experience</h2>
            <External href={resumeUrl} primary className="mt-6">
              View Resume
            </External>
          </div>
          <p className="p-7 text-base leading-relaxed text-muted-foreground sm:p-10 sm:text-lg">
            Implementation Project Manager leading client-facing technology implementations across
            healthcare payments, enterprise document management, cloud migrations, and automation.
            Experienced in project planning, stakeholder coordination, requirements, UAT, go-live,
            change, dependencies, and cross-functional delivery.
          </p>
        </section>

        <section className="mt-20 rounded-2xl border border-border bg-card p-8 text-center sm:p-12">
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Cleveland, Ohio
          </span>
          <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
            Let’s build something ambitious.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Reach out to discuss thoughtful implementation, creative systems, product ideas, or the
            work behind Storybook Chronicles.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a
              href="mailto:thechilupe@gmail.com"
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Email
            </a>
            <External href="https://www.linkedin.com/in/alexander-chilupe-64a89313b/">
              LinkedIn
            </External>
            <External href="https://github.com/TheChilupe">GitHub</External>
            <External href={resumeUrl}>View Resume</External>
          </div>
        </section>
      </main>
    </div>
  );
}

function External({
  href,
  primary = false,
  className = "",
  children,
}: {
  href: string;
  primary?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex rounded-md px-4 py-2 text-sm font-semibold ${primary ? "bg-primary text-primary-foreground hover:opacity-90" : "border border-border hover:bg-secondary"} ${className}`}
    >
      {children}
    </a>
  );
}
