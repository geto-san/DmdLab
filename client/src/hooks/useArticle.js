import { useState, useEffect } from 'react';
import API_BASE from '../utils/api';

const API_BASE_URL = API_BASE;

const useArticles = () => {
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const limit = 6;

  const fetchArticles = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const query = new URLSearchParams({
        category: category.toLowerCase() || 'all',
        search: searchTerm || '',
        page: page.toString(),
        limit: limit.toString(),
      });

      const res = await fetch(`${API_BASE_URL}/articles?${query}`);
      const text = await res.text();

      try {
        const data = JSON.parse(text);

        if (!Array.isArray(data)) throw new Error('Invalid response format');

        setArticles(prev => (page === 1 ? data : [...prev, ...data]));
        setHasMore(data.length === limit); // mark false if less than limit
      } catch (jsonErr) {
        console.error('JSON parse error:', jsonErr);
        setHasMore(false);
      }
    } catch (err) {
      console.error('Network error:', err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // Trigger fresh load on filter changes
  useEffect(() => {
    setArticles([]);
    setPage(1);
    setHasMore(true);
  }, [category, searchTerm]);

  // Only fetch when page changes & hasMore
  useEffect(() => {
    if (page === 1) fetchArticles();
    else if (hasMore) fetchArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (loading || !hasMore) return;
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;
      if (nearBottom) setPage(prev => prev + 1);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  return {
    articles,
    category,
    setCategory,
    searchTerm,
    setSearchTerm,
    loading,
  };
};

export default useArticles;
