/**
 * Data Tren Harga Historis Komoditas Pertanian & BBM Wonosobo (2022 - 2026)
 * Sumber: Data Pasar Wonosobo & Survei Distribusi
 */

export interface CommodityPrice {
  komoditas: string;
  hargaSekarang: number;
  hargaBulanLalu: number;
  hargaTertinggi: number;
  hargaTerendah: number;
  satuan: string;
  tren: 'naik' | 'turun' | 'stabil';
  persentasePerubahan: number;
  siklusPuncak: string; // Bulan harga tertinggi
  siklusAnjlok: string; // Bulan harga terendah
}

export const DATA_HARGA_KOMODITAS: CommodityPrice[] = [
  {
    komoditas: 'Cabai Rawit Merah',
    hargaSekarang: 66850,
    hargaBulanLalu: 44650,
    hargaTertinggi: 102050, // Puncak Maret 2026 / Desember 2023
    hargaTerendah: 25200,   // Mei-Agustus
    satuan: 'kg',
    tren: 'naik',
    persentasePerubahan: 49.7,
    siklusPuncak: 'Desember - Maret (Saat hujan ekstrem patek menyerang suplai turun)',
    siklusAnjlok: 'Juni - Agustus (Panen raya musim kemarau suplai melimpah)',
  },
  {
    komoditas: 'Cabai Merah Keriting',
    hargaSekarang: 44750,
    hargaBulanLalu: 36500,
    hargaTertinggi: 85300,  // Puncak Feb 2024 / Des 2025
    hargaTerendah: 20450,   // Oktober 2024
    satuan: 'kg',
    tren: 'naik',
    persentasePerubahan: 22.6,
    siklusPuncak: 'November - Februari (Musim hujan & Tahun Baru)',
    siklusAnjlok: 'September - Oktober (Panen akhir kemarau)',
  },
  {
    komoditas: 'Cabai Merah Besar',
    hargaSekarang: 36750,
    hargaBulanLalu: 37600,
    hargaTertinggi: 98050,  // Puncak Feb 2024
    hargaTerendah: 22950,
    satuan: 'kg',
    tren: 'stabil',
    persentasePerubahan: -2.2,
    siklusPuncak: 'Desember - Februari',
    siklusAnjlok: 'April - Mei',
  },
  {
    komoditas: 'Cabai Rawit Hijau',
    hargaSekarang: 45100,
    hargaBulanLalu: 37450,
    hargaTertinggi: 61000,
    hargaTerendah: 17750,
    satuan: 'kg',
    tren: 'naik',
    persentasePerubahan: 20.4,
    siklusPuncak: 'Januari - Maret',
    siklusAnjlok: 'Mei - Juni',
  },
  {
    komoditas: 'Tomat Sayur / TW',
    hargaSekarang: 12500,
    hargaBulanLalu: 8000,
    hargaTertinggi: 24000,
    hargaTerendah: 3500,
    satuan: 'kg',
    tren: 'naik',
    persentasePerubahan: 56.2,
    siklusPuncak: 'Desember - Februari (Hujan lebat rentan busuk)',
    siklusAnjlok: 'Juli - September (Panen serentak)',
  },
  {
    komoditas: 'Daun Bawang / Loncan',
    hargaSekarang: 14000,
    hargaBulanLalu: 11000,
    hargaTertinggi: 28000,
    hargaTerendah: 4000,
    satuan: 'kg',
    tren: 'naik',
    persentasePerubahan: 27.2,
    siklusPuncak: 'Januari - Maret',
    siklusAnjlok: 'Agustus - September',
  },
];

