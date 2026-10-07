import { storage, KEYS } from "../utils/storage";

export default function OnboardingWelcome({ navigate }) {
  // Cek: apakah ada user tersimpan? Kalau ada → tampilin opsi ke Login
  const savedUser = storage.get(KEYS.user);
  const hasAccount = savedUser && savedUser.onboarded;

  return (
    <div className="min-h-screen bg-canvas font-sans p-6 flex flex-col items-center">
      {/* progress dots */}
      <div className="flex gap-1.5 mt-4 mb-8">
        <span className="w-6 h-2 rounded-full bg-brand" />
        <span className="w-2 h-2 rounded-full bg-brand/30" />
        <span className="w-2 h-2 rounded-full bg-brand/30" />
        <span className="w-2 h-2 rounded-full bg-brand/30" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center px-2">
        <div className="w-32 h-32 flex items-center justify-center mb-8">
          <img src="/logo-behavix.png" alt="Logo Behavix" className="w-full h-full object-contain" />
        </div>
        <h1 className="text-3xl font-extrabold text-ink mb-3">
          Halo, seneng<br />kamu di sini!
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          Aku Behavix! aku bakal nemenin kamu pelan-pelan,<br />
          tanpa menghakimi. Nggak ada yang perlu buru-buru.
        </p>
      </div>

      <button
        onClick={() => navigate("onboardingUsername")}
        className="w-full bg-accent text-white rounded-2xl py-4 font-bold text-lg shadow-md mb-3"
      >
        Mulai →
      </button>

      {/* Tombol ke Login kalau udah punya akun */}
      {hasAccount && (
        <button
          onClick={() => navigate("login")}
          className="text-sm text-gray-500"
        >
          Udah punya akun? <span className="text-brand font-bold">Login di sini</span>
        </button>
      )}
    </div>
  );
}