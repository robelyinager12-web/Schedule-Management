// app.js — built fully in Phase 2 (clock + nav wiring)
console.log("Engineer OS: app.js loaded — Phase 1 scaffold active"); 
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

function setupNav() {
  const navLinks = document.querySelectorAll('.nav-link');
  const views = document.querySelectorAll('.view');

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const targetId = link.dataset.target;

      navLinks.forEach((l) => l.classList.remove('is-active'));
      link.classList.add('is-active');

      views.forEach((view) => {
        view.classList.toggle('is-active', view.id === targetId);
      });
    });
  });
}

function init() {
  startClock();
  setupNav();
  console.log('Engineer OS: Phase 2 active — clock and nav live');
}

document.addEventListener('DOMContentLoaded', init);
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

document.addEventListener('DOMContentLoaded', () => {
  setupTilt();
  setupHabitBounce();
});