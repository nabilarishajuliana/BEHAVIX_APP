import { useEffect, useState } from "react";
import { ArrowRight, Clock3, Lightbulb, X } from "lucide-react";
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
    <div className="mx-auto min-h-screen max-w-105 overflow-x-hidden bg-canvas px-5 pb-28 pt-6 font-sans">
      <header
        className={`mb-6 transition-all duration-500 ease-out ${
          mounted ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
      >
        <h1 className="text-2xl font-extrabold text-ink">{greeting()}</h1>
        <p className="mt-1 text-sm text-gray-500">
          Hai, <span className="font-semibold text-brand">{user.username}</span>
        </p>
      </header>

      {reminder && (
        <section
          className={`mb-4 rounded-2xl bg-white p-4 shadow-sm transition-all duration-500 ease-out ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          }`}
          style={{ transitionDelay: "100ms" }}
          aria-label="Pengingat harian"
        >
          <div className="flex items-start gap-3">
            <Clock3 className="mt-0.5 shrink-0 text-brand" size={18} aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Pengingat harian
                </p>
                <button
                  type="button"
                  onClick={handleDismissReminder}
                  className="-mr-2 -mt-2 flex min-h-11 min-w-11 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  aria-label="Tutup pengingat hari ini"
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-ink">{reminder.teks}</p>
              <button
                type="button"
                onClick={() => navigate("checkin")}
                className="mt-2 inline-flex min-h-11 items-center gap-1 rounded-xl px-2 text-sm font-semibold text-brand transition-colors hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                Mulai check-in <ArrowRight size={15} aria-hidden="true" />
              </button>
            </div>
          </div>
        </section>
      )}

      <section
        className={`mb-7 px-1 py-2 transition-all duration-500 ease-out ${
          mounted ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
        style={{ transitionDelay: "200ms" }}
        aria-label="Refleksi hari ini"
      >
        <div className="mb-1 flex items-center gap-2">
          <span className="text-3xl font-semibold leading-none text-brand/70" aria-hidden="true">
            “
          </span>
          <p className="text-xs font-semibold text-brand">Pengingat hari ini</p>
        </div>
        <blockquote className="-mt-1 pl-7 text-[17px] font-medium leading-7 text-ink">
          {quote.teks}
        </blockquote>
      </section>

      <section
        className={`mb-4 grid grid-cols-2 gap-3 transition-all duration-500 ease-out ${
          mounted ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
        style={{ transitionDelay: "300ms" }}
        aria-label="Ringkasan progres"
      >
        <button
          type="button"
          onClick={() => navigate("progres")}
          className="flex min-h-34 flex-col items-start justify-between rounded-2xl bg-brand p-4 text-left text-white transition duration-150 hover:bg-brand/95 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          aria-label={`Lihat progres, ${streak} hari check-in berturut-turut`}
        >
          <span className="text-[10px] font-semibold uppercase tracking-wide text-white/85">
            Streak saat ini
          </span>
          <span className="mt-2 text-4xl font-extrabold leading-none">{streak}</span>
          <span className="mt-1 text-xs text-white/90">hari berturut-turut</span>
          <span className="mt-2 text-[11px] text-white/80">Satu hari pada satu waktu.</span>
        </button>

        <button
          type="button"
          onClick={() => navigate("progres")}
          className="flex min-h-34 flex-col rounded-2xl bg-white p-4 text-left shadow-sm transition duration-150 hover:bg-gray-50 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          aria-label={`Lihat progres suasana hati tujuh hari${avgMood ? `, rata-rata ${avgMood} dari 5` : ""}`}
        >
          <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
            Mood 7 hari
          </span>
          <div className="mt-3 flex h-9 w-full items-end gap-1" aria-hidden="true">
            {(mood7.length > 0 ? mood7 : Array(7).fill(0)).map((value, index) => (
              <span
                key={index}
                className={`min-w-0 flex-1 rounded-t-sm ${value ? "bg-brand/55" : "bg-brand/10"}`}
                style={{ height: `${value ? Math.max(18, (value / 5) * 100) : 18}%` }}
              />
            ))}
          </div>
          <span className="mt-auto pt-2 text-xs text-gray-500">
            Rata-rata <strong className="font-semibold text-ink">{avgMood ? `${avgMood}/5` : "--"}</strong>
          </span>
        </button>
      </section>

      <section
        className={`mb-4 rounded-2xl bg-white p-5 shadow-sm transition-all duration-500 ease-out ${
          mounted ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
        style={{ transitionDelay: "400ms" }}
        aria-labelledby="checkin-title"
      >
        <h2 id="checkin-title" className="text-lg font-semibold text-ink">
          Bagaimana kabarmu hari ini?
        </h2>
        <p className="mt-1 mb-4 text-sm leading-relaxed text-gray-500">
          Luangkan sebentar untuk mengenali yang kamu rasakan.
        </p>
        <button
          type="button"
          onClick={() => navigate("checkin")}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 text-[15px] font-semibold text-white transition duration-150 hover:bg-accent/90 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          aria-label="Mulai check-in harian"
        >
          Mulai check-in <ArrowRight size={16} aria-hidden="true" />
        </button>
      </section>

      {nudge && (
        <section
          className={`mb-4 rounded-2xl bg-lav/15 p-4 transition-all duration-500 ease-out ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          }`}
          style={{ transitionDelay: "500ms" }}
          aria-label="Saran untuk saat ini"
        >
          <div className="flex items-start gap-3">
            <Lightbulb className="mt-0.5 shrink-0 text-brand" size={18} aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-ink">
                Satu hal untuk diperhatikan
              </p>
              <p className="mt-1 text-sm leading-relaxed text-gray-500">{nudge.teks}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => navigate("quest")}
                  className="inline-flex min-h-11 items-center gap-1 rounded-xl bg-white px-3 text-sm font-semibold text-brand transition-colors hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  Lihat aktivitas <ArrowRight size={14} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => navigate("urgesurfing")}
                  className="inline-flex min-h-11 items-center rounded-xl px-3 text-sm font-semibold text-ink transition-colors hover:bg-white/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  Coba urge surfing
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}