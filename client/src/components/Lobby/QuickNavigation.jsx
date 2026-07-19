
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
      } catch {
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
    <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-[15px] mb-[30px]">
      {navItems.map((item, index) => (
        <Link key={index} to={item.to} className="no-underline">
          <div
            style={{ '--hover-color': item.color }}
            className="bg-white border border-[#e5e7eb] rounded-xl p-5 cursor-pointer transition-all duration-200 ease-in-out flex items-center gap-[15px] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:border-[var(--hover-color)]"
          >
            <div
              style={{ backgroundColor: item.color }}
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            >
              <item.icon size={24} color="white" />
            </div>
            <div>
              <h4 className="m-0 mb-1 text-base font-semibold text-gray-800">
                {item.title}
              </h4>
              <p className="m-0 text-[0.85rem] text-gray-500">
                {item.count}
              </p>
            </div>
            <ArrowRight size={20} color="#9ca3af" className="ml-auto" />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default QuickNavigation;
