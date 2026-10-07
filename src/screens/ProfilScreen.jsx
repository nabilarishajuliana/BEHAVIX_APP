import { storage, KEYS } from "../utils/storage";
import { Clock3, DatabaseBackup, Moon, Pencil, ShieldAlert, Stethoscope, Sun, UserRound } from "lucide-react";

export default function ProfilScreen({ navigate, theme, setTheme }) {
  const user = storage.get(KEYS.user, { username: "kamu" });

  function hapusData() {
    const ok = window.confirm(
      "Yakin mau hapus semua data? Ini nggak bisa dibalikin ya.",
    );
    if (!ok) return;
    storage.clearAll();
    navigate("onboardingWelcome");
  }

  return (
    <div className="min-h-screen bg-canvas font-sans p-5 pb-24">
      <h1 className="text-2xl font-extrabold text-ink mb-1">Profil</h1>
      <p className="text-sm text-gray-500 mb-5">
        Semua kendali ada di tangan kamu.
      </p>

      <section className="mb-4 rounded-2xl bg-white p-4 shadow-sm" aria-labelledby="appearance-title">
        <h2 id="appearance-title" className="mb-3 text-sm font-semibold text-ink">Tampilan</h2>
        <div className="grid grid-cols-2 gap-1 rounded-xl bg-gray-50 p-1" role="group" aria-label="Pilih mode tampilan">
          <button
            type="button"
            onClick={() => setTheme("light")}
            aria-pressed={theme === "light"}
            className={`flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${theme === "light" ? "bg-white text-brand shadow-sm" : "text-gray-500 hover:text-ink"}`}
          >
            <Sun size={17} aria-hidden="true" />
            Light
          </button>
          <button
            type="button"
            onClick={() => setTheme("dark")}
            aria-pressed={theme === "dark"}
            className={`flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${theme === "dark" ? "bg-white text-brand shadow-sm" : "text-gray-500 hover:text-ink"}`}
          >
            <Moon size={17} aria-hidden="true" />
            Dark
          </button>
        </div>
      </section>

      {/* username card */}
      <div className="bg-brand rounded-2xl p-5 text-white mb-4">
        <p className="text-xs font-semibold opacity-90">USERNAME KAMU</p>
        <p className="mt-1 flex items-center gap-2 text-2xl font-extrabold"><UserRound size={22} aria-hidden="true" /> {user.username}</p>
        <button
          onClick={() => navigate("ubahUsername")}
          className="mt-3 text-xs bg-white/20 rounded-full px-3 py-1.5 font-semibold"
        >
          <span className="inline-flex items-center gap-1.5"><Pencil size={14} aria-hidden="true" /> Ubah username</span>
        </button>
      </div>

      {/* menu items */}
      <div className="flex flex-col gap-3 mb-4">
        <MenuItem
          icon={Clock3}
          title="Atur Pengingat"
          subtitle="Jadwal check-in harian"
          onClick={() => navigate("aturPengingat")}
        />
        <MenuItem
          icon={Stethoscope}
          title="Opsi Konsultasi Psikolog"
          subtitle="Cari bantuan profesional"
          onClick={() => navigate("konsultasi")}
        />
        <MenuItem
          icon={DatabaseBackup}
          title="Backup Data"
          subtitle="Export & restore data kamu"
          onClick={() => navigate("backup")}
        />
      </div>

      {/* CRISIS - dibedakan */}
      <button
        onClick={() => navigate("krisis")}
        className="w-full bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex items-center gap-3 mb-6 text-left"
      >
        <ShieldAlert className="shrink-0 text-red-500" size={24} aria-hidden="true" />
        <div className="flex-1">
          <p className="font-bold text-red-600">Jalur Krisis / Hotline</p>
          <p className="text-xs text-red-500">
            Butuh bantuan sekarang? Selalu ada di sini.
          </p>
        </div>
        <span className="text-red-400">›</span>
      </button>

      {/* delete */}
      <button
        onClick={hapusData}
        className="w-full text-center text-sm text-red-500 py-3 font-semibold"
      >
        Hapus semua data
      </button>

      <p className="text-center text-xs text-gray-400 mt-6">
        Behavix v1.0
      </p>
    </div>
  );
}

function MenuItem({ icon: Icon, title, subtitle, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3 text-left"
    >
      <Icon className="shrink-0 text-brand" size={22} aria-hidden="true" />
      <div className="flex-1">
        <p className="font-bold text-ink">{title}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
      <span className="text-gray-400">›</span>
    </button>
  );
}
