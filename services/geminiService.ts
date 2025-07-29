import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, PreliminarySummary } from '../types';

if (!process.env.API_KEY) {
    throw new Error("❌ API Key tidak ditemukan! Pastikan GEMINI_API_KEY sudah diatur di file .env");
}

// Debug: Log API key untuk troubleshooting
console.log('API Key loaded:', process.env.API_KEY ? `${process.env.API_KEY.substring(0, 10)}...` : 'undefined');

// Validasi format API key
if (!process.env.API_KEY || !process.env.API_KEY.startsWith('AIza')) {
    throw new Error("❌ Format API Key tidak valid! API Key Google harus dimulai dengan 'AIza'");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Fungsi untuk test API key
export const testApiKey = async (): Promise<boolean> => {
    try {
        await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [{ text: 'Test' }] }
        });
        return true;
    } catch (error: any) {
        console.error("API Key test failed:", error);
        return false;
    }
};

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        resolve((reader.result as string).split(',')[1]);
      } else {
        resolve("");
      }
    };
    reader.readAsDataURL(file);
  });

  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

const summarySchema = {
    type: Type.OBJECT,
    properties: {
        summary: {
            type: Type.STRING,
            description: "Jelaskan gambar grafik dalam satu atau dua kalimat. Identifikasi aset, kerangka waktu yang mungkin, dan tren atau pola umum yang terlihat.",
        },
        currentPrice: {
            type: Type.STRING,
            description: "Identifikasi harga pasar saat ini atau harga penutupan kandil terakhir yang terlihat pada grafik. Format sebagai string (misalnya, '$45,123.45' atau '1.0850'). Jika tidak terlihat, kembalikan 'N/A'."
        }
    },
    required: ["summary", "currentPrice"],
};

const analysisSchema = {
    type: Type.OBJECT,
    properties: {
        signal: {
            type: Type.STRING,
            description: "Sinyal perdagangan: BUY, SELL, atau NEUTRAL.",
            enum: ["BUY", "SELL", "NEUTRAL"],
        },
        confidence: {
            type: Type.INTEGER,
            description: "Skor keyakinan untuk sinyal dari 0 hingga 100.",
        },
        summary: {
            type: Type.STRING,
            description: "Satu kalimat yang merangkum dasar pemikiran untuk sinyal tersebut.",
        },
        strategy: {
            type: Type.STRING,
            description: "Strategi perdagangan yang dapat ditindaklanjuti berdasarkan analisis. Contoh: 'Masuk posisi beli pada penembusan di atas resistensi X dengan konfirmasi volume.' atau 'Tunggu penarikan kembali ke support Y sebelum mempertimbangkan posisi beli.'",
        },
        reasoning: {
            type: Type.OBJECT,
            description: "Analisis rinci berdasarkan indikator teknis.",
            properties: {
                smartMoneyConcept: {
                    type: Type.STRING,
                    description: "Analisis Konsep Smart Money (SMC), termasuk akumulasi, distribusi, atau manipulasi.",
                },
                supportAndResistance: {
                    type: Type.STRING,
                    description: "Analisis level support dan resistance utama yang terlihat pada grafik.",
                },
                trendAnalysis: {
                    type: Type.STRING,
                    description: "Analisis tren pasar menggunakan Higher Highs/Higher Lows atau Lower Highs/Lower Lows.",
                },
                orderBlock: {
                    type: Type.STRING,
                    description: "Identifikasi dan analisis order block bullish atau bearish yang signifikan yang mengindikasikan potensi pembalikan arah.",
                },
                ema: {
                    type: Type.STRING,
                    description: "Analisis Exponential Moving Averages (EMA) jika terlihat. Sebutkan EMA spesifik (misalnya, EMA 20, 50, 200) dan persilangannya.",
                },
                marketCondition: {
                    type: Type.STRING,
                    description: "Analisis kondisi pasar secara keseluruhan, seperti trending, sideways (terbatas dalam rentang), atau bergejolak.",
                },
                rsi: {
                    type: Type.STRING,
                    description: "Analisis Relative Strength Index (RSI), termasuk kondisi overbought (>70), oversold (<30), dan divergensi bullish/bearish.",
                },
                fibonacciRetracement: {
                    type: Type.STRING,
                    description: "Analisis level Fibonacci Retracement jika polanya dapat diidentifikasi. Sebutkan level kunci (misalnya, 0.382, 0.5, 0.618) yang bertindak sebagai support atau resistance.",
                },
                volumeAnalysis: {
                    type: Type.STRING,
                    description: "Analisis volume perdagangan. Cari lonjakan volume pada penembusan, atau volume rendah pada koreksi untuk mengkonfirmasi kekuatan tren.",
                },
            },
            required: ["smartMoneyConcept", "supportAndResistance", "trendAnalysis", "orderBlock", "ema", "marketCondition", "rsi", "fibonacciRetracement", "volumeAnalysis"]
        },
        takeProfit: {
            type: Type.OBJECT,
            description: "Level Take Profit (TP) yang direkomendasikan.",
            properties: {
                tp1: { type: Type.STRING, description: "Level Take Profit 1, biasanya di level resistance/support terdekat berikutnya." },
                tp2: { type: Type.STRING, description: "Level Take Profit 2, target keuntungan sekunder." },
                tp3: { type: Type.STRING, description: "Level Take Profit 3, target keuntungan jangka panjang atau pada level kunci." },
            },
            required: ["tp1", "tp2", "tp3"]
        },
        stopLoss: {
            type: Type.STRING,
            description: "Level Stop Loss (SL) yang direkomendasikan untuk mengelola risiko. Untuk sinyal BELI, tempatkan sedikit di bawah support kunci. Untuk sinyal JUAL, tempatkan sedikit di atas resistance kunci."
        }
    },
    required: ["signal", "confidence", "summary", "strategy", "reasoning", "takeProfit", "stopLoss"],
};

