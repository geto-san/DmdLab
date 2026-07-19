import { Link } from 'react-router-dom';
import API_BASE from '../../utils/api';

const formatViews = (n) => {
  const num = Number(n) || 0;
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

const RelatedVideos = ({ videos = [] }) => {
  const handleClick = async (toVideoId) => {
    try {
      await fetch(`${API_BASE}/videos/${window.location.pathname.split('/').pop()}/click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toVideoId }),
      });
    } catch {
      // ignore telemetry failures
    }
  };

  if (videos.length === 0) return null;

  return (
    <div>
      <h3 className="font-display font-semibold text-ink-text mb-4">Related videos</h3>
      <ul className="space-y-2">
        {videos.map((video) => (
          <li key={video._id}>
            <Link
              to={`/videos/${video._id}`}
              onClick={() => handleClick(video._id)}
              className="flex gap-3 p-2 rounded-xl hover:bg-white transition-colors"
            >
              <img src={video.thumbnail} alt={video.title} className="w-24 h-16 object-cover rounded-lg shrink-0" />
              <div className="min-w-0">
                <div className="text-[13px] font-semibold text-ink-text leading-snug line-clamp-2">{video.title}</div>
                <div className="text-[12px] text-muted mt-1">{formatViews(video.views)} views</div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RelatedVideos;
