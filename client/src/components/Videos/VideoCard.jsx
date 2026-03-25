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
      className="video-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        marginBottom: '16px',
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
        transform: isHovered ? 'translateY(-1px)' : 'translateY(0)',
        boxShadow: isHovered 
          ? '0 8px 25px rgba(0, 0, 0, 0.12), 0 4px 10px rgba(0, 0, 0, 0.08)' 
          : '0 2px 8px rgba(0, 0, 0, 0.04)',
        border: '1px solid',
        borderColor: isHovered ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
        padding: '0',
        overflow: 'hidden',
        maxWidth: '100%',
        minHeight: '94px'
      }}
    >
      <div className="video-card-content">
        {/* Video Thumbnail Container */}
        <div className="thumbnail-container" style={{
          width: '168px',
          height: '94px',
          flexShrink: 0,
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          margin: '12px',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(0, 0, 0, 0.06)'
        }}>
          {/* Thumbnail Image */}
          {!isHovered && !imageError && (
            <img
              src={thumbnail}
              alt={title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '8px'
              }}
              onError={() => setImageError(true)}
            />
          )}

          {/* Fallback for missing thumbnail */}
          {(imageError || !thumbnail) && !isHovered && (
            <div style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#f1f3f4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              color: '#5f6368',
              borderRadius: '8px'
            }}>
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
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'absolute',
              top: 0,
              left: 0,
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.3s ease',
              borderRadius: '8px'
            }}
          />

          {/* Play Button Overlay */}
          {!isHovered && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}>
              <Play size={16} color="white" style={{ marginLeft: '2px' }} />
            </div>
          )}

          {/* Duration Badge */}
          <div style={{
            position: 'absolute',
            bottom: '4px',
            right: '4px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: '500',
            letterSpacing: '0.5px',
            fontFamily: 'monospace'
          }}>
            {duration || '0:00'}
          </div>

          {/* Mute Toggle Button */}
          {isHovered && (
            <button
              onClick={toggleMute}
              style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                border: 'none',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
                zIndex: 10
              }}
            >
              {isMuted ? <VolumeX size={12} color="white" /> : <Volume2 size={12} color="white" />}
            </button>
          )}
        </div>

        {/* Video Info Container */}
        <div className="video-info" style={{
          flex: 1,
          padding: '12px 16px 12px 0',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '94px'
        }}>
          {/* Title */}
          <div>
            <h3 style={{
              fontSize: '16px',
              lineHeight: '1.3',
              color: '#1a0dab',
              margin: '0 0 4px 0',
              fontWeight: '400',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textDecoration: isHovered ? 'underline' : 'none',
              cursor: 'pointer'
            }}>
              {title}
            </h3>
            
            {/* Source and Meta Info */}
            <div style={{
              fontSize: '14px',
              color: '#5f6368',
              lineHeight: '1.4',
              marginBottom: '2px'
            }}>
              <span style={{ 
                color: '#202124',
                marginRight: '8px'
              }}>
                {author}
              </span>
              <span style={{ marginRight: '8px' }}>•</span>
              <span>{formatViews(views)} views</span>
              <span style={{ marginLeft: '8px', marginRight: '8px' }}>•</span>
              <span>{getTimeAgo(uploadDate)}</span>
            </div>
          </div>

          {/* Description */}
          <div className="video-description" style={{
            fontSize: '14px',
            color: '#5f6368',
            lineHeight: '1.4',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            marginTop: '4px'
          }}>
            {description}
          </div>

          {/* Tags and Category */}
          <div className="tags-container" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '8px',
            flexWrap: 'wrap'
          }}>
            {category && (
              <span style={{
                backgroundColor: '#f8f9fa',
                color: '#5f6368',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500',
                border: '1px solid #e8eaed'
              }}>
                {category}
              </span>
            )}
            {tags.slice(0, 2).map((tag, i) => (
              <span
                key={i}
                style={{
                  backgroundColor: '#e8f0fe',
                  color: '#1a73e8',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* More Options Button */}
        <div className="more-options" style={{
          padding: '12px 16px 12px 0',
          display: 'flex',
          alignItems: 'flex-start'
        }}>
          <button
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '50%',
              color: '#5f6368',
              transition: 'background-color 0.2s ease',
              opacity: isHovered ? 1 : 0.7
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f1f3f4'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
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