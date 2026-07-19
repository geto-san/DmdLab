import React from 'react';

const VideoPlayer = ({ videoId, duration }) => {
  // Use youtube-nocookie domain and conservative params to reduce tracking/ad scripts.
  const params = new URLSearchParams({ rel: '0', modestbranding: '1', controls: '1', fs: '1' });
  return (
    <div className="relative aspect-video mb-5">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`}
        title="Video Player"
        frameBorder="0"
        allowFullScreen
        className="absolute top-0 left-0 w-full h-full"
      />
      {duration && (
        <span className="absolute bottom-2 right-3 bg-black text-white px-2 py-1 rounded text-xs">
          {duration}
        </span>
      )}
    </div>
  );
};

export default VideoPlayer;
