import { useState, useEffect } from "react";

const PHASES = [
  { name: "Tarik napas...", secs: 4, scale: 1.0 },
  { name: "Tahan...", secs: 7, scale: 1.0 },
  { name: "Buang...", secs: 8, scale: 0.55 },
];

export default function BreathingTimer({ duration = 180, onDone }) {
  const [remaining, setRemaining] = useState(duration);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const phase = PHASES[phaseIdx];

  // hitung mundur total
  useEffect(() => {
    if (remaining <= 0) {
      onDone?.();
      return;
    }
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining, onDone]);

  // ganti fase napas
  useEffect(() => {
    const t = setTimeout(
      () => setPhaseIdx((i) => (i + 1) % PHASES.length),
      phase.secs * 1000
    );
    return () => clearTimeout(t);
  }, [phaseIdx]);

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");

  return (
    <div className="flex flex-col items-center gap-10">
      <div
        className="w-48 h-48 rounded-full bg-white/25 flex items-center justify-center ease-in-out"
        style={{
          transform: `scale(${phase.scale})`,
          transition: `transform ${phase.secs}s ease-in-out`,
        }}
      >
        <span className="text-white text-lg font-semibold">{phase.name}</span>
      </div>
      <div className="text-4xl font-bold text-white tracking-wider">{mm}:{ss}</div>
    </div>
  );
}