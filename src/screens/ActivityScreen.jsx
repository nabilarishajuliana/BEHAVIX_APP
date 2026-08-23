import BreathingTimer from "../components/BreathingTimer";
import { storage, KEYS } from "../utils/storage";

export default function ActivityScreen({ params, navigate, goBack }) {
  const { saran } = params;

  function finish() {
    // catat "pernah dicoba"
    const q = storage.get(KEYS.quests, {});
    const prev = q[saran.id]?.doneCount || 0;
    storage.set(KEYS.quests, { ...q, [saran.id]: { doneCount: prev + 1 } });
    navigate("beranda");
  }

  const isNapas = saran.tool === "napas" || saran.tool === "timer";

  return (
    <div className={`min-h-screen font-sans p-6 flex flex-col ${isNapas ? "bg-deep" : "bg-canvas"}`}>
      <button
        onClick={goBack}
        className={`w-9 h-9 rounded-full border self-start ${isNapas ? "border-white/40 text-white" : "border-gray-300"}`}
      >‹</button>

      {isNapas ? (
        <>
          <h1 className="text-white text-xl font-bold text-center mt-6 mb-1">Tarik napas bareng, yuk 🌊</h1>
          <p className="text-white/60 text-sm text-center mb-10">Nggak usah mikir apa-apa. Cukup ikutin lingkarannya.</p>
          <div className="flex-1 flex items-center justify-center">
            <BreathingTimer duration={180} onDone={finish} />
          </div>
          <p className="text-white/70 text-sm text-center mb-4">
            Dorongan ini kayak ombak — dia bakal naik, terus surut sendiri.
          </p>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold text-ink mt-6 mb-2">{saran.label}</h1>
          <p className="text-gray-500 mb-8">Durasi kira-kira: {saran.durasi}. Lakukan pelan-pelan aja.</p>
          <div className="flex-1" />
        </>
      )}

      <button
        onClick={finish}
        className="w-full rounded-xl py-3.5 font-semibold text-white bg-accent"
      >
        Selesai
      </button>
    </div>
  );
}