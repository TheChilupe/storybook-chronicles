import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowUp,
  Blocks,
  Bot,
  Boxes,
  BriefcaseBusiness,
  CheckCircle2,
  Network,
  Palette,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import cloudBg from "@/assets/main-cloud-bg.jpg";

type Capability = {
  id: string;
  title: string;
  nav: string;
  description: string;
  icon: LucideIcon;
  capabilities: string[];
  evidence?: string[];
  tools?: string[];
};

export const Route = createFileRoute("/skills")({
  head: () => ({
    meta: [
      { title: "Skills & Capabilities — Alexander Chilupe" },
      {
        name: "description",
        content:
          "Project management, AI engineering, creative direction, information architecture, and full-stack delivery capabilities.",
      },
      { property: "og:title", content: "Skills & Capabilities — Alexander Chilupe" },
      {
        property: "og:description",
        content:
          "A practical capability dashboard grounded in real Storybook Chronicles projects and workflows.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: SkillsPage,
});

const sections: Capability[] = [
  {
    id: "project-product-management",
    title: "Project & Product Management",
    nav: "Shape priorities, scope, and delivery from idea to release.",
    icon: BriefcaseBusiness,
    description:
      "I translate ambitious ideas into clear requirements, sequenced work, and practical delivery plans that can adapt as the product evolves.",
    capabilities: [
      "Project planning",
      "Requirements definition",
      "Scope management",
      "Risk identification",
      "Stakeholder management",
      "Roadmapping",
      "Prioritization",
      "Iterative delivery",
      "Documentation",
      "Change management",
    ],
    evidence: [
      "Storybook Chronicles multi-phase roadmap",
      "Admin V0.1 → V0.2 planning",
      "Canon governance",
      "Staging → production workflow",
      "Website backlog and technical-debt prioritization",
    ],
    tools: ["Notion", "ClickUp", "GitHub", "Vercel", "Supabase", "ChatGPT", "Claude / Codex"],
  },
  {
    id: "ai-engineering-development",
    title: "AI Engineering & Development",
    nav: "Use AI as a disciplined partner across the build lifecycle.",
    icon: Bot,
    description:
      "I combine product judgment and AI-assisted workflows to move from requirements to working software, review the output, and improve it through deliberate iteration.",
    capabilities: [
      "AI-assisted prototyping",
      "Prompt-driven development",
      "Requirements-to-implementation translation",
      "AI-assisted debugging",
      "Code review",
      "Technical decision-making",
      "Workflow orchestration",
      "Iterative feature development",
    ],
    evidence: [
      "Storybook Codex",
      "Admin portal",
      "Supabase database",
      "Authentication",
      "Vercel deployment",
      "Love Letter",
    ],
    tools: [
      "ChatGPT",
      "Claude / Codex",
      "React",
      "TypeScript",
      "TanStack",
      "Supabase",
      "GitHub",
      "Vercel",
    ],
  },
  {
    id: "ai-creative-direction",
    title: "AI Creative Direction",
    nav: "Turn narrative intent into governed visual exploration.",
    icon: Palette,
    description:
      "I direct AI-assisted visual development through clear briefs, controlled exploration, human evaluation, and canon-aware approval decisions.",
    capabilities: [
      "AI-assisted creative direction",
      "Character visual development",
      "Creative brief development",
      "Prompt design",
      "Reference-image development",
      "Design critique",
      "Iterative visual QA",
      "Visual canon management",
      "Asset governance",
      "Visual storytelling",
      "Motion prototyping",
    ],
    tools: ["ChatGPT Image", "Midjourney", "ChatGPT", "Claude / Codex"],
  },
  {
    id: "information-architecture",
    title: "Information Architecture",
    nav: "Model complex knowledge so people can find and trust it.",
    icon: Network,
    description:
      "I design structures, relationships, and editorial states that make large bodies of interconnected content understandable and maintainable.",
    capabilities: [
      "Content modeling",
      "Taxonomy design",
      "Relational data modeling",
      "Information hierarchy",
      "Editorial workflows",
      "Search/filter design",
      "Content lifecycle management",
      "Knowledge-system architecture",
    ],
    evidence: [
      "Master Lore Index",
      "Characters / stories / factions / locations / powers relationships",
      "Canon / non-canon classification",
      "Draft / Imported / Needs Review / Published / Archived lifecycle",
      "Structured spoiler system",
      "Private Storybook Codex",
    ],
  },
  {
    id: "full-stack-delivery",
    title: "Full-Stack Delivery",
    nav: "Build responsive products across interface, data, and deployment.",
    icon: Blocks,
    description:
      "I deliver complete product slices, connecting responsive interfaces to secure data, authentication, migrations, and production infrastructure.",
    capabilities: [
      "Frontend development",
      "Database design",
      "Authentication",
      "CRUD workflows",
      "Responsive UI",
      "Backend integration",
      "Schema migrations",
      "Deployment",
      "Access-control design",
      "Debugging",
    ],
    tools: [
      "React",
      "TypeScript",
      "TanStack Start",
      "TanStack Router",
      "TanStack Query",
      "Tailwind CSS",
      "Supabase",
      "PostgreSQL",
      "Vercel",
      "Git",
      "GitHub",
    ],
  },
  {
    id: "creative-operations",
    title: "Creative Operations",
    nav: "Create the systems that keep creative work moving coherently.",
    icon: Boxes,
    description:
      "I build lightweight operating systems that preserve decisions, organize assets, coordinate workstreams, and support a creative project over time.",
    capabilities: [
      "Documentation systems",
      "Asset organization",
      "Version tracking",
      "Canon governance",
      "Decision documentation",
      "Creative backlog management",
      "Cross-workstream coordination",
      "Long-term IP planning",
    ],
    evidence: [
      "Master Lore Index",
      "Story development workspaces",
      "Art Department",
      "Website architecture guide",
      "Character bibles",
      "Story skeletons",
      "Visual canon",
    ],
  },
  {
    id: "quality-governance-risk",
    title: "Quality, Governance & Risk",
    nav: "Protect quality, privacy, consistency, and release confidence.",
    icon: ShieldCheck,
    description:
      "I make quality and governance part of delivery by defining checks, surfacing risk early, and verifying that releases preserve both technical and content integrity.",
    capabilities: [
      "QA",
      "Acceptance criteria",
      "Risk management",
      "Data governance",
      "Privacy/security thinking",
      "Canon consistency",
      "Technical-debt identification",
      "Release verification",
    ],
    evidence: [
      "96-assertion canonical-data verifier",
      "RLS",
      "Staged deployments",
      "Spoiler controls",
      "Migration verification",
      "Auth and environment troubleshooting",
    ],
  },
];

const workflow = [
  "Narrative Requirement",
  "Creative Brief",
  "Reference Development",
  "Controlled Generation",
  "Human Evaluation",
  "Iteration",
  "Approved Asset",
  "Visual Canon",
  "Motion / Environment Experimentation",
];
const toolGroups = [
  { title: "Project & Knowledge", tools: ["Notion", "ClickUp", "GitHub"] },
  { title: "AI", tools: ["ChatGPT", "ChatGPT Image", "Claude / Codex", "Midjourney"] },
  {
    title: "Development",
    tools: [
      "React",
      "TypeScript",
      "TanStack",
      "Tailwind CSS",
      "Supabase",
      "PostgreSQL",
      "Vercel",
      "Git",
    ],
  },
  {
    title: "Creative",
    tools: ["Midjourney", "ChatGPT Image", "Creative briefs", "Reference images"],
  },
];

function CreativeDetails() {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border bg-card/70 p-5 sm:p-6">
        <h3 className="text-sm font-semibold">From story requirement to visual canon</h3>
        <ol
          className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3"
          aria-label="AI creative direction workflow"
        >
          {workflow.map((step, i) => (
            <li
              key={step}
              className="flex min-w-0 items-center gap-2 rounded-lg border border-border bg-background/50 px-3 py-2.5 text-sm"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>
      <aside
        className="rounded-2xl border border-primary/30 bg-primary/5 p-5 sm:p-6"
        aria-labelledby="room-title"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Example · Room
        </p>
        <h3 id="room-title" className="mt-2 text-lg font-semibold">
          Designing anonymity into a recognizable silhouette
        </h3>
        <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-semibold">Problem</dt>
            <dd className="mt-1 leading-relaxed text-muted-foreground">
              An anonymous teleporter whose greatest defense is being difficult to identify.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Design requirements</dt>
            <dd className="mt-1 leading-relaxed text-muted-foreground">
              Concealed face, minimal identifiable features, subdued palette, recognizable
              silhouette.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Iteration</dt>
            <dd className="mt-1 leading-relaxed text-muted-foreground">
              An unexpected long-coat variation strengthened the silhouette.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">QA</dt>
            <dd className="mt-1 leading-relaxed text-muted-foreground">
              The motion prototype worked generally; teleportation behavior still needed refinement.
            </dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}

function CapabilitySection({ section }: { section: Capability }) {
  const Icon = section.icon;
  return (
    <section
      id={section.id}
      aria-labelledby={`${section.id}-title`}
      className="scroll-mt-24 border-t border-border pt-12 sm:pt-16"
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-12">
        <div>
          <div className="flex items-center gap-3 text-primary">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/10">
              <Icon aria-hidden="true" className="h-5 w-5" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.2em]">
              Capability area
            </span>
          </div>
          <h2 id={`${section.id}-title`} className="mt-5 text-2xl font-semibold sm:text-3xl">
            {section.title}
          </h2>
          <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">What I do: </span>
            {section.description}
          </p>
        </div>
        <div className="space-y-6">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Capabilities
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2" aria-label={`${section.title} capabilities`}>
              {section.capabilities.map((x) => (
                <li
                  key={x}
                  className="rounded-full border border-border bg-card px-3 py-1.5 text-sm text-foreground/90"
                >
                  {x}
                </li>
              ))}
            </ul>
          </div>
          {section.evidence && (
            <div className="rounded-2xl border border-border bg-card/70 p-5 sm:p-6">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-primary" />
                Evidence in practice
              </h3>
              <ul className="mt-4 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                {section.evidence.map((x) => (
                  <li key={x} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70"
                    />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {section.id === "ai-creative-direction" && <CreativeDetails />}
          {section.tools && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Tools used
              </h3>
              <ul className="mt-3 flex flex-wrap gap-2" aria-label={`${section.title} tools`}>
                {section.tools.map((x) => (
                  <li
                    key={x}
                    className="rounded-full bg-secondary px-2.5 py-1 text-xs text-muted-foreground"
                  >
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const update = () => setVisible(window.scrollY > 600);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return (
    <a
      href="#top"
      aria-label="Back to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`fixed bottom-4 right-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card/95 shadow-lg backdrop-blur transition-all hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:bottom-6 sm:right-6 ${visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"}`}
    >
      <ArrowUp aria-hidden="true" className="h-4 w-4" />
    </a>
  );
}

function SkillsPage() {
  return (
    <div id="top" className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <header
        className="relative overflow-hidden px-5 py-16 sm:px-6 sm:py-24"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(11,15,23,0.58), rgba(11,15,23,0.92) 82%, var(--color-background)), url(${cloudBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,color-mix(in_oklab,var(--color-primary)_20%,transparent),transparent_38%)]"
        />
        <div className="relative mx-auto max-w-6xl">
          <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
            How I work
          </span>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold sm:text-5xl">Skills & Capabilities</h1>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-foreground/80 sm:text-lg">
            I use project management, product thinking, software development, generative AI,
            information architecture, and creative-direction workflows to turn complex ideas into
            structured, working products.
          </p>
          <a
            href="#capability-dashboard"
            className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-md border border-border bg-background/40 px-4 py-2 text-sm font-semibold hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Explore capabilities <ArrowDown aria-hidden="true" className="h-4 w-4" />
          </a>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-12 sm:px-6 sm:py-16">
        <section
          id="capability-dashboard"
          aria-labelledby="dashboard-title"
          className="scroll-mt-24"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Capability dashboard
          </p>
          <h2 id="dashboard-title" className="mt-3 text-2xl font-semibold sm:text-3xl">
            Explore the work behind the work
          </h2>
          <p className="mt-3 text-muted-foreground">
            Jump to a capability area to see the methods, evidence, and tools behind it.
          </p>
          <nav
            className="mt-8 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-3"
            aria-label="Skills and capability sections"
          >
            {sections.map((s) => {
              const Icon = s.icon;
              return (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="group flex min-h-32 flex-col rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="flex items-start justify-between">
                    <Icon aria-hidden="true" className="h-5 w-5 text-primary" />
                    <ArrowDown
                      aria-hidden="true"
                      className="h-4 w-4 text-muted-foreground group-hover:text-primary"
                    />
                  </div>
                  <span className="mt-4 text-sm font-semibold leading-snug">{s.title}</span>
                  <span className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {s.nav}
                  </span>
                </a>
              );
            })}
          </nav>
        </section>
        <div className="mt-16 space-y-14 sm:mt-20 sm:space-y-20">
          {sections.map((s) => (
            <CapabilitySection key={s.id} section={s} />
          ))}
        </div>
        <section
          aria-labelledby="tools-title"
          className="mt-20 border-t border-border pt-12 sm:mt-24 sm:pt-16"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Toolbox</p>
          <h2 id="tools-title" className="mt-3 text-2xl font-semibold sm:text-3xl">
            Tools I&apos;ve Worked With
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Tools support the work; the capability is choosing and applying them with purpose.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {toolGroups.map((g) => (
              <div key={g.title} className="rounded-2xl border border-border bg-card/60 p-5">
                <h3 className="text-sm font-semibold">{g.title}</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {g.tools.map((x) => (
                    <li
                      key={x}
                      className="rounded-full bg-secondary px-2.5 py-1 text-xs text-muted-foreground"
                    >
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>
      <BackToTop />
    </div>
  );
}
