const lifecycle = [
  {
    step: "01",
    title: "Initiation & Discovery",
    details: [
      "Confirm objectives and implementation scope",
      "Identify stakeholders and decision owners",
      "Establish requirements and delivery expectations",
    ],
  },
  {
    step: "02",
    title: "Design & Requirements",
    details: [
      "Translate business needs into implementation requirements",
      "Document dependencies and integration considerations",
      "Coordinate design review and approval decisions",
    ],
  },
  {
    step: "03",
    title: "Configuration & Migration",
    details: [
      "Sequence configuration and migration activities",
      "Coordinate technical dependencies and environments",
      "Track milestone readiness and implementation risks",
    ],
  },
  {
    step: "04",
    title: "Testing & Issue Resolution",
    details: [
      "Coordinate validation and user acceptance testing",
      "Track defects, decisions, and remediation",
      "Evaluate readiness risks before release",
    ],
  },
  {
    step: "05",
    title: "Training & Go-Live",
    details: [
      "Coordinate training and stakeholder readiness",
      "Manage cutover and go-live activities",
      "Confirm launch criteria and ownership",
    ],
  },
  {
    step: "06",
    title: "Production Support & Lessons Learned",
    details: [
      "Monitor stabilization after launch",
      "Coordinate issue follow-up and transition",
      "Capture lessons learned for future delivery",
    ],
  },
];

const controls = [
  "Schedule & Milestones",
  "Dependencies",
  "Risks & Issues",
  "Stakeholder Coordination",
  "Readiness Decisions",
];

export function ProfessionalDeliveryPreview() {
  return (
    <div className="flex h-full w-full flex-col justify-center bg-background px-4 py-5 sm:px-6">
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
        Professional Delivery
      </p>

      <p className="mt-2 text-sm font-semibold leading-snug sm:text-base">
        Enterprise Cloud Migration
      </p>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {lifecycle.map((item) => (
          <div
            key={item.step}
            className="rounded-lg border border-border bg-card/70 px-2 py-2 text-center"
          >
            <span className="text-[10px] font-bold text-primary">
              {item.step}
            </span>
            <p className="mt-1 text-[9px] leading-tight text-muted-foreground sm:text-[10px]">
              {item.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProfessionalDeliveryArtifact() {
  return (
    <article className="mx-auto max-w-5xl rounded-xl border border-border bg-background px-5 py-8 shadow-sm sm:px-8 sm:py-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        Professional Technical Delivery
      </p>

      <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
        Enterprise Cloud Migration Delivery Lifecycle
      </h1>

      <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">
        A portfolio-safe reconstruction of a completed professional implementation
        lifecycle, showing how project management connects discovery, requirements,
        technical execution, testing, training, release readiness, and post-launch
        support.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {lifecycle.map((item) => (
          <section
            key={item.step}
            className="rounded-2xl border border-border bg-card/70 p-5"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {item.step}
              </span>

              <h2 className="font-semibold leading-snug">
                {item.title}
              </h2>
            </div>

            <ul className="mt-4 space-y-2.5">
              {item.details.map((detail) => (
                <li
                  key={detail}
                  className="flex gap-2 text-sm leading-relaxed text-muted-foreground"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" />
                  {detail}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section className="mt-10 rounded-2xl border border-primary/30 bg-primary/5 p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Project Controls
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {controls.map((control) => (
            <span
              key={control}
              className="rounded-full border border-border bg-background px-3 py-1.5 text-sm"
            >
              {control}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Delivery focus
          </p>
          <p className="mt-2 font-semibold">
            Requirements → Go-Live
          </p>
        </div>

        <div className="rounded-xl border border-border p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Management focus
          </p>
          <p className="mt-2 font-semibold">
            Scope, risk, schedule & readiness
          </p>
        </div>

        <div className="rounded-xl border border-border p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Environment
          </p>
          <p className="mt-2 font-semibold">
            Enterprise implementation
          </p>
        </div>
      </section>

      <p className="mt-8 border-t border-border pt-5 text-xs leading-relaxed text-muted-foreground">
        Portfolio-safe reconstruction based on completed professional implementation
        experience. Client-identifying, confidential, and proprietary information has
        been removed.
      </p>
    </article>
  );
}
