import React from 'react';
import { useOnlineStatus } from '../utils/offlineStorage';
import { WifiOff, ShieldCheck } from 'lucide-react';

interface Props {
  language: 'id' | 'jv';
}

export const OfflineIndicator: React.FC<Props> = ({ language }) => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-50 flex items-center justify-between gap-3 rounded-2xl bg-stone-900/95 border border-amber-500/40 px-4 py-2.5 text-xs font-medium text-white shadow-2xl backdrop-blur-md animate-fade-in">
      <div className="flex items-center gap-2.5">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
        </span>
        <div className="flex flex-col">
          <span className="font-bold text-amber-300 flex items-center gap-1.5">
            <WifiOff className="w-3.5 h-3.5" />
            {language === 'jv' ? 'Mode Tanpa Sinyal (Offline)' : 'Mode Lapangan (Offline Aktif)'}
          </span>
          <span className="text-[11px] text-stone-300">
            {language === 'jv'
              ? 'Data sawah & petung tanam tetep saget dipun bikak tanpa kuota.'
              : 'Semua data BMKG, harga, & petak lahan tetap aman tersimpan di HP.'}
          </span>
        </div>
      </div>
      <div className="hidden sm:flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-1 rounded-lg">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>Tersimpan</span>
      </div>
    </div>
  );
};
