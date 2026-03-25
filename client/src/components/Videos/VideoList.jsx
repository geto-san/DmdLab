import React, { useState } from 'react';

const VideoList = ({ videos, onVideoClick }) => {
  return (
    <>
      <div className="video-list-container">
        {videos.map(video => (
          <VideoCard key={video._id} video={video} onClick={() => onVideoClick(video)} />
        ))}
      </div>

      <style jsx>{`
        .video-list-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          width: 100%;
        }
        
        @media (max-width: 1200px) {
          .video-list-container {
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
            gap: 20px;
          }
        }
        
        @media (max-width: 768px) {
          .video-list-container {
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 16px;
          }
        }
        
        @media (max-width: 640px) {
          .video-list-container {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }
        
        @media (max-width: 480px) {
          .video-list-container {
            gap: 12px;
          }
        }
      `}</style>
    </>
  );
};

const VideoCard = ({ video, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const [muted, setMuted] = useState(true);

  return (
    <>
      <div
        className="video-card"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false);
          setMuted(true); // reset mute on leave
        }}
        onClick={onClick}
      >
        <div className="thumbnail-wrapper">
          {!hovered && (
            <img
              src={video.thumbnail}
              alt={video.title}
              className="thumbnail-image"
              draggable={false}
            />
          )}

          {hovered && (
            <>
              <iframe
                src={`https://www.youtube.com/embed/${video._id}?autoplay=1&mute=${muted ? 1 : 0}&controls=0&modestbranding=1&rel=0&playsinline=1`}
                title={video.title}
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="video-iframe"
              />
              <button
                onClick={e => {
                  e.stopPropagation();
                  setMuted(!muted);
                }}
                className="mute-button"
                aria-label={muted ? 'Unmute video' : 'Mute video'}
                title={muted ? 'Unmute video' : 'Mute video'}
              >
                {muted ? '🔇' : '🔊'}
              </button>
            </>
          )}
        </div>
        <div className="video-info">
          <h3 className="video-title" title={video.title}>
            {video.title}
          </h3>
          <p className="video-author">
            {video.author}
          </p>
          <p className="video-date">
            {new Date(video.uploadDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      <style jsx>{`
        .video-card {
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgb(0 0 0 / 0.1);
          cursor: pointer;
          background-color: #fff;
          display: flex;
          flex-direction: column;
          user-select: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .video-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgb(0 0 0 / 0.15);
        }
        
        .thumbnail-wrapper {
          position: relative;
          width: 100%;
          padding-top: 56.25%; /*16:9 ratio*/
        }
        
        .thumbnail-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .video-iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: none;
        }
        
        .mute-button {
          position: absolute;
          bottom: 8px;
          right: 8px;
          background-color: rgba(0,0,0,0.5);
          border: none;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          color: #fff;
          font-size: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          user-select: none;
          transition: background-color 0.2s ease;
        }
        
        .mute-button:hover {
          background-color: rgba(0,0,0,0.7);
        }
        
        .video-info {
          padding: 12px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        
        .video-title {
          font-size: 16px;
          font-weight: 600;
          color: #24292e;
          margin-bottom: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          line-height: 1.3;
        }
        
        .video-author {
          font-size: 14px;
          color: #586069;
          margin: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .video-date {
          font-size: 12px;
          color: #888;
          margin-top: 2px;
        }
        
        @media (max-width: 768px) {
          .video-info {
            padding: 10px;
          }
          
          .video-title {
            font-size: 15px;
          }
          
          .video-author {
            font-size: 13px;
          }
          
          .video-date {
            font-size: 11px;
          }
          
          .mute-button {
            width: 32px;
            height: 32px;
            font-size: 14px;
          }
        }
        
        @media (max-width: 480px) {
          .video-info {
            padding: 8px;
          }
          
          .video-title {
            font-size: 14px;
            white-space: normal;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          
          .video-author {
            font-size: 12px;
          }
        }
        
        @media (max-width: 360px) {
          .video-card {
            border-radius: 6px;
          }
        }
      `}</style>
    </>
  );
};

export default VideoList;