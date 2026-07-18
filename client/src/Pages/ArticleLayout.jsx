import React, { useState } from 'react';
import ArticleSearch from '../components/Articles/ArticleSearch';
import ArticleFilter from '../components/Articles/ArticleFilter';
import ArticleGrid from '../components/Articles/ArticleGrid';

const ArticleLayout = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div style={{ backgroundColor: '#ffffff' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>
        <ArticleSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <ArticleFilter selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
        <ArticleGrid selectedCategory={selectedCategory} searchTerm={searchTerm} />
      </div>
    </div>
  );
};

export default ArticleLayout;
