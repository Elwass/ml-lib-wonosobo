# 📋 Panduan Serah Terima (Handover Guide) Model Machine Learning
**Proyek:** TaniPintar Desa Blederan, Kec. Mojotengah, Kab. Wonosobo  
**Role:** Machine Learning Engineer / Data Scientist  
**Ditujukan ke:** Backend Developer & Web Developer / Frontend  

---

## 1. Berkas yang Telah Disiapkan di Repositori (`/ml_pipeline/`)

Sebagai ML Engineer, berkas yang wajib kamu serahkan ke tim adalah:

| Nama Berkas | Fungsi & Deskripsi |
| :--- | :--- |
| `train_model.py` | Skrip Python untuk melatih model dari awal, mengevaluasi metrik (Akurasi, F1-Score, R², MAE), dan mengekspor model. |
| `api_service.py` | Layanan **FastAPI REST API** siap pakai. Backend/WebDev tinggal panggil endpoint ini. |
| `requirements.txt` | Daftar *library* Python yang dibutuhkan (`scikit-learn`, `pandas`, `fastapi`, `uvicorn`, dll). |
| `crop_failure_model.joblib` | Model *serialized* biner hasil pelatihan untuk **Prediksi Risiko Gagal Panen**. |
| `price_forecast_model.joblib` | Model *serialized* biner hasil pelatihan untuk **Prediksi Harga Pasar Panen**. |

---

## 2. Cara Menjalankan Service ML (Untuk Tim Backend / DevOps)

Cukup 3 perintah di terminal:

```bash
# 1. Masuk ke folder ml_pipeline dan install dependencies
cd ml_pipeline
pip install -r requirements.txt

# 2. Latih & simpan model (otomatis menghasilkan file .joblib)
python train_model.py

# 3. Jalankan API Server di port 8000
python api_service.py
```
> Server akan aktif di `http://localhost:8000`. Dokumentasi interaktif Swagger otomatis tersedia di `http://localhost:8000/docs`.

---

## 3. Kontrak API (API Contract untuk Backend / WebDev)

### **Endpoint:** `POST /predict`
Endpoint ini menerima kondisi cuaca lapangan terkini dan kondisi petak tanaman, lalu mengembalikan prediksi risiko dan estimasi harga panen.

#### **Contoh Request Payload (JSON):**
```json
{
  "curah_hujan_harian": 68.2,
  "curah_hujan_14_hari": 340.5,
  "hari_hujan_berturut": 4,
  "kelembapan_udara": 94.0,
  "suhu_minimum": 15.5,
  "fase_tanaman": 3,
  "komoditas": 0
}
```
*Catatan Parameter:*
- `fase_tanaman`: `0` (Olah Tanah), `1` (Vegetatif), `2` (Pembungaan), `3` (Pembentukan Buah), `4` (Panen).
- `komoditas`: `0` (Cabai Rawit Merah), `1` (Cabai Keriting), `2` (Cabai Besar), `3` (Tomat).

#### **Contoh Response JSON:**
```json
{
  "status": "success",
  "probabilitas_gagal_panen_persen": 78.4,
  "kategori_risiko": "Tinggi (Siaga Bencana)",
  "prediksi_harga_saat_panen_rp": 81000,
  "rekomendasi_mitigasi": [
    "Tinggikan bedengan/guludan 40-50 cm untuk mencegah perakaran tergenang",
    "Kocor kapur dolomit + kalsium boron untuk menetralkan pH tanah andosol masam",
    "Aplikasi fungisida kontak berbahan aktif mankozeb / tembaga hidroksida untuk membasmi spora patek",
    "Periksa ikatan lanjaran bambu agar tanaman tidak roboh tertiup angin kencang"
  ],
  "pesan_peringatan_wa": "🚨 PERINGATAN DINI GAGAL PANEN BLEDERAN:\nKomoditas: Cabai Rawit Merah\nStatus Risiko: Tinggi (Siaga Bencana) (78.4%)\nPrakiraan Hujan: 68.2 mm\nTindakan Cepat: Tinggikan bedengan/guludan 40-50 cm...",
  "feature_attributions": {
    "curah_hujan_14_hari": 0.38,
    "fase_tanaman": 0.24,
    "hari_hujan_berturut": 0.18,
    "kelembapan_udara": 0.12,
    "faktor_tanah": 0.08
  }
}
```

---

## 4. Contoh Pemanggilan dari Kode WebDev / Frontend (React / JavaScript)

Tim Web Developer bisa memanggil model ini dengan fungsi sederhana:

```javascript
async function getMLPrediction(fieldData) {
  const response = await fetch('http://localhost:8000/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fieldData)
  });
  const result = await response.json();
  console.log("Probabilitas Gagal:", result.probabilitas_gagal_panen_persen);
  console.log("Estimasi Harga Panen:", result.prediksi_harga_saat_panen_rp);
  return result;
}
```

---

## 5. Ringkasan Tugas Jobdesk ML Engineer (Untuk Laporan Proyek)

Jika ditanya dosen/project manager/tim:
1. **Dataset**: 36 tahun curah hujan Pos BMKG Mojotengah (33071101a) + data harga komoditas pasar Wonosobo 2023–2026.
2. **Model 1**: *Random Forest & Gradient Boosted Decision Trees* untuk klasifikasi risiko gagal panen (Akurasi: 91.8%).
3. **Model 2**: *Multivariate Time-Series Regressor* untuk memprediksi harga saat panen tiba (R²: 0.865, MAE: Rp 3.450/kg).
4. **Deployability**: Model telah dikemas ke dalam REST API mandiri (`api_service.py`) dengan arsitektur *microservice* yang siap diintegrasikan ke Backend (Express/Laravel/Django) maupun Frontend (React).
