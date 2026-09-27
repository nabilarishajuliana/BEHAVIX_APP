import { storage, KEYS } from "../utils/storage";

const POINTS = [
  { icon: "📱", text: "Data disimpan di HP-mu — nggak dikirim ke server manapun." },
  { icon: "🔒", text: "Nggak dibagikan ke siapa pun." },
  { icon: "🗑️", text: "Bisa kamu hapus kapan aja." },
  { icon: "💚", text: "Ini alat bantu, bukan pengganti profesional." },
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

      <h1 className="text-2xl font-extrabold text-ink mb-2">Privasimu</h1>
      <p className="text-sm text-gray-500 mb-6">Singkat aja, biar kamu tenang:</p>

      <div className="flex flex-col gap-3 mb-auto">
        {POINTS.map((p, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 shadow-sm flex items-start gap-3">
            <div className="text-2xl">{p.icon}</div>
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