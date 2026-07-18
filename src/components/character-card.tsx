import { Link } from "@tanstack/react-router";
import type { SearchableCharacter } from "@/hooks/use-character-search";

export function CharacterCard({ c }: { c: SearchableCharacter }) {
  return (
    <Link
      to={"/characters/$slug" as any}
      params={{ slug: c.slug } as any}
      className="rounded-2xl border border-border bg-card p-5 transition hover:border-primary"
      style={{ borderTop: `4px solid ${c.accent ?? "hsl(var(--primary))"}` }}
    >
      {c.eyebrow && (
        <span className="text-xs uppercase tracking-wider text-muted-foreground">
          {c.eyebrow}
        </span>
      )}
      <h3 className="mt-1 text-lg font-semibold">
        {c.displayName}
        {c.heroName ? ` / ${c.heroName}` : ""}
      </h3>
      {c.tagline && (
        <p className="mt-2 text-sm text-muted-foreground">{c.tagline}</p>
      )}
    </Link>
  );
}