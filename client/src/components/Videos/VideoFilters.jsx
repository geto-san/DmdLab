import React from 'react';

const VideoFilters = ({ selectedCategory, setSelectedCategory }) => {
  const categories = ['All', 'Research', 'Lecture', 'Meeting', 'Tutorial'];

  return (
    <div className="space-y-4">
      <h4 className="text-[10px] font-bold text-text-main uppercase tracking-[0.25em] opacity-40">Filter by Type</h4>
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
              selectedCategory === cat
                ? "bg-brand-primary text-white shadow-soft"
                : "bg-bg-surface border border-border-main text-text-secondary hover:bg-bg-surface-hover"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default VideoFilters;
