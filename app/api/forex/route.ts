import { NextResponse } from 'next/server';
import { ForexRate, HistoricalRate } from '@/lib/types';

// Cache durations in seconds
const CURRENT_RATE_CACHE_SECONDS = 300; // 5 minutes - for active trading
const HISTORICAL_RATE_CACHE_SECONDS = 3600; // 1 hour - historical data changes less frequently

// Mock fallback data
const MOCK_RATE = 860.00;
const MOCK_CHANGE = -2.50;

/**
 * Fetch current USD/CLP rate from free API
 */
async function fetchCurrentRate(): Promise<ForexRate | null> {
  try {
    // Try ExchangeRate-API first
    const response = await fetch('https://open.er-api.com/v6/latest/USD', {
      next: { revalidate: CURRENT_RATE_CACHE_SECONDS },
    });

    if (!response.ok) throw new Error('ExchangeRate-API failed');

    const data = await response.json();
    const clpRate = data.rates?.CLP;

    if (!clpRate) throw new Error('CLP rate not found');

    // Since this API doesn't provide intraday data, we'll estimate changes
    return {
      pair: 'USD/CLP',
      rate: clpRate,
      change: 0,
      changePercent: 0,
      high: clpRate * 1.005,
      low: clpRate * 0.995,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching from ExchangeRate-API:', error);
    
    try {
      // Fallback to frankfurter.app
      const response = await fetch('https://api.frankfurter.app/latest?from=USD&to=CLP', {
        next: { revalidate: CURRENT_RATE_CACHE_SECONDS },
      });

      if (!response.ok) throw new Error('Frankfurter API failed');

      const data = await response.json();
      const clpRate = data.rates?.CLP;

      if (!clpRate) throw new Error('CLP rate not found in Frankfurter');

      return {
        pair: 'USD/CLP',
        rate: clpRate,
        change: 0,
        changePercent: 0,
        high: clpRate * 1.005,
        low: clpRate * 0.995,
        timestamp: new Date().toISOString(),
      };
    } catch (fallbackError) {
      console.error('Error fetching from Frankfurter:', fallbackError);
      return null;
    }
  }
}

/**
 * Fetch historical USD/CLP rates (last 90 days)
 */
async function fetchHistoricalRates(): Promise<HistoricalRate[]> {
  try {
    // Calculate date range (90 days ago to today)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 90);

    const startStr = startDate.toISOString().split('T')[0];
    const endStr = endDate.toISOString().split('T')[0];

    const url = `https://api.frankfurter.app/${startStr}..${endStr}?from=USD&to=CLP`;
    const response = await fetch(url, {
      next: { revalidate: HISTORICAL_RATE_CACHE_SECONDS }, // Cache for 1 hour
    });

    if (!response.ok) throw new Error('Historical data fetch failed');

    const data = await response.json();
    const rates: HistoricalRate[] = [];

    if (data.rates) {
      for (const [date, rateData] of Object.entries(data.rates)) {
        const clpRate = (rateData as { CLP?: number }).CLP;
        if (clpRate) {
          rates.push({
            date,
            rate: clpRate,
          });
        }
      }
    }

    // Sort by date ascending
    rates.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return rates;
  } catch (error) {
    console.error('Error fetching historical rates:', error);
    
    // Return mock historical data
    const mockData: HistoricalRate[] = [];
    const today = new Date();
    
    for (let i = 90; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Generate somewhat realistic mock data with variation
      const baseRate = MOCK_RATE;
      const variation = Math.sin(i / 10) * 15 + (Math.random() - 0.5) * 10;
      const rate = baseRate + variation;
      
      mockData.push({
        date: dateStr,
        rate: parseFloat(rate.toFixed(2)),
      });
    }
    
    return mockData;
  }
}

/**
 * Calculate daily change from historical data
 */
function calculateDailyChange(currentRate: number, historicalRates: HistoricalRate[]): { change: number; changePercent: number; high: number; low: number } {
  if (historicalRates.length < 2) {
    return {
      change: 0,
      changePercent: 0,
      high: currentRate * 1.005,
      low: currentRate * 0.995,
    };
  }

  // Get yesterday's rate
  const yesterdayRate = historicalRates[historicalRates.length - 2]?.rate || currentRate;
  const change = currentRate - yesterdayRate;
  const changePercent = (change / yesterdayRate) * 100;

  // Calculate high/low from recent data (last 5 days)
  const recentRates = historicalRates.slice(-5).map(h => h.rate);
  const high = Math.max(...recentRates, currentRate);
  const low = Math.min(...recentRates, currentRate);

  return {
    change: parseFloat(change.toFixed(2)),
    changePercent: parseFloat(changePercent.toFixed(2)),
    high: parseFloat(high.toFixed(2)),
    low: parseFloat(low.toFixed(2)),
  };
}

export async function GET() {
  try {
    // Fetch both current and historical data
    const [currentRateData, historicalRates] = await Promise.all([
      fetchCurrentRate(),
      fetchHistoricalRates(),
    ]);

    // Use mock data if API failed
    let currentRate: ForexRate;
    
    if (!currentRateData) {
      // Use the latest historical rate or mock
      const latestHistorical = historicalRates[historicalRates.length - 1];
      const rate = latestHistorical?.rate || MOCK_RATE;
      
      const { change, changePercent, high, low } = calculateDailyChange(rate, historicalRates);
      
      currentRate = {
        pair: 'USD/CLP',
        rate,
        change,
        changePercent,
        high,
        low,
        timestamp: new Date().toISOString(),
      };
    } else {
      // Enhance current rate with calculated changes from historical data
      const { change, changePercent, high, low } = calculateDailyChange(currentRateData.rate, historicalRates);
      currentRate = {
        ...currentRateData,
        change,
        changePercent,
        high,
        low,
      };
    }

    return NextResponse.json({
      current: currentRate,
      historical: historicalRates,
    });
  } catch (error) {
    console.error('Error in forex API route:', error);
    
    // Return mock data on complete failure
    const mockHistorical: HistoricalRate[] = [];
    const today = new Date();
    
    for (let i = 90; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const variation = Math.sin(i / 10) * 15 + (Math.random() - 0.5) * 10;
      mockHistorical.push({
        date: dateStr,
        rate: parseFloat((MOCK_RATE + variation).toFixed(2)),
      });
    }

    return NextResponse.json({
      current: {
        pair: 'USD/CLP',
        rate: MOCK_RATE,
        change: MOCK_CHANGE,
        changePercent: (MOCK_CHANGE / MOCK_RATE) * 100,
        high: MOCK_RATE + 5,
        low: MOCK_RATE - 5,
        timestamp: new Date().toISOString(),
      },
      historical: mockHistorical,
    });
  }
}
