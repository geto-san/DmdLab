import React from 'react';

const VideoPlayer = ({ videoId, duration }) => {
  // Use youtube-nocookie domain and conservative params to reduce tracking/ad scripts.
  const params = new URLSearchParams({ rel: '0', modestbranding: '1', controls: '1', fs: '1' });
  return (
    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, marginBottom: '20px' }}>
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`}
        title="Video Player"
        frameBorder="0"
        allowFullScreen
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      />
      {duration && (
        <span style={{ position: 'absolute', bottom: 8, right: 12, backgroundColor: '#000', color: '#fff', padding: '4px 8px', borderRadius: 4, fontSize: 12 }}>
          {duration}
        </span>
      )}
    </div>
  );
};

export default VideoPlayer;