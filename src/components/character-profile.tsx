import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import type { CharacterModel } from "@/lib/character-model";
import { storyLabel } from "@/lib/character-model";
import { Markdown } from "@/components/markdown";
import { SpoilerSection } from "@/components/spoiler-section";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

/* ---------------- utilities ---------------- */

function accentOf(m: CharacterModel) {
  return m.accent ?? "hsl(var(--primary))";
}

function accentMix(m: CharacterModel, pct: number) {
  const c = accentOf(m);
  return `color-mix(in oklab, ${c} ${pct}%, transparent)`;
}

/** Extract a leading blockquote-styled pull quote when identity_md starts with `> ...`. */
function extractPullQuote(md: string | null | undefined): string | null {
  if (!md) return null;
  const line = md.split("\n").find((l) => l.trim().startsWith(">"));
  if (!line) return null;
  return line.replace(/^\s*>\s?/, "").trim() || null;
}

/* ---------------- primitives ---------------- */

export function CharacterSection({
  id,
  title,
  eyebrow,
  accent,
  children,
  className = "",
}: {
  id?: string;
  title: string;
  eyebrow?: string;
  accent?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`rounded-2xl border border-border bg-card p-6 sm:p-8 ${className}`}
      aria-labelledby={id ? `${id}-title` : undefined}
    >
      {eyebrow && (
        <p
          className="mb-1 text-xs font-semibold uppercase tracking-[0.14em]"
          style={{ color: accent ?? "var(--color-muted-foreground)" }}
        >
          {eyebrow}
        </p>
      )}
      <h2
        id={id ? `${id}-title` : undefined}
        className="mb-4 text-xl font-semibold sm:text-2xl"
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

/* ---------------- breadcrumb ---------------- */

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

/* ---------------- portrait ---------------- */

function Portrait({ m }: { m: CharacterModel }) {
  const [failed, setFailed] = useState(false);
  const accent = accentOf(m);
  const showImg = m.portraitUrl && !failed;
  return (
    <div className="flex shrink-0 flex-col items-center gap-3 self-center sm:items-start sm:self-start">
      <div
        className="relative"
        style={{ filter: `drop-shadow(0 10px 30px ${accentMix(m, 22)})` }}
      >
        <div
          className="flex h-56 w-44 items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted sm:h-72 sm:w-60 md:h-80 md:w-[15rem]"
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
            <span className="text-5xl font-semibold text-white/95 drop-shadow-sm sm:text-6xl">
              {m.initials}
            </span>
          )}
        </div>
      </div>
      <PortraitUploader m={m} />
    </div>
  );
}

function PortraitUploader({ m }: { m: CharacterModel }) {
  const { allowed } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!allowed) return null;

  async function handleFile(file: File) {
    setBusy(true);
    setError(null);
    try {
      const ext = (file.name.split(".").pop() || "png").toLowerCase();
      const path = `characters/${m.slug}-${Date.now()}.${ext}`;
      const up = await supabase.storage
        .from("lore-images")
        .upload(path, file, { upsert: true, contentType: file.type });
      if (up.error) throw up.error;
      // Bucket is private; use a long-lived signed URL so public visitors can view.
      const signed = await supabase.storage
        .from("lore-images")
        .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
      if (signed.error || !signed.data?.signedUrl) throw signed.error ?? new Error("Failed to sign URL");
      const upd = await supabase
        .from("characters")
        .update({ portrait_url: signed.data.signedUrl })
        .eq("id", m.id);
      if (upd.error) throw upd.error;
      window.location.reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
      setBusy(false);
    }
  }

  return (
    <div className="w-full max-w-[15rem]">
      <label
        className={`inline-flex w-full cursor-pointer items-center justify-center rounded-md border border-border bg-background/60 px-3 py-2 text-xs font-medium transition hover:border-primary ${busy ? "pointer-events-none opacity-60" : ""}`}
      >
        {busy ? "Uploading…" : "Upload portrait"}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          disabled={busy}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handleFile(f);
          }}
        />
      </label>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

