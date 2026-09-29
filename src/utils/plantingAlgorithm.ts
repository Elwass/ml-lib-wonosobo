/**
 * Algoritma Rekomendasi Waktu Tanam & Prediksi Gagal Panen
 * Berdasarkan Data Curah Hujan BMKG Pos Mojotengah & Tren Harga Historis Wonosobo
 */

import { RATA_RATA_BULANAN_MOJOTENGAH } from '../data/bmkgData';
import { KOMODITAS_UNGGULAN_BLEDERAN } from '../data/agricultureData';
import { DATA_HARGA_KOMODITAS } from '../data/marketData';

export interface PlantingRecommendationResult {
  komoditasId: string;
  komoditasNama: string;
  bulanTanam: number; // 1-12
  namaBulanTanam: string;
  bulanPanenPerkiraan: string;
  skorKelayakan: number; // 0 - 100
  kategori: 'Sangat Baik (Sultan)' | 'Baik (Aman & Stabil)' | 'Waspada (Harga Tinggi Tapi Risiko Ekstrem)' | 'Kurang Disarankan';
  alasanCuaca: string;
  alasanHarga: string;
  risikoGagalPanen: {
    tingkat: 'Rendah' | 'Sedang' | 'Tinggi' | 'Kritis';
    persentase: number;
    penyebabUtama: string[];
    langkahMitigasi: string[];
  };
  estimasiKeuntunganPerUbin: number; // Rupiah per 1 ubin (14 m2)
  estimasiKeuntunganPerHa: number;
}

export function hitungRekomendasiTanam(
  komoditasId: string,
  bulanPilihan?: number
): PlantingRecommendationResult[] {
  const komoditas = KOMODITAS_UNGGULAN_BLEDERAN.find((k) => k.id === komoditasId) || KOMODITAS_UNGGULAN_BLEDERAN[0];
  const hargaData = DATA_HARGA_KOMODITAS.find((h) => h.komoditas.toLowerCase().includes(komoditas.nama.toLowerCase().split(' ')[0])) || DATA_HARGA_KOMODITAS[0];

  const results: PlantingRecommendationResult[] = [];

  // Hitung untuk 12 bulan (atau fokus bulan pilihan)
  for (let b = 1; b <= 12; b++) {
    const dataBulanTanam = RATA_RATA_BULANAN_MOJOTENGAH[b - 1];
    
    // Masa tumbuh ke panen (rata-rata 3 bulan untuk cabai, 2.5 bulan tomat)
    const durasiBulan = Math.round(komoditas.umurHari / 30);
    const bulanPanenIdx = ((b - 1 + durasiBulan) % 12);
    const dataBulanPanen = RATA_RATA_BULANAN_MOJOTENGAH[bulanPanenIdx];

    // Evaluasi Curah Hujan saat tanam & saat panen
    // Mojotengah curah hujan puncak: Nov, Des, Jan, Feb, Mar (>450mm)
    // Curah hujan rendah: Jun, Jul, Agu (<150mm)
    let skorCuaca = 50;
    const chPanen = dataBulanPanen.ch_avg;
    const chTanam = dataBulanTanam.ch_avg;

    // Evaluasi Risiko Gagal Panen
    let persentaseRisiko = 20;
    const penyebab: string[] = [];
    const mitigasi: string[] = [];

    // Jika fase panen jatuh di bulan hujan lebat (Nov - Mar)
    if (chPanen > 450) {
      persentaseRisiko += 45;
      penyebab.push('Curah hujan > 450 mm/bulan memicu ledakan spora antraknosa (patek) dan busuk buah');
      penyebab.push('Tanah andosol lereng Blederan rentan jenuh air, menyebabkan busuk akar Phytophthora');
      mitigasi.push('Tinggikan bedengan/guludan menjadi minimal 40 - 50 cm');
      mitigasi.push('Gunakan mulsa plastik hitam perak (MPHP) baru dengan lubang tanam rapi');
      mitigasi.push('Aplikasi fungisida protektif berbahan aktif Mankozeb / Tembaga Hidroksida secara preventif');
      mitigasi.push('Kocor Trichoderma sp. pada lubang tanam sebelum bibit dipindahkan');
    } else if (chPanen > 200) {
      persentaseRisiko += 20;
      penyebab.push('Kelembapan sedang berpotensi bercak daun Cercospora');
      mitigasi.push('Jaga jarak tanam lebar (minimal 60x60 cm) untuk sirkulasi udara antar tajuk');
    } else {
      // Panen di musim kemarau (Jun - Sep)
      persentaseRisiko += 5;
      if (chTanam < 100) {
        penyebab.push('Kekurangan air irigasi saat awal pertumbuhan vegetatif');
        mitigasi.push('Siapkan pompa air diesel/solar dari Kali Gung atau embung mini Blederan');
      }
      penyebab.push('Potensi serangan kutu kebul (vektor virus kuning gemini) & hama trips');
      mitigasi.push('Pasang perangkap likat kuning (yellow sticky trap) 40 lembar per hektar');
    }

    // Evaluasi Harga Historis saat Panen
    // Harga cabai rawit/keriting selalu melonjak di akhir tahun s.d. maret (musim hujan)
    let skorHarga = 50;
    const isMusimHargaTinggi = [11, 12, 1, 2, 3].includes(bulanPanenIdx + 1);
    const isMusimHargaRendah = [6, 7, 8].includes(bulanPanenIdx + 1);

    if (isMusimHargaTinggi) {
      skorHarga = 95;
    } else if (isMusimHargaRendah) {
      skorHarga = 40;
    } else {
      skorHarga = 70;
    }

    // Skor Kelayakan gabungan
    // Window Gadu (Tanam Mei/Juni -> Panen Agu/Sep): Risiko gagal panen terendah, biaya murah, hasil mulus
    // Window Labuhan (Tanam Sep/Okt -> Panen Des/Jan/Feb): Risiko tinggi TAPI harga melambung tinggi!
    let kategori: PlantingRecommendationResult['kategori'] = 'Baik (Aman & Stabil)';
    let skorKelayakan = 75;

    if (b === 5 || b === 6) {
      // Mei - Juni (Musim Gadu Emas)
      kategori = 'Sangat Baik (Sultan)';
      skorKelayakan = 95;
      persentaseRisiko = 15;
    } else if (b === 9 || b === 10) {
      // September - Oktober (Kejar Harga Puncak Akhir Tahun)
      kategori = 'Waspada (Harga Tinggi Tapi Risiko Ekstrem)';
      skorKelayakan = 85;
      persentaseRisiko = 65;
    } else if (b >= 11 || b <= 2) {
      // Tanam pas puncak hujan (Nov - Feb)
      kategori = 'Kurang Disarankan';
      skorKelayakan = 45;
      persentaseRisiko = 80;
    } else {
      kategori = 'Baik (Aman & Stabil)';
      skorKelayakan = 70;
    }

    const tingkatRisiko: PlantingRecommendationResult['risikoGagalPanen']['tingkat'] =
      persentaseRisiko >= 70 ? 'Kritis' : persentaseRisiko >= 50 ? 'Tinggi' : persentaseRisiko >= 30 ? 'Sedang' : 'Rendah';

    // Estimasi Keuntungan
    const estHargaKg = isMusimHargaTinggi ? hargaData.hargaTertinggi * 0.75 : isMusimHargaRendah ? hargaData.hargaTerendah * 1.1 : hargaData.hargaSekarang;
    const hasilPanenKgHa = komoditas.produktivitasRataRataKwHa * 100 * (1 - persentaseRisiko / 200);
    const omzetHa = hasilPanenKgHa * estHargaKg;
    const profitHa = Math.max(0, omzetHa - komoditas.biayaProduksiPerHa);
    const profitUbin = Math.round(profitHa / (10000 / 14)); // 1 ubin = 14 m2

    results.push({
      komoditasId: komoditas.id,
      komoditasNama: komoditas.nama,
      bulanTanam: b,
      namaBulanTanam: dataBulanTanam.nama,
      bulanPanenPerkiraan: `${dataBulanPanen.nama} (${durasiBulan} bulan ke depan)`,
      skorKelayakan,
      kategori,
      alasanCuaca: `Curah hujan bulan tanam ${dataBulanTanam.ch_avg} mm/bulan, saat panen ${dataBulanPanen.ch_avg} mm/bulan (${dataBulanPanen.status}).`,
      alasanHarga: isMusimHargaTinggi
        ? `Memasuki siklus harga termahal Wonosobo (${hargaData.siklusPuncak}). Estimasi harga Rp ${Math.round(estHargaKg).toLocaleString('id-ID')}/kg.`
        : isMusimHargaRendah
        ? `Memasuki siklus panen raya serentak (${hargaData.siklusAnjlok}). Estimasi harga Rp ${Math.round(estHargaKg).toLocaleString('id-ID')}/kg.`
        : `Harga stabil menengah di kisaran Rp ${Math.round(estHargaKg).toLocaleString('id-ID')}/kg.`,
      risikoGagalPanen: {
        tingkat: tingkatRisiko,
        persentase: persentaseRisiko,
        penyebabUtama: penyebab,
        langkahMitigasi: mitigasi,
      },
      estimasiKeuntunganPerUbin: profitUbin,
      estimasiKeuntunganPerHa: Math.round(profitHa),
    });
  }

  if (bulanPilihan) {
    return results.filter((r) => r.bulanTanam === bulanPilihan);
  }
  return results;
}

