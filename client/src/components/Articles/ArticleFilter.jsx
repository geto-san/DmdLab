import React from 'react';
import { ARTICLE_CATEGORIES } from '../../utils/articleCategories';

const ArticleFilter = ({ selectedCategory, setSelectedCategory }) => {
  const categories = [{ id: 'all', label: 'All Insights' }, ...ARTICLE_CATEGORIES.map(c => ({ id: c.toLowerCase(), label: c }))];

  return (
    <div className="space-y-4">
      <h4 className="text-[10px] font-bold text-text-main uppercase tracking-[0.25em] opacity-40">Categories</h4>
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
              selectedCategory === cat.id
                ? "bg-brand-primary text-white shadow-soft"
                : "bg-bg-surface border border-border-main text-text-secondary hover:bg-bg-surface-hover"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ArticleFilter;
