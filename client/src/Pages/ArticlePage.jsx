import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
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
    return <div className="text-center py-20 text-red-600">Error loading article: {error}</div>;
  }
  if (loading) {
    return <div className="text-center py-20 text-muted">Loading article…</div>;
  }
  if (!article) {
    return <div className="text-center py-20 text-red-600">Article not found.</div>;
  }

  return (
    <div className="bg-paper min-h-screen">
      <div className="max-w-3xl mx-auto px-5 sm:px-6 py-10">
        <Link to="/articles" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-signal mb-6 transition-colors">
          <ArrowLeft size={15} /> Back to articles
        </Link>

        <span className="eyebrow text-signal">{article.category}</span>
        <h1 className="font-display font-semibold text-3xl sm:text-4xl leading-tight text-ink-text mt-3 mb-4">
          {article.title}
        </h1>
        <div className="text-muted text-sm mb-6">
          By <span className="text-ink-text font-medium">{article.author || 'Unknown'}</span> · {new Date(article.date).toDateString()}
        </div>

        {article.image && (
          <img src={article.image} alt={article.title} className="w-full rounded-2xl mb-8" />
        )}

        {article.description && (
          <p className="text-lg text-ink-text/90 font-medium leading-relaxed mb-6">
            {article.description}
          </p>
        )}

        <div className="text-[15px] text-ink-text/85 leading-[1.75] whitespace-pre-wrap mb-10">
          {article.content}
        </div>

        {article.tags?.length > 0 && (
          <div className="flex gap-2 flex-wrap pt-6 border-t border-black/8">
            {article.tags.map((tag, idx) => (
              <span key={idx} className="bg-paper-2 px-3 py-1 rounded-full text-xs text-muted font-medium">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticlePage;
