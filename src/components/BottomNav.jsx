const TAB_LIST = [
  { id: "beranda", label: "Beranda", icon: "🏠" },
  { id: "progres", label: "Progres", icon: "📈" },
  { id: "quest", label: "Quest", icon: "🎯" },
  { id: "jurnal", label: "Jurnal", icon: "📓" },
  { id: "profil", label: "Profil", icon: "👤" },
];

export default function BottomNav({ current, goTab }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 flex">
      {TAB_LIST.map((t) => (
        <button
          key={t.id}
          onClick={() => goTab(t.id)}
          className={`flex-1 py-2.5 flex flex-col items-center gap-0.5 text-[10px] ${
            current === t.id ? "text-brand font-bold" : "text-gray-400"
          }`}
        >
          <span className="text-lg">{t.icon}</span>
          {t.label}
        </button>
      ))}
    </div>
  );
}