function startClock() {
  const clockEl = document.getElementById('live-clock');
  const dateEl = document.getElementById('live-date');

  function tick() {
    const now = new Date();

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    clockEl.textContent = `${hours}:${minutes}:${seconds}`;

    const dateOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    dateEl.textContent = now.toLocaleDateString('en-US', dateOptions);
  }

  tick();
  setInterval(tick, 1000);
}

function setupMobileMenu() {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const overlay = document.getElementById('mobile-menu-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  const desktopLinks = document.querySelectorAll('.nav-link');
  const views = document.querySelectorAll('.view');

  function openMenu() {
    mobileMenu.classList.add('is-open');
    overlay.classList.add('is-open');
    hamburgerBtn.classList.add('is-open');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    mobileMenu.classList.remove('is-open');
    overlay.classList.remove('is-open');
    hamburgerBtn.classList.remove('is-open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
  }

  function switchToView(targetId) {
    mobileLinks.forEach((l) => l.classList.toggle('is-active', l.dataset.target === targetId));
    desktopLinks.forEach((l) => l.classList.toggle('is-active', l.dataset.target === targetId));
    views.forEach((view) => view.classList.toggle('is-active', view.id === targetId));
  }

  hamburgerBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('is-open');
    if (isOpen) closeMenu(); else openMenu();
  });

  overlay.addEventListener('click', closeMenu);

  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      switchToView(link.dataset.target);
      closeMenu();
    });
  });

  desktopLinks.forEach((link) => {
    link.addEventListener('click', () => {
      switchToView(link.dataset.target);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

function setupTilt() {
  const tiltTargets = document.querySelectorAll('.glass-card, .schedule-block');

  tiltTargets.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -3;
      const rotateY = ((x - centerX) / centerX) * 3;

      el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}

function setupHabitBounce() {
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('habit-card__toggle')) {
      e.target.classList.remove('bounce');
      requestAnimationFrame(() => {
        e.target.classList.add('bounce');
      });
    }
  });
}

function setupBackupButtons() {
  const exportBtn = document.getElementById('export-btn');
  const importInput = document.getElementById('import-input');

  if (exportBtn) {
    exportBtn.addEventListener('click', exportAllData);
  }

  if (importInput) {
    importInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        importAllData(e.target.files[0]);
      }
    });
  }
}

function init() {
  startClock();
  setupMobileMenu();
  setupTilt();
  setupHabitBounce();
  setupBackupButtons();
  setupFooter();
  console.log('Engineer OS: app initialized');
}
document.addEventListener('DOMContentLoaded', init);
function setupFooter() {
  const yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  const footerLinks = document.querySelectorAll('.footer-link');
  const allNavLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const views = document.querySelectorAll('.view');

  footerLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const targetId = link.dataset.target;

      allNavLinks.forEach((l) => l.classList.toggle('is-active', l.dataset.target === targetId));
      views.forEach((view) => view.classList.toggle('is-active', view.id === targetId));

      const targetSection = document.getElementById(targetId);
      if (targetSection) targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}