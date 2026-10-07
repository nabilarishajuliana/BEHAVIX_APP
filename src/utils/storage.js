// Helper baca/tulis localStorage — otomatis JSON + aman dari error.
export const storage = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  remove(key) {
    try { localStorage.removeItem(key); } catch { /* empty */ }
  },
  clearAll() {
    try { localStorage.clear(); } catch { /* empty */ }
  },
};

// Nama key yang dipakai (biar konsisten, nggak typo)
export const KEYS = {
  user: "behavix_user",       // { username }
  checkins: "behavix_checkins", // array check-in
  journal: "behavix_journal",   // array jurnal
  quests: "behavix_quests",     // { id: { doneCount } }
  theme: "behavix_theme",
};