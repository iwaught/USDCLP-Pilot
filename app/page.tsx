'use client';

import { useState, useEffect } from 'react';
import RateCard from '@/components/RateCard';
import Converter from '@/components/Converter';
import TechnicalPanel from '@/components/TechnicalPanel';
import TradeSignal from '@/components/TradeSignal';
import PriceChart from '@/components/PriceChart';
import PositionTracker from '@/components/PositionTracker';
import { ForexRate, HistoricalRate, TechnicalIndicators, TradeSignal as TradeSignalType } from '@/lib/types';
import { calculateAllIndicators, generateTradeSignal, calculateSMA } from '@/lib/technicalAnalysis';

export default function Home() {
  const [currentRate, setCurrentRate] = useState<ForexRate | null>(null);
  const [historicalRates, setHistoricalRates] = useState<HistoricalRate[]>([]);
  const [indicators, setIndicators] = useState<TechnicalIndicators | null>(null);
  const [tradeSignal, setTradeSignal] = useState<TradeSignalType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/forex');
        if (!response.ok) throw new Error('Failed to fetch forex data');

        const data = await response.json();
        setCurrentRate(data.current);
        setHistoricalRates(data.historical);

        // Calculate technical indicators
        const prices = data.historical.map((h: HistoricalRate) => h.rate);
        const calculatedIndicators = calculateAllIndicators(prices);
        setIndicators(calculatedIndicators);

        // Generate trade signal
        const signal = generateTradeSignal(calculatedIndicators, data.current.rate);
        setTradeSignal(signal);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching forex data:', err);
        setError('Failed to load forex data. Please refresh the page.');
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Calculate SMA arrays for chart
  const sma20Data: number[] = [];
  const sma50Data: number[] = [];

  if (historicalRates.length > 0) {
    const prices = historicalRates.map((h) => h.rate);
    
    for (let i = 0; i < prices.length; i++) {
      const slice = prices.slice(0, i + 1);
      sma20Data.push(calculateSMA(slice, 20));
      sma50Data.push(calculateSMA(slice, 50));
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-white text-xl">Loading USD/CLP data...</div>
      </div>
    );
  }

  if (error || !currentRate || !indicators || !tradeSignal) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-8">
        <div className="bg-red-900/20 border border-red-800 text-red-400 px-6 py-4 rounded-lg max-w-md">
          <p className="font-medium">Error loading data</p>
          <p className="text-sm mt-1">{error || 'Unable to load forex data'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            USDCLP-Pilot 🇨🇱
          </h1>
          <p className="text-zinc-400 text-lg">
            Personal USD/CLP Forex Trading Assistant
          </p>
          <p className="text-zinc-500 text-sm mt-1">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Hero - Current Rate */}
          <div className="lg:col-span-2">
            <RateCard rate={currentRate} />
          </div>

          {/* Converter */}
          <div>
            <Converter rate={currentRate.rate} />
          </div>
        </div>

        {/* Trade Signal */}
        <div className="mb-6">
          <TradeSignal signal={tradeSignal} />
        </div>

        {/* Technical Analysis Panel */}
        <div className="mb-6">
          <TechnicalPanel indicators={indicators} currentPrice={currentRate.rate} />
        </div>

        {/* Historical Chart */}
        <div className="mb-6">
          <PriceChart data={historicalRates} sma20Data={sma20Data} sma50Data={sma50Data} />
        </div>

        {/* Position Tracker */}
        <div>
          <PositionTracker currentRate={currentRate.rate} />
        </div>
      </div>
    </div>
  );
}

