import { useSpoilers } from "@/lib/spoilers";
import { Markdown } from "./markdown";

export function SpoilerSection({ scope, title = "Spoilers", body }: { scope: string; title?: string; body: string }) {
  const { revealed, toggle } = useSpoilers(scope);
  if (!body?.trim()) return null;
  const regionId = `spoiler-${scope}`;
  return (
    <section className="spoiler-box mt-2" aria-labelledby={`${regionId}-title`}>
      <div className="mb-2 flex items-center justify-between gap-3">
        <h2
          id={`${regionId}-title`}
          className="text-sm font-semibold uppercase tracking-[0.14em] text-[color:var(--spoiler)]"
        >
          {title}
        </h2>
        <button
          onClick={toggle}
          aria-expanded={revealed}
          aria-controls={regionId}
          className="rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--spoiler)]/60"
        >
          {revealed ? "Hide spoilers" : "Reveal spoilers"}
        </button>
      </div>
      <div id={regionId} role="region" aria-live="polite">
        {revealed ? (
          <>
            <div className="text-foreground/95">
              <Markdown>{body}</Markdown>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={toggle}
                aria-expanded={revealed}
                aria-controls={regionId}
                className="rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--spoiler)]/60"
              >
                Hide spoilers
              </button>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            Warning: this section contains story spoilers. Hidden until you reveal.
          </p>
        )}
      </div>
    </section>
  );
}