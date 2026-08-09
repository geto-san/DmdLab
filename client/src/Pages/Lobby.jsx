import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Hero from '../components/Lobby/Hero';
import QuickNavigation from '../components/Lobby/QuickNavigation';
import Announcements from '../components/Lobby/AnnouncementStrip';
import ArticleGrid from '../components/Articles/ArticleGrid';
import StatsSection from '../components/Lobby/StatsSection';
import FeaturedProjects from '../components/Lobby/FeaturedProjects';

const Lobby = () => {
  return (
    <div className="bg-bg-main min-h-screen transition-colors duration-500">
      <Hero />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
        <StatsSection />
        <QuickNavigation />
        <FeaturedProjects />

        <div className="grid lg:grid-cols-3 gap-16 pt-16 border-t border-border-main">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-extrabold text-text-main tracking-tight">Research Insights</h2>
              <Link to="/articles" className="text-brand-primary font-bold text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:underline">
                Read all articles
                <ArrowRight size={14} />
              </Link>
            </div>
            <ArticleGrid />
          </div>

          <div className="space-y-12">
            <Announcements />

            <div className="bg-ink rounded-[2rem] p-10 border border-white/5 relative overflow-hidden group shadow-elevated transition-transform hover:-translate-y-1 duration-500">
               <div className="relative z-10">
                 <h3 className="text-2xl font-bold text-white mb-3 tracking-tighter">Join the Lab</h3>
                 <p className="text-sm text-white/50 mb-8 leading-relaxed">Interested in AI/ML? Join our research community at MUST and build the future of computational innovation.</p>
                 <button className="btn-primary w-full justify-center bg-white text-ink hover:bg-white/90 border-none shadow-none text-xs uppercase tracking-widest py-4">Apply Now</button>
               </div>
               <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-brand-primary/20 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-700" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
