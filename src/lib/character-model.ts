import type { CharacterWithRelations, StoryRef } from "@/lib/queries";

/* ----- reusable optional profile data (v0.3 architecture) ----- */

/**
 * Carried by every profile item that came from a spoiler-capable table. It is
 * false on the default profile — spoiler rows are absent there — and true only
 * for rows that were re-included because the visitor revealed spoilers, so the
 * UI can mark them as such.
 */
export type SpoilerTagged = { isSpoiler: boolean };

export type ProgressionEra = SpoilerTagged & {
  /** e.g. "Childhood", "Story 2", "Post-war" */
  era: string;
  /** What the character is known as during this era */
  identity: string;
  /** Their narrative function during this era */
  function: string;
};

export type StoryProgressionEntry = SpoilerTagged & {
  story: StoryRef;
  role: string | null;
  /** Markdown summary of their narrative arc within this story */
  summary: string;
};

/**
 * Compact relationship card. Only renders when `characterSlug` points at a
 * published character page — otherwise the card is dropped by the UI.
 */
export type RelationshipCard = SpoilerTagged & {
  characterSlug: string;
  name: string;
  relation: string;
  portraitUrl?: string | null;
  initials?: string | null;
};

export type KeyMoment = SpoilerTagged & {
  title: string;
  story?: StoryRef | null;
  /** Approx chronological order; lower renders first */
  order?: number | null;
  /** Markdown summary */
  summary: string;
};

export type CharacterQuote = SpoilerTagged & {
  quote: string;
  context?: string | null;
};

export type CharacterModel = {
  id: string;
  slug: string;
  displayName: string;
  heroName: string | null;
  eyebrow: string | null;
  tagline: string | null;
  role: string | null;
  accent: string | null;
  portraitUrl: string | null;
  initials: string;
  primaryStory: StoryRef | null;
  stories: Array<{ story: StoryRef; role: string | null }>;
  factions: Array<{ id: string; slug: string; name: string; role: string | null }>;
  powers: Array<{ id: string; slug: string; name: string; notes: string | null }>;
  overview: string | null;
  identity: string | null;
  storyRole: string | null;
  spoiler: string | null;
  /**
   * Whether any spoiler-flagged child row exists for this character, regardless
   * of the current reveal state. It is what keeps the reveal toggle on the page
   * for a character whose spoiler content is entirely structured rows and who
   * has no `spoiler_md` body of their own.
   */
  hasSpoilerRows: boolean;
  /* --- optional structured sections (default to empty; backfilled once schema lands) --- */
  coreConflict: string | null;
  progression: ProgressionEra[];
  storyProgression: StoryProgressionEntry[];
  relationshipCards: RelationshipCard[];
  keyMoments: KeyMoment[];
  quotes: CharacterQuote[];
};

/* ----- spoiler policy ----- */

/**
 * Shape of any child row that participates in spoiler gating. Only tables that
 * actually carry an `is_spoiler` column are passed through this filter.
 */
type SpoilerFlagged = { is_spoiler?: boolean | null };

/**
 * Single source of truth for whether a child row may appear on the default,
 * un-revealed public profile.
 *
 * A row is public unless it is explicitly flagged `is_spoiler === true`. Null
 * and undefined are treated as public: that matches the database default and
 * means a row can never be hidden by accident just because the flag is absent.
 *
 * The raw query type deliberately keeps `is_spoiler`, so the spoiler-reveal
 * toggle can re-include these rows without another round trip. This function is
 * the only place the public/spoiler decision is made.
 */
export function isPubliclyVisible(row: SpoilerFlagged): boolean {
  return row.is_spoiler !== true;
}

/**
 * The rows to render for a given reveal state: the public ones by default, and
 * every row once the visitor has revealed spoilers. `revealed` widens what is
 * shown; it can never hide a row that the default profile already displays.
 */
function visibleRows<T extends SpoilerFlagged>(
  rows: readonly T[] | null | undefined,
  revealed: boolean,
): T[] {
  const all = rows ?? [];
  return revealed ? [...all] : all.filter(isPubliclyVisible);
}

/** True only for rows explicitly flagged as spoilers; mirrors {@link isPubliclyVisible}. */
function spoilerTag(row: SpoilerFlagged): boolean {
  return !isPubliclyVisible(row);
}

/** True when any of the given collections holds at least one spoiler row. */
function anySpoilerRow(...collections: Array<readonly SpoilerFlagged[] | null | undefined>): boolean {
  return collections.some((rows) => (rows ?? []).some(spoilerTag));
}

export function storyLabel(s: StoryRef | null | undefined): string | null {
  if (!s) return null;
  return s.number != null ? `Story ${s.number} — ${s.title}` : s.title;
}

