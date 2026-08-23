import { storage, KEYS } from "../utils/storage";
import SosButton from "../components/SosButton";

export default function BerandaScreen({ navigate }) {
  const user = storage.get(KEYS.user, { username: "kamu" });
  const checkins = storage.get(KEYS.checkins, []);

  return (
    <div className="min-h-screen bg-canvas font-sans p-5 pb-24">
      <div className="mb-5">
        <h1 className="text-2xl font-extrabold text-ink">Halo, {user.username} 👋</h1>
        <p className="text-sm text-gray-500">Semoga harimu baik ya.</p>
      </div>

      {/* streak sederhana */}
      <div className="bg-brand rounded-2xl p-5 text-white mb-4">
        <p className="text-xs font-semibold opacity-90">STREAK KAMU</p>
        <p className="text-4xl font-extrabold">{checkins.length} <span className="text-lg font-bold">check-in</span></p>
        <p className="text-sm opacity-90 mt-1">Kamu jalan bareng terus 🌱</p>
      </div>

      {/* kartu check-in */}
      <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
        <h2 className="font-bold text-ink text-lg">Gimana kabarmu hari ini?</h2>
        <p className="text-sm text-gray-500 mb-4">Cuma butuh semenit buat cek-in sama diri sendiri.</p>
        <button
          onClick={() => navigate("checkin")}
          className="w-full bg-accent text-white rounded-xl py-3 font-semibold"
        >
          Mulai check-in →
        </button>
      </div>

      <SosButton navigate={navigate} />
    </div>
  );
}