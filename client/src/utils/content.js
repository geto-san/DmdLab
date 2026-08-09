// Client-side CMS layer. Fetches all enabled content blocks from the public
// read-only endpoint once, caches them, and lets components merge a block
// over their hardcoded fallback. If the API/DB is unreachable the app keeps
// rendering the fallback data, so the site degrades gracefully offline.
import API_BASE from './api';

const cache = new Map();

export async function fetchContentBlocks() {
  if (cache.has('__all__')) return cache.get('__all__');
  try {
    const res = await fetch(`${API_BASE}/content`);
    if (!res.ok) throw new Error('content endpoint unavailable');
    const blocks = await res.json();
    const map = {};
    if (Array.isArray(blocks)) {
      for (const b of blocks) {
        if (b && b.key && b.enabled !== false) map[b.key] = b.payload || {};
      }
    }
    cache.set('__all__', map);
    return map;
  } catch (err) {
    console.warn('Content fetch failed, using fallbacks:', err.message);
    return {};
  }
}

// Deep-ish merge: top-level keys from payload win, objects merge recursively,
// arrays replace wholesale. Fallback stays intact for anything not provided.
export function mergeBlock(fallback, payload) {
  const out = { ...(fallback || {}) };
  for (const [key, value] of Object.entries(payload || {})) {
    if (value && typeof value === 'object' && !Array.isArray(value) && out[key] && typeof out[key] === 'object' && !Array.isArray(out[key])) {
      out[key] = mergeBlock(out[key], value);
    } else {
      out[key] = value;
    }
  }
  return out;
}
