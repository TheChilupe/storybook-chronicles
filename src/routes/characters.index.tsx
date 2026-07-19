import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { charactersQO } from "@/lib/queries";
import { toCharacterModel } from "@/lib/character-model";
import { EntityPage } from "@/components/entity-page";
import { CharacterSearch } from "@/components/character-search";
import { CharacterCard } from "@/components/character-card";
import { useCharacterSearch } from "@/hooks/use-character-search";

const searchSchema = z.object({
  search: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/characters/")({
  head: () => ({ meta: [{ title: "Characters — Storybook Codex" }] }),
  validateSearch: zodValidator(searchSchema),
  component: CharactersIndex,
});

function CharactersIndex() {
  const { search } = Route.useSearch();
  const navigate = useNavigate({ from: "/characters/" });
  const { data: characters = [] } = useQuery(charactersQO);

  const items = useMemo(
    () => characters.map(toCharacterModel),
    [characters],
  );

  const filtered = useCharacterSearch(items, search);

  const setSearch = (v: string) => {
    navigate({
      search: (prev: { search?: string }) => ({ ...prev, search: v || undefined }),
      replace: true,
    });
  };

  const clear = () => setSearch("");

  const total = items.length;
  const count = filtered.length;
  const isSearching = search.trim().length > 0;
  const countLabel = isSearching
    ? `${count} ${count === 1 ? "character" : "characters"} found`
    : `${total} ${total === 1 ? "character" : "characters"}`;

  return (
    <EntityPage title="Characters">
      <p className="mb-6 text-muted-foreground">
        Browse the cast across the Storybook Chronicles.
      </p>

      <div className="mb-3">
        <CharacterSearch value={search} onChange={setSearch} />
      </div>

      <p
        aria-live="polite"
        className="mb-6 text-sm text-muted-foreground"
      >
        {countLabel}
      </p>

      {filtered.length === 0 ? (
        <div
          role="status"
          aria-live="polite"
          className="rounded-2xl border border-border bg-card p-10 text-center"
        >
          <h2 className="text-lg font-semibold">No characters found</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Try another name, alias, story, role, or ability.
          </p>
          <button
            type="button"
            onClick={clear}
            className="mt-5 inline-flex items-center rounded-full border border-border bg-background px-4 py-2 text-sm transition hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <CharacterCard key={c.id} c={c} />
          ))}
        </div>
      )}
    </EntityPage>
  );
}