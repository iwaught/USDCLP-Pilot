export interface ForexRate {
  pair: string; // "USD/CLP"
  rate: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  timestamp: string;
}

export interface TechnicalIndicators {
  rsi: number;
  sma20: number;
  sma50: number;
  ema12: number;
  ema26: number;
  macd: { macd: number; signal: number; histogram: number };
  support: number;
  resistance: number;
  volatility: number;
  trend: 'bullish' | 'bearish' | 'neutral';
}

export interface TradeSignal {
  direction: 'BUY' | 'SELL' | 'HOLD';
  confidence: 'high' | 'medium' | 'low';
  reasoning: string;
}

export interface Position {
  id: string;
  direction: 'buy' | 'sell';
  entryPrice: number;
  lotSize: number;
  openDate: string;
  status: 'open' | 'closed';
  closePrice?: number;
  closeDate?: string;
}

export interface HistoricalRate {
  date: string;
  rate: number;
}
