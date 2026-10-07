import { useState, useRef, useEffect } from "react";
import { Music2, VolumeX } from "lucide-react";
import BreathingTimer from "../components/BreathingTimer";
import { storage } from "../utils/storage";

export default function UrgeSurfingScreen({ goBack }) {
  const [phase, setPhase] = useState("napas");
  const [after, setAfter] = useState(5);
  const [musikOn, setMusikOn] = useState(false);
  const audioRef = useRef(null);

  // Kontrol musik
  useEffect(() => {
    if (!audioRef.current) return;
    if (musikOn) {
      audioRef.current.volume = 0.4;
      audioRef.current.loop = true;
      audioRef.current.play().catch(() => {
        // browser mungkin block autoplay, biarin aja
      });
    } else {
      audioRef.current.pause();
    }
  }, [musikOn]);

  // Stop musik pas keluar layar
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

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
      {/* audio element (hidden) */}
      <audio ref={audioRef} src="/audio/calm.mp3" preload="auto" />

      {/* top bar: back + musik toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={goBack}
          className="w-10 h-10 rounded-full border border-white/40 text-white"
        >
          ×
        </button>

        {phase === "napas" && (
          <button
            onClick={() => setMusikOn(!musikOn)}
            className={`px-3 py-2 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition ${
              musikOn
                ? "bg-white/20 border-white/40 text-white"
                : "border-white/30 text-white/60"
            }`}
          >
            {musikOn ? <Music2 size={16} aria-hidden="true" /> : <VolumeX size={16} aria-hidden="true" />}
            <span>{musikOn ? "Musik nyala" : "Musik mati"}</span>
          </button>
        )}
      </div>

      {phase === "napas" ? (
        <>
          <h1 className="text-white text-xl font-bold text-center mt-6 mb-1">
            Tarik napas perlahan
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
          <h1 className="text-white text-2xl font-bold mb-2">Sesi selesai</h1>
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