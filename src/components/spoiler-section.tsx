import { useSpoilers } from "@/lib/spoilers";
import { Markdown } from "./markdown";

export function SpoilerSection({ scope, title = "Spoilers", body }: { scope: string; title?: string; body: string }) {
  const { revealed, toggle } = useSpoilers(scope);
  if (!body?.trim()) return null;
  return (
    <section className="spoiler-box mt-6">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[color:var(--spoiler)]">
          {title}
        </h2>
        <button
          onClick={toggle}
          className="rounded-md border border-border px-2 py-1 text-xs hover:bg-secondary"
        >
          {revealed ? "Hide" : "Reveal"}
        </button>
      </div>
      {revealed ? <Markdown>{body}</Markdown> : (
        <p className="text-sm text-muted-foreground">Hidden until you reveal spoilers.</p>
      )}
    </section>
  );
}