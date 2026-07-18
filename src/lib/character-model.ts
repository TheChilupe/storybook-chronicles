import type { CharacterWithRelations, StoryRef } from "@/lib/queries";

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
};

export function storyLabel(s: StoryRef | null | undefined): string | null {
  if (!s) return null;
  return s.number != null ? `Story ${s.number} — ${s.title}` : s.title;
}

function initialsFor(name: string, alias?: string | null): string {
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
    initials: initialsFor(c.name, c.alias),
    primaryStory: c.primary_story ?? null,
    stories,
    factions,
    powers,
  };
}