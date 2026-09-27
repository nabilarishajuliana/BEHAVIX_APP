const HOTLINE = [
  { nama: "SEJIWA (Kemenkes)", nomor: "119 ext 8", jam: "24 jam" },
  { nama: "Into The Light", nomor: "119 ext 8", jam: "24 jam" },
  { nama: "LSM Jangan Bunuh Diri", nomor: "021-9696-9293", jam: "24 jam" },
  { nama: "Halo Kemenkes", nomor: "1500-567", jam: "24 jam" },
];

export default function KrisisScreen({ goBack }) {
  return (
    <div className="min-h-screen bg-canvas font-sans p-5">
      <button onClick={goBack} className="w-10 h-10 rounded-xl bg-white shadow-sm text-lg text-ink mb-4">‹</button>

      <h1 className="text-2xl font-extrabold text-ink mb-3">Jalur Krisis</h1>

      <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 mb-5">
        <p className="text-sm text-red-800 leading-relaxed">
          Kalau kamu lagi ngerasa berat banget atau ada pikiran buat nyakitin diri, <b>hubungi salah satu ini sekarang</b>. Kamu nggak sendirian. 💚
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {HOTLINE.map((h) => (
          <div key={h.nama} className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="font-bold text-ink">{h.nama}</p>
            <p className="text-xs text-gray-500 mb-3">{h.jam}</p>
            <a
              href={`tel:${h.nomor.replace(/\s|-/g, "")}`}
              className="w-full bg-red-500 text-white rounded-xl py-3 font-bold text-center block"
            >
              📞 Telepon {h.nomor}
            </a>
          </div>
        ))}
      </div>

      <div className="bg-yellow-50 rounded-xl p-3 text-xs text-yellow-800 mt-6">
        ⚠️ Kalau kamu dalam bahaya langsung, hubungi <b>119</b> atau ke IGD terdekat sekarang juga.
      </div>
    </div>
  );
}