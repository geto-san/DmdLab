import { ARTICLE_CATEGORIES } from '../../utils/articleCategories';

const categories = ['all', ...ARTICLE_CATEGORIES];

const ArticleFilters = ({ selectedCategory, setSelectedCategory }) => (
  <div className="mb-6 flex gap-2 flex-wrap">
    {categories.map((category) => (
      <button
        key={category}
        onClick={() => setSelectedCategory(category)}
        className={`px-4 py-1.5 rounded-full border text-sm transition-colors ${
          selectedCategory === category
            ? 'bg-ink text-white border-ink font-semibold'
            : 'bg-white text-muted border-black/10 hover:border-signal/40 hover:text-ink-text'
        }`}
      >
        {category === 'all' ? 'All' : category}
      </button>
    ))}
  </div>
);

export default ArticleFilters;
