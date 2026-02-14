import { ForexRate } from '@/lib/types';
import { formatNumber, formatPercent, formatDateTime } from '@/lib/formatters';

interface RateCardProps {
  rate: ForexRate;
}

export default function RateCard({ rate }: RateCardProps) {
  const isPositive = rate.change >= 0;
  const changeColor = isPositive ? 'text-green-500' : 'text-red-500';
  const changeBg = isPositive ? 'bg-green-500/10' : 'bg-red-500/10';

  return (
    <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl text-zinc-400 font-medium">Current Rate</h2>
        <span className="text-2xl">🇨🇱</span>
      </div>

      {/* Main rate display */}
      <div className="mb-6">
        <div className="text-zinc-400 text-sm mb-2">1 USD =</div>
        <div className="text-6xl font-bold text-white mb-2">
          {formatNumber(rate.rate, 2)}
          <span className="text-3xl text-zinc-400 ml-2">CLP</span>
        </div>
      </div>

      {/* Daily change */}
      <div className={`inline-flex items-center gap-2 ${changeBg} ${changeColor} px-4 py-2 rounded-lg mb-6`}>
        <span className="text-2xl font-bold">
          {isPositive ? '↑' : '↓'}
        </span>
        <span className="font-semibold">
          {formatNumber(Math.abs(rate.change), 2)} CLP
        </span>
        <span className="font-semibold">
          ({formatPercent(rate.changePercent)})
        </span>
      </div>

      {/* High / Low */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-[#0a0a0a] rounded-lg p-4">
          <div className="text-zinc-500 text-xs uppercase mb-1">Day High</div>
          <div className="text-white text-xl font-semibold">
            {formatNumber(rate.high, 2)}
          </div>
        </div>
        <div className="bg-[#0a0a0a] rounded-lg p-4">
          <div className="text-zinc-500 text-xs uppercase mb-1">Day Low</div>
          <div className="text-white text-xl font-semibold">
            {formatNumber(rate.low, 2)}
          </div>
        </div>
      </div>

      {/* Last updated */}
      <div className="text-zinc-500 text-sm">
        Last updated: {formatDateTime(rate.timestamp)}
      </div>
    </div>
  );
}
