import { storage, KEYS } from "./storage";

// Cek apakah SAAT INI mendekati waktu rawan user
export function cekNudgePreventif() {
  const checkins = storage.get(KEYS.checkins, []);

  // butuh minimal 7 check-in buat deteksi pola
  if (checkins.length < 7) return null;

  const now = new Date();
  const jamSekarang = now.getHours();
  const hariSekarang = now.getDay(); // 0=Minggu, 1=Senin, dst

  // hitung frekuensi dorongan per (hari, waktu)
  // waktu: pagi/siang/sore/malam
  const pola = {}; // key: "hari_waktu", value: jumlah dorongan
  checkins.forEach((c) => {
    if (!c.adaDorongan || !c.waktu) return;
    const tgl = new Date(c.waktu_iso);
    const key = `${tgl.getDay()}_${c.waktu}`;
    pola[key] = (pola[key] || 0) + 1;
  });

  // cari slot dengan dorongan terbanyak
  const entries = Object.entries(pola).sort((a, b) => b[1] - a[1]);
  if (entries.length === 0) return null;

  const [topKey, topCount] = entries[0];
  if (topCount < 3) return null; // pola belum cukup kuat

  const [hariRawan, waktuRawan] = topKey.split("_");

  // waktu sekarang termasuk waktu apa
  const waktuNow =
    jamSekarang < 11 ? "pagi" :
    jamSekarang < 15 ? "siang" :
    jamSekarang < 18 ? "sore" : "malam";

  // apakah SEKARANG cocok sama waktu rawan?
  const cocokHari = Number(hariRawan) === hariSekarang;
  const cocokWaktu = waktuRawan === waktuNow;

  if (!cocokHari && !cocokWaktu) return null;

  // bikin pesan berdasarkan tingkat kecocokan
  const namaHari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const namaWaktu = { pagi: "pagi", siang: "siang", sore: "sore", malam: "malam" };

  if (cocokHari && cocokWaktu) {
    return {
      level: "kuat",
      teks: `${namaHari[hariRawan]} ${namaWaktu[waktuRawan]} biasanya agak berat buat kamu. Mau siapin kegiatan dulu?`,
    };
  }
  if (cocokWaktu) {
    return {
      level: "sedang",
      teks: `${namaWaktu[waktuRawan].charAt(0).toUpperCase() + namaWaktu[waktuRawan].slice(1)} ini biasanya waktu yang agak menantang. Mau coba aktivitas ringan?`,
    };
  }
  return null;
}