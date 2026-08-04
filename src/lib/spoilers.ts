import { useEffect, useState } from "react";

const KEY = "sbc-spoilers";
type State = { global: boolean; per: Record<string, boolean> };
const listeners = new Set<(s: State) => void>();
let state: State = load();

function load(): State {
  if (typeof window === "undefined") return { global: false, per: {} };
  try { return JSON.parse(localStorage.getItem(KEY) || "") as State; } catch { return { global: false, per: {} }; }
}
function save() {
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(state));
  listeners.forEach((l) => l(state));
}

/**
 * The reveal scope for one character profile. Both the reveal toggle and the
 * profile sections read this, so they can never disagree about which key holds
 * a given character's reveal state.
 */
export function characterSpoilerScope(slug: string) {
  return `char-${slug}`;
}

export function useSpoilers(scope?: string) {
  const [s, setS] = useState(state);
  useEffect(() => {
    const l = (next: State) => setS({ ...next });
    listeners.add(l);
    return () => { listeners.delete(l); };
  }, []);
  const revealed = scope ? (s.per[scope] ?? s.global) : s.global;
  return {
    revealed,
    global: s.global,
    toggle: () => {
      if (scope) state = { ...state, per: { ...state.per, [scope]: !revealed } };
      else state = { ...state, global: !s.global };
      save();
    },
    setGlobal: (v: boolean) => { state = { ...state, global: v }; save(); },
  };
}