import { useState } from "react";
import { storage, KEYS } from "../utils/storage";

export default function JournalWriteScreen({ goBack }) {
  const [teks, setTeks] = useState("");

  function simpan() {
    if (!teks.trim()) return;
    const entries = storage.get(KEYS.journal, []);
    storage.set(KEYS.journal, [
      ...entries,
      { id: "j_" + Date.now(), waktu: new Date().toISOString(), teks: teks.trim() },
    ]);
    goBack();
  }

  return (
    <div className="min-h-screen bg-canvas font-sans p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <button onClick={goBack} className="w-9 h-9 rounded-lg border border-gray-300">‹</button>
        <button onClick={simpan} className="text-brand font-bold text-sm">Simpan</button>
      </div>
      <p className="text-sm text-gray-400 mb-3">Apa yang lagi kamu pikirin?</p>
      <textarea
        value={teks}
        onChange={(e) => setTeks(e.target.value)}
        autoFocus
        placeholder="Tulis apa aja di sini..."
        className="flex-1 w-full resize-none outline-none bg-transparent text-ink text-base leading-relaxed"
      />
    </div>
  );
}