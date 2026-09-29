import React, { useState } from 'react';
import { PROFIL_DESA_BLEDERAN } from '../data/agricultureData';
import { DATA_CUACA_TERKINI_BLEDERAN } from '../data/bmkgData';
import { getLocalParcels } from '../utils/offlineStorage';
import { 
  FileText, 
  Printer, 
  Copy, 
  Check, 
  Download, 
  Building2, 
  Calendar, 
  ShieldAlert, 
  Send,
  Sparkles
} from 'lucide-react';

interface Props {
  language: 'id' | 'jv';
}

export const WeeklyPPLReport: React.FC<Props> = ({ language }) => {
  const parcels = getLocalParcels();
  const [copied, setCopied] = useState<boolean>(false);
  const [namaPPL, setNamaPPL] = useState<string>('Ir. Bambang Trihatmojo');
  const [nipPPL, setNipPPL] = useState<string>('19840512 201001 1 014');
  const [mingguKe, setMingguKe] = useState<string>('Minggu IV - September 2026');

  // Aggregates for report
  const totalLuasM2 = parcels.reduce((sum, p) => sum + p.luasMeterPersegi, 0);
  const totalLuasHa = (totalLuasM2 / 10000).toFixed(2);
  const totalLuasUbin = parcels.reduce((sum, p) => sum + p.luasUbin, 0);
  const totalPanenKw = parcels.reduce((sum, p) => sum + p.estimasiHasilKw, 0);
  const totalPetakWaspada = parcels.filter((p) => p.statusKesehatan.includes('Waspada') || p.statusKesehatan.includes('Tergenang')).length;

  // Curah hujan 7 hari terakhir (total mm)
  const hujan7Hari = DATA_CUACA_TERKINI_BLEDERAN.slice(0, 7);
  const totalCh7Hari = hujan7Hari.reduce((sum, d) => sum + d.curah_hujan_mm, 0).toFixed(1);
  const hariHujan7Hari = hujan7Hari.filter((d) => d.curah_hujan_mm > 0).length;

  const handlePrint = () => {
    window.print();
  };

  const getReportRawText = () => {
    return (
      `LAPORAN RESMI MINGGUAN PENYULUH PERTANIAN LAPANGAN (PPL)\n` +
      `BPP KECAMATAN MOJOTENGAH - DINAS PERTANIAN KABUPATEN WONOSOBO\n` +
      `------------------------------------------------------------\n` +
      `Periode: ${mingguKe}\n` +
      `Wilayah Binaan: Desa Blederan, Kec. Mojotengah (Elevasi: ${PROFIL_DESA_BLEDERAN.elevasiMdpl})\n` +
      `Petugas PPL: ${namaPPL} (NIP: ${nipPPL})\n\n` +
      `I. KONDISI AGROKLIMAT & BMKG:\n` +
      `- Pos Hujan Rujukan: BMKG Mojotengah (33071101a)\n` +
      `- Total Curah Hujan 7 Hari: ${totalCh7Hari} mm (${hariHujan7Hari} hari hujan)\n` +
      `- Status Iklim: Transisi Awal Musim Penghujan (Labuhan)\n` +
      `- Peringatan Dini: Waspada curah hujan lebat di atas 50 mm berpotensi memicu spora Colletotrichum (Patek).\n\n` +
      `II. REKAPITULASI LAHAN & PRODUKTIVITAS DESA BLEDERAN:\n` +
      `- Total Luas Terdata Aktif: ${totalLuasHa} Ha (${totalLuasUbin} Ubin / ${parcels.length} Petak)\n` +
      `- Estimasi Potensi Panen: ${totalPanenKw.toFixed(1)} Kwintal\n` +
      `- Petak dalam Fase Panen: ${parcels.filter(p => p.faseSaatIni === 'Masa Panen').length} petak\n` +
      `- Petak Status Waspada Penyakit: ${totalPetakWaspada} petak\n\n` +
      `III. REKOMENDASI TEKNIS PPL BAGI POKTAN DESA BLEDERAN:\n` +
      `1. Pembuatan parit pembuangan air (drainase) sedalam 30-40 cm untuk mencegah kebusukan akar.\n` +
      `2. Pengendalian preventif antraknosa menggunakan fungisida mankozeb dan kalsium boron.\n` +
      `3. Pemanfaatan bursa pasar langsung untuk memotong rantai tengkulak.\n\n` +
      `Demikian laporan mingguan ini dibuat untuk koordinasi dinas terkait.`
    );
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(getReportRawText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-700" />
            <span>
              {language === 'jv' ? 'Lapuran Minggon Resmi PPL Mojotengah' : 'Sistem Laporan Mingguan Otomatis PPL'}
            </span>
          </h2>
          <p className="text-xs text-stone-500">
            Dihasilkan otomatis dari data input petak desa & monitoring curah hujan BMKG untuk Dinas Pertanian Wonosobo.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleCopyText}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 font-bold text-xs transition cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Teks Tersalin!' : 'Salin Laporan'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Ekspor PDF</span>
          </button>
        </div>
      </div>

      {/* Report Parameter Settings Bar */}
      <div className="p-4 bg-white rounded-3xl border border-stone-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="block font-bold text-stone-600 mb-1">Periode Laporan:</label>
          <input
            type="text"
            value={mingguKe}
            onChange={(e) => setMingguKe(e.target.value)}
            className="w-full p-2 rounded-xl border border-stone-300 bg-stone-50 font-semibold"
          />
        </div>
        <div>
          <label className="block font-bold text-stone-600 mb-1">Nama Petugas Penyuluh (PPL):</label>
          <input
            type="text"
            value={namaPPL}
            onChange={(e) => setNamaPPL(e.target.value)}
            className="w-full p-2 rounded-xl border border-stone-300 bg-stone-50 font-semibold"
          />
        </div>
        <div>
          <label className="block font-bold text-stone-600 mb-1">NIP Petugas:</label>
          <input
            type="text"
            value={nipPPL}
            onChange={(e) => setNipPPL(e.target.value)}
            className="w-full p-2 rounded-xl border border-stone-300 bg-stone-50 font-semibold"
          />
        </div>
      </div>

      {/* Official Printable Report Document Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-300 shadow-md space-y-6 print:border-none print:shadow-none print:p-0">
        {/* Document Header (Kop Surat Dinas) */}
        <div className="text-center pb-5 border-b-2 border-stone-800 space-y-1">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Building2 className="w-6 h-6 text-emerald-800" />
            <span className="text-xs font-bold tracking-widest text-stone-500 uppercase">
              Pemerintah Kabupaten Wonosobo
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-black tracking-wide text-stone-900 uppercase">
            Balai Penyuluhan Pertanian (BPP) Kecamatan Mojotengah
          </h3>
          <p className="text-xs text-stone-600">
            Wilayah Binaan Khusus: Desa Blederan · Kontak Posko: Jl. Dieng Km. 4, Mojotengah
          </p>
          <div className="pt-2">
            <span className="text-xs font-extrabold text-stone-900 bg-stone-100 px-3 py-1 rounded-full border border-stone-300">
              LAPORAN PERIODIK MINGGUAN KONDISI PERTANIAN & MITIGASI BENCANA
            </span>
          </div>
        </div>

        {/* Info Meta */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-stone-50 p-4 rounded-2xl border border-stone-200">
          <div>
            <span className="text-stone-400 block font-semibold">Periode:</span>
            <span className="font-bold text-stone-900">{mingguKe}</span>
          </div>
          <div>
            <span className="text-stone-400 block font-semibold">Desa Sasaran:</span>
            <span className="font-bold text-stone-900">Blederan, Mojotengah</span>
          </div>
          <div>
            <span className="text-stone-400 block font-semibold">Penyuluh Lapangan:</span>
            <span className="font-bold text-stone-900">{namaPPL}</span>
          </div>
          <div>
            <span className="text-stone-400 block font-semibold">Pos Hujan Rujukan:</span>
            <span className="font-bold text-stone-900">BMKG 33071101a</span>
          </div>
        </div>

        {/* Section 1: Agroklimat & Cuaca */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-emerald-900 border-l-4 border-emerald-700 pl-2">
            I. Evaluasi Agroklimat & Prakiraan Cuaca Ekstrem (BMKG Mojotengah)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200">
              <span className="text-sky-700 font-bold block">Curah Hujan 7 Hari:</span>
              <span className="text-xl font-black text-sky-950 mt-1 block">{totalCh7Hari} mm</span>
              <span className="text-[11px] text-sky-700">Frekuensi: {hariHujan7Hari} hari hujan</span>
            </div>
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
              <span className="text-amber-700 font-bold block">Status Kelembapan:</span>
              <span className="text-xl font-black text-amber-950 mt-1 block">88 - 98%</span>
              <span className="text-[11px] text-amber-700">Tinggi (Kabut Dingin Khas Sindoro)</span>
            </div>
            <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200">
              <span className="text-rose-700 font-bold block">Ancaman Cuaca 7 Hari Depan:</span>
              <span className="text-base font-black text-rose-950 mt-1 block">Hujan Lebat &gt; 68 mm</span>
              <span className="text-[11px] text-rose-700">Waspada tanggal 2-3 Oktober 2026</span>
            </div>
          </div>
        </div>

        {/* Section 2: Real-time Land Productivity */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-emerald-900 border-l-4 border-emerald-700 pl-2">
            II. Rekapitulasi Produktivitas Lahan Petani Desa Blederan
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-100 text-stone-700 border-y border-stone-200">
                  <th className="py-2.5 px-3 font-bold">Blok Wilayah</th>
                  <th className="py-2.5 px-3 font-bold">Nama Petak / Petani</th>
                  <th className="py-2.5 px-3 font-bold">Komoditas & Varietas</th>
                  <th className="py-2.5 px-3 font-bold">Luas (Ubin)</th>
                  <th className="py-2.5 px-3 font-bold">Fase Tanaman</th>
                  <th className="py-2.5 px-3 font-bold">Est. Panen (Kw)</th>
                  <th className="py-2.5 px-3 font-bold">Kondisi Lahan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-800">
                {parcels.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50">
                    <td className="py-2 px-3 font-semibold">{p.blokWilayah}</td>
                    <td className="py-2 px-3 font-medium">
                      {p.namaPetak} <span className="text-stone-400 block text-[10px]">({p.pemilik})</span>
                    </td>
                    <td className="py-2 px-3">{p.komoditas} ({p.varietas})</td>
                    <td className="py-2 px-3 font-bold">{p.luasUbin} Ubin</td>
                    <td className="py-2 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-stone-100 font-semibold text-[10px]">
                        {p.faseSaatIni}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-bold text-emerald-700">{p.estimasiHasilKw} Kw</td>
                    <td className="py-2 px-3">
                      <span className={`text-[11px] font-bold ${
                        p.statusKesehatan.includes('Waspada') ? 'text-amber-600' : 'text-emerald-700'
                      }`}>
                        {p.statusKesehatan}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Technical Recommendations */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-black uppercase tracking-wider text-emerald-900 border-l-4 border-emerald-700 pl-2">
            III. Instruksi & Rekomendasi Teknis PPL untuk Poktan Blederan
          </h4>
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-800 space-y-2 leading-relaxed">
            <p>
              1. <strong>Manajemen Saluran Parit (Drainase):</strong> Mengingat data BMKG Mojotengah menunjukkan kenaikan intensitas hujan, seluruh pengurus Poktan Sido Makmur dan Ngudi Makmur wajib menginstruksikan petani membuat parit cacing sedalam minimal 30 cm agar akar cabai tidak membusuk.
            </p>
            <p>
              2. <strong>Kapurisasi Tanah (Dolomit):</strong> Tanah andosol di lereng Blederan rentan asam akibat pencucian hara oleh air hujan lebat. Taburkan kapur dolomit 15-20 gram per lubang tanam untuk menetralkan pH tanah.
            </p>
            <p>
              3. <strong>Pencegahan Antraknosa (Patek):</strong> Segera semprotkan fungisida kontak setelah hujan lebat selesai di pagi hari, diselingi kalsium boron agar kulit cabai tebal dan tidak mudah ditembus spora jamur.
            </p>
            <p>
              4. <strong>Akses Pasar Langsung:</strong> Bagi petak yang memasuki masa petik ke-3 dan ke-4, hasil panen disalurkan melalui BUMDes Blederan atau langsung ke Pasar Induk Wonosobo guna mempertahankan harga jual di atas Rp 55.000/kg.
            </p>
          </div>
        </div>

        {/* Signatures */}
        <div className="pt-8 border-t border-stone-200 flex items-center justify-between text-xs text-stone-800">
          <div className="text-center space-y-12">
            <span>Mengetahui,<br />Kepala Desa Blederan</span>
            <div className="font-bold underline">H. Muhammad Sukirno</div>
          </div>

          <div className="text-center space-y-12">
            <span>Wonosobo, {new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}<br />Penyuluh Pertanian Lapangan (PPL)</span>
            <div className="font-bold underline">
              {namaPPL}<br />
              <span className="text-[10px] text-stone-500 font-normal no-underline">NIP: {nipPPL}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
