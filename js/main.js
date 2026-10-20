// MoveMate - Main JavaScript
// Theme, Toast, Scroll Animations, Back-to-top, Shared Utilities

(function() {
  'use strict';

  // ============================================================
  // RTL/LTR TOGGLE
  // ============================================================

  const MoveMateRTL = {
    init() {
      const saved = localStorage.getItem('movemate_rtl');
      if (saved === 'rtl') {
        this.apply('rtl');
      }

      document.querySelectorAll('[data-rtl-toggle]').forEach(btn => {
        btn.addEventListener('click', () => {
          const current = document.documentElement.dir === 'rtl' ? 'ltr' : 'rtl';
          this.apply(current);
        });
      });
    },

    apply(dir) {
      document.documentElement.dir = dir;
      document.documentElement.lang = dir === 'rtl' ? 'ar' : 'en';
      localStorage.setItem('movemate_rtl', dir);
    }
  };

  // ============================================================
  // THEME MANAGEMENT
  // ============================================================

  const MoveMateTheme = {
    init() {
      const saved = localStorage.getItem('movemate_theme');
      const theme = saved || 'light';
      this.apply(theme);
    },

    apply(theme) {
      const root = document.documentElement;
      root.classList.add('theme-transition');
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      localStorage.setItem('movemate_theme', theme);
      setTimeout(() => root.classList.remove('theme-transition'), 350);
    },

    toggle() {
      const isDark = document.documentElement.classList.contains('dark');
      this.apply(isDark ? 'light' : 'dark');
    },

    get() {
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    }
  };

  // ============================================================
  // TOAST NOTIFICATIONS
  // ============================================================

  const MoveMateToast = {
    container: null,

    init() {
      if (!this.container) {
        this.container = document.createElement('div');
        this.container.className = 'toast-container';
        this.container.id = 'toast-container';
        document.body.appendChild(this.container);
      }
    },

    show(message, type = 'info', duration = 3000) {
      this.init();
      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;

      const icons = {
        success: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
        error: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
        info: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
        warning: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'
      };

      toast.innerHTML = `${icons[type] || icons.info}<span>${message}</span>`;
      this.container.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
      }, duration);
    },

    success(msg) { this.show(msg, 'success'); },
    error(msg) { this.show(msg, 'error'); },
    info(msg) { this.show(msg, 'info'); },
    warning(msg) { this.show(msg, 'warning'); }
  };

  // ============================================================
  // SCROLL ANIMATIONS
  // ============================================================

  const MoveMateScroll = {
    init() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

      document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
        observer.observe(el);
      });
    }
  };

  // ============================================================
  // BACK TO TOP
  // ============================================================

  const MoveMateBackToTop = {
    init() {
      const btn = document.getElementById('back-to-top');
      if (!btn) return;

      window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
          btn.classList.add('visible');
        } else {
          btn.classList.remove('visible');
        }
      }, { passive: true });

      btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  };

  // ============================================================
  // UTILITY FUNCTIONS
  // ============================================================

  const MoveMateUtils = {
    formatCurrency(amount) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    },

    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },

    formatTime(timeStr) {
      const [hours, minutes] = timeStr.split(':');
      const h = parseInt(hours);
      const ampm = h >= 12 ? 'PM' : 'AM';
      const h12 = h % 12 || 12;
      return `${h12}:${minutes} ${ampm}`;
    },

    generateId(prefix = 'MM') {
      return `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    },

    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },

    getStoredData(key, defaultValue = null) {
      try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
      } catch {
        return defaultValue;
      }
    },

    setStoredData(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch {
        return false;
      }
    },

    validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    validatePhone(phone) {
      return /^[\d\s\-\+\(\)]{10,15}$/.test(phone);
    },

    validatePincode(pincode) {
      return /^\d{6}$/.test(pincode);
    },

    validatePassword(password) {
      return password.length >= 6;
    }
  };

  // ============================================================
  // INITIALIZATION
  // ============================================================

  document.addEventListener('DOMContentLoaded', () => {
    MoveMateRTL.init();
    MoveMateTheme.init();
    MoveMateToast.init();
    MoveMateScroll.init();
    MoveMateBackToTop.init();
  });

  // Expose globally
  window.MoveMateRTL = MoveMateRTL;
  window.MoveMateTheme = MoveMateTheme;
  window.MoveMateToast = MoveMateToast;
  window.MoveMateUtils = MoveMateUtils;
  window.MoveMateScroll = MoveMateScroll;
  window.MoveMateBackToTop = MoveMateBackToTop;

})();
