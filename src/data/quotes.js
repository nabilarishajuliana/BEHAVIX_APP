// Kumpulan kalimat self-compassion & motivasi lembut
// Bergantian tiap hari (deterministik: sama sepanjang hari, ganti besoknya)
export const QUOTES = [
  { teks: "Kamu nggak harus punya semua jawaban hari ini. Cukup satu langkah kecil aja.", emoji: "🌱" },
  { teks: "Ngerasa berat bukan berarti kamu lemah. Kadang itu tanda kamu udah kuat lama banget.", emoji: "💚" },
  { teks: "Kemajuan itu bukan garis lurus. Naik-turun itu normal.", emoji: "🌊" },
  { teks: "Kamu berhak istirahat, tanpa harus buktiin dulu kamu layak.", emoji: "🌸" },
  { teks: "Perlahan aja. Tanaman yang paling kuat tumbuhnya juga pelan-pelan.", emoji: "🌿" },
  { teks: "Kamu bukan pikiranmu. Kamu yang ngamatin pikiran itu.", emoji: "🕊️" },
  { teks: "Berterima kasih ke diri sendiri hari ini — kamu udah sampai sejauh ini.", emoji: "💛" },
  { teks: "Dorongan datang dan pergi. Kamu yang tetap.", emoji: "🌀" },
  { teks: "Nggak apa-apa kalau hari ini cuma bisa bernapas. Itu udah cukup.", emoji: "🕯️" },
  { teks: "Setiap check-in itu bentuk kamu peduli sama diri sendiri.", emoji: "🌟" },
  { teks: "Kamu nggak sendirian dalam ini, meski kadang rasanya begitu.", emoji: "🫂" },
  { teks: "Ngasih waktu ke diri sendiri buat sembuh itu bukan kemunduran.", emoji: "🌷" },
  { teks: "Kamu boleh bangga sama langkah kecil yang orang lain nggak liat.", emoji: "✨" },
  { teks: "Berat tapi bisa kok — lihat aja, kamu udah buktiin banyak kali.", emoji: "🌈" },
  { teks: "Kadang, sekedar hadir buat diri sendiri itu udah pencapaian besar.", emoji: "🍃" },
];

// Ambil quote berdasarkan tanggal (deterministik — sama sepanjang hari)
export function getQuoteHariIni() {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
  );
  return QUOTES[dayOfYear % QUOTES.length];
}