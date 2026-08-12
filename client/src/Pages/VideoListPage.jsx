import React, { useState, useEffect } from 'react';
import VideoSearch from '../components/Videos/VideoSearch';
import VideoFilters from '../components/Videos/VideoFilters';
import VideoCard from '../components/Videos/VideoCard';
import { Link } from 'react-router-dom';
import { Video } from 'lucide-react';
import useVideos from '../hooks/useVideos';

const VideoListPage = () => {
  const { videos, loading, error } = useVideos();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredVideos, setFilteredVideos] = useState([]);

  useEffect(() => {
    let filtered = videos;
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(video => video.category === selectedCategory);
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(q) ||
        video.description.toLowerCase().includes(q) ||
        video.author.toLowerCase().includes(q) ||
        video.tags?.some(tag => tag.toLowerCase().includes(q))
      );
    }
    setFilteredVideos(filtered);
  }, [videos, searchTerm, selectedCategory]);

  return (
    <div className="bg-bg-main min-h-screen pt-40 pb-24 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        <header className="mb-16">
          <span className="eyebrow">Lab Activities</span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-text-main mb-6 tracking-tight">
            Recorded <span className="text-brand-primary accent-soften">Discussions</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl leading-relaxed">
            Centralized access to our research presentations, weekly syncs, and guest lectures.
          </p>
        </header>

        <div className="grid lg:grid-cols-4 gap-12 items-start">
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-10 lg:sticky lg:top-32">
            <VideoSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <VideoFilters selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />

            <div className="bg-bg-surface border border-border-main rounded-3xl p-8 shadow-soft">
              <h4 className="text-[10px] font-bold text-text-main uppercase tracking-widest mb-4 opacity-40">Library Summary</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-text-secondary uppercase">Total Content</span>
                  <span className="text-sm font-bold text-text-main">{videos.length}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-border-main">
                  <span className="text-xs font-bold text-text-secondary uppercase">Active Filter</span>
                  <span className="text-[10px] font-bold text-brand-primary bg-primary-soft px-2 py-0.5 rounded-lg accent-soften uppercase">{selectedCategory}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Content Area */}
          <main className="lg:col-span-3">
            {loading && (
              <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                <div className="w-12 h-12 rounded-full border-2 border-brand-primary/20 border-t-brand-primary animate-spin mb-4" />
                <p className="text-text-dim text-xs font-bold uppercase tracking-widest">Synchronizing Library...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/10 rounded-2xl p-8 text-center">
                <p className="text-red-600 dark:text-red-400 font-bold uppercase tracking-widest text-[10px]">Data Stream Error</p>
                <p className="text-sm text-red-800 dark:text-red-300 mt-2">{error}</p>
              </div>
            )}

            {!loading && !error && (
              <>
                {filteredVideos.length === 0 ? (
                  <div className="bg-bg-surface border border-dashed border-border-strong rounded-3xl p-20 text-center">
                    <div className="inline-flex p-5 rounded-full bg-bg-main text-text-dim mb-6"><Video size={48} /></div>
                    <h3 className="text-2xl font-bold text-text-main mb-2">No matching content</h3>
                    <p className="text-text-secondary max-w-sm mx-auto">Try refining your search terms or selecting a different research category.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-16">
                    {filteredVideos.map(video => (
                      <Link key={video._id} to={`/videos/${video._id}`} className="block h-full">
                        <VideoCard video={video} />
                      </Link>
                    ))}
                  </div>
                )}

                <div className="mt-20 pt-8 border-t border-border-main text-[10px] font-bold text-text-dim uppercase tracking-widest text-center">
                  Showing {filteredVideos.length} of {videos.length} Laboratory recordings
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default VideoListPage;
