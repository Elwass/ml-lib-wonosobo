/**
 * Data Agregat BMKG Mojotengah, Wonosobo (1990 - 2026)
 * Berdasarkan dataset Pos Hujan Mojotengah (33071101a)
 */

export interface MonthlyRainfall {
  tahun: number;
  bulan: number; // 1-12
  curah_hujan_total_mm: number;
  hari_hujan_hh: number;
  curah_hujan_maks_harian_mm: number;
}

export interface DailyRainfallSample {
  tanggal: string;
  curah_hujan_mm: number;
  klasifikasi: string;
  tingkat_bahaya: 'Aman' | 'Waspada' | 'Siaga' | 'Bahaya';
}

// Rata-rata historis bulanan curah hujan Mojotengah (dihitung dari data 1990-2026)
export const RATA_RATA_BULANAN_MOJOTENGAH = [
  { bulan: 1, nama: 'Januari', ch_avg: 504.2, hh_avg: 29.8, ch_max_avg: 62.4, status: 'Musim Hujan Lebat (Puncak)', risiko_patek: 'Tinggi', risiko_banjir: 'Tinggi' },
  { bulan: 2, nama: 'Februari', ch_avg: 489.1, hh_avg: 27.6, ch_max_avg: 58.7, status: 'Musim Hujan Lebat (Puncak)', risiko_patek: 'Sangat Tinggi', risiko_banjir: 'Tinggi' },
  { bulan: 3, nama: 'Maret', ch_avg: 482.6, hh_avg: 29.5, ch_max_avg: 64.3, status: 'Musim Hujan Lebat', risiko_patek: 'Tinggi', risiko_banjir: 'Sedang' },
  { bulan: 4, nama: 'April', ch_avg: 396.4, hh_avg: 28.1, ch_max_avg: 46.2, status: 'Pancaroba Akhir (Transisi)', risiko_patek: 'Sedang', risiko_banjir: 'Sedang' },
  { bulan: 5, nama: 'Mei', ch_avg: 228.7, hh_avg: 24.3, ch_max_avg: 36.8, status: 'Awal Kemarau Basah', risiko_patek: 'Rendah', risiko_banjir: 'Rendah' },
  { bulan: 6, nama: 'Juni', ch_avg: 138.4, hh_avg: 19.1, ch_max_avg: 32.1, status: 'Kemarau Basah (Optimal Tanam)', risiko_patek: 'Sangat Rendah', risiko_banjir: 'Aman' },
  { bulan: 7, nama: 'Juli', ch_avg: 98.2, hh_avg: 16.4, ch_max_avg: 25.4, status: 'Puncak Kemarau (Kering Aman)', risiko_patek: 'Sangat Rendah', risiko_banjir: 'Aman' },
  { bulan: 8, nama: 'Agustus', ch_avg: 84.6, hh_avg: 14.8, ch_max_avg: 22.1, status: 'Puncak Kemarau (Optimal Panen)', risiko_patek: 'Sangat Rendah', risiko_banjir: 'Aman' },
  { bulan: 9, nama: 'September', ch_avg: 146.9, hh_avg: 18.2, ch_max_avg: 38.6, status: 'Transisi Awal Hujan (Labuhan)', risiko_patek: 'Rendah-Sedang', risiko_banjir: 'Aman' },
  { bulan: 10, nama: 'Oktober', ch_avg: 322.5, hh_avg: 24.8, ch_max_avg: 54.1, status: 'Awal Musim Hujan', risiko_patek: 'Sedang', risiko_banjir: 'Sedang' },
  { bulan: 11, nama: 'November', ch_avg: 568.3, hh_avg: 28.7, ch_max_avg: 74.9, status: 'Musim Hujan Sangat Lebat', risiko_patek: 'Sangat Tinggi', risiko_banjir: 'Sangat Tinggi' },
  { bulan: 12, nama: 'Desember', ch_avg: 588.9, hh_avg: 29.9, ch_max_avg: 78.4, status: 'Musim Hujan Sangat Lebat', risiko_patek: 'Sangat Tinggi', risiko_banjir: 'Sangat Tinggi' },
];

// Data curah hujan historis per tahun (ringkasan 2019-2026)
export const RINGKASAN_TAHUNAN_MOJOTENGAH = [
  { tahun: 2019, total_ch: 5163.4, hari_hujan: 326, ch_max: 156.7 },
  { tahun: 2020, total_ch: 6537.6, hari_hujan: 354, ch_max: 218.2 },
  { tahun: 2021, total_ch: 5228.1, hari_hujan: 351, ch_max: 165.9 },
  { tahun: 2022, total_ch: 5059.2, hari_hujan: 356, ch_max: 123.6 },
  { tahun: 2023, total_ch: 3361.2, hari_hujan: 326, ch_max: 94.8 },
  { tahun: 2024, total_ch: 4912.2, hari_hujan: 336, ch_max: 89.3 },
  { tahun: 2025, total_ch: 4371.8, hari_hujan: 339, ch_max: 86.3 },
  { tahun: 2026, total_ch: 1994.5, hari_hujan: 236, ch_max: 57.0 }, // Berjalan s.d. September 2026
];

