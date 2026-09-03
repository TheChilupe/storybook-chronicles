import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-10 sm:grid-cols-3">
        <div>
          <div className="font-semibold text-foreground">
            Alexander Chilupe
          </div>

          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Project management, product thinking, technology, and creative
            systems.
          </p>

          <p className="mt-3 text-sm text-muted-foreground">
            Cleveland, Ohio
          </p>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Explore
          </div>

          <nav className="mt-4 flex flex-col gap-2 text-sm">
            <Link to="/" className="hover:text-primary">
              Home
            </Link>

            <Link to="/portfolio" className="hover:text-primary">
              Portfolio
            </Link>

            <Link
              to="/storybook-chronicles"
              className="hover:text-primary"
            >
              Storybook Chronicles
            </Link>

            <Link to="/skills" className="hover:text-primary">
              Skills
            </Link>

            <Link to="/about" className="hover:text-primary">
              About
            </Link>
          </nav>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Connect
          </div>

          <div className="mt-4 flex flex-col gap-2 text-sm">
            <a
              href="mailto:thechilupe@gmail.com"
              className="hover:text-primary"
            >
              Email
            </a>

            <a
              href="https://www.linkedin.com/in/alexander-chilupe-64a89313b/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary"
            >
              LinkedIn
            </a>

            <a
              href="https://github.com/TheChilupe"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary"
            >
              GitHub
            </a>

            <a
              href="/Alexander_Chilupe_2026_Resume_Public.pdf"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary"
            >
              Resume
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-5 text-xs text-muted-foreground">
          © 2026 Alexander Chilupe
        </div>
      </div>
    </footer>
  );
}