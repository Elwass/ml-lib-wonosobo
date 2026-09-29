import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, Volume2, VolumeX, CheckCircle2, ChevronRight, Award } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  language: 'id' | 'jv';
}

interface GuideStep {
  titleId: string;
  titleJv: string;
  descId: string;
  descJv: string;
  audioSpeechId: string;
  audioSpeechJv: string;
  visualTag: string;
  badge: string;
}

const GUIDE_STEPS: GuideStep[] = [
  {
    titleId: '1. Cek Waktu Tanam Terbaik (Wayah Tandur)',
    titleJv: '1. Niti Wanci Tandur Paling Sae',
    descId: 'Pilih komoditas (Cabai Rawit, Cabai Keriting, atau Tomat). Sistem otomatis menghitung bulan tanam yang cuacanya aman dari patek dan perkiraan harga jualnya paling mahal di pasar Wonosobo.',
    descJv: 'Pilih tetanduran (Lombok rawit, kriting, utawi tomat). Aplikasi bakal maringi petung wulan tandur ingkang tebih saking patek lan reginipun awis pas panen.',
    audioSpeechId: 'Langkah pertama, buka menu Rekomendasi Tanam. Pilih jenis cabai atau tomat Anda. Sistem akan memberitahu bulan terbaik untuk menyemai bibit dan memanen hasil dengan harga tertinggi.',
    audioSpeechJv: 'Langkah sepisan, bikak menu Rekomendasi Tanam. Pilih lombok utawi tomat panjenengan. Sistem bakal maringi ngertos wayah tandur ingkang paling sae.',
    visualTag: 'KALENDER TANAM & BMKG',
    badge: 'Langkah 1',
  },
  {
    titleId: '2. Peringatan Dini Gagal Panen & Cuaca Ekstrem',
    titleJv: '2. Peringatan Gagal Panen & Udan Deres',
    descId: 'Bila Pos BMKG Mojotengah mendeteksi hujan lebat (>50 mm), sistem langsung memberi sinyal waspada busuk akar dan patek. Anda bisa langsung membagikan pesan peringatan ini ke grup WhatsApp warga desa.',
    descJv: 'Menawi pos BMKG Mojotengah wonten udan deres sanget, sistem langsung maringi kabar waspada patek. Panjenengan saget langsung kirim kabaripun dhateng grup WA warga.',
    audioSpeechId: 'Langkah kedua, pantau status cuaca ekstrem. Jika ada risiko hujan lebat, tekan tombol hijau Kirim Pesan WA Warga untuk membagikan panduan keselamatan tanaman ke grup WhatsApp poktan.',
    audioSpeechJv: 'Langkah kaping kalih, tingali kabar cuaca ekstrem. Menawi wonten udan deres, pencet tombol ijo Kirim WA supados sedaya warga poktan sami waspada.',
    visualTag: 'RADAR CUACA & NOTIFIKASI WA',
    badge: 'Langkah 2',
  },
  {
    titleId: '3. Pantau Produktivitas Lahan Desa Blederan',
    titleJv: '3. Niti Petak Sawah & Hasil Panen',
    descId: 'Catat petak sawah Anda di Blok Krajan, Gandok, Kaliurip, atau Sirandu. Ketahui fase tanaman saat ini dan perkirakan berapa kuintal cabai yang akan dipetik.',
    descJv: 'Catet petak sawah panjenengan wonten blok Krajan, Gandok, utawi Kaliurip. Mangertosi fase tuwuhing tanduran lan taksiran pinten kwintal panene.',
    audioSpeechId: 'Langkah ketiga, gunakan Dasbor Produktivitas untuk mencatat perkembangan tanaman dan hasil panen di tiap petak lahan Anda.',
    audioSpeechJv: 'Langkah kaping tiga, catet petak sawah panjenengan wonten dasbor supados gampil dipun titeni asil panene.',
    visualTag: 'PETA & PETAK SAWAH',
    badge: 'Langkah 3',
  },
  {
    titleId: '4. Tawarkan Panen Langsung ke Pasar Tanpa Tengkulak',
    titleJv: '4. Nawakake Panen Dhateng Juragan Pasar',
    descId: 'Cek harga cabai harian di Wonosobo. Buka menu Pasar, lalu masukkan jumlah panen Anda. Hubungi langsung pengepul Pasar Induk atau Pasar Kertek lewat WhatsApp dengan harga transparan.',
    descJv: 'Tingali rega lombok saben dinten. Bikak menu Pasar, lajeng tawaraken panenan panjenengan langsung dhateng pengepul Pasar Induk Wonosobo lumantar WA.',
    audioSpeechId: 'Langkah keempat, manfaatkan fitur Integrasi Pasar. Anda bisa melihat harga pasar hari ini dan langsung menawarkan hasil panen ke pembeli terpercaya tanpa perantara.',
    audioSpeechJv: 'Langkah kaping sekawan, tingali rega pasar dinten niki lan nawakake asil panen langsung dhateng juragan pasar.',
    visualTag: 'BURSA HARGA & PENJUALAN',
    badge: 'Langkah 4',
  },
  {
    titleId: '5. Laporan Mingguan Otomatis untuk Penyuluh (PPL)',
    titleJv: '5. Lapuran Minggon Kagem Petugas PPL',
    descId: 'Petugas penyuluh lapangan cukup menekan tombol Cetak/Ekspor untuk menghasilkan rekap data resmi mingguan Desa Blederan untuk Dinas Pertanian Kabupaten Wonosobo.',
    descJv: 'Petugas PPL cekap pencet tombol Cetak/Ekspor kangge ndamel lapuran minggon resmi Desa Blederan kagem Dinas Pertanian.',
    audioSpeechId: 'Langkah kelima, laporan mingguan resmi dapat dicetak atau disalin langsung dalam satu kali klik untuk keperluan dinas pertanian.',
    audioSpeechJv: 'Langkah pungkasan, lapuran minggon resmi saget langsung dipun cetak kagem kaperluan dinas pertanian.',
    visualTag: 'LAPORAN RESMI PPL',
    badge: 'Langkah 5',
  },
];

