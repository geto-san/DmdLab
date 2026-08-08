import { ThumbsUp, Eye, Calendar } from 'lucide-react';

const VideoInfo = ({ videoData }) => {
  if (!videoData) return null;
  const { title = '', views = 0, likes = 0, uploadDate = '', category = '' } = videoData;

  const safeViews = typeof views === 'number' && !isNaN(views) ? views : 0;
  const safeLikes = typeof likes === 'number' && !isNaN(likes) ? likes : 0;
  let dateString = '';
  try {
    dateString = uploadDate ? new Date(uploadDate).toLocaleDateString() : '';
  } catch {
    dateString = '';
  }

  return (
    <div className="mb-4">
      <h1 className="font-display font-semibold text-2xl text-ink-text mb-3">{title}</h1>
      <div className="flex items-center flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
        <span className="flex items-center gap-1.5"><Eye size={15} /> {safeViews.toLocaleString()} views</span>
        <span className="flex items-center gap-1.5"><ThumbsUp size={15} /> {safeLikes.toLocaleString()} likes</span>
        <span className="flex items-center gap-1.5"><Calendar size={15} /> {dateString}</span>
        {category && (
          <span className="px-2.5 py-0.5 bg-signal/10 text-signal rounded-full text-xs font-medium">{category}</span>
        )}
      </div>
    </div>
  );
};

export default VideoInfo;