// Data tren harga bulanan rata-rata Wonosobo (historis 2024-2026 per kg dalam ribuan Rupiah)
export const TREN_HARGA_BULANAN = [
  { bulan: 'Jan', rawitMerah: 72, keriting: 58, besar: 56, curahHujanMm: 504 },
  { bulan: 'Feb', rawitMerah: 82, keriting: 65, besar: 68, curahHujanMm: 489 },
  { bulan: 'Mar', rawitMerah: 94, keriting: 68, besar: 62, curahHujanMm: 482 },
  { bulan: 'Apr', rawitMerah: 68, keriting: 48, besar: 46, curahHujanMm: 396 },
  { bulan: 'Mei', rawitMerah: 34, keriting: 38, besar: 38, curahHujanMm: 228 },
  { bulan: 'Jun', rawitMerah: 36, keriting: 36, besar: 37, curahHujanMm: 138 },
  { bulan: 'Jul', rawitMerah: 42, keriting: 35, besar: 36, curahHujanMm: 98 },
  { bulan: 'Agu', rawitMerah: 45, keriting: 34, besar: 36, curahHujanMm: 84 },
  { bulan: 'Sep', rawitMerah: 48, keriting: 38, besar: 37, curahHujanMm: 146 },
  { bulan: 'Okt', rawitMerah: 52, keriting: 42, besar: 40, curahHujanMm: 322 },
  { bulan: 'Nov', rawitMerah: 68, keriting: 54, besar: 52, curahHujanMm: 568 },
  { bulan: 'Des', rawitMerah: 88, keriting: 66, besar: 62, curahHujanMm: 588 },
];

// Data BBM dan Biaya Operasional di Wonosobo
export const DATA_BBM_OPERASIONAL = {
  biosolarSubsidi: 6800, // per liter
  pertalite: 10000, // per liter
  dexlite: 13050,
  ongkosOjekLahanBlederan: 25000, // per karung dari lereng ke jalan desa
  ongkosPikepKePasarKertek: 150000, // per rit
  ongkosPikepKePasarIndukWonosobo: 120000, // per rit
  upahHarianBuruhTani: 85000, // setengah hari Rp 50.000, sehari penuh Rp 85.000 + rokok & kopi
};

// Pasar-pasar induk rujukan petani Desa Blederan
export const PASAR_DISTRIBUSI_WONOSOBO = [
  {
    id: 'pasar-induk',
    nama: 'Pasar Induk Wonosobo',
    jarakKm: 5.8,
    waktuTempuhMenit: 15,
    kontakPengepul: '+6281227891234',
    namaPengepul: 'Juragan Slamet (Lapak Sayur Berkah)',
    kapasitasTampung: '20 Ton / Hari',
    komoditasFavorit: ['Cabai Rawit Merah', 'Cabai Keriting', 'Tomat'],
    jamBuka: '02:00 - 12:00 WIB (Paling ramai subuh)',
  },
  {
    id: 'pasar-kertek',
    nama: 'Pasar Agrobisnis Kertek',
    jarakKm: 14.2,
    waktuTempuhMenit: 28,
    kontakPengepul: '+6281392817263',
    namaPengepul: 'H. Sudirman (Gudang Sayur Sindoro)',
    kapasitasTampung: '35 Ton / Hari (Kirim Jakarta/Semarang)',
    komoditasFavorit: ['Cabai Keriting', 'Cabai Rawit Merah', 'Kubis'],
    jamBuka: '04:00 - 16:00 WIB',
  },
  {
    id: 'pasar-garung',
    nama: 'Pasar Garung (Pintu Masuk Dieng)',
    jarakKm: 7.5,
    waktuTempuhMenit: 18,
    kontakPengepul: '+6285228190382',
    namaPengepul: 'Pak Bejo (Kemitraan Hortikultura)',
    kapasitasTampung: '15 Ton / Hari',
    komoditasFavorit: ['Cabai Rawit Merah', 'Tomat TW', 'Daun Bawang'],
    jamBuka: '03:00 - 11:00 WIB',
  },
  {
    id: 'koperasi-blederan',
    nama: 'Koperasi Tani Makmur Blederan',
    jarakKm: 0.5,
    waktuTempuhMenit: 2,
    kontakPengepul: '+6287834567890',
    namaPengepul: 'BUMDes Desa Blederan / Gabungan Kelompok Tani',
    kapasitasTampung: '8 Ton / Hari',
    komoditasFavorit: ['Semua Komoditas Petani Warga Desa'],
    jamBuka: '06:00 - 18:00 WIB',
  },
];
