/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PlantingRecommendation } from './components/PlantingRecommendation';
import { FailureRiskMitigation } from './components/FailureRiskMitigation';
import { ProductivityDashboard } from './components/ProductivityDashboard';
import { MarketIntegration } from './components/MarketIntegration';
import { WeeklyPPLReport } from './components/WeeklyPPLReport';
import { MachineLearningLab } from './components/MachineLearningLab';
import { VideoGuideModal } from './components/VideoGuideModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { 
  CloudRain, 
  MapPin, 
  Sprout, 
  ShieldAlert, 
  TrendingUp, 
  PhoneCall, 
  PlayCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('rekomendasi');
  const [language, setLanguage] = useState<'id' | 'jv'>('id');
  const [isVideoGuideOpen, setIsVideoGuideOpen] = useState<boolean>(false);

  // Load language preference if saved locally
  useEffect(() => {
    const savedLang = localStorage.getItem('tanipintar_blederan_lang_v1');
    if (savedLang === 'id' || savedLang === 'jv') {
      setLanguage(savedLang);
    }
  }, []);

  const handleSetLanguage = (lang: 'id' | 'jv') => {
    setLanguage(lang);
    localStorage.setItem('tanipintar_blederan_lang_v1', lang);
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans text-stone-900 selection:bg-emerald-200">
      {/* Top Header & Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={handleSetLanguage}
        onOpenVideoGuide={() => setIsVideoGuideOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-5 sm:py-7">
        {/* Quick Announcement Bar for Desa Blederan */}
        <div className="mb-5 p-3 rounded-2xl bg-emerald-800/10 border border-emerald-700/20 flex flex-wrap items-center justify-between gap-2 text-xs text-emerald-950">
          <div className="flex items-center gap-2">
            <span className="flex-shrink-0 w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
            <span className="font-bold">
              {language === 'jv' ? 'Kabar Petani Desa Blederan:' : 'Status Wilayah Desa Blederan:'}
            </span>
            <span>
              {language === 'jv'
                ? 'Pos BMKG Mojotengah nyatet udan deres arep mudhun awal Oktober. Mangga dipun cek parit sawah.'
                : 'Pos BMKG Mojotengah mendeteksi awal musim hujan aktif. Periksa saluran parit dan jadwal semprot antraknosa.'}
            </span>
          </div>

          <div className="flex items-center gap-2 font-medium">
            <button
              onClick={() => setActiveTab('mitigasi')}
              className="font-bold text-emerald-800 underline hover:text-emerald-950 cursor-pointer"
            >
              {language === 'jv' ? 'Tingali Mitigasi' : 'Lihat Rekomendasi Mitigasi →'}
            </button>
          </div>
        </div>

        {/* Tab 1: Rekomendasi Waktu Tanam */}
        {activeTab === 'rekomendasi' && <PlantingRecommendation language={language} />}

        {/* Tab 2: Prediksi Gagal Panen & Mitigasi WA */}
        {activeTab === 'mitigasi' && <FailureRiskMitigation language={language} />}

        {/* Tab 3: Dasbor Produktivitas Lahan Real-Time */}
        {activeTab === 'produktivitas' && <ProductivityDashboard language={language} />}

        {/* Tab 4: Integrasi Pasar & Distribusi */}
        {activeTab === 'pasar' && <MarketIntegration language={language} />}

        {/* Tab 5: Laporan Mingguan PPL */}
        {activeTab === 'laporan-ppl' && <WeeklyPPLReport language={language} />}

        {/* Tab 6: Laboratorium & Model Machine Learning */}
        {activeTab === 'ml-lab' && <MachineLearningLab language={language} />}
      </main>

      {/* Village Community Footer */}
      <footer className="bg-white border-t border-stone-200 mt-12 py-7 px-4 text-xs text-stone-600">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold">
              🌶️
            </div>
            <div>
              <p className="font-extrabold text-stone-900">
                TaniPintar Desa Blederan · Kec. Mojotengah, Kab. Wonosobo
              </p>
              <p className="text-[11px] text-stone-500">
                Kolaborasi Petani Poktan Desa Blederan, Pos Hujan BMKG Mojotengah (33071101a) & BPP Pertanian.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsVideoGuideOpen(true)}
              className="flex items-center gap-1.5 text-xs text-emerald-800 font-bold hover:underline cursor-pointer"
            >
              <PlayCircle className="w-4 h-4 text-emerald-700" />
              <span>{language === 'jv' ? 'Video Panduan 1 Menit' : 'Bantuan & Video Panduan'}</span>
            </button>
            <span className="text-stone-300">·</span>
            <span className="text-[11px] text-stone-500 font-mono">
              Bisa Dibuka Tanpa Kuota (PWA)
            </span>
          </div>
        </div>
      </footer>

      {/* Interactive Video Guide Modal */}
      <VideoGuideModal
        isOpen={isVideoGuideOpen}
        onClose={() => setIsVideoGuideOpen(false)}
        language={language}
      />

      {/* Offline Status Floating Indicator */}
      <OfflineIndicator language={language} />
    </div>
  );
}
