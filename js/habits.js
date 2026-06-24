const HABIT_DEFINITIONS = [
  { id: 'exercise', label: 'Exercise', icon: '●' },
  { id: 'sleep', label: 'Sleep 7+ hrs', icon: '●' },
  { id: 'deep-work', label: 'Deep work blocks hit', icon: '●' },
  { id: 'no-late-work', label: 'Stopped work by 7pm', icon: '●' },
  { id: 'learning', label: 'Learning session done', icon: '●' }
];

let habitsState = {};

function todayKey() {
  return new Date().toISOString().split('T')[0];
}

function loadHabits() {
  habitsState = loadData('habits', {});
}

function persistHabits() {
  saveData('habits', habitsState);
}

function toggleHabitToday(habitId) {
  const date = todayKey();
  if (!habitsState[date]) {
    habitsState[date] = {};
  }
  habitsState[date][habitId] = !habitsState[date][habitId];
  persistHabits();
  renderHabits();
}

function isHabitDoneOn(habitId, dateStr) {
  return !!(habitsState[dateStr] && habitsState[dateStr][habitId]);
}

function calculateStreak(habitId) {
  let streak = 0;
  let cursor = new Date();

  while (true) {
    const dateStr = cursor.toISOString().split('T')[0];
    if (isHabitDoneOn(habitId, dateStr)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

function buildHabitCard(habit) {
  const card = document.createElement('div');
  card.className = 'glass-card habit-card';

  const doneToday = isHabitDoneOn(habit.id, todayKey());
  const streak = calculateStreak(habit.id);

  const header = document.createElement('div');
  header.className = 'habit-card__header';

  const label = document.createElement('span');
  label.className = 'habit-card__label';
  label.textContent = habit.label;

  header.appendChild(label);

  const toggle = document.createElement('button');
  toggle.className = `habit-card__toggle${doneToday ? ' is-done' : ''}`;
  toggle.setAttribute('aria-label', doneToday ? `Mark ${habit.label} not done today` : `Mark ${habit.label} done today`);
  toggle.textContent = doneToday ? '✓' : '';
  toggle.addEventListener('click', () => toggleHabitToday(habit.id));

  const streakRow = document.createElement('div');
  streakRow.className = 'habit-card__streak';
  streakRow.innerHTML = `<span class="streak-number">${streak}</span><span class="streak-label">day streak</span>`;

  card.appendChild(header);
  card.appendChild(toggle);
  card.appendChild(streakRow);

  return card;
}

function renderHabits() {
  const tracker = document.getElementById('habit-tracker');
  if (!tracker) return;

  tracker.innerHTML = '';
  HABIT_DEFINITIONS.forEach((habit) => {
    tracker.appendChild(buildHabitCard(habit));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadHabits();
  renderHabits();
});