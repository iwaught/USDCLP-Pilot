import { Position } from '@/lib/types';
import SummaryCards from './SummaryCards';
import PositionsTable from './PositionsTable';

interface DashboardProps {
  positions: Position[];
  onClear: () => void;
}

export default function Dashboard({ positions, onClear }: DashboardProps) {
  const totalValue = positions.reduce((sum, pos) => sum + pos.marketValue, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Stock-Pilot</h1>
          <p className="text-zinc-400">
            {positions.length} positions • {formatCurrency(totalValue)}
          </p>
        </div>
        <button
          onClick={onClear}
          className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg border border-zinc-700 transition-colors"
        >
          Upload New CSV
        </button>
      </div>

      {/* Summary Cards */}
      <SummaryCards positions={positions} />

      {/* Positions Table */}
      <PositionsTable positions={positions} />
    </div>
  );
}
