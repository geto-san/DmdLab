
import { BookOpen, ArrowRight, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import API_BASE from '../../utils/api';

const QuickNavigation = () => {
  const [counts, setCounts] = useState({ articles: null, videos: null });

  useEffect(() => {
    let cancelled = false;

    const fetchCounts = async () => {
      try {
        // Articles: request a large-ish limit and use length as a simple count
        const aRes = await fetch(`${API_BASE}/articles?limit=100`);
        const aData = aRes.ok ? await aRes.json() : [];
        // Videos: request a reasonable maxResults
        const vRes = await fetch(`${API_BASE}/videos?maxResults=50`);
        const vData = vRes.ok ? await vRes.json() : [];
        if (!cancelled) setCounts({ articles: Array.isArray(aData) ? aData.length : 0, videos: Array.isArray(vData) ? vData.length : 0 });
      } catch (e) {
        if (!cancelled) setCounts({ articles: null, videos: null });
      }
    };

    fetchCounts();
    return () => { cancelled = true; };
  }, []);

  const navItems = [
    { title: 'Articles', icon: BookOpen, color: '#3b82f6', to: '/articles', count: counts.articles },
    { title: 'Videos', icon: Award, color: '#8b5cf6', to: '/videos', count: counts.videos }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '15px',
      marginBottom: '30px'
    }}>
      {navItems.map((item, index) => (
        <Link key={index} to={item.to} style={{ textDecoration: 'none' }}>
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '20px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            e.currentTarget.style.borderColor = item.color;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = '#e5e7eb';
          }}>
            <div style={{
              backgroundColor: item.color,
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <item.icon size={24} color="white" />
            </div>
            <div>
              <h4 style={{
                margin: '0 0 4px 0',
                fontSize: '1rem',
                fontWeight: '600',
                color: '#1f2937'
              }}>
                {item.title}
              </h4>
              <p style={{
                margin: 0,
                fontSize: '0.85rem',
                color: '#6b7280'
              }}>
                {item.count}
              </p>
            </div>
            <ArrowRight size={20} color="#9ca3af" style={{ marginLeft: 'auto' }} />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default QuickNavigation;