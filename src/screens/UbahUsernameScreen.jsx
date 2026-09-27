import { useState } from "react";
import { storage, KEYS } from "../utils/storage";

export default function UbahUsernameScreen({ goBack }) {
  const user = storage.get(KEYS.user, { username: "" });
  const [username, setUsername] = useState("");

  function simpan() {
    if (!username.trim()) return;
    storage.set(KEYS.user, { ...user, username: username.trim() });
    goBack();
  }

  return (
    <div className="min-h-screen bg-canvas font-sans p-5 flex flex-col">
      <button onClick={goBack} className="w-10 h-10 rounded-xl bg-white shadow-sm text-lg text-ink mb-4 self-start">‹</button>

      <h1 className="text-2xl font-extrabold text-ink mb-2">Ubah Username</h1>
      <p className="text-sm text-gray-500 mb-6">Ganti username kamu kapan aja.</p>

      <div className="bg-brand/10 rounded-xl p-3 text-sm text-brand mb-4">
        Username sekarang: <b>{user.username}</b>
      </div>

      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="username baru"
        className="w-full bg-white rounded-2xl px-4 py-3.5 shadow-sm outline-none text-ink mb-3"
      />

      <div className="bg-sunny/30 rounded-xl p-3 text-xs text-yellow-800 mb-auto">
        🔒 Masih pakai nama apapun — nggak harus nama asli.
      </div>

      <button
        onClick={simpan}
        disabled={!username.trim()}
        className={`w-full rounded-2xl py-3.5 font-bold text-white mt-6 ${
          username.trim() ? "bg-accent" : "bg-gray-300"
        }`}
      >
        Simpan Perubahan
      </button>
    </div>
  );
}