import React from 'react';
import { PWAInstallButton } from './PWAInstallButton';
import { 
  Calendar, 
  AlertTriangle, 
  TrendingUp, 
  Store, 
  FileText, 
  PlayCircle, 
  Languages, 
  MapPin, 
  CloudRain,
  BrainCircuit
} from 'lucide-react';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  language: 'id' | 'jv';
  setLanguage: (lang: 'id' | 'jv') => void;
  onOpenVideoGuide: () => void;
}

export const Header: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  onOpenVideoGuide,
}) => {
  const tabs = [
    {
      id: 'rekomendasi',
      labelId: 'Waktu Tanam Terbaik',
      labelJv: 'Wayah Tandur',
      icon: Calendar,
      descId: 'Kalender BMKG & Harga',
      descJv: 'Petung Wulan Sae',
    },
    {
      id: 'mitigasi',
      labelId: 'Prediksi Gagal Panen',
      labelJv: 'Kabar Gagal Panen',
      icon: AlertTriangle,
      descId: 'Peringatan Dini Cuaca & WA',
      descJv: 'Waspada Udan & WA',
      badge: 'BMKG',
    },
    {
      id: 'produktivitas',
      labelId: 'Produktivitas Lahan',
      labelJv: 'Petak Lahan Sawah',
      icon: TrendingUp,
      descId: 'Real-time Desa Blederan',
      descJv: 'Kahanan Asil Sawah',
    },
    {
      id: 'pasar',
      labelId: 'Integrasi Pasar',
      labelJv: 'Pasar & Dodolan',
      icon: Store,
      descId: 'Harga Harian & Distribusi',
      descJv: 'Rega Lombok & Bakul',
    },
    {
      id: 'laporan-ppl',
      labelId: 'Laporan Mingguan PPL',
      labelJv: 'Lapuran PPL',
      icon: FileText,
      descId: 'Otomatis Penyuluh Dinas',
      descJv: 'Format Resmi Dinas',
    },
    {
      id: 'ml-lab',
      labelId: 'Model AI & Machine Learning',
      labelJv: 'Model AI & ML',
      icon: BrainCircuit,
      descId: 'Arsitektur, Akurasi & Inferensi',
      descJv: 'Transparansi Model AI',
      badge: 'AI/ML',
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-stone-200 shadow-xs">
      {/* Top Banner with Wonosobo Identity */}
      <div className="bg-emerald-900 text-emerald-50 px-3 sm:px-6 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Location details */}
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 font-bold text-amber-300 bg-emerald-800/80 px-2 py-0.5 rounded-lg border border-emerald-700">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              Desa Blederan
            </span>
            <span className="hidden sm:inline text-emerald-200">
              Kec. Mojotengah · Kab. Wonosobo (920 - 1.080 mdpl)
            </span>
            <span className="flex items-center gap-1 text-[11px] text-emerald-300 bg-emerald-950/40 px-2 py-0.5 rounded-md">
              <CloudRain className="w-3 h-3 text-sky-300" />
              Pos BMKG: 33071101a
            </span>
          </div>

          {/* Quick Actions (Video Guide, Language Toggle, PWA Install) */}
          <div className="flex items-center gap-2">
            {/* Video Guide trigger */}
            <button
              onClick={onOpenVideoGuide}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer"
            >
              <PlayCircle className="w-3.5 h-3.5 text-stone-900" />
              <span>{language === 'jv' ? 'Video Panduan' : 'Panduan 1 Menit'}</span>
            </button>

            {/* Language toggle */}
            <button
              onClick={() => setLanguage(language === 'id' ? 'jv' : 'id')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-emerald-100 text-xs font-medium border border-emerald-600/50 transition cursor-pointer"
              title="Ganti Bahasa / Gantos Basa Jawa"
            >
              <Languages className="w-3.5 h-3.5 text-amber-300" />
              <span>{language === 'id' ? '🇮🇩 B. Indo' : '🌱 Boso Jowo'}</span>
            </button>

            {/* PWA Install */}
            <PWAInstallButton language={language} />
          </div>
        </div>
      </div>

      {/* Main Brand & Tab Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 pt-3 pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 border-2 border-emerald-500/40 flex items-center justify-center text-white shadow-md flex-shrink-0">
              <span className="text-xl">🌶️</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-stone-900 leading-tight">
                  TaniPintar <span className="text-emerald-700 font-black">Blederan</span>
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                  Mojotengah
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium">
                {language === 'jv'
                  ? 'Sistem pinter wayah tandur, nyegah gagal panen & rega pasar Wonosobo'
                  : 'Sistem rekomendasi tanam akurat BMKG, pencegahan gagal panen & integrasi pasar'}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation - Zero Pill, highly readable touch buttons */}
        <nav className="mt-3 flex overflow-x-auto no-scrollbar gap-1.5 p-1 bg-stone-100 rounded-2xl border border-stone-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex-1 sm:flex-initial justify-center ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-stone-700 hover:text-stone-950 hover:bg-stone-200/70'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-700'}`} />
                <div className="text-left">
                  <div className="leading-tight">
                    {language === 'jv' ? tab.labelJv : tab.labelId}
                  </div>
                </div>
                {tab.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-extrabold ${
                      isActive ? 'bg-emerald-900 text-amber-300' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
