// components/VideoPage/VideoDescription.jsx
import React from 'react';

const VideoDescription = ({ description, tags }) => {
  return (
    <div className="mt-4">
      <p className="text-[15px] leading-[1.6] mb-2.5">{description}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="bg-[#f1f1f1] rounded-2xl px-3 py-1 text-[13px] text-[#333]"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default VideoDescription;
