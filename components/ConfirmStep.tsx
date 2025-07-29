import React, { useState } from 'react';
import { Icon } from './Icon';
import { PreliminarySummary } from '../types';
import { motion } from 'framer-motion';

interface ConfirmStepProps {
  imageUrl: string;
  summary: PreliminarySummary;
  onConfirm: () => void;
  onAnalyzeWithNotes: (notes: string) => void;
  onReject: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: {
      duration: 0.3,
      when: "beforeChildren",
      staggerChildren: 0.15
    }
  },
  exit: { opacity: 0, transition: { duration: 0.3 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};


const ConfirmStep: React.FC<ConfirmStepProps> = ({ imageUrl, summary, onConfirm, onAnalyzeWithNotes, onReject }) => {
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');

  const handleCorrectionClick = () => {
    setShowNotes(true);
  };

  const handleSubmitWithNotes = () => {
    if (notes.trim()) {
      onAnalyzeWithNotes(notes);
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="bg-slate-900/40 rounded-2xl shadow-2xl shadow-black/30 p-6 sm:p-10 ring-1 ring-white/10 backdrop-blur-md flex flex-col lg:flex-row gap-8 lg:gap-12 items-start"
    >
        <motion.div variants={itemVariants} className="lg:w-1/2 w-full">
             <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/30 ring-1 ring-white/10">
                <img src={imageUrl} alt="Pratinjau grafik pasar" className="w-full h-auto object-contain" />
            </div>
             <button onClick={onReject} className="text-slate-500 hover:text-slate-300 text-sm transition-colors mt-4 w-full text-center">
                Unggah gambar lain
            </button>
        </motion.div>
        <motion.div variants={itemVariants} className="lg:w-1/2 w-full">
            <h2 className="text-3xl font-bold text-slate-100 mb-2">Verifikasi Data</h2>
            <p className="text-slate-400 mb-6">Harap konfirmasi interpretasi AI terhadap gambar Anda. Koreksi apa pun akan meningkatkan akurasi analisis akhir.</p>
            
            <div className="space-y-4 mb-6">
                <motion.div variants={itemVariants} className="bg-slate-800/50 p-5 rounded-xl ring-1 ring-white/10">
                    <h3 className="font-semibold text-slate-300 mb-2 text-sm uppercase tracking-wider">Kesimpulan AI</h3>
                    <p className="text-slate-200 italic">"{summary.summary}"</p>
                </motion.div>
                <motion.div variants={itemVariants} className="bg-slate-800/50 p-5 rounded-xl ring-1 ring-white/10">
                    <h3 className="font-semibold text-slate-300 mb-2 text-sm uppercase tracking-wider">Harga Terdeteksi</h3>
                    <div className="flex items-center gap-2">
                       <Icon name="dollarSign" className="h-6 w-6 text-cyan-400"/>
                       <p className="text-cyan-400 text-2xl font-mono font-bold">{summary.currentPrice}</p>
                    </div>
                </motion.div>
            </div>

            {!showNotes ? (
                 <motion.div variants={itemVariants} className="bg-slate-800/50 p-6 rounded-xl ring-1 ring-white/10 space-y-4">
                    <p className="font-semibold text-center text-slate-200 text-lg">Apakah interpretasi ini benar?</p>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <motion.button
                            onClick={onConfirm}
                            className="flex items-center justify-center gap-2 w-full px-6 py-3 font-semibold text-white bg-green-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-green-500"
                            whileHover={{ scale: 1.05, filter: 'brightness(1.1)' }}
                            whileTap={{ scale: 0.98 }}
                            >
                            <Icon name="check" className="h-5 w-5" />
                            <span>Ya, Konfirmasi & Analisis</span>
                        </motion.button>
                        <motion.button
                            onClick={handleCorrectionClick}
                            className="flex items-center justify-center gap-2 w-full px-6 py-3 font-semibold text-slate-100 bg-yellow-600/80 rounded-md"
                            whileHover={{ scale: 1.05, backgroundColor: 'rgb(202 138 4 / 1)' }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Icon name="edit" className="h-5 w-5" />
                            <span>Tidak, Beri Koreksi</span>
                        </motion.button>
                    </div>
                </motion.div>
            ) : (
                <motion.div 
                    initial={{ opacity: 0, y:10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-800/50 p-6 rounded-xl ring-1 ring-white/10 space-y-4"
                >
                    <label htmlFor="notes" className="font-semibold text-slate-200 block text-lg">Beri catatan untuk menyempurnakan analisis:</label>
                    <textarea 
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Contoh: 'Ini adalah grafik 1 jam, bukan 4 jam.' atau 'Fokus pada pola head and shoulders.'"
                        className="w-full h-28 p-3 bg-slate-900 border border-slate-600 rounded-md text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                        autoFocus
                    />
                    <motion.button
                        onClick={handleSubmitWithNotes}
                        disabled={!notes.trim()}
                        className="flex items-center justify-center gap-2 w-full px-8 py-3 font-semibold text-white bg-cyan-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed"
                        whileHover={{ scale: 1.05, filter: 'brightness(1.1)' }}
                        whileTap={{ scale: 0.98 }}
                    >
                         <Icon name="arrowRight" className="h-5 w-5" />
                        <span>Kirim Koreksi & Analisis Ulang</span>
                    </motion.button>
                </motion.div>
            )}
        </motion.div>
    </motion.div>
  );
};

export default ConfirmStep;