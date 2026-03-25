import { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE from '../utils/api';

const useVideos = () => {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_BASE}/videos`, { headers: { Accept: 'application/json' } });
        const data = response.data;
        if (!Array.isArray(data)) throw new Error('Expected an array of videos');
        setVideos(data);
      } catch (err) {
        setError(err.message || String(err));
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  return { videos, error, loading };
};

export default useVideos;