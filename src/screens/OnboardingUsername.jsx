import { useState } from "react";

export default function OnboardingUsername({ navigate, goBack }) {
  const [username, setUsername] = useState("");

  return (
    <div className="min-h-screen bg-canvas font-sans p-6 flex flex-col">
      {/* top: back + dots */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={goBack} className="w-10 h-10 rounded-xl bg-white shadow-sm text-lg text-ink">‹</button>
        <div className="flex gap-1.5">
          <span className="w-2 h-2 rounded-full bg-brand" />
          <span className="w-6 h-2 rounded-full bg-brand" />
          <span className="w-2 h-2 rounded-full bg-brand/30" />
          <span className="w-2 h-2 rounded-full bg-brand/30" />
        </div>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-extrabold text-ink mb-2">Buat username kamu!</h1>
        <p className="text-sm text-gray-500 mb-8">Pilih username untuk digunakan sebagai identitasmu di aplikasi.</p>

        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="misal: NightWalker99"
          className="w-full bg-white rounded-2xl px-4 py-3.5 shadow-sm outline-none text-ink text-center mb-4"
        />

        <div className="w-full bg-sunny/30 rounded-xl p-3 text-xs text-ink text-center">
          Username ini akan digunakan sebagai identitasmu di aplikasi.
        </div>
      </div>

      <button
        onClick={() => navigate("onboardingConsent", { username: username.trim() })}
        disabled={!username.trim()}
        className={`w-full rounded-2xl py-4 font-bold text-white shadow-md ${
          username.trim() ? "bg-accent" : "bg-gray-300"
        }`}
      >
        Lanjut →
      </button>
    </div>
  );
}