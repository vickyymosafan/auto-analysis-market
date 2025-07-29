
import React, { useCallback, useState } from 'react';
import { Icon } from './Icon';
import { motion } from 'framer-motion';

interface UploadStepProps {
  onFileUpload: (file: File) => void;
}

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.2
    }
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const UploadStep: React.FC<UploadStepProps> = ({ onFileUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  }, [onFileUpload]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="bg-slate-900/40 rounded-2xl shadow-2xl shadow-black/30 p-6 sm:p-10 ring-1 ring-white/10 backdrop-blur-md flex flex-col lg:flex-row gap-8 items-stretch"
    >
        <motion.div variants={itemVariants} className="flex-1 w-full">
            <motion.div 
              className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 h-full flex flex-col justify-center ${isDragging ? 'border-cyan-400 bg-slate-800/60' : 'border-slate-700'}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onClick={() => document.getElementById('file-upload')?.click()}
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(30, 41, 59, 0.4)' }}
              transition={{ duration: 0.2 }}
            >
                <input id="file-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
                <div className="flex flex-col items-center justify-center text-slate-400">
                    <Icon name="uploadCloud" className="h-20 w-20 mb-5 text-slate-500" />
                    <p className="text-xl font-semibold text-slate-200">
                        Seret & Lepas Grafik Anda di Sini
                    </p>
                    <p className="text-slate-500 my-2">atau</p>
                    <motion.span 
                        className="font-semibold text-cyan-400 bg-cyan-900/50 px-4 py-2 rounded-md"
                        whileHover={{ scale: 1.05, filter: 'brightness(1.2)' }}
                    >
                        Pilih File
                    </motion.span>
                    <p className="text-xs mt-4">PNG, JPG, atau WEBP (maks 10MB)</p>
                </div>
            </motion.div>
        </motion.div>
        <motion.div variants={itemVariants} className="flex-1 w-full p-8 bg-slate-800/50 rounded-xl ring-1 ring-white/10">
            <h3 className="text-xl font-bold text-slate-100 mb-4">Praktik Terbaik</h3>
            <p className="text-slate-400 mb-6">Untuk analisis AI yang paling akurat, pastikan unggahan Anda memenuhi kriteria berikut:</p>
            <ul className="space-y-4 text-slate-300">
                <li className="flex items-start gap-3">
                    <Icon name="checkCircle" className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                    <div>
                        <span className="font-semibold">Kualitas Gambar Tinggi</span>
                        <p className="text-slate-400 text-sm">Gunakan gambar yang jelas dan tidak buram di mana setiap kandil terlihat.</p>
                    </div>
                </li>
                <li className="flex items-start gap-3">
                    <Icon name="checkCircle" className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                    <div>
                        <span className="font-semibold">Sumbu yang Terlihat</span>
                         <p className="text-slate-400 text-sm">Pastikan sumbu harga (y) dan waktu (x) terlihat dengan jelas.</p>
                    </div>
                </li>
                 <li className="flex items-start gap-3">
                    <Icon name="checkCircle" className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                     <div>
                        <span className="font-semibold">Sertakan Indikator</span>
                         <p className="text-slate-400 text-sm">Jika memungkinkan, sertakan indikator kunci seperti Volume, EMA, atau RSI pada grafik.</p>
                    </div>
                </li>
                 <li className="flex items-start gap-3">
                    <Icon name="checkCircle" className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                     <div>
                        <span className="font-semibold">Grafik Standar</span>
                         <p className="text-slate-400 text-sm">Grafik kandil atau batang standar memberikan hasil terbaik.</p>
                    </div>
                </li>
            </ul>
        </motion.div>
    </motion.div>
  );
};

export default UploadStep;