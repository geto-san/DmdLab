// Deterministic, content-derived React keys — never the loop index — so
// keys stay stable across re-renders/reorders. `seen` disambiguates
// duplicate content within a single list.
function hashKey(text: string): string {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) | 0;
  return h.toString(36);
}

export function keyFor(text: string, seen: Map<string, number>): string {
  const base = hashKey(text);
  const count = (seen.get(base) ?? 0) + 1;
  seen.set(base, count);
  return count > 1 ? `${base}-${count}` : base;
}
