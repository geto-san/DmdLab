import { useState, useEffect } from 'react';
import { Video as VideoIcon } from 'lucide-react';
import VideoSearch from '../components/Videos/VideoSearch';
import VideoFilters from '../components/Videos/VideoFilters';
import VideoCard from '../components/Videos/VideoCard';
import { Link } from 'react-router-dom';
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
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredVideos(filtered);
  }, [videos, searchTerm, selectedCategory]);

  return (
    <div className="bg-paper min-h-screen">
      <div className="bg-ink text-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-14">
          <span className="eyebrow text-amber">From the channel</span>
          <h1 className="font-display font-semibold text-3xl sm:text-4xl mt-3">Videos</h1>
          <p className="text-white/60 mt-2 max-w-xl">
            Talks, demos, and lab sessions pulled live from our YouTube channel.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        <div className="min-w-0">
          {loading && <p className="text-center text-muted py-10">Loading videos…</p>}
          {error && <p className="text-center text-red-500 py-10">Error: {error}</p>}

          {!loading && !error && (
            <>
              {filteredVideos.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-black/10 rounded-2xl">
                  <VideoIcon className="mx-auto mb-3 text-muted-2" size={28} />
                  <h3 className="font-display font-semibold text-ink-text mb-1">No videos found</h3>
                  <p className="text-muted text-sm">Try adjusting your search or filter.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {filteredVideos.map(video => (
                    <Link key={video._id} to={`/videos/${video._id}`}>
                      <VideoCard video={video} />
                    </Link>
                  ))}
                </div>
              )}

              <div className="text-center mt-6 text-muted text-sm">
                Showing {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''}
                {selectedCategory !== 'All' && ` in ${selectedCategory}`}
                {searchTerm && ` matching "${searchTerm}"`}
              </div>
            </>
          )}
        </div>

        <aside className="sticky top-24 self-start">
          <VideoSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <VideoFilters selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
          <div className="mt-5 p-4 bg-white border border-black/8 rounded-2xl">
            <h4 className="font-display font-semibold text-ink-text mb-3 text-sm">Summary</h4>
            <div className="text-[13px] text-muted mb-1.5">
              Total videos: <strong className="text-ink-text">{videos.length}</strong>
            </div>
            <div className="text-[13px] text-muted">
              Category: <strong className="text-ink-text">{selectedCategory}</strong>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default VideoListPage;
