import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/site-header";
import { storiesQO } from "@/lib/queries";
import { Markdown } from "@/components/markdown";
import cloudBg from "@/assets/main-cloud-bg.jpg";
import logo from "@/assets/logo-white.png";
import storyRush from "@/assets/story-1-rush.jpg";
import storyAzul from "@/assets/story-2-azul.jpg";
import storyBlueKnight from "@/assets/story-3-blue-knight.jpg";
import storyTim from "@/assets/story-4-tim.jpg";

const STORY_IMAGES: Record<string, string> = {
  rush: storyRush,
  azul: storyAzul,
  "blue-knight": storyBlueKnight,
  "tim-malcolm": storyTim,
};

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Storybook Chronicles Codex" }] }),
  component: Index,
});

function Index() {
  const { data: stories = [] } = useQuery(storiesQO);
  return (
    <div className="bg-background text-foreground">
      <SiteHeader />
      <section
        className="relative flex min-h-[88vh] flex-col items-center justify-center overflow-hidden px-6 py-24 text-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(11,15,23,0.55), rgba(11,15,23,0.85) 75%, var(--color-background)), url(${cloudBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.7), transparent 60%), radial-gradient(1px 1px at 70% 60%, rgba(255,255,255,0.6), transparent 60%), radial-gradient(1.5px 1.5px at 40% 80%, rgba(255,255,255,0.5), transparent 60%), radial-gradient(1px 1px at 85% 20%, rgba(255,255,255,0.65), transparent 60%), radial-gradient(1px 1px at 10% 75%, rgba(255,255,255,0.55), transparent 60%)",
          }}
        />
        <img
          src={logo}
          alt="Storybook Chronicles"
          className="relative h-40 w-40 drop-shadow-[0_0_45px_rgba(120,170,255,0.55)] sm:h-48 sm:w-48"
        />
        <h1 className="relative mt-8 text-5xl font-bold tracking-tight sm:text-7xl">
          Storybook Chronicles
        </h1>
        <p className="relative mt-5 max-w-2xl text-lg text-foreground/85 sm:text-xl">
          A multigenerational epic across heroes, gods, galaxies, and the lies that bind them all.
        </p>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-3 text-xl font-semibold">💠 Series Summary</h2>
          <Markdown>
            {`Storybook Chronicles is a multigenerational action-fantasy saga about power, faith, legacy, free will, and the danger of false gods. Beginning with **Rush**, the first modern hero, the series expands from Earth-based superhero conflicts into cosmic wars involving Storybooks, Omegas, Builder, Jagon, alien civilizations, and reality-shaping forces.\n\nEach major protagonist reflects a different relationship to power: **Rush** seeks greatness, **Azul** chooses rebellion, **Blue Knight** carries heroic duty into the galaxy, and **Tim Malcolm** rejects the destiny forced upon him.`}
          </Markdown>
        </section>

        <section className="mt-10">
          <h2 className="mb-4 text-2xl font-semibold">Stories</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stories.map((s) => (
              <Link
                key={s.id}
                to={"/stories/$slug" as any}
                params={{ slug: s.slug } as any}
                className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-1 hover:border-primary hover:shadow-[0_10px_40px_-10px_rgba(37,99,235,0.5)]"
              >
                {STORY_IMAGES[s.slug] && (
                  <div
                    className="aspect-[4/3] w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${STORY_IMAGES[s.slug]})` }}
                  />
                )}
                <div className="p-5">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    Story {s.number}
                  </span>
                  <h3 className="mt-1 text-lg font-semibold group-hover:text-primary">{s.title}</h3>
                  {s.tagline && <p className="mt-2 text-sm text-muted-foreground">{s.tagline}</p>}
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
