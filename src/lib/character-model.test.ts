/**
 * Spoiler-gating tests for the public character model.
 *
 * Runs on Node's built-in test runner with native TypeScript stripping, so it
 * needs no test framework and no new dependency:
 *
 *     npm test
 *
 * Scope: both reveal states. On the default profile, rows flagged is_spoiler=true
 * must never appear and rows from tables with no spoiler column always must; once
 * spoilers are revealed, the flagged rows come back tagged so the UI can mark them.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { toCharacterModel, isPubliclyVisible } from "./character-model.ts";
import type { CharacterWithRelations, StoryRef } from "./queries.ts";

const story: StoryRef = { id: "s1", slug: "rush", number: 1, title: "Rush" };

const relatedCharacter = (slug: string) => ({
  id: `id-${slug}`,
  slug,
  name: slug,
  alias: null,
  portrait_url: null,
  accent_color: null,
  canon_status: "canon",
});

/** Builds a character row; `over` supplies the child collections under test. */
function makeCharacter(over: Partial<CharacterWithRelations> = {}): CharacterWithRelations {
  return {
    id: "c1",
    slug: "test-character",
    name: "Test Character",
    alias: null,
    canon_summary_md: null,
    identity_md: null,
    story_role_md: null,
    spoiler_md: null,
    eyebrow: null,
    tagline: null,
    role: null,
    accent_color: null,
    portrait_url: null,
    primary_story: story,
    character_stories: [],
    character_factions: [],
    character_powers: [],
    character_eras: [],
    character_story_notes: [],
    character_key_moments: [],
    character_quotes: [],
    character_relationships: [],
    ...over,
  } as unknown as CharacterWithRelations;
}

const era = (id: string, is_spoiler: boolean | null | undefined) => ({
  id,
  era_label: id,
  identity: `identity-${id}`,
  function_md: `function-${id}`,
  sort_order: 1,
  is_spoiler,
  story,
});
const note = (id: string, is_spoiler: boolean | null | undefined) => ({
  id,
  role_label: id,
  summary_md: `summary-${id}`,
  sort_order: 1,
  is_spoiler,
  story,
});
const moment = (id: string, is_spoiler: boolean | null | undefined) => ({
  id,
  title: id,
  summary_md: `summary-${id}`,
  sort_order: 1,
  is_spoiler,
  story,
});
const quote = (id: string, is_spoiler: boolean | null | undefined) => ({
  id,
  quote_md: id,
  context_md: null,
  sort_order: 1,
  is_spoiler,
});
const relationship = (slug: string, is_spoiler: boolean | null | undefined) => ({
  id: `rel-${slug}`,
  relation_label: `relation-${slug}`,
  inverse_label: null,
  sort_order: 1,
  is_spoiler,
  related: relatedCharacter(slug),
});

/* --- 1. non-spoiler rows remain visible --- */

test("non-spoiler child rows render on the public profile", () => {
  const m = toCharacterModel(
    makeCharacter({
      character_eras: [era("public-era", false)],
      character_story_notes: [note("public-note", false)],
      character_key_moments: [moment("public-moment", false)],
      character_quotes: [quote("public-quote", false)],
      character_relationships: [relationship("public-rel", false)],
    } as Partial<CharacterWithRelations>),
  );

  assert.equal(m.progression.length, 1, "era should render");
  assert.equal(m.storyProgression.length, 1, "story note should render");
  assert.equal(m.keyMoments.length, 1, "key moment should render");
  assert.equal(m.quotes.length, 1, "quote should render");
  assert.equal(m.relationshipCards.length, 1, "relationship should render");
});

/* --- 2. spoiler rows are excluded --- */

