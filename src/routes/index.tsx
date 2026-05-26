import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/site-header";
import { storiesQO } from "@/lib/queries";
import { Markdown } from "@/components/markdown";
import cloudBg from "@/assets/main-cloud-bg.jpg";
import logo from "@/assets/logo-white.png";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Storybook Chronicles Codex" }] }),
  component: Index,
});

function Index() {
  const { data: stories = [] } = useQuery(storiesQO);
  return (
    <div>
      <SiteHeader />
      <section
        className="relative flex min-h-[70vh] flex-col items-center justify-center px-6 py-20 text-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(11,15,23,0.85) 80%, var(--color-background)), url(${cloudBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <img src={logo} alt="" className="h-32 w-32 drop-shadow-[0_0_30px_rgba(255,255,255,0.45)]" />
        <h1 className="mt-6 text-5xl font-bold sm:text-7xl">Storybook Chronicles</h1>
        <p className="mt-4 max-w-2xl text-lg text-foreground/85">
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
                to="/stories/$slug"
                params={{ slug: s.slug }}
                className="group rounded-2xl border border-border bg-card p-5 transition hover:border-primary"
              >
                <span className="text-xs uppercase tracking-wider text-muted-foreground">Story {s.number}</span>
                <h3 className="mt-1 text-lg font-semibold group-hover:text-primary">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.tagline}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
