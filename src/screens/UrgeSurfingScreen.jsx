import { useState } from "react";
import BreathingTimer from "../components/BreathingTimer";
import { storage } from "../utils/storage";

export default function UrgeSurfingScreen({ goBack }) {
  const [phase, setPhase] = useState("napas"); // "napas" → "selesai"
  const [after, setAfter] = useState(5);

  function simpan() {
    const arr = storage.get("behavix_urge", []);
    storage.set("behavix_urge", [
      ...arr,
      { waktu: new Date().toISOString(), after },
    ]);
    goBack();
  }

  return (
    <div className="min-h-screen bg-deep font-sans p-6 flex flex-col">
      <button
        onClick={goBack}
        className="w-10 h-10 rounded-full border border-white/40 text-white self-start"
      >
        ×
      </button>

      {phase === "napas" ? (
        <>
          <h1 className="text-white text-xl font-bold text-center mt-6 mb-1">
            Tarik napas bareng, yuk 🌊
          </h1>
          <p className="text-white/60 text-sm text-center mb-10">
            Nggak usah mikir apa-apa. Cukup ikutin lingkarannya.
          </p>
          <div className="flex-1 flex items-center justify-center">
            <BreathingTimer duration={180} onDone={() => setPhase("selesai")} />
          </div>
          <p className="text-white/70 text-sm text-center mb-2">
            Dorongan ini kayak ombak — dia bakal naik, terus surut sendiri.
          </p>
        </>
      ) : (
        <div className="flex-1 flex flex-col justify-center items-center text-center">
          <h1 className="text-white text-2xl font-bold mb-2">Kamu berhasil 🎉</h1>
          <p className="text-white/70 text-sm mb-8">Gimana rasanya sekarang?</p>
          <div className="w-full max-w-xs bg-white/10 rounded-2xl p-5 mb-8">
            <p className="text-white text-sm mb-3">
              Dorongan sekarang: <b>{after}/10</b>
            </p>
            <input
              type="range"
              min="1"
              max="10"
              value={after}
              onChange={(e) => setAfter(Number(e.target.value))}
              className="w-full accent-brand"
            />
          </div>
          <button
            onClick={simpan}
            className="w-full max-w-xs rounded-2xl py-3.5 font-bold text-white bg-accent"
          >
            Selesai
          </button>
        </div>
      )}
    </div>
  );
}