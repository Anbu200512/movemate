// MoveMate - FAQ JavaScript
// Search filtering for the FAQ page. Accordion behaviour lives in footer.js.

(function() {
  'use strict';

  const MoveMateFAQ = {
    init() {
      const input = document.getElementById('faq-search');
      if (!input) return;
      this.input = input;
      this.emptyMsg = document.getElementById('faq-search-empty');
      this.groups = Array.from(document.querySelectorAll('[data-faq-group]'));
      this.items = Array.from(document.querySelectorAll('[data-faq-item]'));
      input.addEventListener('input', () => this.filter(input.value.trim().toLowerCase()));
    },

    filter(term) {
      let visible = 0;

      this.items.forEach(item => {
        const haystack = [
          item.getAttribute('data-search') || '',
          item.textContent || ''
        ].join(' ').toLowerCase();

        const match = !term || haystack.includes(term);
        item.classList.toggle('hidden', !match);
        if (match) visible++;
      });

      // Hide a whole category once none of its questions match
      this.groups.forEach(group => {
        const anyVisible = group.querySelectorAll('[data-faq-item]:not(.hidden)').length > 0;
        group.classList.toggle('hidden', !anyVisible);
      });

      if (this.emptyMsg) {
        this.emptyMsg.classList.toggle('hidden', visible > 0);
      }
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    MoveMateFAQ.init();
  });

  window.MoveMateFAQ = MoveMateFAQ;

})();