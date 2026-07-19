import { useEffect, useState } from 'react';
import { Bell, Clock, ChevronRight } from 'lucide-react';
import API_BASE from '../../utils/api';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetchAnnouncements = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/announcements?limit=6`);
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const data = await res.json();
        if (!cancelled) setAnnouncements(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!cancelled) setError(err.message || String(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchAnnouncements();
    return () => { cancelled = true; };
  }, []);

  const items = announcements.length > 0 ? announcements : [
    { title: 'No announcements yet', body: 'Check back soon', date: new Date().toISOString(), priority: 'low' }
  ];

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-xl overflow-hidden">
      <div className="bg-slate-50 py-4 px-5 border-b border-[#e5e7eb] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell size={20} color="#3b82f6" />
          <h3 className="m-0 text-[1.1rem] font-semibold text-gray-800">Announcements</h3>
        </div>
        <button className="bg-transparent border-none text-blue-500 cursor-pointer text-[0.9rem] flex items-center gap-1">
          View All
          <ChevronRight size={16} />
        </button>
      </div>
      <div className="p-5">
        {loading && <div className="text-gray-500">Loading announcements…</div>}
        {error && <div className="text-red-500">Failed to load: {error}</div>}
        {!loading && !error && items.map((announcement, index) => (
          <div
            key={announcement._id || index}
            className={`pb-4 mb-4 ${index < items.length - 1 ? 'border-b border-[#f3f4f6]' : 'border-b-0'}`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                  announcement.priority === 'high'
                    ? 'bg-red-500'
                    : announcement.priority === 'medium'
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
              ></div>
              <div className="flex-1">
                <h4 className="m-0 mb-1 text-[0.95rem] font-semibold text-gray-800">{announcement.title}</h4>
                <p className="m-0 mb-1.5 text-[0.85rem] text-gray-500 leading-[1.4]">{announcement.body || announcement.excerpt || ''}</p>
                <div className="text-[0.8rem] text-gray-400 flex items-center gap-1">
                  <Clock size={12} />
                  {new Date(announcement.date).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;
