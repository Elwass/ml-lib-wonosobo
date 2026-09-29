/**
 * Data Petak Lahan Pertanian Real-Time Desa Blederan, Mojotengah
 */

export interface LandParcel {
  id: string;
  namaPetak: string;
  blokWilayah: string;
  pemilik: string;
  luasMeterPersegi: number; // e.g. 2800 m2 (~200 ubin)
  luasUbin: number; // 1 ubin = 14 m2 (ukuran lokal Wonosobo)
  komoditas: string;
  varietas: string;
  tanggalTanam: string;
  estimasiPanen: string;
  faseSaatIni: 'Pengolahan Tanah' | 'Vegetatif Awal' | 'Pembungaan' | 'Pembentukan Buah' | 'Masa Panen' | 'Bera/Istirahat';
  progresPersen: number;
  statusKesehatan: 'Sangat Sehat' | 'Waspada Antraknosa' | 'Tergenang Air' | 'Serangan Hama Thrips';
  estimasiHasilKw: number;
  riwayatPanenTerakhirKw?: number;
  kebutuhanTindakan?: string;
  kadarAirTanah: 'Kering' | 'Cukup / Lembap Ideal' | 'Terlalu Basah / Jenuh';
}

export const INITIAL_PARCELS_BLEDERAN: LandParcel[] = [
  {
    id: 'petak-01',
    namaPetak: 'Petak Sawah Lor Kali',
    blokWilayah: 'Blok Krajan 1',
    pemilik: 'Pak Slamet Riyadi',
    luasMeterPersegi: 2800,
    luasUbin: 200,
    komoditas: 'Cabai Rawit Merah',
    varietas: 'Ori 212',
    tanggalTanam: '2026-06-10',
    estimasiPanen: '2026-09-20 s.d. 2026-11-15',
    faseSaatIni: 'Masa Panen',
    progresPersen: 85,
    statusKesehatan: 'Sangat Sehat',
    estimasiHasilKw: 30.5,
    riwayatPanenTerakhirKw: 6.2,
    kebutuhanTindakan: 'Petik ke-4 besok pagi. Bersihkan gulma parit pembuangan.',
    kadarAirTanah: 'Cukup / Lembap Ideal',
  },
  {
    id: 'petak-02',
    namaPetak: 'Ladang Lereng Gandok',
    blokWilayah: 'Blok Gandok Kidul',
    pemilik: 'Mbah Karyo Utomo',
    luasMeterPersegi: 4200,
    luasUbin: 300,
    komoditas: 'Cabai Merah Keriting',
    varietas: 'TM 999',
    tanggalTanam: '2026-07-05',
    estimasiPanen: '2026-10-15',
    faseSaatIni: 'Pembentukan Buah',
    progresPersen: 70,
    statusKesehatan: 'Waspada Antraknosa',
    estimasiHasilKw: 44.0,
    kebutuhanTindakan: 'Semprot fungisida tembaga hidroksida & kalsium boron untuk perkuat dinding buah.',
    kadarAirTanah: 'Terlalu Basah / Jenuh',
  },
  {
    id: 'petak-03',
    namaPetak: 'Petak Sawah Kaliurip Kulon',
    blokWilayah: 'Blok Kaliurip',
    pemilik: 'Mas Ahmad Fauzi',
    luasMeterPersegi: 3500,
    luasUbin: 250,
    komoditas: 'Tomat Dataran Tinggi',
    varietas: 'Servo F1',
    tanggalTanam: '2026-07-20',
    estimasiPanen: '2026-10-05',
    faseSaatIni: 'Pembentukan Buah',
    progresPersen: 75,
    statusKesehatan: 'Sangat Sehat',
    estimasiHasilKw: 105.0,
    riwayatPanenTerakhirKw: 18.0,
    kebutuhanTindakan: 'Perkuat tali lanjaran bambu agar tidak roboh tertiup angin kencang.',
    kadarAirTanah: 'Cukup / Lembap Ideal',
  },
  {
    id: 'petak-04',
    namaPetak: 'Ladang Terasering Sirandu',
    blokWilayah: 'Blok Sirandu',
    pemilik: 'Ibu Siti Munawaroh',
    luasMeterPersegi: 1750,
    luasUbin: 125,
    komoditas: 'Cabai Rawit Merah',
    varietas: 'Kaliber',
    tanggalTanam: '2026-08-15',
    estimasiPanen: '2026-11-20',
    faseSaatIni: 'Pembungaan',
    progresPersen: 45,
    statusKesehatan: 'Waspada Antraknosa',
    estimasiHasilKw: 18.5,
    kebutuhanTindakan: 'Hujan lebat diprediksi awal Oktober! Tinggikan guludan 10 cm & rapikan parit cacing.',
    kadarAirTanah: 'Terlalu Basah / Jenuh',
  },
  {
    id: 'petak-05',
    namaPetak: 'Lahan Sikunir Asri',
    blokWilayah: 'Blok Sikunir Wetan',
    pemilik: 'Pak Wahyudi BUMDes',
    luasMeterPersegi: 5600,
    luasUbin: 400,
    komoditas: 'Cabai Merah Besar (TW)',
    varietas: 'Gada MK F1',
    tanggalTanam: '2026-09-01',
    estimasiPanen: '2026-12-05',
    faseSaatIni: 'Vegetatif Awal',
    progresPersen: 25,
    statusKesehatan: 'Sangat Sehat',
    estimasiHasilKw: 60.0,
    kebutuhanTindakan: 'Kocor Trichoderma + asam humat untuk imun akar menghadapi musim hujan Oktober-Desember.',
    kadarAirTanah: 'Cukup / Lembap Ideal',
  },
];
