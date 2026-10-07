import { useState } from "react";
import { MOOD_OPTIONS, AKTIVITAS_CHIPS } from "../data/checkinOptions";
import { storage, KEYS } from "../utils/storage";
import { callBehavixInsight } from "../utils/behavixInsight";

function getWaktu(h) {
  if (h >= 5 && h < 11) return "pagi";
  if (h >= 11 && h < 15) return "siang";
  if (h >= 15 && h < 18) return "sore";
  return "malam";
}

const MAX_CHIP = 3;

export default function CheckinScreen({ navigate, goBack }) {
  const [mood, setMood] = useState(null);
  const [adaDorongan, setAdaDorongan] = useState(null);
  const [intensitas, setIntensitas] = useState(5);
  const [aktivitas, setAktivitas] = useState([]); // <-- array (multi-select)
  const [loading, setLoading] = useState(false);

  const bisaLanjut =
    mood && adaDorongan !== null && (adaDorongan === false || aktivitas.length > 0);

  // toggle chip: klik = pilih, klik lagi = batal, maks 3
  function toggleChip(chip) {
    setAktivitas((prev) => {
      if (prev.includes(chip)) return prev.filter((c) => c !== chip);
      if (prev.length >= MAX_CHIP) return prev; // sudah 3, abaikan
      return [...prev, chip];
    });
  }

  const labelIntensitas =
    intensitas <= 3 ? "Ringan" : intensitas <= 6 ? "Sedang" : "Kuat";

  async function handleSubmit() {
    const now = new Date();
    const checkin = {
      id: "c_" + Date.now(),
      waktu_iso: now.toISOString(),
      jam: now.getHours(),
      waktu: getWaktu(now.getHours()),
      mood,
      adaDorongan,
      intensitas: adaDorongan ? intensitas : null,
      aktivitas: adaDorongan ? aktivitas.join(", ") : null, // gabung jadi teks
      pemicu: null,
    };

    const all = storage.get(KEYS.checkins, []);

    if (!adaDorongan) {
      storage.set(KEYS.checkins, [...all, checkin]);
      goBack();
      return;
    }

    setLoading(true);
    const result = await callBehavixInsight(checkin);
    checkin.pemicu = result.pemicu;
    storage.set(KEYS.checkins, [...all, checkin]);
    setLoading(false);
    navigate("insight", { checkin, result });
  }

  return (
    <div className="min-h-screen bg-canvas font-sans pb-28">
      {/* header lengkung */}
      <div className="bg-brand/15 rounded-b-3xl px-5 pt-5 pb-8">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={goBack}
            className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-lg text-ink"
          >
            ‹
          </button>
          <div className="flex gap-1.5">
            <span className="w-6 h-1.5 rounded-full bg-brand" />
            <span className="w-2 h-1.5 rounded-full bg-brand/30" />
          </div>
          <div className="w-10" />
        </div>
        <p className="text-sm text-brand font-medium">Check-in harian · sebentar saja</p>
      </div>

      <div className="px-5 -mt-3">
        {/* MOOD */}
        <h2 className="text-xl font-extrabold text-ink mb-1 mt-4">
          Gimana perasaanmu sekarang?
        </h2>
        <p className="text-sm text-gray-500 mb-4">Nggak ada jawaban yang salah, ya.</p>
        <div className="flex gap-2 mb-8">
          {MOOD_OPTIONS.map((m) => (
            <button
              key={m.id}
              onClick={() => setMood(m.id)}
              className={`flex-1 rounded-2xl p-2 text-center transition ${
                mood === m.id
                  ? "bg-white shadow-md ring-2 ring-brand"
                  : "bg-white/70 shadow-sm"
              }`}
            >
              <div className="text-[10px] leading-tight text-gray-600">{m.label}</div>
            </button>
          ))}
        </div>

        {/* DORONGAN */}
        <h2 className="text-xl font-extrabold text-ink mb-1">Lagi ada dorongan nggak?</h2>
        <p className="text-sm text-gray-500 mb-3">
          Yang kayak pengen banget ngelakuin sesuatu.
        </p>
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setAdaDorongan(false)}
            className={`flex-1 rounded-2xl p-4 font-bold text-lg transition ${
              adaDorongan === false
                ? "bg-brand text-white shadow-md"
                : "bg-white shadow-sm text-ink"
            }`}
          >
            Nggak
          </button>
          <button
            onClick={() => setAdaDorongan(true)}
            className={`flex-1 rounded-2xl p-4 font-bold text-lg transition ${
              adaDorongan === true
                ? "bg-accent text-white shadow-md"
                : "bg-white shadow-sm text-ink"
            }`}
          >
            Iya
          </button>
        </div>

        {/* BERCABANG: cuma kalau "Iya" */}
        {adaDorongan === true && (
          <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
            {/* intensitas */}
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold text-ink">Seberapa kuat?</p>
              <span className="text-sm font-bold text-accent">
                {intensitas}/10 · {labelIntensitas}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={intensitas}
              onChange={(e) => setIntensitas(Number(e.target.value))}
              className="w-full mb-6 accent-accent"
            />

            {/* chip multi-select */}
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold text-ink">Lagi ngapain?</p>
              <span className="text-xs text-gray-400">
                {aktivitas.length}/{MAX_CHIP} dipilih
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {AKTIVITAS_CHIPS.map((chip) => {
                const aktif = aktivitas.includes(chip);
                const penuh = aktivitas.length >= MAX_CHIP && !aktif;
                return (
                  <button
                    key={chip}
                    onClick={() => toggleChip(chip)}
                    disabled={penuh}
                    className={`text-sm px-3.5 py-2 rounded-full font-medium transition ${
                      aktif
                        ? "bg-brand text-white"
                        : penuh
                        ? "bg-gray-100 text-gray-300"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {chip}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <p className="text-xs text-gray-400 text-center mt-4">
          Jam dan tanggal terisi otomatis
        </p>
      </div>

      {/* tombol lanjut (nempel bawah) */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-gradient-to-t from-canvas via-canvas to-transparent">
        <button
          disabled={!bisaLanjut || loading}
          onClick={handleSubmit}
          className={`w-full rounded-2xl py-4 font-bold text-white transition ${
            bisaLanjut && !loading ? "bg-accent shadow-lg" : "bg-gray-300"
          }`}
        >
          {loading ? "Menganalisis..." : "Lanjut →"}
        </button>
      </div>
    </div>
  );
}