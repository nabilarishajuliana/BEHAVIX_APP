import { GUDANG_SARAN } from "../data/gudangSaran";
import { PEMICU } from "../data/pemicu";

// Ganti kalau AI Studio-mu pakai model lain
const MODEL = "gemini-3.5-flash";
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

// Susun prompt dari data check-in + gudang saran
function buildPrompt(checkin) {
  const gudang = GUDANG_SARAN.map(
    (s) =>
      `- id: ${s.id} | ${s.label} | pemicu: ${s.pemicu.join(",")} | waktu: ${s.waktu.join(
        ","
      )} | intensitas: ${s.intensitas[0]}-${s.intensitas[1]}`
  ).join("\n");

  return `Kamu asisten analisis aplikasi kesehatan mental remaja bernama BEHAVIX.
Analisis data check-in berikut, lalu lakukan 3 hal:
1) Tentukan SATU akar psikologis (pemicu) HANYA dari daftar ini: ${PEMICU.join(", ")}.
   JANGAN mengulang aktivitas pengguna. Simpulkan emosi/kebutuhan yang LEBIH DALAM dari kombinasi mood + aktivitas + jam + intensitas.
2) Tulis deskripsi hangat 1-2 kalimat (Bahasa Indonesia santai, suportif, TIDAK menghakimi) yang menjelaskan kenapa pemicu itu terbaca.
3) Pilih 2-3 saran PALING cocok dari GUDANG_SARAN (pakai "id"-nya saja, JANGAN buat saran baru), sesuai waktu & intensitas.

DATA CHECK-IN:
- mood: ${checkin.mood}
- intensitas: ${checkin.intensitas}/10
- aktivitas: ${checkin.aktivitas}
- jam: ${checkin.jam}
- waktu: ${checkin.waktu}

GUDANG_SARAN:
${gudang}

Balas JSON persis bentuk ini:
{"pemicu":"...","pemicu_label":"...","deskripsi":"...","saran":["id","id"]}`;
}

// Panggil Gemini
export async function callBehavixInsight(checkin) {
  try {
    console.log("KEY kebaca?:", API_KEY ? "YA" : "TIDAK (undefined)");
    if (!API_KEY) throw new Error("API key kosong");

    const res = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(checkin) }] }],
        generationConfig: {
          temperature: 0.4,
          responseMimeType: "application/json",
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Gemini error detail:", errText);
      throw new Error("HTTP " + res.status);
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const parsed = JSON.parse(text);
    return validate(parsed, checkin);
  } catch (e) {
    console.warn("Behavix Insight gagal, pakai fallback:", e);
    return fallback(checkin);
  }
}

// Pastikan hasil AI aman sebelum dipakai
function validate(p, checkin) {
  const validIds = new Set(GUDANG_SARAN.map((s) => s.id));
  let saran = Array.isArray(p.saran) ? p.saran.filter((id) => validIds.has(id)) : [];
  saran = saran.slice(0, 3);
  if (saran.length === 0) return fallback(checkin);
  return {
    pemicu: p.pemicu || "bosan",
    pemicu_label: p.pemicu_label || "Pola kamu",
    deskripsi: p.deskripsi || "Coba salah satu ini yuk.",
    saran,
  };
}

// Kalau AI error/timeout — jangan hang, kasih saran default
function fallback(checkin) {
  const i = checkin.intensitas || 5;
  let pemicu, label, saran;
  if (i >= 8) {
    pemicu = "stres"; label = "Dorongan kuat";
    saran = ["napas_478", "jauhin_hp", "grounding"];
  } else if ((checkin.aktivitas || "").toLowerCase().includes("medsos")) {
    pemicu = "paparan_medsos"; label = "Paparan medsos";
    saran = ["jauhin_hp", "jalan_kaki", "jurnal"];
  } else {
    pemicu = "bosan"; label = "Bosan";
    saran = ["jalan_kaki", "musik_tenang", "napas_478"];
  }
  const validIds = new Set(GUDANG_SARAN.map((s) => s.id));
  saran = saran.filter((id) => validIds.has(id));
  return {
    pemicu,
    pemicu_label: label,
    deskripsi:
      "Kadang dorongan datang tanpa alasan jelas. Nggak apa-apa — coba salah satu ini yuk.",
    saran,
  };
}