import { Search, X } from "lucide-react";

export function CharacterSearch({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative w-full">
      <label htmlFor="character-search" className="sr-only">
        Search characters
      </label>
      <Search
        aria-hidden
        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
      />
      <input
        id="character-search"
        type="search"
        autoComplete="off"
        spellCheck={false}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search Characters..."
        className="w-full rounded-full border border-border bg-card/60 py-3 pl-11 pr-11 text-sm text-foreground shadow-sm outline-none backdrop-blur transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/40"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}