import { ExternalLink, FileText, Maximize2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { QaReviewArtifact } from "@/components/skills/qa-review-artifact";
import {
  CreativeMotionArtifact,
  CreativeMotionPreview,
} from "@/components/skills/creative-motion-artifact";
import {
  ProfessionalDeliveryArtifact,
  ProfessionalDeliveryPreview,
} from "@/components/skills/professional-delivery-artifact";
import remarkGfm from "remark-gfm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  skillsEvidence,
  type EvidenceArtifact,
} from "@/content/skills/evidence";

function MarkdownArtifact({ content }: { content: string }) {
  return (
    <article className="mx-auto max-w-4xl rounded-xl border border-border bg-background px-5 py-8 shadow-sm sm:px-8 sm:py-10">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mt-10 border-t border-border pt-8 text-xl font-semibold sm:text-2xl">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-7 text-lg font-semibold">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mt-4 leading-7 text-muted-foreground">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mt-4 list-decimal space-y-2 pl-6 text-muted-foreground">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-7">{children}</li>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">
              {children}
            </strong>
          ),
          blockquote: ({ children }) => (
            <blockquote className="mt-5 border-l-2 border-primary pl-4 italic text-muted-foreground">
              {children}
            </blockquote>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
function EvidenceCard({ artifact }: { artifact: EvidenceArtifact }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="group overflow-hidden rounded-2xl border border-border bg-card text-left transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`Explore ${artifact.title}`}
        >
          <div className="relative aspect-[16/9] overflow-hidden border-b border-border bg-secondary/20 p-3 sm:p-4">
            <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-xl border border-border/70 bg-background/80">
              {artifact.special === "professional-delivery" ? (
                <ProfessionalDeliveryPreview />
              ) : artifact.special === "creative-motion" ? (
                <CreativeMotionPreview />
              ) : (
                <img
                  src={artifact.preview}
                  alt=""
                  className="max-h-full max-w-full object-contain transition duration-300 group-hover:scale-[1.01]"
                  loading="lazy"
                />
              )}
            </div>
            <div className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/70 text-white shadow-sm backdrop-blur">
              <Maximize2 aria-hidden="true" className="h-4 w-4" />
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
                {artifact.source}
              </span>
              <span className="text-xs text-muted-foreground">
                {artifact.category}
              </span>
            </div>

            <h3 className="mt-4 text-lg font-semibold leading-snug">
              {artifact.title}
            </h3>

            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
              {artifact.summary}
            </p>

            <ul
              className="mt-4 flex flex-wrap gap-2"
              aria-label={`${artifact.title} demonstrated skills`}
            >
              {artifact.skills.slice(0, 3).map((skill) => (
                <li
                  key={skill}
                  className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground"
                >
                  {skill}
                </li>
              ))}
            </ul>

            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
              Explore artifact
              <Maximize2
                aria-hidden="true"
                className="h-3.5 w-3.5"
              />
            </span>
          </div>
        </button>
      </DialogTrigger>

      <DialogContent className="grid max-h-[92vh] w-[96vw] max-w-6xl grid-rows-[auto_minmax(0,1fr)] gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b border-border px-5 py-5 pr-12 sm:px-7">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
              {artifact.source}
            </span>
            <span className="text-xs text-muted-foreground">
              {artifact.category}
            </span>
          </div>

          <DialogTitle className="pt-2 text-xl sm:text-2xl">
            {artifact.title}
          </DialogTitle>

          <DialogDescription className="max-w-3xl leading-relaxed">
            {artifact.summary}
          </DialogDescription>

          <div className="flex flex-wrap gap-2 pt-2">
            {artifact.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-border bg-secondary/50 px-2.5 py-1 text-xs text-muted-foreground"
              >
                {skill}
              </span>
            ))}
          </div>

          {artifact.document && (
            <a
              href={artifact.document}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              <FileText aria-hidden="true" className="h-4 w-4" />
              {artifact.documentLabel ?? "Open document"}
              <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
            </a>
          )}
        </DialogHeader>

        <div className="min-h-0 overflow-auto bg-secondary/20 p-3 sm:p-5">
          {artifact.special === "professional-delivery" ? (
            <ProfessionalDeliveryArtifact />
          ) : artifact.special === "creative-motion" ? (
            <CreativeMotionArtifact />
          ) : artifact.special === "qa-review" ? (
            <QaReviewArtifact />
          ) : artifact.markdown ? (
            <MarkdownArtifact content={artifact.markdown} />
          ) : artifact.document ? (
            <iframe
              src={artifact.document}
              title={`${artifact.title} document`}
              className="h-[68vh] min-h-[500px] w-full rounded-xl border border-border bg-white"
            />
          ) : (
            <div className="flex h-[68vh] min-h-[420px] w-full items-center justify-center rounded-xl border border-border bg-background/80 p-4 sm:p-6">
              <img
                src={artifact.preview}
                alt={`${artifact.title} project evidence`}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function EvidenceGallery() {
  return (
    <section
      id="selected-evidence"
      aria-labelledby="selected-evidence-title"
      className="mt-16 scroll-mt-24 border-t border-border pt-12 sm:mt-20 sm:pt-16"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        Selected evidence
      </p>

      <h2
        id="selected-evidence-title"
        className="mt-3 text-2xl font-semibold sm:text-3xl"
      >
        See the work behind the claims
      </h2>

      <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">
        These artifacts show how I plan, organize, build, test, govern, and
        iterate across technical and creative projects. Select an artifact to
        inspect the underlying work.
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {skillsEvidence.map((artifact) => (
          <EvidenceCard key={artifact.id} artifact={artifact} />
        ))}
      </div>
    </section>
  );
}










