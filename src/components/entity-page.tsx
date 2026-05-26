import { SiteHeader } from "@/components/site-header";

export function EntityPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="mb-6 text-3xl font-bold">{title}</h1>
        {children}
      </main>
    </div>
  );
}