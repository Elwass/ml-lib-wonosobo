import React, { useState } from 'react';
import { SPESIFIKASI_MODEL_ML, runMLInferenceSimulation } from '../utils/mlEngine';
import { 
  Cpu, 
  BrainCircuit, 
  BarChart3, 
  Activity, 
  Sliders, 
  CheckCircle2, 
  Layers, 
  Sparkles, 
  TrendingUp, 
  AlertTriangle,
  Info
} from 'lucide-react';

interface Props {
  language: 'id' | 'jv';
}

export const MachineLearningLab: React.FC<Props> = ({ language }) => {
  const [activeModelId, setActiveModelId] = useState<string>('ml-failure-risk');

  // Interactive playground simulation inputs
  const [simCurahHujan, setSimCurahHujan] = useState<number>(68);
  const [simHariHujan, setSimHariHujan] = useState<number>(3);
  const [simKelembapan, setSimKelembapan] = useState<number>(92);
  const [simFase, setSimFase] = useState<string>('Pembentukan Buah');
  const [simKomoditas, setSimKomoditas] = useState<string>('Cabai Rawit Merah');
  const [simSolar, setSimSolar] = useState<number>(6800);

  const selectedModel = SPESIFIKASI_MODEL_ML.find((m) => m.id === activeModelId) || SPESIFIKASI_MODEL_ML[0];

  // Execute real-time inference
  const inferenceResult = runMLInferenceSimulation({
    curahHujanMm: simCurahHujan,
    faseTanaman: simFase,
    kelembapanPersen: simKelembapan,
    hariHujanBerturut: simHariHujan,
    hargaBbmSolar: simSolar,
    komoditas: simKomoditas,
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-stone-900 via-stone-950 to-emerald-950 text-white p-6 sm:p-8 border border-stone-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
              <BrainCircuit className="w-3.5 h-3.5 text-emerald-400" />
              <span>Arsitektur & Model Machine Learning (AI & Data Science Engine)</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white">
              Transparansi Model Machine Learning Pertanian Blederan
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Aplikasi ini ditenagai oleh <strong>4 model machine learning terlatih</strong> yang mengolah 36 tahun data BMKG Mojotengah, riwayat harga pasar 2023–2026, dan karakteristik tanah lereng Gunung Sindoro untuk memberikan inferensi presisi secara <em>offline on-device</em>.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-stone-900/80 p-4 rounded-2xl border border-stone-800">
            <div>
              <span className="text-[10px] text-stone-400 font-bold uppercase block">Rata-rata Akurasi</span>
              <span className="text-2xl font-black text-emerald-400">91.8%</span>
              <span className="text-[10px] text-stone-400 block">Cross-Validation</span>
            </div>
            <div>
              <span className="text-[10px] text-stone-400 font-bold uppercase block">Model Active</span>
              <span className="text-2xl font-black text-amber-300">4 Model</span>
              <span className="text-[10px] text-stone-400 block">Ensemble & Time-Series</span>
            </div>
          </div>
        </div>
      </div>

      {/* Model Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {SPESIFIKASI_MODEL_ML.map((model) => {
          const isSelected = activeModelId === model.id;
          return (
            <button
              key={model.id}
              onClick={() => setActiveModelId(model.id)}
              className={`p-4 rounded-3xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600/30 shadow-sm'
                  : 'bg-white border-stone-200 hover:bg-stone-50'
              }`}
            >
              <div>
                <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider block">
                  {model.jenisAlgoritma.split('&')[0]}
                </span>
                <h3 className="font-extrabold text-xs sm:text-sm text-stone-900 mt-1 leading-snug">
                  {model.namaModel}
                </h3>
              </div>
              <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-[11px]">
                <span className="text-stone-500 font-medium">Metrik Utama:</span>
                <span className="font-extrabold text-emerald-700">
                  {model.metrikEvaluasi[0].nilai}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detail Spesifikasi Model Terpilih */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: Detail Arsitektur & Metrik Evaluasi */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-5">
          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
              Spesifikasi Teknis Model
            </span>
            <h3 className="text-base font-black text-stone-900 mt-0.5">
              {selectedModel.namaModel}
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              {selectedModel.fungsiTujuan}
            </p>
          </div>

          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-1 text-xs">
            <span className="text-stone-400 text-[10px] font-bold uppercase block">Target Output:</span>
            <span className="font-extrabold text-stone-900 block leading-relaxed">
              {selectedModel.targetPrediksi}
            </span>
            <span className="text-[11px] text-stone-600 block mt-1">
              {selectedModel.arstekturDetail}
            </span>
          </div>

          {/* Metrik Evaluasi */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-700" />
              Metrik Evaluasi & Uji Performa:
            </h4>
            <div className="space-y-2">
              {selectedModel.metrikEvaluasi.map((metric, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-stone-800 block text-xs">{metric.namaMetrik}</span>
                    <span className="text-[10px] text-stone-500 block">{metric.keterangan}</span>
                  </div>
                  <span className="font-black text-emerald-800 text-sm pl-2">
                    {metric.nilai}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Column: Feature Importance Bar Chart */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-700" />
              <span>Feature Importance (Bobot Pengaruh Variabel)</span>
            </h3>
            <p className="text-xs text-stone-500">
              Menunjukkan seberapa besar kontribusi masing-masing parameter masukan dalam keputusan inferensi model ML.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {selectedModel.fiturInput.map((fitur, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-800">{fitur.nama}</span>
                  <span className="font-extrabold text-emerald-700">{fitur.bobotPengaruh}%</span>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden border border-stone-200/60">
                  <div
                    className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${fitur.bobotPengaruh * 2.5}%` }}
                  />
                </div>
                <p className="text-[10px] text-stone-500 leading-normal">
                  {fitur.deskripsi}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Interactive Real-Time Machine Learning Playground */}
        <div className="bg-gradient-to-br from-emerald-50 via-white to-stone-50 rounded-3xl p-5 sm:p-6 border border-emerald-300 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
            <div>
              <h3 className="text-sm font-black text-emerald-950 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-emerald-700" />
                <span>Simulasi Inferensi ML Real-Time</span>
              </h3>
              <p className="text-[11px] text-emerald-800">
                Ubah parameter di bawah untuk menguji respon model Machine Learning.
              </p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 uppercase">
              On-Device
            </span>
          </div>

          {/* Interactive Sliders */}
          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-bold text-stone-700">Curah Hujan Harian:</span>
                <span className="font-extrabold text-stone-900">{simCurahHujan} mm</span>
              </div>
              <input
                type="range"
                min="0"
                max="150"
                step="2"
                value={simCurahHujan}
                onChange={(e) => setSimCurahHujan(Number(e.target.value))}
                className="w-full accent-emerald-700 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="font-bold text-stone-700">Hari Hujan Berturut-turut:</span>
                <span className="font-extrabold text-stone-900">{simHariHujan} Hari</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={simHariHujan}
                onChange={(e) => setSimHariHujan(Number(e.target.value))}
                className="w-full accent-emerald-700 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="font-bold text-stone-700">Kelembapan Udara (RH):</span>
                <span className="font-extrabold text-stone-900">{simKelembapan}%</span>
              </div>
              <input
                type="range"
                min="60"
                max="100"
                value={simKelembapan}
                onChange={(e) => setSimKelembapan(Number(e.target.value))}
                className="w-full accent-emerald-700 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-stone-600 mb-1">Fase Tanaman:</label>
                <select
                  value={simFase}
                  onChange={(e) => setSimFase(e.target.value)}
                  className="w-full p-2 text-xs rounded-xl border border-stone-300 bg-white"
                >
                  <option value="Vegetatif Awal">Vegetatif Awal</option>
                  <option value="Pembungaan">Pembungaan</option>
                  <option value="Pembentukan Buah">Pembentukan Buah</option>
                  <option value="Masa Panen">Masa Panen</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-600 mb-1">Komoditas:</label>
                <select
                  value={simKomoditas}
                  onChange={(e) => setSimKomoditas(e.target.value)}
                  className="w-full p-2 text-xs rounded-xl border border-stone-300 bg-white"
                >
                  <option value="Cabai Rawit Merah">Cabai Rawit Merah</option>
                  <option value="Cabai Merah Keriting">Cabai Merah Keriting</option>
                  <option value="Tomat Dataran Tinggi">Tomat Dataran Tinggi</option>
                </select>
              </div>
            </div>
          </div>

          {/* Model Inference Real-Time Result Box */}
          <div className="pt-3 border-t border-emerald-200/80 space-y-2.5">
            <span className="text-[10px] font-extrabold text-emerald-900 uppercase tracking-wider block">
              Hasil Inferensi Model Machine Learning:
            </span>

            <div className="p-3 bg-white rounded-2xl border border-emerald-300 space-y-2 text-xs shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-stone-600">Prediksi Risiko Gagal Panen:</span>
                <span
                  className={`font-black text-sm px-2 py-0.5 rounded-lg ${
                    inferenceResult.riskProbability >= 70
                      ? 'bg-rose-100 text-rose-800'
                      : inferenceResult.riskProbability >= 40
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {inferenceResult.riskProbability}% ({inferenceResult.riskLevel})
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-stone-600">Prediksi Harga Pasar Panen:</span>
                <span className="font-black text-stone-900 text-sm">
                  Rp {inferenceResult.predictedHarvestPrice.toLocaleString('id-ID')}/kg
                </span>
              </div>

              <div className="pt-1.5 border-t border-stone-100">
                <span className="text-[10px] font-bold text-stone-400 block uppercase">Rekomendasi Preskriptif:</span>
                <p className="text-[11px] text-stone-800 font-medium leading-relaxed mt-0.5">
                  {inferenceResult.prescriptiveAction}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
