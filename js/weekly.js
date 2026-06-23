const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

let weeklyState = {
  outcomes: ['', '', ''],
  days: {}
};

function getCurrentWeekKey() {
  const now = new Date();
  const onejan = new Date(now.getFullYear(), 0, 1);
  const week = Math.ceil((((now - onejan) / 86400000) + onejan.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${week}`;
}

function loadWeekly() {
  const weekKey = getCurrentWeekKey();
  const allWeeks = loadData('weekly', {});
  weeklyState = allWeeks[weekKey] || { outcomes: ['', '', ''], days: {} };

  WEEKDAYS.forEach((day) => {
    if (!weeklyState.days[day]) {
      weeklyState.days[day] = [];
    }
  });
}

function persistWeekly() {
  const weekKey = getCurrentWeekKey();
  const allWeeks = loadData('weekly', {});
  allWeeks[weekKey] = weeklyState;
  saveData('weekly', allWeeks);
}

function updateOutcome(index, value) {
  weeklyState.outcomes[index] = value;
  persistWeekly();
}

function addDayItem(day, text) {
  if (!text || !text.trim()) return;
  weeklyState.days[day].push({ id: generateId(), text: text.trim(), done: false });
  persistWeekly();
  renderWeekly();
}

function toggleDayItem(day, itemId) {
  const item = weeklyState.days[day].find((i) => i.id === itemId);
  if (item) {
    item.done = !item.done;
    persistWeekly();
    renderWeekly();
  }
}

function deleteDayItem(day, itemId) {
  weeklyState.days[day] = weeklyState.days[day].filter((i) => i.id !== itemId);
  persistWeekly();
  renderWeekly();
}

function buildOutcomesBar() {
  const wrap = document.createElement('div');
  wrap.className = 'glass-card outcomes-bar';

  const heading = document.createElement('h3');
  heading.className = 'outcomes-bar__heading';
  heading.textContent = 'This week\'s 3 outcomes';
  wrap.appendChild(heading);

  const list = document.createElement('div');
  list.className = 'outcomes-bar__list';

  weeklyState.outcomes.forEach((value, index) => {
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'outcome-input';
    input.placeholder = `Outcome ${index + 1}`;
    input.value = value;
    input.addEventListener('change', (e) => updateOutcome(index, e.target.value));
    list.appendChild(input);
  });

  wrap.appendChild(list);
  return wrap;
}

function buildDayColumn(day) {
  const isToday = new Date().toLocaleDateString('en-US', { weekday: 'long' }) === day;

  const column = document.createElement('div');
  column.className = `glass-card day-column${isToday ? ' is-today' : ''}`;

  const heading = document.createElement('h3');
  heading.className = 'day-column__heading';
  heading.textContent = day;
  column.appendChild(heading);

  const list = document.createElement('ul');
  list.className = 'task-list';

  weeklyState.days[day].forEach((item) => {
    const li = document.createElement('li');
    li.className = `task-item${item.done ? ' is-done' : ''}`;

    const checkbox = document.createElement('button');
    checkbox.className = 'task-item__checkbox';
    checkbox.setAttribute('aria-label', item.done ? 'Mark as not done' : 'Mark as done');
    checkbox.textContent = item.done ? '✓' : '';
    checkbox.addEventListener('click', () => toggleDayItem(day, item.id));

    const text = document.createElement('span');
    text.className = 'task-item__text';
    text.textContent = item.text;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'task-item__delete';
    deleteBtn.setAttribute('aria-label', 'Delete item');
    deleteBtn.textContent = '×';
    deleteBtn.addEventListener('click', () => deleteDayItem(day, item.id));

    li.appendChild(checkbox);
    li.appendChild(text);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });

  column.appendChild(list);

  const form = document.createElement('form');
  form.className = 'task-add-form';

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'task-add-input';
  input.placeholder = 'Add...';
  input.setAttribute('aria-label', `Add item to ${day}`);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    addDayItem(day, input.value);
    input.value = '';
    input.focus();
  });

  form.appendChild(input);
  column.appendChild(form);

  return column;
}

function renderWeekly() {
  const grid = document.getElementById('weekly-grid');
  if (!grid) return;

  grid.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'weekly-wrapper';
  wrapper.appendChild(buildOutcomesBar());

  const daysGrid = document.createElement('div');
  daysGrid.className = 'days-grid';
  WEEKDAYS.forEach((day) => {
    daysGrid.appendChild(buildDayColumn(day));
  });
  wrapper.appendChild(daysGrid);

  grid.appendChild(wrapper);
}

document.addEventListener('DOMContentLoaded', () => {
  loadWeekly();
  renderWeekly();
});