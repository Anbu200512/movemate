// MoveMate - Auth JavaScript
// Login and signup demo interactions

(function() {
  'use strict';

  const MoveMateAuth = {
    init() {
      this.initLogin();
      this.initSignup();
      this.initPasswordToggle();
      this.initForgotPassword();
      this.initSocialLogin();
    },

    initLogin() {
      const form = document.getElementById('login-form');
      if (!form) return;

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        window.MoveMateToast.info('Demo page only. Authentication is not enabled.');
      });
    },

    initSignup() {
      const form = document.getElementById('signup-form');
      if (!form) return;

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        window.MoveMateToast.info('Demo page only. Account creation is not enabled.');
      });
    },

    initPasswordToggle() {
      document.querySelectorAll('[data-password-toggle]').forEach(btn => {
        btn.addEventListener('click', () => {
          const targetId = btn.getAttribute('data-password-toggle');
          const input = document.getElementById(targetId);
          if (!input) return;

          const isPassword = input.type === 'password';
          input.type = isPassword ? 'text' : 'password';
          btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
          btn.title = isPassword ? 'Hide password' : 'Show password';

          const icon = btn.querySelector('svg');
          if (icon) {
            icon.innerHTML = isPassword
              ? '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>'
              : '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
          }
        });
      });
    },

    initForgotPassword() {
      const link = document.getElementById('forgot-password-link');
      if (!link) return;

      link.addEventListener('click', (e) => {
        e.preventDefault();
        const email = prompt('Please enter your email address:');
        if (email && window.MoveMateUtils.validateEmail(email)) {
          window.MoveMateToast.info('Demo page only. Password reset is not enabled.');
        } else if (email) {
          window.MoveMateToast.error('Please enter a valid email address.');
        }
      });
    },

    initSocialLogin() {
      document.querySelectorAll('[data-demo-provider]').forEach(button => {
        button.addEventListener('click', () => {
          const provider = button.getAttribute('data-demo-provider');
          window.MoveMateToast.info(`${provider} sign-in is not enabled in this demo.`);
        });
      });
    },

    addNotification(message, type = 'info') {
      const notifications = window.MoveMateUtils.getStoredData('movemate_notifications', []);
      notifications.unshift({
        id: window.MoveMateUtils.generateId('NOT'),
        message,
        type,
        timestamp: new Date().toISOString(),
        read: false
      });
      window.MoveMateUtils.setStoredData('movemate_notifications', notifications);
    },

    logout() {
      localStorage.removeItem('movemate_user');
      window.location.href = 'index.html';
    },

    getCurrentUser() {
      return null;
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    MoveMateAuth.init();
  });

  window.MoveMateAuth = MoveMateAuth;

})();
