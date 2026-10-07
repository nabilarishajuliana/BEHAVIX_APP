import { storage, KEYS } from "../utils/storage";

export default function JournalScreen({ navigate }) {
  const entries = storage.get(KEYS.journal, []);

  return (
    <div className="min-h-screen bg-canvas font-sans p-5 pb-24">
      <h1 className="text-2xl font-extrabold text-ink mb-1">Jurnal</h1>
      <p className="text-sm text-gray-500 mb-4">
        Ruang aman buat nuangin apa pun yang kamu rasa.
      </p>

      <div className="bg-brand/10 rounded-xl p-3 mb-4 text-xs text-brand font-medium">
        Catatan ini hanya bisa dibaca olehmu dan tidak dikirim ke AI.
      </div>

      <button
        onClick={() => navigate("jurnaltulis")}
        className="w-full bg-accent text-white rounded-2xl py-3.5 font-bold mb-5"
      >
        + Tulis baru
      </button>

      {entries.length === 0 ? (
        <p className="text-center text-sm text-gray-400 mt-10">
          Belum ada catatan. Kamu bisa mulai menulis kapan saja.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {[...entries].reverse().map((e) => (
            <button
              key={e.id}
              onClick={() => navigate("jurnalDetail", { entry: e })}
              className="bg-white rounded-2xl p-4 shadow-sm text-left w-full hover:bg-gray-50 active:scale-98 transition"
            >
              <p className="text-xs text-gray-400 mb-1">
                {new Date(e.waktu).toLocaleString("id-ID", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-sm text-ink whitespace-pre-wrap line-clamp-3">
                {e.teks}
              </p>
              <p className="text-xs text-brand font-semibold mt-2">
                Baca selengkapnya →
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}