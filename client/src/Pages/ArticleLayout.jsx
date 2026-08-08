import { useState } from 'react';
import ArticleSearch from '../components/Articles/ArticleSearch';
import ArticleFilter from '../components/Articles/ArticleFilter';
import ArticleGrid from '../components/Articles/ArticleGrid';

const ArticleLayout = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="bg-paper min-h-screen">
      <div className="bg-ink text-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-14">
          <span className="eyebrow text-amber">Lab publications</span>
          <h1 className="font-display font-semibold text-3xl sm:text-4xl mt-3">Articles</h1>
          <p className="text-white/60 mt-2 max-w-xl">
            Research notes, publications, and updates from across the lab.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-10">
        <ArticleSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <ArticleFilter selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
        <ArticleGrid selectedCategory={selectedCategory} searchTerm={searchTerm} columns={2} />
      </div>
    </div>
  );
};

export default ArticleLayout;
