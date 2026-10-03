// MoveMate - Navbar JavaScript
// Mobile menu, theme toggle, active link highlighting

(function() {
  'use strict';

  const MoveMateNav = {
    init() {
      this.initThemeToggle();
      this.initDropdowns();
      this.initMobileAccordions();
      this.initMobileMenu();
      this.initActiveLinks();
      this.initScrollEffect();
    },

    initThemeToggle() {
      const toggles = document.querySelectorAll('[data-theme-toggle]');
      toggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
          window.MoveMateTheme.toggle();
          this.updateThemeIcons();
        });
      });
      this.updateThemeIcons();
    },

    updateThemeIcons() {
      const isDark = document.documentElement.classList.contains('dark');
      document.querySelectorAll('[data-theme-icon-sun]').forEach(el => {
        el.style.display = isDark ? 'block' : 'none';
      });
      document.querySelectorAll('[data-theme-icon-moon]').forEach(el => {
        el.style.display = isDark ? 'none' : 'block';
      });
    },

    initDropdowns() {
      const dropdowns = Array.from(document.querySelectorAll('[data-nav-dropdown]'));
      if (!dropdowns.length) return;

      const closeAll = (except) => {
        dropdowns.forEach(dd => {
          if (dd === except) return;
          dd.classList.remove('is-open');
          const trigger = dd.querySelector('[data-dropdown-trigger]');
          if (trigger) trigger.setAttribute('aria-expanded', 'false');
        });
      };

      const open = (dd) => {
        closeAll(dd);
        dd.classList.add('is-open');
        const trigger = dd.querySelector('[data-dropdown-trigger]');
        if (trigger) trigger.setAttribute('aria-expanded', 'true');
      };

      const close = (dd) => {
        dd.classList.remove('is-open');
        const trigger = dd.querySelector('[data-dropdown-trigger]');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      };

      dropdowns.forEach(dd => {
        const trigger = dd.querySelector('[data-dropdown-trigger]');
        const menu = dd.querySelector('[data-dropdown-menu]');
        if (!trigger || !menu) return;

        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          dd.classList.contains('is-open') ? close(dd) : open(dd);
        });

        trigger.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            open(dd);
            const first = menu.querySelector('a');
            if (first) first.focus();
          }
        });

        dd.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            close(dd);
            trigger.focus();
          }
        });

        dd.addEventListener('mouseenter', () => {
          if (window.matchMedia('(hover: hover)').matches) open(dd);
        });

        dd.addEventListener('mouseleave', () => {
          if (window.matchMedia('(hover: hover)').matches) close(dd);
        });
      });

      document.addEventListener('click', () => closeAll());
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAll();
      });
    },

    initMobileAccordions() {
      document.querySelectorAll('[data-mobile-accordion]').forEach(acc => {
        const trigger = acc.querySelector('[data-accordion-trigger]');
        const panel = acc.querySelector('[data-accordion-panel]');
        if (!trigger || !panel) return;

        const panelId = 'mm-panel-' + Math.random().toString(36).slice(2, 9);
        panel.id = panelId;
        trigger.setAttribute('aria-controls', panelId);

        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          const isOpen = acc.classList.toggle('is-open');
          panel.classList.toggle('hidden', !isOpen);
          trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
      });
    },

    initMobileMenu() {
      const hamburger = document.getElementById('nav-hamburger');
      const mobileMenu = document.getElementById('mobile-menu');
      const overlay = document.getElementById('mobile-menu-overlay');
      const closeBtn = document.getElementById('mobile-menu-close');

      if (!hamburger || !mobileMenu) return;

      const openMenu = () => {
        mobileMenu.classList.remove('hidden');
        if (overlay) overlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        hamburger.setAttribute('aria-expanded', 'true');
      };

      const closeMenu = () => {
        mobileMenu.classList.add('hidden');
        if (overlay) overlay.classList.add('hidden');
        document.body.style.overflow = '';
        hamburger.setAttribute('aria-expanded', 'false');
      };

      hamburger.addEventListener('click', openMenu);
      if (closeBtn) closeBtn.addEventListener('click', closeMenu);
      if (overlay) overlay.addEventListener('click', closeMenu);

      mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
          closeMenu();
        }
      });
    },

    initActiveLinks() {
      const currentPath = window.location.pathname.split('/').pop() || 'index.html';

      document.querySelectorAll('[data-nav-link]').forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.split('#')[0] === currentPath) {
          link.classList.add('active');
          link.setAttribute('aria-current', 'page');

          const dd = link.closest('[data-nav-dropdown]');
          if (dd) dd.classList.add('is-active');
          const acc = link.closest('[data-mobile-accordion]');
          if (acc) {
            acc.classList.add('is-active');
            const trigger = acc.querySelector('[data-accordion-trigger]');
            const panel = acc.querySelector('[data-accordion-panel]');
            if (trigger) trigger.setAttribute('aria-expanded', 'true');
            if (panel) panel.classList.remove('hidden');
          }
        }
      });
    },

    initScrollEffect() {
      const navbar = document.getElementById('main-navbar');
      if (!navbar) return;

      let lastScroll = 0;
      window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 10) {
          navbar.classList.add('shadow-md');
        } else {
          navbar.classList.remove('shadow-md');
        }
        lastScroll = currentScroll;
      }, { passive: true });
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    MoveMateNav.init();
  });

  window.MoveMateNav = MoveMateNav;

})();
