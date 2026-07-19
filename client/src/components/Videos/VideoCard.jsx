import { useState, useRef } from 'react';
import { Play, Volume2, VolumeX } from 'lucide-react';

const formatViews = (count) => {
  const num = Number(count) || 0;
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

const getTimeAgo = (date) => {
  const diffDays = Math.ceil(Math.abs(new Date() - new Date(date)) / (1000 * 60 * 60 * 24));
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
  return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) > 1 ? 's' : ''} ago`;
};

const VideoCard = ({ video, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const videoRef = useRef(null);

  const { title, description, tags = [], author, category, thumbnail, videoUrl, uploadDate, duration, views } = video;

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current && isLoaded) videoRef.current.play().catch(() => {});
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) videoRef.current.pause();
  };
  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div
      onClick={() => onClick && onClick(video)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`flex flex-col sm:flex-row bg-white rounded-2xl cursor-pointer transition-all duration-200 border overflow-hidden ${
        isHovered ? '-translate-y-0.5 shadow-[0_10px_30px_rgba(11,17,32,0.08)] border-signal/25' : 'shadow-[0_2px_8px_rgba(11,17,32,0.04)] border-black/8'
      }`}
    >
      <div className="relative w-full sm:w-[200px] h-[112px] sm:h-auto shrink-0 bg-paper-2 sm:m-3 sm:rounded-xl overflow-hidden">
        {!isHovered && !imageError && (
          <img src={thumbnail} alt={title} className="w-full h-full object-cover" onError={() => setImageError(true)} />
        )}
        {(imageError || !thumbnail) && !isHovered && (
          <div className="w-full h-full bg-paper-2 flex items-center justify-center text-2xl">🎥</div>
        )}
        <video
          ref={videoRef}
          src={videoUrl}
          muted={isMuted}
          playsInline
          loop
          onLoadedData={() => setIsLoaded(true)}
          className={`w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        />
        {!isHovered && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/75 rounded-full w-9 h-9 flex items-center justify-center">
            <Play size={16} color="white" className="ml-0.5" />
          </div>
        )}
        <div className="absolute bottom-1.5 right-1.5 bg-black/75 text-white py-0.5 px-1.5 rounded text-[11px] font-mono">
          {duration || '0:00'}
        </div>
        {isHovered && (
          <button
            onClick={toggleMute}
            className="absolute top-1.5 right-1.5 bg-black/70 rounded-full w-7 h-7 flex items-center justify-center z-10"
          >
            {isMuted ? <VolumeX size={12} color="white" /> : <Volume2 size={12} color="white" />}
          </button>
        )}
      </div>

      <div className="flex-1 p-4 sm:pl-0 flex flex-col justify-center min-w-0">
        <h3 className="text-[15px] font-semibold text-ink-text leading-snug mb-1 line-clamp-2">{title}</h3>
        <div className="text-[13px] text-muted mb-1">
          <span className="text-ink-text font-medium">{author}</span>
          <span className="mx-1.5">·</span>
          <span>{formatViews(views)} views</span>
          <span className="mx-1.5">·</span>
          <span>{getTimeAgo(uploadDate)}</span>
        </div>
        <div className="text-[13px] text-muted leading-relaxed line-clamp-2 mb-2">{description}</div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {category && (
            <span className="bg-paper-2 text-muted px-2 py-0.5 rounded-full text-[11px] font-medium">{category}</span>
          )}
          {tags.slice(0, 2).map((tag, i) => (
            <span key={i} className="bg-signal/10 text-signal px-2 py-0.5 rounded-full text-[11px] font-medium">#{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
