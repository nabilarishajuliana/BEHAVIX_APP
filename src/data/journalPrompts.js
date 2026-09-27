// Kumpulan pertanyaan pemantik buat journaling
// Dikelompokin biar bisa dipilih sesuai mood/situasi
export const JOURNAL_PROMPTS = [
  // umum & refleksi harian
  "Apa yang lagi kamu pikirin?",
  "Gimana kabarnya hari ini?",
  "Ada satu hal yang bikin kamu penasaran hari ini?",

  // syukur & positif
  "Apa satu hal kecil yang bikin kamu senyum hari ini?",
  "Siapa orang yang bikin harimu lebih ringan?",
  "Apa yang kamu banggain dari diri kamu minggu ini?",

  // emosi & kesulitan
  "Ada perasaan yang lagi kamu simpan sendiri?",
  "Kalau kamu bisa cerita ke diri kamu yang kemarin, mau bilang apa?",
  "Momen apa yang paling berat hari ini? Kamu ngelewatinnya gimana?",

  // pemahaman diri
  "Apa yang paling kamu butuhin sekarang?",
  "Kalau perasaan kamu sekarang punya warna, warnanya apa? Kenapa?",
  "Satu hal yang mau kamu ubah dari minggu ini kalau bisa?",

  // pemicu & perilaku
  "Ada situasi yang sering bikin kamu ngerasa berat belakangan?",
  "Apa yang biasanya ngebantu kamu pas lagi susah?",
  "Kamu ngerasa lebih deket sama diri sendiri belakangan, apa engga?",
];

// Ambil 1 prompt acak
export function getRandomPrompt() {
  return JOURNAL_PROMPTS[Math.floor(Math.random() * JOURNAL_PROMPTS.length)];
}