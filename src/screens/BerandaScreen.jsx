import { useEffect, useState } from "react";
import { storage, KEYS } from "../utils/storage";
import { cekNudgePreventif } from "../utils/nudge";
import { getQuoteHariIni } from "../data/quotes";
import { cekReminder, dismissReminderHariIni } from "../utils/reminderCheck";

function greeting() {
  const h = new Date().getHours();
  if (h < 11) return "Selamat pagi";
  if (h < 15) return "Selamat siang";
  if (h < 18) return "Selamat sore";
  return "Selamat malam";
}

const MOOD_SCORE = {
  buruk_banget: 1, kurang_oke: 2, biasa: 3, lumayan: 4, baik_banget: 5,
};

function computeStreak(checkins) {
  if (checkins.length === 0) return 0;
  const days = new Set(checkins.map((c) => c.waktu_iso.slice(0, 10)));
  let streak = 0;
  const d = new Date();
  while (days.has(d.toISOString().slice(0, 10))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export default function BerandaScreen({ navigate }) {
  const user = storage.get(KEYS.user, { username: "kamu" });
  const checkins = storage.get(KEYS.checkins, []);
  const nudge = cekNudgePreventif();
  const quote = getQuoteHariIni();
  const streak = computeStreak(checkins);

  // Reminder state
  const [reminder, setReminder] = useState(() => cekReminder());

  const mood7 = checkins.slice(-7).map((c) => MOOD_SCORE[c.mood] || 3);
  const avgMood = mood7.length > 0
    ? (mood7.reduce((s, v) => s + v, 0) / mood7.length).toFixed(1)
    : null;

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  function handleDismissReminder() {
    dismissReminderHariIni();
    setReminder(null);
  }

  return (
    <div className="min-h-screen bg-canvas font-sans p-5 pb-24 overflow-x-hidden">
      {/* subtle gradient background */}
      <div
        className="fixed top-0 left-0 right-0 h-64 pointer-events-none opacity-40 -z-10"
        style={{
          background: "radial-gradient(ellipse at top, rgba(79,179,166,0.15), transparent 70%)",
        }}
      />

      {/* Header */}
      <div
        className={`mb-5 transition-all duration-500 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
        }`}
      >
        <h1 className="text-2xl font-extrabold text-ink">{greeting()} 🌱</h1>
        <p className="text-sm text-gray-500 mt-1">
          Hai, <span className="font-bold text-brand">{user.username}</span> 👋
        </p>
      </div>

      {/* ==================== */}
      {/* KARTU REMINDER       */}
      {/* ==================== */}
      {reminder && (
        <div
          className={`bg-gradient-to-r from-accent/15 to-sunny/25 border border-accent/30 rounded-2xl p-4 mb-4 transition-all duration-500 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="text-2xl">⏰</div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-xs font-bold text-accent tracking-wide">
                  PENGINGAT KAMU
                </p>
                <button
                  onClick={handleDismissReminder}
                  className="text-gray-400 text-xs -mt-0.5"
                  aria-label="Tutup"
                >
                  ✕
                </button>
              </div>
              <p className="text-sm text-ink leading-relaxed mb-3">
                {reminder.teks}
              </p>
              <button
                onClick={() => navigate("checkin")}
                className="text-xs bg-accent text-white rounded-full px-4 py-2 font-bold"
              >
                Check-in sekarang →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== */}
      {/* QUOTE HARIAN         */}
      {/* ==================== */}
      <div
        className={`bg-gradient-to-br from-sunny/30 to-lav/20 rounded-2xl p-5 mb-4 transition-all duration-700 delay-100 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="text-3xl">{quote.emoji}</div>
          <div>
            <p className="text-xs font-bold text-brand tracking-wide mb-1">
              💭 UNTUK HARI INI
            </p>
            <p className="text-sm text-ink leading-relaxed italic">
              "{quote.teks}"
            </p>
          </div>
        </div>
      </div>

      {/* ==================== */}
      {/* MINI WIDGET PROGRES  */}
      {/* ==================== */}
      <div
        className={`grid grid-cols-2 gap-3 mb-4 transition-all duration-700 delay-200 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        }`}
      >
        <button
          onClick={() => navigate("progres")}
          className="bg-brand rounded-2xl p-4 text-white text-left active:scale-95 transition"
        >
          <p className="text-xs font-semibold opacity-90">STREAK</p>
          <p className="text-3xl font-extrabold mt-1">
            {streak} <span className="text-sm font-bold">hari</span>
          </p>
          <p className="text-xs opacity-90 mt-1">🌱 keep going</p>
        </button>

        <button
          onClick={() => navigate("progres")}
          className="bg-white rounded-2xl p-4 shadow-sm text-left active:scale-95 transition"
        >
          <p className="text-xs font-semibold text-gray-500">MOOD 7 HARI</p>
          {mood7.length === 0 ? (
            <p className="text-xs text-gray-400 mt-2">Belum ada data</p>
          ) : (
            <>
              <div className="flex items-end gap-1 h-8 mt-2">
                {mood7.map((v, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-brand/60 rounded-t"
                    style={{ height: `${(v / 5) * 100}%` }}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Rata-rata: <b className="text-brand">{avgMood}/5</b>
              </p>
            </>
          )}
        </button>
      </div>

      {/* ==================== */}
      {/* KARTU CHECK-IN       */}
      {/* ==================== */}
      <div
        className={`bg-white rounded-2xl p-5 shadow-sm mb-4 transition-all duration-700 delay-300 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        }`}
      >
        <h2 className="font-bold text-ink text-lg">Gimana kabarmu hari ini?</h2>
        <p className="text-sm text-gray-500 mb-4">
          Cuma butuh semenit buat cek-in sama diri sendiri.
        </p>
        <button
          onClick={() => navigate("checkin")}
          className="w-full bg-accent text-white rounded-xl py-3 font-semibold active:scale-95 transition"
        >
          Mulai check-in →
        </button>
      </div>

      {/* ==================== */}
      {/* NUDGE PREVENTIF      */}
      {/* ==================== */}
      {nudge && (
        <div
          className={`bg-lav/25 border border-lav rounded-2xl p-4 mb-4 transition-all duration-700 delay-400 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="text-2xl">🌙</div>
            <div className="flex-1">
              <p className="text-xs font-bold text-purple-700 tracking-wide mb-1">
                BUAT KAMU {nudge.level === "kuat" ? "SEKARANG" : "SAAT INI"}
              </p>
              <p className="text-sm text-ink leading-relaxed mb-3">{nudge.teks}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate("quest")}
                  className="text-xs bg-white rounded-full px-3 py-1.5 font-bold text-purple-700"
                >
                  Lihat Quest →
                </button>
                <button
                  onClick={() => navigate("urgesurfing")}
                  className="text-xs bg-purple-700 text-white rounded-full px-3 py-1.5 font-bold"
                >
                  Coba napas dulu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}