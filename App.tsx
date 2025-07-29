
import React, { useState, useEffect } from 'react';
import { AnalysisResult, AppState, PreliminarySummary } from './types';
import { getPreliminarySummary, analyzeChart } from './services/geminiService';
import UploadStep from './components/UploadStep';
import ConfirmStep from './components/ConfirmStep';
import LoadingSpinner from './components/LoadingSpinner';
import AnalysisResultComponent from './components/AnalysisResult';
import ErrorDisplay from './components/ErrorDisplay';
import { Icon } from './components/Icon';
import { ApiKeyStatus } from './components/ApiKeyStatus';
import { AnimatePresence } from 'framer-motion';


const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('UPLOAD');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [preliminarySummary, setPreliminarySummary] = useState<PreliminarySummary | null>(null);
  const [userNotes, setUserNotes] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isApiKeyValid, setIsApiKeyValid] = useState<boolean>(false);

  const handleFileUpload = (file: File) => {
    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
    setAppState('PRE_ANALYZING');
  };

  const handleAnalyzeWithNotes = (notes: string) => {
    setUserNotes(notes);
    setAppState('ANALYZING');
  };
  
  const handleConfirmSummary = () => {
    setUserNotes(''); // Pastikan tidak ada catatan lama
    setAppState('ANALYZING');
  };

  const resetState = () => {
    if(imageUrl) URL.revokeObjectURL(imageUrl);
    setImageFile(null);
    setImageUrl(null);
    setPreliminarySummary(null);
    setUserNotes('');
    setAnalysisResult(null);
    setError(null);
    setAppState('UPLOAD');
  }

  useEffect(() => {
    if (appState === 'PRE_ANALYZING' && imageFile) {
      const fetchSummary = async () => {
        setError(null);
        try {
          const summaryObject = await getPreliminarySummary(imageFile);
          setPreliminarySummary(summaryObject);
          setAppState('CONFIRM_SUMMARY');
        } catch (err) {
          console.error(err);
          setError(err instanceof Error ? err.message : 'Gagal membuat ringkasan awal.');
          setAppState('ERROR');
        }
      };
      fetchSummary();
    }
  }, [appState, imageFile]);

  useEffect(() => {
    if (appState === 'ANALYZING' && imageFile && preliminarySummary) {
        const doAnalysis = async () => {
             setError(null);
             try {
                const result = await analyzeChart(imageFile, preliminarySummary, userNotes || undefined);
                setAnalysisResult(result);
                setAppState('RESULT');
            } catch (err) {
                console.error(err);
                setError(err instanceof Error ? err.message : 'Terjadi kesalahan yang tidak diketahui selama analisis.');
                setAppState('ERROR');
            }
        };
        doAnalysis();
    }
  }, [appState, imageFile, userNotes, preliminarySummary]);

  const renderContent = () => {
    switch (appState) {
      case 'UPLOAD':
        return <UploadStep key="upload" onFileUpload={handleFileUpload} />;
      case 'PRE_ANALYZING':
        return <LoadingSpinner key="pre-analyzing" text="Menganalisis gambar..." />;
      case 'CONFIRM_SUMMARY':
        return <ConfirmStep 
                  key="confirm"
                  imageUrl={imageUrl!} 
                  summary={preliminarySummary!}
                  onConfirm={handleConfirmSummary}
                  onAnalyzeWithNotes={handleAnalyzeWithNotes}
                  onReject={resetState} 
               />;
      case 'ANALYZING':
        return <LoadingSpinner key="analyzing" text="Menjalankan analisis komprehensif..." />;
      case 'RESULT':
        return <AnalysisResultComponent key="result" result={analysisResult!} preliminarySummary={preliminarySummary!} onReset={resetState} />;
      case 'ERROR':
        return <ErrorDisplay key="error" message={error!} onReset={resetState} />;
      default:
        return <UploadStep key="default-upload" onFileUpload={handleFileUpload} />;
    }
  };

  return (
    <div className="min-h-screen text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-7xl mx-auto">
        <header className="text-center mb-10">
            <div className="flex items-center justify-center gap-3">
                <Icon name="brainCircuit" className="h-9 w-9 text-cyan-400" />
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-200 to-cyan-400">
                    Penganalisis Grafik AI
                </h1>
            </div>
          <p className="mt-3 text-lg text-slate-400 max-w-3xl mx-auto">
            Unggah gambar grafik untuk analisis teknis instan, strategi perdagangan yang dapat ditindaklanjuti, dan visualisasi data yang dinamis.
          </p>
        </header>

        <ApiKeyStatus onStatusChange={setIsApiKeyValid} />

        <main>
            <AnimatePresence mode="wait">
                {renderContent()}
            </AnimatePresence>
        </main>
        <footer className="text-center mt-12 text-slate-500 text-sm">
            <p>&copy; {new Date().getFullYear()} AI Financial Tools. Analisis dihasilkan oleh AI dan bukan merupakan nasihat keuangan.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;