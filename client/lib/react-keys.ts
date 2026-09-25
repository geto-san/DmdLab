// Deterministic, content-derived React keys — never the loop index — so
// keys stay stable across re-renders/reorders. `seen` disambiguates
// duplicate content within a single list.
function hashKey(text: string): string {
  let h = 0;
  for (const char of text) h = Math.trunc(h * 31 + (char.codePointAt(0) ?? 0));
  return h.toString(36);
}

export function keyFor(text: string, seen: Map<string, number>): string {
  const base = hashKey(text);
  const count = (seen.get(base) ?? 0) + 1;
  seen.set(base, count);
  return count > 1 ? `${base}-${count}` : base;
}
