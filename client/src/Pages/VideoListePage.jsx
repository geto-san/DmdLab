import React, { useState, useEffect } from 'react';
import VideoSearch from '../components/Videos/VideoSearch';
import VideoFilters from '../components/Videos/VideoFilters';
import VideoCard from '../components/Videos/VideoCard';
import { Link } from 'react-router-dom';
import useVideos from '../hooks/useVideos';

const VideoListPage = () => {
  const { videos, loading, error } = useVideos();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredVideos, setFilteredVideos] = useState([]);

  useEffect(() => {
    let filtered = videos;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(video => video.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredVideos(filtered);
  }, [videos, searchTerm, selectedCategory]);

  return (
    <div className="video-list-page">
      {/* Main Content */}
      <div className="main-content">
        <div className="content-area">
          {loading && <p className="loading-message">Loading videos…</p>}
          {error && <p className="error-message">Error: {error}</p>}

          {!loading && !error && (
            <>
              {filteredVideos.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📹</div>
                  <h3>No videos found</h3>
                  <p>Try adjusting your search or filter criteria.</p>
                </div>
              ) : (
                <div className="videos-container">
                  {filteredVideos.map(video => (
                    <Link key={video._id} to={`/videos/${video._id}`} className="video-link">
                      <VideoCard video={video} />
                    </Link>
                  ))}
                </div>
              )}

              <div className="results-count">
                Showing {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''}
                {selectedCategory !== 'All' && ` in ${selectedCategory}`}
                {searchTerm && ` matching "${searchTerm}"`}
              </div>
            </>
          )}
        </div>

        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-content">
            <VideoFilters selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
            <div className="summary-card">
              <h4>Summary</h4>
              <div className="summary-item">
                Total videos: <strong>{videos.length}</strong>
              </div>
              <div className="summary-item">
                Category: <strong>{selectedCategory}</strong>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <style jsx>{`
        .video-list-page {
          background-color: #ffffff;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        /* Header Styles */
        .page-header {
          background-color: #fafafa;
          border-bottom: 1px solid #e1e4e8;
          padding: 24px 0;
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .header-text {
          flex: 1;
        }

        .header-text h1 {
          margin: 0;
          font-size: 1.6rem;
          color: #111827;
        }

        .header-text p {
          margin: 6px 0 0 0;
          color: #6b7280;
        }

        .search-container {
          width: 360px;
        }

        /* Main Content Styles */
        .main-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px 20px;
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 28px;
          flex: 1;
        }

        .content-area {
          min-height: 400px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .loading-message {
          text-align: center;
          color: #586069;
          padding: 2rem;
        }

        .error-message {
          text-align: center;
          color: #d73a49;
          padding: 2rem;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 3rem;
          color: #586069;
          width: 100%;
        }

        .empty-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .empty-state h3 {
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
          color: #24292e;
        }

        /* Videos Container */
        .videos-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
          width: 80%;
          max-width: 900px;
          margin: 0 auto;
        }

        .video-link {
          text-decoration: none;
          display: block;
        }

        /* Results Count */
        .results-count {
          text-align: center;
          margin-top: 2rem;
          padding: 1rem;
          color: #586069;
          font-size: 0.9rem;
          width: 80%;
          max-width: 900px;
        }

        /* Sidebar */
        .sidebar-content {
          position: sticky;
          top: 20px;
        }

        .summary-card {
          margin-top: 20px;
          padding: 16px;
          background: #fff;
          border-radius: 8px;
          border: 1px solid #e6e6e6;
        }

        .summary-card h4 {
          margin: 0 0 12px 0;
          font-size: 1rem;
          color: #111827;
        }

        .summary-item {
          color: #6b7280;
          font-size: 14px;
          margin-bottom: 8px;
        }

        .summary-item:last-child {
          margin-bottom: 0;
        }

        .summary-item strong {
          color: #111827;
        }

        /* Media Queries */
        @media (max-width: 1024px) {
          .main-content {
            grid-template-columns: 1fr 280px;
            gap: 24px;
          }
          
          .search-container {
            width: 320px;
          }

          .videos-container {
            width: 85%;
          }
        }

        @media (max-width: 768px) {
          .page-header {
            padding: 20px 0;
          }
          
          .header-content {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }
          
          .header-text {
            text-align: center;
          }
          
          .header-text h1 {
            font-size: 1.4rem;
          }
          
          .search-container {
            width: 100%;
            max-width: 400px;
            margin: 0 auto;
          }
          
          .main-content {
            grid-template-columns: 1fr;
            gap: 20px;
            padding: 24px 16px;
          }
          
          .sidebar-content {
            position: static;
          }
          
          .summary-card {
            margin-top: 16px;
          }
          
          .empty-state {
            padding: 2rem 1rem;
          }
          
          .empty-icon {
            font-size: 2.5rem;
          }

          .videos-container {
            width: 90%;
          }

          .results-count {
            width: 90%;
          }
        }

        @media (max-width: 640px) {
          .page-header {
            padding: 16px 0;
          }
          
          .header-content {
            padding: 0 16px;
          }
          
          .header-text h1 {
            font-size: 1.3rem;
          }
          
          .header-text p {
            font-size: 0.9rem;
          }
          
          .main-content {
            padding: 20px 12px;
            gap: 16px;
          }
          
          .videos-container {
            gap: 12px;
            width: 95%;
          }
          
          .results-count {
            margin-top: 1.5rem;
            padding: 0.75rem;
            font-size: 0.85rem;
            width: 95%;
          }
        }

        @media (max-width: 480px) {
          .page-header {
            padding: 12px 0;
          }
          
          .header-content {
            gap: 12px;
          }
          
          .header-text h1 {
            font-size: 1.2rem;
          }
          
          .main-content {
            padding: 16px 8px;
          }
          
          .empty-state {
            padding: 1.5rem 0.5rem;
          }
          
          .empty-icon {
            font-size: 2rem;
          }
          
          .empty-state h3 {
            font-size: 1.1rem;
          }
          
          .empty-state p {
            font-size: 0.9rem;
          }
          
          .summary-card {
            padding: 12px;
          }
          
          .summary-card h4 {
            font-size: 0.95rem;
            margin-bottom: 8px;
          }
          
          .summary-item {
            font-size: 13px;
          }

          .videos-container {
            width: 88%;
          }

          .results-count {
            width: 100%;
          }
        }

        @media (max-width: 360px) {
          .header-content {
            padding: 0 12px;
          }
          
          .main-content {
            padding: 12px 6px;
          }
          
          .header-text h1 {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default VideoListPage;