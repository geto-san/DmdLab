// router.js - SPA-like navigation without a framework
(function () {
  const containerSelector = '#app';
  const container = document.querySelector(containerSelector);
  if (!container) return;

  // Simple in-memory cache: path -> html
  const cache = new Map();
  // Optionally cache the initial content
  cache.set(location.pathname + location.search, container.innerHTML);

  // Utility: same-origin internal link?
  function isInternalLink(a) {
    try {
      const url = new URL(a.href, location.href);
      return url.origin === location.origin;
    } catch {
      return false;
    }
  }

  // Utility: should we intercept this click?
  function shouldInterceptClick(e, a) {
    if (!a) return false;
    if (!isInternalLink(a)) return false;
    if (a.hasAttribute('download')) return false;
    if (a.target && a.target !== '_self') return false;
    if (e.defaultPrevented) return false;
    // modifier keys -> let browser handle (open in new tab/window)
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false;
    // only left click
    if (e.button && e.button !== 0) return false;
    return true;
  }

  // Fetch fragment from server; server should return fragment when X-Requested-With is set
  async function fetchFragment(url) {
    const cacheKey = url.pathname + url.search;
    if (cache.has(cacheKey)) return cache.get(cacheKey);

    const res = await fetch(url.href, {
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
      credentials: 'same-origin'
    });

    if (!res.ok) throw new Error('Network error');

    const html = await res.text();
    cache.set(cacheKey, html);
    return html;
  }

  // Replace container content and run any inline scripts safely
  function replaceContent(html, url, push = true) {
    // Parse the fragment
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    // If server returned a full document, try to extract the main fragment
    const newContent = doc.querySelector(containerSelector) ? doc.querySelector(containerSelector).innerHTML : html;

    // Optionally animate out/in here (CSS classes)
    container.innerHTML = newContent;

    // Execute scripts from the returned HTML (inline and external)
    // Find script tags in the parsed doc
    const scripts = Array.from(doc.querySelectorAll('script'));
    scripts.forEach((oldScript) => {
      const script = document.createElement('script');
      // copy attributes
      for (const attr of oldScript.attributes) script.setAttribute(attr.name, attr.value);
      if (oldScript.src) {
        // external script: append to body to load
        script.src = oldScript.src;
        script.async = false; // preserve execution order
        document.body.appendChild(script);
      } else {
        // inline script: set textContent and append
        script.textContent = oldScript.textContent;
        document.body.appendChild(script);
        // remove immediately to avoid clutter
        document.body.removeChild(script);
      }
    });

    // Update document title if provided in parsed doc
    const newTitle = doc.querySelector('title');
    if (newTitle) document.title = newTitle.textContent;

    // Update active nav link
    updateActiveNav(url.pathname, url.search);

    // Manage history
    if (push) {
      history.pushState({ path: url.pathname + url.search }, '', url.href);
    }

    // Focus management for accessibility
    container.focus({ preventScroll: true });
    // Scroll to hash if present
    if (url.hash) {
      const el = document.querySelector(url.hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' in document.documentElement.style ? 'instant' : 'auto' });
    }
  }

  // Update active nav link classes (supports query params e.g. ?page=articles)
  function updateActiveNav(pathname, search) {
    const fullPath = pathname + (search || '');
    const currentPage = new URLSearchParams(search || location.search).get('page') || 'lobby';
    const links = document.querySelectorAll('a.nav-link, .header-nav a.nav-dropdown-item');
    links.forEach((a) => {
      a.classList.remove('active');
      const page = a.getAttribute('data-page');
      if (page && page === currentPage) {
        a.classList.add('active');
      } else if (!page) {
        try {
          const url = new URL(a.href, location.href);
          const linkPage = url.searchParams.get('page') || 'lobby';
          if (linkPage === currentPage) a.classList.add('active');
        } catch {}
      }
    });
    const trigger = document.getElementById('teamDropdownBtn');
    if (trigger && currentPage === 'team') trigger.classList.add('active');
  }

  // Click delegation
  document.addEventListener('click', async (e) => {
    const a = e.target.closest('a');
    if (!shouldInterceptClick(e, a)) return;

    e.preventDefault();
    const url = new URL(a.href, location.href);

    // If same path and hash only, handle hash scroll
    if (url.pathname === location.pathname && url.hash) {
      history.pushState({ path: url.pathname + url.search + url.hash }, '', url.href);
      const el = document.querySelector(url.hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    try {
      // Optionally show a loading indicator
      document.documentElement.classList.add('is-loading');

      const html = await fetchFragment(url);
      await replaceContent(html, url, true);
    } catch (err) {
      console.error('Navigation failed, falling back to full load', err);
      // fallback: full navigation
      location.href = a.href;
    } finally {
      document.documentElement.classList.remove('is-loading');
    }
  }, { passive: false });

  // Handle back/forward
  window.addEventListener('popstate', async (e) => {
    const path = (e.state && e.state.path) ? e.state.path : location.pathname + location.search;
    const url = new URL(path, location.origin);
    try {
      document.documentElement.classList.add('is-loading');
      const html = await fetchFragment(url);
      await replaceContent(html, url, false);
    } catch (err) {
      // On error, do a full reload to the current location
      location.href = location.href;
    } finally {
      document.documentElement.classList.remove('is-loading');
    }
  });

  // Optional: handle form submissions via AJAX for internal forms
  document.addEventListener('submit', async (e) => {
    const form = e.target;
    if (!form || !form.action) return;
    const url = new URL(form.action, location.href);
    if (url.origin !== location.origin) return; // external -> normal submit

    e.preventDefault();
    const formData = new FormData(form);
    const opts = {
      method: (form.method || 'GET').toUpperCase(),
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
      credentials: 'same-origin'
    };
    if (opts.method === 'GET') {
      // append to query string
      const params = new URLSearchParams(formData);
      url.search = params.toString();
    } else {
      opts.body = formData;
    }

    try {
      document.documentElement.classList.add('is-loading');
      const res = await fetch(url.href, opts);
      if (!res.ok) throw new Error('Form submit failed');
      const html = await res.text();
      await replaceContent(html, url, true);
    } catch (err) {
      console.error(err);
      // fallback to normal submit
      form.submit();
    } finally {
      document.documentElement.classList.remove('is-loading');
    }
  });

  // Initialize active nav on load
  updateActiveNav(location.pathname, location.search);
})();
