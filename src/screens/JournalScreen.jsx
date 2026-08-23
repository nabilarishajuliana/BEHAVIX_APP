import { storage, KEYS } from "../utils/storage";

export default function JournalScreen({ navigate }) {
  const entries = storage.get(KEYS.journal, []);

  return (
    <div className="min-h-screen bg-canvas font-sans p-5 pb-24">
      <h1 className="text-2xl font-extrabold text-ink mb-1">Jurnal 📓</h1>
      <p className="text-sm text-gray-500 mb-4">
        Ruang aman buat nuangin apa pun yang kamu rasa.
      </p>

      <div className="bg-brand/10 rounded-xl p-3 mb-4 text-xs text-brand font-medium">
        🔒 Cuma kamu yang baca ini — nggak dikirim ke AI.
      </div>

      <button
        onClick={() => navigate("jurnaltulis")}
        className="w-full bg-accent text-white rounded-2xl py-3.5 font-bold mb-5"
      >
        + Tulis baru
      </button>

      {entries.length === 0 ? (
        <p className="text-center text-sm text-gray-400 mt-10">
          Belum ada catatan. Yuk tulis yang pertama 🌱
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {[...entries].reverse().map((e) => (
            <div key={e.id} className="bg-white rounded-2xl p-4 shadow-sm">
              <p className="text-xs text-gray-400 mb-1">
                {new Date(e.waktu).toLocaleString("id-ID", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-sm text-ink whitespace-pre-wrap">{e.teks}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}