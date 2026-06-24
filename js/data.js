const STORAGE_PREFIX = 'engineerOS:';

function saveData(key, value) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error('data.js: failed to save', key, err);
    return false;
  }
}

function loadData(key, fallback) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error('data.js: failed to load', key, err);
    return fallback;
  }
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function exportAllData() {
  const exportPayload = {
    exportedAt: new Date().toISOString(),
    tasks: loadData('tasks', []),
    weekly: loadData('weekly', {}),
    habits: loadData('habits', {}),
    reviews: loadData('reviews', {})
  };

  const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `engineer-os-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();

  URL.revokeObjectURL(url);
}

function importAllData(file) {
  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target.result);

      if (parsed.tasks) saveData('tasks', parsed.tasks);
      if (parsed.weekly) saveData('weekly', parsed.weekly);
      if (parsed.habits) saveData('habits', parsed.habits);
      if (parsed.reviews) saveData('reviews', parsed.reviews);

      alert('Import successful. Reloading...');
      window.location.reload();
    } catch (err) {
      console.error('data.js: import failed', err);
      alert('Import failed: file was not valid Engineer OS backup JSON.');
    }
  };

  reader.readAsText(file);
}