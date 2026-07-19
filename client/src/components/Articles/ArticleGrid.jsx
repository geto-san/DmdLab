import { useEffect, useState } from 'react';
import ArticleCard from './ArticleCard';
import { Link } from 'react-router-dom';
import API_BASE from '../../utils/api';

const ArticleGrid = ({ selectedCategory, searchTerm, columns = 1 }) => {
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  const fetchArticles = async (pageToFetch) => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const query = new URLSearchParams({
        category: (selectedCategory || 'all').toLowerCase(),
        page: pageToFetch.toString(),
        limit: limit.toString(),
      });

      const res = await fetch(`${API_BASE}/articles?${query}`);
      const text = await res.text();

      try {
        const data = JSON.parse(text);
        setArticles(prev => (pageToFetch === 1 ? data : [...prev, ...data]));
        setHasMore(data.length === limit);
      } catch (err) {
        console.error('JSON parse error:', err);
        setHasMore(false);
      }
    } catch (err) {
      console.error('Network error:', err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchArticles(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refetch only when the category filter changes
  }, [selectedCategory]);

  useEffect(() => {
    if (page > 1) fetchArticles(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refetch only when the page changes
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (loading || !hasMore) return;
      if (
        window.innerHeight + document.documentElement.scrollTop + 100 >=
        document.documentElement.offsetHeight
      ) {
        setPage(prevPage => prevPage + 1);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes((searchTerm || '').toLowerCase())
  );

  const gridClass = columns === 2
    ? 'grid grid-cols-1 sm:grid-cols-2 gap-5'
    : '';

  if (!loading && filteredArticles.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed border-black/10 rounded-2xl">
        <p className="text-muted text-sm">No articles found yet.</p>
      </div>
    );
  }

  return (
    <div>
      <div className={gridClass}>
        {filteredArticles.map(article => (
          <Link key={article._id} to={`/articles/${article._id}`}>
            <ArticleCard article={article} />
          </Link>
        ))}
      </div>
      {loading && <p className="text-center text-muted text-sm py-4">Loading…</p>}
      {!hasMore && filteredArticles.length > 0 && (
        <p className="text-center text-muted-2 text-sm mt-4">No more articles.</p>
      )}
    </div>
  );
};

export default ArticleGrid;
