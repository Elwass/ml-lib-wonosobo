/**
 * Data Statistik Pertanian Wonosobo & Karakteristik Spesifik Desa Blederan, Mojotengah
 * Berdasarkan dataset Produksi & Luas Panen BPS / Dinas Pertanian Wonosobo
 */

export interface CropInfo {
  id: string;
  nama: string;
  namaJawa: string;
  varietasLokal: string[];
  umurHari: number; // hari setelah tanam s.d. panen perdana
  jarakTanamCm: string;
  kebutuhanAirMmBulan: { min: number; ideal: number; max: number };
  kerentananPenyakit: {
    musimHujan: string[];
    musimKemarau: string[];
  };
  produktivitasRataRataKwHa: number;
  biayaProduksiPerHa: number;
  keuntunganRataRata: number;
}

export const KOMODITAS_UNGGULAN_BLEDERAN: CropInfo[] = [
  {
    id: 'cabai-rawit',
    nama: 'Cabai Rawit Merah',
    namaJawa: 'Lombok Setan / Cengek Rawit',
    varietasLokal: ['Ori 212', 'Shypoon', 'Kaliber', 'Asmoro F1'],
    umurHari: 90,
    jarakTanamCm: '60 x 50 cm',
    kebutuhanAirMmBulan: { min: 80, ideal: 150, max: 350 },
    kerentananPenyakit: {
      musimHujan: ['Antraknosa / Patek (Colletotrichum)', 'Layu Bakteri (Ralstonia)', 'Busuk Buah Phytophthora'],
      musimKemarau: ['Kutu Kebul & Virus Kuning Geminivirus', 'Thrips & Tungau'],
    },
    produktivitasRataRataKwHa: 108.9, // Sesuai data Mojotengah 2024 (16.132 Kw / 148 Ha)
    biayaProduksiPerHa: 45000000,
    keuntunganRataRata: 75000000,
  },
  {
    id: 'cabai-keriting',
    nama: 'Cabai Merah Keriting',
    namaJawa: 'Lombok Abang Kriting',
    varietasLokal: ['TM 999', 'Laba F1', 'Kawat Super', 'Red Sabel'],
    umurHari: 80,
    jarakTanamCm: '60 x 60 cm',
    kebutuhanAirMmBulan: { min: 90, ideal: 160, max: 320 },
    kerentananPenyakit: {
      musimHujan: ['Patek Antraknosa', 'Bercak Daun Cercospora', 'Rebah Semai'],
      musimKemarau: ['Layu Fusarium', 'Lalat Buah'],
    },
    produktivitasRataRataKwHa: 106.0, // Sesuai data Mojotengah 2024 (6.784 Kw / 64 Ha)
    biayaProduksiPerHa: 42000000,
    keuntunganRataRata: 65000000,
  },
  {
    id: 'cabai-besar',
    nama: 'Cabai Merah Besar (TW/Teropong)',
    namaJawa: 'Lombok Teropong',
    varietasLokal: ['Gada MK F1', 'Pilar F1', 'Baja F1'],
    umurHari: 85,
    jarakTanamCm: '70 x 60 cm',
    kebutuhanAirMmBulan: { min: 100, ideal: 180, max: 340 },
    kerentananPenyakit: {
      musimHujan: ['Busuk Batang & Buah Basah', 'Patek'],
      musimKemarau: ['Ulat Grayak', 'Kutu Daun'],
    },
    produktivitasRataRataKwHa: 108.0, // Sesuai data Mojotengah 2024 (5.616 Kw / 52 Ha)
    biayaProduksiPerHa: 44000000,
    keuntunganRataRata: 58000000,
  },
  {
    id: 'tomat',
    nama: 'Tomat Dataran Tinggi',
    namaJawa: 'Tomat Sayur / TW',
    varietasLokal: ['Servo F1', 'Gustavi F1', 'Tymoti F1'],
    umurHari: 70,
    jarakTanamCm: '50 x 60 cm',
    kebutuhanAirMmBulan: { min: 100, ideal: 180, max: 300 },
    kerentananPenyakit: {
      musimHujan: ['Busuk Daun Late Blight (Phytophthora infestans)', 'Layu Bakteri'],
      musimKemarau: ['Ulat Buah Helicoverpa', 'Virus Mosaik'],
    },
    produktivitasRataRataKwHa: 300.0, // Sesuai data Mojotengah 2024 (13.800 Kw / 46 Ha)
    biayaProduksiPerHa: 38000000,
    keuntunganRataRata: 62000000,
  },
];

// Profil Spesifik Wilayah Desa Blederan, Mojotengah
export const PROFIL_DESA_BLEDERAN = {
  desa: 'Blederan',
  kecamatan: 'Mojotengah',
  kabupaten: 'Wonosobo',
  provinsi: 'Jawa Tengah',
  elevasiMdpl: '920 - 1.080 mdpl (Lereng kaki Gunung Sindoro bagian barat)',
  jenisTanah: 'Andosol Vulkanik Cokelat Tua (Kaya bahan organik, porous, solum dalam)',
  phTanah: '5.2 - 6.0 (Cenderung masam ringan, butuh dolomit saat musim hujan lebat)',
  luasLahanTaniHa: 184.5,
  jumlahPetaniAktif: 420,
  kelompokTani: ['Poktan Sido Makmur 1', 'Poktan Tani Subur', 'Poktan Ngudi Makmur', 'KWT Melati Indah'],
  sumberAir: ['Mata Air Kali Gung', 'Saluran Irigasi Tersier Kaliurip', 'Tampungan Embung Mini'],
  jarakKePasarWonosoboKm: 5.8,
  karakteristikKlimatologi: 'Curah hujan tahunan sangat tinggi (3.300 - 6.500 mm). Suhu sejuk 16°C - 24°C, kabut pagi/sore tebal.',
};

// Data Komparasi Produksi Antar Kecamatan di Wonosobo (Tahun 2024)
export const PRODUKSI_KECAMATAN_2024 = [
  { nama: 'Garung', cabaiRawitKw: 58410, cabaiBesarKw: 17110, cabaiKeritingKw: 19488, tomatKw: 36960, totalKw: 131968 },
  { nama: 'Kertek', cabaiRawitKw: 15336, cabaiBesarKw: 6380, cabaiKeritingKw: 7208, tomatKw: 14160, totalKw: 43084 },
  { nama: 'Mojotengah (Wilayah Kita)', cabaiRawitKw: 16132, cabaiBesarKw: 5616, cabaiKeritingKw: 6784, tomatKw: 13800, totalKw: 42332, isHome: true },
  { nama: 'Kalikajar', cabaiRawitKw: 14175, cabaiBesarKw: 5670, cabaiKeritingKw: 6324, tomatKw: 12180, totalKw: 38349 },
  { nama: 'Kejajar', cabaiRawitKw: 13786, cabaiBesarKw: 4494, cabaiKeritingKw: 5616, tomatKw: 14400, totalKw: 38296 },
  { nama: 'Watumalang', cabaiRawitKw: 10712, cabaiBesarKw: 3876, cabaiKeritingKw: 4554, tomatKw: 9120, totalKw: 28262 },
  { nama: 'Sapuran', cabaiRawitKw: 9650, cabaiBesarKw: 3600, cabaiKeritingKw: 4032, tomatKw: 7840, totalKw: 25122 },
  { nama: 'Kaliwiro', cabaiRawitKw: 11200, cabaiBesarKw: 3136, cabaiKeritingKw: 4180, tomatKw: 6600, totalKw: 25116 },
];
