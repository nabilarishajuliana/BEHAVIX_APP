import { storage, KEYS } from "../utils/storage";

export default function JournalDetailScreen({ params, goBack }) {
  const { entry } = params;

  function hapus() {
    const ok = window.confirm("Hapus catatan ini? Nggak bisa dibalikin.");
    if (!ok) return;
    const entries = storage.get(KEYS.journal, []);
    storage.set(KEYS.journal, entries.filter((e) => e.id !== entry.id));
    goBack();
  }

  const tanggal = new Date(entry.waktu).toLocaleString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-canvas font-sans p-5 flex flex-col">
      {/* header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goBack}
          className="w-10 h-10 rounded-xl bg-white shadow-sm text-lg text-ink"
        >
          ‹
        </button>
        <button
          onClick={hapus}
          className="text-sm text-red-500 font-semibold"
        >
          Hapus
        </button>
      </div>

      {/* tanggal */}
      <p className="text-xs text-brand font-bold tracking-wide mb-1">
        {tanggal.toUpperCase()}
      </p>

      {/* prompt kalau ada */}
      {entry.prompt && (
        <div className="bg-brand/10 rounded-2xl p-3 mb-4">
          <p className="text-xs font-bold text-brand mb-1">PERTANYAAN PEMANTIK</p>
          <p className="text-sm text-ink italic">{entry.prompt}</p>
        </div>
      )}

      {/* isi jurnal */}
      <div className="bg-white rounded-2xl p-5 shadow-sm flex-1 mb-4">
        <p className="text-base text-ink whitespace-pre-wrap leading-relaxed">
          {entry.teks}
        </p>
      </div>

      {/* banner privasi */}
      <div className="bg-brand/10 rounded-xl p-3 text-xs text-brand font-medium text-center">
        Catatan ini hanya bisa dibaca olehmu.
      </div>
    </div>
  );
}