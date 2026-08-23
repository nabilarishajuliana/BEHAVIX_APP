export default function SosButton({ navigate }) {
  return (
    <button
      onClick={() => navigate("urgesurfing")}
      className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-brand text-white
                 text-xs font-bold shadow-lg flex items-center justify-center z-10"
    >
      SOS
    </button>
  );
}