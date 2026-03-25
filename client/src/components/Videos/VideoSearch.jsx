import React from 'react';

const VideoSearch = ({ searchTerm, setSearchTerm }) => {
  return (
    <>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search videos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <span className="search-icon">
          🔍
        </span>
      </div>

      <style jsx>{`
        .search-container {
          margin-bottom: 1.5rem;
          position: relative;
          max-width: 400px;
          width: 100%;
        }
        
        .search-input {
          width: 100%;
          padding: 0.75rem 1rem;
          font-size: 1rem;
          border-radius: 6px;
          border: 1px solid #d1d5da;
          background-color: #ffffff;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        
        .search-input:focus {
          outline: none;
          border-color: #0366d6;
          box-shadow: 0 0 0 3px rgba(3, 102, 214, 0.1);
        }
        
        .search-icon {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #586069;
          pointer-events: none;
        }
        
        @media (max-width: 768px) {
          .search-container {
            margin-bottom: 1rem;
            max-width: 100%;
          }
          
          .search-input {
            padding: 0.65rem 0.9rem;
            font-size: 0.95rem;
          }
          
          .search-icon {
            right: 10px;
          }
        }
        
        @media (max-width: 480px) {
          .search-container {
            margin-bottom: 0.8rem;
          }
          
          .search-input {
            padding: 0.6rem 0.8rem;
            font-size: 0.9rem;
          }
          
          .search-input::placeholder {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </>
  );
};

export default VideoSearch;