import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Tag } from 'lucide-react';
import API_BASE from '../utils/api';

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
        const res = await fetch(`${API_BASE}/articles/${id}`);
        if (!res.ok) throw new Error('Research article not found');
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

  if (loading) {
    return (
      <div className="bg-bg-main min-h-screen flex items-center justify-center pt-20">
        <div className="animate-pulse text-text-dim text-[10px] font-bold uppercase tracking-[0.4em]">Retrieving Publication...</div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="bg-bg-main min-h-screen flex flex-col items-center justify-center pt-20">
        <div className="text-red-500 font-bold text-sm uppercase tracking-widest mb-4">Discovery Error</div>
        <p className="text-text-secondary">{error || "Article not found"}</p>
        <Link to="/articles" className="btn-secondary mt-8">Back to Archive</Link>
      </div>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-bg-main min-h-screen pt-40 pb-32 transition-colors duration-500"
    >
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        <Link to="/articles" className="inline-flex items-center gap-2 text-text-dim hover:text-brand-primary transition-colors font-bold text-[10px] uppercase tracking-widest mb-12">
          <ArrowLeft size={14} /> Back to Insights
        </Link>

        <header className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <span className="bg-primary-soft text-brand-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.1em]">
              {article.category}
            </span>
            <span className="text-border-strong text-xs">•</span>
            <div className="flex items-center gap-1.5 text-text-dim text-[10px] font-bold uppercase tracking-wide">
              <Clock size={12} />
              {new Date(article.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-text-main mb-8 leading-[1.05] tracking-tight">
            {article.title}
          </h1>

          <div className="flex items-center gap-4 py-8 border-y border-border-main">
            <div className="w-12 h-12 rounded-full bg-bg-surface border border-border-main flex items-center justify-center text-sm font-bold text-brand-primary uppercase tracking-tighter">
              {article.author?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="text-[10px] font-bold text-text-dim uppercase tracking-widest">Authored By</div>
              <div className="text-base font-bold text-text-main">{article.author || 'DeepMinds Researcher'}</div>
            </div>
          </div>
        </header>

        {article.image && (
          <div className="rounded-[2.5rem] overflow-hidden mb-16 border border-border-main shadow-soft bg-bg-surface aspect-video">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="prose prose-lg dark:prose-invert max-w-none mb-20">
          {article.description && (
            <div className="text-xl font-bold text-text-main mb-12 leading-relaxed tracking-tight border-l-4 border-brand-primary pl-8">
              {article.description}
            </div>
          )}
          <div className="text-lg text-text-secondary leading-relaxed whitespace-pre-wrap">
            {article.content}
          </div>
        </div>

        <footer className="pt-12 border-t border-border-main">
          <div className="flex flex-wrap gap-3">
            {article.tags?.map((tag, idx) => (
              <span
                key={idx}
                className="flex items-center gap-2 bg-bg-surface border border-border-subtle px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest text-text-secondary"
              >
                <Tag size={12} className="text-brand-primary accent-soften" />
                {tag}
              </span>
            ))}
          </div>
        </footer>
      </div>
    </motion.article>
  );
};

export default ArticlePage;
