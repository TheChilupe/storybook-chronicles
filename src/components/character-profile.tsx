import { Link } from "@tanstack/react-router";
import type { CharacterModel } from "@/lib/character-model";
import { storyLabel } from "@/lib/character-model";
import { Markdown } from "@/components/markdown";
import { SpoilerSection } from "@/components/spoiler-section";
import { useState } from "react";

export function CharacterBreadcrumb({ name }: { name: string }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link to="/storybook-chronicles" className="hover:text-foreground">
            Storybook Chronicles
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <Link to="/characters" className="hover:text-foreground">
            Characters
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li aria-current="page" className="text-foreground">
          {name}
        </li>
      </ol>
    </nav>
  );
}

function Portrait({ m, size = "lg" }: { m: CharacterModel; size?: "lg" | "md" }) {
  const [failed, setFailed] = useState(false);
  const accent = m.accent ?? "hsl(var(--primary))";
  const dims =
    size === "lg"
      ? "h-40 w-40 sm:h-48 sm:w-48 text-4xl"
      : "h-24 w-24 text-2xl";
  const showImg = m.portraitUrl && !failed;
  return (
    <div
      className={`flex ${dims} shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted`}
      style={showImg ? undefined : { backgroundColor: accent }}
      aria-hidden={showImg ? undefined : true}
    >
      {showImg ? (
        <img
          src={m.portraitUrl!}
          alt={`${m.displayName}${m.heroName ? ` / ${m.heroName}` : ""} portrait`}
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="font-semibold text-white/95 drop-shadow-sm">
          {m.initials}
        </span>
      )}
    </div>
  );
}

export function CharacterHero({ m }: { m: CharacterModel }) {
  const accent = m.accent ?? "hsl(var(--primary))";
  return (
    <header
      className="rounded-2xl border border-border bg-card p-6 sm:p-8"
      style={{ borderTop: `4px solid ${accent}` }}
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <Portrait m={m} />
        <div className="min-w-0 flex-1">
          {m.eyebrow && (
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              {m.eyebrow}
            </p>
          )}
          <h1 className="mt-1 text-3xl font-bold sm:text-4xl">
            {m.displayName}
          </h1>
          {m.heroName && (
            <p
              className="mt-1 text-xl font-semibold sm:text-2xl"
              style={{ color: accent }}
            >
              {m.heroName}
            </p>
          )}
          {m.tagline && (
            <p className="mt-3 text-lg text-muted-foreground">{m.tagline}</p>
          )}
        </div>
      </div>
    </header>
  );
}

type Fact = { label: string; value: React.ReactNode };

export function CharacterQuickFacts({ m }: { m: CharacterModel }) {
  const facts: Fact[] = [];
  if (m.heroName) facts.push({ label: "Hero name", value: m.heroName });
  if (m.role) facts.push({ label: "Narrative role", value: m.role });
  const primary = storyLabel(m.primaryStory);
  if (primary) facts.push({ label: "Primary story", value: primary });
  const extras = m.stories
    .filter((s) => s.story.id !== m.primaryStory?.id)
    .map((s) => {
      const label = storyLabel(s.story);
      return s.role ? `${label} (${s.role})` : label;
    })
    .filter(Boolean);
  if (extras.length)
    facts.push({ label: "Also appears in", value: extras.join(", ") });
  if (m.factions.length)
    facts.push({
      label: m.factions.length === 1 ? "Faction" : "Factions",
      value: m.factions.map((f) => f.name).join(", "),
    });
  if (m.powers.length)
    facts.push({
      label: m.powers.length === 1 ? "Power system" : "Power systems",
      value: m.powers.map((p) => p.name).join(", "),
    });

  if (!facts.length) return null;
  return (
    <aside
      aria-label="Quick facts"
      className="rounded-2xl border border-border bg-card p-6"
    >
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Quick facts
      </h2>
      <dl className="grid gap-3 text-sm">
        {facts.map((f) => (
          <div key={f.label} className="grid grid-cols-[7rem_1fr] gap-3">
            <dt className="text-muted-foreground">{f.label}</dt>
            <dd className="text-foreground">{f.value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}

export function CharacterLoreSection({
  title,
  body,
}: {
  title: string;
  body: string | null | undefined;
}) {
  if (!body?.trim()) return null;
  return (
    <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <h2 className="mb-3 text-xl font-semibold">{title}</h2>
      <Markdown>{body}</Markdown>
    </section>
  );
}

export function CharacterRelations({ m }: { m: CharacterModel }) {
  const hasStories = m.stories.length > 0;
  const hasFactions = m.factions.length > 0;
  const hasPowers = m.powers.length > 0;
  if (!hasStories && !hasFactions && !hasPowers) return null;
  return (
    <section
      aria-label="Related lore"
      className="rounded-2xl border border-border bg-card p-6 sm:p-8"
    >
      <h2 className="mb-4 text-xl font-semibold">Related lore</h2>
      <div className="grid gap-6 sm:grid-cols-3">
        {hasStories && (
          <div>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Story appearances
            </h3>
            <ul className="space-y-1 text-sm">
              {m.stories.map((s) => (
                <li key={s.story.id}>
                  {storyLabel(s.story)}
                  {s.role && (
                    <span className="text-muted-foreground"> — {s.role}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        {hasFactions && (
          <div>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Factions
            </h3>
            <ul className="space-y-1 text-sm">
              {m.factions.map((f) => (
                <li key={f.id}>
                  {f.name}
                  {f.role && (
                    <span className="text-muted-foreground"> — {f.role}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        {hasPowers && (
          <div>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Power systems
            </h3>
            <ul className="space-y-1 text-sm">
              {m.powers.map((p) => (
                <li key={p.id}>
                  {p.name}
                  {p.notes && (
                    <span className="text-muted-foreground"> — {p.notes}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

export function CharacterNotFound({ slug }: { slug?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-10 text-center">
      <h1 className="text-2xl font-semibold">Character not found</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {slug ? (
          <>
            No canon character exists at{" "}
            <span className="font-mono">/characters/{slug}</span>.
          </>
        ) : (
          "That character could not be located in the codex."
        )}
      </p>
      <Link
        to="/characters"
        className="mt-6 inline-flex items-center rounded-full border border-border bg-background px-4 py-2 text-sm transition hover:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        ← Back to Characters
      </Link>
    </div>
  );
}

export function CharacterProfile({ m, spoilerBody }: { m: CharacterModel; spoilerBody: string | null }) {
  return (
    <article>
      <CharacterBreadcrumb name={m.heroName || m.displayName} />
      <CharacterHero m={m} />
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-6 min-w-0">
          <CharacterLoreSection title="Overview" body={m.overview} />
          <CharacterLoreSection title="Character Identity" body={m.identity} />
          <CharacterLoreSection title="Story Role" body={m.storyRole} />
          {spoilerBody && (
            <SpoilerSection scope={`char-${m.slug}`} body={spoilerBody} />
          )}
          <CharacterRelations m={m} />
        </div>
        <div className="lg:sticky lg:top-6 lg:self-start">
          <CharacterQuickFacts m={m} />
        </div>
      </div>
    </article>
  );
}