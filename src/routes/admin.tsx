import { createFileRoute, Outlet, Link, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { SiteHeader } from "@/components/site-header";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Storybook Codex" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (auth.loading) return;
    if (!auth.email || !auth.allowed) {
      navigate({ to: "/login", search: { next: location.pathname } as any });
    }
  }, [auth.loading, auth.email, auth.allowed, navigate, location.pathname]);

  if (auth.loading || !auth.allowed) {
    return (
      <div>
        <SiteHeader />
        <div className="mx-auto max-w-6xl px-6 py-16 text-sm text-muted-foreground">
          Checking access…
        </div>
      </div>
    );
  }

  return (
    <div>
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <AdminSubnav />
        <Outlet />
      </div>
    </div>
  );
}

function AdminSubnav() {
  const items = [
    { to: "/admin", label: "Dashboard", exact: true },
    { to: "/admin/characters", label: "Characters", exact: false },
  ];
  return (
    <nav aria-label="Admin sections" className="mb-6 flex flex-wrap gap-1 border-b border-border pb-2 text-sm">
      {items.map((i) => (
        <Link
          key={i.to}
          to={i.to as any}
          className="rounded-md px-3 py-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
          activeProps={{ className: "rounded-md px-3 py-1.5 bg-secondary text-foreground font-medium" }}
          activeOptions={{ exact: i.exact }}
        >
          {i.label}
        </Link>
      ))}
      <span className="ml-auto self-center text-xs uppercase tracking-widest text-muted-foreground">
        Owner mode
      </span>
    </nav>
  );
}