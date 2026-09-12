const blueStudies = [
  {
    src: "/portfolio/skills/creative/blue-sketch.jpeg",
    label: "Initial Sketch",
    description: "Early visual exploration establishing silhouette, costume direction, and character language.",
  },
  {
    src: "/portfolio/skills/creative/blue-refined.jpeg",
    label: "Refined Design",
    description: "A more controlled iteration used to clarify proportions, costume structure, and visual identity.",
  },
  {
    src: "/portfolio/skills/creative/blue-ai-concept.png",
    label: "AI-Assisted Concept",
    description: "AI-assisted visual development used to explore how the approved design language translates into finished illustration.",
  },
  {
    src: "/portfolio/skills/creative/blue-face-refined.png",
    label: "Identity Refinement",
    description: "Focused refinement of facial identity and presentation for stronger character consistency.",
  },
];

const motionStudies = [
  {
    src: "/portfolio/skills/creative/h-motion-study.mp4",
    title: "H Motion Study",
    description:
      "A character-motion experiment exploring idle presence, restrained movement, and how a still design behaves once animated.",
  },
  {
    src: "/portfolio/skills/creative/ultra-motion-study.mp4",
    title: "Ultra Motion Study",
    description:
      "A short animation experiment testing movement, screen presence, and translation from illustration into motion.",
  },
];

export function CreativeMotionPreview() {
  return (
    <div className="grid h-full w-full grid-cols-2 gap-1.5 bg-background p-2">
      {blueStudies.map((study) => (
        <div
          key={study.src}
          className="min-h-0 overflow-hidden rounded-md border border-border bg-secondary/20"
        >
          <img
            src={study.src}
            alt=""
            className="h-full w-full object-cover object-top"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}

export function CreativeMotionArtifact() {
  return (
    <article className="mx-auto max-w-6xl rounded-xl border border-border bg-background px-5 py-8 shadow-sm sm:px-8 sm:py-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        Visual Development & Motion
      </p>

      <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
        From Character Exploration to Motion
      </h1>

      <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">
        A selection of Storybook Chronicles visual-development work showing how
        character concepts move through iteration, refinement, AI-assisted
        exploration, human review, and early motion testing.
      </p>

      <section className="mt-10">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Character Development
          </p>

          <h2 className="mt-2 text-xl font-semibold sm:text-2xl">
            Blue: Design Evolution
          </h2>

          <p className="mt-3 leading-7 text-muted-foreground">
            The progression below demonstrates an iterative visual-development
            process rather than treating a single generated image as the final
            character design.
          </p>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {blueStudies.map((study, index) => (
            <figure
              key={study.src}
              className="overflow-hidden rounded-2xl border border-border bg-card/70"
            >
              <div className="flex aspect-[4/3] items-center justify-center overflow-hidden bg-secondary/20">
                <img
                  src={study.src}
                  alt={`Blue visual development stage ${index + 1}: ${study.label}`}
                  className="h-full w-full object-contain"
                  loading="lazy"
                />
              </div>

              <figcaption className="p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <h3 className="font-semibold">
                    {study.label}
                  </h3>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {study.description}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="mt-12 border-t border-border pt-10">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Motion Prototyping
          </p>

          <h2 className="mt-2 text-xl font-semibold sm:text-2xl">
            Animation Experiments
          </h2>

          <p className="mt-3 leading-7 text-muted-foreground">
            Motion studies are used to test whether character designs retain
            their personality, readability, and visual weight once movement is
            introduced.
          </p>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {motionStudies.map((study) => (
            <figure
              key={study.src}
              className="overflow-hidden rounded-2xl border border-border bg-card/70"
            >
              <div className="bg-black">
                <video
                  controls
                  playsInline
                  preload="metadata"
                  className="aspect-video w-full object-contain"
                >
                  <source src={study.src} type="video/mp4" />
                  Your browser does not support embedded video.
                </video>
              </div>

              <figcaption className="p-5">
                <h3 className="font-semibold">
                  {study.title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {study.description}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-primary/30 bg-primary/5 p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Development Workflow
        </p>

        <p className="mt-3 leading-7">
          Narrative Requirement → Visual Brief → Concept Development → Human
          Evaluation → Refinement → Approved Direction → Motion Testing
        </p>
      </section>

      <p className="mt-8 border-t border-border pt-5 text-xs leading-relaxed text-muted-foreground">
        Storybook Chronicles is an independently developed original creative
        project. AI-assisted tools are used as part of a broader human-directed
        visual-development and experimentation workflow.
      </p>
    </article>
  );
}
