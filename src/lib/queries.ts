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
          character_powers(notes, power_systems(id, slug, name))`,
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