import { storage, KEYS } from "./storage";

// Cek apakah HARI INI reminder perlu ditampilin
export function cekReminder() {
  const user = storage.get(KEYS.user, {});
  const checkins = storage.get(KEYS.checkins, []);

  // 1. Apakah reminder aktif?
  if (!user.reminderOn || !user.reminderTime) return null;

  // 2. Apakah user udah dismiss reminder ini hari ini?
  const today = new Date().toISOString().slice(0, 10); // "2026-09-27"
  if (user.reminderDismissedAt === today) return null;

  // 3. Apakah jam sekarang udah lewat jam pengingat?
  const now = new Date();
  const [jam, menit] = user.reminderTime.split(":").map(Number);
  const jamSekarangMenit = now.getHours() * 60 + now.getMinutes();
  const jamReminderMenit = jam * 60 + menit;
  if (jamSekarangMenit < jamReminderMenit) return null;

  // 4. Apakah user udah check-in hari ini?
  const sudahCheckinHariIni = checkins.some((c) => {
    return c.waktu_iso && c.waktu_iso.slice(0, 10) === today;
  });
  if (sudahCheckinHariIni) return null;

  // Semua kondisi kepenuhi → tampilkan reminder
  return {
    jam: user.reminderTime,
    teks: `Kamu memasang pengingat check-in pukul ${user.reminderTime}. Luangkan waktu sejenak untuk check-in hari ini.`,
  };
}

// Dismiss reminder buat hari ini (biar nggak muncul lagi sampe besok)
export function dismissReminderHariIni() {
  const user = storage.get(KEYS.user, {});
  const today = new Date().toISOString().slice(0, 10);
  storage.set(KEYS.user, { ...user, reminderDismissedAt: today });
}