// MoveMate - Pricing JavaScript
// Price calculator, pricing display

(function() {
  'use strict';

  const PRICING = {
    rates: {
      1: 35,
      2: 60,
      3: 80
    },
    minimumHours: 2,
    weekendSurcharge: 0.10,
    heavyLiftingSurcharge: 15,
    serviceMultipliers: {
      'hourly-labor': 1.0,
      'loading-help': 1.0,
      'unloading-help': 1.0,
      'furniture-moving': 1.1,
      'heavy-lifting': 1.2,
      'moving-assistance': 1.0
    }
  };

  const MoveMatePricing = {
    init() {
      this.initCalculator();
      this.initPricingCards();
    },

    initCalculator() {
      const form = document.getElementById('pricing-calculator');
      if (!form) return;

      const workersSelect = document.getElementById('calc-workers');
      const hoursInput = document.getElementById('calc-hours');
      const serviceSelect = document.getElementById('calc-service');
      const heavyLiftingCheck = document.getElementById('calc-heavy-lifting');

      const calculate = window.MoveMateUtils.debounce(() => {
        this.calculatePrice();
      }, 150);

      if (workersSelect) workersSelect.addEventListener('change', calculate);
      if (hoursInput) hoursInput.addEventListener('input', calculate);
      if (serviceSelect) serviceSelect.addEventListener('change', calculate);
      if (heavyLiftingCheck) heavyLiftingCheck.addEventListener('change', calculate);

      const bookBtn = document.getElementById('calc-book-btn');
      if (bookBtn) {
        bookBtn.addEventListener('click', () => {
          const estimate = this.getCurrentEstimate();
          if (!estimate) {
            window.MoveMateToast.warning('Please fill in all fields to get an estimate.');
            return;
          }

          localStorage.setItem('movemate_preferences', JSON.stringify({
            ...JSON.parse(localStorage.getItem('movemate_preferences') || '{}'),
            bookingEstimate: estimate,
            timestamp: Date.now()
          }));

          window.location.href = 'dashboard.html#book';
        });
      }

      const quoteBtn = document.getElementById('calc-quote-btn');
      if (quoteBtn) {
        quoteBtn.addEventListener('click', () => {
          const estimate = this.getCurrentEstimate();
          if (!estimate) {
            window.MoveMateToast.warning('Please fill in all fields to request a quote.');
            return;
          }
          window.MoveMateToast.success('Quote request submitted! We will contact you within 2 hours.');
        });
      }

      this.calculatePrice();
    },

    initPricingCards() {
      document.querySelectorAll('[data-select-plan]').forEach(btn => {
        btn.addEventListener('click', () => {
          const workers = btn.getAttribute('data-select-plan');
          const calcWorkers = document.getElementById('calc-workers');
          if (calcWorkers) {
            calcWorkers.value = workers;
            this.calculatePrice();
            document.getElementById('pricing-calculator')?.scrollIntoView({ behavior: 'smooth' });
          }
        });
      });
    },

    calculatePrice() {
      const workersEl = document.getElementById('calc-workers');
      const hoursEl = document.getElementById('calc-hours');
      const serviceEl = document.getElementById('calc-service');
      const heavyEl = document.getElementById('calc-heavy-lifting');

      if (!workersEl || !hoursEl || !serviceEl) return;

      const workers = parseInt(workersEl.value) || 0;
      const hours = parseInt(hoursEl.value) || 0;
      const service = serviceEl.value;
      const heavyLifting = heavyEl ? heavyEl.checked : false;

      if (workers === 0 || hours === 0) {
        this.updateDisplay({ labor: 0, additional: 0, total: 0, hours: 0, workers: 0 });
        return;
      }

      const effectiveHours = Math.max(hours, PRICING.minimumHours);
      const baseRate = PRICING.rates[workers] || PRICING.rates[1];
      const serviceMultiplier = PRICING.serviceMultipliers[service] || 1.0;

      let laborCost = baseRate * effectiveHours * serviceMultiplier;

      const today = new Date();
      const isWeekend = today.getDay() === 0 || today.getDay() === 6;
      let weekendCharge = 0;
      if (isWeekend) {
        weekendCharge = laborCost * PRICING.weekendSurcharge;
      }

      let heavyCharge = 0;
      if (heavyLifting) {
        heavyCharge = PRICING.heavyLiftingSurcharge * effectiveHours;
      }

      const additional = weekendCharge + heavyCharge;
      const total = laborCost + additional;

      this.updateDisplay({
        labor: Math.round(laborCost),
        additional: Math.round(additional),
        total: Math.round(total),
        hours: effectiveHours,
        workers,
        weekendCharge: Math.round(weekendCharge),
        heavyCharge: Math.round(heavyCharge),
        isWeekend,
        heavyLifting
      });
    },

    updateDisplay(data) {
      const laborEl = document.getElementById('calc-labor-cost');
      const additionalEl = document.getElementById('calc-additional-cost');
      const totalEl = document.getElementById('calc-total-cost');
      const breakdownEl = document.getElementById('calc-breakdown');

      if (laborEl) laborEl.textContent = window.MoveMateUtils.formatCurrency(data.labor);
      if (additionalEl) additionalEl.textContent = window.MoveMateUtils.formatCurrency(data.additional);
      if (totalEl) totalEl.textContent = window.MoveMateUtils.formatCurrency(data.total);

      if (breakdownEl && data.total > 0) {
        let html = `<div class="space-y-2 text-sm">`;
        html += `<div class="flex justify-between"><span class="text-gray-600 dark:text-gray-400">Labor (${data.workers} worker${data.workers > 1 ? 's' : ''} x ${data.hours} hrs)</span><span class="font-medium">${window.MoveMateUtils.formatCurrency(data.labor)}</span></div>`;
        if (data.weekendCharge > 0) {
          html += `<div class="flex justify-between"><span class="text-gray-600 dark:text-gray-400">Weekend surcharge (10%)</span><span class="font-medium">${window.MoveMateUtils.formatCurrency(data.weekendCharge)}</span></div>`;
        }
        if (data.heavyCharge > 0) {
          html += `<div class="flex justify-between"><span class="text-gray-600 dark:text-gray-400">Heavy lifting surcharge</span><span class="font-medium">${window.MoveMateUtils.formatCurrency(data.heavyCharge)}</span></div>`;
        }
        html += `<div class="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between font-bold text-base"><span>Estimated Total</span><span class="text-primary-600 dark:text-primary-400">${window.MoveMateUtils.formatCurrency(data.total)}</span></div>`;
        html += `</div>`;
        breakdownEl.innerHTML = html;
      }
    },

    getCurrentEstimate() {
      const workersEl = document.getElementById('calc-workers');
      const hoursEl = document.getElementById('calc-hours');
      const serviceEl = document.getElementById('calc-service');
      const heavyEl = document.getElementById('calc-heavy-lifting');

      if (!workersEl || !hoursEl || !serviceEl) return null;

      const workers = parseInt(workersEl.value) || 0;
      const hours = parseInt(hoursEl.value) || 0;
      const service = serviceEl.value;
      const heavyLifting = heavyEl ? heavyEl.checked : false;

      if (workers === 0 || hours === 0) return null;

      const effectiveHours = Math.max(hours, PRICING.minimumHours);
      const baseRate = PRICING.rates[workers] || PRICING.rates[1];
      const serviceMultiplier = PRICING.serviceMultipliers[service] || 1.0;
      const laborCost = baseRate * effectiveHours * serviceMultiplier;

      const today = new Date();
      const isWeekend = today.getDay() === 0 || today.getDay() === 6;
      const weekendCharge = isWeekend ? laborCost * PRICING.weekendSurcharge : 0;
      const heavyCharge = heavyLifting ? PRICING.heavyLiftingSurcharge * effectiveHours : 0;

      return {
        workers,
        hours: effectiveHours,
        service,
        heavyLifting,
        laborCost: Math.round(laborCost),
        weekendCharge: Math.round(weekendCharge),
        heavyCharge: Math.round(heavyCharge),
        total: Math.round(laborCost + weekendCharge + heavyCharge)
      };
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    MoveMatePricing.init();
  });

  window.MoveMatePricing = MoveMatePricing;

})();
