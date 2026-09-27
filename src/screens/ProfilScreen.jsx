import { storage, KEYS } from "../utils/storage";

export default function ProfilScreen({ navigate }) {
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
      <h1 className="text-2xl font-extrabold text-ink mb-1">Profil 🙂</h1>
      <p className="text-sm text-gray-500 mb-5">
        Semua kendali ada di tangan kamu.
      </p>

      {/* username card */}
      <div className="bg-brand rounded-2xl p-5 text-white mb-4">
        <p className="text-xs font-semibold opacity-90">USERNAME KAMU</p>
        <p className="text-2xl font-extrabold mt-1">👋 {user.username}</p>
        <button
          onClick={() => navigate("ubahUsername")}
          className="mt-3 text-xs bg-white/20 rounded-full px-3 py-1.5 font-semibold"
        >
          ✏️ Ubah username
        </button>
      </div>

      {/* menu items */}
      <div className="flex flex-col gap-3 mb-4">
        <MenuItem
          icon="⏰"
          title="Atur Pengingat"
          subtitle="Jadwal check-in harian"
          onClick={() => navigate("aturPengingat")}
        />
        <MenuItem
          icon="🩺"
          title="Opsi Konsultasi Psikolog"
          subtitle="Cari bantuan profesional"
          onClick={() => navigate("konsultasi")}
        />
        <MenuItem
          icon="💾"
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
        <div className="text-2xl">🆘</div>
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
        Behavix v1.0 — dibikin dengan hati 💜
      </p>
    </div>
  );
}

function MenuItem({ icon, title, subtitle, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3 text-left"
    >
      <div className="text-2xl">{icon}</div>
      <div className="flex-1">
        <p className="font-bold text-ink">{title}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
      <span className="text-gray-400">›</span>
    </button>
  );
}
