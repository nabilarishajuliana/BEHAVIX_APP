import { storage, KEYS } from "../utils/storage";
import { HeartHandshake, LockKeyhole, Smartphone, Trash2 } from "lucide-react";

const POINTS = [
  { icon: Smartphone, text: "Data disimpan di perangkat dan tidak dikirim ke server." },
  { icon: LockKeyhole, text: "Data kamu tidak dibagikan kepada pihak lain." },
  { icon: Trash2, text: "Data dapat dihapus kapan saja." },
  { icon: HeartHandshake, text: "Aplikasi ini dirancang sebagai alat bantu, bukan pengganti tenaga profesional." },
];

export default function OnboardingConsent({ params, navigate, goBack }) {
  const { username } = params;

  function handleAgree() {
    // simpan user + tandai onboarded
    storage.set(KEYS.user, { username, onboarded: true });
    // langsung ke Beranda (baseline check-in bisa dilakukan user kapan aja dari Beranda)
    navigate("beranda");
  }

  return (
    <div className="min-h-screen bg-canvas font-sans p-6 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <button onClick={goBack} className="w-10 h-10 rounded-xl bg-white shadow-sm text-lg text-ink">‹</button>
        <div className="flex gap-1.5">
          <span className="w-2 h-2 rounded-full bg-brand" />
          <span className="w-2 h-2 rounded-full bg-brand" />
          <span className="w-6 h-2 rounded-full bg-brand" />
          <span className="w-2 h-2 rounded-full bg-brand/30" />
        </div>
        <div className="w-10" />
      </div>

      <h1 className="text-2xl font-extrabold text-ink mb-2">Privasi & Keamanan</h1>
      <p className="text-sm text-gray-500 mb-6">Data kamu tetap berada di perangkatmu.</p>

      <div className="flex flex-col gap-3 mb-auto">
        {POINTS.map((p, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 shadow-sm flex items-start gap-3">
            <p.icon className="mt-0.5 shrink-0 text-brand" size={21} aria-hidden="true" />
            <p className="text-sm text-ink leading-relaxed">{p.text}</p>
          </div>
        ))}
      </div>

      <button
        onClick={handleAgree}
        className="w-full bg-accent text-white rounded-2xl py-4 font-bold shadow-md mt-6"
      >
        Setuju & Lanjut →
      </button>
    </div>
  );
}