import Hero from '../components/Lobby/Hero';
import ProjectsStrip from '../components/Lobby/ProjectsStrip';
import QuickNavigation from '../components/Lobby/QuickNavigation';
import Announcements from '../components/Lobby/AnnouncementStrip';
import ArticleGrid from '../components/Articles/ArticleGrid';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Lobby = () => {
  return (
    <div className="bg-paper">
      <Hero />
      <ProjectsStrip />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-14">
        <QuickNavigation />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 mt-10">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-semibold text-xl text-ink-text">Latest articles</h2>
              <Link to="/articles" className="flex items-center gap-1 text-signal text-sm font-semibold hover:gap-1.5 transition-all">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <ArticleGrid />
          </div>
          <div>
            <Announcements />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