test("spoiler child rows are excluded from the public profile", () => {
  const m = toCharacterModel(
    makeCharacter({
      character_eras: [era("secret-era", true)],
      character_story_notes: [note("secret-note", true)],
      character_key_moments: [moment("secret-moment", true)],
      character_quotes: [quote("secret-quote", true)],
      character_relationships: [relationship("secret-rel", true)],
    } as Partial<CharacterWithRelations>),
  );

  assert.deepEqual(m.progression, [], "spoiler era must be hidden");
  assert.deepEqual(m.storyProgression, [], "spoiler story note must be hidden");
  assert.deepEqual(m.keyMoments, [], "spoiler key moment must be hidden");
  assert.deepEqual(m.quotes, [], "spoiler quote must be hidden");
  assert.deepEqual(m.relationshipCards, [], "spoiler relationship must be hidden");
});

/* --- 3 & 4. mixed rows, across every spoiler-capable collection --- */

test("mixed rows return only public ones, for every spoiler-capable collection", () => {
  const m = toCharacterModel(
    makeCharacter({
      character_eras: [era("keep", false), era("hide", true)],
      character_story_notes: [note("keep", false), note("hide", true)],
      character_key_moments: [moment("keep", false), moment("hide", true)],
      character_quotes: [quote("keep", false), quote("hide", true)],
      character_relationships: [relationship("keep", false), relationship("hide", true)],
    } as Partial<CharacterWithRelations>),
  );

  assert.deepEqual(m.progression.map((p) => p.era), ["keep"]);
  assert.deepEqual(m.storyProgression.map((p) => p.role), ["keep"]);
  assert.deepEqual(m.keyMoments.map((k) => k.title), ["keep"]);
  assert.deepEqual(m.quotes.map((q) => q.quote), ["keep"]);
  assert.deepEqual(m.relationshipCards.map((r) => r.characterSlug), ["keep"]);
});

/* --- 5. tables with no spoiler concept are unaffected --- */

test("collections from tables without is_spoiler are never filtered", () => {
  const m = toCharacterModel(
    makeCharacter({
      character_stories: [{ role: "lead", stories: story }],
      character_factions: [{ role: "founder", factions: { id: "f1", slug: "the-order", name: "The Order" } }],
      character_powers: [{ notes: "n", power_systems: { id: "p1", slug: "erasure", name: "Erasure" } }],
    } as Partial<CharacterWithRelations>),
  );

  assert.equal(m.stories.length, 1, "character_stories has no spoiler column");
  assert.equal(m.factions.length, 1, "character_factions has no spoiler column");
  assert.equal(m.powers.length, 1, "character_powers has no spoiler column");
});

/* --- absent flags must not hide content --- */

test("null or undefined is_spoiler is treated as public", () => {
  const m = toCharacterModel(
    makeCharacter({
      character_eras: [era("null-flag", null), era("undefined-flag", undefined)],
    } as Partial<CharacterWithRelations>),
  );

  assert.equal(m.progression.length, 2, "absent flag must not hide a row");
  assert.equal(isPubliclyVisible({ is_spoiler: null }), true);
  assert.equal(isPubliclyVisible({ is_spoiler: undefined }), true);
  assert.equal(isPubliclyVisible({}), true);
  assert.equal(isPubliclyVisible({ is_spoiler: false }), true);
  assert.equal(isPubliclyVisible({ is_spoiler: true }), false);
});

/* --- the spoiler_md body itself is still carried (gated by SpoilerSection) --- */

test("spoiler_md is still passed through for the reveal-toggle section", () => {
  const m = toCharacterModel(makeCharacter({ spoiler_md: "secret body" } as Partial<CharacterWithRelations>));
  assert.equal(m.spoiler, "secret body");
});

/* --- revealed profile: spoiler rows come back, tagged --- */

const mixedCharacter = () =>
  makeCharacter({
    character_eras: [era("keep", false), era("hide", true)],
    character_story_notes: [note("keep", false), note("hide", true)],
    character_key_moments: [moment("keep", false), moment("hide", true)],
    character_quotes: [quote("keep", false), quote("hide", true)],
    character_relationships: [relationship("keep", false), relationship("hide", true)],
  } as Partial<CharacterWithRelations>);

