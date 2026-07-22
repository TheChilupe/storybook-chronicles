import { Link, useRouter } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { signOut } from "@/lib/auth";
import logo from "@/assets/logo-white.png";

const baseNav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/storybook-chronicles", label: "Storybook Chronicles" },
  { to: "/skills", label: "Skills" },
  { to: "/resume", label: "Resume" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const auth = useAuth();
  const router = useRouter();
  const nav = auth.allowed ? [...baseNav, { to: "/admin", label: "Admin" } as const] : baseNav;
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <img src={logo} alt="" className="h-7 w-7" />
          <span className="hidden sm:inline">Storybook Codex</span>
        </Link>
        <nav className="ml-2 flex flex-wrap items-center gap-1 text-sm">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to as any}
              className="rounded-md px-2.5 py-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "rounded-md px-2.5 py-1.5 bg-secondary text-foreground" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto text-xs text-muted-foreground">
          {auth.email && (
            <button
              onClick={async () => { await signOut(); router.navigate({ to: "/login", search: { next: undefined } }); }}
              className="rounded-md border border-border px-2 py-1 hover:bg-secondary"
            >
              Sign out
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
