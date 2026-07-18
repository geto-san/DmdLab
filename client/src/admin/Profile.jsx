import { useEffect, useState } from 'react';
import API_BASE from '../utils/api';

const Profile = ({ token }) => {
  const [profile, setProfile] = useState(null);
  useEffect(()=>{
    if (!token) return;
    (async ()=>{
      try {
        const res = await fetch(`${API_BASE}/admin/profile`, { headers: { Authorization: `Bearer ${token}` } });
        const d = await res.json(); setProfile(d);
      } catch {
        // ignore — profile fetch failure just leaves the placeholder state
      }
    })();
  }, [token]);
  if (!profile) return null;
  return (
    <article className='column'>
      <h2>{profile.username}</h2>
    </article>
  );
};

export default Profile;
