import React, { useEffect, useState } from 'react';
import ArticleCard from './ArticleCard';
import { Link } from 'react-router-dom';
import API_BASE from '../../utils/api';

const API_BASE_URL1 = API_BASE;

const ArticleList = ({ selectedCategory, searchTerm }) => {
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

      const res = await fetch(`${API_BASE_URL1}/articles?${query}`);
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
  }, [selectedCategory]);

  useEffect(() => {
    if (page > 1) fetchArticles(page);
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

  return (
    <div>
      {filteredArticles.map(article => (
        <Link key={article._id} to={`/articles/${article._id}`}>
          <ArticleCard article={article} />
        </Link>
      ))}
      {!hasMore && (
        <p style={{ textAlign: 'center', color: '#888', marginTop: '1rem' }}>
          No more articles.
        </p>
      )}
    </div>
  );
};

export default ArticleList;