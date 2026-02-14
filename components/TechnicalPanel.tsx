import { TechnicalIndicators } from '@/lib/types';
import { formatNumber } from '@/lib/formatters';

interface TechnicalPanelProps {
  indicators: TechnicalIndicators;
  currentPrice: number;
}

export default function TechnicalPanel({ indicators, currentPrice }: TechnicalPanelProps) {
  // RSI Status
  const getRSIStatus = (rsi: number) => {
    if (rsi > 70) return { label: 'Overbought', color: 'text-red-500 bg-red-500/10' };
    if (rsi < 30) return { label: 'Oversold', color: 'text-green-500 bg-green-500/10' };
    if (rsi > 60) return { label: 'Strong', color: 'text-yellow-500 bg-yellow-500/10' };
    if (rsi < 40) return { label: 'Weak', color: 'text-yellow-500 bg-yellow-500/10' };
    return { label: 'Neutral', color: 'text-zinc-400 bg-zinc-500/10' };
  };

  // Trend icon
  const getTrendIcon = (trend: string) => {
    if (trend === 'bullish') return { icon: '🟢', label: 'Bullish', color: 'text-green-500' };
    if (trend === 'bearish') return { icon: '🔴', label: 'Bearish', color: 'text-red-500' };
    return { icon: '🟡', label: 'Neutral', color: 'text-yellow-500' };
  };

  // MACD Status
  const getMACDStatus = () => {
    if (indicators.macd.histogram > 0) {
      return { label: 'Bullish', color: 'text-green-500' };
    } else if (indicators.macd.histogram < 0) {
      return { label: 'Bearish', color: 'text-red-500' };
    }
    return { label: 'Neutral', color: 'text-yellow-500' };
  };

  const rsiStatus = getRSIStatus(indicators.rsi);
  const trendInfo = getTrendIcon(indicators.trend);
  const macdStatus = getMACDStatus();

  return (
    <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-6">
      <h2 className="text-xl text-white font-semibold mb-4">Technical Analysis</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Trend Direction */}
        <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-4">
          <div className="text-zinc-500 text-xs uppercase mb-2">Trend Direction</div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{trendInfo.icon}</span>
            <span className={`text-lg font-semibold ${trendInfo.color}`}>
              {trendInfo.label}
            </span>
          </div>
        </div>

        {/* RSI */}
        <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-4">
          <div className="text-zinc-500 text-xs uppercase mb-2">RSI (14)</div>
          <div className="flex items-center justify-between">
            <span className="text-white text-xl font-semibold">
              {formatNumber(indicators.rsi, 1)}
            </span>
            <span className={`text-xs px-2 py-1 rounded ${rsiStatus.color}`}>
              {rsiStatus.label}
            </span>
          </div>
        </div>

        {/* SMA 20 */}
        <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-4">
          <div className="text-zinc-500 text-xs uppercase mb-2">SMA 20</div>
          <div className="flex items-center justify-between">
            <span className="text-white text-xl font-semibold">
              {formatNumber(indicators.sma20, 2)}
            </span>
            <span className={`text-xs ${currentPrice > indicators.sma20 ? 'text-green-500' : 'text-red-500'}`}>
              {currentPrice > indicators.sma20 ? 'Above' : 'Below'}
            </span>
          </div>
        </div>

        {/* SMA 50 */}
        <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-4">
          <div className="text-zinc-500 text-xs uppercase mb-2">SMA 50</div>
          <div className="flex items-center justify-between">
            <span className="text-white text-xl font-semibold">
              {formatNumber(indicators.sma50, 2)}
            </span>
            <span className={`text-xs ${currentPrice > indicators.sma50 ? 'text-green-500' : 'text-red-500'}`}>
              {currentPrice > indicators.sma50 ? 'Above' : 'Below'}
            </span>
          </div>
        </div>

        {/* Support Level */}
        <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-4">
          <div className="text-zinc-500 text-xs uppercase mb-2">Support Level</div>
          <div className="text-white text-xl font-semibold">
            {formatNumber(indicators.support, 2)}
          </div>
          <div className="text-zinc-500 text-xs mt-1">
            {formatNumber(((currentPrice - indicators.support) / currentPrice) * 100, 1)}% away
          </div>
        </div>

        {/* Resistance Level */}
        <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-4">
          <div className="text-zinc-500 text-xs uppercase mb-2">Resistance Level</div>
          <div className="text-white text-xl font-semibold">
            {formatNumber(indicators.resistance, 2)}
          </div>
          <div className="text-zinc-500 text-xs mt-1">
            {formatNumber(((indicators.resistance - currentPrice) / currentPrice) * 100, 1)}% away
          </div>
        </div>

        {/* MACD */}
        <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-4">
          <div className="text-zinc-500 text-xs uppercase mb-2">MACD</div>
          <div className="flex items-center justify-between">
            <span className="text-white text-xl font-semibold">
              {formatNumber(indicators.macd.histogram, 2)}
            </span>
            <span className={`text-xs font-semibold ${macdStatus.color}`}>
              {macdStatus.label}
            </span>
          </div>
        </div>

        {/* Volatility */}
        <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-4">
          <div className="text-zinc-500 text-xs uppercase mb-2">Volatility</div>
          <div className="text-white text-xl font-semibold">
            {formatNumber(indicators.volatility, 2)}%
          </div>
          <div className="text-zinc-500 text-xs mt-1">
            {indicators.volatility > 1.5 ? 'High' : indicators.volatility > 0.8 ? 'Moderate' : 'Low'}
          </div>
        </div>
      </div>
    </div>
  );
}
