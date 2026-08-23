import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  ResponsiveContainer, Tooltip, Cell,
} from "recharts";
import { storage, KEYS } from "../utils/storage";

const MOOD_SCORE = {
  buruk_banget: 1, kurang_oke: 2, biasa: 3, lumayan: 4, baik_banget: 5,
};

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

export default function ProgresScreen() {
  const checkins = storage.get(KEYS.checkins, []);

  // EMPTY STATE
  if (checkins.length === 0) {
    return (
      <div className="min-h-screen bg-canvas font-sans p-5 pb-24">
        <h1 className="text-2xl font-extrabold text-ink mb-1">Progres kamu 🌿</h1>
        <p className="text-sm text-gray-500 mb-10">
          Ini rapor usaha kamu — bukan buat ngukur, tapi ngerayain.
        </p>
        <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
          <p className="text-4xl mb-3">🌱</p>
          <p className="text-ink font-semibold mb-1">Belum ada data</p>
          <p className="text-sm text-gray-500">Yuk mulai check-in pertamamu!</p>
        </div>
      </div>
    );
  }

  const streak = computeStreak(checkins);

  // mood 7 terakhir
  const moodData = checkins.slice(-7).map((c) => ({
    name: new Date(c.waktu_iso).toLocaleDateString("id-ID", { weekday: "short" }),
    mood: MOOD_SCORE[c.mood] || 3,
  }));

  // jam rawan (per waktu)
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
      <h1 className="text-2xl font-extrabold text-ink mb-1">Progres kamu 🌿</h1>
      <p className="text-sm text-gray-500 mb-4">
        Ini rapor usaha kamu — bukan buat ngukur, tapi ngerayain.
      </p>

      {/* streak */}
      <div className="bg-brand rounded-2xl p-5 text-white mb-4">
        <p className="text-xs font-semibold opacity-90">STREAK KAMU</p>
        <p className="text-4xl font-extrabold">
          {streak} <span className="text-lg font-bold">hari 🌱</span>
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
            <Line type="monotone" dataKey="mood" stroke="#4FB3A6" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* jam rawan */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
        <p className="font-bold text-ink mb-3">Jam paling rawan</p>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={waktuData}>
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis hide />
            <Tooltip />
            <Bar dataKey="jumlah" fill="#B8A7E0" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* pemicu tersering */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <p className="font-bold text-ink mb-3">Pemicu tersering</p>
        {pemicuData.length === 0 ? (
          <p className="text-sm text-gray-400">Belum ada pemicu tercatat. Bagus! 🌱</p>
        ) : (
          <ResponsiveContainer width="100%" height={pemicuData.length * 42}>
            <BarChart data={pemicuData} layout="vertical" margin={{ left: 20 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={90} />
              <Tooltip />
              <Bar dataKey="jumlah" fill="#FF8A65" radius={[0, 6, 6, 0]}>
                {pemicuData.map((_, i) => <Cell key={i} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}