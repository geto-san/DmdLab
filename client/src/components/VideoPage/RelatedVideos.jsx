import React from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';

const RelatedVideos = ({ videos }) => {
  return (
    <div className="space-y-8">
      <h3 className="text-sm font-bold text-text-main uppercase tracking-[0.25em] opacity-40">Related Recordings</h3>
      <div className="space-y-6">
        {videos.map((video) => (
          <Link
            key={video._id}
            to={`/videos/${video._id}`}
            className="group flex gap-4 items-start"
          >
            <div className="relative w-32 aspect-video rounded-xl overflow-hidden shrink-0 border border-border-subtle bg-bg-main shadow-sm">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-ink/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <Play size={12} className="text-white fill-current" />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-text-main leading-snug group-hover:text-brand-primary transition-colors line-clamp-2 tracking-tight">
                {video.title}
              </h4>
              <div className="text-[10px] font-bold text-text-dim uppercase tracking-widest mt-2">
                {video.author}
              </div>
            </div>
          </Link>
        ))}
        {videos.length === 0 && (
          <p className="text-xs font-bold text-text-dim uppercase tracking-widest text-center py-4">No related content found</p>
        )}
      </div>
    </div>
  );
};

export default RelatedVideos;