// Sampel data cuaca harian terkini untuk simulasi prediksi & mitigasi cuaca harian Desa Blederan
export const DATA_CUACA_TERKINI_BLEDERAN = [
  { tanggal: '2026-09-24', curah_hujan_mm: 4.9, klasifikasi: 'Hujan Sangat Ringan (0.1 - 5.0 mm)', suhu_min: 17, suhu_max: 23, kelembapan: 82, kecepatan_angin_kmh: 12 },
  { tanggal: '2026-09-25', curah_hujan_mm: 9.6, klasifikasi: 'Hujan Ringan (5.1 - 20.0 mm)', suhu_min: 16, suhu_max: 22, kelembapan: 86, kecepatan_angin_kmh: 14 },
  { tanggal: '2026-09-26', curah_hujan_mm: 5.1, klasifikasi: 'Hujan Ringan (5.1 - 20.0 mm)', suhu_min: 17, suhu_max: 22, kelembapan: 85, kecepatan_angin_kmh: 10 },
  { tanggal: '2026-09-27', curah_hujan_mm: 7.8, klasifikasi: 'Hujan Ringan (5.1 - 20.0 mm)', suhu_min: 16, suhu_max: 23, kelembapan: 88, kecepatan_angin_kmh: 11 },
  { tanggal: '2026-09-28', curah_hujan_mm: 5.6, klasifikasi: 'Hujan Ringan (5.1 - 20.0 mm)', suhu_min: 17, suhu_max: 23, kelembapan: 84, kecepatan_angin_kmh: 9 },
  { tanggal: '2026-09-29', curah_hujan_mm: 12.6, klasifikasi: 'Hujan Ringan (5.1 - 20.0 mm)', suhu_min: 16, suhu_max: 21, kelembapan: 90, kecepatan_angin_kmh: 15 },
  // Prediksi 7 hari ke depan (Transisi Oktober Awal Hujan)
  { tanggal: '2026-09-30', curah_hujan_mm: 22.4, klasifikasi: 'Hujan Sedang (20.1 - 50.0 mm)', suhu_min: 16, suhu_max: 21, kelembapan: 92, kecepatan_angin_kmh: 18, isForecast: true },
  { tanggal: '2026-10-01', curah_hujan_mm: 38.5, klasifikasi: 'Hujan Sedang (20.1 - 50.0 mm)', suhu_min: 15, suhu_max: 20, kelembapan: 95, kecepatan_angin_kmh: 22, isForecast: true },
  { tanggal: '2026-10-02', curah_hujan_mm: 68.2, klasifikasi: 'Hujan Lebat (50.1 - 100.0 mm) [PERINGATAN]', suhu_min: 15, suhu_max: 19, kelembapan: 98, kecepatan_angin_kmh: 28, isForecast: true, isExtreme: true },
  { tanggal: '2026-10-03', curah_hujan_mm: 84.0, klasifikasi: 'Hujan Lebat (50.1 - 100.0 mm) [PERINGATAN]', suhu_min: 14, suhu_max: 18, kelembapan: 99, kecepatan_angin_kmh: 32, isForecast: true, isExtreme: true },
  { tanggal: '2026-10-04', curah_hujan_mm: 31.0, klasifikasi: 'Hujan Sedang (20.1 - 50.0 mm)', suhu_min: 15, suhu_max: 20, kelembapan: 93, kecepatan_angin_kmh: 16, isForecast: true },
];

/**
 * Klasifikasi BMKG untuk curah hujan harian
 */
export function getKlasifikasiBMKG(mm: number): { text: string; color: string; level: 'Aman' | 'Waspada' | 'Siaga' | 'Awas' } {
  if (mm <= 0.1) return { text: 'Berawan / Tidak Hujan (0 mm)', color: 'text-stone-600', level: 'Aman' };
  if (mm <= 5.0) return { text: 'Hujan Sangat Ringan (0.1 - 5.0 mm)', color: 'text-emerald-600', level: 'Aman' };
  if (mm <= 20.0) return { text: 'Hujan Ringan (5.1 - 20.0 mm)', color: 'text-sky-600', level: 'Aman' };
  if (mm <= 50.0) return { text: 'Hujan Sedang (20.1 - 50.0 mm)', color: 'text-amber-600', level: 'Waspada' };
  if (mm <= 100.0) return { text: 'Hujan Lebat (50.1 - 100.0 mm)', color: 'text-orange-600', level: 'Siaga' };
  return { text: 'Hujan Sangat Lebat (> 100.0 mm)', color: 'text-rose-600', level: 'Awas' };
}
