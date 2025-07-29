
import React from 'react';
import { Icon } from './Icon';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ text }) => {
  return (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center justify-center py-20 text-center bg-slate-900/40 rounded-2xl shadow-2xl shadow-black/30 ring-1 ring-white/10 backdrop-blur-md"
    >
      <div className="relative h-20 w-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            loop: Infinity,
            ease: 'linear',
            duration: 1,
          }}
          className="absolute inset-0 border-t-4 border-cyan-400 rounded-full"
        />
        <div className="absolute inset-0 border-4 border-cyan-400/20 rounded-full"></div>
        <div className="absolute inset-0 flex items-center justify-center">
             <Icon name="brainCircuit" className="h-10 w-10 text-cyan-500" />
        </div>
      </div>
      <p className="mt-6 text-lg font-semibold text-slate-200">
        {text || 'Memuat...'}
      </p>
    </motion.div>
  );
};

export default LoadingSpinner;