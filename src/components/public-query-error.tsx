export function PublicQueryError({ content }: { content: string }) {
  return (
    <div role="alert" className="rounded-xl border border-destructive/40 bg-destructive/5 p-5">
      <h2 className="font-semibold">Unable to load {content}</h2>
      <p className="mt-1 text-sm text-muted-foreground">Please try again in a moment.</p>
    </div>
  );
}
