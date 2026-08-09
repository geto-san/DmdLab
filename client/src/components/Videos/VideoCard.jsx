import React from 'react';
import { Play } from 'lucide-react';

const VideoCard = ({ video, onClick }) => {
  const {
    _id,
    title,
    author,
    thumbnail,
    uploadDate,
    durationLabel,
    views
  } = video;

  const formatViews = (count) => {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
    return count?.toString() || '0';
  };

  return (
    <div
      onClick={() => onClick(video)}
      className="group cursor-pointer animate-fade-up"
    >
      <div className="relative aspect-video rounded-3xl overflow-hidden bg-bg-surface mb-6 shadow-soft border border-border-subtle group-hover:shadow-elevated transition-all duration-500">
        <img
          src={thumbnail}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-ink shadow-elevated backdrop-blur-sm transition-transform duration-300 group-hover:scale-105">
            <Play size={26} className="ml-1 fill-current" />
          </span>
        </div>

        {durationLabel && (
          <div className="absolute bottom-4 right-4 bg-bg-main/90 backdrop-blur-md text-text-main text-[10px] font-bold px-2 py-1 rounded-xl uppercase tracking-widest border border-border-subtle shadow-soft">
            {durationLabel}
          </div>
        )}
      </div>

      <div className="px-1">
        <h3 className="text-lg font-bold text-text-main mb-2 group-hover:text-brand-primary transition-colors line-clamp-2 leading-snug tracking-tight">
          {title}
        </h3>
        <div className="flex items-center gap-2 text-[10px] font-bold text-text-dim uppercase tracking-widest">
          <span className="text-text-secondary">{author}</span>
          <span className="opacity-30">•</span>
          <span>{formatViews(views)} views</span>
          <span className="opacity-30">•</span>
          <span>{new Date(uploadDate).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
