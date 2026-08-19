// Coerces a value to a string defensively. Plain strings/numbers/booleans
// pass through as-is; anything else (objects, arrays) is JSON-stringified
// instead of falling back to JS's default "[object Object]" formatting,
// which is what you'd get from a bare `String(value)` or `${value}` on an
// unknown-typed value.
export function toSafeString(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value;
  if (value === null || value === undefined) return fallback;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  try {
    return JSON.stringify(value);
  } catch {
    return fallback;
  }
}
