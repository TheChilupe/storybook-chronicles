import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

const must = <T,>(d: T | null, e: any): T => { if (e) throw e; return d as T; };

export const storiesQO = queryOptions({
  queryKey: ["stories"],
  queryFn: async () => {
    const { data, error } = await supabase.from("stories").select("*").order("number");
    return must(data, error);
  },
});
export const storyQO = (slug: string) => queryOptions({
  queryKey: ["story", slug],
  queryFn: async () => {
    const { data, error } = await supabase.from("stories").select("*").eq("slug", slug).maybeSingle();
    return must(data, error);
  },
});

export const charactersQO = queryOptions({
  queryKey: ["characters"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("characters")
      .select(
        `*,
          primary_story:stories!characters_primary_story_id_fkey(id, slug, number, title),
          character_stories(role, stories(id, slug, number, title)),
          character_factions(role, factions(id, slug, name)),
          character_powers(notes, power_systems(id, slug, name))`,
      )
      .eq("canon_status", "canon")
      .eq("status", "published")
      .is("archived_at", null)
      .order("name");
    return must(data, error) as CharacterWithRelations[];
  },
});
export const characterQO = (slug: string) => queryOptions({
  queryKey: ["character", slug],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("characters")
      .select(
        `*,
          primary_story:stories!characters_primary_story_id_fkey(id, slug, number, title),
          character_stories(role, stories(id, slug, number, title)),
          character_factions(role, factions(id, slug, name)),
          character_powers(notes, power_systems(id, slug, name)),
          character_eras(id, era_label, identity, function_md, sort_order, is_spoiler, story:stories(id, slug, number, title)),
          character_story_notes(id, role_label, summary_md, sort_order, is_spoiler, story:stories(id, slug, number, title)),
          character_key_moments(id, title, summary_md, sort_order, is_spoiler, story:stories(id, slug, number, title)),
          character_quotes(id, quote_md, context_md, sort_order, is_spoiler),
          character_relationships!character_relationships_character_id_fkey(id, relation_label, inverse_label, sort_order, is_spoiler, related:characters!character_relationships_related_character_id_fkey(id, slug, name, alias, portrait_url, accent_color, canon_status))`,
      )
      .eq("canon_status", "canon")
      .eq("slug", slug)
      .maybeSingle();
    return must(data, error) as CharacterWithRelations | null;
  },
});
export const charactersByStoryQO = (storyId: string) => queryOptions({
  queryKey: ["characters", "story", storyId],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("characters")
      .select("*")
      .eq("canon_status", "canon")
      .eq("story_id", storyId)
      .order("name");
    return must(data, error);
  },
});

export type StoryRef = { id: string; slug: string; number: number | null; title: string };
export type CharacterWithRelations = Tables<"characters"> & {
  primary_story: StoryRef | null;
  character_stories: Array<{ role: string | null; stories: StoryRef | null }>;
  character_factions: Array<{ role: string | null; factions: { id: string; slug: string; name: string } | null }>;
  character_powers: Array<{ notes: string | null; power_systems: { id: string; slug: string; name: string } | null }>;
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

function listQO<T extends string>(table: T) {
  return queryOptions({
    queryKey: [table, "list"],
    queryFn: async () => {
      const { data, error } = await supabase.from(table as any).select("*").order("name");
      return must(data, error);
    },
  });
}
function detailQO<T extends string>(table: T, slug: string) {
  return queryOptions({
    queryKey: [table, "slug", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from(table as any).select("*").eq("slug", slug).maybeSingle();
      return must(data, error);
    },
  });
}

export const factionsQO = listQO("factions");
export const factionQO = (slug: string) => detailQO("factions", slug);
export const worldsQO = listQO("worlds");
export const worldQO = (slug: string) => detailQO("worlds", slug);
export const powerSystemsQO = listQO("power_systems");
export const powerSystemQO = (slug: string) => detailQO("power_systems", slug);

export const spoilerNotesQO = queryOptions({
  queryKey: ["spoiler_notes"],
  queryFn: async () => {
    const { data, error } = await supabase.from("spoiler_notes").select("*").order("created_at", { ascending: false });
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

export const adminCharacterQO = (id: string) => queryOptions({
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