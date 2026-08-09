import { useEffect, useState } from 'react';
import { fetchContentBlocks, mergeBlock } from '../utils/content';

// Returns the CMS block for `key` merged over `fallback`, plus a loading flag
// and whether a CMS block actually exists. `data` is always renderable.
export function useContent(key, fallback) {
  const [block, setBlock] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchContentBlocks().then((map) => {
      if (cancelled) return;
      setBlock(map[key] || null);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [key]);

  const data = block ? mergeBlock(fallback, block) : fallback;
  return { data, loading, hasCms: block !== null };
}
