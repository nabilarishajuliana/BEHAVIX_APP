import { useEffect, useState } from "react";

export default function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState(0);
  // 0: awal (hidden)
  // 1: logo fade-in + scale
  // 2: nama muncul
  // 3: tagline muncul
  // 4: fade out semua

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 100),     // logo muncul cepet
      setTimeout(() => setPhase(2), 1200),    // nama BEHAVIX
      setTimeout(() => setPhase(3), 1800),    // tagline
      setTimeout(() => setPhase(4), 3200),    // fade out
      setTimeout(() => onDone?.(), 3800),     // selesai → next screen
    ];
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden transition-opacity duration-500 ${
        phase === 4 ? "opacity-0" : "opacity-100"
      }`}
      style={{ backgroundColor: "var(--color-canvas)" }}
    >
      {/* ==================== */}
      {/* Ripple / Ombak background */}
      {/* ==================== */}
      {phase >= 1 && (
        <>
          <div className="absolute w-48 h-48 rounded-full border-2 border-brand/30 animate-ripple-1" />
          <div className="absolute w-48 h-48 rounded-full border-2 border-brand/20 animate-ripple-2" />
          <div className="absolute w-48 h-48 rounded-full border-2 border-brand/10 animate-ripple-3" />
        </>
      )}

      {/* ==================== */}
      {/* Logo */}
      {/* ==================== */}
      <div
        className={`relative transition-all duration-1000 ease-out ${
          phase >= 1
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-75 translate-y-4"
        }`}
      >
        <img
          src="/logo-behavix.png"
          alt="BEHAVIX Logo"
          className="w-32 h-32 relative animate-float"
        />
      </div>

      {/* ==================== */}
      {/* Nama BEHAVIX */}
      {/* ==================== */}
      <div
        className={`mt-8 transition-all duration-700 ease-out ${
          phase >= 2
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4"
        }`}
      >
        <h1 className="text-4xl font-extrabold text-ink tracking-wide">
          BEHAVIX
        </h1>
      </div>

      {/* ==================== */}
      {/* Tagline */}
      {/* ==================== */}
      <div
        className={`mt-3 transition-all duration-700 ease-out ${
          phase >= 3
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4"
        }`}
      >
        <p className="text-sm text-gray-500 text-center px-6">
          Pelan-pelan saja, kamu tidak sendirian.
        </p>
      </div>

      {/* ==================== */}
      {/* Loading dots (breathing) */}
      {/* ==================== */}
      <div
        className={`absolute bottom-16 flex gap-2 transition-opacity duration-500 ${
          phase >= 3 && phase < 4 ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="w-2 h-2 rounded-full bg-brand animate-pulse-dot-1" />
        <div className="w-2 h-2 rounded-full bg-brand animate-pulse-dot-2" />
        <div className="w-2 h-2 rounded-full bg-brand animate-pulse-dot-3" />
      </div>

      {/* ==================== */}
      {/* Skip button (halus di pojok) */}
      {/* ==================== */}
      {phase >= 1 && phase < 4 && (
        <button
          onClick={() => {
            setPhase(4);
            setTimeout(() => onDone?.(), 500);
          }}
          className="absolute top-6 right-6 text-xs text-gray-400 hover:text-brand transition"
        >
          Lewati →
        </button>
      )}

      {/* ==================== */}
      {/* Custom animations (inline biar nggak perlu edit index.css) */}
      {/* ==================== */}
      <style>{`
        @keyframes ripple {
          0% {
            transform: scale(0.8);
            opacity: 0.7;
          }
          100% {
            transform: scale(2.5);
            opacity: 0;
          }
        }

        .animate-ripple-1 {
          animation: ripple 2.5s ease-out infinite;
        }
        .animate-ripple-2 {
          animation: ripple 2.5s ease-out infinite;
          animation-delay: 0.8s;
        }
        .animate-ripple-3 {
          animation: ripple 2.5s ease-out infinite;
          animation-delay: 1.6s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes pulseDot {
          0%, 100% {
            transform: scale(0.8);
            opacity: 0.4;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
        }

        .animate-pulse-dot-1 {
          animation: pulseDot 1.2s ease-in-out infinite;
        }
        .animate-pulse-dot-2 {
          animation: pulseDot 1.2s ease-in-out infinite;
          animation-delay: 0.2s;
        }
        .animate-pulse-dot-3 {
          animation: pulseDot 1.2s ease-in-out infinite;
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
}