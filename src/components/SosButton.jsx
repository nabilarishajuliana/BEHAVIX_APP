import { GUDANG_SARAN } from "../data/gudangSaran";

export default function SosButton({ navigate }) {
  const napas = GUDANG_SARAN.find((s) => s.id === "napas_478");
  return (
    <button
      onClick={() => navigate("activity", { saran: napas })}
      className="fixed bottom-24 right-4 w-14 h-14 rounded-full bg-brand text-white
                 text-xs font-bold shadow-lg flex items-center justify-center"
    >
      SOS
    </button>
  );
}