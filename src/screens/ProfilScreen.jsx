import { storage, KEYS } from "../utils/storage";

export default function ProfilScreen() {
  const user = storage.get(KEYS.user, { username: "kamu" });

  return (
    <div className="min-h-screen bg-canvas font-sans p-5 pb-24">
      <h1 className="text-2xl font-extrabold text-ink mb-1">Profil 🙂</h1>
      <p className="text-sm text-gray-500 mb-5">Semua kendali ada di tangan kamu.</p>

      <div className="bg-brand rounded-2xl p-5 text-white mb-4">
        <p className="text-xs font-semibold opacity-90">USERNAME KAMU</p>
        <p className="text-2xl font-extrabold">👋 {user.username}</p>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
        <p className="font-bold text-red-500">Jalur krisis / hotline</p>
        <p className="text-sm text-red-400">Butuh bantuan sekarang? Selalu ada di sini.</p>
      </div>

      <p className="text-center text-xs text-gray-400 mt-8">
        (Fitur lengkap Profil dibangun di Fase 4)
      </p>
    </div>
  );
}