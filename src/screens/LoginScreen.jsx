import { useState } from "react";
import { storage, KEYS } from "../utils/storage";

// Sensor username: ambil huruf pertama, sisanya jadi *
// contoh: "skywalker" → "s********"
function sensorUsername(name) {
  if (!name || name.length === 0) return "";
  if (name.length === 1) return name;
  return name[0] + "*".repeat(name.length - 1);
}

export default function LoginScreen({ navigate }) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  function handleLogin() {
    const savedUser = storage.get(KEYS.user);
    if (!savedUser || !savedUser.username) {
      setError("Belum ada akun. Mulai dari awal ya 🌱");
      return;
    }
    if (savedUser.username.toLowerCase() !== username.trim().toLowerCase()) {
      setError("Username nggak cocok. Coba lagi ya.");
      return;
    }
    navigate("beranda");
  }

  function handleMulaiDariAwal() {
    const savedUser = storage.get(KEYS.user);
    if (savedUser && savedUser.onboarded) {
      const sensored = sensorUsername(savedUser.username);
      const ok = window.confirm(
        "Kamu udah punya akun ('" + sensored + "'). Kalau mulai dari awal, semua data lama (check-in, jurnal, riwayat) bakal kehapus dan nggak bisa dibalikin. Yakin?"
      );
      if (!ok) return;
      storage.clearAll();
    }
    navigate("onboardingWelcome");
  }

  return (
    <div className="min-h-screen bg-canvas font-sans p-6 flex flex-col items-center justify-center">
      {/* logo/maskot */}
      <div className="w-24 h-24 rounded-full bg-brand/20 flex items-center justify-center mb-6 text-5xl">
        🌊
      </div>

      <h1 className="text-2xl font-extrabold text-ink text-center mb-1">
        Selamat datang kembali
      </h1>
      <p className="text-sm text-gray-500 text-center mb-8">
        Masukkan username kamu buat lanjut.
      </p>

      <input
        value={username}
        onChange={(e) => { setUsername(e.target.value); setError(""); }}
        placeholder="username kamu"
        className="w-full max-w-xs bg-white rounded-2xl px-4 py-3.5 shadow-sm outline-none text-ink text-center mb-3"
      />

      {error && (
        <p className="text-sm text-red-500 mb-3">{error}</p>
      )}

      <button
        onClick={handleLogin}
        disabled={!username.trim()}
        className={`w-full max-w-xs rounded-2xl py-3.5 font-bold text-white mb-6 ${
          username.trim() ? "bg-accent shadow-md" : "bg-gray-300"
        }`}
      >
        Masuk →
      </button>

      <button
        onClick={handleMulaiDariAwal}
        className="text-sm text-gray-500"
      >
        Belum punya? <span className="text-brand font-bold">Mulai dari awal</span>
      </button>
    </div>
  );
}