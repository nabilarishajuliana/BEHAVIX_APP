import { useState } from "react";
import { storage, KEYS } from "../utils/storage";

export default function AturPengingatScreen({ goBack }) {
  const user = storage.get(KEYS.user, {});
  const [aktif, setAktif] = useState(user.reminderOn ?? false);
  const [jam, setJam] = useState(user.reminderTime ?? "20:00");

  function simpan() {
    storage.set(KEYS.user, { ...user, reminderOn: aktif, reminderTime: jam });
    goBack();
  }

  return (
    <div className="min-h-screen bg-canvas font-sans p-5 flex flex-col">
      <button onClick={goBack} className="w-10 h-10 rounded-xl bg-white shadow-sm text-lg text-ink mb-4 self-start">‹</button>

      <h1 className="text-2xl font-extrabold text-ink mb-2">Atur Pengingat</h1>
      <p className="text-sm text-gray-500 mb-6">Biar kamu nggak lupa check-in.</p>

      {/* toggle */}
      <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between mb-4">
        <p className="font-bold text-ink">Nyalakan pengingat harian</p>
        <button
          onClick={() => setAktif(!aktif)}
          className={`w-12 h-7 rounded-full transition ${aktif ? "bg-brand" : "bg-gray-300"} relative`}
        >
          <span className={`absolute top-1 w-5 h-5 rounded-full bg-white transition ${aktif ? "left-6" : "left-1"}`} />
        </button>
      </div>

      {aktif && (
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <p className="font-bold text-ink mb-2">Jam pengingat</p>
          <input
            type="time"
            value={jam}
            onChange={(e) => setJam(e.target.value)}
            className="w-full bg-canvas rounded-xl px-4 py-3 outline-none text-ink text-lg font-bold"
          />
          <p className="text-xs text-gray-500 mt-3">
            🌱 Kamu akan diingatkan tiap hari jam {jam}
          </p>
        </div>
      )}

      <p className="text-xs text-gray-400 text-center mt-auto mb-4">
        Pengingat cuma buat ngingetin, bukan maksa 🙂
      </p>

      <button
        onClick={simpan}
        className="w-full bg-accent text-white rounded-2xl py-3.5 font-bold"
      >
        Simpan
      </button>
    </div>
  );
}