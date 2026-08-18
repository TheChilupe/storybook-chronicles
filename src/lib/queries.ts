import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { isAllowed } from "@/lib/auth";

const must = <T>(d: T | null, e: any): T => {
  if (e) throw e;
  return d as T;
};

export type PublicStory = {
  id: string;
  slug: string;
  number: number;
  title: string;
  tagline: string | null;
  summary_md: string | null;
  cover_image_url: string | null;
  canon_status: string;
  summary_spoiler_md?: string | null;
};

const publicDb = supabase as any;

async function publicRows(view: string) {
  const { data, error } = await publicDb.from(view).select("*");
  return must(data, error) as any[];
}

async function hasOwnerSession() {
  const { data } = await supabase.auth.getSession();
  return isAllowed(data.session?.user.email);
}

export const storiesQO = queryOptions({
  queryKey: ["stories"],
  queryFn: async () => {
    const owner = await hasOwnerSession();
    const { data, error } = await (owner ? supabase.from("stories") : publicDb.from("public_codex_stories"))
      .select("*").eq("canon_status", "canon").order("number");
    return must(data, error) as PublicStory[];
  },
});
export const storyQO = (slug: string) =>
  queryOptions({
    queryKey: ["story", slug],
    queryFn: async () => {
      const owner = await hasOwnerSession();
      const { data, error } = await (owner ? supabase.from("stories") : publicDb.from("public_codex_stories"))
        .select("*")
        .eq("canon_status", "canon")
        .eq("slug", slug)
        .maybeSingle();
      return must(data, error) as PublicStory | null;
    },
  });

async function loadPublicCharacters(slug?: string): Promise<CharacterWithRelations[]> {
  const [allCharacters, stories, characterStories, factions, characterFactions, powers,
    characterPowers, eras, storyNotes, moments, quotes, relationships] = await Promise.all([
    publicRows("public_codex_characters"),
    publicRows("public_codex_stories"),
    publicRows("public_codex_character_stories"),
    publicRows("public_codex_factions"),
    publicRows("public_codex_character_factions"),
    publicRows("public_codex_power_systems"),
    publicRows("public_codex_character_powers"),
    publicRows("public_codex_character_eras"),
    publicRows("public_codex_character_story_notes"),
    publicRows("public_codex_character_key_moments"),
    publicRows("public_codex_character_quotes"),
    publicRows("public_codex_character_relationships"),
  ]);
  const characters = (slug
    ? allCharacters.filter((character) => character.slug === slug)
    : allCharacters
  ).sort((a, b) => a.name.localeCompare(b.name));
  const byId = (rows: any[]) => new Map(rows.map((row) => [row.id, row]));
  const storyById = byId(stories);
  const factionById = byId(factions);
  const powerById = byId(powers);
  const characterById = byId(allCharacters);
  const rowsFor = (rows: any[], id: string) => rows.filter((row) => row.character_id === id);

  return characters.map((character) => ({
    ...character,
    // Spoiler/editorial columns are intentionally absent from the database view.
    spoiler_md: null,
    primary_story: storyById.get(character.primary_story_id) ?? null,
    character_stories: rowsFor(characterStories, character.id).map((row) => ({
      role: row.role, stories: storyById.get(row.story_id) ?? null,
    })),
    character_factions: rowsFor(characterFactions, character.id).map((row) => ({
      role: row.role, description: row.description, is_spoiler: false,
      factions: factionById.get(row.faction_id) ?? null,
    })),
    character_powers: rowsFor(characterPowers, character.id).map((row) => ({
      notes: row.notes, power_systems: powerById.get(row.power_system_id) ?? null,
    })),
    character_eras: rowsFor(eras, character.id).map((row) => ({
      ...row, is_spoiler: false, story: storyById.get(row.story_id) ?? null,
    })),
    character_story_notes: rowsFor(storyNotes, character.id).map((row) => ({
      ...row, is_spoiler: false, story: storyById.get(row.story_id) ?? null,
    })),
    character_key_moments: rowsFor(moments, character.id).map((row) => ({
      ...row, is_spoiler: false, story: storyById.get(row.story_id) ?? null,
    })),
    character_quotes: rowsFor(quotes, character.id).map((row) => ({ ...row, is_spoiler: false })),
    character_relationships: rowsFor(relationships, character.id).map((row) => ({
      ...row, is_spoiler: false, related: characterById.get(row.related_character_id) ?? null,
    })),
  })) as CharacterWithRelations[];
}

