import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  ResponsiveContainer, Tooltip, Cell,
} from "recharts";
import { storage, KEYS } from "../utils/storage";

const MOOD_SCORE = {
  buruk_banget: 1, kurang_oke: 2, biasa: 3, lumayan: 4, baik_banget: 5,
};

// ==== HELPER: hitung streak
function computeStreak(checkins) {
  if (checkins.length === 0) return 0;
  const days = new Set(checkins.map((c) => c.waktu_iso.slice(0, 10)));
  let streak = 0;
  const d = new Date();
  while (days.has(d.toISOString().slice(0, 10))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

// ==== HELPER: bandingin dorongan minggu ini vs minggu lalu
function analisisMingguan(checkins) {
  const now = new Date();
  const seminggu = 7 * 24 * 60 * 60 * 1000;
  const batasMingguIni = new Date(now - seminggu);
  const batasMingguLalu = new Date(now - 2 * seminggu);

  const mingguIni = checkins.filter(
    (c) => new Date(c.waktu_iso) >= batasMingguIni && c.adaDorongan
  ).length;
  const mingguLalu = checkins.filter(
    (c) =>
      new Date(c.waktu_iso) >= batasMingguLalu &&
      new Date(c.waktu_iso) < batasMingguIni &&
      c.adaDorongan
  ).length;

  if (mingguLalu === 0) return null; // belum bisa dibandingin
  const perubahan = Math.round(((mingguIni - mingguLalu) / mingguLalu) * 100);
  return { mingguIni, mingguLalu, perubahan };
}

// ==== HELPER: cari range jam paling rawan
function jamRawan(checkins) {
  const perJam = {};
  checkins.forEach((c) => {
    if (c.adaDorongan) perJam[c.jam] = (perJam[c.jam] || 0) + 1;
  });
  const entries = Object.entries(perJam).sort((a, b) => b[1] - a[1]);
  if (entries.length === 0) return null;
  const topJam = Number(entries[0][0]);
  return `${String(topJam).padStart(2, "0")}.00–${String((topJam + 3) % 24).padStart(2, "0")}.00`;
}

// ==== HELPER: apakah progres "mandek" (buat trigger rujukan)
function progresMandek(checkins) {
  // rule: user aktif >2 minggu + rata2 intensitas belum turun signifikan
  if (checkins.length < 14) return false;
  const withDorongan = checkins.filter((c) => c.adaDorongan);
  if (withDorongan.length < 10) return false;

  const half = Math.floor(withDorongan.length / 2);
  const awal = withDorongan.slice(0, half);
  const akhir = withDorongan.slice(half);
  const avgAwal = awal.reduce((s, c) => s + c.intensitas, 0) / awal.length;
  const avgAkhir = akhir.reduce((s, c) => s + c.intensitas, 0) / akhir.length;

  // mandek = intensitas akhir masih ≥ awal
  return avgAkhir >= avgAwal - 0.5;
}

// ==== HELPER: bikin pesan feedback berdasarkan data
function bikinFeedback(checkins) {
  const mingguan = analisisMingguan(checkins);
  const streak = computeStreak(checkins);

  // prioritas 1: streak panjang
  if (streak >= 7) {
    return {
      teks: `Kamu udah check-in ${streak} hari berturut-turut. Konsistensi kamu keren banget!`,
    };
  }
  // prioritas 2: penurunan dorongan
  if (mingguan && mingguan.perubahan <= -20) {
    return {
      teks: `Dorongan kamu turun ${Math.abs(mingguan.perubahan)}% dibanding minggu lalu. Usaha yang kamu lakukan terlihat.`,
    };
  }
  // prioritas 3: naik dikit → tetep suportif
  if (mingguan && mingguan.perubahan > 20) {
    return {
      teks: `Minggu ini agak berat ya. Nggak apa-apa — kamu tetap datang & check-in, itu udah langkah besar.`,
    };
  }
  // default: pesan hangat
  return {
    teks: `Setiap check-in itu bentuk peduli sama diri sendiri. Terus jalan pelan-pelan.`,
  };
}

export default function ProgresScreen({ navigate }) {
  const checkins = storage.get(KEYS.checkins, []);

  // EMPTY STATE
  if (checkins.length === 0) {
    return (
      <div className="min-h-screen bg-canvas font-sans p-5 pb-24">
        <h1 className="text-2xl font-extrabold text-ink mb-1">Progres kamu</h1>
        <p className="text-sm text-gray-500 mb-10">
          Ini rapor usaha kamu — bukan buat ngukur, tapi ngerayain.
        </p>
        <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
          <p className="text-ink font-semibold mb-1">Belum ada data</p>
          <p className="text-sm text-gray-500">Yuk mulai check-in pertamamu!</p>
        </div>
      </div>
    );
  }

  const streak = computeStreak(checkins);
  const feedback = bikinFeedback(checkins);
  const rangeJamRawan = jamRawan(checkins);
  const mandek = progresMandek(checkins);

  // mood 7 terakhir
  const moodData = checkins.slice(-7).map((c) => ({
    name: new Date(c.waktu_iso).toLocaleDateString("id-ID", { weekday: "short" }),
    mood: MOOD_SCORE[c.mood] || 3,
  }));

  // jam rawan
  const wc = { pagi: 0, siang: 0, sore: 0, malam: 0 };
  checkins.forEach((c) => { if (c.adaDorongan && c.waktu) wc[c.waktu]++; });
  const waktuData = Object.entries(wc).map(([k, v]) => ({ name: k, jumlah: v }));

  // pemicu tersering
  const pc = {};
  checkins.forEach((c) => { if (c.pemicu) pc[c.pemicu] = (pc[c.pemicu] || 0) + 1; });
  const pemicuData = Object.entries(pc)
    .map(([k, v]) => ({ name: k, jumlah: v }))
    .sort((a, b) => b.jumlah - a.jumlah);

  return (
    <div className="min-h-screen bg-canvas font-sans p-5 pb-24">
      <h1 className="text-2xl font-extrabold text-ink mb-1">Progres kamu</h1>
      <p className="text-sm text-gray-500 mb-4">
        Ini rapor usaha kamu — bukan buat ngukur, tapi ngerayain.
      </p>

      {/* streak */}
      <div className="bg-brand rounded-2xl p-5 text-white mb-4">
        <p className="text-xs font-semibold opacity-90">STREAK KAMU</p>
        <p className="text-4xl font-extrabold">
          {streak} <span className="text-lg font-bold">hari</span>
        </p>
      </div>

      {/* mood */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
        <p className="font-bold text-ink mb-3">Mood kamu</p>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={moodData}>
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 5]} hide />
            <Tooltip />
            <Line type="monotone" dataKey="mood" stroke="var(--color-brand)" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* jam rawan */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
        <p className="font-bold text-ink mb-1">Jam paling rawan</p>
        {rangeJamRawan && (
          <p className="text-xs text-gray-500 mb-2">Paling sering: {rangeJamRawan}</p>
        )}
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={waktuData}>
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis hide />
            <Tooltip />
            <Bar dataKey="jumlah" fill="var(--color-lav)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* pemicu tersering */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
        <p className="font-bold text-ink mb-3">Pemicu tersering</p>
        {pemicuData.length === 0 ? (
          <p className="text-sm text-gray-400">Belum ada pemicu yang tercatat.</p>
        ) : (
          <ResponsiveContainer width="100%" height={pemicuData.length * 42}>
            <BarChart data={pemicuData} layout="vertical" margin={{ left: 20 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={90} />
              <Tooltip />
              <Bar dataKey="jumlah" fill="var(--color-accent)" radius={[0, 6, 6, 0]}>
                {pemicuData.map((_, i) => <Cell key={i} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ============================== */}
      {/* KARTU FEEDBACK (Progress Evaluation) */}
      {/* ============================== */}
      <div className="bg-linear-to-br from-brand/15 to-sunny/20 rounded-2xl p-5 mb-4">
        <div className="flex items-start gap-3">
          <div>
            <p className="text-xs font-bold text-brand tracking-wide mb-1">
              PROGRES KAMU MINGGU INI
            </p>
            <p className="text-sm text-ink leading-relaxed">{feedback.teks}</p>
          </div>
        </div>
      </div>

      {/* ============================== */}
      {/* KARTU RUJUKAN PSIKOLOG (kondisional) */}
      {/* ============================== */}
      {mandek && (
        <div className="bg-lav/25 border border-lav rounded-2xl p-5 mb-4">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <p className="text-xs font-bold text-brand tracking-wide mb-1">
                CUMA SARAN LEMBUT
              </p>
              <p className="text-sm text-ink leading-relaxed mb-3">
                Mungkin waktunya ngobrol sama profesional? Nggak ada yang salah sama kamu.
                Kadang ngobrol sama yang ahli bikin jauh lebih ringan.
              </p>
              <button
                onClick={() => navigate("konsultasi")}
                className="text-xs bg-white rounded-full px-3 py-1.5 font-bold text-brand"
              >
                Lihat opsi konsultasi →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}