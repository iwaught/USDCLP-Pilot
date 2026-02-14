'use client';

import { useState } from 'react';
import CSVUpload from '@/components/CSVUpload';
import Dashboard from '@/components/Dashboard';
import { parseCSV } from '@/lib/csvParser';
import { Position } from '@/lib/types';

export default function Home() {
  const [positions, setPositions] = useState<Position[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (content: string) => {
    try {
      const parsedPositions = parseCSV(content);
      setPositions(parsedPositions);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse CSV file');
      setPositions(null);
    }
  };

  const handleClear = () => {
    setPositions(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-8">
      {!positions ? (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
          <div className="mb-8 text-center">
            <h1 className="text-5xl font-bold text-white mb-4">Stock-Pilot</h1>
            <p className="text-xl text-zinc-400">
              Personal Stock Portfolio Tracker
            </p>
          </div>
          <CSVUpload onFileUpload={handleFileUpload} />
          {error && (
            <div className="mt-6 max-w-2xl w-full">
              <div className="bg-red-900/20 border border-red-800 text-red-400 px-6 py-4 rounded-lg">
                <p className="font-medium">Error parsing CSV:</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Dashboard positions={positions} onClear={handleClear} />
      )}
    </div>
  );
}

