'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { HistoricalRate } from '@/lib/types';

interface PriceChartProps {
  data: HistoricalRate[];
  sma20Data: number[];
  sma50Data: number[];
}

// Custom tooltip component (defined outside)
interface TooltipPayload {
  value?: number;
  payload: {
    date: string;
  };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1a1a] border border-[#262626] rounded-lg p-3">
        <p className="text-zinc-400 text-xs mb-1">
          {new Date(payload[0].payload.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </p>
        <p className="text-white font-semibold">
          Rate: {payload[0].value?.toFixed(2)} CLP
        </p>
        {payload[1]?.value && (
          <p className="text-blue-400 text-sm">
            SMA20: {payload[1].value.toFixed(2)}
          </p>
        )}
        {payload[2]?.value && (
          <p className="text-purple-400 text-sm">
            SMA50: {payload[2].value.toFixed(2)}
          </p>
        )}
      </div>
    );
  }
  return null;
}

export default function PriceChart({ data, sma20Data, sma50Data }: PriceChartProps) {
  // Combine data for chart
  const chartData = data.map((item, index) => ({
    date: item.date,
    rate: item.rate,
    sma20: sma20Data[index] || null,
    sma50: sma50Data[index] || null,
  }));

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl text-white font-semibold">Historical Chart (90 Days)</h2>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-white rounded-full"></div>
            <span className="text-zinc-400">Price</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-zinc-400">SMA 20</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-zinc-400">SMA 50</span>
          </div>
        </div>
      </div>

      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              stroke="#71717a"
              tick={{ fill: '#71717a', fontSize: 12 }}
              tickLine={{ stroke: '#262626' }}
              interval="preserveStartEnd"
              minTickGap={50}
            />
            <YAxis
              stroke="#71717a"
              tick={{ fill: '#71717a', fontSize: 12 }}
              tickLine={{ stroke: '#262626' }}
              domain={['auto', 'auto']}
              tickFormatter={(value) => value.toFixed(0)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="rate"
              stroke="#ffffff"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#ffffff' }}
            />
            <Line
              type="monotone"
              dataKey="sma20"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#3b82f6' }}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="sma50"
              stroke="#a855f7"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#a855f7' }}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
