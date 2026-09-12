export type EvidenceArtifact = {
  id: string;
  title: string;
  category: string;
  summary: string;
  skills: string[];
  preview: string;
  source: string;
  document?: string;
  documentLabel?: string;
};

export const skillsEvidence: EvidenceArtifact[] = [
  {
    id: "product-development-program",
    title: "Product Development Program",
    category: "Project & Product Management",
    summary:
      "A retrospective product roadmap showing the evolution of Storybook Chronicles from concept architecture and prototyping through engineering migration, public release, creative production, and V2 expansion.",
    skills: [
      "Roadmapping",
      "Prioritization",
      "Phased delivery",
      "Dependency planning",
      "Release planning",
    ],
    preview:
      "/portfolio/skills/clickup/product-development-program.png",
    source: "ClickUp",
  },
  {
    id: "engineering-migration",
    title: "Engineering Migration & Deployment Ownership",
    category: "Technical Delivery",
    summary:
      "Migration from an early hosted prototype into an owned development workflow centered on VS Code, GitHub, TanStack, Nitro, and Vercel.",
    skills: [
      "Technical project migration",
      "Environment strategy",
      "Source control",
      "Deployment architecture",
      "Risk reduction",
    ],
    preview:
      "/portfolio/skills/clickup/engineering-migration-preview.png",
    document:
      "/portfolio/skills/clickup/engineering-migration.pdf",
    documentLabel: "View project artifact",
    source: "ClickUp",
  },
  {
    id: "backend-publishing-architecture",
    title: "Backend, Data & Publishing Architecture",
    category: "Information Architecture & Technical Delivery",
    summary:
      "A controlled publishing architecture connecting private knowledge development, canon review, structured Supabase data, local verification, source control, and hosted rollout.",
    skills: [
      "Data governance",
      "Backend planning",
      "Migration workflow",
      "Technical QA",
      "Release discipline",
    ],
    preview:
      "/portfolio/skills/clickup/backend-architecture-preview.png",
    document:
      "/portfolio/skills/clickup/backend-publishing-architecture.pdf",
    documentLabel: "View project artifact",
    source: "ClickUp",
  },
  {
    id: "website-v2-roadmap",
    title: "Storybook Chronicles Website V2 Roadmap",
    category: "Product Planning",
    summary:
      "A phased product roadmap covering stabilization, information architecture, experience design, media strategy, creator tooling, mobile workflows, and final release QA.",
    skills: [
      "Product strategy",
      "Scope control",
      "Roadmapping",
      "Prioritization",
      "Incremental delivery",
    ],
    preview:
      "/portfolio/skills/notion/website-v2-roadmap-preview.png",
    source: "Notion",
  },
  {
    id: "art-department",
    title: "Storybook Chronicles Art Department",
    category: "AI Creative Direction & Creative Operations",
    summary:
      "A visual-development operating system for house style, character design, prompt standards, production priorities, revision rules, and visual-canon governance.",
    skills: [
      "Creative direction",
      "Prompt design",
      "Visual governance",
      "Asset systems",
      "Production planning",
    ],
    preview:
      "/portfolio/skills/notion/art-department-preview.png",
    source: "Notion",
  },
  {
    id: "production-qa-review",
    title: "Production QA Review",
    category: "Quality, Governance & Risk",
    summary:
      "A structured production review covering public routes, owner protections, responsive behavior, data access, release defects, and stabilization decisions.",
    skills: [
      "Quality assurance",
      "Risk identification",
      "Release verification",
      "Security review",
      "Defect management",
    ],
    preview:
      "/portfolio/skills/qa/production-qa-review.png",
    source: "Notion",
  },
  {
    id: "source-migration-retrospective",
    title: "Source Migration V2 Retrospective",
    category: "Information Architecture & Governance",
    summary:
      "A completed source-management initiative covering audit, consolidation, architecture definition, migration, verification, and documentation.",
    skills: [
      "Knowledge management",
      "Source governance",
      "Information architecture",
      "Process improvement",
      "Verification",
    ],
    preview:
      "/portfolio/skills/qa/source-migration-retrospective.png",
    source: "ClickUp",
  },
];
