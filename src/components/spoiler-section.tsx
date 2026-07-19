import { useSpoilers } from "@/lib/spoilers";
import { Markdown } from "./markdown";

export function SpoilerSection({ scope, title = "Spoilers", body }: { scope: string; title?: string; body: string }) {
  const { revealed, toggle } = useSpoilers(scope);
  if (!body?.trim()) return null;
  const regionId = `spoiler-${scope}`;
  return (
    <section className="spoiler-box mt-6">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[color:var(--spoiler)]">
          {title}
        </h2>
        <button
          onClick={toggle}
          aria-expanded={revealed}
          aria-controls={regionId}
          className="rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
        >
          {revealed ? "Hide spoilers" : "Reveal spoilers"}
        </button>
      </div>
      <div id={regionId} role="region" aria-live="polite">
        {revealed ? (
          <Markdown>{body}</Markdown>
        ) : (
          <p className="text-sm text-muted-foreground">
            Warning: this section contains story spoilers. Hidden until you reveal.
          </p>
        )}
      </div>
    </section>
  );
}