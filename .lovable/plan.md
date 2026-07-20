# Admin Portal V0.1 — Review Against Existing Repo

## Conflicts between the prompt and current reality

The prompt assumes a public site with an admin overlay. This codex is not that. Before we build, you need to know:

1. **The entire site is already owner-only.** Every table has one RLS policy: `TO authenticated USING (is_owner())`, where `is_owner()` = `auth.jwt() ->> 'email' = 'thechilupe@gmail.com'`. There are no public read policies anywhere. Characters, stories, everything: only you can read them at all.
2. **There is no "public vs draft" concept in the schema.** `characters.canon_status` exists (default `'canon'`) and the character list filters `canon_status = 'canon'`, but that's a canon/non-canon flag, not a publication workflow. No `status`, no `published_at`, no `is_admin`, no `profiles`, no `user_roles` table.
3. **The allowlist is hardcoded in three places**, not just the frontend: `src/lib/auth.ts` (`ALLOWED_EMAIL`), the `login.tsx` gate, and the DB function `public.is_owner()`. The prompt says "do not hardcode an email in frontend components" — fine — but the DB itself is hardcoded to that email too. That is the current authorization model.
4. **Portfolio routes (`/`, `/about`, `/portfolio`, `/skills`, `/resume`, `/contact`) are the only truly public surface.** All codex data (`/characters`, `/stories`, character detail pages) already requires sign-in as you. So "public users can only read published content" as written in the prompt does not describe this app.
5. **Powers are already relational** (`character_powers` join → `power_systems`), not a per-character list of freeform powers. Prompt section 9 assumes freeform power records; that would be a second system. Reusing the existing shape means editing membership + notes, and editing `power_systems` rows separately (out of scope for V0.1).
6. **Story Appearances = `character_stories`.** The join carries only `role`. There is no major/supporting/cameo classification, no appearance order column. Adding those is a schema change, not "reuse existing."
7. **`character_relationships` has no notes field and no inverse-mirror rows.** `inverse_label` exists as a text column but nothing writes reciprocal rows. Query is one-directional (`character_relationships_character_id_fkey`). Prompt's "optional private/public notes" doesn't map to an existing column.
8. **Gallery: not implemented.** No table, no bucket layout. Prompt says "expose basic gallery controls if it exists" — it doesn't. Skip.
9. **Portrait upload uses signed URLs (10-year expiry) into a private `lore-images` bucket** because the workspace blocks public buckets. Reuse as-is; don't try to make it public.
10. **`is_admin` / user roles system**: doesn't exist. The prompt's preferred "smallest secure solution" is a `user_roles` table with `has_role()` — but for a genuinely single-user codex that adds ceremony without changing who can log in. Cheapest honest option: keep `is_owner()` as the DB gate and rename the concept to "owner" in the UI. If you want to eventually invite a co-author, we add `user_roles` then.

## Security risks in the prompt as written

- **Publication workflow implies public reads.** If we add `status ∈ {draft, imported, needs_review, published}` and then add a policy that lets `anon` read `status='published'` rows, we've just opened the entire codex to the internet. Today only you can read *any* character. Do not add public read policies as part of V0.1.
- **Deletion / cascade.** All child tables `ON DELETE CASCADE` from `characters`. A hard character delete wipes eras, quotes, relationships, key moments, story notes, faction/world/power/story joins. Prompt section 19 says "prefer soft deletion" — schema doesn't support it yet; add `archived_at` if you want soft delete.
- **Slug change.** No redirect table exists. Changing a published slug 404s all inbound links. Warn only; don't rewrite.

## Missing fields (what a real V0.1 needs to add)

Minimum viable, additive only:

- `characters.status text NOT NULL DEFAULT 'draft'` with a CHECK for `('draft','imported','needs_review','published')`. Backfill existing rows to `'published'` so nothing disappears.
- `characters.archived_at timestamptz` (soft delete flag; list view hides archived).
- `characters.updated_by uuid` (nullable; set from `auth.uid()` on write).
- Optional: `character_stories.appearance_kind text` (`'major'|'supporting'|'cameo'`) and `sort_order int` — only if you actually want to edit these in V0.1. Otherwise defer.

