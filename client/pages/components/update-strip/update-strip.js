document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("announcementBody");
  const API_BASE = (window.API_BASE_URL || "").replace(/\/$/, "");
  const url = API_BASE ? `${API_BASE}/announcements?limit=6` : null;

  if (!url) {
    container.innerHTML = '<div class="announcement-item"><div class="announcement-content"><p>Weekly AI content on our <a href="index.php?page=discussions">Discussions</a> page. Check back for updates.</p></div></div>';
    return;
  }

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      return res.json();
    })
    .then(data => {
      const items = Array.isArray(data) && data.length
        ? data
        : [{
            title: "No announcements yet",
            body: "Check back soon",
            date: new Date().toISOString(),
            priority: "low"
          }];

      container.innerHTML = "";

      items.forEach(item => {
        const el = document.createElement("div");
        el.className = "announcement-item";

        el.innerHTML = `
          <span class="priority-dot priority-${item.priority || 'low'}"></span>
          <div class="announcement-content">
            <h4>${item.title}</h4>
            <p>${item.body || item.excerpt || ""}</p>
            <div class="announcement-meta">
              <span>🕒</span>
              ${new Date(item.date).toLocaleString()}
            </div>
          </div>
        `;

        container.appendChild(el);
      });
    })
    .catch(err => {
      container.innerHTML = `
        <div style="color:#ef4444;">
          Failed to load: ${err.message}
        </div>
      `;
    });
});
