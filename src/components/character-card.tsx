import { Link } from "@tanstack/react-router";
import type { CharacterModel } from "@/lib/character-model";

export function CharacterCard({ c }: { c: CharacterModel }) {
  const accent = c.accent ?? "hsl(var(--primary))";
  const label = `View ${c.displayName}${c.heroName ? ` / ${c.heroName}` : ""} character profile`;

  return (
    <Link
      to="/characters/$slug"
      params={{ slug: c.slug }}
      aria-label={label}
      className="group/card block rounded-2xl border border-border bg-card p-5 transition select-none hover:border-primary hover:bg-card/80 hover:shadow-lg motion-safe:hover:-translate-y-0.5 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      style={{ borderTop: `4px solid ${accent}` }}
    >
      <div
        className="mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted"
        aria-hidden={c.portraitUrl ? undefined : true}
        style={c.portraitUrl ? undefined : { backgroundColor: accent }}
      >
        {c.portraitUrl ? (
          <img
            src={c.portraitUrl}
            alt={`${c.displayName}${c.heroName ? ` / ${c.heroName}` : ""} portrait`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <span className="text-2xl font-semibold text-white/95 drop-shadow-sm">
            {c.initials}
          </span>
        )}
      </div>
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
      <span
        className="mt-4 inline-flex items-center gap-1 text-sm font-semibold underline-offset-2 decoration-from-font group-hover/card:underline motion-reduce:transition-none"
        style={{ color: accent }}
      >
        View profile
        <span
          className="inline-block transition-transform duration-200 ease-out group-hover/card:translate-x-0.5 motion-reduce:transition-none"
          aria-hidden="true"
        >
          →
        </span>
      </span>
    </Link>
  );
}