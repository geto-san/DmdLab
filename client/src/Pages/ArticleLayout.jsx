import React, { useState } from 'react';
import ArticleSearch from '../components/Articles/ArticleSearch';
import ArticleFilter from '../components/Articles/ArticleFilter';
import ArticleGrid from '../components/Articles/ArticleGrid';

const ArticleLayout = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="bg-white">
      <div className="max-w-[1200px] mx-auto px-5 py-8">
        <ArticleSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <ArticleFilter selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
        <ArticleGrid selectedCategory={selectedCategory} searchTerm={searchTerm} />
      </div>
    </div>
  );
};

export default ArticleLayout;
