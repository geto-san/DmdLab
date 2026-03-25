import React from 'react';
import { ThumbsUp, Eye, Calendar } from 'lucide-react';


const VideoInfo = ({ videoData }) => {
  if (!videoData) return null;
  const {
    title = '',
    views = 0,
    likes = 0,
    uploadDate = '',
    category = ''
  } = videoData;

  // Defensive: fallback for missing/invalid values
  const safeViews = typeof views === 'number' && !isNaN(views) ? views : 0;
  const safeLikes = typeof likes === 'number' && !isNaN(likes) ? likes : 0;
  let dateString = '';
  try {
    dateString = uploadDate ? new Date(uploadDate).toLocaleDateString() : '';
  } catch {
    dateString = '';
  }

  return (
    <div className="mb-4">
      <h1 className="text-2xl font-semibold mb-2">{title}</h1>
      <div className="flex items-center text-sm text-gray-600 gap-4">
        <span className="flex items-center gap-1">
          <Eye size={16} /> {safeViews.toLocaleString()} views
        </span>
        <span className="flex items-center gap-1">
          <ThumbsUp size={16} /> {safeLikes.toLocaleString()} likes
        </span>
        <span className="flex items-center gap-1">
          <Calendar size={16} /> {dateString}
        </span>
        {category && (
          <span className="ml-2 px-2 py-1 bg-gray-100 rounded text-xs">{category}</span>
        )}
      </div>
    </div>
  );
};

export default VideoInfo;
