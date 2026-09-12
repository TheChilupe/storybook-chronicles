const findings = [
  {
    area: "Public route rendering",
    category: "Functional",
    priority: "High",
    finding:
      "A nested story route did not consistently render its expected child content.",
    action:
      "Correct route composition and verify direct navigation and refresh behavior.",
  },
  {
    area: "Unknown URL handling",
    category: "Navigation / Auth",
    priority: "High",
    finding:
      "Invalid public URLs could enter an owner-authentication path instead of resolving cleanly.",
    action:
      "Separate public 404 behavior from protected owner-route handling.",
  },
  {
    area: "Legacy route cleanup",
    category: "Content",
    priority: "Medium",
    finding:
      "Older portfolio routes and content required cleanup as the V2 information architecture evolved.",
    action:
      "Retire, redirect, or refresh legacy surfaces before establishing the stable baseline.",
  },
  {
    area: "Owner return-path behavior",
    category: "Authentication",
    priority: "Medium",
    finding:
      "Protected navigation required additional validation around post-authentication return paths.",
    action:
      "Verify owner sign-in redirects only to intended protected destinations.",
  },
  {
    area: "Responsive navigation",
    category: "Responsive UX",
    priority: "Medium",
    finding:
      "Header behavior required additional testing at narrower mobile widths.",
    action:
      "Validate navigation spacing, wrapping, and interaction across target breakpoints.",
  },
  {
    area: "Media optimization",
    category: "Performance",
    priority: "Low",
    finding:
      "Several visual assets could be optimized further for production delivery.",
    action:
      "Compress large images and review media-loading behavior during the final performance pass.",
  },
];

function PriorityBadge({ priority }: { priority: string }) {
  const styles =
    priority === "High"
      ? "border-red-500/30 bg-red-500/10 text-red-300"
      : priority === "Medium"
        ? "border-amber-500/30 bg-amber-500/10 text-amber-200"
        : "border-border bg-secondary/50 text-muted-foreground";

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${styles}`}
    >
      {priority}
    </span>
  );
}

export function QaReviewArtifact() {
  return (
    <article className="mx-auto max-w-6xl rounded-xl border border-border bg-background px-5 py-8 shadow-sm sm:px-8 sm:py-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        Quality, Governance & Risk
      </p>

      <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
        Production QA Review
      </h1>

      <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">
        A structured production-readiness review used to evaluate the deployed
        Storybook Chronicles website before establishing a stable V2 baseline.
        The review combines functional testing, access-control checks,
        responsive validation, release risk, and follow-up actions.
      </p>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card/70 p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Environment
          </p>
          <p className="mt-2 font-semibold">Production</p>
        </div>

        <div className="rounded-xl border border-border bg-card/70 p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Deployment
          </p>
          <p className="mt-2 font-semibold">Vercel</p>
        </div>

        <div className="rounded-xl border border-border bg-card/70 p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Review type
          </p>
          <p className="mt-2 font-semibold">Release Readiness</p>
        </div>

        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Initial disposition
          </p>
          <p className="mt-2 font-semibold text-red-300">
            Stabilization Required
          </p>
        </div>
      </section>

      <section className="mt-10">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Review Findings
          </p>

          <h2 className="mt-2 text-xl font-semibold sm:text-2xl">
            Defects, Risks & Follow-Up
          </h2>

          <p className="mt-3 leading-7 text-muted-foreground">
            Findings are translated into concrete stabilization actions rather
            than treated as isolated defects.
          </p>
        </div>

        <div className="mt-6 hidden overflow-hidden rounded-2xl border border-border lg:block">
          <table className="w-full border-collapse text-left">
            <thead className="bg-secondary/50">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                  Area
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                  Category
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                  Priority
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                  Finding
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                  Response
                </th>
              </tr>
            </thead>

            <tbody>
              {findings.map((item) => (
                <tr
                  key={item.area}
                  className="border-t border-border align-top"
                >
                  <td className="px-4 py-4 text-sm font-semibold">
                    {item.area}
                  </td>
                  <td className="px-4 py-4 text-sm text-muted-foreground">
                    {item.category}
                  </td>
                  <td className="px-4 py-4">
                    <PriorityBadge priority={item.priority} />
                  </td>
                  <td className="px-4 py-4 text-sm leading-relaxed text-muted-foreground">
                    {item.finding}
                  </td>
                  <td className="px-4 py-4 text-sm leading-relaxed text-muted-foreground">
                    {item.action}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 grid gap-4 lg:hidden">
          {findings.map((item) => (
            <section
              key={item.area}
              className="rounded-2xl border border-border bg-card/70 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{item.area}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.category}
                  </p>
                </div>

                <PriorityBadge priority={item.priority} />
              </div>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {item.finding}
              </p>

              <div className="mt-4 border-t border-border pt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  Response
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.action}
                </p>
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-primary/30 bg-primary/5 p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          QA Decision Framework
        </p>

        <p className="mt-3 leading-7">
          Deploy → Inspect → Identify Risk → Prioritize → Stabilize → Re-test →
          Establish Baseline
        </p>
      </section>

      <p className="mt-8 border-t border-border pt-5 text-xs leading-relaxed text-muted-foreground">
        This portfolio artifact summarizes an internal Storybook Chronicles QA
        exercise. Sensitive implementation details and unnecessary internal
        data have been excluded.
      </p>
    </article>
  );
}