export const getPreliminarySummary = async (imageFile: File): Promise<PreliminarySummary> => {
    try {
        const imagePart = await fileToGenerativePart(imageFile);
        const prompt = `Anda adalah seorang analis grafik pasar yang ahli. Lihatlah gambar grafik yang disediakan.
1. Jelaskan secara singkat dalam satu atau dua kalimat apa yang Anda lihat. Identifikasi kemungkinan aset (misalnya, BTC/USD), kerangka waktu yang mungkin (misalnya, grafik 4 jam), dan tren atau pola umum saat ini.
2. Identifikasi harga pasar saat ini (harga penutupan kandil terakhir) dari grafik.
Respons Anda HARUS berupa objek JSON yang valid yang berisi kunci "summary" dan "currentPrice".`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [{ text: prompt }, imagePart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: summarySchema,
                temperature: 0.1
            }
        });

        try {
            const responseText = response.text?.trim() || '';
            if (!responseText) {
                throw new Error("Response kosong dari Gemini API");
            }
            const parsedJson = JSON.parse(responseText);
            return parsedJson as PreliminarySummary;
        } catch (e) {
            console.error("Gagal mem-parsing ringkasan JSON:", response.text);
            throw new Error("AI mengembalikan format ringkasan yang tidak valid.");
        }
    } catch (error: any) {
        console.error("Error calling Gemini API:", error);

        if (error?.message?.includes("API key not valid")) {
            throw new Error("❌ API Key Google Gemini tidak valid!\n\n📋 Cara mendapatkan API Key yang benar:\n1. Kunjungi: https://aistudio.google.com/app/apikey\n2. Login dengan akun Google\n3. Klik 'Create API Key'\n4. Copy API key dan paste ke file .env\n5. Restart aplikasi\n\n💡 Pastikan billing sudah diaktifkan di Google Cloud Console!");
        }

        if (error?.message?.includes("quota")) {
            throw new Error("❌ Kuota API Gemini habis! Cek usage di Google AI Studio atau upgrade plan Anda.");
        }

        throw new Error(`❌ Gagal mengakses Gemini API: ${error?.message || 'Unknown error'}`);
    }
};

