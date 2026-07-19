import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { characterQO } from "@/lib/queries";
import { toCharacterModel } from "@/lib/character-model";
import { SiteHeader } from "@/components/site-header";
import {
  CharacterProfile,
  CharacterNotFound,
} from "@/components/character-profile";

function metaFromRow(row: {
  name: string;
  alias: string | null;
  tagline: string | null;
  canon_summary_md: string | null;
} | null) {
  if (!row) {
    return {
      meta: [
        { title: "Character not found | Storybook Codex" },
        { name: "robots", content: "noindex" },
      ],
    };
  }
  const display = row.alias || row.name;
  const title = `${display} | Storybook Codex`;
  const raw =
    row.tagline?.trim() ||
    (row.canon_summary_md
      ? row.canon_summary_md.replace(/[#>*_`\-]/g, "").replace(/\s+/g, " ").trim()
      : "");
  const description = raw.length > 160 ? raw.slice(0, 157) + "…" : raw;
  return {
    meta: [
      { title },
      ...(description ? [{ name: "description", content: description }] : []),
      { property: "og:title", content: title },
      ...(description ? [{ property: "og:description", content: description }] : []),
      { property: "og:type", content: "profile" },
    ],
  };
}

export const Route = createFileRoute("/characters/$slug")({
  ssr: false,
  loader: async ({ params, context }) => {
    const row = await context.queryClient.ensureQueryData(characterQO(params.slug));
    if (!row) throw notFound();
    return {
      name: row.name,
      alias: row.alias,
      tagline: row.tagline,
      canon_summary_md: row.canon_summary_md,
    };
  },
  head: ({ loaderData }) => metaFromRow(loaderData ?? null),
  component: CharacterDetailPage,
  errorComponent: ({ error, reset }) => {
    console.error(error);
    return (
      <PageShell>
        <div className="rounded-2xl border border-border bg-card p-10 text-center">
          <h1 className="text-xl font-semibold">This character didn't load</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Something went wrong loading this profile.
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <button
              onClick={reset}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Try again
            </button>
            <Link
              to="/characters"
              className="rounded-md border border-border px-4 py-2 text-sm hover:bg-secondary"
            >
              Back to Characters
            </Link>
          </div>
        </div>
      </PageShell>
    );
  },
  notFoundComponent: () => {
    const { slug } = Route.useParams();
    return (
      <PageShell>
        <CharacterNotFound slug={slug} />
      </PageShell>
    );
  },
});

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}

function CharacterDetailPage() {
  const { slug } = Route.useParams();
  const { data: row } = useSuspenseQuery(characterQO(slug));
  if (!row) throw notFound();
  const m = toCharacterModel(row);
  return (
    <PageShell>
      <CharacterProfile m={m} spoilerBody={m.spoiler} />
    </PageShell>
  );
}