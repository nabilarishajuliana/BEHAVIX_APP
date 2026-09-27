import { useState, useEffect } from "react";
import BreathingTimer from "../components/BreathingTimer";
import { storage, KEYS } from "../utils/storage";

// Parse "5 menit" → 300 detik, "10-15 menit" → 600, "bebas" → 300 (default)
function parseDurasi(str) {
  if (!str) return 300;
  const match = str.match(/(\d+)/);
  if (!match) return 300;
  return parseInt(match[1]) * 60;
}

// Komponen timer sederhana (bukan napas 4-7-8) — buat aktivitas tipe "timer"
function SimpleTimer({ duration, onDone }) {
  const [remaining, setRemaining] = useState(duration);

  useEffect(() => {
    if (remaining <= 0) {
      onDone?.();
      return;
    }
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining, onDone]);

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const percent = ((duration - remaining) / duration) * 100;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="w-48 h-48 rounded-full bg-brand/10 flex items-center justify-center relative">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#4FB3A6" strokeOpacity="0.15" strokeWidth="6" />
          <circle
            cx="50" cy="50" r="45" fill="none"
            stroke="#4FB3A6" strokeWidth="6"
            strokeDasharray={`${percent * 2.83} 283`}
            strokeLinecap="round"
          />
        </svg>
        <div className="text-4xl font-extrabold text-brand relative">{mm}:{ss}</div>
      </div>
      <p className="text-sm text-gray-500">Santai aja, kamu lagi ngasih waktu buat diri sendiri 🌱</p>
    </div>
  );
}

export default function ActivityScreen({ params, navigate, goBack }) {
  const { saran } = params;
  const tool = saran.tool || "teks";
  const [done, setDone] = useState(false);

  function finish() {
    // catat "pernah dicoba"
    const q = storage.get(KEYS.quests, {});
    const prev = q[saran.id]?.doneCount || 0;
    storage.set(KEYS.quests, { ...q, [saran.id]: { doneCount: prev + 1 } });
    // setelah selesai, ke halaman History
    navigate("history");
  }

  // Kalau tipe = jurnal, redirect ke JournalWrite dengan flag "dari quest"
  useEffect(() => {
    if (tool === "jurnal") {
      // catat "pernah dicoba" dulu
      const q = storage.get(KEYS.quests, {});
      const prev = q[saran.id]?.doneCount || 0;
      storage.set(KEYS.quests, { ...q, [saran.id]: { doneCount: prev + 1 } });
      // redirect ke JournalWrite, kasih tau bahwa ini dari quest
      navigate("jurnaltulis", { fromQuest: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (tool === "jurnal") return null;

  // ==========================================
  // TIPE 1: NAPAS (BreathingTimer 4-7-8, dark bg)
  // ==========================================
  if (tool === "napas") {
    return (
      <div className="min-h-screen bg-deep font-sans p-6 flex flex-col">
        <button
          onClick={goBack}
          className="w-9 h-9 rounded-full border border-white/40 text-white self-start"
        >‹</button>

        <h1 className="text-white text-xl font-bold text-center mt-6 mb-1">
          {saran.label} 🌊
        </h1>
        <p className="text-white/60 text-sm text-center mb-10">
          Nggak usah mikir apa-apa. Cukup ikutin lingkarannya.
        </p>

        <div className="flex-1 flex items-center justify-center">
          <BreathingTimer duration={parseDurasi(saran.durasi)} onDone={() => setDone(true)} />
        </div>

        <p className="text-white/70 text-sm text-center mb-4">
          Dorongan ini kayak ombak — dia bakal naik, terus surut sendiri.
        </p>

        <button
          onClick={finish}
          className="w-full rounded-xl py-3.5 font-semibold text-white bg-accent"
        >
          {done ? "Selesai 🌱" : "Selesai lebih awal"}
        </button>
      </div>
    );
  }

  // ==========================================
  // TIPE 2: TIMER (musik/jalan kaki, light bg)
  // ==========================================
  if (tool === "timer") {
    return (
      <div className="min-h-screen bg-canvas font-sans p-6 flex flex-col">
        <button
          onClick={goBack}
          className="w-10 h-10 rounded-xl bg-white shadow-sm text-lg text-ink self-start mb-4"
        >‹</button>

        <div className="text-center mb-6">
          <span className="text-xs font-bold text-brand bg-brand/15 px-3 py-1 rounded-full">
            {saran.kategori}
          </span>
          <h1 className="text-2xl font-bold text-ink mt-3">{saran.label}</h1>
          <p className="text-sm text-gray-500 mt-1">Durasi: {saran.durasi}</p>
        </div>

        {/* pengantar dari data gudang saran, kalau ada */}
        {saran.pengantar && (
          <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
            <p className="text-sm text-ink leading-relaxed text-center">
              {saran.pengantar}
            </p>
          </div>
        )}

        <div className="flex-1 flex items-center justify-center">
          <SimpleTimer duration={parseDurasi(saran.durasi)} onDone={() => setDone(true)} />
        </div>

        <button
          onClick={finish}
          className="w-full rounded-xl py-3.5 font-semibold text-white bg-accent mt-6"
        >
          {done ? "Selesai 🌱" : "Selesai lebih awal"}
        </button>
      </div>
    );
  }

  // ==========================================
  // TIPE 3: TEKS (self-report, ada instruksi dari data)
  // ==========================================
  // Ambil instruksi dari data gudang saran. Kalau kosong, kasih default.
  const instruksi = (saran.instruksi && saran.instruksi.length > 0)
    ? saran.instruksi
    : [
        "Lakukan aktivitas ini pelan-pelan.",
        "Nggak ada yang buru-buru.",
        "Kapan pun kamu selesai, tap tombol di bawah.",
      ];

  return (
    <div className="min-h-screen bg-canvas font-sans p-6 flex flex-col">
      <button
        onClick={goBack}
        className="w-10 h-10 rounded-xl bg-white shadow-sm text-lg text-ink self-start mb-4"
      >‹</button>

      <div className="text-center mb-6">
        <span className="text-xs font-bold text-brand bg-brand/15 px-3 py-1 rounded-full">
          {saran.kategori}
        </span>
        <h1 className="text-2xl font-bold text-ink mt-3">{saran.label}</h1>
        <p className="text-sm text-gray-500 mt-1">Durasi: {saran.durasi}</p>
      </div>

      {/* langkah-langkah dari data gudang saran */}
      <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
        <p className="text-xs font-bold text-brand tracking-wide mb-3">LANGKAH-LANGKAH</p>
        <ol className="flex flex-col gap-3">
          {instruksi.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-brand text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="text-sm text-ink leading-relaxed">{step}</p>
            </li>
          ))}
        </ol>
      </div>

      <p className="text-xs text-gray-400 text-center mb-4">
        🌱 Nggak buru-buru. Kapan pun siap, tap tombol di bawah.
      </p>

      <div className="flex-1" />

      <button
        onClick={finish}
        className="w-full rounded-xl py-3.5 font-semibold text-white bg-accent"
      >
        Aku udah selesai
      </button>
    </div>
  );
}