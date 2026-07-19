import QuickNavigation from '../components/Lobby/QuickNavigation';
import Announcements from '../components/Lobby/AnnouncementStrip';
import ArticleGrid from '../components/Articles/ArticleGrid';

const Lobby = () => {
  return (
    <div className="bg-slate-50 p-5">
      <div className="max-w-[1200px] mx-auto">
        <QuickNavigation />
        <div className="grid grid-cols-[1fr_420px] gap-[30px] mb-[30px]">
          <div>
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
