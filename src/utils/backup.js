import { storage, KEYS } from "./storage";

// Semua key yang perlu di-backup (tambahin kalau ada key baru)
const BACKUP_KEYS = [
  ...Object.values(KEYS),
  "behavix_urge", // urge surfing sessions
];

// Export: kumpulin semua data → download sebagai JSON
export function exportData() {
  const data = {};
  BACKUP_KEYS.forEach((key) => {
    const value = storage.get(key);
    if (value !== null) data[key] = value;
  });

  const payload = {
    app: "BEHAVIX",
    version: "1.0",
    exportedAt: new Date().toISOString(),
    data,
  };

  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const tgl = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `behavix-backup-${tgl}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Import: baca file JSON → restore ke localStorage
export function importData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);

        // validasi format
        if (parsed.app !== "BEHAVIX" || !parsed.data) {
          throw new Error("File bukan backup BEHAVIX yang valid.");
        }

        // restore semua key
        Object.entries(parsed.data).forEach(([key, value]) => {
          if (BACKUP_KEYS.includes(key)) {
            storage.set(key, value);
          }
        });

        resolve({
          success: true,
          count: Object.keys(parsed.data).length,
          exportedAt: parsed.exportedAt,
        });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("Gagal baca file."));
    reader.readAsText(file);
  });
}