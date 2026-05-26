## Goal
Turn the static Storybook-Codex HTML site into a private, database-backed lore bible for `thechilupe@gmail.com` only, built on this Lovable project (TanStack Start + React + Lovable Cloud).

## 1. Single-user access (`thechilupe@gmail.com`)
Lovable Cloud auth itself is open to anyone who signs up, so "only this email" is enforced as an allowlist:

- Enable Lovable Cloud.
- Enable Email + Password auth (and Google sign-in, optional — same allowlist applies).
- Hardcode an allowlist: `const ALLOWED_EMAILS = ["thechilupe@gmail.com"]`.
- Root layout: if no session OR session email not in allowlist → redirect to `/login`.
- Server functions: `requireSupabaseAuth` middleware + a second check that rejects any user whose email isn't in the allowlist (defense in depth so RLS-bypassing reads can't leak to other accounts).
- RLS on every table: `auth.jwt() ->> 'email' = 'thechilupe@gmail.com'`.
- No public signup UI — login page is sign-in only. Account creation: you sign up once via the login page; everyone else who tries gets blocked at the allowlist check.

## 2. Data model (Lovable Cloud / Postgres)
Tables:
- `stories` — id, slug, number, title, tagline, summary_md, summary_spoiler_md, cover_image_url
- `characters` — id, slug, name, alias, role, story_id (fk), eyebrow, tagline, canon_summary_md, identity_md, story_role_md, spoiler_md, portrait_url, accent_color
- `factions` — id, slug, name, summary_md, spoiler_md, image_url
- `worlds` — id, slug, name, summary_md, spoiler_md, image_url
- `power_systems` — id, slug, name, summary_md, spoiler_md
- `spoiler_notes` — id, title, body_md, related_story_id (nullable)
- `character_factions`, `character_worlds`, `character_powers` — join tables for cross-linking

All text bodies are markdown. RLS: only the allowlisted email can SELECT/INSERT/UPDATE/DELETE.

Storage bucket `lore-images` (private) for character art, panel art, backgrounds — replaces the current `/images` folder. Filenames normalized (lowercase, no spaces).

## 3. Routes (TanStack Start)
```
src/routes/
  __root.tsx                 -> session + allowlist gate, shared nav/footer
  login.tsx                  -> email/password sign-in only
  index.tsx                  -> hero (cloud bg + logo), series summary, 4 story panels
  _authenticated.tsx         -> layout that enforces auth + allowlist
  _authenticated/
    stories.index.tsx        -> list of stories
    stories.$slug.tsx        -> story detail + cast + panel art
    characters.index.tsx     -> grid of all characters with themed cards
    characters.$slug.tsx     -> full character profile (Rush/Azul/Blue Knight/Tim, plus new ones)
    factions.index.tsx + factions.$slug.tsx
    worlds.index.tsx + worlds.$slug.tsx
    power-systems.index.tsx + power-systems.$slug.tsx
    spoiler-notes.tsx
    admin/index.tsx          -> dashboard
    admin/$entity.$id.tsx    -> editor (markdown + image upload) for any entity
```

## 4. Spoiler toggle (per page)
- Each entity has spoiler-free fields + a `*_spoiler_md` field.
- A global `useSpoilers()` store (zustand or React context, persisted in localStorage) tracks `spoilersEnabled` plus per-entity overrides.
- Every detail page shows a "Reveal spoilers" toggle in the header. Spoiler sections render with a distinct treatment (red-tinted border + "SPOILERS" label) and stay hidden until toggled.
- Spoiler notes route lists all spoiler-flagged content in one place.

## 5. Design (port the current look, modernized)
- Carry over the dark navy (`#0b0f17`) + electric blue (`#2563eb`) palette as semantic tokens in `src/styles.css` (oklch).
- Per-character accent colors stored on the `characters` row (Rush, Azul, Blue Knight, Tim Malcolm + future) so each profile hero keeps the themed feel from `rush-profile-hero` etc.
- Reuse `main-cloud-bg.jpg` for the homepage hero, `logo-white.png` for the brand mark.
- Mobile-first responsive (the current site has no viewport meta — fix that).
- Proper `<head>` per route (title, description, og:title/description, og:image from cover_image_url where available).

## 6. Migration of existing content (seed script)
Run once after schema is created:
- 4 stories (Rush, Azul, Blue Knight, Tim Malcolm) with summaries from current HTML.
- 4 characters with the body text from `rush.html`, `azul.html`, `blue-knight.html`, `tim-malcolm.html`.
- Upload the existing images in `/images` to the `lore-images` bucket with cleaned-up filenames; store URLs on the rows.
- Skip empty pages (`factions.html`, `world.html`, `power-systems.html`, `spoiler-notes.html`) — those tables start empty and you fill them via the admin editor.

## 7. Cleanups baked in
- Drop `script.js` and `desktop.ini` (don't carry over).
- Fix the `worlds.html` vs `world.html` mismatch (canonical slug `/worlds`).
- Remove broken `character-page.html` placeholders.
- Make all story cards real links.

## 8. Build order
1. Enable Lovable Cloud.
2. Migration: create tables + RLS scoped to the allowlisted email.
3. Auth: login page, `__root.tsx` gate, `_authenticated` layout, allowlist helper.
4. Design tokens + shared layout/nav/footer + spoiler-toggle store.
5. Public routes: index (homepage hero) — readable only when signed in as you.
6. Lore routes: stories, characters, factions, worlds, power-systems, spoiler-notes (list + detail).
7. Admin editor (markdown + image upload) for all entities.
8. Seed script that imports the 4 stories, 4 characters, and migrates images.
9. Polish: SEO meta, mobile pass, 404 handling.

## Technical details
- Auth: `requireSupabaseAuth` middleware + allowlist check (`context.claims.email !== ALLOWED_EMAIL → throw 403`).
- RLS policy template:
  ```sql
  create policy "owner only" on stories
    for all to authenticated
    using (auth.jwt() ->> 'email' = 'thechilupe@gmail.com')
    with check (auth.jwt() ->> 'email' = 'thechilupe@gmail.com');
  ```
- Data fetching: `createServerFn` → `queryClient.ensureQueryData` in loaders → `useSuspenseQuery` in components.
- Markdown rendering: `react-markdown` + `remark-gfm`.
- Image uploads via Supabase Storage, signed URLs for private bucket.
- Spoiler state: lightweight zustand store, persisted to localStorage.

## Notes
- "Only this email" is enforced by allowlist, not by Supabase auth itself. If you later want stronger isolation, the same allowlist pattern still works; we'd just add more emails or move to invite-only.
- If you want Google sign-in too, the allowlist still gates it — say the word and I'll wire it in.
