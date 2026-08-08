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
        const aRes = await fetch(`${API_BASE}/articles?limit=100`);
        const aData = aRes.ok ? await aRes.json() : [];
        const vRes = await fetch(`${API_BASE}/videos?maxResults=50`);
        const vData = vRes.ok ? await vRes.json() : [];
        if (!cancelled) setCounts({ articles: Array.isArray(aData) ? aData.length : 0, videos: Array.isArray(vData) ? vData.length : 0 });
      } catch {
        if (!cancelled) setCounts({ articles: null, videos: null });
      }
    };

    fetchCounts();
    return () => { cancelled = true; };
  }, []);

  const navItems = [
    { title: 'Articles', icon: BookOpen, to: '/articles', count: counts.articles },
    { title: 'Videos', icon: Award, to: '/videos', count: counts.videos },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {navItems.map((item) => (
        <Link key={item.to} to={item.to} className="group">
          <div className="bg-white border border-black/8 rounded-2xl p-5 flex items-center gap-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(11,17,32,0.08)] hover:border-signal/30">
            <div className="w-12 h-12 rounded-xl bg-ink flex items-center justify-center shrink-0">
              <item.icon size={22} className="text-amber" />
            </div>
            <div>
              <h4 className="m-0 font-display font-semibold text-ink-text">{item.title}</h4>
              <p className="m-0 text-[13px] text-muted">
                {item.count === null ? '—' : `${item.count} published`}
              </p>
            </div>
            <ArrowRight size={18} className="ml-auto text-muted-2 group-hover:text-signal group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default QuickNavigation;
