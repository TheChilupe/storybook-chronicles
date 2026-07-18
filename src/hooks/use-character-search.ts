import { useMemo } from "react";

export type SearchableCharacter = {
  id: string;
  slug: string;
  displayName: string;
  realName?: string | null;
  heroName?: string | null;
  aliases: string[];
  story?: string | null;
  role?: string | null;
  description?: string | null;
  tags: string[];
  powers: string[];
  accent?: string | null;
  eyebrow?: string | null;
  tagline?: string | null;
};

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();

function haystack(c: SearchableCharacter): string {
  return norm(
    [
      c.displayName,
      c.realName,
      c.heroName,
      ...(c.aliases ?? []),
      c.story,
      c.role,
      c.description,
      c.eyebrow,
      c.tagline,
      ...(c.tags ?? []),
      ...(c.powers ?? []),
    ]
      .filter(Boolean)
      .join(" | "),
  );
}

export function useCharacterSearch<T extends SearchableCharacter>(
  characters: T[],
  query: string,
): T[] {
  return useMemo(() => {
    const q = norm(query);
    if (!q) return characters;
    const terms = q.split(" ").filter(Boolean);
    return characters.filter((c) => {
      const hay = haystack(c);
      return terms.every((t) => hay.includes(t));
    });
  }, [characters, query]);
}