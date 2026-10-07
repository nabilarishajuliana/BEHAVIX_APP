import { BookOpen, CircleCheck, House, TrendingUp, UserRound } from "lucide-react";

const TAB_LIST = [
  { id: "beranda", label: "Beranda", icon: House },
  { id: "progres", label: "Progres", icon: TrendingUp },
  { id: "quest", label: "Aktivitas", icon: CircleCheck },
  { id: "jurnal", label: "Jurnal", icon: BookOpen },
  { id: "profil", label: "Profil", icon: UserRound },
];

export default function BottomNav({ current, goTab }) {
  return (
    <nav aria-label="Navigasi utama" className="fixed inset-x-0 bottom-0 z-20 mx-auto flex h-16 w-full max-w-[420px] border-t border-gray-100 bg-white">
      {TAB_LIST.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => goTab(t.id)}
          aria-current={current === t.id ? "page" : undefined}
          aria-label={t.label}
          className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 py-1 text-[10px] transition-colors focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-brand ${
            current === t.id ? "font-semibold text-brand" : "font-normal text-gray-500"
          }`}
        >
          <t.icon size={22} strokeWidth={current === t.id ? 2 : 1.75} aria-hidden="true" />
          <span className="truncate">{t.label}</span>
        </button>
      ))}
    </nav>
  );
}