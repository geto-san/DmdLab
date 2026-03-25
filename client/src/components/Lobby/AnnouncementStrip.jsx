import { useEffect, useState } from 'react';
import { Bell, Clock, ChevronRight } from 'lucide-react';

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
        const res = await fetch(`${import.meta.env.VITE_API_BASE || import.meta.env.API_BASE_URL}/announcements?limit=6`);
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
    <div style={{
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      overflow: 'hidden'
    }}>
      <div style={{
        backgroundColor: '#f8fafc',
        padding: '16px 20px',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Bell size={20} color="#3b82f6" />
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600', color: '#1f2937' }}>Announcements</h3>
        </div>
        <button style={{ backgroundColor: 'transparent', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
          View All
          <ChevronRight size={16} />
        </button>
      </div>
      <div style={{ padding: '20px' }}>
        {loading && <div style={{ color: '#6b7280' }}>Loading announcements…</div>}
        {error && <div style={{ color: '#ef4444' }}>Failed to load: {error}</div>}
        {!loading && !error && items.map((announcement, index) => (
          <div key={announcement._id || index} style={{ paddingBottom: '16px', marginBottom: '16px', borderBottom: index < items.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: announcement.priority === 'high' ? '#ef4444' : announcement.priority === 'medium' ? '#f59e0b' : '#10b981', marginTop: '6px', flexShrink: 0 }}></div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', fontWeight: '600', color: '#1f2937' }}>{announcement.title}</h4>
                <p style={{ margin: '0 0 6px 0', fontSize: '0.85rem', color: '#6b7280', lineHeight: '1.4' }}>{announcement.body || announcement.excerpt || ''}</p>
                <div style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '4px' }}>
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