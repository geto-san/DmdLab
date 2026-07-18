import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API_BASE_URL from '../utils/api';

const ArticlePage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/articles/${id}`);
        if (!res.ok) throw new Error('Article not found');
        const data = await res.json();
        setArticle(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchArticle();
  }, [id]);

  if (error) {
    return <div style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>Error loading article: {error}</div>;
  }
  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: 40 }}>Loading article...</div>;
  }
  if (!article) {
    return <div style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>Article not found.</div>;
  }

  return (
    <div style={{
      backgroundColor: '#fff',
      maxWidth: '100vh',
      margin: '0 auto',
      padding: '2rem'
    }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>{article.title}</h1>
      <div style={{ color: '#888', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
        By <strong>{article.author || 'Unknown'}</strong> • {new Date(article.date).toDateString()} • {article.category}
      </div>
      {article.image && (
        <img
          src={article.image}
          alt={article.title}
          style={{ width: '100%', borderRadius: '12px', marginBottom: '1.5rem' }}
        />
      )}
      {article.description && (
        <div style={{ fontSize: '1.1rem', color: '#333', marginBottom: '1rem', fontWeight: 500 }}>
          {article.description}
        </div>
      )}
      <div style={{ fontSize: '1rem', color: '#333', marginBottom: '2rem', whiteSpace: 'pre-wrap' }}>
        {article.content}
      </div>
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
        {article.tags?.map((tag, idx) => (
          <span
            key={idx}
            style={{
              backgroundColor: '#e0e7ff',
              padding: '0.3rem 0.6rem',
              borderRadius: '12px',
              fontSize: '0.85rem',
              color: '#1e40af'
            }}
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ArticlePage;