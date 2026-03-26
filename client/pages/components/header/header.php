<header class="site-header">
  <div class="header-container">
    <div class="header-row">
      <!-- Logo -->
      <a href="index.php" class="brand-link">
        <img
          src="assets/logo-7402580_1920.png"
          alt="Logo"
          class="brand-logo"
        />
        <div class="brand-text">
          <h1 class="brand-title">DeepsMinds Lab</h1>
        </div>
      </a>

      <!-- Desktop Navigation -->
      <nav class="header-nav">
        <?php include __DIR__ . '/nav-links.php'; ?>
        <button type="button" class="theme-toggle" id="themeToggle" aria-label="Toggle dark mode" title="Toggle theme">
          <span class="theme-icon theme-icon-sun" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
          </span>
          <span class="theme-icon theme-icon-moon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
          </span>
        </button>
      </nav>

      <!-- Mobile Toggle -->
      <button
        class="mobile-menu-toggle"
        id="mobileMenuToggle"
        aria-label="Toggle menu"
        aria-expanded="false"
      >
        <div class="mobile-menu-icon">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>
    </div>
  </div>

  <!-- Mobile Navigation -->
  <div class="mobile-nav" id="mobileNav">
    <?php include __DIR__ . '/nav-links.php'; ?>
    <div class="mobile-nav-theme">
      <button type="button" class="theme-toggle theme-toggle-mobile" id="themeToggleMobile" aria-label="Toggle dark mode">
        <span class="theme-icon theme-icon-sun"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg></span>
        <span class="theme-icon theme-icon-moon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg></span>
      </button>
    </div>
  </div>
</header>

<script src="pages/components/header/header.js" defer></script>
