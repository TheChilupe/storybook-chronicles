import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";

function db(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "get_character",
  title: "Get character",
  description: "Fetch a canon character's full profile by slug, including joined stories, factions, and power systems.",
  inputSchema: {
    slug: z.string().trim().min(1).describe("Character slug, e.g. 'flare' or 'rush'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ slug }, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const { data, error } = await db(ctx)
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
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!data) return { content: [{ type: "text", text: `No canon character with slug '${slug}'.` }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { character: data },
    };
  },
});