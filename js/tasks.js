const TASK_CATEGORIES = [
  { id: 'urgent', label: 'Urgent & Important', color: 'urgent' },
  { id: 'deep-work', label: 'Deep Work', color: 'deep-work' },
  { id: 'learning', label: 'Learning', color: 'learning' },
  { id: 'meetings', label: 'Meetings', color: 'meeting' },
  { id: 'personal', label: 'Personal', color: 'personal' }
];

let tasksState = [];

function loadTasks() {
  tasksState = loadData('tasks', []);
}

function persistTasks() {
  saveData('tasks', tasksState);
}

function addTask(categoryId, text) {
  if (!text || !text.trim()) return;
  tasksState.push({
    id: generateId(),
    category: categoryId,
    text: text.trim(),
    done: false
  });
  persistTasks();
  renderTasks();
}

function toggleTask(taskId) {
  const task = tasksState.find((t) => t.id === taskId);
  if (task) {
    task.done = !task.done;
    persistTasks();
    renderTasks();
  }
}

function deleteTask(taskId) {
  tasksState = tasksState.filter((t) => t.id !== taskId);
  persistTasks();
  renderTasks();
}

function buildTaskColumn(category) {
  const column = document.createElement('div');
  column.className = 'glass-card task-column';
  column.dataset.category = category.id;

  const header = document.createElement('div');
  header.className = 'task-column__header';

  const title = document.createElement('h3');
  title.className = `task-column__title tag--${category.color}`;
  title.textContent = category.label;

  const count = tasksState.filter((t) => t.category === category.id && !t.done).length;
  const countBadge = document.createElement('span');
  countBadge.className = 'task-column__count';
  countBadge.textContent = count;

  header.appendChild(title);
  header.appendChild(countBadge);

  const list = document.createElement('ul');
  list.className = 'task-list';

  tasksState
    .filter((t) => t.category === category.id)
    .forEach((task) => {
      const li = document.createElement('li');
      li.className = `task-item${task.done ? ' is-done' : ''}`;

      const checkbox = document.createElement('button');
      checkbox.className = 'task-item__checkbox';
      checkbox.setAttribute('aria-label', task.done ? 'Mark as not done' : 'Mark as done');
      checkbox.textContent = task.done ? '✓' : '';
      checkbox.addEventListener('click', () => toggleTask(task.id));

      const text = document.createElement('span');
      text.className = 'task-item__text';
      text.textContent = task.text;

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'task-item__delete';
      deleteBtn.setAttribute('aria-label', 'Delete task');
      deleteBtn.textContent = '×';
      deleteBtn.addEventListener('click', () => deleteTask(task.id));

      li.appendChild(checkbox);
      li.appendChild(text);
      li.appendChild(deleteBtn);
      list.appendChild(li);
    });

  const form = document.createElement('form');
  form.className = 'task-add-form';

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Add a task...';
  input.className = 'task-add-input';
  input.setAttribute('aria-label', `Add task to ${category.label}`);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    addTask(category.id, input.value);
    input.value = '';
    input.focus();
  });

  form.appendChild(input);

  column.appendChild(header);
  column.appendChild(list);
  column.appendChild(form);

  return column;
}

function renderTasks() {
  const board = document.getElementById('task-board');
  if (!board) return;

  board.innerHTML = '';
  TASK_CATEGORIES.forEach((category) => {
    board.appendChild(buildTaskColumn(category));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadTasks();
  renderTasks();
});