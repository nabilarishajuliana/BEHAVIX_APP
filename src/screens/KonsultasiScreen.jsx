const LAYANAN = [
  { nama: "Into The Light Indonesia", desc: "Komunitas pencegahan bunuh diri untuk remaja", tag: "Gratis", url: "https://www.intothelightid.org" },
  { nama: "Yayasan Pulih", desc: "Layanan konseling psikologis", tag: "Berbayar", url: "https://yayasanpulih.org" },
  { nama: "Riliv", desc: "Aplikasi konseling online dengan psikolog", tag: "Berbayar", url: "https://riliv.co" },
  { nama: "Kalm", desc: "Platform konseling online 24/7", tag: "Berbayar", url: "https://www.getkalm.com" },
];

export default function KonsultasiScreen({ goBack, navigate }) {
  return (
    <div className="min-h-screen bg-canvas font-sans p-5">
      <button onClick={goBack} className="w-10 h-10 rounded-xl bg-white shadow-sm text-lg text-ink mb-4">‹</button>

      <h1 className="text-2xl font-extrabold text-ink mb-2">Konsultasi Psikolog</h1>

      <div className="bg-brand/10 rounded-2xl p-4 mb-5">
        <p className="text-sm text-brand leading-relaxed">
          Berbicara dengan profesional dapat membantu. Kamu selalu punya pilihan untuk mencari dukungan.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {LAYANAN.map((l) => (
          <a
            key={l.nama}
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-2xl p-4 shadow-sm block"
          >
            <div className="flex items-center gap-2 mb-1">
              <p className="font-bold text-ink">{l.nama}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                l.tag === "Gratis" ? "bg-brand/20 text-brand" : "bg-gray-100 text-gray-500"
              }`}>{l.tag}</span>
            </div>
            <p className="text-xs text-gray-500">{l.desc}</p>
            <p className="text-xs text-brand mt-2 font-semibold">Kunjungi →</p>
          </a>
        ))}
      </div>

      <p className="text-xs text-gray-500 text-center mt-6">
        Kondisi mendesak? Lihat <button onClick={() => navigate("krisis")} className="text-red-500 font-bold underline">Jalur Krisis</button>.
      </p>
    </div>
  );
}