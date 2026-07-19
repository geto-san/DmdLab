import React, { useState, useRef } from 'react';
import { Play, Calendar, Eye, Clock, Volume2, VolumeX, MoreVertical } from 'lucide-react';

const VideoCard = ({ video, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const videoRef = useRef(null);

  const {
    title,
    description,
    tags = [],
    author,
    category,
    thumbnail,
    videoUrl,
    uploadDate,
    duration,
    views
  } = video;

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current && isLoaded) {
      videoRef.current.play().catch(() => { });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const formatViews = (count) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count?.toString() || '0';
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const uploadTime = new Date(date);
    const diffTime = Math.abs(now - uploadTime);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 7) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} year${years > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div
      onClick={() => onClick(video)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`video-card flex flex-col bg-white rounded-xl mb-4 cursor-pointer transition-all duration-200 ease-[cubic-bezier(0.4,0.0,0.2,1)] border p-0 overflow-hidden max-w-full min-h-[94px] ${
        isHovered
          ? '-translate-y-px shadow-[0_8px_25px_rgba(0,0,0,0.12),0_4px_10px_rgba(0,0,0,0.08)] border-[rgba(0,0,0,0.08)]'
          : 'translate-y-0 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border-transparent'
      }`}
    >
      <div className="video-card-content">
        {/* Video Thumbnail Container */}
        <div className="thumbnail-container w-[168px] h-[94px] shrink-0 bg-[#f8f9fa] rounded-lg m-3 relative overflow-hidden border border-[rgba(0,0,0,0.06)]">
          {/* Thumbnail Image */}
          {!isHovered && !imageError && (
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover rounded-lg"
              onError={() => setImageError(true)}
            />
          )}

          {/* Fallback for missing thumbnail */}
          {(imageError || !thumbnail) && !isHovered && (
            <div className="w-full h-full bg-[#f1f3f4] flex items-center justify-center text-2xl text-[#5f6368] rounded-lg">
              🎥
            </div>
          )}

          {/* Video Element for Preview */}
          <video
            ref={videoRef}
            src={videoUrl}
            muted={isMuted}
            playsInline
            loop
            onLoadedData={() => setIsLoaded(true)}
            className={`w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-300 ease rounded-lg ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          />

          {/* Play Button Overlay */}
          {!isHovered && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[rgba(0,0,0,0.8)] rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200 ease">
              <Play size={16} color="white" className="ml-0.5" />
            </div>
          )}

          {/* Duration Badge */}
          <div className="absolute bottom-1 right-1 bg-[rgba(0,0,0,0.8)] text-white py-0.5 px-1.5 rounded text-[11px] font-medium tracking-[0.5px] font-mono">
            {duration || '0:00'}
          </div>

          {/* Mute Toggle Button */}
          {isHovered && (
            <button
              onClick={toggleMute}
              className="absolute top-1.5 right-1.5 bg-[rgba(0,0,0,0.7)] border-none rounded-full w-7 h-7 flex items-center justify-center cursor-pointer transition-colors duration-200 ease z-10"
            >
              {isMuted ? <VolumeX size={12} color="white" /> : <Volume2 size={12} color="white" />}
            </button>
          )}
        </div>

        {/* Video Info Container */}
        <div className="video-info flex-1 py-3 pr-4 pl-0 flex flex-col justify-between min-h-[94px]">
          {/* Title */}
          <div>
            <h3 className={`text-base leading-[1.3] text-[#1a0dab] m-0 mb-1 font-normal line-clamp-2 cursor-pointer ${isHovered ? 'underline' : 'no-underline'}`}>
              {title}
            </h3>

            {/* Source and Meta Info */}
            <div className="text-sm text-[#5f6368] leading-[1.4] mb-0.5">
              <span className="text-[#202124] mr-2">
                {author}
              </span>
              <span className="mr-2">•</span>
              <span>{formatViews(views)} views</span>
              <span className="ml-2 mr-2">•</span>
              <span>{getTimeAgo(uploadDate)}</span>
            </div>
          </div>

          {/* Description */}
          <div className="video-description text-sm text-[#5f6368] leading-[1.4] line-clamp-2 mt-1">
            {description}
          </div>

          {/* Tags and Category */}
          <div className="tags-container flex items-center gap-2 mt-2 flex-wrap">
            {category && (
              <span className="bg-[#f8f9fa] text-[#5f6368] px-2 py-0.5 rounded-xl text-xs font-medium border border-[#e8eaed]">
                {category}
              </span>
            )}
            {tags.slice(0, 2).map((tag, i) => (
              <span
                key={i}
                className="bg-[#e8f0fe] text-[#1a73e8] px-2 py-0.5 rounded-xl text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* More Options Button */}
        <div className="more-options py-3 pr-4 pl-0 flex items-start">
          <button
            onClick={(e) => e.stopPropagation()}
            className={`bg-transparent border-none cursor-pointer p-2 rounded-full text-[#5f6368] transition-colors duration-200 ease hover:bg-[#f1f3f4] ${isHovered ? 'opacity-100' : 'opacity-70'}`}
          >
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      <style jsx>{`
        .video-card-content {
          display: flex;
          width: 100%;
        }

        @media (max-width: 768px) {
          .video-card-content {
            flex-direction: column;
          }

          .thumbnail-container {
            width: 100% !important;
            height: 200px !important;
            margin: 0 !important;
            border-radius: 0 !important;
            border: none !important;
          }

          .video-info {
            padding: 12px !important;
            min-height: auto !important;
          }

          .more-options {
            padding: 0 12px 12px 12px !important;
            align-items: center !important;
            justify-content: flex-end;
          }

          .video-description {
            -webkit-line-clamp: 3 !important;
          }

          .tags-container {
            margin-top: 12px !important;
          }
        }

        @media (max-width: 480px) {
          .thumbnail-container {
            height: 180px !important;
          }

          h3 {
            font-size: 15px !important;
          }

          .video-description {
            font-size: 13px !important;
          }
        }

        @media (max-width: 360px) {
          .thumbnail-container {
            height: 160px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default VideoCard;
