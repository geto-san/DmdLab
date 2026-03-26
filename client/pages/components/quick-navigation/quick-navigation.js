document.addEventListener("DOMContentLoaded", () => {
  const API_BASE = window.API_BASE_URL || "/server/api";

  const setCount = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value ?? "—";
  };

  const fetchCounts = async () => {
    try {
      const articlesRes = await fetch(`${API_BASE}/articles?limit=100`);
      const articles = articlesRes.ok ? await articlesRes.json() : [];
      setCount("articlesCount", Array.isArray(articles) ? articles.length : 0);

      const videosRes = await fetch(`${API_BASE}/videos?maxResults=50`);
      const videos = videosRes.ok ? await videosRes.json() : [];
      setCount("videosCount", Array.isArray(videos) ? videos.length : 0);
    } catch {
      setCount("articlesCount", "—");
      setCount("videosCount", "—");
    }
  };

  fetchCounts();
});