function initialsFor(name: string, alias?: string | null, slug?: string): string {
  if (slug === "rush") return "TZ";
  if (slug === "tim-malcolm") return "TM";
  const source = (alias || name || "").trim();
  const parts = source.split(/\s+/).filter(Boolean);
  const chars = parts.length >= 2 ? parts[0][0] + parts[1][0] : source.slice(0, 2);
  return chars.toUpperCase();
}

export type CharacterModelOptions = {
  /**
   * Whether the visitor has revealed spoilers for this character. Defaults to
   * false, which produces the un-revealed public profile. Callers that build a
   * model for a list or a card should leave this alone.
   */
  revealed?: boolean;
};

export function toCharacterModel(
  c: CharacterWithRelations,
  { revealed = false }: CharacterModelOptions = {},
): CharacterModel {
  const stories = (c.character_stories ?? [])
    .filter((r) => r.stories)
    .map((r) => ({ story: r.stories as StoryRef, role: r.role }));
  const factions = (c.character_factions ?? [])
    .filter((r) => r.factions)
    .map((r) => ({ ...(r.factions as { id: string; slug: string; name: string }), role: r.role }));
  const powers = (c.character_powers ?? [])
    .filter((r) => r.power_systems)
    .map((r) => ({ ...(r.power_systems as { id: string; slug: string; name: string }), notes: r.notes }));
  const bySort = <T extends { sort_order: number }>(a: T, b: T) => a.sort_order - b.sort_order;
  // Every collection below comes from a table carrying `is_spoiler`, so each is
  // filtered through the single spoiler policy before rendering, and each item
  // carries `isSpoiler` so a revealed section can mark it. `stories`, `factions`
  // and `powers` above have no spoiler column and are left untouched.
  const progression: ProgressionEra[] = visibleRows(c.character_eras, revealed)
    .sort(bySort)
    .map((r) => ({
      era: r.era_label,
      identity: r.identity,
      function: r.function_md,
      isSpoiler: spoilerTag(r),
    }));
  const storyProgression: StoryProgressionEntry[] = visibleRows(c.character_story_notes, revealed)
    .filter((r) => r.story)
    .sort((a, b) => {
      const an = a.story?.number ?? Number.POSITIVE_INFINITY;
      const bn = b.story?.number ?? Number.POSITIVE_INFINITY;
      if (an !== bn) return an - bn;
      return a.sort_order - b.sort_order;
    })
    .map((r) => ({
      story: r.story as StoryRef,
      role: r.role_label,
      summary: r.summary_md,
      isSpoiler: spoilerTag(r),
    }));
  const relationshipCards: RelationshipCard[] = visibleRows(c.character_relationships, revealed)
    .filter((r) => r.related && r.related.canon_status === "canon" && r.related.slug)
    .sort(bySort)
    .map((r) => {
      const rel = r.related as NonNullable<typeof r.related>;
      return {
        characterSlug: rel.slug,
        name: rel.alias || rel.name,
        relation: r.relation_label,
        portraitUrl: rel.portrait_url,
        initials: initialsFor(rel.name, rel.alias, rel.slug),
        isSpoiler: spoilerTag(r),
      };
    });
  const keyMoments: KeyMoment[] = visibleRows(c.character_key_moments, revealed)
    .sort(bySort)
    .map((r) => ({
      title: r.title,
      story: r.story,
      order: r.sort_order,
      summary: r.summary_md,
      isSpoiler: spoilerTag(r),
    }));
  const quotes: CharacterQuote[] = visibleRows(c.character_quotes, revealed)
    .sort(bySort)
    .map((r) => ({ quote: r.quote_md, context: r.context_md, isSpoiler: spoilerTag(r) }));
  return {
    id: c.id,
    slug: c.slug,
    displayName: c.name,
    heroName: c.alias ?? null,
    eyebrow: c.eyebrow,
    tagline: c.tagline,
    role: c.role,
    accent: c.accent_color,
    portraitUrl: c.portrait_url,
    initials: initialsFor(c.name, c.alias, c.slug),
    primaryStory: c.primary_story ?? null,
    stories,
    factions,
    powers,
    overview: c.canon_summary_md ?? null,
    identity: c.identity_md ?? null,
    storyRole: c.story_role_md ?? null,
    spoiler: c.spoiler_md ?? null,
    hasSpoilerRows: anySpoilerRow(
      c.character_eras,
      c.character_story_notes,
      c.character_relationships,
      c.character_key_moments,
      c.character_quotes,
    ),
    coreConflict: (c as { core_conflict_md?: string | null }).core_conflict_md ?? null,
    progression,
    storyProgression,
    relationshipCards,
    keyMoments,
    quotes,
  };
}