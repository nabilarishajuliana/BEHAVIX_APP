import { GUDANG_SARAN } from "../data/gudangSaran";

const WARNA_KATEGORI = {
  Tenang: "bg-brand/15 text-brand",
  Gerak: "bg-accent/15 text-accent",
  Kreatif: "bg-lav/25 text-purple-700",
  Sosial: "bg-sunny/25 text-yellow-700",
};

export default function InsightScreen({ params, navigate, goBack }) {
  const { result } = params;
  const saranObjs = result.saran
    .map((id) => GUDANG_SARAN.find((s) => s.id === id))
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-canvas font-sans p-5 pb-10">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={goBack} className="w-9 h-9 rounded-lg border border-gray-300">‹</button>
        <h1 className="font-bold text-ink">🌱 Behavix Insight</h1>
      </div>

      {/* kartu pemicu */}
      <div className="bg-brand/15 rounded-2xl p-5 mb-6">
        <p className="text-xs font-bold text-brand tracking-wide mb-1">◆ POLA YANG KEBACA</p>
        <h2 className="text-2xl font-extrabold text-ink mb-2">{result.pemicu_label}</h2>
        <p className="text-sm text-gray-600 leading-relaxed">{result.deskripsi}</p>
        <p className="text-xs text-gray-500 mt-3">🌱 Ini bukan penilaian, ya — cuma pola yang sering muncul.</p>
      </div>

      <h3 className="text-lg font-bold text-ink mb-1">Coba salah satu ini yuk:</h3>
      <p className="text-sm text-gray-500 mb-4">Pilih yang paling kerasa pas sekarang.</p>

      {/* kartu saran */}
      <div className="flex flex-col gap-3">
        {saranObjs.map((s) => (
          <button
            key={s.id}
            onClick={() => navigate("activity", { saran: s })}
            className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between text-left"
          >
            <div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${WARNA_KATEGORI[s.kategori] || "bg-gray-100"}`}>
                {s.kategori}
              </span>
              <span className="text-xs text-gray-500 ml-2">{s.durasi}</span>
              <p className="font-bold text-ink mt-1">{s.label}</p>
            </div>
            <span className="text-brand text-xl">›</span>
          </button>
        ))}
      </div>

      <button
        onClick={() => navigate("beranda")}
        className="w-full text-center text-sm text-gray-400 mt-5 py-2"
      >
        Nggak ada yang cocok / lewati
      </button>
    </div>
  );
}