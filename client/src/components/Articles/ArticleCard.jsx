import React from 'react';

const ArticleCard = ({ article }) => {
  const {
    title,
    description,
    tags = [],
    author,
    category,
    image,
    date
  } = article;

  return (
    <div className="card-standard mb-10 group cursor-pointer">
      {image && (
        <div className="overflow-hidden rounded-2xl mb-8 aspect-[16/9]">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </div>
      )}

      <div className="flex items-center gap-3 mb-4">
        <span className="bg-primary-soft text-brand-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.1em]">
          {category}
        </span>
        <span className="text-border-strong text-xs">•</span>
        <span className="text-text-dim text-[10px] font-bold uppercase tracking-widest">{new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
      </div>

      <h2 className="text-2xl font-bold text-text-main mb-4 group-hover:text-brand-primary transition-colors leading-tight tracking-tight">
        {title}
      </h2>

      <p className="text-text-secondary text-base mb-8 line-clamp-2 leading-relaxed">
        {description}
      </p>

      <div className="flex items-center justify-between border-t border-border-subtle pt-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-brand-primary/10 flex items-center justify-center text-[10px] font-bold text-brand-primary uppercase tracking-tighter">
            {author?.charAt(0) || 'U'}
          </div>
          <span className="text-[11px] font-bold text-text-main uppercase tracking-widest">{author || 'Researcher'}</span>
        </div>

        <div className="flex gap-3">
          {tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="text-text-dim text-[10px] font-bold uppercase tracking-widest"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
