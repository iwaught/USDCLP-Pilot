'use client';

import { useState, useEffect } from 'react';
import { formatNumber } from '@/lib/formatters';

interface ConverterProps {
  rate: number;
}

export default function Converter({ rate }: ConverterProps) {
  const [usdAmount, setUsdAmount] = useState<string>('1000');
  const [clpAmount, setClpAmount] = useState<string>('');

  useEffect(() => {
    // Update CLP when rate changes
    if (usdAmount) {
      const usd = parseFloat(usdAmount) || 0;
      setClpAmount(formatNumber(usd * rate, 2));
    }
  }, [rate, usdAmount]);

  const handleUsdChange = (value: string) => {
    setUsdAmount(value);
    const usd = parseFloat(value) || 0;
    setClpAmount(formatNumber(usd * rate, 2));
  };

  const handleClpChange = (value: string) => {
    setClpAmount(value);
    const clp = parseFloat(value.replace(/,/g, '')) || 0;
    setUsdAmount(formatNumber(clp / rate, 2));
  };

  const lotSize = 0.1;
  const lotUSD = 10000;
  const lotCLP = lotUSD * rate;

  return (
    <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-6">
      <h2 className="text-xl text-white font-semibold mb-4">Quick Converter</h2>

      <div className="space-y-4">
        {/* USD Input */}
        <div>
          <label className="text-zinc-400 text-sm mb-2 block">USD Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">$</span>
            <input
              type="text"
              value={usdAmount}
              onChange={(e) => handleUsdChange(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg pl-8 pr-4 py-3 text-white focus:outline-none focus:border-[#3a3a3a]"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Conversion arrow */}
        <div className="flex justify-center">
          <div className="text-zinc-400 text-2xl">⇅</div>
        </div>

        {/* CLP Input */}
        <div>
          <label className="text-zinc-400 text-sm mb-2 block">CLP Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">$</span>
            <input
              type="text"
              value={clpAmount}
              onChange={(e) => handleClpChange(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg pl-8 pr-4 py-3 text-white focus:outline-none focus:border-[#3a3a3a]"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Lot size reference */}
        <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-4 mt-4">
          <div className="text-zinc-500 text-xs uppercase mb-2">Lot Size Reference</div>
          <div className="text-white text-sm">
            <span className="font-semibold">{lotSize} lot</span> ≈{' '}
            <span className="font-semibold">${formatNumber(lotUSD, 0)} USD</span> ≈{' '}
            <span className="font-semibold">${formatNumber(lotCLP, 0)} CLP</span>
          </div>
        </div>
      </div>
    </div>
  );
}
