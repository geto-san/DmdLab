/**
 * Footer Module
 * Handles footer interactions and enhancements
 */

(function() {
  'use strict';

  // =============================
  // CONFIGURATION
  // =============================
  const CONFIG = {
    selectors: {
      socialLinks: '.footer-social-link',
      contactLinks: '.footer-contact-link'
    },
    animations: {
      enabled: !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }
  };

  // =============================
  // SOCIAL LINKS MODULE
  // =============================
  const SocialLinks = {
    /**
     * Initialize social link interactions
     */
    init() {
      const links = document.querySelectorAll(CONFIG.selectors.socialLinks);
      
      links.forEach(link => {
        this.enhanceLink(link);
      });
    },

    /**
     * Add interaction enhancements to social links
     */
    enhanceLink(link) {
      // Add keyboard navigation support
      link.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          link.click();
        }
      });

      // Analytics tracking (optional)
      link.addEventListener('click', (e) => {
        const platform = this.getPlatformFromLink(link);
        this.trackSocialClick(platform);
      });
    },

    /**
     * Get social platform from link
     */
    getPlatformFromLink(link) {
      const href = link.getAttribute('href');
      if (!href) return 'unknown';
      
      if (href.includes('github.com')) return 'github';
      if (href.includes('mailto:')) return 'email';
      return 'unknown';
    },

    /**
     * Track social link clicks (optional analytics)
     */
    trackSocialClick(platform) {
      // Example: Google Analytics or custom tracking
      if (typeof gtag !== 'undefined') {
        gtag('event', 'social_click', {
          'platform': platform,
          'location': 'footer'
        });
      }
      
      // Log for debugging
      console.log(`Social link clicked: ${platform}`);
    }
  };

  // =============================
  // CONTACT LINKS MODULE
  // =============================
  const ContactLinks = {
    /**
     * Initialize contact link interactions
     */
    init() {
      const links = document.querySelectorAll(CONFIG.selectors.contactLinks);
      
      links.forEach(link => {
        this.enhanceLink(link);
      });
    },

    /**
     * Add interaction enhancements to contact links
     */
    enhanceLink(link) {
      const href = link.getAttribute('href');
      
      // Handle mailto links
      if (href && href.startsWith('mailto:')) {
        link.addEventListener('click', (e) => {
          this.trackContactClick('email');
        });
      }
      
      // Handle tel links
      if (href && href.startsWith('tel:')) {
        link.addEventListener('click', (e) => {
          this.trackContactClick('phone');
        });
      }
    },

    /**
     * Track contact link clicks (optional analytics)
     */
    trackContactClick(type) {
      // Example: Google Analytics or custom tracking
      if (typeof gtag !== 'undefined') {
        gtag('event', 'contact_click', {
          'contact_type': type,
          'location': 'footer'
        });
      }
      
      // Log for debugging
      console.log(`Contact link clicked: ${type}`);
    }
  };

  // =============================
  // SMOOTH SCROLL MODULE
  // =============================
  const SmoothScroll = {
    /**
     * Initialize smooth scrolling for internal footer links
     */
    init() {
      const footer = document.querySelector('.site-footer');
      if (!footer) return;

      // Add smooth scroll behavior for any anchor links in footer
      const anchorLinks = footer.querySelectorAll('a[href^="#"]');
      
      anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          const targetId = link.getAttribute('href');
          if (targetId === '#') return;
          
          const targetElement = document.querySelector(targetId);
          if (!targetElement) return;
          
          e.preventDefault();
          
          targetElement.scrollIntoView({
            behavior: CONFIG.animations.enabled ? 'smooth' : 'auto',
            block: 'start'
          });
        });
      });
    }
  };

  // =============================
  // LAZY LOADING MODULE
  // =============================
  const LazyLoad = {
    /**
     * Initialize lazy loading for footer images
     */
    init() {
      const images = document.querySelectorAll('.site-footer img[data-src]');
      
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          });
        });
        
        images.forEach(img => imageObserver.observe(img));
      } else {
        // Fallback for browsers without IntersectionObserver
        images.forEach(img => {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        });
      }
    }
  };

  // =============================
  // ACCESSIBILITY MODULE
  // =============================
  const Accessibility = {
    /**
     * Initialize accessibility enhancements
     */
    init() {
      this.enhanceExternalLinks();
      this.addSkipToTop();
    },

    /**
     * Enhance external links with proper attributes
     */
    enhanceExternalLinks() {
      const footer = document.querySelector('.site-footer');
      if (!footer) return;

      const externalLinks = footer.querySelectorAll('a[target="_blank"]');
      
      externalLinks.forEach(link => {
        // Ensure security attributes
        if (!link.hasAttribute('rel')) {
          link.setAttribute('rel', 'noopener noreferrer');
        }
        
        // Add screen reader text for external links
        const ariaLabel = link.getAttribute('aria-label');
        if (ariaLabel && !ariaLabel.includes('opens in new window')) {
          link.setAttribute('aria-label', `${ariaLabel} (opens in new window)`);
        }
      });
    },

    /**
     * Add "Back to top" functionality (optional)
     */
    addSkipToTop() {
      // You can add a "Back to top" button here if needed
      // This is optional and can be implemented based on requirements
    }
  };

  // =============================
  // FOOTER MODULE
  // =============================
  const FooterModule = {
    /**
     * Initialize all footer functionality
     */
    init() {
      SocialLinks.init();
      ContactLinks.init();
      SmoothScroll.init();
      LazyLoad.init();
      Accessibility.init();
      
      // Log initialization for debugging
      if (window.location.search.includes('debug=true')) {
        console.log('Footer module initialized');
      }
    }
  };

  // =============================
  // INITIALIZATION
  // =============================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => FooterModule.init());
  } else {
    FooterModule.init();
  }

  // Expose for debugging (optional)
  window.FooterModule = FooterModule;

})();