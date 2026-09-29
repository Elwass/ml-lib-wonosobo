import React, { useState } from 'react';
import { DATA_HARGA_KOMODITAS, TREN_HARGA_BULANAN, DATA_BBM_OPERASIONAL, PASAR_DISTRIBUSI_WONOSOBO } from '../data/marketData';
import { HarvestOffer, getLocalOffers, saveLocalOffers } from '../utils/offlineStorage';
import { 
  Store, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Plus, 
  Fuel, 
  Truck, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  MapPin, 
  DollarSign, 
  Clock 
} from 'lucide-react';

interface Props {
  language: 'id' | 'jv';
}

export const MarketIntegration: React.FC<Props> = ({ language }) => {
  const [offers, setOffers] = useState<HarvestOffer[]>(() => getLocalOffers());
  const [isListingNew, setIsListingNew] = useState<boolean>(false);

  // Form state
  const [namaPetani, setNamaPetani] = useState('');
  const [noHpWa, setNoHpWa] = useState('');
  const [komoditas, setKomoditas] = useState('Cabai Rawit Merah');
  const [varietas, setVarietas] = useState('Ori 212');
  const [beratKw, setBeratKw] = useState(5);
  const [hargaHarapan, setHargaHarapan] = useState(65000);
  const [lokasiBlok, setLokasiBlok] = useState('Blok Krajan 1, Blederan');
  const [tglPetik, setTglPetik] = useState(new Date().toISOString().split('T')[0]);
  const [keterangan, setKeterangan] = useState('Kondisi buah segar, petikan pagi, mulus bebas patek.');

  const handleAddOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaPetani || !noHpWa) return;

    const newOffer: HarvestOffer = {
      id: `tawar-${Date.now()}`,
      namaPetani,
      noHpWa,
      komoditas,
      varietas,
      estimasiBeratKw: beratKw,
      hargaHarapanKg: hargaHarapan,
      lokasiBlok,
      tanggalSiapPetik: tglPetik,
      keterangan,
      status: 'Tersedia',
      dibuatPada: new Date().toISOString().split('T')[0],
    };

    const updated = [newOffer, ...offers];
    setOffers(updated);
    saveLocalOffers(updated);
    setIsListingNew(false);

    // Reset
    setNamaPetani('');
    setNoHpWa('');
  };

  const handleGenerateWaBuyerLink = (offer: HarvestOffer) => {
    const text = encodeURIComponent(
      `Halo Pak/Mas ${offer.namaPetani},\n` +
      `Saya tertarik membeli hasil panen *${offer.komoditas} (${offer.varietas})* sejumlah *${offer.estimasiBeratKw} Kwintal* di *${offer.lokasiBlok}* yang tertera di TaniPintar Desa Blederan.\n` +
      `Harga penawaran: Rp ${offer.hargaHarapanKg.toLocaleString('id-ID')}/kg. Apakah bisa cek barang ke lokasi petak? Terima kasih.`
    );
    return `https://wa.me/${offer.noHpWa.replace(/^0/, '62')}?text=${text}`;
  };

  return (
    <div className="space-y-6">
      {/* Header & Market Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
            <Store className="w-6 h-6 text-emerald-700" />
            <span>
              {language === 'jv' ? 'Integrasi Pasar & Dodolan Panen Blederan' : 'Integrasi Data Pasar & Distribusi Hasil Panen'}
            </span>
          </h2>
          <p className="text-xs text-stone-500">
            Pantau pergerakan harga cabai Wonosobo secara transparan dan tawarkan panenan langsung ke pasar tanpa potongan perantara.
          </p>
        </div>

        <button
          onClick={() => setIsListingNew(!isListingNew)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-md transition active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'jv' ? 'Tawarake Panenan Anyar' : 'Tawarkan Hasil Panen'}</span>
        </button>
      </div>

      {/* Real-time Commodity Prices Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {DATA_HARGA_KOMODITAS.map((item) => {
          const isUp = item.tren === 'naik';
          const isDown = item.tren === 'turun';

          return (
            <div
              key={item.komoditas}
              className="p-3.5 rounded-3xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between space-y-2 hover:border-emerald-300 transition"
            >
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block line-clamp-1">
                  {item.komoditas}
                </span>
                <div className="text-base sm:text-lg font-black text-stone-900 mt-1">
                  Rp {item.hargaSekarang.toLocaleString('id-ID')}
                  <span className="text-[10px] font-normal text-stone-500">/{item.satuan}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-stone-100">
                <span className="text-stone-400 text-[10px]">Bulan lalu:</span>
                <div className={`flex items-center gap-0.5 font-bold ${isUp ? 'text-emerald-600' : isDown ? 'text-rose-600' : 'text-stone-600'}`}>
                  {isUp && <TrendingUp className="w-3 h-3" />}
                  {isDown && <TrendingDown className="w-3 h-3" />}
                  {!isUp && !isDown && <Minus className="w-3 h-3" />}
                  <span>{item.persentasePerubahan > 0 ? `+${item.persentasePerubahan}%` : `${item.persentasePerubahan}%`}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Operasional Logistik BBM & Transportasi */}
      <div className="p-4 rounded-3xl bg-stone-100 border border-stone-200 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-white border border-stone-300 text-emerald-800 shadow-xs">
            <Fuel className="w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold text-stone-900 block">Biaya Logistik Bahan Bakar (Wonosobo):</span>
            <span className="text-stone-600 text-[11px]">
              Biosolar Subsidi: <strong>Rp {DATA_BBM_OPERASIONAL.biosolarSubsidi.toLocaleString('id-ID')}/L</strong> · Pertalite: <strong>Rp {DATA_BBM_OPERASIONAL.pertalite.toLocaleString('id-ID')}/L</strong>
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[11px] text-stone-600">
          <span className="bg-white px-2.5 py-1 rounded-xl border border-stone-200">
            🚚 Pikep ke Ps. Induk Wonosobo: <strong>Rp {DATA_BBM_OPERASIONAL.ongkosPikepKePasarIndukWonosobo.toLocaleString('id-ID')} / rit</strong>
          </span>
          <span className="bg-white px-2.5 py-1 rounded-xl border border-stone-200">
            🚛 Pikep ke Ps. Kertek: <strong>Rp {DATA_BBM_OPERASIONAL.ongkosPikepKePasarKertek.toLocaleString('id-ID')} / rit</strong>
          </span>
        </div>
      </div>

      {/* Form Tawarkan Hasil Panen (Bursa Panen Desa) */}
      {isListingNew && (
        <form
          onSubmit={handleAddOffer}
          className="p-5 sm:p-6 rounded-3xl bg-amber-50/70 border border-amber-300 shadow-md space-y-4 animate-fade-in"
        >
          <div className="flex items-center justify-between pb-3 border-b border-amber-200">
            <h3 className="font-extrabold text-sm text-amber-950 flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-700" />
              Tawarkan Hasil Panen ke Pengepul & Pasar (Bursa Desa Blederan)
            </h3>
            <button
              type="button"
              onClick={() => setIsListingNew(false)}
              className="text-xs font-bold text-stone-500 hover:text-stone-800 cursor-pointer"
            >
              Batal
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Nama Petani Penjual:</label>
              <input
                type="text"
                required
                placeholder="Contoh: Pak Slamet"
                value={namaPetani}
                onChange={(e) => setNamaPetani(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white focus:outline-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Nomor WhatsApp Aktif:</label>
              <input
                type="tel"
                required
                placeholder="Contoh: 081227891234"
                value={noHpWa}
                onChange={(e) => setNoHpWa(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white focus:outline-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Komoditas:</label>
              <select
                value={komoditas}
                onChange={(e) => setKomoditas(e.target.value)}
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
              <label className="block text-xs font-bold text-stone-700 mb-1">Estimasi Tonase (Kwintal):</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                value={beratKw}
                onChange={(e) => setBeratKw(Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white focus:outline-emerald-600"
              />
              <span className="text-[10px] text-stone-500 mt-0.5 block">
                = {beratKw * 100} Kg
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Harga Harapan (Rp/kg):</label>
              <input
                type="number"
                step="500"
                value={hargaHarapan}
                onChange={(e) => setHargaHarapan(Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white focus:outline-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Lokasi Petak di Blederan:</label>
              <input
                type="text"
                value={lokasiBlok}
                onChange={(e) => setLokasiBlok(e.target.value)}
                placeholder="Contoh: Blok Krajan 1, Blederan"
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white focus:outline-emerald-600"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-xs font-bold text-stone-700 mb-1">Catatan Kualitas Panen:</label>
              <input
                type="text"
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                placeholder="Contoh: Buah mulus, petik pagi, bebas bercak"
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white focus:outline-emerald-600"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsListingNew(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-200 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-600 text-stone-950 font-extrabold text-xs hover:bg-amber-500 transition cursor-pointer"
            >
              Tayangkan Tawaran Panen
            </button>
          </div>
        </form>
      )}

      {/* Daftar Tawaran Panen Aktif Warga Desa Blederan */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-stone-900">
              Bursa Distribusi Panen Langsung (Petani Desa Blederan):
            </h3>
            <p className="text-xs text-stone-500">
              Pengepul dan pedagang dapat langsung menghubungi petani pemilik barang melalui WhatsApp.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
            {offers.length} Siap Kirim
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="p-4 rounded-3xl border border-stone-200 bg-stone-50/60 hover:bg-stone-50 hover:border-emerald-300 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-lg">
                    {offer.komoditas}
                  </span>
                  <span className="text-[11px] text-stone-400 font-mono">
                    Tgl: {offer.dibuatPada}
                  </span>
                </div>

                <div className="mt-2.5 flex items-baseline justify-between">
                  <div>
                    <h4 className="font-extrabold text-sm text-stone-900">
                      {offer.estimasiBeratKw} Kwintal ({offer.estimasiBeratKw * 100} Kg)
                    </h4>
                    <span className="text-xs text-stone-500 font-medium">
                      Petani: <strong>{offer.namaPetani}</strong> · Var: {offer.varietas}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 uppercase font-bold block">Harga Buka:</span>
                    <span className="text-base font-black text-stone-900">
                      Rp {offer.hargaHarapanKg.toLocaleString('id-ID')}
                      <span className="text-[10px] font-normal text-stone-500">/kg</span>
                    </span>
                  </div>
                </div>

                <div className="mt-2 text-xs text-stone-600 bg-white p-2.5 rounded-xl border border-stone-200/80 leading-relaxed">
                  <div className="flex items-center gap-1.5 font-bold text-stone-800 mb-0.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{offer.lokasiBlok}</span>
                  </div>
                  <p className="text-[11px] text-stone-600 line-clamp-2">
                    {offer.keterangan}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between gap-2">
                <span className="text-[11px] text-stone-500">
                  Siap Petik: <strong>{offer.tanggalSiapPetik}</strong>
                </span>

                <a
                  href={handleGenerateWaBuyerLink(offer)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-xs transition active:scale-95 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Hubungi Petani (WA)</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Directory Pasar & Pengepul Utama Wonosobo */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
        <h3 className="font-extrabold text-sm sm:text-base text-stone-900 flex items-center gap-2">
          <Truck className="w-4 h-4 text-emerald-700" />
          <span>Jaringan Pasar & Pengepul Rujukan Petani Desa Blederan:</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {PASAR_DISTRIBUSI_WONOSOBO.map((pasar) => (
            <div
              key={pasar.id}
              className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                  {pasar.jarakKm} km dari Desa Blederan
                </span>
                <h4 className="font-extrabold text-sm text-stone-900 mt-0.5">
                  {pasar.nama}
                </h4>
                <p className="text-xs text-stone-600 mt-1 font-medium">
                  {pasar.namaPengepul}
                </p>
                <div className="mt-2 text-[11px] text-stone-500 space-y-0.5">
                  <div>Kapasitas: {pasar.kapasitasTampung}</div>
                  <div>Jam: {pasar.jamBuka}</div>
                </div>
              </div>

              <a
                href={`https://wa.me/${pasar.kontakPengepul.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Halo ${pasar.namaPengepul}, saya petani dari Desa Blederan, Mojotengah. Mau info harga tampung cabai hari ini dan jadwal kirim. Terima kasih.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-white border border-stone-300 hover:bg-stone-100 text-stone-800 font-bold text-xs shadow-2xs transition"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                <span>Chat WhatsApp</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
