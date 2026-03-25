import React from 'react';
import ArticleSearch from '../components/Articles/ArticleSearch';
import ArticleFilter from '../components/Articles/ArticleFilter';
import ArticleGrid from '../components/Articles/ArticleGrid';
import useArticles from '../hooks/useArticle';

const ArticleLayout = () => {
  const {
    articles,
    filteredArticles,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery
  } = useArticles();

  return (
    <div style={{ backgroundColor: '#ffffff' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>
        <ArticleGrid articles={filteredArticles} />
      </div>
    </div>
  );
};

export default ArticleLayout;
