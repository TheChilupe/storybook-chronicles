import { useMemo } from "react";
import type { CharacterModel } from "@/lib/character-model";
import { storyLabel } from "@/lib/character-model";

export type SearchableCharacter = CharacterModel;

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();

function haystack(c: SearchableCharacter): string {
  const storyLabels = [
    storyLabel(c.primaryStory),
    ...c.stories.map((s) => storyLabel(s.story)),
  ];
  return norm(
    [
      c.displayName,
      c.heroName,
      c.role,
      c.eyebrow,
      c.tagline,
      ...storyLabels,
      ...c.factions.map((f) => f.name),
      ...c.powers.map((p) => p.name),
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