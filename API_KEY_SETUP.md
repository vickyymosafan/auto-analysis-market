# 🔑 Panduan Setup Google Gemini API Key

## ❌ Error yang Sering Terjadi
```
API key not valid. Please pass a valid API key.
```

## 📋 Cara Mendapatkan API Key yang Valid

### 1. Kunjungi Google AI Studio
- Buka: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
- Login dengan akun Google Anda

### 2. Buat API Key Baru
- Klik tombol **"Create API Key"**
- Pilih project Google Cloud (atau buat baru)
- Copy API key yang dihasilkan

### 3. Setup di Aplikasi
- Buka file `.env` di root project
- Ganti `your_valid_gemini_api_key_here` dengan API key Anda:
```env
GEMINI_API_KEY=AIzaSyC_your_actual_api_key_here
```

### 4. Restart Aplikasi
```bash
# Stop server (Ctrl+C)
# Kemudian jalankan lagi:
npm run dev
```

## ⚠️ Persyaratan Penting

### 1. Aktifkan Billing di Google Cloud
- Kunjungi: [Google Cloud Console](https://console.cloud.google.com/)
- Pilih project Anda
- Aktifkan billing account
- **Gemini API memerlukan billing meskipun ada free tier**

### 2. Enable Gemini API
- Di Google Cloud Console, buka **APIs & Services**
- Cari "Generative Language API" atau "Gemini API"
- Klik **Enable**

### 3. Set Quota Limits (Opsional)
- Untuk mencegah biaya berlebih
- Set daily/monthly limits di Google Cloud Console

## 🆓 Free Tier Gemini API

- **15 requests per minute**
- **1,500 requests per day**
- **1 million tokens per month**

## 🔧 Troubleshooting

### API Key Tidak Valid
1. Pastikan API key di-copy dengan benar (tanpa spasi)
2. Cek apakah billing sudah diaktifkan
3. Pastikan Gemini API sudah di-enable
4. Restart aplikasi setelah mengubah .env

### Quota Exceeded
1. Cek usage di [Google AI Studio](https://aistudio.google.com/)
2. Tunggu reset quota (harian/bulanan)
3. Upgrade ke paid plan jika diperlukan

### Billing Issues
1. Pastikan billing account valid
2. Cek apakah ada payment method yang aktif
3. Verifikasi project billing di Google Cloud Console

## 📞 Support
Jika masih ada masalah, cek:
- [Google AI Studio Documentation](https://ai.google.dev/docs)
- [Google Cloud Support](https://cloud.google.com/support)