/**
 * Format Pesan Notifikasi Peringatan Dini Cuaca & Mitigasi ke WhatsApp Warga Desa Blederan
 */
export function generateWhatsAppWeatherAlert(params: {
  tanggal: string;
  chMm: number;
  klasifikasi: string;
  tingkatBahaya: string;
  blokWilayah: string;
  tindakanMitigasi: string[];
}): string {
  const emoji = params.chMm > 100 ? '🚨' : params.chMm > 50 ? '⚠️' : '🌧️';
  
  let msg = `*${emoji} PERINGATAN DINI CUACA EKSTREM & MITIGASI TANI BLEDERAN*\n`;
  msg += `*Wilayah:* Desa Blederan, Kec. Mojotengah, Wonosobo\n`;
  msg += `*Pos Hujan:* BMKG Mojotengah (33071101a)\n`;
  msg += `*Tanggal:* ${params.tanggal}\n`;
  msg += `*Status:* ${params.tingkatBahaya.toUpperCase()}\n`;
  msg += `*Prakiraan Curah Hujan:* ${params.chMm} mm (${params.klasifikasi})\n\n`;
  
  msg += `*📌 PANDUAN KESELAMATAN & MITIGASI TANAMAN:*\n`;
  params.tindakanMitigasi.forEach((m, idx) => {
    msg += `${idx + 1}. ${m}\n`;
  });

  msg += `\n*📞 Layanan Posko PPL Mojotengah:* +62 812-2789-1234\n`;
  msg += `_Pesan resmi otomatis sistem TaniPintar Desa Blederan_\n`;
  msg += `_Monggo dipun sebarke dhateng warga poktan sanesipun._`;

  return encodeURIComponent(msg);
}
