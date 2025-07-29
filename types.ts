export type Signal = "BUY" | "SELL" | "NEUTRAL";

export interface Reasoning {
  smartMoneyConcept: string;
  supportAndResistance: string;
  trendAnalysis: string;
  orderBlock: string;
  ema: string;
  marketCondition: string;
  rsi: string;
  fibonacciRetracement: string;
  volumeAnalysis: string;
}

export interface TakeProfit {
    tp1: string;
    tp2: string;
    tp3: string;
}

export interface AnalysisResult {
  signal: Signal;
  confidence: number;
  summary: string;
  strategy: string;
  reasoning: Reasoning;
  takeProfit: TakeProfit;
  stopLoss: string;
}

export interface PreliminarySummary {
    summary: string;
    currentPrice: string;
}

export type AppState = "UPLOAD" | "PRE_ANALYZING" | "CONFIRM_SUMMARY" | "ANALYZING" | "RESULT" | "ERROR";