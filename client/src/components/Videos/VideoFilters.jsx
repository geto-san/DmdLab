const categories = ['All', 'Research', 'Tutorial', 'Discussion', 'Lab Work'];

const VideoFilters = ({ selectedCategory, setSelectedCategory }) => (
  <div className="flex gap-2 flex-wrap">
    {categories.map((category) => (
      <button
        key={category}
        onClick={() => setSelectedCategory(category)}
        className={`px-3.5 py-1.5 rounded-full border text-[13px] whitespace-nowrap transition-colors ${
          selectedCategory === category
            ? 'bg-ink text-white border-ink font-semibold'
            : 'bg-white text-muted border-black/10 hover:border-signal/40 hover:text-ink-text'
        }`}
      >
        {category}
      </button>
    ))}
  </div>
);

export default VideoFilters;
