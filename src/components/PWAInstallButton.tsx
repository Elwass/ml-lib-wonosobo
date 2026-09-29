import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Smartphone, Download, Check, X } from 'lucide-react';

interface Props {
  language: 'id' | 'jv';
}

export const PWAInstallButton: React.FC<Props> = ({ language }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // Jika sudah terpasang, tampilkan badge kecil
  if (isInstalled) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100/90 text-emerald-800 text-xs font-semibold">
        <Check className="w-3.5 h-3.5 text-emerald-600" />
        <span>{language === 'jv' ? 'Aplikasi Terpasang' : 'Telah Terpasang di HP'}</span>
      </div>
    );
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 px-3 py-1.5 text-xs font-bold text-stone-900 shadow transition-all duration-150 cursor-pointer"
        title="Pasang aplikasi agar bisa dibuka tanpa kuota internet"
      >
        <Download className="w-4 h-4 text-stone-900 animate-bounce" />
        <span>{language === 'jv' ? 'Pasang neng HP (Gratis)' : 'Pasang di HP (Bisa Offline)'}</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white/90 hover:bg-stone-50 px-2.5 py-1 text-xs font-semibold text-stone-700 shadow-sm transition"
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
          <span>{language === 'jv' ? 'Pasang iPhone' : 'Pasang di iPhone'}</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl border border-stone-200">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h3 className="text-base font-bold text-stone-900">Cara Pasang di Layar HP iPhone</h3>
                <button onClick={() => setShowIOSGuide(false)} className="p-1 rounded-lg text-stone-400 hover:bg-stone-100">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-3 space-y-2.5 text-xs text-stone-700 leading-relaxed">
                <div className="flex gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">1</span>
                  <p>Tekan tombol <strong>Bagikan (Share)</strong> di bagian bawah peramban Safari.</p>
                </div>
                <div className="flex gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">2</span>
                  <p>Geser ke bawah lalu pilih menu <strong>Tambahkan ke Layar Utama (Add to Home Screen)</strong>.</p>
                </div>
                <div className="flex gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">3</span>
                  <p>Aplikasi TaniPintar Blederan siap digunakan langsung kapan saja seperti aplikasi bawaan.</p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-xl bg-emerald-700 py-2.5 text-xs font-bold text-white hover:bg-emerald-800 transition"
              >
                Saya Mengerti
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
