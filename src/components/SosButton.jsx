import { HeartPulse } from "lucide-react";

export default function SosButton({ navigate }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[76px] z-10 mx-auto flex w-full max-w-[420px] justify-end px-4">
      <button
        type="button"
        onClick={() => navigate("urgesurfing")}
        aria-label="SOS: buka latihan urge surfing"
        className="pointer-events-auto flex h-14 w-14 flex-col items-center justify-center rounded-full bg-deep text-white shadow-md transition duration-150 hover:bg-deep/95 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        <HeartPulse size={21} strokeWidth={1.8} aria-hidden="true" />
        <span className="text-[9px] font-semibold leading-none">SOS</span>
      </button>
    </div>
  );
}