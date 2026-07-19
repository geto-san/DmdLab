import React from 'react';

const ArticleSearch = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="mb-4 flex items-center">
      <input
        type="text"
        placeholder="Search articles..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-1 px-4 py-2 text-base rounded-md border border-[#ccc]"
      />
      <span className="ml-[-30px] text-[#888]">🔍</span>
    </div>
  );
};

export default ArticleSearch;
