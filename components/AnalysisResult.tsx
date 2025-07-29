import React, { useEffect } from 'react';
import { AnalysisResult, Reasoning, Signal, TakeProfit, PreliminarySummary } from '../types';
import { Icon } from './Icon';
import { motion, animate, useMotionValue, useTransform } from 'framer-motion';

interface AnalysisResultProps {
  result: AnalysisResult;
  preliminarySummary: PreliminarySummary;
  onReset: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: {
      staggerChildren: 0.1
    }
  },
  exit: { opacity: 0, transition: { duration: 0.3 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};


const SignalBadge: React.FC<{ signal: Signal }> = ({ signal }) => {
  const signalStyles = {
    BUY: 'bg-green-500/20 text-green-300 ring-green-500/30',
    SELL: 'bg-red-500/20 text-red-300 ring-red-500/30',
    NEUTRAL: 'bg-yellow-500/20 text-yellow-300 ring-yellow-500/30',
  };
  const signalIcons = {
    BUY: 'trendingUp',
    SELL: 'trendingDown',
    NEUTRAL: 'moveHorizontal',
  }
  const signalLabels = {
      BUY: 'SINYAL BELI',
      SELL: 'SINYAL JUAL',
      NEUTRAL: 'SINYAL NETRAL'
  }
  return (
    <div className={`inline-flex items-center justify-center gap-3 w-full px-4 py-3 rounded-xl font-bold text-lg ring-1 ${signalStyles[signal]}`}>
        <Icon name={signalIcons[signal]} className="h-7 w-7" />
        <span>{signalLabels[signal]}</span>
    </div>
  );
};

const ConfidenceCircle: React.FC<{ confidence: number }> = ({ confidence }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest));
    const strokeDashoffset = useTransform(count, (latest) => circumference - (latest / 100) * circumference);

    useEffect(() => {
        const controls = animate(count, confidence, {
            duration: 1.5,
            ease: "circOut"
        });
        return controls.stop;
    }, [confidence]);

    return (
        <div className="relative flex items-center justify-center w-[120px] h-[120px] mx-auto">
            <svg className="transform -rotate-90" width="120" height="120" viewBox="0 0 120 120">
                <circle className="text-slate-700/50" strokeWidth="10" stroke="currentColor" fill="transparent" r={radius} cx="60" cy="60" />
                <motion.circle 
                    className="text-cyan-400 drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]" 
                    strokeWidth="10" 
                    strokeDasharray={circumference} 
                    strokeLinecap="round" 
                    stroke="currentColor" 
                    fill="transparent" 
                    r={radius} cx="60" cy="60" 
                    style={{ strokeDashoffset }}
                />
            </svg>
            <motion.span className="absolute text-3xl font-bold text-slate-100">{rounded}</motion.span>
            <span className="absolute text-lg font-bold text-slate-100 opacity-70 mt-[1.5px] ml-[68px]">%</span>
        </div>
    );
};

const ReasoningCard: React.FC<{ icon: string; title: string; text: string }> = ({ icon, title, text }) => (
    <div className="bg-slate-800/40 p-5 rounded-xl ring-1 ring-white/10 h-full flex flex-col backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-3">
            <div className="bg-slate-900/50 p-2 rounded-full ring-1 ring-white/10">
                <Icon name={icon} className="h-5 w-5 text-cyan-400" />
            </div>
            <h4 className="font-semibold text-base text-slate-200">{title}</h4>
        </div>
        <p className="text-slate-400 text-sm leading-relaxed flex-grow">{text}</p>
    </div>
);

const reasoningMap: { [K in keyof Reasoning]: { icon: string; title: string } } = {
    smartMoneyConcept: { icon: 'dollarSign', title: 'Konsep Smart Money' },
    supportAndResistance: { icon: 'activity', title: 'Support & Resistance' },
    trendAnalysis: { icon: 'trendingUp', title: 'Analisis Tren' },
    orderBlock: { icon: 'box', title: 'Order Block' },
    ema: { icon: 'waves', title: 'Analisis EMA' },
    marketCondition: { icon: 'moveHorizontal', title: 'Kondisi Pasar' },
    rsi: { icon: 'percent', title: 'Relative Strength Index (RSI)' },
    fibonacciRetracement: { icon: 'gitMerge', title: 'Fibonacci Retracement' },
    volumeAnalysis: { icon: 'barChart', title: 'Analisis Volume' },
};

const RiskRewardRatio: React.FC<{ currentPrice: string; tp: string; sl: string; signal: Signal }> = ({ currentPrice, tp, sl }) => {
    const parsePrice = (price: string) => parseFloat(price.replace(/[^0-9.-]+/g, ""));
    const entry = parsePrice(currentPrice);
    const takeProfit = parsePrice(tp);
    const stopLoss = parsePrice(sl);

    if (isNaN(entry) || isNaN(takeProfit) || isNaN(stopLoss) || sl === 'N/A' || tp === 'N/A' || entry === stopLoss) {
        return <div className="text-slate-500 font-mono">-</div>;
    }

    const potentialReward = Math.abs(takeProfit - entry);
    const potentialRisk = Math.abs(entry - stopLoss);
    
    if (potentialRisk === 0) return <div className="text-slate-500 font-mono">-</div>;
    
    const ratio = potentialReward / potentialRisk;
    
    const ratioColor = ratio >= 2 ? 'text-green-400' : ratio >= 1 ? 'text-yellow-400' : 'text-red-400';

    return <div className={`font-mono font-bold text-xl ${ratioColor}`}>{ratio.toFixed(2)} : 1</div>;
};