No new tables. No `profiles`. No `user_roles`. `is_owner()` stays the authorization boundary.

## Smallest safe implementation plan

### Phase A — Schema (one migration)
- Add `status`, `archived_at`, `updated_by` to `characters` with defaults/backfill.
- Add optional `appearance_kind` + `sort_order` on `character_stories` if we want the Story Appearances editor in this pass; otherwise skip.
- No RLS changes. `is_owner()` continues to gate everything.
- Update `charactersQO` to filter `archived_at IS NULL` (keep `canon_status='canon'` too). Public character detail keeps working for `status='published'` — but since the whole site is owner-only, "public" here means "you, signed in." That's the honest description.

### Phase B — Admin shell
- New pathless layout `src/routes/_admin.tsx` that reuses `useAuth()` and redirects non-owners to `/login`. No new auth system.
- `/admin` dashboard: 4 count cards (Total, Published, Draft, Needs Review) + link to Manage Characters. Future categories rendered as disabled chips.
- Route file naming: `_admin.index.tsx`, `_admin.characters.index.tsx`, `_admin.characters.$id.tsx`, `_admin.characters.new.tsx`.

### Phase C — Character list `/admin/characters`
- Reuse `charactersQO` variant that includes drafts + archived toggle. Search over name/alias/slug. Filters: status, canon, primary story. Desktop table, mobile cards.
- Row actions: Edit, Preview (opens `/characters/$slug` in new tab, only enabled if not archived).

### Phase D — Basics + Narrative + Media editor `/admin/characters/$id`
- Tabs (desktop) / accordion (tablet+mobile): Basics, Identity, Narrative, Powers, Progression, Story Progression, Relationships, Key Moments, Quotes, Story Appearances, Media, Publishing.
- V0.1 ships **Basics, Narrative, Media, Publishing** fully working. The repeatable sections (Powers/Progression/Story Progression/Relationships/Key Moments/Quotes/Story Appearances) render as read-only lists this pass, with an "Edit in next release" note. This is the "smallest safe" cut — the biggest source of bugs is the child-record editors, and doing them all at once against 6 tables is where partial-save data loss happens.
- Save model: explicit Save button per section, optimistic disable, toast on success/error, `beforeunload` guard on dirty forms.
- Slug: auto-suggest on create, editable, uniqueness check on blur, warning modal when editing a published character's slug.

### Phase E — Publishing controls
- Publishing tab: current status, buttons Save Draft / Mark Needs Review / Publish / Unpublish / Archive. Publish requires confirm + a soft check that Overview + Portrait + Primary Story are set (warn, don't block).
- Archive = set `archived_at`. Delete lives in a Danger Zone that requires typing the display name; hard delete stays available but explicitly warns about cascade.

### Phase F — Repeatable-section editors (defer to V0.2)
- Eras, Story Notes, Key Moments, Quotes, Relationships editors. Each is small individually but cumulatively the risky part. Ship after V0.1 stabilises.

### Phase G — QA
- Confirm existing `/characters`, `/characters/$slug`, search, portrait upload, MCP tools, and portfolio pages behave identically. Confirm draft characters do not appear in `/characters`. Confirm the admin routes 404 for signed-out visitors and redirect owners in. tsgo + build.

## What I explicitly recommend cutting from the prompt for V0.1

- User-roles / `is_admin` system (keep `is_owner()`).
- Publication policy that exposes rows to `anon` (do not add public read policies).
- Gallery editor (no schema).
- Story Appearances classification (schema change, low value now).
- Repeatable-section editors (Phase F above).
- Preview route for drafts (`/characters/$slug` already renders whatever is in the DB for the owner — reuse it; a preview flag is not needed).
- Internal notes column (no field exists; adding one now is scope creep).

## Open questions before I write the plan for real

1. Confirm: keep `is_owner()` as the sole authorization gate, or do you want a `user_roles` table now to prepare for a second editor later?
2. Confirm: `status='published'` stays owner-only reads (no anonymous public reads) — publish means "visible on your signed-in codex", not "visible to the internet". Yes/no?
3. V0.1 = Basics + Narrative + Media + Publishing only, with repeatable sections read-only? Or do you want at least one repeatable editor (e.g. Quotes) in the first cut?
