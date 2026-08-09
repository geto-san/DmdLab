import React from 'react';
import { Mail, Github, Linkedin } from 'lucide-react';

const AuthorSection = ({ author }) => {
  return (
    <div className="flex items-center justify-between py-8 border-y border-border-main">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-sm font-bold text-brand-primary uppercase tracking-tighter">
          {author?.charAt(0) || 'U'}
        </div>
        <div>
          <div className="text-[10px] font-bold text-text-dim uppercase tracking-widest">Presented By</div>
          <div className="text-base font-bold text-text-main">{author || 'DeepMinds Researcher'}</div>
        </div>
      </div>
      <div className="flex gap-4">
        <a href="#" className="text-text-dim hover:text-brand-primary transition-colors accent-soften"><Mail size={18} /></a>
        <a href="#" className="text-text-dim hover:text-brand-primary transition-colors accent-soften"><Linkedin size={18} /></a>
        <a href="#" className="text-text-dim hover:text-brand-primary transition-colors accent-soften"><Github size={18} /></a>
      </div>
    </div>
  );
};

export default AuthorSection;
