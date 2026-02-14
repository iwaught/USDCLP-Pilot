import { TradeSignal } from '@/lib/types';

interface TradeSignalProps {
  signal: TradeSignal;
}

export default function TradeSignalComponent({ signal }: TradeSignalProps) {
  const getSignalStyle = () => {
    switch (signal.direction) {
      case 'BUY':
        return {
          bg: 'bg-green-500/10',
          border: 'border-green-500/30',
          text: 'text-green-500',
          icon: '🟢',
          label: 'BUY USD (Sell CLP)',
        };
      case 'SELL':
        return {
          bg: 'bg-red-500/10',
          border: 'border-red-500/30',
          text: 'text-red-500',
          icon: '🔴',
          label: 'SELL USD (Buy CLP)',
        };
      case 'HOLD':
        return {
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-500/30',
          text: 'text-yellow-500',
          icon: '🟡',
          label: 'HOLD / WAIT',
        };
    }
  };

  const getConfidenceBadge = () => {
    switch (signal.confidence) {
      case 'high':
        return 'bg-white/10 text-white';
      case 'medium':
        return 'bg-white/5 text-zinc-300';
      case 'low':
        return 'bg-white/5 text-zinc-400';
    }
  };

  const style = getSignalStyle();
  const confidenceBadge = getConfidenceBadge();

  return (
    <div className={`${style.bg} border ${style.border} rounded-xl p-6`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl text-white font-semibold">Trade Signal</h2>
        <span className={`text-xs px-3 py-1 rounded-full uppercase font-semibold ${confidenceBadge}`}>
          {signal.confidence} Confidence
        </span>
      </div>

      {/* Signal indicator */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-4xl">{style.icon}</span>
        <div>
          <div className={`text-2xl font-bold ${style.text}`}>
            {style.label}
          </div>
        </div>
      </div>

      {/* Reasoning */}
      <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-4 mb-4">
        <div className="text-zinc-400 text-sm leading-relaxed">
          {signal.reasoning}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="text-zinc-500 text-xs italic">
        ⚠️ This is not financial advice. Use at your own risk. Technical analysis is provided for informational purposes only.
      </div>
    </div>
  );
}
