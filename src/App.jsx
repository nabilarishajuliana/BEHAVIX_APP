import { useState } from "react";

// Nanti ganti placeholder ini dengan layar asli
function Placeholder({ name, navigate }) {
  return (
    <div className="min-h-screen bg-canvas font-sans p-6 flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-brand">{name}</h1>
      <button
        className="bg-accent text-white rounded-xl py-3 font-semibold"
        onClick={() => navigate("checkin")}
      >
        Ke Check-in →
      </button>
      <button
        className="bg-brand text-white rounded-xl py-3 font-semibold"
        onClick={() => navigate("beranda")}
      >
        Ke Beranda →
      </button>
    </div>
  );
}

export default function App() {
  // history = tumpukan layar. Layar aktif = paling atas.
  const [history, setHistory] = useState(["beranda"]);
  const current = history[history.length - 1];

  const navigate = (screen) => setHistory((h) => [...h, screen]);
  const goBack = () =>
    setHistory((h) => (h.length > 1 ? h.slice(0, -1) : h));

  // Peta layar → komponennya
  const screens = {
    beranda: <Placeholder name="Beranda" navigate={navigate} />,
    checkin: <Placeholder name="Check-in" navigate={navigate} />,
    // tambah layar lain di sini nanti
  };

  return (
    <div className="mx-auto max-w-md min-h-screen">
      {screens[current] || <div>Layar tidak ditemukan: {current}</div>}
    </div>
  );
}