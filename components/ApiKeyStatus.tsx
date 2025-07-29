import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from './Icon';
import { testApiKey } from '../services/geminiService';

interface ApiKeyStatusProps {
  onStatusChange?: (isValid: boolean) => void;
}

export const ApiKeyStatus: React.FC<ApiKeyStatusProps> = ({ onStatusChange }) => {
  const [isChecking, setIsChecking] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState<string>('');

  const checkApiKey = async () => {
    setIsChecking(true);
    setError('');
    
    try {
      const valid = await testApiKey();
      setIsValid(valid);
      onStatusChange?.(valid);
      
      if (!valid) {
        setError('API Key tidak valid atau tidak memiliki akses ke Gemini API');
      }
    } catch (err: any) {
      setIsValid(false);
      setError(err.message || 'Gagal memvalidasi API Key');
      onStatusChange?.(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    // Auto-check saat komponen dimount
    checkApiKey();
  }, []);

  const getStatusColor = () => {
    if (isChecking) return 'text-yellow-400';
    if (isValid === true) return 'text-green-400';
    if (isValid === false) return 'text-red-400';
    return 'text-slate-400';
  };

  const getStatusIcon = () => {
    if (isChecking) return 'rotateCcw';
    if (isValid === true) return 'checkCircle';
    if (isValid === false) return 'xCircle';
    return 'shield';
  };

  const getStatusText = () => {
    if (isChecking) return 'Memvalidasi API Key...';
    if (isValid === true) return 'API Key Valid';
    if (isValid === false) return 'API Key Tidak Valid';
    return 'Status API Key';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 mb-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`${getStatusColor()} ${isChecking ? 'animate-spin' : ''}`}>
            <Icon name={getStatusIcon()} className="w-5 h-5" />
          </div>
          <div>
            <h3 className={`font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </h3>
            {error && (
              <p className="text-sm text-red-400 mt-1">
                {error}
              </p>
            )}
          </div>
        </div>
        
        <button
          onClick={checkApiKey}
          disabled={isChecking}
          className="px-3 py-1.5 text-sm bg-slate-700/50 hover:bg-slate-600/50 
                   border border-slate-600/50 rounded-lg transition-colors
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isChecking ? 'Checking...' : 'Test Ulang'}
        </button>
      </div>

      {isValid === false && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg"
        >
          <h4 className="text-red-400 font-medium mb-2">
            🔑 Cara Memperbaiki API Key:
          </h4>
          <ol className="text-sm text-red-300 space-y-1 list-decimal list-inside">
            <li>Kunjungi <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline hover:text-red-200">Google AI Studio</a></li>
            <li>Login dan buat API Key baru</li>
            <li>Copy API Key ke file .env</li>
            <li>Pastikan billing diaktifkan di Google Cloud</li>
            <li>Restart aplikasi</li>
          </ol>
        </motion.div>
      )}
    </motion.div>
  );
};
