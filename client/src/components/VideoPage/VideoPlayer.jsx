const VideoPlayer = ({ videoId, duration }) => {
  const params = new URLSearchParams({ rel: '0', modestbranding: '1', controls: '1', fs: '1' });
  return (
    <div className="relative aspect-video mb-5 rounded-2xl overflow-hidden bg-ink">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`}
        title="Video Player"
        frameBorder="0"
        allowFullScreen
        className="absolute top-0 left-0 w-full h-full"
      />
      {duration && (
        <span className="absolute bottom-3 right-3 bg-black/80 text-white px-2 py-1 rounded text-xs font-mono pointer-events-none">
          {duration}
        </span>
      )}
    </div>
  );
};

export default VideoPlayer;
