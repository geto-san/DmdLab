// components/VideoPage/VideoDescription.jsx
import React from 'react';

const VideoDescription = ({ description, tags }) => {
  return (
    <div style={{ marginTop: '16px' }}>
      <p style={{ fontSize: '15px', lineHeight: '1.6', marginBottom: '10px' }}>{description}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {tags.map((tag, index) => (
          <span
            key={index}
            style={{
              backgroundColor: '#f1f1f1',
              borderRadius: '16px',
              padding: '4px 12px',
              fontSize: '13px',
              color: '#333'
            }}
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default VideoDescription;
