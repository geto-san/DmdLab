import QuickNavigation from '../components/Lobby/QuickNavigation';
import Announcements from '../components/Lobby/AnnouncementStrip';
import ArticleGrid from '../components/Articles/ArticleGrid';

const Lobby = () => {
  return (
    <div style={{
      backgroundColor: '#f8fafc',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <QuickNavigation />
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 420px',
          gap: '30px',
          marginBottom: '30px'
        }}>
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
