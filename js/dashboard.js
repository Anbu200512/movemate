// MoveMate - Dashboard JavaScript
// Bookings, Crew Assignment, Payments, Notifications, Profile

(function() {
  'use strict';

  const BOOKING_STATUSES = [
    'Pending', 'Confirmed', 'Crew Assigned', 'On the Way',
    'Arrived', 'In Progress', 'Completed', 'Cancelled'
  ];

  const CREW_MEMBERS = [
    { name: 'Rajesh Kumar', role: 'Team Lead', experience: '5 years' },
    { name: 'Amit Singh', role: 'Mover', experience: '3 years' },
    { name: 'Suresh Patel', role: 'Mover', experience: '4 years' },
    { name: 'Vikram Joshi', role: 'Mover', experience: '2 years' },
    { name: 'Arjun Mehta', role: 'Mover', experience: '3 years' },
    { name: 'Kiran Rao', role: 'Mover', experience: '2 years' }
  ];

  const demoMoveDate = new Date();
  demoMoveDate.setDate(demoMoveDate.getDate() + 2);
  const DEMO_BOOKING = {
    id: 'BKG-DEMO-001',
    service: 'hourly-labor',
    serviceName: 'Hourly Moving Labor',
    date: demoMoveDate.toISOString().split('T')[0],
    time: '10:00',
    workers: 2,
    hours: 3,
    address: 'Bandra West, Mumbai',
    description: 'Load packed boxes and furniture for a local move.',
    instructions: 'Please call on arrival.',
    heavyLifting: false,
    status: 'Confirmed',
    estimate: { total: 180 },
    createdAt: new Date().toISOString(),
    crew: null
  };
  const DEMO_CREW_STATUS = {
    status: 'Crew Assigned',
    crewName: 'MoveMate Crew A',
    workerCount: 2,
    expectedArrival: '10:00 AM',
    members: CREW_MEMBERS.slice(0, 2)
  };
  const DEMO_PAYMENT = {
    id: 'PAY-DEMO-001',
    bookingId: DEMO_BOOKING.id,
    date: DEMO_BOOKING.date,
    service: DEMO_BOOKING.serviceName,
    amount: 180,
    status: 'Completed'
  };
  const DEMO_NOTIFICATIONS = [
    { id: 'NOT-DEMO-001', message: 'Your sample booking is confirmed. Review the booking details in your dashboard.', type: 'success', timestamp: new Date().toISOString(), read: false },
    { id: 'NOT-DEMO-002', message: 'A sample crew has been assigned to your upcoming move.', type: 'info', timestamp: new Date().toISOString(), read: false }
  ];

  const MoveMateDashboard = {
    init() {
      this.initTabs();
      this.initBookingForm();
      this.initOverview();
      this.initBookings();
      this.initCrew();
      this.initPayments();
      this.initProfile();
      this.initNotifications();
      this.initSidebar();
    },

    initTabs() {
      const tabBtns = document.querySelectorAll('[data-tab-btn]');
      const tabContents = document.querySelectorAll('[data-tab-content]');

      tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const target = btn.getAttribute('data-tab-btn');
          const adminTabTitle = document.getElementById('admin-tab-title');
          const adminTabLabels = {
            overview: 'Overview',
            bookings: 'All Bookings',
            crew: 'Crew & Dispatch',
            payments: 'Revenue',
            profile: 'Admin Profile',
            notifications: 'Alerts',
            support: 'Support'
          };
          if (adminTabTitle && adminTabLabels[target]) adminTabTitle.textContent = adminTabLabels[target];
          const customerTabTitle = document.getElementById('customer-tab-title');
          const customerTabLabels = {
            overview: 'Overview',
            book: 'Book a Service',
            bookings: 'My Bookings',
            crew: 'Crew Assignment',
            payments: 'Payment History',
            profile: 'Profile',
            notifications: 'Notifications',
            support: 'Help & Support'
          };
          if (customerTabTitle && customerTabLabels[target]) customerTabTitle.textContent = customerTabLabels[target];

          tabBtns.forEach(b => b.classList.remove('active', 'bg-primary-600', 'text-white', 'border-primary-600'));
          btn.classList.add('active', 'bg-primary-600', 'text-white', 'border-primary-600');

          tabContents.forEach(content => {
            if (content.getAttribute('data-tab-content') === target) {
              content.classList.remove('hidden');
            } else {
              content.classList.add('hidden');
            }
          });
        });
      });

      const hash = window.location.hash.replace('#', '');
      if (hash) {
        const targetBtn = document.querySelector(`[data-tab-btn="${hash}"]`);
        if (targetBtn) targetBtn.click();
      }
    },

    initSidebar() {
      const sidebarLinks = document.querySelectorAll('[data-sidebar-link]');
      const sidebarPanel = document.getElementById('dashboard-sidebar-panel');
      const sidebarOverlay = document.getElementById('dashboard-sidebar-overlay');
      const sidebarToggle = document.getElementById('sidebar-toggle');
      const closeSidebar = () => {
        if (!sidebarPanel) return;
        sidebarPanel.classList.add('-translate-x-full');
        sidebarPanel.classList.remove('translate-x-0');
        sidebarOverlay?.classList.add('hidden');
        sidebarToggle?.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('overflow-hidden');
      };
      const openSidebar = () => {
        if (!sidebarPanel) return;
        sidebarPanel.classList.remove('-translate-x-full');
        sidebarPanel.classList.add('translate-x-0');
        sidebarOverlay?.classList.remove('hidden');
        sidebarToggle?.setAttribute('aria-expanded', 'true');
        document.body.classList.add('overflow-hidden');
      };

      sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const target = link.getAttribute('data-sidebar-link');

          sidebarLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');

          const tabBtn = document.querySelector(`[data-tab-btn="${target}"]`);
          if (tabBtn) tabBtn.click();

          if (window.innerWidth < 1024) closeSidebar();
        });
      });

      sidebarToggle?.addEventListener('click', () => {
        if (sidebarPanel?.classList.contains('-translate-x-full')) openSidebar();
        else closeSidebar();
      });
      sidebarOverlay?.addEventListener('click', closeSidebar);
      document.querySelectorAll('[data-sidebar-close]').forEach(button => button.addEventListener('click', closeSidebar));
      document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && window.innerWidth < 1024) closeSidebar();
      });
    },

    initBookingForm() {
      const form = document.getElementById('booking-form');
      if (!form) return;

      const serviceSelect = document.getElementById('booking-service');
      const workersSelect = document.getElementById('booking-workers');
      const hoursInput = document.getElementById('booking-hours');
      const heavyCheck = document.getElementById('booking-heavy');
      const dateInput = document.getElementById('booking-date');

      if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
      }

      const preferences = window.MoveMateUtils.getStoredData('movemate_preferences', {});
      if (preferences.selectedService && serviceSelect) {
        serviceSelect.value = preferences.selectedService;
      }
      if (preferences.bookingEstimate) {
        const est = preferences.bookingEstimate;
        if (workersSelect) workersSelect.value = est.workers;
        if (hoursInput) hoursInput.value = est.hours;
        if (heavyCheck) heavyCheck.checked = est.heavyLifting;
      }

      const updateEstimate = window.MoveMateUtils.debounce(() => {
        this.updateBookingEstimate();
      }, 150);

      [serviceSelect, workersSelect, hoursInput, heavyCheck].forEach(el => {
        if (el) el.addEventListener('input', updateEstimate);
        if (el) el.addEventListener('change', updateEstimate);
      });

      this.updateBookingEstimate();

      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const service = serviceSelect?.value;
        const date = dateInput?.value;
        const time = document.getElementById('booking-time')?.value;
        const workers = parseInt(workersSelect?.value) || 0;
        const hours = parseInt(hoursInput?.value) || 0;
        const address = document.getElementById('booking-address')?.value.trim();
        const description = document.getElementById('booking-description')?.value.trim();
        const instructions = document.getElementById('booking-instructions')?.value.trim();
        const heavyLifting = heavyCheck?.checked || false;

        if (!service) { window.MoveMateToast.error('Please select a service type.'); return; }
        if (!date) { window.MoveMateToast.error('Please select a booking date.'); return; }
        if (!time) { window.MoveMateToast.error('Please select a preferred time.'); return; }
        if (workers === 0) { window.MoveMateToast.error('Please select number of workers.'); return; }
        if (hours < 2) { window.MoveMateToast.error('Minimum booking is 2 hours.'); return; }
        if (!address) { window.MoveMateToast.error('Please enter the pickup/location address.'); return; }

        const estimate = this.calculateBookingEstimate(service, workers, hours, heavyLifting, date);

        const booking = {
          id: window.MoveMateUtils.generateId('BKG'),
          service,
          serviceName: this.getServiceDisplayName(service),
          date,
          time,
          workers,
          hours,
          address,
          description,
          instructions,
          heavyLifting,
          status: 'Pending',
          estimate,
          createdAt: new Date().toISOString(),
          crew: null
        };

        const bookings = window.MoveMateUtils.getStoredData('movemate_bookings', []);
        bookings.unshift(booking);
        window.MoveMateUtils.setStoredData('movemate_bookings', bookings);
        window.MoveMateUtils.setStoredData('movemate_current_booking', booking);

        this.addNotification(`Booking ${booking.id} confirmed for ${window.MoveMateUtils.formatDate(date)}`, 'success');
        this.addNotification('Your booking is pending crew assignment.', 'info');

        window.MoveMateToast.success(`Booking confirmed! Reference: ${booking.id}`);

        localStorage.removeItem('movemate_preferences');

        form.reset();
        if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];
        this.updateBookingEstimate();
        this.initOverview();
        this.initBookings();
        this.initCrew();
        this.initPayments();
      });
    },

    updateBookingEstimate() {
      const service = document.getElementById('booking-service')?.value;
      const workers = parseInt(document.getElementById('booking-workers')?.value) || 0;
      const hours = parseInt(document.getElementById('booking-hours')?.value) || 0;
      const heavy = document.getElementById('booking-heavy')?.checked || false;
      const date = document.getElementById('booking-date')?.value;

      const estimateEl = document.getElementById('booking-estimate');
      if (!estimateEl) return;

      if (!service || workers === 0 || hours === 0) {
        estimateEl.innerHTML = '<p class="text-gray-500 dark:text-gray-400 text-sm">Fill in the details to see estimated price</p>';
        return;
      }

      const estimate = this.calculateBookingEstimate(service, workers, hours, heavy, date);

      estimateEl.innerHTML = `
        <div class="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600 dark:text-gray-400">Labor (${workers} worker${workers > 1 ? 's' : ''} x ${hours} hrs)</span>
            <span class="font-medium">${window.MoveMateUtils.formatCurrency(estimate.laborCost)}</span>
          </div>
          ${estimate.heavyCharge > 0 ? `<div class="flex justify-between text-sm"><span class="text-gray-600 dark:text-gray-400">Heavy lifting</span><span class="font-medium">${window.MoveMateUtils.formatCurrency(estimate.heavyCharge)}</span></div>` : ''}
          ${estimate.weekendCharge > 0 ? `<div class="flex justify-between text-sm"><span class="text-gray-600 dark:text-gray-400">Weekend surcharge</span><span class="font-medium">${window.MoveMateUtils.formatCurrency(estimate.weekendCharge)}</span></div>` : ''}
          <div class="border-t border-primary-200 dark:border-primary-800 pt-2 flex justify-between font-bold">
            <span>Estimated Total</span>
            <span class="text-primary-600 dark:text-primary-400">${window.MoveMateUtils.formatCurrency(estimate.total)}</span>
          </div>
        </div>
      `;
    },

    calculateBookingEstimate(service, workers, hours, heavyLifting, date) {
      const rates = { 1: 35, 2: 60, 3: 80 };
      const serviceMultipliers = {
        'hourly-labor': 1.0, 'loading-help': 1.0, 'unloading-help': 1.0,
        'furniture-moving': 1.1, 'heavy-lifting': 1.2, 'moving-assistance': 1.0
      };

      const effectiveHours = Math.max(hours, 2);
      const baseRate = rates[workers] || rates[1];
      const multiplier = serviceMultipliers[service] || 1.0;
      const laborCost = baseRate * effectiveHours * multiplier;

      let weekendCharge = 0;
      if (date) {
        const day = new Date(date).getDay();
        if (day === 0 || day === 6) {
          weekendCharge = laborCost * 0.10;
        }
      }

      const heavyCharge = heavyLifting ? 15 * effectiveHours : 0;

      return {
        laborCost: Math.round(laborCost),
        weekendCharge: Math.round(weekendCharge),
        heavyCharge: Math.round(heavyCharge),
        total: Math.round(laborCost + weekendCharge + heavyCharge)
      };
    },

    initOverview() {
      const container = document.getElementById('overview-content');
      if (!container) return;

      const storedCurrentBooking = window.MoveMateUtils.getStoredData('movemate_current_booking');
      const storedCrewStatus = window.MoveMateUtils.getStoredData('movemate_crew_status');
      const storedPayments = window.MoveMateUtils.getStoredData('movemate_payments', []);
      const storedBookings = window.MoveMateUtils.getStoredData('movemate_bookings', []);
      const currentBooking = storedCurrentBooking || DEMO_BOOKING;
      const bookings = storedBookings.length ? storedBookings : [DEMO_BOOKING];
      const payments = storedPayments.length ? storedPayments : (storedBookings.length ? [] : [DEMO_PAYMENT]);
      const crewStatus = storedCrewStatus || (currentBooking.id === DEMO_BOOKING.id ? DEMO_CREW_STATUS : null);

      if (document.body.dataset.dashboardRole === 'admin') {
        const pendingBookings = bookings.filter(booking => ['Pending', 'Confirmed'].includes(booking.status)).length;
        const revenue = payments.reduce((total, payment) => total + (Number(payment.amount) || 0), 0);
        container.innerHTML = `
          <div class="space-y-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <article class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm">
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total bookings</p>
                <p class="mt-3 text-3xl font-bold text-gray-900 dark:text-white">${bookings.length}</p>
                <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">Across all statuses</p>
              </article>
              <article class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm">
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Needs attention</p>
                <p class="mt-3 text-3xl font-bold text-amber-600 dark:text-amber-400">${pendingBookings}</p>
                <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">Pending or confirmed</p>
              </article>
              <article class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm">
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Crew members</p>
                <p class="mt-3 text-3xl font-bold text-gray-900 dark:text-white">${CREW_MEMBERS.length}</p>
                <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">Available in demo roster</p>
              </article>
              <article class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm">
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Recorded revenue</p>
                <p class="mt-3 text-3xl font-bold text-primary-600 dark:text-primary-400">$${revenue.toFixed(2)}</p>
                <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">From saved demo payments</p>
              </article>
            </div>
            <section class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
              <div class="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-700 px-5 py-4 sm:px-6">
                <div>
                  <h2 class="font-semibold text-gray-900 dark:text-white">Recent bookings</h2>
                  <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Latest customer requests in this demo workspace.</p>
                </div>
                <button type="button" data-overview-bookings class="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline">View all bookings</button>
              </div>
              ${bookings.length ? `<div class="divide-y divide-gray-100 dark:divide-gray-700">${bookings.slice(0, 5).map(booking => `
                <div class="flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-6">
                  <div><p class="font-medium text-gray-900 dark:text-white">${booking.serviceName || 'Moving service'}</p><p class="mt-1 text-xs text-gray-500 dark:text-gray-400">${booking.id || 'Booking'} · ${booking.date ? window.MoveMateUtils.formatDate(booking.date) : 'Date not set'}</p></div>
                  <span class="status-badge ${this.getStatusClass(booking.status)}">${booking.status || 'Pending'}</span>
                </div>`).join('')}</div>` : `
                <div class="px-6 py-10 text-center">
                  <p class="font-medium text-gray-900 dark:text-white">No bookings yet</p>
                  <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">New bookings will appear here when they are created.</p>
                </div>`}
            </section>
            <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <section class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 sm:p-6 shadow-sm">
                <div class="flex items-center justify-between gap-3 mb-4">
                  <div><h2 class="font-semibold text-gray-900 dark:text-white">Crew roster</h2><p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Quick view of your moving teams.</p></div>
                  <button type="button" data-overview-crew class="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline">Open dispatch</button>
                </div>
                <div class="space-y-3">${CREW_MEMBERS.slice(0, 3).map(member => `
                  <div class="flex items-center gap-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 p-3">
                    <span class="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 flex items-center justify-center font-semibold">${member.name.split(' ').map(part => part[0]).join('')}</span>
                    <span class="min-w-0 flex-1"><strong class="block truncate text-sm text-gray-900 dark:text-white">${member.name}</strong><small class="text-gray-500 dark:text-gray-400">${member.role} · ${member.experience}</small></span>
                    <span class="text-xs font-medium text-emerald-600 dark:text-emerald-400">Available</span>
                  </div>`).join('')}
                </div>
                <p class="mt-4 text-xs text-gray-400 dark:text-gray-500">Availability shown here is sample workspace data.</p>
              </section>
              <section class="rounded-2xl border border-primary-100 dark:border-primary-900/40 bg-primary-50 dark:bg-primary-900/20 p-5 sm:p-6">
                <p class="text-xs font-bold uppercase tracking-wider text-primary-700 dark:text-primary-300">Operations pulse</p>
                <h2 class="mt-2 text-xl font-bold text-gray-900 dark:text-white">${pendingBookings ? `${pendingBookings} booking${pendingBookings === 1 ? '' : 's'} need attention` : 'You’re all caught up'}</h2>
                <p class="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">Review incoming requests, confirm schedules, and assign the right crew before moving day.</p>
                <div class="mt-5 flex flex-wrap gap-3">
                  <button type="button" data-overview-bookings class="inline-flex items-center justify-center rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 transition-colors">Review bookings</button>
                  <button type="button" data-overview-revenue class="inline-flex items-center justify-center rounded-xl border border-primary-200 dark:border-primary-800 px-4 py-2.5 text-sm font-semibold text-primary-700 dark:text-primary-300 hover:bg-white dark:hover:bg-gray-800 transition-colors">View revenue</button>
                </div>
              </section>
            </div>
            <p class="text-xs text-gray-400 dark:text-gray-500">Dashboard figures are based on locally stored demo data.</p>
          </div>
        `;
        container.querySelector('[data-overview-bookings]')?.addEventListener('click', () => {
          document.querySelector('[data-tab-btn="bookings"]')?.click();
        });
        container.querySelector('[data-overview-crew]')?.addEventListener('click', () => {
          document.querySelector('[data-tab-btn="crew"]')?.click();
        });
        container.querySelector('[data-overview-revenue]')?.addEventListener('click', () => {
          document.querySelector('[data-tab-btn="payments"]')?.click();
        });
        return;
      }

      if (!currentBooking) {
        container.innerHTML = `
          <div class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-12 text-center shadow-sm">
            <span class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 dark:bg-primary-900/30">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            </span>
            <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">No Active Booking</h3>
            <p class="mt-2 text-gray-500 dark:text-gray-400">Book a service to get started with MoveMate.</p>
            <button onclick="document.querySelector('[data-tab-btn=\\'book\\']').click()" class="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">Book a Service</button>
          </div>
        `;
        return;
      }

      const statusClass = this.getStatusClass(currentBooking.status);
      const payment = payments.find(p => p.bookingId === currentBooking.id);

      container.innerHTML = `
        <div class="space-y-6">
          <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Booking Reference</p>
                <p class="text-lg font-bold text-gray-900 dark:text-white">${currentBooking.id}</p>
              </div>
              <span class="status-badge ${statusClass}">${currentBooking.status}</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Date</p>
                  <p class="font-medium text-gray-900 dark:text-white">${window.MoveMateUtils.formatDate(currentBooking.date)}</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Time</p>
                  <p class="font-medium text-gray-900 dark:text-white">${window.MoveMateUtils.formatTime(currentBooking.time)}</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Workers</p>
                  <p class="font-medium text-gray-900 dark:text-white">${currentBooking.workers} worker${currentBooking.workers > 1 ? 's' : ''}</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Hours</p>
                  <p class="font-medium text-gray-900 dark:text-white">${currentBooking.hours} hours</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Service</p>
                  <p class="font-medium text-gray-900 dark:text-white">${currentBooking.serviceName}</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Payment</p>
                  <p class="font-medium text-gray-900 dark:text-white">${payment ? 'Paid' : 'Pending'}</p>
                </div>
              </div>
            </div>
          </div>

          ${crewStatus ? `
          <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Crew Assignment</h3>
            <div class="flex items-center gap-4 mb-4">
              <div class="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              </div>
              <div>
                <p class="font-medium text-gray-900 dark:text-white">${crewStatus.crewName}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">${crewStatus.workerCount} workers assigned</p>
              </div>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <span class="text-gray-600 dark:text-gray-400">Expected arrival: ${crewStatus.expectedArrival}</span>
            </div>
            <p class="mt-2 text-xs text-gray-400 dark:text-gray-500">Crew arrival status is simulated demo data.</p>
          </div>
          ` : ''}

          <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <section class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div class="flex items-center justify-between gap-3 mb-5">
                <div><h3 class="text-lg font-semibold text-gray-900 dark:text-white">Move-day checklist</h3><p class="mt-1 text-sm text-gray-500 dark:text-gray-400">A few quick steps to keep your move on track.</p></div>
                <span class="rounded-full bg-primary-50 dark:bg-primary-900/30 px-3 py-1 text-xs font-semibold text-primary-700 dark:text-primary-300">${currentBooking.status}</span>
              </div>
              <ul class="space-y-4 text-sm text-gray-600 dark:text-gray-300">
                <li class="flex items-start gap-3"><span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300">1</span><span><strong class="text-gray-900 dark:text-white">Keep walkways clear</strong><span class="block mt-0.5 text-gray-500 dark:text-gray-400">Make it easy for the crew to carry items safely.</span></span></li>
                <li class="flex items-start gap-3"><span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300">2</span><span><strong class="text-gray-900 dark:text-white">Set aside essentials</strong><span class="block mt-0.5 text-gray-500 dark:text-gray-400">Keep valuables and important documents with you.</span></span></li>
                <li class="flex items-start gap-3"><span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300">3</span><span><strong class="text-gray-900 dark:text-white">Be ready at the address</strong><span class="block mt-0.5 text-gray-500 dark:text-gray-400">Your crew is scheduled for ${window.MoveMateUtils.formatTime(currentBooking.time)}.</span></span></li>
              </ul>
            </section>
            <section class="rounded-xl border border-primary-100 dark:border-primary-900/40 bg-primary-50 dark:bg-primary-900/20 p-6">
              <div class="w-11 h-11 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center text-primary-600 dark:text-primary-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-1.414 1.414M6.343 17.657l-1.414 1.414M2 12h2m16 0h2M6.343 6.343L4.929 4.929m14.142 14.142l-1.414-1.414M12 2v2m0 16v2m7.071-3.071l-1.414-1.414M6.343 6.343L4.929 4.929M12 8a4 4 0 100 8 4 4 0 000-8z"/></svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Need a hand with your plan?</h3>
              <p class="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">Our support team can help with booking details, service changes, or questions before moving day.</p>
              <div class="mt-5 flex flex-wrap gap-3">
                <a href="contact.html" class="inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 transition-colors">Contact support</a>
                <a href="faq.html" class="inline-flex items-center justify-center rounded-lg border border-primary-200 dark:border-primary-800 px-4 py-2.5 text-sm font-semibold text-primary-700 dark:text-primary-300 hover:bg-white dark:hover:bg-gray-800 transition-colors">Browse FAQs</a>
              </div>
            </section>
          </div>
        </div>
      `;
    },

    initBookings() {
      const container = document.getElementById('bookings-list');
      if (!container) return;

      const storedBookings = window.MoveMateUtils.getStoredData('movemate_bookings', []);
      const bookings = storedBookings.length ? storedBookings : [DEMO_BOOKING];
      const pendingBookings = bookings.filter(booking => ['Pending', 'Confirmed'].includes(booking.status)).length;
      const completedBookings = bookings.filter(booking => booking.status === 'Completed').length;
      const activeBookings = bookings.filter(booking => ['Crew Assigned', 'On the Way', 'Arrived', 'In Progress'].includes(booking.status)).length;
      const cancelledBookings = bookings.filter(booking => booking.status === 'Cancelled').length;
      const estimatedValue = bookings.reduce((total, booking) => total + (Number(booking.estimate?.total) || 0), 0);

      if (bookings.length === 0) {
        container.innerHTML = `
          <div class="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">No Bookings Yet</h3>
            <p class="mt-2 text-gray-500 dark:text-gray-400">Your booking history will appear here.</p>
          </div>
        `;
        return;
      }

      container.innerHTML = `
        <div class="space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <article class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm"><p class="text-sm text-gray-500 dark:text-gray-400">${document.body.dataset.dashboardRole === 'admin' ? 'Total bookings' : 'Your bookings'}</p><p class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">${bookings.length}</p><p class="mt-1 text-xs text-gray-500 dark:text-gray-400">${document.body.dataset.dashboardRole === 'admin' ? 'All customer requests' : 'Including your sample booking'}</p></article>
          <article class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm"><p class="text-sm text-gray-500 dark:text-gray-400">Needs attention</p><p class="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">${pendingBookings}</p><p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Pending or confirmed</p></article>
          <article class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm"><p class="text-sm text-gray-500 dark:text-gray-400">Estimated booking value</p><p class="mt-2 text-2xl font-bold text-primary-600 dark:text-primary-400">${window.MoveMateUtils.formatCurrency(estimatedValue)}</p><p class="mt-1 text-xs text-gray-500 dark:text-gray-400">${completedBookings} completed booking${completedBookings === 1 ? '' : 's'}</p></article>
        </div>
        <section class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 sm:p-6 shadow-sm">
          <div class="flex flex-wrap items-start justify-between gap-3 mb-5">
            <div><h2 class="font-semibold text-gray-900 dark:text-white">Booking workflow</h2><p class="mt-1 text-sm text-gray-500 dark:text-gray-400">A quick breakdown of requests by their current stage.</p></div>
            <span class="rounded-full bg-gray-100 dark:bg-gray-700 px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-300">${bookings.length} total</span>
          </div>
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div class="rounded-xl bg-amber-50 dark:bg-amber-900/20 p-4"><p class="text-xs font-medium text-amber-700 dark:text-amber-300">Awaiting action</p><p class="mt-2 text-2xl font-bold text-amber-700 dark:text-amber-300">${pendingBookings}</p><p class="mt-1 text-xs text-amber-700/80 dark:text-amber-300/80">Pending or confirmed</p></div>
            <div class="rounded-xl bg-blue-50 dark:bg-blue-900/20 p-4"><p class="text-xs font-medium text-blue-700 dark:text-blue-300">In progress</p><p class="mt-2 text-2xl font-bold text-blue-700 dark:text-blue-300">${activeBookings}</p><p class="mt-1 text-xs text-blue-700/80 dark:text-blue-300/80">Crew assigned through job</p></div>
            <div class="rounded-xl bg-primary-50 dark:bg-primary-900/20 p-4"><p class="text-xs font-medium text-primary-700 dark:text-primary-300">Completed</p><p class="mt-2 text-2xl font-bold text-primary-700 dark:text-primary-300">${completedBookings}</p><p class="mt-1 text-xs text-primary-700/80 dark:text-primary-300/80">Finished bookings</p></div>
            <div class="rounded-xl bg-gray-100 dark:bg-gray-700/60 p-4"><p class="text-xs font-medium text-gray-600 dark:text-gray-300">Cancelled</p><p class="mt-2 text-2xl font-bold text-gray-800 dark:text-white">${cancelledBookings}</p><p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Closed requests</p></div>
          </div>
        </section>
        <section class="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div class="border-b border-gray-100 dark:border-gray-700 px-5 py-4 sm:px-6">
          <h2 class="font-semibold text-gray-900 dark:text-white">Booking records</h2>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Review service details, schedule, crew size, and current booking status.</p>
        </div>
        <div class="overflow-x-auto px-2 sm:px-4">
          <table class="w-full responsive-table">
            <thead>
              <tr class="border-b border-gray-200 dark:border-gray-700">
                <th class="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Reference</th>
                <th class="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Service</th>
                <th class="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Date</th>
                <th class="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Time</th>
                <th class="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Workers</th>
                <th class="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Hours</th>
                <th class="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody>
              ${bookings.map(booking => `
                <tr class="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td data-label="Reference" class="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">${booking.id}</td>
                  <td data-label="Service" class="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">${booking.serviceName}</td>
                  <td data-label="Date" class="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">${window.MoveMateUtils.formatDate(booking.date)}</td>
                  <td data-label="Time" class="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">${window.MoveMateUtils.formatTime(booking.time)}</td>
                  <td data-label="Workers" class="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">${booking.workers}</td>
                  <td data-label="Hours" class="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">${booking.hours} hrs</td>
                  <td data-label="Status" class="py-3 px-4"><span class="status-badge ${this.getStatusClass(booking.status)}">${booking.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        </section>
        </div>
      `;
    },

    initCrew() {
      const container = document.getElementById('crew-content');
      if (!container) return;

      const storedCurrentBooking = window.MoveMateUtils.getStoredData('movemate_current_booking');
      const currentBooking = storedCurrentBooking || DEMO_BOOKING;
      const crewStatus = window.MoveMateUtils.getStoredData('movemate_crew_status') || (currentBooking.id === DEMO_BOOKING.id ? DEMO_CREW_STATUS : null);

      if (!currentBooking || !crewStatus) {
        container.innerHTML = `
          <div class="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">No Crew Assigned</h3>
            <p class="mt-2 text-gray-500 dark:text-gray-400">Crew will be assigned once your booking is confirmed.</p>
          </div>
        `;
        return;
      }

      const statusSteps = ['Booking Confirmed', 'Crew Assigned', 'On the Way', 'Arrived', 'In Progress', 'Completed'];
      const currentStep = this.getCrewStepIndex(crewStatus.status);

      container.innerHTML = `
        <div class="space-y-6">
          <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Crew Status</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">Booking: ${currentBooking.id}</p>
              </div>
              <span class="status-badge ${this.getStatusClass(crewStatus.status)}">${crewStatus.status}</span>
            </div>

            <div class="space-y-0">
              ${statusSteps.map((step, index) => {
                const isCompleted = index < currentStep;
                const isCurrent = index === currentStep;
                const dotClass = isCompleted ? 'completed' : isCurrent ? 'current' : '';
                const lineClass = isCompleted ? 'completed' : '';

                return `
                  <div class="flex items-start gap-4 relative">
                    ${index < statusSteps.length - 1 ? `<div class="timeline-line ${lineClass}"></div>` : ''}
                    <div class="timeline-dot ${dotClass}">
                      ${isCompleted
                        ? '<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>'
                        : `<span class="text-xs font-bold">${index + 1}</span>`
                      }
                    </div>
                    <div class="pb-8 pt-1">
                      <p class="font-medium ${isCurrent ? 'text-primary-600 dark:text-primary-400' : isCompleted ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}">${step}</p>
                      ${isCurrent && crewStatus.expectedArrival ? `<p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Expected: ${crewStatus.expectedArrival}</p>` : ''}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Assigned Crew</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              ${crewStatus.members.map(member => `
                <div class="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <div class="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900 dark:text-white">${member.name}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">${member.role} - ${member.experience}</p>
                  </div>
                </div>
              `).join('')}
            </div>
            <p class="mt-4 text-xs text-gray-400 dark:text-gray-500">Crew arrival status is simulated demo data for demonstration purposes.</p>
          </div>
        </div>
      `;
    },

    initPayments() {
      const container = document.getElementById('payments-list');
      if (!container) return;

      const storedPayments = window.MoveMateUtils.getStoredData('movemate_payments', []);
      const storedBookings = window.MoveMateUtils.getStoredData('movemate_bookings', []);
      const payments = storedPayments.length ? storedPayments : (storedBookings.length ? [] : [DEMO_PAYMENT]);
      const paidPayments = payments.filter(payment => ['completed', 'paid'].includes(String(payment.status).toLowerCase()));
      const paidTotal = paidPayments.reduce((total, payment) => total + (Number(payment.amount) || 0), 0);
      const outstandingTotal = payments.filter(payment => ['pending', 'unpaid'].includes(String(payment.status).toLowerCase())).reduce((total, payment) => total + (Number(payment.amount) || 0), 0);
      const trackedTotal = payments.reduce((total, payment) => total + (Number(payment.amount) || 0), 0);
      const paidPercentage = trackedTotal ? Math.round((paidTotal / trackedTotal) * 100) : 0;
      const averageTransaction = payments.length ? trackedTotal / payments.length : 0;

      if (payments.length === 0) {
        container.innerHTML = `
          <div class="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
            <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">No Payments Yet</h3>
            <p class="mt-2 text-gray-500 dark:text-gray-400">Payment history will appear here after your first booking.</p>
          </div>
        `;
        return;
      }

      container.innerHTML = `
        <div class="space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <article class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm"><p class="text-sm text-gray-500 dark:text-gray-400">Payments received</p><p class="mt-2 text-2xl font-bold text-primary-600 dark:text-primary-400">${window.MoveMateUtils.formatCurrency(paidTotal)}</p><p class="mt-1 text-xs text-gray-500 dark:text-gray-400">${paidPayments.length} completed transaction${paidPayments.length === 1 ? '' : 's'}</p></article>
          <article class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm"><p class="text-sm text-gray-500 dark:text-gray-400">Outstanding</p><p class="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">${window.MoveMateUtils.formatCurrency(outstandingTotal)}</p><p class="mt-1 text-xs text-gray-500 dark:text-gray-400">${payments.length - paidPayments.length} open transaction${payments.length - paidPayments.length === 1 ? '' : 's'}</p></article>
          <article class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm"><p class="text-sm text-gray-500 dark:text-gray-400">Total transactions</p><p class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">${payments.length}</p><p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Receipts and payment records</p></article>
        </div>
        <section class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 sm:p-6 shadow-sm">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div><h2 class="font-semibold text-gray-900 dark:text-white">Collection health</h2><p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Paid versus outstanding across recorded transactions.</p></div>
            <span class="rounded-full bg-primary-50 dark:bg-primary-900/30 px-3 py-1 text-sm font-semibold text-primary-700 dark:text-primary-300">${paidPercentage}% collected</span>
          </div>
          <div class="mt-5 h-3 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700" role="progressbar" aria-label="Percentage of recorded payments collected" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${paidPercentage}">
            <div class="h-full rounded-full bg-primary-600 transition-all" style="width: ${paidPercentage}%"></div>
          </div>
          <div class="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div><p class="text-gray-500 dark:text-gray-400">Collected</p><p class="mt-1 font-semibold text-gray-900 dark:text-white">${window.MoveMateUtils.formatCurrency(paidTotal)}</p></div>
            <div><p class="text-gray-500 dark:text-gray-400">Outstanding</p><p class="mt-1 font-semibold text-gray-900 dark:text-white">${window.MoveMateUtils.formatCurrency(outstandingTotal)}</p></div>
            <div><p class="text-gray-500 dark:text-gray-400">Average transaction</p><p class="mt-1 font-semibold text-gray-900 dark:text-white">${window.MoveMateUtils.formatCurrency(averageTransaction)}</p></div>
          </div>
        </section>
        <div class="overflow-x-auto">
          <table class="w-full responsive-table">
            <thead>
              <tr class="border-b border-gray-200 dark:border-gray-700">
                <th class="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Payment Ref</th>
                <th class="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Booking Ref</th>
                <th class="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Date</th>
                <th class="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Service</th>
                <th class="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Amount</th>
                <th class="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Status</th>
                <th class="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Receipt</th>
              </tr>
            </thead>
            <tbody>
              ${payments.map(payment => `
                <tr class="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td data-label="Payment Ref" class="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">${payment.id}</td>
                  <td data-label="Booking Ref" class="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">${payment.bookingId}</td>
                  <td data-label="Date" class="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">${window.MoveMateUtils.formatDate(payment.date)}</td>
                  <td data-label="Service" class="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">${payment.service}</td>
                  <td data-label="Amount" class="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">${window.MoveMateUtils.formatCurrency(payment.amount)}</td>
                  <td data-label="Status" class="py-3 px-4"><span class="status-badge payment-${payment.status.toLowerCase()}">${payment.status}</span></td>
                  <td data-label="Receipt" class="py-3 px-4">
                    <button onclick="window.MoveMateDashboard.downloadReceipt('${payment.id}')" class="text-primary-600 dark:text-primary-400 hover:underline text-sm font-medium">Download</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        </div>
      `;
    },

    initProfile() {
      const container = document.getElementById('profile-content');
      if (!container) return;

      const user = window.MoveMateAuth.getCurrentUser() || {
        fullName: document.body.dataset.dashboardRole === 'admin' ? 'MoveMate Admin' : 'Demo User',
        email: document.body.dataset.dashboardRole === 'admin' ? 'admin@movemate.in' : 'demo@movemate.in',
        mobile: '—',
        area: '—',
        address: '—',
        pincode: '—'
      };

      container.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Profile Information</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Full Name</label>
              <p class="text-gray-900 dark:text-white font-medium">${user.fullName}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Email</label>
              <p class="text-gray-900 dark:text-white font-medium">${user.email}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Mobile</label>
              <p class="text-gray-900 dark:text-white font-medium">${user.mobile}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Area</label>
              <p class="text-gray-900 dark:text-white font-medium">${user.area}</p>
            </div>
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Address</label>
              <p class="text-gray-900 dark:text-white font-medium">${user.address}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Pincode</label>
              <p class="text-gray-900 dark:text-white font-medium">${user.pincode}</p>
            </div>
          </div>
        </div>
      `;
    },

    initNotifications() {
      const container = document.getElementById('notifications-list');
      if (!container) return;

      const storedNotifications = window.MoveMateUtils.getStoredData('movemate_notifications', []);
      const storedBookings = window.MoveMateUtils.getStoredData('movemate_bookings', []);
      const notifications = storedNotifications.length ? storedNotifications : (storedBookings.length ? [] : DEMO_NOTIFICATIONS);

      if (notifications.length === 0) {
        container.innerHTML = `
          <div class="space-y-6">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <article class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm"><p class="text-sm text-gray-500 dark:text-gray-400">Total alerts</p><p class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">0</p><p class="mt-1 text-xs text-gray-500 dark:text-gray-400">No recent activity</p></article>
              <article class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm"><p class="text-sm text-gray-500 dark:text-gray-400">Unread</p><p class="mt-2 text-2xl font-bold text-primary-600 dark:text-primary-400">0</p><p class="mt-1 text-xs text-gray-500 dark:text-gray-400">You’re all caught up</p></article>
              <article class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm"><p class="text-sm text-gray-500 dark:text-gray-400">Workspace status</p><p class="mt-2 text-lg font-bold text-emerald-600 dark:text-emerald-400">All clear</p><p class="mt-1 text-xs text-gray-500 dark:text-gray-400">No updates require attention</p></article>
            </div>
            <section class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-10 text-center shadow-sm">
              <span class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 dark:bg-primary-900/30"><svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg></span>
              <h2 class="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No new alerts</h2>
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Booking and operations updates will appear here when there’s activity.</p>
            </section>
          </div>
        `;
        return;
      }

      const unreadAlerts = notifications.filter(notif => !notif.read).length;
      const bookingAlerts = notifications.filter(notif => /booking|crew/i.test(notif.message)).length;
      container.innerHTML = `
        <div class="space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <article class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm"><p class="text-sm text-gray-500 dark:text-gray-400">Total alerts</p><p class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">${notifications.length}</p><p class="mt-1 text-xs text-gray-500 dark:text-gray-400">All recent activity</p></article>
            <article class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm"><p class="text-sm text-gray-500 dark:text-gray-400">Unread</p><p class="mt-2 text-2xl font-bold text-primary-600 dark:text-primary-400">${unreadAlerts}</p><p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Updates to review</p></article>
            <article class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm"><p class="text-sm text-gray-500 dark:text-gray-400">Booking updates</p><p class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">${bookingAlerts}</p><p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Booking and crew activity</p></article>
          </div>
          <section class="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
            <div class="border-b border-gray-100 dark:border-gray-700 px-5 py-4 sm:px-6"><h2 class="font-semibold text-gray-900 dark:text-white">Recent activity</h2><p class="mt-1 text-sm text-gray-500 dark:text-gray-400">The latest notices from your operations workspace.</p></div>
            <div class="divide-y divide-gray-100 dark:divide-gray-700">
              ${notifications.map(notif => `
                <div class="flex items-start gap-3 p-4 sm:px-6 ${notif.read ? '' : 'bg-primary-50/70 dark:bg-primary-900/10'}">
                  <div class="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${notif.type === 'success' ? 'bg-primary-100 dark:bg-primary-900/30' : notif.type === 'warning' ? 'bg-accent-100 dark:bg-accent-900/30' : 'bg-primary-100 dark:bg-primary-900/30'}">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 ${notif.type === 'success' ? 'text-primary-600 dark:text-primary-400' : notif.type === 'warning' ? 'text-accent-700 dark:text-accent-400' : 'text-primary-600 dark:text-primary-400'}" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                  </div>
                  <div class="flex-1 min-w-0"><p class="text-sm text-gray-900 dark:text-white">${notif.message}</p><p class="text-xs text-gray-500 dark:text-gray-400 mt-1">${new Date(notif.timestamp).toLocaleString()}</p></div>
                  ${!notif.read ? '<span class="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary-600" aria-label="Unread"></span>' : ''}
                </div>`).join('')}
            </div>
          </section>
        </div>
      `;
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

    assignCrew(bookingId) {
      const bookings = window.MoveMateUtils.getStoredData('movemate_bookings', []);
      const booking = bookings.find(b => b.id === bookingId);
      if (!booking) return;

      const numWorkers = booking.workers;
      const shuffled = [...CREW_MEMBERS].sort(() => 0.5 - Math.random());
      const selectedCrew = shuffled.slice(0, Math.min(numWorkers, shuffled.length));

      const crewStatus = {
        bookingId,
        status: 'Crew Assigned',
        crewName: selectedCrew[0].name,
        workerCount: numWorkers,
        members: selectedCrew,
        expectedArrival: booking.time,
        assignedAt: new Date().toISOString()
      };

      window.MoveMateUtils.setStoredData('movemate_crew_status', crewStatus);

      booking.status = 'Crew Assigned';
      booking.crew = crewStatus;
      window.MoveMateUtils.setStoredData('movemate_bookings', bookings);
      window.MoveMateUtils.setStoredData('movemate_current_booking', booking);

      this.addNotification(`Crew assigned for booking ${bookingId}. ${selectedCrew[0].name} will lead the team.`, 'success');
    },

    simulateCrewArrival(bookingId) {
      const crewStatus = window.MoveMateUtils.getStoredData('movemate_crew_status');
      if (!crewStatus || crewStatus.bookingId !== bookingId) return;

      crewStatus.status = 'On the Way';
      window.MoveMateUtils.setStoredData('movemate_crew_status', crewStatus);

      const bookings = window.MoveMateUtils.getStoredData('movemate_bookings', []);
      const booking = bookings.find(b => b.id === bookingId);
      if (booking) {
        booking.status = 'On the Way';
        window.MoveMateUtils.setStoredData('movemate_bookings', bookings);
        window.MoveMateUtils.setStoredData('movemate_current_booking', booking);
      }

      this.addNotification(`Crew is on the way for booking ${bookingId}.`, 'info');
    },

    completeBooking(bookingId) {
      const bookings = window.MoveMateUtils.getStoredData('movemate_bookings', []);
      const booking = bookings.find(b => b.id === bookingId);
      if (!booking) return;

      booking.status = 'Completed';
      window.MoveMateUtils.setStoredData('movemate_bookings', bookings);
      window.MoveMateUtils.setStoredData('movemate_current_booking', booking);

      const payment = {
        id: window.MoveMateUtils.generateId('PAY'),
        bookingId,
        date: new Date().toISOString().split('T')[0],
        service: booking.serviceName,
        amount: booking.estimate.total,
        status: 'Paid',
        method: 'Card',
        timestamp: new Date().toISOString()
      };

      const payments = window.MoveMateUtils.getStoredData('movemate_payments', []);
      payments.unshift(payment);
      window.MoveMateUtils.setStoredData('movemate_payments', payments);

      this.addNotification(`Booking ${bookingId} completed successfully!`, 'success');
      this.addNotification(`Payment of ${window.MoveMateUtils.formatCurrency(payment.amount)} confirmed.`, 'success');
    },

    downloadReceipt(paymentId) {
      const payments = window.MoveMateUtils.getStoredData('movemate_payments', []);
      const payment = payments.find(p => p.id === paymentId);
      if (!payment) return;

      const receipt = `
===================================
        MoveMate - Payment Receipt
===================================
Payment ID:    ${payment.id}
Booking ID:    ${payment.bookingId}
Date:          ${window.MoveMateUtils.formatDate(payment.date)}
Service:       ${payment.service}
Amount:        ${window.MoveMateUtils.formatCurrency(payment.amount)}
Status:        ${payment.status}
Method:        ${payment.method}
===================================
Thank you for choosing MoveMate!
===================================
      `.trim();

      const blob = new Blob([receipt], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `MoveMate-Receipt-${payment.id}.txt`;
      a.click();
      URL.revokeObjectURL(url);

      window.MoveMateToast.success('Receipt downloaded successfully.');
    },

    getStatusClass(status) {
      const map = {
        'Pending': 'status-pending',
        'Confirmed': 'status-confirmed',
        'Crew Assigned': 'status-crew-assigned',
        'On the Way': 'status-on-the-way',
        'Arrived': 'status-arrived',
        'In Progress': 'status-in-progress',
        'Completed': 'status-completed',
        'Cancelled': 'status-cancelled'
      };
      return map[status] || 'status-pending';
    },

    getCrewStepIndex(status) {
      const map = {
        'Pending': 0,
        'Confirmed': 0,
        'Crew Assigned': 1,
        'On the Way': 2,
        'Arrived': 3,
        'In Progress': 4,
        'Completed': 5,
        'Cancelled': 0
      };
      return map[status] || 0;
    },

    getServiceDisplayName(serviceId) {
      const names = {
        'hourly-labor': 'Hourly Moving Labor',
        'loading-help': 'Loading Help',
        'unloading-help': 'Unloading Help',
        'furniture-moving': 'Furniture Moving',
        'heavy-lifting': 'Heavy Lifting',
        'moving-assistance': 'Moving Assistance'
      };
      return names[serviceId] || serviceId;
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    MoveMateDashboard.init();
  });

  window.MoveMateDashboard = MoveMateDashboard;

})();
