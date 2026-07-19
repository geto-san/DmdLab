import { useEffect, useState } from 'react';
import { Bell, Clock } from 'lucide-react';
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

  return (
    <div className="bg-white border border-black/8 rounded-2xl overflow-hidden sticky top-24">
      <div className="bg-paper-2/60 py-4 px-5 border-b border-black/8 flex items-center gap-2">
        <Bell size={18} className="text-signal" />
        <h3 className="m-0 font-display font-semibold text-ink-text">Announcements</h3>
      </div>
      <div className="p-5">
        {loading && <div className="text-muted text-sm">Loading announcements…</div>}
        {error && <div className="text-red-500 text-sm">Failed to load: {error}</div>}
        {!loading && !error && announcements.length === 0 && (
          <div className="text-muted text-sm">No announcements yet — check back soon.</div>
        )}
        {!loading && !error && announcements.map((announcement, index) => (
          <div
            key={announcement._id || index}
            className={`pb-4 mb-4 ${index < announcements.length - 1 ? 'border-b border-black/[0.06]' : 'border-b-0 pb-0 mb-0'}`}
          >
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0 bg-signal" />
              <div className="flex-1 min-w-0">
                <h4 className="m-0 mb-1 text-[14px] font-semibold text-ink-text">{announcement.title}</h4>
                <p className="m-0 mb-1.5 text-[13px] text-muted leading-relaxed">{announcement.body || announcement.excerpt || ''}</p>
                <div className="text-[11px] text-muted-2 flex items-center gap-1">
                  <Clock size={11} />
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
