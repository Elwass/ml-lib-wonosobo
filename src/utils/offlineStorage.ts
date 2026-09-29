/**
 * Penyimpanan Lokal Offline (IndexedDB / LocalStorage)
 * Memastikan aplikasi dapat beroperasi 100% tanpa internet di persawahan Blederan
 */

import { useState, useEffect } from 'react';
import { LandParcel, INITIAL_PARCELS_BLEDERAN } from '../data/blederanParcels';

const STORAGE_KEYS = {
  PARCELS: 'tanipintar_blederan_parcels_v1',
  HARVEST_OFFERS: 'tanipintar_blederan_offers_v1',
  REPORTS: 'tanipintar_blederan_reports_v1',
  LANGUAGE: 'tanipintar_blederan_lang_v1',
  FAVORITE_COMMODITY: 'tanipintar_blederan_fav_commodity',
};

export interface HarvestOffer {
  id: string;
  namaPetani: string;
  noHpWa: string;
  komoditas: string;
  varietas: string;
  estimasiBeratKw: number;
  hargaHarapanKg: number;
  lokasiBlok: string;
  tanggalSiapPetik: string;
  keterangan: string;
  status: 'Tersedia' | 'Sudah Deal / Terjual';
  dibuatPada: string;
}

export const INITIAL_HARVEST_OFFERS: HarvestOffer[] = [
  {
    id: 'tawar-01',
    namaPetani: 'Pak Slamet Riyadi',
    noHpWa: '081227891234',
    komoditas: 'Cabai Rawit Merah',
    varietas: 'Ori 212',
    estimasiBeratKw: 8,
    hargaHarapanKg: 65000,
    lokasiBlok: 'Blok Krajan 1, Blederan',
    tanggalSiapPetik: '2026-09-30',
    keterangan: 'Cabai petikan pertama, buah padat mengkilap, bebas patek, siap kirim ke Pasar Induk / Kertek.',
    status: 'Tersedia',
    dibuatPada: '2026-09-28',
  },
  {
    id: 'tawar-02',
    namaPetani: 'Mas Ahmad Fauzi',
    noHpWa: '085743219876',
    komoditas: 'Tomat Dataran Tinggi',
    varietas: 'Servo F1',
    estimasiBeratKw: 25,
    hargaHarapanKg: 12000,
    lokasiBlok: 'Blok Kaliurip Kulon',
    tanggalSiapPetik: '2026-10-02',
    keterangan: 'Tomat super TW, ukuran seragam, kulit tebal tahan kirim jarak jauh ke Jakarta/Semarang.',
    status: 'Tersedia',
    dibuatPada: '2026-09-27',
  },
];

export function getLocalParcels(): LandParcel[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PARCELS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PARCELS, JSON.stringify(INITIAL_PARCELS_BLEDERAN));
      return INITIAL_PARCELS_BLEDERAN;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Gagal membaca petak offline:', e);
    return INITIAL_PARCELS_BLEDERAN;
  }
}

export function saveLocalParcels(parcels: LandParcel[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PARCELS, JSON.stringify(parcels));
  } catch (e) {
    console.error('Gagal menyimpan petak offline:', e);
  }
}

export function getLocalOffers(): HarvestOffer[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HARVEST_OFFERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.HARVEST_OFFERS, JSON.stringify(INITIAL_HARVEST_OFFERS));
      return INITIAL_HARVEST_OFFERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_HARVEST_OFFERS;
  }
}

export function saveLocalOffers(offers: HarvestOffer[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.HARVEST_OFFERS, JSON.stringify(offers));
  } catch (e) {
    console.error('Gagal menyimpan tawaran panen offline:', e);
  }
}

/**
 * Hook untuk memantau status online / offline real-time di ponsel petani
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
