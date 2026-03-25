import React from 'react';

const ArticleSearch = ({ searchTerm, setSearchTerm }) => {
  return (
    <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
      <input
        type="text"
        placeholder="Search articles..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          flex: 1,
          padding: '0.5rem 1rem',
          fontSize: '1rem',
          borderRadius: '6px',
          border: '1px solid #ccc',
        }}
      />
      <span style={{ marginLeft: '-30px', color: '#888' }}>🔍</span>
    </div>
  );
};

export default ArticleSearch;
