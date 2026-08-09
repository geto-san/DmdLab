import React from 'react';
import VideoCard from './VideoCard';

const VideoList = ({ videos, onVideoClick }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {videos.map(video => (
        <VideoCard
          key={video._id}
          video={video}
          onClick={() => onVideoClick(video)}
        />
      ))}
    </div>
  );
};

export default VideoList;
