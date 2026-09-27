import { useRef, useState } from "react";
import { exportData, importData } from "../utils/backup";

export default function BackupScreen({ goBack }) {
  const fileInputRef = useRef();
  const [status, setStatus] = useState(null); // { type, msg }

  function handleExport() {
    try {
      exportData();
      setStatus({ type: "success", msg: "Data berhasil di-download. Simpan file JSON-mu di tempat aman ya 🌱" });
    } catch (err) {
      setStatus({ type: "error", msg: "Gagal export: " + err.message });
    }
  }

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const ok = window.confirm(
      "Impor data akan MENIMPA semua data yang ada di HP ini. Yakin lanjut?"
    );
    if (!ok) {
      e.target.value = "";
      return;
    }

    try {
      const result = await importData(file);
      const tgl = new Date(result.exportedAt).toLocaleString("id-ID");
      setStatus({
        type: "success",
        msg: `Berhasil impor ${result.count} data (backup dari ${tgl}). Refresh app buat liat perubahannya.`,
      });
    } catch (err) {
      setStatus({ type: "error", msg: "Gagal impor: " + err.message });
    }
    e.target.value = "";
  }

  return (
    <div className="min-h-screen bg-canvas font-sans p-5">
      <button
        onClick={goBack}
        className="w-10 h-10 rounded-xl bg-white shadow-sm text-lg text-ink mb-4"
      >
        ‹
      </button>

      <h1 className="text-2xl font-extrabold text-ink mb-2">Backup Data</h1>
      <p className="text-sm text-gray-500 mb-5">
        Data kamu disimpan di HP ini. Kalau mau pindah HP atau jaga-jaga, kamu bisa backup atau restore di sini.
      </p>

      {/* Info box */}
      <div className="bg-brand/10 rounded-2xl p-4 mb-5">
        <p className="text-xs font-bold text-brand mb-1">🔒 KENAPA INI PENTING?</p>
        <p className="text-sm text-ink leading-relaxed">
          BEHAVIX nyimpen semua data di HP kamu (bukan server), jadi kalau kamu clear browser atau ganti HP, data bisa hilang. Backup rutin biar aman.
        </p>
      </div>

      {/* Export */}
      <div className="bg-white rounded-2xl p-5 shadow-sm mb-3">
        <div className="flex items-start gap-3 mb-3">
          <div className="text-2xl">📤</div>
          <div className="flex-1">
            <p className="font-bold text-ink">Export Data</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Download semua data (check-in, jurnal, riwayat) sebagai file JSON.
            </p>
          </div>
        </div>
        <button
          onClick={handleExport}
          className="w-full bg-brand text-white rounded-xl py-3 font-semibold"
        >
          Download Backup
        </button>
      </div>

      {/* Import */}
      <div className="bg-white rounded-2xl p-5 shadow-sm mb-3">
        <div className="flex items-start gap-3 mb-3">
          <div className="text-2xl">📥</div>
          <div className="flex-1">
            <p className="font-bold text-ink">Restore Data</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Pilih file backup untuk restore. Data lama di HP ini akan ditimpa.
            </p>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full bg-accent text-white rounded-xl py-3 font-semibold"
        >
          Pilih File Backup
        </button>
      </div>

      {/* Status message */}
      {status && (
        <div
          className={`rounded-xl p-3 mt-3 text-sm ${
            status.type === "success"
              ? "bg-brand/15 text-brand"
              : "bg-red-50 text-red-600"
          }`}
        >
          {status.msg}
        </div>
      )}

      <p className="text-xs text-gray-400 text-center mt-6">
        💡 Tip: simpan file backup di Google Drive atau email ke diri sendiri.
      </p>
    </div>
  );
}