/* ---------------- hero ---------------- */

function Badge({
  children,
  accent,
  tone = "outline",
}: {
  children: React.ReactNode;
  accent: string;
  tone?: "outline" | "solid";
}) {
  const style: React.CSSProperties =
    tone === "solid"
      ? { backgroundColor: accent, color: "var(--color-primary-foreground)" }
      : {
          borderColor: `color-mix(in oklab, ${accent} 55%, transparent)`,
          color: accent,
          backgroundColor: `color-mix(in oklab, ${accent} 8%, transparent)`,
        };
  return (
    <span
      className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium"
      style={style}
    >
      {children}
    </span>
  );
}

export function CharacterHero({ m }: { m: CharacterModel }) {
  const accent = accentOf(m);
  return (
    <header
      className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-8"
      style={{ borderTop: `4px solid ${accent}` }}
    >
      {/* accent glow wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background: `radial-gradient(60% 80% at 15% 0%, ${accentMix(m, 18)} 0%, transparent 60%)`,
        }}
      />
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
        <Portrait m={m} />
        <div className="min-w-0 flex-1">
          {m.eyebrow && (
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {m.eyebrow}
            </p>
          )}
          <h1 className="mt-1 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
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
            <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
              {m.tagline}
            </p>
          )}
          <div className="mt-5 flex flex-wrap gap-2">
            {m.role && <Badge accent={accent}>{m.role}</Badge>}
            {m.primaryStory && (
              <Badge accent={accent}>{storyLabel(m.primaryStory)}</Badge>
            )}
            {m.powers.slice(0, 3).map((p) => (
              <Badge key={p.id} accent={accent}>
                {p.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

/* ---------------- quick facts ---------------- */

type Fact = { label: string; value: React.ReactNode };

export function CharacterQuickFacts({ m }: { m: CharacterModel }) {
  const facts: Fact[] = [];
  if (m.heroName) facts.push({ label: "Hero name", value: m.heroName });
  if (m.role) facts.push({ label: "Narrative role", value: m.role });
  const primary = storyLabel(m.primaryStory);
  if (primary) facts.push({ label: "Primary story", value: primary });
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
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        Quick facts
      </h2>
      <dl className="grid gap-3 text-sm">
        {facts.map((f) => (
          <div
            key={f.label}
            className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-3"
          >
            <dt className="text-muted-foreground">{f.label}</dt>
            <dd className="min-w-0 text-foreground">{f.value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}

/* ---------------- overview ---------------- */

export function CharacterOverview({ m }: { m: CharacterModel }) {
  if (!m.overview?.trim()) return null;
  const accent = accentOf(m);
  return (
    <CharacterSection id="overview" title="Overview" accent={accent}>
      {m.tagline && (
        <blockquote
          className="mb-5 border-l-2 pl-4 text-lg italic text-foreground/90"
          style={{ borderColor: accent }}
        >
          {m.tagline}
        </blockquote>
      )}
      <div className="max-w-[70ch]">
        <Markdown>{m.overview}</Markdown>
      </div>
    </CharacterSection>
  );
}

/* ---------------- identity ---------------- */

export function CharacterIdentity({ m }: { m: CharacterModel }) {
  if (!m.identity?.trim()) return null;
  const accent = accentOf(m);
  const pull = extractPullQuote(m.identity);
  const body = pull
    ? m.identity.split("\n").filter((l) => !l.trim().startsWith(">")).join("\n")
    : m.identity;
  return (
    <CharacterSection id="identity" title="Character Identity" accent={accent}>
      {pull && (
        <blockquote
          className="mb-5 border-l-2 pl-4 text-base italic text-foreground/90"
          style={{ borderColor: accent }}
        >
          {pull}
        </blockquote>
      )}
      <div className="max-w-[70ch]">
        <Markdown>{body}</Markdown>
      </div>
    </CharacterSection>
  );
}

/* ---------------- powers ---------------- */

export function CharacterPowerCard({
  name,
  notes,
  accent,
}: {
  name: string;
  notes: string | null;
  accent: string;
}) {
  return (
    <article
      className="rounded-xl border border-border bg-background/40 p-4"
      style={{ borderLeft: `3px solid ${accent}` }}
    >
      <h3 className="text-base font-semibold" style={{ color: accent }}>
        {name}
      </h3>
      {notes?.trim() && (
        <div className="mt-2 max-w-[65ch] text-sm text-foreground/90">
          <Markdown>{notes}</Markdown>
        </div>
      )}
    </article>
  );
}

export function CharacterPowers({ m }: { m: CharacterModel }) {
  if (!m.powers.length) return null;
  const accent = accentOf(m);
  return (
    <CharacterSection
      id="powers"
      title="Powers and Abilities"
      accent={accent}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {m.powers.map((p) => (
          <CharacterPowerCard
            key={p.id}
            name={p.name}
            notes={p.notes}
            accent={accent}
          />
        ))}
      </div>
    </CharacterSection>
  );
}

/* ---------------- limitations (data-driven; hidden without data) ---------------- */

export type Limitation = { title: string; body: string };

export function CharacterLimitations({
  items,
}: {
  items: Limitation[] | undefined | null;
}) {
  if (!items?.length) return null;
  return (
    <CharacterSection id="limitations" title="Limitations">
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((l, i) => (
          <article
            key={i}
            className="rounded-xl border p-4"
            style={{
              borderColor: "color-mix(in oklab, var(--color-destructive) 40%, transparent)",
              background:
                "color-mix(in oklab, var(--color-destructive) 6%, transparent)",
            }}
          >
            <h3 className="text-sm font-semibold text-foreground">{l.title}</h3>
            <p className="mt-1.5 text-sm text-foreground/85">{l.body}</p>
          </article>
        ))}
      </div>
    </CharacterSection>
  );
}

/* ---------------- story role ---------------- */

export function CharacterStoryRoleSection({ m }: { m: CharacterModel }) {
  if (!m.storyRole?.trim()) return null;
  const accent = accentOf(m);
  return (
    <CharacterSection id="story-role" title="Story Role" accent={accent}>
      <div className="max-w-[70ch]">
        <Markdown>{m.storyRole}</Markdown>
      </div>
    </CharacterSection>
  );
}

/* ---------------- relationships (data-driven; hidden without data) ---------------- */

export type Relationship = {
  name: string;
  relation: string;
  description?: string | null;
  portraitUrl?: string | null;
  characterSlug?: string | null;
};

export function CharacterRelationships({
  items,
  accent,
}: {
  items: Relationship[] | undefined | null;
  accent: string;
}) {
  if (!items?.length) return null;
  return (
    <CharacterSection id="relationships" title="Key Relationships">
      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map((r, i) => {
          const inner = (
            <>
              <div
                className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full border border-border bg-muted"
                style={r.portraitUrl ? undefined : { backgroundColor: accent }}
                aria-hidden="true"
              >
                {r.portraitUrl ? (
                  <img src={r.portraitUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-sm font-semibold text-white/95">
                    {r.name.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{r.name}</p>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  {r.relation}
                </p>
                {r.description && (
                  <p className="mt-1 text-sm text-foreground/85">{r.description}</p>
                )}
              </div>
            </>
          );
          return (
            <li key={i}>
              {r.characterSlug ? (
                <Link
                  to="/characters/$slug"
                  params={{ slug: r.characterSlug }}
                  className="flex items-start gap-3 rounded-xl border border-border bg-background/40 p-3 transition hover:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                >
                  {inner}
                </Link>
              ) : (
                <div className="flex items-start gap-3 rounded-xl border border-border bg-background/40 p-3">
                  {inner}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </CharacterSection>
  );
}

/* ---------------- story appearances ---------------- */

export function CharacterStoryAppearances({ m }: { m: CharacterModel }) {
  if (!m.stories.length) return null;
  const accent = accentOf(m);
  return (
    <CharacterSection id="story-appearances" title="Story Appearances">
      <ol className="grid gap-3">
        {m.stories.map((s) => (
          <li
            key={s.story.id}
            className="rounded-xl border border-border bg-background/40 p-4"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <p className="text-sm font-semibold">
                {s.story.number != null && (
                  <span className="mr-2 text-muted-foreground">
                    Story {s.story.number}
                  </span>
                )}
                {s.story.title}
              </p>
              {s.role && (
                <span
                  className="text-xs font-medium uppercase tracking-wider"
                  style={{ color: accent }}
                >
                  {s.role}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </CharacterSection>
  );
}

/* ---------------- related lore ---------------- */

export function CharacterRelatedLore({ m }: { m: CharacterModel }) {
  const hasFactions = m.factions.length > 0;
  const hasPowers = m.powers.length > 0;
  if (!hasFactions && !hasPowers) return null;
  return (
    <CharacterSection id="related-lore" title="Related Lore">
      <div className="grid gap-6 sm:grid-cols-2">
        {hasFactions && (
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Factions
            </h3>
            <ul className="space-y-1.5 text-sm">
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
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Power systems
            </h3>
            <ul className="space-y-1.5 text-sm">
              {m.powers.map((p) => (
                <li key={p.id}>{p.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </CharacterSection>
  );
}

/* ---------------- gallery (hidden without data) ---------------- */

export type GalleryImage = {
  url: string;
  alt: string;
  category?: string | null;
};

export function CharacterGallery({
  images,
}: {
  images: GalleryImage[] | undefined | null;
}) {
  if (!images?.length) return null;
  return (
    <CharacterSection id="gallery" title="Gallery">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((img, i) => (
          <figure
            key={i}
            className="overflow-hidden rounded-xl border border-border bg-muted"
          >
            <img
              src={img.url}
              alt={img.alt}
              className="aspect-[3/4] w-full object-cover"
              loading="lazy"
            />
            {img.category && (
              <figcaption className="p-2 text-xs text-muted-foreground">
                {img.category}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </CharacterSection>
  );
}

/* ---------------- not found ---------------- */

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

/* ---------------- full profile ---------------- */

export function CharacterProfile({
  m,
  spoilerBody,
}: {
  m: CharacterModel;
  spoilerBody: string | null;
}) {
  // future: relationships/limitations/gallery when schema supports them
  const relationships = useMemo<Relationship[]>(() => [], []);
  const limitations = useMemo<Limitation[]>(() => [], []);
  const gallery = useMemo<GalleryImage[]>(() => [], []);
  const accent = accentOf(m);

  return (
    <article>
      <CharacterBreadcrumb name={m.heroName || m.displayName} />
      <CharacterHero m={m} />

      {/* Mobile/tablet: Quick Facts directly after hero */}
      <div className="mt-6 lg:hidden">
        <CharacterQuickFacts m={m} />
      </div>

      <div className="mt-6 lg:grid lg:grid-cols-[minmax(0,68fr)_minmax(0,32fr)] lg:gap-6">
        <main className="min-w-0 space-y-6">
          <CharacterOverview m={m} />
          <CharacterIdentity m={m} />
          <CharacterPowers m={m} />
          <CharacterLimitations items={limitations} />
          <CharacterStoryRoleSection m={m} />
          <CharacterRelationships items={relationships} accent={accent} />
          <CharacterStoryAppearances m={m} />
          <div className="lg:hidden space-y-6">
            <CharacterRelatedLore m={m} />
          </div>
          {spoilerBody && (
            <SpoilerSection scope={`char-${m.slug}`} body={spoilerBody} />
          )}
          <CharacterGallery images={gallery} />
        </main>
        <aside className="hidden lg:block">
          <div className="lg:sticky lg:top-24 space-y-6">
            <CharacterQuickFacts m={m} />
            <CharacterRelatedLore m={m} />
          </div>
        </aside>
      </div>
    </article>
  );
}
