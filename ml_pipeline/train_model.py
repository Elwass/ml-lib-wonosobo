"""
Skrip Pelatihan Model Machine Learning TaniPintar Desa Blederan, Mojotengah, Wonosobo
Model 1: Prediksi Risiko Gagal Panen (Random Forest Classifier)
Model 2: Prediksi Harga Komoditas Panen (Random Forest Regressor)
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score, r2_score, mean_absolute_error
import joblib
import os

def generate_synthetic_historical_dataset():
    """
    Simulasi dataset pelatihan yang merefleksikan 36 tahun data BMKG Pos Mojotengah
    dan data fluktuasi harga cabai Wonosobo 2022-2026.
    """
    np.random.seed(42)
    n_samples = 3500

    # Fitur-fitur input
    curah_hujan_harian = np.random.exponential(scale=18.5, size=n_samples) # mm
    curah_hujan_14_hari = curah_hujan_harian * 10 + np.random.normal(0, 30, size=n_samples)
    curah_hujan_14_hari = np.clip(curah_hujan_14_hari, 0, 750)
    
    hari_hujan_berturut = np.random.randint(0, 11, size=n_samples)
    kelembapan_udara = np.random.uniform(70, 99, size=n_samples) # %
    suhu_minimum = np.random.uniform(13.5, 18.5, size=n_samples) # C
    
    # 0: Pengolahan, 1: Vegetatif, 2: Pembungaan, 3: Pembentukan Buah, 4: Panen
    fase_tanaman = np.random.randint(0, 5, size=n_samples)
    
    # 0: Rawit Merah, 1: Keriting, 2: Besar, 3: Tomat
    komoditas = np.random.randint(0, 4, size=n_samples)
    
    # Target 1: Risiko Gagal Panen (0: Rendah, 1: Sedang, 2: Tinggi, 3: Kritis)
    # Logika domain pertanian lereng Mojotengah: Hujan tinggi + fase buah + hari hujan berturut -> patek tinggi
    risk_score = (
        (curah_hujan_14_hari / 500.0) * 40 +
        (hari_hujan_berturut / 10.0) * 25 +
        ((kelembapan_udara - 70) / 30.0) * 15 +
        (np.isin(fase_tanaman, [2, 3]).astype(int)) * 20
    )
    
    risk_class = np.zeros(n_samples, dtype=int)
    risk_class[risk_score > 35] = 1 # Sedang
    risk_class[risk_score > 60] = 2 # Tinggi
    risk_class[risk_score > 78] = 3 # Kritis

    # Target 2: Harga Komoditas saat Panen (Rp/kg)
    base_price = np.where(komoditas == 0, 55000, np.where(komoditas == 1, 45000, np.where(komoditas == 2, 38000, 12000)))
    # Anomali hujan tinggi memotong suplai dan menaikkan harga hingga 60%
    price_target = base_price * (1 + (curah_hujan_14_hari / 600.0) * 0.5) + np.random.normal(0, 2500, size=n_samples)
    price_target = np.clip(price_target, 8000, 115000)

    df = pd.DataFrame({
        'curah_hujan_harian': curah_hujan_harian,
        'curah_hujan_14_hari': curah_hujan_14_hari,
        'hari_hujan_berturut': hari_hujan_berturut,
        'kelembapan_udara': kelembapan_udara,
        'suhu_minimum': suhu_minimum,
        'fase_tanaman': fase_tanaman,
        'komoditas': komoditas,
        'target_risiko_gagal': risk_class,
        'target_harga_panen': price_target
    })
    return df

def train_and_export_models():
    print("🚀 [1/3] Menyiapkan dataset fitur agroklimat Wonosobo...")
    df = generate_synthetic_historical_dataset()

    feature_cols = [
        'curah_hujan_harian', 'curah_hujan_14_hari', 'hari_hujan_berturut',
        'kelembapan_udara', 'suhu_minimum', 'fase_tanaman', 'komoditas'
    ]
    X = df[feature_cols]
    y_risk = df['target_risiko_gagal']
    y_price = df['target_harga_panen']

    # Split train/test
    X_train, X_test, y_risk_train, y_risk_test, y_price_train, y_price_test = train_test_split(
        X, y_risk, y_price, test_size=0.2, random_state=42
    )

    print("🤖 [2/3] Melatih Model 1 (Classifier Risiko Gagal Panen)...")
    clf_risk = RandomForestClassifier(n_estimators=100, max_depth=8, random_state=42)
    clf_risk.fit(X_train, y_risk_train)
    y_pred_risk = clf_risk.predict(X_test)
    acc = accuracy_score(y_risk_test, y_pred_risk)
    print(f"   ✅ Akurasi Model Risiko: {acc * 100:.2f}%")

    print("📈 [2/3] Melatih Model 2 (Regressor Prediksi Harga Panen)...")
    reg_price = RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42)
    reg_price.fit(X_train, y_price_train)
    y_pred_price = reg_price.predict(X_test)
    r2 = r2_score(y_price_test, y_pred_price)
    mae = mean_absolute_error(y_price_test, y_pred_price)
    print(f"   ✅ R² Model Harga: {r2:.3f} | MAE: Rp {mae:,.0f}/kg")

    # Export serialized artifacts
    output_dir = os.path.dirname(os.path.abspath(__file__))
    risk_model_path = os.path.join(output_dir, 'crop_failure_model.joblib')
    price_model_path = os.path.join(output_dir, 'price_forecast_model.joblib')

    joblib.dump(clf_risk, risk_model_path)
    joblib.dump(reg_price, price_model_path)

    print(f"📦 [3/3] Model berhasil diekspor:")
    print(f"   - {risk_model_path}")
    print(f"   - {price_model_path}")
    print("Siap diserahterimakan ke tim Backend!")

if __name__ == '__main__':
    train_and_export_models()
