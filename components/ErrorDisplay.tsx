
import React from 'react';
import { Icon } from './Icon';
import { motion } from 'framer-motion';

interface ErrorDisplayProps {
  message: string;
  onReset: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onReset }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center text-center p-10 bg-red-900/20 rounded-2xl ring-1 ring-red-500/30 backdrop-blur-md"
    >
      <Icon name="xCircle" className="h-16 w-16 text-red-400 mb-4" />
      <h2 className="text-2xl font-bold text-red-300 mb-2">Terjadi Kesalahan</h2>
      <p className="text-slate-300 max-w-md mb-8">{message}</p>
      
      <motion.button
        onClick={onReset}
        className="flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white bg-cyan-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
        whileHover={{ scale: 1.05, backgroundColor: 'rgb(8 145 178)' }}
        whileTap={{ scale: 0.98 }}
      >
        <Icon name="rotateCcw" className="h-5 w-5" />
        <span>Coba Lagi</span>
      </motion.button>
    </motion.div>
  );
};

export default ErrorDisplay;