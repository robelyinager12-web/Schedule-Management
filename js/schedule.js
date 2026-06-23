const CATEGORY_LABELS = {
  'deep-work': 'Deep Work',
  'coding': 'Coding',
  'learning': 'Learning',
  'meeting': 'Meeting',
  'personal': 'Personal'
};

function timeToMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

function formatTimeRange(start, end) {
  const fmt = (t) => {
    const [h, m] = t.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
  };
  return `${fmt(start)} – ${fmt(end)}`;
}

function getDayType() {
  const day = new Date().getDay();
  if (day === 0) return 'sunday';
  if (day === 6) return 'saturday';
  return 'weekday';
}

function buildScheduleBlock(block, isNow) {
  const li = document.createElement('li');
  li.className = `schedule-block glass-panel${isNow ? ' is-now' : ''}`;
  li.dataset.blockId = block.id;

  const durationMin = timeToMinutes(block.end) - timeToMinutes(block.start);
  const minHeight = Math.max(64, durationMin * 1.6);
  li.style.minHeight = `${minHeight}px`;

  if (isNow) {
    const marker = document.createElement('span');
    marker.className = 'now-marker';
    marker.setAttribute('aria-hidden', 'true');
    li.appendChild(marker);
  }

  const time = document.createElement('div');
  time.className = 'schedule-block__time';
  time.textContent = formatTimeRange(block.start, block.end);

  const label = document.createElement('div');
  label.className = 'schedule-block__label';
  label.textContent = block.label;

  const tag = document.createElement('span');
  tag.className = `schedule-block__tag tag--${block.category}`;
  tag.textContent = CATEGORY_LABELS[block.category] || block.category;

  li.appendChild(time);
  li.appendChild(label);
  li.appendChild(tag);

  return li;
}

async function renderSchedule() {
  const listEl = document.getElementById('schedule-list');
  if (!listEl) return;

  let config;
  try {
    const res = await fetch('data/schedule-config.json');
    config = await res.json();
  } catch (err) {
    listEl.innerHTML = '<li class="schedule-error">Could not load schedule-config.json</li>';
    console.error('schedule.js: failed to load config', err);
    return;
  }

  const dayType = getDayType();
  const blocks = config[dayType] || [];

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  listEl.innerHTML = '';

  if (blocks.length === 0) {
    listEl.innerHTML = '<li class="schedule-error">No blocks configured for this day.</li>';
    return;
  }

  blocks.forEach((block) => {
    const startMin = timeToMinutes(block.start);
    const endMin = timeToMinutes(block.end);
    const isNow = nowMinutes >= startMin && nowMinutes < endMin;
    listEl.appendChild(buildScheduleBlock(block, isNow));
  });
}

document.addEventListener('DOMContentLoaded', renderSchedule);
setInterval(renderSchedule, 60000);