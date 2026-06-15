export function readJsonStorage(key, fallback = null, storage = localStorage) {
  try {
    const raw = storage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJsonStorage(key, value, storage = localStorage) {
  storage.setItem(key, JSON.stringify(value));
}
