import React, { useState } from 'react';
import { KOMODITAS_UNGGULAN_BLEDERAN } from '../data/agricultureData';
import { RATA_RATA_BULANAN_MOJOTENGAH } from '../data/bmkgData';
import { hitungRekomendasiTanam, PlantingRecommendationResult } from '../utils/plantingAlgorithm';
import { 
  Calendar, 
  Sprout, 
  CloudRain, 
  Coins, 
  TrendingUp, 
  ShieldCheck, 
  AlertCircle, 
  ChevronRight,
  Droplets,
  Layers,
  Sparkles
} from 'lucide-react';

interface Props {
  language: 'id' | 'jv';
}

export const PlantingRecommendation: React.FC<Props> = ({ language }) => {
  const [selectedCropId, setSelectedCropId] = useState<string>('cabai-rawit');
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1); // default bulan sekarang
  const [landAreaUbin, setLandAreaUbin] = useState<number>(100); // 100 ubin = 1400 m2 (lahan umum petani Blederan)

  const selectedCrop = KOMODITAS_UNGGULAN_BLEDERAN.find((c) => c.id === selectedCropId) || KOMODITAS_UNGGULAN_BLEDERAN[0];
  const allMonthlyRecs = hitungRekomendasiTanam(selectedCropId);
  const currentMonthRec = allMonthlyRecs.find((r) => r.bulanTanam === selectedMonth) || allMonthlyRecs[0];

  // Best recommended month based on highest feasibility score
  const bestMonthRec = [...allMonthlyRecs].sort((a, b) => b.skorKelayakan - a.skorKelayakan)[0];

  // Hitung perkiraan omzet & profit berdasarkan input luas ubin petani
  const estimasiProfitPetani = currentMonthRec.estimasiKeuntunganPerUbin * landAreaUbin;

  return (
    <div className="space-y-6">
      {/* Hero Card Rekomendasi Teratas Desa Blederan */}
      <div className="rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-900 to-stone-900 text-white p-5 sm:p-7 shadow-lg border border-emerald-700/50">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'jv' ? 'Petung Wanci Tanam Paling Utama' : 'Waktu Tanam Paling Direkomendasikan'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {language === 'jv'
                ? `Wulan ${bestMonthRec.namaBulanTanam}: Wayah Tanam Emas ${selectedCrop.nama}`
                : `Bulan ${bestMonthRec.namaBulanTanam}: Jendela Tanam Emas ${selectedCrop.nama}`}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              {language === 'jv'
                ? `Adhedhasar data curah udan BMKG Pos Mojotengah (33071101a), wulan ${bestMonthRec.namaBulanTanam} paling aman saking serangan patek amargi curah udan cendhek, lan asil panen dipetik pas rega pasar nuju puncak.`
                : `Berdasarkan datasheet 36 tahun BMKG Pos Mojotengah, menanam di bulan ${bestMonthRec.namaBulanTanam} meminimalkan risiko busuk akar & antraknosa (patek) hingga 85%, dengan panen perkiraan di ${bestMonthRec.bulanPanenPerkiraan} saat harga cabai di Wonosobo mencapai puncaknya.`}
            </p>
          </div>

          {/* Quick Metrics Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-emerald-950/60 p-4 rounded-2xl border border-emerald-500/30">
            <div className="space-y-1">
              <span className="text-[10px] text-emerald-300 font-semibold uppercase tracking-wider block">
                {language === 'jv' ? 'Skor Kelayakan' : 'Skor Kelayakan'}
              </span>
              <div className="text-2xl font-black text-amber-300">
                {bestMonthRec.skorKelayakan}<span className="text-xs text-emerald-200">/100</span>
              </div>
              <span className="text-[11px] text-emerald-300 font-medium">Sangat Menguntungkan</span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-emerald-300 font-semibold uppercase tracking-wider block">
                {language === 'jv' ? 'Risiko Gagal' : 'Risiko Gagal Panen'}
              </span>
              <div className="text-2xl font-black text-emerald-400">
                {bestMonthRec.risikoGagalPanen.persentase}%
              </div>
              <span className="text-[11px] text-emerald-300 font-medium">Paling Rendah</span>
            </div>

            <div className="col-span-2 sm:col-span-1 space-y-1">
              <span className="text-[10px] text-emerald-300 font-semibold uppercase tracking-wider block">
                {language === 'jv' ? 'Est. Panen' : 'Fase Panen'}
              </span>
              <div className="text-base font-bold text-white">
                {bestMonthRec.bulanPanenPerkiraan.split(' ')[0]}
              </div>
              <span className="text-[11px] text-amber-200 font-medium">Harga Tertinggi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selector Komoditas & Bulan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: Crop & Month Controller */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-5">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sprout className="w-4 h-4 text-emerald-700" />
              {language === 'jv' ? 'Pilih Jinis Tetanduran:' : 'Pilih Komoditas Tanaman:'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {KOMODITAS_UNGGULAN_BLEDERAN.map((crop) => {
                const isSelected = selectedCropId === crop.id;
                return (
                  <button
                    key={crop.id}
                    onClick={() => setSelectedCropId(crop.id)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600/30'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="font-extrabold text-xs text-stone-900 leading-snug">
                      {crop.nama}
                    </div>
                    <div className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                      {language === 'jv' ? crop.namaJawa : crop.varietasLokal[0]}
                    </div>
                    <div className="mt-2 text-[10px] font-bold text-emerald-700">
                      Umur: {crop.umurHari} HST
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Month Slider / Grid */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-700" />
                {language === 'jv' ? 'Pilih Wulan Tandur:' : 'Simulasi Bulan Tanam:'}
              </span>
              <span className="text-emerald-700 font-extrabold text-xs">
                {RATA_RATA_BULANAN_MOJOTENGAH[selectedMonth - 1].nama}
              </span>
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {RATA_RATA_BULANAN_MOJOTENGAH.map((m) => {
                const isSelected = selectedMonth === m.bulan;
                const recForM = allMonthlyRecs.find((r) => r.bulanTanam === m.bulan);
                const isTop = recForM?.skorKelayakan && recForM.skorKelayakan >= 85;

                return (
                  <button
                    key={m.bulan}
                    onClick={() => setSelectedMonth(m.bulan)}
                    className={`py-2 px-1 rounded-xl text-center text-xs font-bold transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-emerald-700 text-white shadow-md'
                        : isTop
                        ? 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    <div>{m.nama.slice(0, 3)}</div>
                    <div
                      className={`text-[9px] font-normal ${
                        isSelected ? 'text-emerald-100' : 'text-stone-500'
                      }`}
                    >
                      {Math.round(m.ch_avg)} mm
                    </div>
                    {isTop && !isSelected && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500" />
                    )}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-[11px] text-stone-500">
              *Tanda titik kuning: Waktu tanam berpotensi hasil & harga tertinggi di Mojotengah.
            </p>
          </div>

          {/* Input Luas Lahan Petani (Ubin) */}
          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-stone-700 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-700" />
                {language === 'jv' ? 'Jembar Sawah (Ubin):' : 'Luas Lahan Petani (Ubin):'}
              </span>
              <span className="font-extrabold text-stone-900 text-sm">{landAreaUbin} Ubin</span>
            </div>
            <input
              type="range"
              min="20"
              max="500"
              step="10"
              value={landAreaUbin}
              onChange={(e) => setLandAreaUbin(Number(e.target.value))}
              className="w-full accent-emerald-700 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-500">
              <span>20 Ubin (~280 m²)</span>
              <span>100 Ubin (~1.400 m²)</span>
              <span>500 Ubin (~7.000 m²)</span>
            </div>
            <div className="text-[11px] text-emerald-800 bg-emerald-100/70 p-2 rounded-xl mt-2 font-medium">
              💡 1 Ubin di Desa Blederan = 14 m². Luas Anda: <strong>{landAreaUbin * 14} m²</strong>.
            </div>
          </div>
        </div>

        {/* Middle & Right Column: Detail Analisis Bulan Terpilih */}
        <div className="lg:col-span-2 space-y-4">
          {/* Status Card Bulan Terpilih */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    {language === 'jv' ? 'Asil Petung Wulan:' : 'Hasil Analisis Waktu Tanam:'}
                  </span>
                  <span
                    className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                      currentMonthRec.skorKelayakan >= 80
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : currentMonthRec.skorKelayakan >= 60
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}
                  >
                    {currentMonthRec.kategori}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-stone-900 mt-1">
                  Tanam di Bulan {currentMonthRec.namaBulanTanam} → Panen {currentMonthRec.bulanPanenPerkiraan}
                </h3>
              </div>

              {/* Estimated Profit for this farmer's land size */}
              <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 text-right">
                <span className="text-[10px] text-stone-500 uppercase font-bold block">
                  {language === 'jv' ? 'Taksiran Bati Bersih:' : 'Estimasi Laba Bersih Petani:'}
                </span>
                <span className="text-lg font-black text-emerald-700">
                  Rp {estimasiProfitPetani.toLocaleString('id-ID')}
                </span>
                <span className="text-[10px] text-stone-500 block">
                  untuk lahan {landAreaUbin} Ubin
                </span>
              </div>
            </div>

            {/* Weather & Market Condition Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Weather factor */}
              <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-2">
                <div className="flex items-center gap-2 text-sky-900 font-bold text-xs">
                  <CloudRain className="w-4 h-4 text-sky-600" />
                  <span>Kondisi Curah Hujan BMKG Mojotengah</span>
                </div>
                <p className="text-xs text-sky-800 leading-relaxed">
                  {currentMonthRec.alasanCuaca}
                </p>
                <div className="pt-2 text-[11px] text-sky-950 font-semibold border-t border-sky-200/60 flex items-center justify-between">
                  <span>Hari Hujan Rata-rata:</span>
                  <span>{RATA_RATA_BULANAN_MOJOTENGAH[selectedMonth - 1].hh_avg} hari / bulan</span>
                </div>
              </div>

              {/* Market price factor */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                  <TrendingUp className="w-4 h-4 text-amber-600" />
                  <span>Tren Harga Pasar Wonosobo saat Panen</span>
                </div>
                <p className="text-xs text-amber-900 leading-relaxed">
                  {currentMonthRec.alasanHarga}
                </p>
                <div className="pt-2 text-[11px] text-amber-950 font-semibold border-t border-amber-200/60 flex items-center justify-between">
                  <span>Target Pasar Utama:</span>
                  <span>Pasar Induk & Pasar Kertek</span>
                </div>
              </div>
            </div>

            {/* Failure Risk & Mitigation Box */}
            <div className={`p-4 rounded-2xl border ${
              currentMonthRec.risikoGagalPanen.tingkat === 'Kritis' || currentMonthRec.risikoGagalPanen.tingkat === 'Tinggi'
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 font-bold text-xs">
                  <AlertCircle className="w-4 h-4" />
                  <span>
                    Prediksi Risiko Gagal Panen: <strong>{currentMonthRec.risikoGagalPanen.tingkat} ({currentMonthRec.risikoGagalPanen.persentase}%)</strong>
                  </span>
                </div>
                <span className="text-[11px] font-semibold">
                  {currentMonthRec.risikoGagalPanen.persentase < 30 ? '✅ Kondisi Aman' : '⚠️ Butuh Penanganan Khusus'}
                </span>
              </div>

              {/* Root causes */}
              <div className="space-y-1 mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider block opacity-80">
                  Potensi Ancaman di Desa Blederan:
                </span>
                <ul className="text-xs space-y-1 list-disc list-inside">
                  {currentMonthRec.risikoGagalPanen.penyebabUtama.map((cause, idx) => (
                    <li key={idx}>{cause}</li>
                  ))}
                </ul>
              </div>

              {/* Mitigation Actions */}
              <div className="space-y-1 pt-2.5 border-t border-current/20">
                <span className="text-[11px] font-bold uppercase tracking-wider block">
                  Langkah Mitigasi Wajib Dilakukan Petani:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {currentMonthRec.risikoGagalPanen.langkahMitigasi.map((action, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-xs bg-white/70 p-2 rounded-xl border border-current/15">
                      <span className="font-bold text-emerald-700">✓</span>
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tahapan Tanam Step-by-Step Timeline */}
            <div className="pt-2">
              <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-3">
                Jadwal Siklus Tanam Ideal {selectedCrop.nama} (Blederan, Mojotengah):
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
                  <span className="text-[10px] font-extrabold text-stone-400 uppercase block">Minggu 1 - 3</span>
                  <div className="font-bold text-xs text-stone-900 mt-1">Persemaian Bibit</div>
                  <p className="text-[11px] text-stone-500 mt-0.5">Sungkup plastik transparan agar benih tidak busuk kena hujan.</p>
                </div>
                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
                  <span className="text-[10px] font-extrabold text-stone-400 uppercase block">Minggu 4 - 5</span>
                  <div className="font-bold text-xs text-stone-900 mt-1">Olah Lahan & Bedengan</div>
                  <p className="text-[11px] text-stone-500 mt-0.5">Tabur dolomit (1 ton/Ha), pupuk kandang matang & pasang mulsa.</p>
                </div>
                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
                  <span className="text-[10px] font-extrabold text-stone-400 uppercase block">Minggu 6 - 12</span>
                  <div className="font-bold text-xs text-stone-900 mt-1">Vegetatif & Pembungaan</div>
                  <p className="text-[11px] text-stone-500 mt-0.5">Kocor pupuk NPK berimbang + pencegahan jamur kontak tiap 7 hari.</p>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300">
                  <span className="text-[10px] font-extrabold text-emerald-600 uppercase block">Minggu 13+</span>
                  <div className="font-bold text-xs text-emerald-950 mt-1">Masa Panen Raya</div>
                  <p className="text-[11px] text-emerald-800 mt-0.5">Petik interval 4-5 hari sekali saat buah 90% matang merah.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Chart Curah Hujan Bulanan BMKG vs Siklus Harga */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
              <CloudRain className="w-4 h-4 text-sky-600" />
              <span>Grafik Curah Hujan Pos Mojotengah (BMKG) vs Fluktuasi Harga Cabai</span>
            </h3>
            <p className="text-xs text-stone-500">
              Pola historis membuktikan: saat curah hujan Mojotengah menembus &gt;450 mm (November-Maret), harga cabai melonjak tajam karena suplai nasional berkurang.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-sky-700 font-bold">
              <span className="w-3 h-3 rounded-sm bg-sky-400 inline-block" />
              Curah Hujan (mm)
            </span>
            <span className="flex items-center gap-1.5 text-rose-700 font-bold">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
              Tren Harga (Rb/kg)
            </span>
          </div>
        </div>

        {/* Bar & Line Chart Representation */}
        <div className="pt-4 pb-2">
          <div className="grid grid-cols-12 gap-1.5 sm:gap-3 items-end h-52 border-b border-stone-200 px-2">
            {RATA_RATA_BULANAN_MOJOTENGAH.map((item, idx) => {
              // ch_avg max ~600mm -> scale to max 100%
              const heightPercent = Math.min(100, Math.round((item.ch_avg / 600) * 100));
              const isSelected = selectedMonth === item.bulan;
              // Harga rata-rata rawit di bulan itu (sekitar 30-95 rb)
              const priceEstimates = [72, 82, 94, 68, 34, 36, 42, 45, 48, 52, 68, 88];
              const priceValue = priceEstimates[idx];

              return (
                <div
                  key={item.bulan}
                  onClick={() => setSelectedMonth(item.bulan)}
                  className="flex flex-col items-center gap-1.5 h-full justify-end cursor-pointer group"
                >
                  {/* Price Tag Indicator on top */}
                  <span className={`text-[10px] font-extrabold ${isSelected ? 'text-rose-700' : 'text-stone-600'}`}>
                    {priceValue}k
                  </span>

                  {/* Combined Stack Bar */}
                  <div className="w-full max-w-[32px] flex flex-col justify-end items-center h-40">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-300 relative ${
                        isSelected
                          ? 'bg-sky-600 shadow-md ring-2 ring-emerald-500'
                          : heightPercent > 70
                          ? 'bg-sky-400 group-hover:bg-sky-500'
                          : 'bg-sky-300/80 group-hover:bg-sky-400'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    >
                      {/* Danger stripe indicator if rain > 450mm */}
                      {item.ch_avg > 450 && (
                        <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[8px] text-white font-bold">
                          ⚠️
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Month Label */}
                  <span
                    className={`text-[11px] font-bold ${
                      isSelected ? 'text-emerald-800 underline' : 'text-stone-500'
                    }`}
                  >
                    {item.nama.slice(0, 3)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
            <span className="font-bold text-stone-900 block">🌧️ Puncak Musim Hujan:</span>
            <p className="text-stone-600 text-[11px] mt-0.5">
              November s.d. Maret (Curah hujan &gt; 480 mm). Risiko patek tinggi, harga cabai tertinggi.
            </p>
          </div>
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
            <span className="font-bold text-stone-900 block">☀️ Puncak Kemarau Basah:</span>
            <p className="text-stone-600 text-[11px] mt-0.5">
              Juli s.d. Agustus (Curah hujan &lt; 100 mm). Waktu panen paling aman, kualitas buah prima.
            </p>
          </div>
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
            <span className="font-bold text-stone-900 block">🔄 Periode Pancaroba Labuhan:</span>
            <p className="text-stone-600 text-[11px] mt-0.5">
              September s.d. Oktober. Waktu tanam strategis petani maju Blederan untuk memanen cabai mahal di akhir tahun.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
