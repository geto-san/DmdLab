import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
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
        if (!res.ok) throw new Error("Video stream unavailable");
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
        if (!res.ok) throw new Error('Related stream failed');
        const data = await res.json();
        setRelatedVideos(data || []);
      } catch {
        // silently fail for related
      }
    };
    if (id) fetchRelated();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-bg-main min-h-screen flex items-center justify-center pt-20">
        <div className="animate-pulse text-text-dim text-[10px] font-bold uppercase tracking-[0.4em]">Initializing Player...</div>
      </div>
    );
  }

  if (error || !videoData) {
    return (
      <div className="bg-bg-main min-h-screen flex flex-col items-center justify-center pt-20">
        <div className="text-red-500 font-bold text-sm uppercase tracking-widest mb-4">Error</div>
        <p className="text-text-secondary">{error || "Video not found"}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-bg-main min-h-screen pt-32 pb-24 transition-colors duration-500"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Player Column */}
          <div className="lg:col-span-2 space-y-10">
            <div className="rounded-[2.5rem] overflow-hidden bg-bg-surface border border-border-main shadow-elevated transition-transform duration-500 hover:shadow-2xl">
              <VideoPlayer
                key={videoData._id}
                videoId={videoData._id}
                title={videoData.title}
                thumbnail={videoData.thumbnail}
                durationIso={videoData.duration}
              />
            </div>
            <div className="bg-bg-surface border border-border-subtle rounded-[2rem] p-10 shadow-soft">
              <VideoInfo videoData={videoData} />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-10">
            <div className="bg-bg-surface border border-border-subtle rounded-[2rem] p-8 shadow-soft lg:sticky lg:top-32">
              <RelatedVideos videos={relatedVideos} />
            </div>
          </aside>
        </div>
      </div>
    </motion.div>
  );
};

export default VideoPage;
