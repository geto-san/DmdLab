import React from 'react';
import { ARTICLE_CATEGORIES } from '../../utils/articleCategories';

const categories = ['all', ...ARTICLE_CATEGORIES];

const ArticleFilters = ({ selectedCategory, setSelectedCategory }) => {

  return (
    <div className="mb-4 flex gap-2 flex-wrap">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setSelectedCategory(category)}
          className={`px-4 py-2 rounded-full border border-[#ccc] cursor-pointer transition-[0.3s] ${
            selectedCategory === category
              ? 'bg-[#004080] text-white font-bold'
              : 'bg-[#f2f2f2] text-[#333] font-normal'
          }`}
        >
          {category === 'all' ? 'All' : category}
        </button>
      ))}
    </div>
  );
};

export default ArticleFilters;
