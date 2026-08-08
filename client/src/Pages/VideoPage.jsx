import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import VideoPlayer from "../components/VideoPage/VideoPlayer";
import VideoInfo from "../components/VideoPage/VideoInfo";
import RelatedVideos from "../components/VideoPage/RelatedVideos";
import API_BASE from '../utils/api';

const VideoPage = () => {
  const { id } = useParams();
  const [videoData, setVideoData] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/videos/${id}`);
        if (!res.ok) throw new Error("Video not found");
        const data = await res.json();
        setVideoData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchVideo();
  }, [id]);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await fetch(`${API_BASE}/videos/${id}/related`);
        if (!res.ok) throw new Error('Failed to load related');
        const data = await res.json();
        setRelatedVideos(data || []);
      } catch {
        // ignore
      }
    };
    if (id) fetchRelated();
  }, [id]);

  if (error) {
    return <div className="text-center py-20 text-red-500">Error loading video: {error}</div>;
  }
  if (loading) {
    return <div className="text-center py-20 text-muted">Loading video…</div>;
  }
  if (!videoData) {
    return <div className="text-center py-20 text-red-500">Video not found.</div>;
  }

  return (
    <div className="bg-paper min-h-screen">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-8">
        <Link to="/videos" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-signal mb-5 transition-colors">
          <ArrowLeft size={15} /> Back to videos
        </Link>

        <VideoPlayer videoId={videoData._id} duration={videoData.duration} />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 mt-2">
          <div className="min-w-0">
            <VideoInfo videoData={videoData} />
          </div>
          <div className="min-w-0 border-t lg:border-t-0 lg:border-l border-black/8 pt-6 lg:pt-0 lg:pl-6">
            <RelatedVideos videos={relatedVideos} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPage;
