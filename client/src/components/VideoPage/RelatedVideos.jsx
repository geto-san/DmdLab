// components/VideoPage/RelatedVideos.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const formatViews = (n) => {
  const num = Number(n) || 0;
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

const RelatedVideos = ({ videos = [] }) => {
  const handleClick = async (toVideoId) => {
    try {
      // send click telemetry to server
      await fetch(`/videos/${window.location.pathname.split('/').pop()}/click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toVideoId })
      });
    } catch (e) {
      // ignore telemetry failures
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Related Videos</h3>
      <ul className="space-y-3">
        {videos.map((video) => (
          <li key={video._id} className="flex gap-3 hover:bg-gray-100 p-2 rounded">
            <Link to={`/videos/${video._id}`} style={{ display: 'flex', gap: 12, textDecoration: 'none', color: 'inherit' }} onClick={() => handleClick(video._id)}>
              <img src={video.thumbnail} alt={video.title} className="w-24 h-16 object-cover rounded" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, lineHeight: '1.1rem' }}>{video.title}</div>
                <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: 6 }}>{formatViews(video.views)} views</div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RelatedVideos;
