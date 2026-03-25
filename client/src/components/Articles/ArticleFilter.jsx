import React, { useEffect, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const categories = [];

const ArticleFilters = ({ selectedCategory, setSelectedCategory }) => {

  return (
    <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setSelectedCategory(category)}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            border: '1px solid #ccc',
            backgroundColor: selectedCategory === category ? '#004080' : '#f2f2f2',
            color: selectedCategory === category ? 'white' : '#333',
            cursor: 'pointer',
            fontWeight: selectedCategory === category ? 'bold' : 'normal',
            transition: '0.3s',
          }}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default ArticleFilters;
