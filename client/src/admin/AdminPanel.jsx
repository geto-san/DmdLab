import { useState } from 'react';
import Login from './LoginPage.jsx';
import AdminDashboard from './AdminDashboard.jsx';

export default function AdminPanel() {
  const [token, setToken] = useState(null);
  const [tab, setTab] = useState('articles');

  const handleLogout = () => {
    setToken(null);
  };

  if (!token) return <Login onLogin={setToken} />;

  return (
    <div className="py-6">
      <AdminDashboard token={token} onLogout={handleLogout} />
    </div>
  );
}
