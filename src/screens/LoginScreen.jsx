import { useEffect, useRef, useState } from "react";
import { storage, KEYS } from "../utils/storage";

// Sensor username: ambil huruf pertama, sisanya jadi *
// contoh: "skywalker" → "s********"
function sensorUsername(name) {
  if (!name || name.length === 0) return "";
  if (name.length === 1) return name;
  return name[0] + "*".repeat(name.length - 1);
}

export default function LoginScreen({ navigate }) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [restartUser, setRestartUser] = useState(null);
  const confirmDialogRef = useRef(null);

  useEffect(() => {
    const dialog = confirmDialogRef.current;
    if (restartUser && dialog && !dialog.open) dialog.showModal();
    return () => {
      if (dialog?.open) dialog.close();
    };
  }, [restartUser]);

  function handleLogin() {
    const savedUser = storage.get(KEYS.user);
    if (!savedUser || !savedUser.username) {
      setError("Belum ada akun. Silakan mulai dari awal.");
      return;
    }
    if (savedUser.username.toLowerCase() !== username.trim().toLowerCase()) {
      setError("Username nggak cocok. Coba lagi ya.");
      return;
    }
    navigate("beranda");
  }

  function handleMulaiDariAwal() {
    const savedUser = storage.get(KEYS.user);
    if (savedUser && savedUser.onboarded) {
      setRestartUser({ username: sensorUsername(savedUser.username) });
      return;
    }
    navigate("onboardingWelcome");
  }

  function handleConfirmRestart() {
    storage.clearAll();
    setRestartUser(null);
    navigate("onboardingWelcome");
  }

  return (
    <div className="min-h-screen bg-canvas font-sans p-6 flex flex-col items-center justify-center">
      {/* logo/maskot */}
      <div className="w-24 h-24 flex items-center justify-center mb-6">
        <img src="/logo-behavix.png" alt="Logo Behavix" className="w-full h-full object-contain" />
      </div>

      <h1 className="text-2xl font-extrabold text-ink text-center mb-1">
        Selamat datang kembali
      </h1>
      <p className="text-sm text-gray-500 text-center mb-8">
        Masukkan username kamu buat lanjut.
      </p>

      <input
        value={username}
        onChange={(e) => { setUsername(e.target.value); setError(""); }}
        placeholder="username kamu"
        className="w-full max-w-xs bg-white rounded-2xl px-4 py-3.5 shadow-sm outline-none text-ink text-center mb-3"
      />

      {error && (
        <p className="text-sm text-red-500 mb-3">{error}</p>
      )}

      <button
        onClick={handleLogin}
        disabled={!username.trim()}
        className={`w-full max-w-xs rounded-2xl py-3.5 font-bold text-white mb-6 ${
          username.trim() ? "bg-accent shadow-md" : "bg-gray-300"
        }`}
      >
        Masuk →
      </button>

      <button
        type="button"
        onClick={handleMulaiDariAwal}
        className="min-h-11 rounded-xl px-3 text-sm text-gray-500 transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        Belum punya? <span className="text-brand font-bold">Mulai dari awal</span>
      </button>

      <dialog
        ref={confirmDialogRef}
        onCancel={(event) => {
          event.preventDefault();
          setRestartUser(null);
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) setRestartUser(null);
        }}
        aria-labelledby="restart-title"
        aria-describedby="restart-description"
        className="fixed inset-0 m-auto max-h-[calc(100%-2rem)] w-[calc(100%-2rem)] max-w-sm overflow-y-auto rounded-2xl bg-canvas p-0 text-ink shadow-md backdrop:bg-ink/45"
      >
        <div className="p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">
            Konfirmasi
          </p>
          <h2 id="restart-title" className="mt-2 text-xl font-extrabold text-ink">
            Hapus data dan mulai ulang?
          </h2>
          <p id="restart-description" className="mt-3 text-sm leading-relaxed text-gray-500">
            Akun <span className="font-semibold text-ink">{restartUser?.username}</span> sudah tersimpan. Jika kamu mulai ulang, semua data check-in, jurnal, dan riwayat akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.
          </p>
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              autoFocus
              onClick={() => setRestartUser(null)}
              className="min-h-11 rounded-xl bg-white px-4 text-sm font-semibold text-ink transition-colors hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleConfirmRestart}
              className="min-h-11 rounded-xl bg-accent px-4 text-sm font-semibold text-white transition-colors hover:bg-accent/90 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Hapus dan mulai ulang
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}