test("revealing spoilers re-includes every spoiler row", () => {
  const m = toCharacterModel(mixedCharacter(), { revealed: true });

  assert.deepEqual(m.progression.map((p) => p.era).sort(), ["hide", "keep"]);
  assert.deepEqual(m.storyProgression.map((p) => p.role).sort(), ["hide", "keep"]);
  assert.deepEqual(m.keyMoments.map((k) => k.title).sort(), ["hide", "keep"]);
  assert.deepEqual(m.quotes.map((q) => q.quote).sort(), ["hide", "keep"]);
  assert.deepEqual(m.relationshipCards.map((r) => r.characterSlug).sort(), ["hide", "keep"]);
});

test("revealed rows carry isSpoiler so the UI can mark them", () => {
  const m = toCharacterModel(mixedCharacter(), { revealed: true });
  const flagOf = (items: Array<{ isSpoiler: boolean }>, i: number) => items[i].isSpoiler;

  const byEra = Object.fromEntries(m.progression.map((p) => [p.era, p.isSpoiler]));
  assert.equal(byEra.keep, false, "a public row must not be marked as a spoiler");
  assert.equal(byEra.hide, true, "a revealed spoiler row must be marked");

  // Every other collection tags its rows the same way.
  const byTitle = Object.fromEntries(m.keyMoments.map((k) => [k.title, k.isSpoiler]));
  assert.deepEqual(byTitle, { keep: false, hide: true });
  const byQuote = Object.fromEntries(m.quotes.map((q) => [q.quote, q.isSpoiler]));
  assert.deepEqual(byQuote, { keep: false, hide: true });
  const bySlug = Object.fromEntries(m.relationshipCards.map((r) => [r.characterSlug, r.isSpoiler]));
  assert.deepEqual(bySlug, { keep: false, hide: true });
  const byRole = Object.fromEntries(m.storyProgression.map((s) => [s.role, s.isSpoiler]));
  assert.deepEqual(byRole, { keep: false, hide: true });

  assert.equal(typeof flagOf(m.progression, 0), "boolean");
});

test("the default profile marks nothing as a spoiler", () => {
  const m = toCharacterModel(mixedCharacter());
  const flags = [
    ...m.progression,
    ...m.storyProgression,
    ...m.keyMoments,
    ...m.quotes,
    ...m.relationshipCards,
  ].map((r) => r.isSpoiler);

  assert.equal(flags.length, 5, "one public row survives per collection");
  assert.ok(
    flags.every((f) => f === false),
    "nothing on the un-revealed profile may be marked as a spoiler",
  );
});

test("revealed=false is identical to omitting the option", () => {
  const explicit = toCharacterModel(mixedCharacter(), { revealed: false });
  const implicit = toCharacterModel(mixedCharacter());
  assert.deepEqual(explicit, implicit);
});

/* --- the reveal toggle must survive when spoiler_md is absent --- */

test("hasSpoilerRows reports structured spoiler content in either reveal state", () => {
  for (const revealed of [false, true]) {
    assert.equal(
      toCharacterModel(mixedCharacter(), { revealed }).hasSpoilerRows,
      true,
      `spoiler rows must be reported when revealed=${revealed}`,
    );
  }

  const noSpoilers = toCharacterModel(
    makeCharacter({
      character_eras: [era("keep", false)],
      character_quotes: [quote("keep", null)],
    } as Partial<CharacterWithRelations>),
  );
  assert.equal(noSpoilers.hasSpoilerRows, false, "public-only rows must not offer a reveal toggle");
});

test("a character with spoiler rows but no spoiler_md still reports hidden content", () => {
  const m = toCharacterModel(
    makeCharacter({ spoiler_md: null, character_quotes: [quote("hide", true)] } as Partial<CharacterWithRelations>),
  );
  assert.equal(m.spoiler, null);
  assert.equal(m.quotes.length, 0, "still hidden by default");
  assert.equal(m.hasSpoilerRows, true, "but the toggle must be offered");
});
