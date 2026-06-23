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