async function loadOwnerCharacters(slug?: string): Promise<CharacterWithRelations[]> {
  let request = supabase
    .from("characters")
    .select(
      `*,
      primary_story:stories!characters_primary_story_id_fkey(id, slug, number, title),
      character_stories(role, stories(id, slug, number, title)),
      character_factions(role, description, is_spoiler, factions(id, slug, name)),
      character_powers(notes, power_systems(id, slug, name)),
      character_eras(id, era_label, identity, function_md, sort_order, is_spoiler, story:stories(id, slug, number, title)),
      character_story_notes(id, role_label, summary_md, sort_order, is_spoiler, story:stories(id, slug, number, title)),
      character_key_moments(id, title, summary_md, sort_order, is_spoiler, story:stories(id, slug, number, title)),
      character_quotes(id, quote_md, context_md, sort_order, is_spoiler),
      character_relationships!character_relationships_character_id_fkey(id, relation_label, inverse_label, sort_order, is_spoiler, related:characters!character_relationships_related_character_id_fkey(id, slug, name, alias, portrait_url, accent_color, canon_status, status, archived_at))`,
    )
    .eq("canon_status", "canon")
    .eq("status", "published")
    .is("archived_at", null)
    .order("name");
  if (slug) request = request.eq("slug", slug);
  const { data, error } = await request;
  return must(data, error) as unknown as CharacterWithRelations[];
}

async function loadCodexCharacters(slug?: string) {
  return (await hasOwnerSession()) ? loadOwnerCharacters(slug) : loadPublicCharacters(slug);
}

export const charactersQO = queryOptions({
  queryKey: ["characters"],
  queryFn: async () => {
    return loadCodexCharacters();
  },
});
export const characterQO = (slug: string) =>
  queryOptions({
    queryKey: ["character", slug],
    queryFn: async () => {
      return (await loadCodexCharacters(slug))[0] ?? null;
    },
  });
export const charactersByStoryQO = (storyId: string) =>
  queryOptions({
    queryKey: ["characters", "story", storyId],
    queryFn: async () => {
      const characters = await loadCodexCharacters();
      return characters.filter((character) =>
        character.primary_story?.id === storyId ||
        character.character_stories.some((entry) => entry.stories?.id === storyId),
      );
    },
  });

export type StoryRef = { id: string; slug: string; number: number | null; title: string };
export type CharacterWithRelations = Tables<"characters"> & {
  primary_story: StoryRef | null;
  character_stories: Array<{ role: string | null; stories: StoryRef | null }>;
  character_factions: Array<{
    role: string | null;
    description: string | null;
    is_spoiler: boolean;
    factions: { id: string; slug: string; name: string } | null;
  }>;
  character_powers: Array<{
    notes: string | null;
    power_systems: { id: string; slug: string; name: string } | null;
  }>;
  character_eras?: Array<{
    id: string;
    era_label: string;
    identity: string;
    function_md: string;
    sort_order: number;
    is_spoiler: boolean;
    story: StoryRef | null;
  }>;
  character_story_notes?: Array<{
    id: string;
    role_label: string | null;
    summary_md: string;
    sort_order: number;
    is_spoiler: boolean;
    story: StoryRef | null;
  }>;
  character_key_moments?: Array<{
    id: string;
    title: string;
    summary_md: string;
    sort_order: number;
    is_spoiler: boolean;
    story: StoryRef | null;
  }>;
  character_quotes?: Array<{
    id: string;
    quote_md: string;
    context_md: string | null;
    sort_order: number;
    is_spoiler: boolean;
  }>;
  character_relationships?: Array<{
    id: string;
    relation_label: string;
    inverse_label: string | null;
    sort_order: number;
    is_spoiler: boolean;
    related: {
      id: string;
      slug: string;
      name: string;
      alias: string | null;
      portrait_url: string | null;
      accent_color: string | null;
      canon_status: string;
    } | null;
  }>;
};