export const VideoGuideModal: React.FC<Props> = ({ isOpen, onClose, language }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  // Play audio speech synthesis narration if available
  const speakCurrentStep = (stepIdx: number) => {
    if (isMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const textToSpeak = language === 'jv'
        ? GUIDE_STEPS[stepIdx].audioSpeechJv
        : GUIDE_STEPS[stepIdx].audioSpeechId;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'id-ID';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis unavailable:', e);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      return;
    }
  }, [isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      speakCurrentStep(currentStep);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            // Next step
            if (currentStep < GUIDE_STEPS.length - 1) {
              setCurrentStep((s) => s + 1);
              return 0;
            } else {
              setIsPlaying(false);
              return 100;
            }
          }
          return prev + 2.5; // ~4 seconds per step
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, isMuted, language]);

  if (!isOpen) return null;

  const step = GUIDE_STEPS[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-5">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl overflow-hidden border border-stone-200 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-emerald-800 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-emerald-700/80 border border-emerald-500/40 flex items-center justify-center font-bold text-amber-300">
              ▶
            </span>
            <div>
              <h2 className="text-base font-bold leading-tight">
                {language === 'jv' ? 'Video Panduan 1 Menit Kangge Petani' : 'Video Panduan Singkat 1 Menit Petani'}
              </h2>
              <p className="text-[11px] text-emerald-200">
                Desa Blederan · Kec. Mojotengah · Wonosobo
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
              }
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-emerald-700 text-emerald-100 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Simulation Canvas */}
        <div className="relative bg-stone-950 aspect-video w-full flex items-center justify-center overflow-hidden">
          {/* Background simulated animated screen */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/80 via-stone-900 to-stone-950 flex flex-col justify-between p-6">
            {/* Top Bar on Simulation */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] tracking-wider font-extrabold text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2.5 py-1 rounded-full uppercase">
                {step.visualTag}
              </span>
              <span className="text-xs text-stone-400 font-mono">
                0{currentStep + 1} / 0{GUIDE_STEPS.length}
              </span>
            </div>

            {/* Center Content Mockup */}
            <div className="my-auto text-center px-4">
              <div className="inline-block mx-auto mb-3 p-3.5 rounded-2xl bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 shadow-xl">
                {currentStep === 0 && <span className="text-3xl">🗓️ 🌱</span>}
                {currentStep === 1 && <span className="text-3xl">🌧️ ⚠️ 📲</span>}
                {currentStep === 2 && <span className="text-3xl">🌾 📊 📍</span>}
                {currentStep === 3 && <span className="text-3xl">💰 🚚 🤝</span>}
                {currentStep === 4 && <span className="text-3xl">📄 📋 🖨️</span>}
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white mb-2">
                {language === 'jv' ? step.titleJv : step.titleId}
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 max-w-lg mx-auto leading-relaxed">
                {language === 'jv' ? step.descJv : step.descId}
              </p>
            </div>

            {/* Bottom Progress Bar inside Video */}
            <div>
              <div className="w-full bg-stone-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-amber-400 h-1.5 transition-all duration-100 ease-linear rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Central Play Overlay Button when paused */}
          {!isPlaying && (
            <button
              onClick={() => {
                setIsPlaying(true);
                if (progress >= 100) setProgress(0);
              }}
              className="relative z-10 w-16 h-16 rounded-full bg-emerald-600/90 hover:bg-emerald-500 text-white flex items-center justify-center shadow-2xl transition transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Play className="w-8 h-8 ml-1" />
            </button>
          )}
        </div>

        {/* Video Control Bar */}
        <div className="bg-stone-100 border-b border-stone-200 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 text-white font-semibold text-xs hover:bg-emerald-800 transition"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'Jeda' : 'Putar Video'}</span>
            </button>
            <button
              onClick={() => {
                setProgress(0);
                setCurrentStep(0);
                setIsPlaying(true);
              }}
              className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-200 transition"
              title="Putar Ulang Dari Awal"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setIsMuted(!isMuted);
                if (!isMuted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
              }}
              className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-200 transition"
              title={isMuted ? 'Nyalakan Suara Narator' : 'Matikan Suara Narator'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-stone-400" /> : <Volume2 className="w-4 h-4 text-emerald-700" />}
            </button>
          </div>

          <div className="flex items-center gap-1">
            {GUIDE_STEPS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentStep(idx);
                  setProgress(0);
                }}
                className={`h-2 rounded-full transition-all ${
                  idx === currentStep ? 'w-6 bg-emerald-700' : 'w-2 bg-stone-300 hover:bg-stone-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step Selector List (Readable for elder farmers) */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1">
          <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
            {language === 'jv' ? 'Urut-urutan Cara Nggunakake Aplikasi:' : 'Pilih Topik Panduan:'}
          </p>
          {GUIDE_STEPS.map((gStep, idx) => (
            <div
              key={idx}
              onClick={() => {
                setCurrentStep(idx);
                setProgress(0);
                speakCurrentStep(idx);
              }}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                idx === currentStep
                  ? 'bg-emerald-50 border-emerald-400 shadow-sm'
                  : 'bg-white border-stone-200 hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                    idx === currentStep
                      ? 'bg-emerald-700 text-white'
                      : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {idx + 1}
                </span>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900">
                    {language === 'jv' ? gStep.titleJv : gStep.titleId}
                  </h4>
                  <p className="text-[11px] text-stone-500 line-clamp-1">
                    {language === 'jv' ? gStep.descJv : gStep.descId}
                  </p>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 ${idx === currentStep ? 'text-emerald-700' : 'text-stone-300'}`} />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-600">
          <span className="flex items-center gap-1.5 font-medium">
            <Award className="w-4 h-4 text-emerald-700" />
            {language === 'jv' ? 'Gampang dipahami, mboten mbetahaken sinau IT rumit.' : 'Didesain ramah untuk warga lokal Desa Blederan'}
          </span>
          <button
            onClick={() => {
              if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
              }
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-stone-900 text-white font-bold hover:bg-stone-800 transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