export const analyzeChart = async (imageFile: File, preliminarySummary: PreliminarySummary, userNotes?: string): Promise<AnalysisResult> => {
    try {
        const imagePart = await fileToGenerativePart(imageFile);

    let prompt = `Anda adalah seorang analis pasar keuangan ahli kelas dunia yang berspesialisasi dalam analisis teknis dari gambar grafik. Analisis gambar grafik pasar yang disediakan secara mendalam.
    
Konteks awal yang diidentifikasi dari gambar adalah:
- Ringkasan: "${preliminarySummary.summary}"
- Harga Saat Ini yang Terlihat: "${preliminarySummary.currentPrice}"

Berdasarkan informasi visual, lakukan analisis multi-indikator yang komprehensif. Evaluasi grafik menggunakan kerangka kerja berikut:
1.  **Struktur Pasar & Tren**: Identifikasi tren utama (bullish/bearish) menggunakan struktur Higher Highs/Higher Lows atau Lower Highs/Lower Lows.
2.  **Support & Resistance (S&R)**: Tentukan level S&R horizontal utama.
3.  **Konsep Smart Money (SMC)**: Cari tanda-tanda akumulasi, distribusi, atau blok order (order block) yang signifikan.
4.  **Indikator Momentum**: Analisis RSI untuk kondisi overbought/oversold dan divergensi.
5.  **Level Fibonacci**: Jika memungkinkan, tarik level Fibonacci Retracement pada pergerakan harga signifikan terakhir untuk menemukan support/resistance tersembunyi.
6.  **Analisis Volume**: Periksa volume untuk mengkonfirmasi pergerakan harga (misalnya, volume tinggi pada penembusan).
7.  **Moving Averages (EMA)**: Analisis persilangan dan posisi EMA (jika terlihat).
8.  **Kondisi Pasar**: Simpulkan kondisi pasar secara keseluruhan (trending, sideways).

Setelah analisis Anda, sintesis temuan Anda untuk:
A.  Memberikan **sinyal perdagangan** (BUY, SELL, atau NEUTRAL).
B.  Merumuskan **strategi perdagangan** yang jelas dan dapat ditindaklanjuti.
C.  Menentukan tiga **level Take Profit (TP)** dan satu **level Stop Loss (SL)**.

- Untuk sinyal BELI, tetapkan TP pada level resistance berikutnya dan SL di bawah support kunci.
- Untuk sinyal JUAL, tetapkan TP pada level support berikutnya dan SL di atas resistance kunci.
- Jika sinyal NETRAL, berikan 'N/A' untuk level TP dan SL dan jelaskan mengapa menunggu lebih disarankan dalam strategi.

Respons Anda HARUS berupa objek JSON yang valid yang secara ketat mematuhi skema yang disediakan. Berikan dasar pemikiran yang terperinci dan profesional untuk setiap indikator dalam objek 'reasoning'.`;
    
    if (userNotes) {
        prompt += `\n\nPENTING: Pengguna telah memberikan koreksi atau konteks berikut: "${userNotes}". Anda HARUS mempertimbangkan catatan ini untuk menyempurnakan analisis Anda. Jika catatan pengguna bertentangan dengan interpretasi awal Anda, prioritaskan masukan pengguna.`;
    }


    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [{ text: prompt }, imagePart] },
        config: {
            responseMimeType: "application/json",
            responseSchema: analysisSchema,
            temperature: 0.2
        }
    });

    const jsonText = response.text?.trim() || '';
    if (!jsonText) {
        throw new Error("Response kosong dari Gemini API");
    }

        try {
            const parsedJson = JSON.parse(jsonText);
            return parsedJson as AnalysisResult;
        } catch (e) {
            console.error("Gagal mem-parsing respons JSON:", jsonText);
            throw new Error("AI mengembalikan format respons yang tidak valid. Silakan coba lagi.");
        }
    } catch (error: any) {
        console.error("Error calling Gemini API:", error);

        if (error?.message?.includes("API key not valid")) {
            throw new Error("❌ API Key Google Gemini tidak valid!\n\n📋 Cara mendapatkan API Key yang benar:\n1. Kunjungi: https://aistudio.google.com/app/apikey\n2. Login dengan akun Google\n3. Klik 'Create API Key'\n4. Copy API key dan paste ke file .env\n5. Restart aplikasi\n\n💡 Pastikan billing sudah diaktifkan di Google Cloud Console!");
        }

        if (error?.message?.includes("quota")) {
            throw new Error("❌ Kuota API Gemini habis! Cek usage di Google AI Studio atau upgrade plan Anda.");
        }

        throw new Error(`❌ Gagal mengakses Gemini API: ${error?.message || 'Unknown error'}`);
    }
};