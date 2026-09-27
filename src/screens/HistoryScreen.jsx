import { GUDANG_SARAN } from "../data/gudangSaran";
import { storage, KEYS } from "../utils/storage";

export default function HistoryScreen({ navigate }) {
  const quests = storage.get(KEYS.quests, {});
  const urgeSessions = storage.get("behavix_urge", []);
  const checkins = storage.get(KEYS.checkins, []);

  // Aktivitas paling sering dicoba (top 5)
  const topActivities = Object.entries(quests)
    .map(([id, data]) => {
      const info = GUDANG_SARAN.find((s) => s.id === id);
      return info ? { ...info, doneCount: data.doneCount || 0 } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.doneCount - a.doneCount)
    .slice(0, 5);

  const totalIntervensi = Object.values(quests).reduce(
    (sum, q) => sum + (q.doneCount || 0),
    0
  );

  // Statistik Urge Surfing (before/after)
  const urgeCount = urgeSessions.length;
  const avgAfter = urgeSessions.length
    ? (urgeSessions.reduce((s, u) => s + (u.after || 0), 0) / urgeSessions.length).toFixed(1)
    : null;

  const WARNA = {
    Tenang: "bg-brand/15 text-brand",
    Gerak: "bg-accent/15 text-accent",
    Kreatif: "bg-lav/25 text-purple-700",
    Sosial: "bg-sunny/30 text-yellow-700",
  };

  return (
    <div className="min-h-screen bg-canvas font-sans p-5 pb-10">
      <button
        onClick={() => navigate("quest")}
        className="w-10 h-10 rounded-xl bg-white shadow-sm text-lg text-ink mb-4"
      >
        ‹
      </button>

      <h1 className="text-2xl font-extrabold text-ink mb-1">Riwayat Intervensi</h1>
      <p className="text-sm text-gray-500 mb-5">
        Ringkasan strategi yang paling ampuh buat kamu.
      </p>

      {/* Empty state */}
      {totalIntervensi === 0 && urgeCount === 0 ? (
        <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
          <p className="text-4xl mb-3">🌱</p>
          <p className="text-ink font-semibold mb-1">Belum ada riwayat</p>
          <p className="text-sm text-gray-500">
            Coba salah satu Quest atau Urge Surfing dulu.
          </p>
        </div>
      ) : (
        <>
          {/* Statistik ringkas */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-brand rounded-2xl p-4 text-white">
              <p className="text-xs font-semibold opacity-90">TOTAL INTERVENSI</p>
              <p className="text-3xl font-extrabold mt-1">{totalIntervensi}</p>
              <p className="text-xs opacity-90">kali dijalankan</p>
            </div>
            <div className="bg-accent rounded-2xl p-4 text-white">
              <p className="text-xs font-semibold opacity-90">SESI SOS</p>
              <p className="text-3xl font-extrabold mt-1">{urgeCount}</p>
              <p className="text-xs opacity-90">Urge Surfing</p>
            </div>
          </div>

          {/* Statistik Urge Surfing */}
          {urgeCount > 0 && avgAfter && (
            <div className="bg-white rounded-2xl p-4 shadow-sm mb-5">
              <p className="font-bold text-ink mb-2">🌊 Efek Urge Surfing</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Rata-rata intensitas dorongan <b>setelah</b> sesi napas:{" "}
                <span className="text-brand font-bold text-lg">{avgAfter}/10</span>
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Latihan napas bantu kamu turunin intensitas dorongan 🌱
              </p>
            </div>
          )}

          {/* Top Aktivitas */}
          {topActivities.length > 0 && (
            <>
              <p className="font-bold text-ink mb-3">Aktivitas paling sering</p>
              <div className="flex flex-col gap-3">
                {topActivities.map((a, i) => (
                  <div
                    key={a.id}
                    className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-gray-400">
                          #{i + 1}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            WARNA[a.kategori] || "bg-gray-100"
                          }`}
                        >
                          {a.kategori}
                        </span>
                      </div>
                      <p className="font-bold text-ink">{a.label}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-extrabold text-brand">
                        {a.doneCount}
                      </p>
                      <p className="text-xs text-gray-400">kali</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}