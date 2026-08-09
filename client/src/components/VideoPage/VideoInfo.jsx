import React from 'react';
import { Eye, Clock, Calendar } from 'lucide-react';

const VideoInfo = ({ videoData }) => {
  const { title, author, views, uploadDate, category, description, durationLabel } = videoData;

  const formatViews = (count) => {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
    return count?.toString() || '0';
  };

  return (
    <div className="space-y-8 text-left">
      <div>
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-soft text-brand-primary text-[10px] font-bold uppercase tracking-widest mb-6">
          {category}
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-main leading-tight tracking-tight mb-6">
          {title}
        </h1>
        <div className="flex flex-wrap items-center gap-6 text-[10px] font-bold text-text-dim uppercase tracking-[0.2em]">
          <div className="flex items-center gap-2">
            <Eye size={14} className="text-brand-primary accent-soften" />
            <span>{formatViews(views)} Views</span>
          </div>
          {durationLabel && (
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-brand-primary accent-soften" />
              <span>{durationLabel}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-brand-primary accent-soften" />
            <span>{new Date(uploadDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-border-main">
        <div className="flex items-center gap-4 mb-8">
           <div className="w-12 h-12 rounded-2xl bg-bg-surface border border-border-main flex items-center justify-center text-sm font-bold text-brand-primary uppercase tracking-tighter">
             {author?.charAt(0) || 'U'}
           </div>
           <div>
             <div className="text-[10px] font-bold text-text-dim uppercase tracking-widest">Presenter</div>
             <div className="text-base font-bold text-text-main">{author || 'DeepMinds Researcher'}</div>
           </div>
        </div>
        <p className="text-lg text-text-secondary leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

export default VideoInfo;
