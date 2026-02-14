import { Position } from '@/lib/types';

interface SummaryCardsProps {
  positions: Position[];
}

export default function SummaryCards({ positions }: SummaryCardsProps) {
  const totalValue = positions.reduce((sum, pos) => sum + pos.marketValue, 0);
  const numPositions = positions.length;

  // Return early if no positions to avoid errors
  if (positions.length === 0) {
    return null;
  }

  const topGainer = positions.reduce((max, pos) =>
    pos.changePercent > max.changePercent ? pos : max
  , positions[0]);

  const topLoser = positions.reduce((min, pos) =>
    pos.changePercent < min.changePercent ? pos : min
  , positions[0]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <p className="text-sm text-zinc-500 mb-2">Total Portfolio Value</p>
        <p className="text-3xl font-semibold text-white">{formatCurrency(totalValue)}</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <p className="text-sm text-zinc-500 mb-2">Number of Positions</p>
        <p className="text-3xl font-semibold text-white">{numPositions}</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <p className="text-sm text-zinc-500 mb-2">Top Gainer</p>
        <p className="text-xl font-semibold text-white">{topGainer.symbol}</p>
        <p className="text-sm text-green-500 mt-1">{formatPercent(topGainer.changePercent)}</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <p className="text-sm text-zinc-500 mb-2">Top Loser</p>
        <p className="text-xl font-semibold text-white">{topLoser.symbol}</p>
        <p className="text-sm text-red-500 mt-1">{formatPercent(topLoser.changePercent)}</p>
      </div>
    </div>
  );
}
