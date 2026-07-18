import { useEffect, useState } from 'react';
import API_BASE from '../utils/api';

export default function AdminVideos({ token }) {
  const [videos, setVideos] = useState([]);
  const [newVideo, setNewVideo] = useState({ title: '', youtubeUrl: '', description: '' });
  const [error, setError] = useState(null);

  async function load() {
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/admin/videos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Server ${res.status}`);
      const data = await res.json();
      setVideos(data);
    } catch (err) {
      setError(err.message || 'Failed to load videos');
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: run once on mount only
  useEffect(() => { load(); }, []);

  async function createVideo(e) {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/admin/videos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(newVideo)
      });
      if (!res.ok) throw new Error(`Server ${res.status}`);
      setNewVideo({ title: '', youtubeUrl: '', description: '' });
      load();
    } catch (err) {
      setError(err.message || 'Failed to create video');
    }
  }

  async function deleteVideo(id) {
    if (!confirm('Delete this video?')) return;
    try {
      const res = await fetch(`${API_BASE}/admin/videos/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(`Server ${res.status}`);
      load();
    } catch (err) {
      setError(err.message || 'Failed to delete video');
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Manage YouTube Videos</h2>
      {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
      <form onSubmit={createVideo} className="mb-4 space-y-2">
        <input placeholder="Title" className="p-2 border w-full" value={newVideo.title} onChange={e=>setNewVideo({...newVideo, title: e.target.value})}/>
        <input placeholder="YouTube URL" className="p-2 border w-full" value={newVideo.youtubeUrl} onChange={e=>setNewVideo({...newVideo, youtubeUrl: e.target.value})}/>
        <textarea placeholder="Description" className="p-2 border w-full" value={newVideo.description} onChange={e=>setNewVideo({...newVideo, description: e.target.value})}/>
        <button className="px-3 py-2 bg-green-600 text-white rounded">Add Video</button>
      </form>

      <ul className="space-y-3">
        {videos.map(v => (
          <li key={v._id} className="p-3 border rounded">
            <div className="flex justify-between">
              <div>
                <div className="font-semibold">{v.title}</div>
                <div className="text-sm text-gray-600">{v.youtubeUrl}</div>
                <div className="text-xs text-gray-500">{v.description}</div>
              </div>
              <button className="px-2 py-1 bg-red-600 text-white rounded" onClick={() => deleteVideo(v._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
