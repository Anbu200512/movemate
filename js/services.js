// MoveMate - Services JavaScript
// Service selection, booking integration

(function() {
  'use strict';

  const MoveMateServices = {
    init() {
      this.initServiceCards();
      this.initServiceFilter();
    },

    initServiceCards() {
      document.querySelectorAll('[data-service-book]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const serviceId = btn.getAttribute('data-service-book');
          const serviceName = btn.getAttribute('data-service-name') || serviceId;

          localStorage.setItem('movemate_preferences', JSON.stringify({
            selectedService: serviceId,
            selectedServiceName: serviceName,
            timestamp: Date.now()
          }));

          window.location.href = 'dashboard.html#book';
        });
      });
    },

    initServiceFilter() {
      const filterBtns = document.querySelectorAll('[data-filter-btn]');
      const cards = document.querySelectorAll('[data-service-card]');

      filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const filter = btn.getAttribute('data-filter-btn');

          filterBtns.forEach(b => b.classList.remove('active', 'bg-primary-600', 'text-white'));
          btn.classList.add('active', 'bg-primary-600', 'text-white');

          cards.forEach(card => {
            const category = card.getAttribute('data-service-card');
            if (filter === 'all' || category === filter) {
              card.style.display = 'block';
              card.classList.add('reveal', 'active');
            } else {
              card.style.display = 'none';
            }
          });
        });
      });
    },

    getServiceName(id) {
      const names = {
        'hourly-labor': 'Hourly Moving Labor',
        'loading-help': 'Loading Help',
        'unloading-help': 'Unloading Help',
        'furniture-moving': 'Furniture Moving',
        'heavy-lifting': 'Heavy Lifting',
        'moving-assistance': 'Moving Assistance'
      };
      return names[id] || id;
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    MoveMateServices.init();
  });

  window.MoveMateServices = MoveMateServices;

})();
