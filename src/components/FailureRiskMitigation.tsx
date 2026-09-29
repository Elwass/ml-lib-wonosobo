import React, { useState } from 'react';
import { DATA_CUACA_TERKINI_BLEDERAN, getKlasifikasiBMKG } from '../data/bmkgData';
import { generateWhatsAppWeatherAlert } from '../utils/plantingAlgorithm';
import { 
  AlertTriangle, 
  Send, 
  Check, 
  Copy, 
  ShieldAlert, 
  CloudLightning, 
  Thermometer, 
  Wind, 
  Droplet, 
  Info,
  CalendarDays,
  BellRing
} from 'lucide-react';

interface Props {
  language: 'id' | 'jv';
}

export const FailureRiskMitigation: React.FC<Props> = ({ language }) => {
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(8); // Default to forecasted heavy rain day (2026-10-02, 68.2 mm)
  const [customBlok, setCustomBlok] = useState<string>('Semua Blok Lahan Desa Blederan');
  const [copied, setCopied] = useState<boolean>(false);

  const selectedDay = DATA_CUACA_TERKINI_BLEDERAN[selectedDayIdx];
  const bmkgStatus = getKlasifikasiBMKG(selectedDay.curah_hujan_mm);

  // Failure probability calculations based on rainfall & saturation
  const isExtremeRain = selectedDay.curah_hujan_mm >= 50;
  const isHighWind = selectedDay.kecepatan_angin_kmh >= 25;
  const isHighHumidity = selectedDay.kelembapan >= 90;

  let failureRiskScore = 25;
  if (selectedDay.curah_hujan_mm >= 100) failureRiskScore = 92;
  else if (selectedDay.curah_hujan_mm >= 50) failureRiskScore = 78;
  else if (selectedDay.curah_hujan_mm >= 20) failureRiskScore = 55;
  else failureRiskScore = 20;

  // Mitigation checklist for Blederan
  const mitigasiTindakan = isExtremeRain
    ? [
        'SEGERA perdalam parit pembuangan air (drainase cacing) minimal 30 cm agar air hujan tidak menggenangi perakaran cabai.',
        'Keringkan air yang tergenang di lekukan mulsa plastik dalam tempo kurang dari 4 jam.',
        'Semprot fungisida protektif kontak (bahan aktif Mankozeb / Tembaga Oksida) setelah hujan reda untuk membasmi spora patek.',
        'Kocor larutan kapur dolomit + kalsium karbonat guna mencegah penurunan pH tanah andosol yang memicu layu bakteri.',
        'Perkuat ikatan ajir/lanjaran bambu karena angin kencang berpotensi merobohkan tanaman tomat dan cabai yang berbuah lebat.',
      ]
    : [
        'Lakukan pengecekan rutin pada daun bawah untuk mendeteksi bercak antraknosa sedini mungkin.',
        'Gunakan mulsa dan bersihkan gulma di sekeliling bedengan.',
        'Jaga kelembapan tanah agar stabil di sekitar perakaran.',
      ];

  // WhatsApp Alert Generator
  const waEncodedMsg = generateWhatsAppWeatherAlert({
    tanggal: selectedDay.tanggal,
    chMm: selectedDay.curah_hujan_mm,
    klasifikasi: selectedDay.klasifikasi,
    tingkatBahaya: bmkgStatus.level,
    blokWilayah: customBlok,
    tindakanMitigasi: mitigasiTindakan,
  });

  const waDirectUrl = `https://wa.me/?text=${waEncodedMsg}`;

  const handleCopyAlert = () => {
    const rawText = decodeURIComponent(waEncodedMsg);
    navigator.clipboard.writeText(rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Alert Emergency */}
      <div
        className={`rounded-3xl p-5 sm:p-6 border shadow-sm transition-all ${
          failureRiskScore >= 70
            ? 'bg-rose-50 border-rose-300 text-rose-950'
            : failureRiskScore >= 50
            ? 'bg-amber-50 border-amber-300 text-amber-950'
            : 'bg-emerald-50 border-emerald-300 text-emerald-950'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div
              className={`p-3 rounded-2xl flex-shrink-0 ${
                failureRiskScore >= 70
                  ? 'bg-rose-600 text-white'
                  : failureRiskScore >= 50
                  ? 'bg-amber-600 text-white'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider">
                  {language === 'jv' ? 'Radar Peringatan Dini Cuaca BMKG' : 'Sistem Peringatan Dini Bencana Cuaca'}
                </span>
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    failureRiskScore >= 70
                      ? 'bg-rose-200 text-rose-900 font-bold'
                      : 'bg-amber-200 text-amber-900'
                  }`}
                >
                  Status: {bmkgStatus.level} ({selectedDay.curah_hujan_mm} mm)
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black mt-1">
                {selectedDay.curah_hujan_mm >= 50
                  ? 'Waspada Hujan Lebat di Wilayah Mojotengah - Risiko Gagal Panen Meningkat!'
                  : 'Kondisi Cuaca Desa Blederan Relatif Aman untuk Aktivitas Tani'}
              </h3>
              <p className="text-xs opacity-90 mt-1 max-w-2xl leading-relaxed">
                Stasiun Pos Mojotengah (33071101a) mencatat prakiraan curah hujan pada tanggal{' '}
                <strong>{selectedDay.tanggal}</strong> sebesar <strong>{selectedDay.curah_hujan_mm} mm</strong>.
                Segera lakukan langkah proteksi guludan dan penyemprotan preventif.
              </p>
            </div>
          </div>

          {/* Quick CTA to WhatsApp broadcast */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2 flex-shrink-0">
            <a
              href={waDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-md transition active:scale-95 text-center"
            >
              <Send className="w-4 h-4 text-emerald-200" />
              <span>{language === 'jv' ? 'Kirim Kabar Peringatan dhateng WA' : 'Kirim Peringatan ke Grup WA Petani'}</span>
            </a>
            <button
              onClick={handleCopyAlert}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-300 bg-white/90 text-stone-700 hover:bg-stone-100 text-xs font-semibold cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Teks Tersalin!' : 'Salin Teks Peringatan'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 7-Day Weather Forecast & Failure Risk Timeline */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-emerald-700" />
              <span>Jadwal Harian Prakiraan Cuaca & Risiko Gagal Panen (Blederan)</span>
            </h3>
            <p className="text-xs text-stone-500">
              Pilih tanggal untuk melihat rincian langkah proteksi di lapangan.
            </p>
          </div>
          <span className="text-[11px] font-bold text-stone-500">
            Klik hari untuk simulasi mitigasi
          </span>
        </div>

        {/* Day cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {DATA_CUACA_TERKINI_BLEDERAN.slice(5).map((day, idx) => {
            const actualIdx = idx + 5;
            const isSelected = selectedDayIdx === actualIdx;
            const isHeavy = day.curah_hujan_mm >= 50;
            const isMed = day.curah_hujan_mm >= 20;

            return (
              <button
                key={day.tanggal}
                onClick={() => setSelectedDayIdx(actualIdx)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600/30'
                    : isHeavy
                    ? 'bg-rose-50/70 border-rose-200 hover:bg-rose-100/60'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <div className="text-[10px] font-bold text-stone-500 uppercase">
                  {day.tanggal.slice(5)} {day.isForecast ? '· Prediksi' : ''}
                </div>
                <div className="flex items-center gap-1.5 mt-1 font-extrabold text-sm text-stone-900">
                  <CloudLightning className={`w-4 h-4 ${isHeavy ? 'text-rose-600' : isMed ? 'text-amber-500' : 'text-sky-500'}`} />
                  <span>{day.curah_hujan_mm} mm</span>
                </div>
                <div className="text-[10px] text-stone-500 line-clamp-1 mt-1">
                  {day.klasifikasi.split('(')[0]}
                </div>

                <div className="mt-2 pt-2 border-t border-stone-200/60 flex items-center justify-between text-[10px]">
                  <span className="font-semibold text-stone-600">Risiko:</span>
                  <span
                    className={`font-black ${
                      isHeavy ? 'text-rose-600' : isMed ? 'text-amber-600' : 'text-emerald-600'
                    }`}
                  >
                    {isHeavy ? '78%' : isMed ? '55%' : '20%'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detail Analisis & Fitur Kirim WhatsApp Otomatis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: Parameter Fisik Cuaca */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-4">
          <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
            <Info className="w-4 h-4 text-emerald-700" />
            Parameter Cuaca Pos Mojotengah ({selectedDay.tanggal})
          </h4>

          <div className="space-y-3">
            <div className="p-3 bg-stone-50 rounded-2xl flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-stone-600 font-medium">
                <CloudLightning className="w-4 h-4 text-sky-600" />
                Curah Hujan Harian:
              </span>
              <span className="font-black text-stone-900 text-sm">{selectedDay.curah_hujan_mm} mm</span>
            </div>

            <div className="p-3 bg-stone-50 rounded-2xl flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-stone-600 font-medium">
                <Droplet className="w-4 h-4 text-blue-500" />
                Kelembapan Udara (RH):
              </span>
              <span className="font-black text-stone-900 text-sm">{selectedDay.kelembapan}%</span>
            </div>

            <div className="p-3 bg-stone-50 rounded-2xl flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-stone-600 font-medium">
                <Thermometer className="w-4 h-4 text-orange-500" />
                Suhu Udara Lereng:
              </span>
              <span className="font-black text-stone-900 text-sm">{selectedDay.suhu_min}°C - {selectedDay.suhu_max}°C</span>
            </div>

            <div className="p-3 bg-stone-50 rounded-2xl flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-stone-600 font-medium">
                <Wind className="w-4 h-4 text-teal-500" />
                Kecepatan Angin:
              </span>
              <span className="font-black text-stone-900 text-sm">{selectedDay.kecepatan_angin_kmh} km/jam</span>
            </div>
          </div>

          <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1">
            <span className="font-bold block">💡 Karakteristik Desa Blederan:</span>
            <p className="text-[11px] leading-relaxed">
              Elevasi ~1000 mdpl memiliki suhu dingin dan kabut tebal. Bila kelembapan &gt; 90% bertemu suhu malam &lt; 16°C, spora jamur <em>Phytophthora</em> dan <em>Colletotrichum</em> berkembang biak 3 kali lebih cepat.
            </p>
          </div>
        </div>

        {/* Center & Right Column: Langkah Mitigasi & WA Generator */}
        <div className="lg:col-span-2 space-y-4">
          {/* Mitigation Actions Checklist */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h4 className="text-sm font-extrabold text-stone-900">
                  Instruksi Langkah Mitigasi Darurat Petani Desa Blederan:
                </h4>
                <p className="text-xs text-stone-500">
                  Lakukan dalam waktu 24 jam sebelum atau sesudah hujan lebat turun.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                {mitigasiTindakan.length} Tindakan
              </span>
            </div>

            <div className="space-y-2.5">
              {mitigasiTindakan.map((action, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl border border-stone-200 bg-stone-50/60 hover:bg-stone-50 flex items-start gap-3 transition"
                >
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs text-stone-800 leading-relaxed font-medium">
                    {action}
                  </p>
                </div>
              ))}
            </div>

            {/* WA Notification Preview Box */}
            <div className="pt-3 border-t border-stone-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                  <BellRing className="w-4 h-4 text-emerald-700" />
                  Format Pesan Peringatan Otomatis WhatsApp (Siap Kirim):
                </span>
                <select
                  value={customBlok}
                  onChange={(e) => setCustomBlok(e.target.value)}
                  className="text-xs font-semibold px-2.5 py-1 rounded-xl border border-stone-300 bg-white"
                >
                  <option value="Semua Blok Lahan Desa Blederan">Semua Blok Desa Blederan</option>
                  <option value="Blok Krajan 1 & 2">Khusus Blok Krajan</option>
                  <option value="Blok Gandok Kidul">Khusus Blok Gandok</option>
                  <option value="Blok Kaliurip Kulon">Khusus Blok Kaliurip</option>
                  <option value="Blok Sirandu & Sikunir">Khusus Blok Sirandu</option>
                </select>
              </div>

              {/* Message Simulator Box */}
              <div className="p-4 rounded-2xl bg-emerald-950 text-emerald-100 text-xs font-mono leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap border border-emerald-800 shadow-inner">
                {decodeURIComponent(waEncodedMsg)}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <p className="text-[11px] text-stone-500">
                  💡 Tombol ini akan otomatis membuka aplikasi WhatsApp dengan pesan peringatan di atas.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyAlert}
                    className="px-3.5 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-xs font-bold text-stone-700 transition cursor-pointer"
                  >
                    {copied ? '✓ Berhasil Disalin' : 'Salin Pesan'}
                  </button>
                  <a
                    href={waDirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow transition active:scale-95 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim Sekarang ke WhatsApp Warga</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
