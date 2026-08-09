import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Award, ArrowRight } from 'lucide-react';
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
    { title: 'Articles', icon: BookOpen, color: '#3b82f6', to: '/articles', count: counts.articles },
    { title: 'Videos', icon: Award, color: '#8b5cf6', to: '/videos', count: counts.videos }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16 animate-fade-up">
      {navItems.map((item, index) => (
        <Link key={index} to={item.to} className="group">
          <div
            className="bg-bg-surface border border-border-main rounded-3xl p-6 cursor-pointer transition-all duration-300 flex items-center gap-6 group-hover:shadow-elevated group-hover:-translate-y-1"
          >
            <div
              style={{ backgroundColor: `${item.color}10`, color: item.color }}
              className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 transition-colors group-hover:bg-primary group-hover:text-white"
            >
              <item.icon size={32} strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-bold text-ink mb-1 tracking-tight">
                {item.title}
              </h4>
              <p className="text-[10px] font-bold text-ink-dim uppercase tracking-widest">
                {item.count || 0} items available
              </p>
            </div>
            <div className="w-10 h-10 rounded-full border border-border-main flex items-center justify-center text-ink-dim group-hover:border-primary group-hover:text-primary transition-colors bg-bg-main shadow-sm">
              <ArrowRight size={20} />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default QuickNavigation;
