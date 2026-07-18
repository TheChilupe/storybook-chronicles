import { Link } from "@tanstack/react-router";
import type { CharacterModel } from "@/lib/character-model";

export function CharacterCard({ c }: { c: CharacterModel }) {
  const accent = c.accent ?? "hsl(var(--primary))";
  return (
    <Link
      to={"/characters/$slug" as any}
      params={{ slug: c.slug } as any}
      className="rounded-2xl border border-border bg-card p-5 transition hover:border-primary"
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
    </Link>
  );
}