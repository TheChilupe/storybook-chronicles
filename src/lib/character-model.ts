import type { CharacterWithRelations, StoryRef } from "@/lib/queries";

/* ----- reusable optional profile data (v0.3 architecture) ----- */

export type ProgressionEra = {
  /** e.g. "Childhood", "Story 2", "Post-war" */
  era: string;
  /** What the character is known as during this era */
  identity: string;
  /** Their narrative function during this era */
  function: string;
};

export type StoryProgressionEntry = {
  story: StoryRef;
  role: string | null;
  /** Markdown summary of their narrative arc within this story */
  summary: string;
};

/**
 * Compact relationship card. Only renders when `characterSlug` points at a
 * published character page — otherwise the card is dropped by the UI.
 */
export type RelationshipCard = {
  characterSlug: string;
  name: string;
  relation: string;
  portraitUrl?: string | null;
  initials?: string | null;
};

export type KeyMoment = {
  title: string;
  story?: StoryRef | null;
  /** Approx chronological order; lower renders first */
  order?: number | null;
  /** Markdown summary */
  summary: string;
};

export type CharacterQuote = {
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
  /* --- optional structured sections (default to empty; backfilled once schema lands) --- */
  coreConflict: string | null;
  progression: ProgressionEra[];
  storyProgression: StoryProgressionEntry[];
  relationshipCards: RelationshipCard[];
  keyMoments: KeyMoment[];
  quotes: CharacterQuote[];
};

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

export function toCharacterModel(c: CharacterWithRelations): CharacterModel {
  const stories = (c.character_stories ?? [])
    .filter((r) => r.stories)
    .map((r) => ({ story: r.stories as StoryRef, role: r.role }));
  const factions = (c.character_factions ?? [])
    .filter((r) => r.factions)
    .map((r) => ({ ...(r.factions as { id: string; slug: string; name: string }), role: r.role }));
  const powers = (c.character_powers ?? [])
    .filter((r) => r.power_systems)
    .map((r) => ({ ...(r.power_systems as { id: string; slug: string; name: string }), notes: r.notes }));
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
    // Placeholder architecture — populated once character_eras,
    // character_relationships, character_story_notes, character_quotes,
    // character_key_moments tables ship. Empty arrays keep sections hidden.
    coreConflict: null,
    progression: [],
    storyProgression: [],
    relationshipCards: [],
    keyMoments: [],
    quotes: [],
  };
}