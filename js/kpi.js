function getWeeklyTaskStats() {
  const tasks = loadData('tasks', []);
  const total = tasks.length;
  const done = tasks.filter((t) => t.done).length;
  const rate = total === 0 ? 0 : Math.round((done / total) * 100);
  return { total, done, rate };
}

function getHabitStats() {
  const habits = loadData('habits', {});
  const dates = Object.keys(habits);
  const last7 = dates.filter((d) => {
    const diffDays = (new Date() - new Date(d)) / 86400000;
    return diffDays >= 0 && diffDays < 7;
  });

  let exerciseDays = 0;
  let sleepDays = 0;
  let deepWorkDays = 0;

  last7.forEach((date) => {
    if (habits[date].exercise) exerciseDays++;
    if (habits[date].sleep) sleepDays++;
    if (habits[date]['deep-work']) deepWorkDays++;
  });

  return { exerciseDays, sleepDays, deepWorkDays, windowDays: last7.length };
}

function getDeepWorkAdherence() {
  const habits = loadData('habits', {});
  const dates = Object.keys(habits);
  const last7 = dates.filter((d) => {
    const diffDays = (new Date() - new Date(d)) / 86400000;
    return diffDays >= 0 && diffDays < 7;
  });

  if (last7.length === 0) return 0;
  const hitDays = last7.filter((d) => habits[d]['deep-work']).length;
  return Math.round((hitDays / last7.length) * 100);
}

function buildKpiCard(label, value, sublabel, accent) {
  const card = document.createElement('div');
  card.className = 'glass-card kpi-card';
  if (accent) card.classList.add('kpi-card--accent');

  const valueEl = document.createElement('div');
  valueEl.className = 'kpi-card__value';
  valueEl.textContent = value;

  const labelEl = document.createElement('div');
  labelEl.className = 'kpi-card__label';
  labelEl.textContent = label;

  const subEl = document.createElement('div');
  subEl.className = 'kpi-card__sublabel';
  subEl.textContent = sublabel;

  card.appendChild(valueEl);
  card.appendChild(labelEl);
  card.appendChild(subEl);

  return card;
}

function renderKpis() {
  const dashboard = document.getElementById('kpi-dashboard');
  if (!dashboard) return;

  const taskStats = getWeeklyTaskStats();
  const habitStats = getHabitStats();
  const deepWorkAdherence = getDeepWorkAdherence();

  dashboard.innerHTML = '';

  dashboard.appendChild(
    buildKpiCard('Task completion', `${taskStats.rate}%`, `${taskStats.done} of ${taskStats.total} tasks`, taskStats.rate >= 70)
  );

  dashboard.appendChild(
    buildKpiCard('Deep work adherence', `${deepWorkAdherence}%`, 'last 7 days', deepWorkAdherence >= 80)
  );

  dashboard.appendChild(
    buildKpiCard('Exercise days', `${habitStats.exerciseDays}/${habitStats.windowDays || 7}`, 'last 7 days', habitStats.exerciseDays >= 5)
  );

  dashboard.appendChild(
    buildKpiCard('Sleep 7+ hrs', `${habitStats.sleepDays}/${habitStats.windowDays || 7}`, 'last 7 days', habitStats.sleepDays >= 5)
  );
}

document.addEventListener('DOMContentLoaded', renderKpis);

// Re-render when switching to the KPI tab, so it reflects the latest data
document.addEventListener('click', (e) => {
  if (e.target.dataset && e.target.dataset.target === 'view-kpi') {
    renderKpis();
  }
});