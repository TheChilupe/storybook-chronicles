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