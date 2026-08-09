import React from 'react';
import { Tag } from 'lucide-react';

const VideoDescription = ({ description, tags = [] }) => {
  return (
    <div className="space-y-6">
      <p className="text-lg text-text-secondary leading-relaxed">
        {description}
      </p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, i) => (
          <span key={i} className="flex items-center gap-2 bg-bg-surface border border-border-subtle px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest text-text-secondary transition-colors hover:border-brand-primary/20">
            <Tag size={10} className="text-brand-primary accent-soften" />
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default VideoDescription;
