const CATEGORY_LABELS = {
  'deep-work': 'Deep Work',
  'coding': 'Coding',
  'learning': 'Learning',
  'meeting': 'Meeting',
  'personal': 'Personal'
};

const DAY_TABS = [
  { id: 'weekday', label: 'Weekday' },
  { id: 'saturday', label: 'Saturday' },
  { id: 'sunday', label: 'Sunday' }
];

let scheduleConfig = null;
let activeDayTab = null;

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

function getActualDayType() {
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

function buildDayTabs() {
  const tabRow = document.createElement('div');
  tabRow.className = 'day-tab-row';

  const actualDay = getActualDayType();

  DAY_TABS.forEach((tab) => {
    const btn = document.createElement('button');
    btn.className = `day-tab${tab.id === activeDayTab ? ' is-active' : ''}`;
    btn.textContent = tab.label;

    if (tab.id === actualDay) {
      const dot = document.createElement('span');
      dot.className = 'day-tab__today-dot';
      dot.setAttribute('aria-label', 'This is today');
      btn.appendChild(dot);
    }

    btn.addEventListener('click', () => {
      activeDayTab = tab.id;
      renderSchedule();
    });

    tabRow.appendChild(btn);
  });

  return tabRow;
}

function renderScheduleList() {
  const listEl = document.getElementById('schedule-list');
  if (!listEl || !scheduleConfig) return;

  const blocks = scheduleConfig[activeDayTab] || [];
  const actualDay = getActualDayType();
  const isViewingActualDay = activeDayTab === actualDay;

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
    const isNow = isViewingActualDay && nowMinutes >= startMin && nowMinutes < endMin;
    listEl.appendChild(buildScheduleBlock(block, isNow));
  });
}

function renderSchedule() {
  const todayView = document.getElementById('view-today');
  if (!todayView) return;

  let tabContainer = document.getElementById('day-tab-container');
  if (!tabContainer) {
    tabContainer = document.createElement('div');
    tabContainer.id = 'day-tab-container';
    const timelineWrap = document.querySelector('.timeline-wrap');
    todayView.insertBefore(tabContainer, timelineWrap);
  }

  tabContainer.innerHTML = '';
  tabContainer.appendChild(buildDayTabs());

  renderScheduleList();
}

async function initSchedule() {
  const listEl = document.getElementById('schedule-list');
  if (!listEl) return;

  try {
    const res = await fetch('data/schedule-config.json');
    scheduleConfig = await res.json();
  } catch (err) {
    listEl.innerHTML = '<li class="schedule-error">Could not load schedule-config.json</li>';
    console.error('schedule.js: failed to load config', err);
    return;
  }

  activeDayTab = getActualDayType();
  renderSchedule();
}

document.addEventListener('DOMContentLoaded', initSchedule);

setInterval(() => {
  if (scheduleConfig) renderScheduleList();
}, 60000);