import { useState } from "react";
import { GUDANG_SARAN } from "../data/gudangSaran";
import { storage, KEYS } from "../utils/storage";

const KATEGORI = ["Semua", "Tenang", "Gerak", "Kreatif", "Sosial"];

const WARNA = {
  Tenang: "bg-brand/15 text-brand",
  Gerak: "bg-accent/15 text-accent",
  Kreatif: "bg-lav/25 text-purple-700",
  Sosial: "bg-sunny/30 text-yellow-700",
};

export default function QuestScreen({ navigate }) {
  const [filter, setFilter] = useState("Semua");
  const quests = storage.get(KEYS.quests, {});

  const list =
    filter === "Semua"
      ? GUDANG_SARAN
      : GUDANG_SARAN.filter((s) => s.kategori === filter);

  return (
    <div className="min-h-screen bg-canvas font-sans p-5 pb-24">
      <h1 className="text-2xl font-extrabold text-ink mb-1">Quest ✨</h1>
      <p className="text-sm text-gray-500 mb-4">
        Kegiatan kecil buat nemenin harimu. Pilih yang kamu mau — santai aja.
      </p>

      {/* filter */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {KATEGORI.map((k) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={`text-sm px-4 py-2 rounded-full font-medium whitespace-nowrap ${
              filter === k ? "bg-brand text-white" : "bg-white text-gray-500 shadow-sm"
            }`}
          >
            {k}
          </button>
        ))}
      </div>

      {/* daftar */}
      <div className="flex flex-col gap-3">
        {list.map((s) => (
          <button
            key={s.id}
            onClick={() => navigate("activity", { saran: s })}
            className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between text-left"
          >
            <div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${WARNA[s.kategori] || "bg-gray-100"}`}>
                {s.kategori}
              </span>
              <span className="text-xs text-gray-500 ml-2">{s.durasi}</span>
              <p className="font-bold text-ink mt-1">{s.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                dicoba {quests[s.id]?.doneCount || 0}×
              </p>
            </div>
            <span className="text-brand text-xl">›</span>
          </button>
        ))}
      </div>
    </div>
  );
}