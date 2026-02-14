'use client';

import { useState } from 'react';
import { Position, SortField, SortDirection } from '@/lib/types';

interface PositionsTableProps {
  positions: Position[];
}

export default function PositionsTable({ positions }: PositionsTableProps) {
  const [sortField, setSortField] = useState<SortField>('marketValue');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatNumber = (value: number, decimals: number = 2) => {
    return value.toFixed(decimals);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedPositions = [...positions].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return sortDirection === 'asc'
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number);
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return (
        <svg className="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    return sortDirection === 'asc' ? (
      <svg className="w-4 h-4 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-zinc-950 border-b border-zinc-800">
            <tr>
              <th
                onClick={() => handleSort('symbol')}
                className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider cursor-pointer hover:text-zinc-300"
              >
                <div className="flex items-center gap-2">
                  Symbol
                  <SortIcon field="symbol" />
                </div>
              </th>
              <th
                onClick={() => handleSort('price')}
                className="px-6 py-4 text-right text-xs font-medium text-zinc-400 uppercase tracking-wider cursor-pointer hover:text-zinc-300"
              >
                <div className="flex items-center justify-end gap-2">
                  Price
                  <SortIcon field="price" />
                </div>
              </th>
              <th
                onClick={() => handleSort('change')}
                className="px-6 py-4 text-right text-xs font-medium text-zinc-400 uppercase tracking-wider cursor-pointer hover:text-zinc-300"
              >
                <div className="flex items-center justify-end gap-2">
                  Change
                  <SortIcon field="change" />
                </div>
              </th>
              <th
                onClick={() => handleSort('changePercent')}
                className="px-6 py-4 text-right text-xs font-medium text-zinc-400 uppercase tracking-wider cursor-pointer hover:text-zinc-300"
              >
                <div className="flex items-center justify-end gap-2">
                  Change %
                  <SortIcon field="changePercent" />
                </div>
              </th>
              <th
                onClick={() => handleSort('shares')}
                className="px-6 py-4 text-right text-xs font-medium text-zinc-400 uppercase tracking-wider cursor-pointer hover:text-zinc-300"
              >
                <div className="flex items-center justify-end gap-2">
                  Shares
                  <SortIcon field="shares" />
                </div>
              </th>
              <th
                onClick={() => handleSort('marketValue')}
                className="px-6 py-4 text-right text-xs font-medium text-zinc-400 uppercase tracking-wider cursor-pointer hover:text-zinc-300"
              >
                <div className="flex items-center justify-end gap-2">
                  Market Value
                  <SortIcon field="marketValue" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {sortedPositions.map((position) => (
              <tr
                key={position.symbol}
                className="hover:bg-zinc-800/50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-bold text-white">{position.symbol}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-zinc-300">
                  {formatCurrency(position.price)}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${position.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {position.change >= 0 ? '+' : ''}{formatNumber(position.change)}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${position.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {position.changePercent >= 0 ? '+' : ''}{formatNumber(position.changePercent)}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-zinc-300">
                  {formatNumber(position.shares)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-white">
                  {formatCurrency(position.marketValue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
