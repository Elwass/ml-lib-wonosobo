import React, { useState } from 'react';
import { LandParcel } from '../data/blederanParcels';
import { getLocalParcels, saveLocalParcels } from '../utils/offlineStorage';
import { 
  TrendingUp, 
  MapPin, 
  Plus, 
  Check, 
  Sprout, 
  Calendar, 
  Layers, 
  AlertCircle, 
  CheckCircle2, 
  Trash2,
  Droplets,
  Search,
  Filter
} from 'lucide-react';

interface Props {
  language: 'id' | 'jv';
}

export const ProductivityDashboard: React.FC<Props> = ({ language }) => {
  const [parcels, setParcels] = useState<LandParcel[]>(() => getLocalParcels());
  const [filterBlock, setFilterBlock] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);

  // New parcel form state
  const [newNamaPetak, setNewNamaPetak] = useState('');
  const [newBlok, setNewBlok] = useState('Blok Krajan 1');
  const [newPemilik, setNewPemilik] = useState('');
  const [newLuasUbin, setNewLuasUbin] = useState(100);
  const [newKomoditas, setNewKomoditas] = useState('Cabai Rawit Merah');
  const [newVarietas, setNewVarietas] = useState('Ori 212');
  const [newTanggalTanam, setNewTanggalTanam] = useState(new Date().toISOString().split('T')[0]);
  const [newFase, setNewFase] = useState<LandParcel['faseSaatIni']>('Vegetatif Awal');

  // Filter parcels
  const filteredParcels = parcels.filter((p) => {
    const matchBlock = filterBlock === 'all' || p.blokWilayah.toLowerCase().includes(filterBlock.toLowerCase());
    const matchSearch =
      p.namaPetak.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.pemilik.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.komoditas.toLowerCase().includes(searchQuery.toLowerCase());
    return matchBlock && matchSearch;
  });

  // Calculate totals
  const totalLuasM2 = parcels.reduce((sum, p) => sum + p.luasMeterPersegi, 0);
  const totalLuasUbin = parcels.reduce((sum, p) => sum + p.luasUbin, 0);
  const totalEstimasiHasilKw = parcels.reduce((sum, p) => sum + p.estimasiHasilKw, 0);
  const parcelsInHarvest = parcels.filter((p) => p.faseSaatIni === 'Masa Panen').length;
  const parcelsWarning = parcels.filter((p) => p.statusKesehatan.includes('Waspada') || p.statusKesehatan.includes('Tergenang')).length;

  const handleAddNewParcel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNamaPetak || !newPemilik) return;

    const newParcel: LandParcel = {
      id: `petak-${Date.now()}`,
      namaPetak: newNamaPetak,
      blokWilayah: newBlok,
      pemilik: newPemilik,
      luasMeterPersegi: newLuasUbin * 14,
      luasUbin: newLuasUbin,
      komoditas: newKomoditas,
      varietas: newVarietas,
      tanggalTanam: newTanggalTanam,
      estimasiPanen: 'Sekitar 75-90 hari setelah tanam',
      faseSaatIni: newFase,
      progresPersen: newFase === 'Pengolahan Tanah' ? 10 : newFase === 'Vegetatif Awal' ? 30 : newFase === 'Pembungaan' ? 50 : newFase === 'Pembentukan Buah' ? 75 : 90,
      statusKesehatan: 'Sangat Sehat',
      estimasiHasilKw: Math.round((newLuasUbin * 14 * 0.012) * 10) / 10,
      kadarAirTanah: 'Cukup / Lembap Ideal',
      kebutuhanTindakan: 'Perawatan rutin bedengan dan monitoring cuaca BMKG.',
    };

    const updated = [newParcel, ...parcels];
    setParcels(updated);
    saveLocalParcels(updated);
    setIsAddingNew(false);

    // Reset
    setNewNamaPetak('');
    setNewPemilik('');
  };

  const handleDeleteParcel = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data petak ini?')) {
      const updated = parcels.filter((p) => p.id !== id);
      setParcels(updated);
      saveLocalParcels(updated);
    }
  };

  const handleUpdateStatus = (id: string, newFase: LandParcel['faseSaatIni']) => {
    const updated = parcels.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          faseSaatIni: newFase,
          progresPersen:
            newFase === 'Pengolahan Tanah' ? 10 :
            newFase === 'Vegetatif Awal' ? 30 :
            newFase === 'Pembungaan' ? 55 :
            newFase === 'Pembentukan Buah' ? 75 :
            newFase === 'Masa Panen' ? 95 : 100,
        };
      }
      return p;
    });
    setParcels(updated);
    saveLocalParcels(updated);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Aggregates */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-700" />
            <span>
              {language === 'jv' ? 'Dasbor Produktivitas Sawah Blederan' : 'Dasbor Produktivitas Lahan Real-Time'}
            </span>
          </h2>
          <p className="text-xs text-stone-500">
            Monitoring kondisi petak tanaman, fase pertumbuhan, dan taksiran hasil panen Desa Blederan, Mojotengah.
          </p>
        </div>

        <button
          onClick={() => setIsAddingNew(!isAddingNew)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-md transition active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'jv' ? 'Tambah Petak Sawah' : 'Tambah Petak Lahan'}</span>
        </button>
      </div>

      {/* Aggregate Stat Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
            Total Lahan Terpantau
          </span>
          <div className="text-xl sm:text-2xl font-black text-stone-900">
            {totalLuasUbin} <span className="text-xs font-semibold text-stone-500">Ubin</span>
          </div>
          <span className="text-[10px] text-stone-400 block font-medium">
            ≈ {(totalLuasM2 / 10000).toFixed(2)} Hektar ({parcels.length} Petak)
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
            Estimasi Panen Total
          </span>
          <div className="text-xl sm:text-2xl font-black text-emerald-700">
            {totalEstimasiHasilKw.toFixed(1)} <span className="text-xs font-semibold text-stone-500">Kwintal</span>
          </div>
          <span className="text-[10px] text-emerald-600 block font-medium">
            ≈ {(totalEstimasiHasilKw * 100).toLocaleString('id-ID')} Kg komoditas
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
            Petak Siap Petik
          </span>
          <div className="text-xl sm:text-2xl font-black text-amber-600">
            {parcelsInHarvest} <span className="text-xs font-semibold text-stone-500">Petak</span>
          </div>
          <span className="text-[10px] text-amber-700 block font-medium">
            Siap masuk bursa pasar
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
            Status Waspada Cuaca
          </span>
          <div className={`text-xl sm:text-2xl font-black ${parcelsWarning > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
            {parcelsWarning} <span className="text-xs font-semibold text-stone-500">Petak</span>
          </div>
          <span className="text-[10px] text-stone-400 block font-medium">
            {parcelsWarning > 0 ? 'Perlu tindakan perbaikan parit' : 'Semua petak dalam kondisi aman'}
          </span>
        </div>
      </div>

      {/* Modal / Collapse Form: Tambah Petak Baru */}
      {isAddingNew && (
        <form
          onSubmit={handleAddNewParcel}
          className="p-5 sm:p-6 rounded-3xl bg-emerald-50/70 border border-emerald-300 shadow-md space-y-4 animate-fade-in"
        >
          <div className="flex items-center justify-between pb-3 border-b border-emerald-200">
            <h3 className="font-extrabold text-sm text-emerald-950 flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-700" />
              Pendaftaran Petak Lahan Petani Desa Blederan
            </h3>
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="text-xs font-bold text-stone-500 hover:text-stone-800"
            >
              Batal
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Nama Petak Sawah:</label>
              <input
                type="text"
                required
                placeholder="Contoh: Petak Wetan Gubug"
                value={newNamaPetak}
                onChange={(e) => setNewNamaPetak(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white focus:outline-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Pemilik / Penggarap:</label>
              <input
                type="text"
                required
                placeholder="Nama Petani"
                value={newPemilik}
                onChange={(e) => setNewPemilik(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white focus:outline-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Blok Wilayah di Blederan:</label>
              <select
                value={newBlok}
                onChange={(e) => setNewBlok(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white focus:outline-emerald-600"
              >
                <option value="Blok Krajan 1">Blok Krajan 1</option>
                <option value="Blok Krajan 2">Blok Krajan 2</option>
                <option value="Blok Gandok Kidul">Blok Gandok Kidul</option>
                <option value="Blok Kaliurip Kulon">Blok Kaliurip Kulon</option>
                <option value="Blok Sirandu">Blok Sirandu</option>
                <option value="Blok Sikunir Wetan">Blok Sikunir Wetan</option>
                <option value="Blok Wadas Tumpang">Blok Wadas Tumpang</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Luas Lahan (Ubin):</label>
              <input
                type="number"
                min="10"
                max="1000"
                value={newLuasUbin}
                onChange={(e) => setNewLuasUbin(Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white focus:outline-emerald-600"
              />
              <span className="text-[10px] text-stone-500 mt-0.5 block">
                = {newLuasUbin * 14} m²
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Komoditas yang Ditanam:</label>
              <select
                value={newKomoditas}
                onChange={(e) => setNewKomoditas(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white focus:outline-emerald-600"
              >
                <option value="Cabai Rawit Merah">Cabai Rawit Merah</option>
                <option value="Cabai Merah Keriting">Cabai Merah Keriting</option>
                <option value="Cabai Merah Besar (TW)">Cabai Merah Besar (TW)</option>
                <option value="Tomat Dataran Tinggi">Tomat Dataran Tinggi</option>
                <option value="Daun Bawang">Daun Bawang</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Fase Pertumbuhan Saat Ini:</label>
              <select
                value={newFase}
                onChange={(e) => setNewFase(e.target.value as LandParcel['faseSaatIni'])}
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white focus:outline-emerald-600"
              >
                <option value="Pengolahan Tanah">Pengolahan Tanah</option>
                <option value="Vegetatif Awal">Vegetatif Awal</option>
                <option value="Pembungaan">Pembungaan</option>
                <option value="Pembentukan Buah">Pembentukan Buah</option>
                <option value="Masa Panen">Masa Panen</option>
                <option value="Bera/Istirahat">Bera/Istirahat</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-200"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-700 text-white font-extrabold text-xs hover:bg-emerald-800 transition"
            >
              Simpan Data Petak
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-3xl border border-stone-200 shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari petak, nama petani, komoditas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-2xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-emerald-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
          <Filter className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
          <button
            onClick={() => setFilterBlock('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              filterBlock === 'all'
                ? 'bg-emerald-700 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Semua Blok ({parcels.length})
          </button>
          <button
            onClick={() => setFilterBlock('Krajan')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              filterBlock === 'Krajan'
                ? 'bg-emerald-700 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Krajan
          </button>
          <button
            onClick={() => setFilterBlock('Gandok')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              filterBlock === 'Gandok'
                ? 'bg-emerald-700 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Gandok
          </button>
          <button
            onClick={() => setFilterBlock('Kaliurip')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              filterBlock === 'Kaliurip'
                ? 'bg-emerald-700 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Kaliurip
          </button>
        </div>
      </div>

      {/* Parcel Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredParcels.map((parcel) => (
          <div
            key={parcel.id}
            className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              {/* Header card */}
              <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-stone-100">
                <div>
                  <span className="text-[10px] font-extrabold text-stone-500 uppercase tracking-wider flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-700" />
                    {parcel.blokWilayah}
                  </span>
                  <h4 className="font-extrabold text-sm text-stone-900 mt-0.5">
                    {parcel.namaPetak}
                  </h4>
                  <p className="text-xs text-stone-500 font-medium">
                    Petani: <strong className="text-stone-700">{parcel.pemilik}</strong>
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteParcel(parcel.id)}
                  className="text-stone-400 hover:text-rose-600 p-1 rounded-lg transition"
                  title="Hapus petak"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Crop & Area metrics */}
              <div className="grid grid-cols-2 gap-2 mt-3 p-3 bg-stone-50 rounded-2xl text-xs">
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">Komoditas:</span>
                  <span className="font-extrabold text-stone-900 block">{parcel.komoditas}</span>
                  <span className="text-[10px] text-emerald-700 font-medium">Var: {parcel.varietas}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">Luas Lahan:</span>
                  <span className="font-extrabold text-stone-900 block">{parcel.luasUbin} Ubin</span>
                  <span className="text-[10px] text-stone-500 font-medium">{parcel.luasMeterPersegi} m²</span>
                </div>
              </div>

              {/* Progress and Growth Stage */}
              <div className="mt-3.5 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-700">Fase Tanaman:</span>
                  <span className="font-extrabold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-lg text-[11px]">
                    {parcel.faseSaatIni}
                  </span>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden border border-stone-200/50">
                  <div
                    className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${parcel.progresPersen}%` }}
                  />
                </div>
              </div>

              {/* Health & Moisture Status */}
              <div className="mt-3 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-stone-500 flex items-center gap-1">
                    <Droplets className="w-3 h-3 text-sky-600" />
                    Kadar Air Tanah:
                  </span>
                  <span className="font-bold text-stone-800">{parcel.kadarAirTanah}</span>
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-stone-500">Status Kesehatan:</span>
                  <span
                    className={`font-extrabold ${
                      parcel.statusKesehatan.includes('Waspada')
                        ? 'text-amber-700'
                        : parcel.statusKesehatan.includes('Tergenang')
                        ? 'text-rose-700'
                        : 'text-emerald-700'
                    }`}
                  >
                    {parcel.statusKesehatan}
                  </span>
                </div>

                {parcel.kebutuhanTindakan && (
                  <div className="p-2 rounded-xl bg-amber-50/80 border border-amber-200/70 text-[11px] text-amber-950 font-medium leading-relaxed mt-2">
                    ⚡ <strong>Tindakan:</strong> {parcel.kebutuhanTindakan}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-stone-400 block uppercase font-bold">Est. Panen:</span>
                <span className="font-black text-emerald-700">{parcel.estimasiHasilKw} Kw</span>
              </div>

              {/* Quick stage updater */}
              <select
                value={parcel.faseSaatIni}
                onChange={(e) => handleUpdateStatus(parcel.id, e.target.value as LandParcel['faseSaatIni'])}
                className="text-[11px] font-bold py-1.5 px-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-white cursor-pointer"
              >
                <option value="Pengolahan Tanah">Ubah: Pengolahan Tanah</option>
                <option value="Vegetatif Awal">Ubah: Vegetatif Awal</option>
                <option value="Pembungaan">Ubah: Pembungaan</option>
                <option value="Pembentukan Buah">Ubah: Pembentukan Buah</option>
                <option value="Masa Panen">Ubah: Masa Panen</option>
                <option value="Bera/Istirahat">Ubah: Bera/Istirahat</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
