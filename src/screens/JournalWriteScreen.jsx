import { useState } from "react";
import { storage, KEYS } from "../utils/storage";
import { getRandomPrompt } from "../data/journalPrompts";

export default function JournalWriteScreen({ params, navigate, goBack }) {
  const [teks, setTeks] = useState("");
  const [prompt, setPrompt] = useState(() => getRandomPrompt());
  const [pakaiPrompt, setPakaiPrompt] = useState(true);

  // Cek: apakah user masuk sini dari Quest? Atau dari tab Jurnal biasa?
  const fromQuest = params?.fromQuest === true;

  function handleBack() {
    if (fromQuest) {
      // Kalau dari quest → back ke halaman Quest
      navigate("quest");
    } else {
      // Kalau dari jurnal biasa → normal back
      goBack();
    }
  }

  function simpan() {
    if (!teks.trim()) return;
    const entries = storage.get(KEYS.journal, []);
    storage.set(KEYS.journal, [
      ...entries,
      {
        id: "j_" + Date.now(),
        waktu: new Date().toISOString(),
        teks: teks.trim(),
        prompt: pakaiPrompt ? prompt : null,
      },
    ]);

    // Setelah simpan: kalau dari quest → ke History (biar liat kontribusi), kalau bukan → back
    if (fromQuest) {
      navigate("history");
    } else {
      goBack();
    }
  }

  function gantiPrompt() {
    setPrompt(getRandomPrompt());
  }

  return (
    <div className="min-h-screen bg-canvas font-sans p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handleBack}
          className="w-9 h-9 rounded-lg border border-gray-300 flex items-center justify-center"
        >
          ‹
        </button>
        <button
          onClick={simpan}
          disabled={!teks.trim()}
          className={`text-sm font-bold ${teks.trim() ? "text-brand" : "text-gray-300"}`}
        >
          Simpan
        </button>
      </div>

      {/* Info kecil kalau dari quest */}
      {fromQuest && (
        <div className="bg-brand/10 rounded-xl p-3 mb-3 text-xs text-brand text-center">
          Kamu sedang menjalankan aktivitas <b>Tulis perasaan</b> dari Quest.
        </div>
      )}

      {/* Reflection Prompt card */}
      {pakaiPrompt ? (
        <div className="bg-brand/10 rounded-2xl p-4 mb-4">
          <div className="flex items-start justify-between gap-3 mb-2">
            <p className="text-xs font-bold text-brand tracking-wide">PERTANYAAN PEMANTIK</p>
            <button
              onClick={() => setPakaiPrompt(false)}
              className="text-xs text-gray-400"
            >
              ✕
            </button>
          </div>
          <p className="text-base font-semibold text-ink leading-relaxed mb-3">
            {prompt}
          </p>
          <button
            onClick={gantiPrompt}
            className="text-xs bg-white rounded-full px-3 py-1.5 font-bold text-brand"
          >
            Ganti pertanyaan
          </button>
        </div>
      ) : (
        <button
          onClick={() => setPakaiPrompt(true)}
          className="text-xs text-gray-400 mb-3 self-start"
        >
          Tampilkan pertanyaan pemantik
        </button>
      )}

      <textarea
        value={teks}
        onChange={(e) => setTeks(e.target.value)}
        autoFocus
        placeholder="Tulis apa aja di sini..."
        className="flex-1 w-full resize-none outline-none bg-transparent text-ink text-base leading-relaxed"
      />

      <p className="text-xs text-gray-400 text-center mt-4">
        Catatan ini hanya bisa dibaca olehmu.
      </p>
    </div>
  );
}