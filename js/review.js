let reviewState = {};

function currentMonthKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function loadReviews() {
  reviewState = loadData('reviews', {});
}

function persistReview(monthKey, field, value) {
  if (!reviewState[monthKey]) {
    reviewState[monthKey] = {};
  }
  reviewState[monthKey][field] = value;
  saveData('reviews', reviewState);
}

const REVIEW_FIELDS = [
  { id: 'wins', label: 'Wins', placeholder: 'What shipped, what I learned, what improved...' },
  { id: 'misses', label: 'Misses', placeholder: 'What didn\'t happen, and the real reason why...' },
  { id: 'time-audit', label: 'Time audit', placeholder: 'Where did deep work actually happen vs. plan?' },
  { id: 'energy-audit', label: 'Energy audit', placeholder: 'Which days/blocks felt sustainable vs. draining?' },
  { id: 'career-progress', label: 'Career progress', placeholder: 'Side project status, DS&A topics covered, books finished...' },
  { id: 'burnout-check', label: 'Burnout check', placeholder: 'Average sleep, exercise consistency, full days off...' },
  { id: 'next-month', label: 'One change for next month', placeholder: 'The single process change to make...' }
];

function getMonthLabel(monthKey) {
  const [year, month] = monthKey.split('-');
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function buildMonthSelector(activeMonthKey) {
  const wrap = document.createElement('div');
  wrap.className = 'review-month-selector';

  const allMonths = Object.keys(reviewState);
  if (!allMonths.includes(currentMonthKey())) {
    allMonths.push(currentMonthKey());
  }
  allMonths.sort().reverse();

  allMonths.forEach((monthKey) => {
    const btn = document.createElement('button');
    btn.className = `review-month-btn${monthKey === activeMonthKey ? ' is-active' : ''}`;
    btn.textContent = getMonthLabel(monthKey);
    btn.addEventListener('click', () => renderReview(monthKey));
    wrap.appendChild(btn);
  });

  return wrap;
}

function renderReview(monthKey) {
  const container = document.getElementById('review-form');
  if (!container) return;

  const activeMonth = monthKey || currentMonthKey();
  const data = reviewState[activeMonth] || {};

  container.innerHTML = '';
  container.appendChild(buildMonthSelector(activeMonth));

  const card = document.createElement('div');
  card.className = 'glass-card review-card';

  const heading = document.createElement('h3');
  heading.className = 'review-card__heading';
  heading.textContent = getMonthLabel(activeMonth);
  card.appendChild(heading);

  REVIEW_FIELDS.forEach((field) => {
    const fieldWrap = document.createElement('div');
    fieldWrap.className = 'review-field';

    const label = document.createElement('label');
    label.className = 'review-field__label';
    label.textContent = field.label;
    label.setAttribute('for', `review-${field.id}-${activeMonth}`);

    const textarea = document.createElement('textarea');
    textarea.className = 'review-field__textarea';
    textarea.id = `review-${field.id}-${activeMonth}`;
    textarea.placeholder = field.placeholder;
    textarea.value = data[field.id] || '';
    textarea.addEventListener('change', (e) => {
      persistReview(activeMonth, field.id, e.target.value);
    });

    fieldWrap.appendChild(label);
    fieldWrap.appendChild(textarea);
    card.appendChild(fieldWrap);
  });

  container.appendChild(card);
}

document.addEventListener('DOMContentLoaded', () => {
  loadReviews();
  renderReview(currentMonthKey());
});