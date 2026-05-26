import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { storyQO, charactersByStoryQO } from "@/lib/queries";
import { EntityPage } from "@/components/entity-page";
import { Markdown } from "@/components/markdown";
import { SpoilerSection } from "@/components/spoiler-section";

export const Route = createFileRoute("/stories/$slug")({
  component: StoryPage,
});

function StoryPage() {
  const { slug } = Route.useParams();
  const { data: story } = useQuery(storyQO(slug));
  const { data: cast = [] } = useQuery({ ...charactersByStoryQO(story?.id ?? ""), enabled: !!story?.id });
  if (story === null) throw notFound();
  if (!story) return <EntityPage title="Loading…"><p /></EntityPage>;
  return (
    <EntityPage title={`Story ${story.number} — ${story.title}`}>
      <p className="text-lg text-muted-foreground">{story.tagline}</p>
      <section className="mt-6 rounded-2xl border border-border bg-card p-6">
        <Markdown>{story.summary_md ?? ""}</Markdown>
      </section>
      <SpoilerSection scope={`story-${story.slug}`} body={story.summary_spoiler_md ?? ""} />
      {cast.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-xl font-semibold">Cast</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {cast.map((c) => (
              <Link key={c.id} to={"/characters/$slug" as any} params={{ slug: c.slug } as any}
                className="rounded-xl border border-border bg-card p-4 hover:border-primary"
                style={{ borderLeft: `4px solid ${c.accent_color}` }}>
                <h3 className="font-semibold">{c.name}{c.alias ? ` / ${c.alias}` : ""}</h3>
                <p className="text-sm text-muted-foreground">{c.tagline}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </EntityPage>
  );
}