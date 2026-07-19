import { Search } from 'lucide-react';

const VideoSearch = ({ searchTerm, setSearchTerm }) => (
  <div className="relative mb-5 max-w-md w-full">
    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-2" />
    <input
      type="text"
      placeholder="Search videos..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full pl-10 pr-4 py-2.5 text-sm rounded-full border border-black/10 bg-white focus:border-signal focus:ring-2 focus:ring-signal/15 outline-none transition-colors"
    />
  </div>
);

export default VideoSearch;
