import React from 'react';

const VideoFilters = ({ selectedCategory, setSelectedCategory }) => {
  const categories = ['All', 'Research', 'Tutorial', 'Discussion', 'Lab Work'];

  return (
    <>
      <div className="filters-container">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`filter-button ${selectedCategory === category ? 'active' : ''}`}
          >
            {category}
          </button>
        ))}
      </div>

      <style jsx>{`
        .filters-container {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          justify-content: center;
        }
        
        .filter-button {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          border: 1px solid #d1d5da;
          background-color: #ffffff;
          color: #586069;
          cursor: pointer;
          font-weight: normal;
          font-size: 0.9rem;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        
        .filter-button.active {
          background-color: #0366d6;
          color: white;
          font-weight: 600;
        }
        
        .filter-button:hover {
          background-color: #f6f8fa;
        }
        
        .filter-button.active:hover {
          background-color: #0366d6;
        }
        
        @media (max-width: 768px) {
          .filters-container {
            gap: 0.4rem;
            justify-content: flex-start;
            overflow-x: auto;
            padding-bottom: 8px;
            margin-bottom: 8px;
          }
          
          .filter-button {
            padding: 0.4rem 0.8rem;
            font-size: 0.85rem;
            flex-shrink: 0;
          }
        }
        
        @media (max-width: 480px) {
          .filters-container {
            gap: 0.8rem;
          }
          
          .filter-button {
            padding: 0.35rem 0.7rem;
            font-size: 0.8rem;
          }
        }
        @media (max-width: 390px) {
          .filters-container {
            gap: 0.2rem;
          }
          
          .filter-button {
            padding: 0.35rem 0.7rem;
            font-size: 0.8rem;
          }
        }
      `}</style>
    </>
  );
};

export default VideoFilters;