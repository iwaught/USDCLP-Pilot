'use client';

import { useState, useEffect } from 'react';
import { Position } from '@/lib/types';
import { formatNumber, formatUSD, formatCLP } from '@/lib/formatters';

// Standard forex lot size in units of base currency (USD)
const STANDARD_LOT_SIZE = 100000;

interface PositionTrackerProps {
  currentRate: number;
}

export default function PositionTracker({ currentRate }: PositionTrackerProps) {
  // Load positions from localStorage with lazy initialization
  const [positions, setPositions] = useState<Position[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('usdclp-positions');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error('Failed to load positions:', e);
        }
      }
    }
    return [];
  });
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    direction: 'buy' as 'buy' | 'sell',
    entryPrice: currentRate.toString(),
    lotSize: '0.1',
  });

  // Save positions to localStorage whenever they change
  useEffect(() => {
    if (positions.length > 0) {
      localStorage.setItem('usdclp-positions', JSON.stringify(positions));
    } else {
      localStorage.removeItem('usdclp-positions');
    }
  }, [positions]);

  const handleAddPosition = () => {
    const newPosition: Position = {
      id: Date.now().toString(),
      direction: formData.direction,
      entryPrice: parseFloat(formData.entryPrice),
      lotSize: parseFloat(formData.lotSize),
      openDate: new Date().toISOString(),
      status: 'open',
    };

    setPositions([...positions, newPosition]);
    setShowForm(false);
    setFormData({
      direction: 'buy',
      entryPrice: currentRate.toString(),
      lotSize: '0.1',
    });
  };

  const handleClosePosition = (id: string) => {
    setPositions(
      positions.map((pos) =>
        pos.id === id
          ? { ...pos, status: 'closed', closePrice: currentRate, closeDate: new Date().toISOString() }
          : pos
      )
    );
  };

  const handleDeletePosition = (id: string) => {
    setPositions(positions.filter((pos) => pos.id !== id));
  };

  const calculatePnL = (position: Position) => {
    const exitPrice = position.closePrice || currentRate;
    const lotValueUSD = position.lotSize * STANDARD_LOT_SIZE; // Standard lot is 100,000 units
    
    // For USD/CLP, 1 lot = 100,000 USD
    // P&L in CLP = (exit rate - entry rate) * lot value in USD
    // Then convert to USD for display
    const pnlCLP = position.direction === 'buy'
      ? (exitPrice - position.entryPrice) * lotValueUSD
      : (position.entryPrice - exitPrice) * lotValueUSD;
    
    const pnlUSD = pnlCLP / exitPrice;
    
    return { pnlUSD, pnlCLP };
  };

  const openPositions = positions.filter((p) => p.status === 'open');
  const closedPositions = positions.filter((p) => p.status === 'closed');

  return (
    <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl text-white font-semibold">Position Tracker</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {showForm ? 'Cancel' : '+ Add Position'}
        </button>
      </div>

      {/* Add Position Form */}
      {showForm && (
        <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-zinc-400 text-sm mb-2 block">Direction</label>
              <select
                value={formData.direction}
                onChange={(e) => setFormData({ ...formData, direction: e.target.value as 'buy' | 'sell' })}
                className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#3a3a3a]"
              >
                <option value="buy">Buy USD</option>
                <option value="sell">Sell USD</option>
              </select>
            </div>
            <div>
              <label className="text-zinc-400 text-sm mb-2 block">Entry Price (CLP)</label>
              <input
                type="number"
                step="0.01"
                value={formData.entryPrice}
                onChange={(e) => setFormData({ ...formData, entryPrice: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#3a3a3a]"
              />
            </div>
            <div>
              <label className="text-zinc-400 text-sm mb-2 block">Lot Size</label>
              <input
                type="number"
                step="0.01"
                value={formData.lotSize}
                onChange={(e) => setFormData({ ...formData, lotSize: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#3a3a3a]"
              />
            </div>
          </div>
          <button
            onClick={handleAddPosition}
            className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Add Position
          </button>
        </div>
      )}

      {/* Open Positions */}
      {openPositions.length > 0 && (
        <div className="mb-6">
          <h3 className="text-zinc-400 text-sm font-semibold mb-3">Open Positions</h3>
          <div className="space-y-2">
            {openPositions.map((position) => {
              const { pnlUSD, pnlCLP } = calculatePnL(position);
              const isProfitable = pnlUSD >= 0;

              return (
                <div key={position.id} className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                    <div>
                      <div className="text-zinc-500 text-xs">Direction</div>
                      <div className={`font-semibold ${position.direction === 'buy' ? 'text-green-500' : 'text-red-500'}`}>
                        {position.direction === 'buy' ? 'BUY USD' : 'SELL USD'}
                      </div>
                    </div>
                    <div>
                      <div className="text-zinc-500 text-xs">Entry</div>
                      <div className="text-white">{formatNumber(position.entryPrice, 2)}</div>
                    </div>
                    <div>
                      <div className="text-zinc-500 text-xs">Lot Size</div>
                      <div className="text-white">{position.lotSize}</div>
                    </div>
                    <div>
                      <div className="text-zinc-500 text-xs">P&L</div>
                      <div className={`font-semibold ${isProfitable ? 'text-green-500' : 'text-red-500'}`}>
                        {formatUSD(pnlUSD)}
                      </div>
                      <div className="text-zinc-500 text-xs">{formatCLP(pnlCLP)}</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleClosePosition(position.id)}
                        className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-xs font-medium transition-colors"
                      >
                        Close
                      </button>
                      <button
                        onClick={() => handleDeletePosition(position.id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Closed Positions */}
      {closedPositions.length > 0 && (
        <div>
          <h3 className="text-zinc-400 text-sm font-semibold mb-3">Closed Positions</h3>
          <div className="space-y-2">
            {closedPositions.map((position) => {
              const { pnlUSD } = calculatePnL(position);
              const isProfitable = pnlUSD >= 0;

              return (
                <div key={position.id} className="bg-[#0a0a0a]/50 border border-[#262626] rounded-lg p-4 opacity-75">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center text-sm">
                    <div>
                      <div className="text-zinc-500 text-xs">Direction</div>
                      <div className="text-zinc-400">{position.direction === 'buy' ? 'BUY' : 'SELL'}</div>
                    </div>
                    <div>
                      <div className="text-zinc-500 text-xs">Entry</div>
                      <div className="text-zinc-400">{formatNumber(position.entryPrice, 2)}</div>
                    </div>
                    <div>
                      <div className="text-zinc-500 text-xs">Exit</div>
                      <div className="text-zinc-400">{formatNumber(position.closePrice || 0, 2)}</div>
                    </div>
                    <div>
                      <div className="text-zinc-500 text-xs">Lot Size</div>
                      <div className="text-zinc-400">{position.lotSize}</div>
                    </div>
                    <div>
                      <div className="text-zinc-500 text-xs">P&L</div>
                      <div className={`font-semibold ${isProfitable ? 'text-green-500' : 'text-red-500'}`}>
                        {formatUSD(pnlUSD)}
                      </div>
                    </div>
                    <div>
                      <button
                        onClick={() => handleDeletePosition(position.id)}
                        className="px-3 py-1 bg-red-600/50 hover:bg-red-600 text-white rounded text-xs font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {positions.length === 0 && !showForm && (
        <div className="text-center py-8 text-zinc-500">
          No positions yet. Click &quot;Add Position&quot; to track your trades.
        </div>
      )}
    </div>
  );
}
