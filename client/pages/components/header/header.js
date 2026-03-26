/**
 * Header Navigation Module
 * Framework-free implementation matching React component behavior
 */

(function() {
  'use strict';

  // =============================
  // CONFIGURATION
  // =============================
  const CONFIG = {
    selectors: {
      rippleTarget: '.nav-link',
      mobileToggle: '#mobileMenuToggle',
      mobileNav: '#mobileNav',
      mobileNavLinks: '.mobile-nav .nav-link'
    },
    classes: {
      ripple: 'ripple',
      rippleAnimate: 'ripple-animate',
      mobileNavActive: 'active'
    },
    rippleDuration: 600
  };

  // =============================
  // RIPPLE EFFECT MODULE
  // Matches React component's createRipple function
  // =============================
  const RippleEffect = {
    /**
     * Initialize ripple effect on all interactive elements
     */
    init() {
      const targets = document.querySelectorAll(CONFIG.selectors.rippleTarget);
      
      targets.forEach(target => {
        target.addEventListener('click', this.createRipple.bind(this));
      });
    },

    /**
     * Create ripple effect on click
     * This matches the React createRipple function exactly
     */
    createRipple(event) {
      const button = event.currentTarget;
      const rect = button.getBoundingClientRect();
      
      // Calculate ripple size (largest dimension)
      const size = Math.max(rect.width, rect.height);
      
      // Calculate ripple position (centered on click point)
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;

      // Remove any existing ripples from this button
      const existingRipples = button.querySelectorAll(`.${CONFIG.classes.ripple}`);
      existingRipples.forEach(ripple => ripple.remove());

      // Create new ripple element
      const ripple = document.createElement('span');
      ripple.className = `${CONFIG.classes.ripple} ${CONFIG.classes.rippleAnimate}`;
      
      // Apply inline styles (matching React implementation)
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(85, 85, 85, 0.4);
        transform: scale(0);
        animation: ripple-animation ${CONFIG.rippleDuration}ms linear;
        pointer-events: none;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        z-index: 1;
      `;

      // Add ripple to button
      button.appendChild(ripple);

      // Remove ripple after animation completes
      setTimeout(() => {
        if (ripple.parentNode) {
          ripple.remove();
        }
      }, CONFIG.rippleDuration);
    }
  };

  // =============================
  // MOBILE MENU MODULE
  // Matches React component's menu toggle behavior
  // =============================
  const MobileMenu = {
    toggle: null,
    nav: null,
    isOpen: false,

    /**
     * Initialize mobile menu functionality
     */
    init() {
      this.toggle = document.querySelector(CONFIG.selectors.mobileToggle);
      this.nav = document.querySelector(CONFIG.selectors.mobileNav);
      
      if (!this.toggle || !this.nav) {
        console.warn('Mobile menu elements not found');
        return;
      }

      // Toggle button click handler
      this.toggle.addEventListener('click', this.handleToggle.bind(this));
      
      // Close menu when clicking mobile nav links
      const mobileNavLinks = document.querySelectorAll(CONFIG.selectors.mobileNavLinks);
      mobileNavLinks.forEach(link => {
        link.addEventListener('click', this.closeMenu.bind(this));
      });

      // Close menu on outside click
      document.addEventListener('click', this.handleOutsideClick.bind(this));
    },

    /**
     * Toggle mobile menu open/closed
     * Matches React's setIsMenuOpen(!isMenuOpen)
     */
    handleToggle(event) {
      event.stopPropagation();
      
      this.isOpen = !this.isOpen;
      
      if (this.isOpen) {
        this.openMenu();
      } else {
        this.closeMenu();
      }
    },

    /**
     * Open mobile menu
     */
    openMenu() {
      this.isOpen = true;
      this.nav.classList.add(CONFIG.classes.mobileNavActive);
      this.toggle.setAttribute('aria-expanded', 'true');
      this.toggle.setAttribute('aria-label', 'Close menu');
    },

    /**
     * Close mobile menu
     * Matches React's setIsMenuOpen(false) in onLinkClick
     */
    closeMenu() {
      this.isOpen = false;
      this.nav.classList.remove(CONFIG.classes.mobileNavActive);
      this.toggle.setAttribute('aria-expanded', 'false');
      this.toggle.setAttribute('aria-label', 'Open menu');
    },

    /**
     * Close menu when clicking outside header
     */
    handleOutsideClick(event) {
      if (!this.isOpen) return;
      
      const header = document.querySelector('.site-header');
      
      // Check if click is outside header
      if (header && !header.contains(event.target)) {
        this.closeMenu();
      }
    }
  };

  // =============================
  // TEAM DROPDOWN MODULE
  // =============================
  const TeamDropdown = {
    trigger: null,
    menu: null,
    container: null,

    init() {
      this.trigger = document.getElementById('teamDropdownBtn');
      this.menu = document.getElementById('teamDropdownMenu');
      this.container = document.querySelector('.nav-dropdown');
      if (!this.trigger || !this.menu) return;

      this.trigger.addEventListener('click', (e) => {
        if (window.innerWidth < 768) {
          e.preventDefault();
          const isOpen = this.menu.classList.toggle('nav-dropdown-open');
          this.trigger.setAttribute('aria-expanded', isOpen);
          this.container?.classList.toggle('open', isOpen);
        }
      });

      document.addEventListener('click', (e) => {
        if (this.container && !this.container.contains(e.target)) {
          this.menu.classList.remove('nav-dropdown-open');
          this.trigger.setAttribute('aria-expanded', 'false');
          this.container.classList.remove('open');
        }
      });

      this.container?.addEventListener('mouseenter', () => {
        if (window.innerWidth >= 768) {
          this.menu.classList.add('nav-dropdown-open');
          this.container?.classList.add('open');
        }
      });
      this.container?.addEventListener('mouseleave', () => {
        this.menu.classList.remove('nav-dropdown-open');
        this.container?.classList.remove('open');
      });
    }
  };

  // =============================
  // THEME TOGGLE MODULE (cursor.com style)
  // =============================
  const ThemeToggle = {
    KEY: 'dlab-theme',

    init() {
      const stored = this.getStoredTheme();
      document.documentElement.setAttribute('data-theme', stored);
      const toggles = document.querySelectorAll('#themeToggle, #themeToggleMobile');
      toggles.forEach(btn => btn?.addEventListener('click', (e) => { e.preventDefault(); this.toggle(); }));
    },

    getStoredTheme() {
      try {
        const t = localStorage.getItem(this.KEY);
        if (t === 'dark' || t === 'light') return t;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      } catch {
        return 'light';
      }
    },

    setStoredTheme(theme) {
      try { localStorage.setItem(this.KEY, theme); } catch (_) {}
    },

    applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
    },

    toggle() {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      this.setStoredTheme(next);
      this.applyTheme(next);
    }
  };

  // =============================
  // INITIALIZATION
  // =============================
  const HeaderModule = {
    init() {
      ThemeToggle.init();
      RippleEffect.init();
      MobileMenu.init();
      TeamDropdown.init();
      
      // Re-initialize ripple effect on dynamically added elements
      this.observeDOMChanges();
    },

    /**
     * Watch for DOM changes to reinitialize ripple on new elements
     * Useful if nav links are added dynamically
     */
    observeDOMChanges() {
      const header = document.querySelector('.site-header');
      if (!header) return;

      const observer = new MutationObserver(() => {
        // Reinitialize ripple for any new elements
        const newTargets = header.querySelectorAll(CONFIG.selectors.rippleTarget);
        newTargets.forEach(target => {
          // Check if already has event listener (simple flag check)
          if (!target.dataset.rippleInit) {
            target.addEventListener('click', RippleEffect.createRipple.bind(RippleEffect));
            target.dataset.rippleInit = 'true';
          }
        });
      });

      observer.observe(header, {
        childList: true,
        subtree: true
      });
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => HeaderModule.init());
  } else {
    HeaderModule.init();
  }

  // Expose for debugging (optional)
  window.HeaderModule = HeaderModule;

})();