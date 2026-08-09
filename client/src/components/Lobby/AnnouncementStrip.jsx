import React, { useEffect, useState } from 'react';
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
    <div className="bg-bg-surface border border-border-main rounded-[2.5rem] overflow-hidden shadow-soft animate-fade-up transition-all duration-500">
      <div className="bg-bg-surface-hover py-6 px-8 border-b border-border-main flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell size={20} className="text-brand-primary accent-soften" />
          <h3 className="text-[10px] font-bold text-text-main uppercase tracking-[0.3em]">Updates</h3>
        </div>
        <button className="text-brand-primary font-bold text-[10px] uppercase tracking-[0.25em] hover:underline flex items-center gap-2 bg-transparent border-none cursor-pointer">
          Archive
          <ChevronRight size={14} />
        </button>
      </div>
      <div className="p-8">
        {loading && <div className="text-text-dim text-xs font-bold uppercase tracking-[0.2em] animate-pulse">Synchronizing...</div>}
        {error && <div className="text-red-400 text-[10px] font-bold uppercase tracking-[0.2em]">Connection Error: {error}</div>}
        {!loading && !error && items.map((announcement, index) => (
          <div
            key={announcement._id || index}
            className={`pb-8 mb-8 ${index < items.length - 1 ? 'border-b border-border-main' : ''} last:mb-0 last:pb-0 group`}
          >
            <div className="flex items-start gap-5">
              <div
                className={`w-2 h-2 rounded-full mt-2.5 shrink-0 ${
                  announcement.priority === 'high'
                    ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.4)]'
                    : announcement.priority === 'medium'
                    ? 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                    : 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                }`}
              ></div>
              <div className="flex-1 text-left">
                <h4 className="text-base font-bold text-text-main mb-2 group-hover:text-brand-primary transition-colors cursor-pointer tracking-tight">{announcement.title}</h4>
                <p className="text-sm text-text-secondary leading-relaxed mb-4 line-clamp-2">{announcement.body || announcement.excerpt || ''}</p>
                <div className="text-[10px] font-bold text-text-dim flex items-center gap-2 uppercase tracking-widest">
                  <Clock size={12} className="accent-soften" />
                  {new Date(announcement.date).toLocaleDateString()}
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