const TPSLDisplay: React.FC<{ takeProfit: TakeProfit, stopLoss: string, signal: Signal, currentPrice: string }> = ({ takeProfit, stopLoss, signal, currentPrice }) => {
    if (signal === 'NEUTRAL' && stopLoss === 'N/A' && takeProfit.tp1 === 'N/A') {
        return null;
    }

    return (
        <div className="bg-slate-800/40 p-6 rounded-xl ring-1 ring-white/10 backdrop-blur-sm h-full flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-100 mb-5">Level Perdagangan</h3>
              <div className="space-y-5">
                  <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3 text-base font-semibold text-green-400">
                          <Icon name="target" className="h-5 w-5" />
                          <span>Take Profit (TP)</span>
                      </div>
                      <div className="pl-8 space-y-1 text-slate-300">
                           <p className="flex justify-between items-baseline">TP 1: <span className="font-mono text-base font-bold text-green-300">{takeProfit.tp1}</span></p>
                           <p className="flex justify-between items-baseline">TP 2: <span className="font-mono text-base font-bold">{takeProfit.tp2}</span></p>
                           <p className="flex justify-between items-baseline">TP 3: <span className="font-mono text-base font-bold">{takeProfit.tp3}</span></p>
                      </div>
                  </div>
                  <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3 text-base font-semibold text-red-400">
                          <Icon name="shield" className="h-5 w-5" />
                          <span>Stop Loss (SL)</span>
                      </div>
                       <div className="pl-8 space-y-1 text-slate-300">
                          <p className="flex justify-between items-baseline">SL: <span className="font-mono text-base font-bold text-red-300">{stopLoss}</span></p>
                      </div>
                  </div>
              </div>
            </div>
             <div className="mt-6 border-t border-white/10 pt-4">
                  <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-base font-semibold text-yellow-400">
                           <Icon name="gitMerge" className="h-5 w-5" />
                          <span>Rasio R/R (vs TP1)</span>
                      </div>
                      <RiskRewardRatio currentPrice={currentPrice} tp={takeProfit.tp1} sl={stopLoss} signal={signal} />
                  </div>
            </div>
        </div>
    );
};

const AnalysisResultComponent: React.FC<AnalysisResultProps> = ({ result, preliminarySummary, onReset }) => {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-col gap-8 bg-slate-900/40 rounded-2xl shadow-2xl shadow-black/30 p-6 sm:p-10 ring-1 ring-white/10 backdrop-blur-md"
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* LEFT PANEL */}
        <div className="lg:col-span-2 flex flex-col gap-8">
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-slate-800/40 p-6 rounded-xl ring-1 ring-white/10 backdrop-blur-sm flex flex-col items-center justify-center text-center">
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Sinyal</h3>
                    <SignalBadge signal={result.signal} />
                </div>
                 <div className="bg-slate-800/40 p-6 rounded-xl ring-1 ring-white/10 backdrop-blur-sm flex flex-col items-center justify-center text-center">
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Keyakinan</h3>
                    <ConfidenceCircle confidence={result.confidence} />
                </div>
            </motion.div>
             <motion.div variants={itemVariants}>
                <TPSLDisplay takeProfit={result.takeProfit} stopLoss={result.stopLoss} signal={result.signal} currentPrice={preliminarySummary.currentPrice} />
             </motion.div>
        </div>
        
        {/* RIGHT PANEL */}
        <div className="lg:col-span-3 flex flex-col gap-8">
            <motion.div variants={itemVariants} className="bg-slate-800/40 p-6 rounded-xl ring-1 ring-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-3">
                     <Icon name="lightbulb" className="h-6 w-6 text-yellow-400" />
                     <h3 className="text-xl font-bold text-slate-100">Strategi Perdagangan</h3>
                </div>
                <p className="text-slate-300 text-lg">{result.strategy}</p>
            </motion.div>

            <motion.div variants={itemVariants}>
                <h3 className="text-xl font-bold text-slate-100 mb-4">Rincian Analisis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                    {Object.entries(result.reasoning).map(([key, value]) => {
                        const mapKey = key as keyof Reasoning;
                        const mapping = reasoningMap[mapKey];
                        if (!value || !mapping) return null;
                        return <ReasoningCard key={key} icon={mapping.icon} title={mapping.title} text={value} />
                    })}
                </div>
            </motion.div>
        </div>

      </div>

      <motion.div variants={itemVariants} className="text-center mt-4">
        <motion.button
          onClick={onReset}
          className="flex items-center mx-auto justify-center gap-2 px-8 py-3 font-semibold text-white bg-cyan-600/80 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
          whileHover={{ scale: 1.05, backgroundColor: 'rgb(8 145 178)' }}
          whileTap={{ scale: 0.98 }}
        >
          <Icon name="rotateCcw" className="h-5 w-5" />
          <span>Analisis Grafik Baru</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default AnalysisResultComponent;