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
    return <div className="text-center mt-10 text-red-600">Error loading article: {error}</div>;
  }
  if (loading) {
    return <div className="text-center mt-10">Loading article...</div>;
  }
  if (!article) {
    return <div className="text-center mt-10 text-red-600">Article not found.</div>;
  }

  return (
    <div className="bg-white max-w-3xl mx-auto p-8">
      <h1 className="text-[2rem] font-bold mb-4">{article.title}</h1>
      <div className="text-gray-500 text-[0.95rem] mb-6">
        By <strong>{article.author || 'Unknown'}</strong> • {new Date(article.date).toDateString()} • {article.category}
      </div>
      {article.image && (
        <img
          src={article.image}
          alt={article.title}
          className="w-full rounded-xl mb-6"
        />
      )}
      {article.description && (
        <div className="text-[1.1rem] text-gray-800 mb-4 font-medium">
          {article.description}
        </div>
      )}
      <div className="text-base text-gray-800 mb-8 whitespace-pre-wrap">
        {article.content}
      </div>
      <div className="flex gap-[0.4rem] flex-wrap">
        {article.tags?.map((tag, idx) => (
          <span
            key={idx}
            className="bg-indigo-100 px-[0.6rem] py-[0.3rem] rounded-xl text-[0.85rem] text-blue-800"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ArticlePage;
