import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listCharacters from "./tools/list-characters";
import getCharacter from "./tools/get-character";
import listStories from "./tools/list-stories";

// Direct Supabase host, not the .lovable.cloud proxy — mcp-js validates the
// issuer against the discovery document (RFC 8414). VITE_SUPABASE_PROJECT_ID
// is inlined at build time by Vite.
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "storybook-codex-mcp",
  title: "Storybook Codex",
  version: "0.1.0",
  instructions:
    "Tools for the Storybook Chronicles Codex — a private lore bible and portfolio for Alexander Chilupe. Use list_stories and list_characters to browse the saga, and get_character to fetch a full profile by slug.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listStories, listCharacters, getCharacter],
});