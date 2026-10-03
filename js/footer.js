// MoveMate - Footer JavaScript
// Dynamic footer year, FAQ accordion

(function() {
  'use strict';

  const MoveMateFooter = {
    init() {
      this.updateYear();
      this.initFaqAccordion();
    },

    updateYear() {
      const yearEls = document.querySelectorAll('[data-current-year]');
      const year = new Date().getFullYear();
      yearEls.forEach(el => { el.textContent = year; });
    },

    initFaqAccordion() {
      document.querySelectorAll('[data-faq-toggle]').forEach(btn => {
        btn.addEventListener('click', () => {
          const item = btn.closest('.faq-item');
          const answer = item.querySelector('.faq-answer');
          const isOpen = item.classList.contains('active');

          document.querySelectorAll('.faq-item.active').forEach(other => {
            other.classList.remove('active');
            other.querySelector('.faq-answer').style.maxHeight = '';
            const otherBtn = other.querySelector('[data-faq-toggle]');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          });

          if (!isOpen) {
            item.classList.add('active');
            answer.style.maxHeight = answer.scrollHeight + 'px';
          }
          btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
        });
      });
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    MoveMateFooter.init();
  });

  window.MoveMateFooter = MoveMateFooter;

})();
