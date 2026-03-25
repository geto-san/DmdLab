import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import VideoPlayer from "../components/VideoPage/VideoPlayer";
import VideoInfo from "../components/VideoPage/VideoInfo";
import RelatedVideos from "../components/VideoPage/RelatedVideos";
import API_BASE from '../utils/api';

const VideoPage = () => {
  const { id } = useParams();
  const [videoData, setVideoData] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/videos/${id}`);
        if (!res.ok) throw new Error("Video not found");
        const data = await res.json();
        setVideoData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchVideo();
  }, [id]);

  useEffect(() => {
    // Fetch related videos from server-side related endpoint
    const fetchRelated = async () => {
      try {
        const res = await fetch(`${API_BASE}/videos/${id}/related`);
        if (!res.ok) throw new Error('Failed to load related');
        const data = await res.json();
        setRelatedVideos(data || []);
      } catch (e) {
        // ignore
      }
    };
    if (id) fetchRelated();
  }, [id]);

  if (error) {
    return (
      <div className="error-container">
        Error loading video: {error}
      </div>
    );
  }
  if (loading) {
    return (
      <div className="loading-container">Loading video...</div>
    );
  }
  if (!videoData) {
    return (
      <div className="error-container">
        Video not found.
      </div>
    );
  }

  return (
    <div className="video-page">
      <div className="video-page-container">
        <VideoPlayer videoId={videoData._id} duration={videoData.duration} />
        <div className="video-content-grid">
          <div className="main-video-content">
            <VideoInfo videoData={videoData} />
          </div>
          <div className="related-videos-sidebar">
            <RelatedVideos videos={relatedVideos} />
          </div>
        </div>
      </div>

      <style jsx>{`
        .video-page {
          background-color: #ffffff;
          min-height: 100vh;
        }

        .video-page-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .video-content-grid {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 30px;
          margin-top: 20px;
        }

        .main-video-content {
          min-width: 0; /* Prevent flex/grid item overflow */
        }

        .related-videos-sidebar {
          min-width: 0; /* Prevent flex/grid item overflow */
        }

        .error-container, .loading-container {
          text-align: center;
          margin-top: 40px;
          padding: 20px;
        }

        .error-container {
          color: #d73a49;
        }

        .loading-container {
          color: #586069;
        }

        /* Media Queries */
        @media (max-width: 1024px) {
          .video-page-container {
            padding: 18px;
          }

          .video-content-grid {
            grid-template-columns: 1fr 280px;
            gap: 24px;
          }
        }

        @media (max-width: 900px) {
          .video-content-grid {
            grid-template-columns: 1fr 260px;
            gap: 20px;
          }
        }

        @media (max-width: 768px) {
          .video-page-container {
            padding: 16px;
          }

          .video-content-grid {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .related-videos-sidebar {
            margin-top: 30px;
            border-top: 1px solid #e1e4e8;
            padding-top: 30px;
          }
        }

        @media (max-width: 640px) {
          .video-page-container {
            padding: 12px;
          }

          .video-content-grid {
            margin-top: 16px;
          }

          .related-videos-sidebar {
            margin-top: 24px;
            padding-top: 24px;
          }

          .error-container, .loading-container {
            margin-top: 30px;
            padding: 16px;
            font-size: 0.95rem;
          }
        }

        @media (max-width: 480px) {
          .video-page-container {
            padding: 8px;
          }

          .video-content-grid {
            margin-top: 12px;
          }

          .related-videos-sidebar {
            margin-top: 20px;
            padding-top: 20px;
          }

          .error-container, .loading-container {
            margin-top: 20px;
            padding: 12px;
            font-size: 0.9rem;
          }
        }

        @media (max-width: 360px) {
          .video-page-container {
            padding: 6px;
          }

          .video-content-grid {
            margin-top: 10px;
          }

          .related-videos-sidebar {
            margin-top: 16px;
            padding-top: 16px;
          }
        }

        /* Print Styles */
        @media print {
          .video-page-container {
            max-width: none;
            padding: 0;
          }

          .video-content-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .related-videos-sidebar {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default VideoPage;