function listQO(view: string) {
  return queryOptions({
    queryKey: [view, "list"],
    queryFn: async () => {
      const { data, error } = await publicDb
        .from(view)
        .select("*")
        .order("name");
      return must(data, error);
    },
  });
}
function detailQO(view: string, slug: string) {
  return queryOptions({
    queryKey: [view, "slug", slug],
    queryFn: async () => {
      const { data, error } = await publicDb
        .from(view)
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      return must(data, error);
    },
  });
}

export const factionsQO = listQO("public_codex_factions");
export const factionQO = (slug: string) => detailQO("public_codex_factions", slug);
export const worldsQO = listQO("public_codex_locations");
export const locationsQO = queryOptions({
  queryKey: ["locations", "list"],
  queryFn: async () => {
    const { data, error } = await publicDb
      .from("public_codex_locations")
      .select("*")
      .order("name");
    return must(data, error);
  },
});
export const worldQO = (slug: string) => detailQO("public_codex_locations", slug);
export const powerSystemsQO = listQO("public_codex_power_systems");
export const powerSystemQO = (slug: string) => detailQO("public_codex_power_systems", slug);

export const spoilerNotesQO = queryOptions({
  queryKey: ["spoiler_notes"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("spoiler_notes")
      .select("*")
      .order("created_at", { ascending: false });
    return must(data, error);
  },
});

/* --------------- Admin queries (all statuses, includes archived toggle) --------------- */

export const adminCharactersQO = queryOptions({
  queryKey: ["admin", "characters"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("characters")
      .select(
        `id, slug, name, alias, role, portrait_url, accent_color, canon_status, status, archived_at, updated_at,
          primary_story:stories!characters_primary_story_id_fkey(id, slug, number, title)`,
      )
      .order("updated_at", { ascending: false });
    return must(data, error);
  },
});

export type AdminCharacterRow = {
  id: string;
  slug: string;
  name: string;
  alias: string | null;
  role: string | null;
  portrait_url: string | null;
  accent_color: string | null;
  canon_status: string;
  status: string;
  archived_at: string | null;
  updated_at: string;
  primary_story: StoryRef | null;
};

export const adminCharacterQO = (id: string) =>
  queryOptions({
    queryKey: ["admin", "character", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("characters")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      return must(data, error);
    },
  });

export const adminStoriesLiteQO = queryOptions({
  queryKey: ["admin", "stories", "lite"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("stories")
      .select("id, slug, number, title")
      .order("number");
    return must(data, error) as StoryRef[];
  },
});

export const adminFactionsQO = queryOptions({
  queryKey: ["admin", "factions"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("factions")
      .select("*")
      .order("updated_at", { ascending: false });
    return must(data, error);
  },
});

export type AdminFactionOption = { id: string; name: string };
export const adminFactionOptionsQO = queryOptions({
  queryKey: ["admin", "factions", "options"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("factions")
      .select("id, name")
      .eq("canon_status", "canon")
      .eq("status", "published")
      .is("archived_at", null)
      .order("name");
    return must(data, error) as AdminFactionOption[];
  },
});

export type AdminCharacterFaction = {
  character_id: string;
  faction_id: string;
  role: string | null;
  description: string | null;
  is_spoiler: boolean;
  faction: AdminFactionOption | null;
};
export const adminCharacterFactionsQO = (characterId: string) =>
  queryOptions({
    queryKey: ["admin", "character", characterId, "factions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("character_factions")
        .select(
          "character_id, faction_id, role, description, is_spoiler, faction:factions(id, name)",
        )
        .eq("character_id", characterId)
        .order("created_at");
      return must(data, error) as AdminCharacterFaction[];
    },
  });

export const adminLocationsQO = queryOptions({
  queryKey: ["admin", "locations"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("worlds")
      .select("*")
      .order("updated_at", { ascending: false });
    return must(data, error);
  },
});
