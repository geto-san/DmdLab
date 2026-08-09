import React from 'react';
import { Search } from 'lucide-react';

const VideoSearch = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="relative group">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-dim group-focus-within:text-brand-primary transition-colors" />
      <input
        type="text"
        placeholder="Search recordings..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full bg-bg-surface border border-border-main rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-text-main focus:outline-none focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary transition-all shadow-soft"
      />
    </div>
  );
};

export default VideoSearch;
