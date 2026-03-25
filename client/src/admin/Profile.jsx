import { useEffect, useState } from 'react';

const Profile = ({ token }) => {
  const [profile, setProfile] = useState(null);
  useEffect(()=>{
    if (!token) return;
    (async ()=>{
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE || import.meta.env.API_BASE_URL}/admin/profile`, { headers: { Authorization: `Bearer ${token}` } });
        const d = await res.json(); setProfile(d);
      } catch(e){}
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
