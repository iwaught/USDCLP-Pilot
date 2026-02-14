import { Position } from './types';

export function parseCSV(content: string): Position[] {
  const lines = content.trim().split('\n');
  
  if (lines.length < 2) {
    throw new Error('CSV file must contain a header row and at least one data row');
  }

  // Skip header row
  const dataLines = lines.slice(1);
  
  const positions: Position[] = [];

  for (let i = 0; i < dataLines.length; i++) {
    const line = dataLines[i].trim();
    if (!line) continue;

    // Split by tab (TSV format)
    const columns = line.split('\t');
    
    if (columns.length < 5) {
      console.warn(`Skipping line ${i + 2}: insufficient columns`);
      continue;
    }

    const [symbol, priceStr, changeStr, changePercentStr, sharesStr] = columns;

    try {
      const price = parseFloat(priceStr);
      const change = parseFloat(changeStr);
      // Remove % sign from changePercent before parsing
      const changePercent = parseFloat(changePercentStr.replace('%', ''));
      const shares = parseFloat(sharesStr);

      if (isNaN(price) || isNaN(change) || isNaN(changePercent) || isNaN(shares)) {
        console.warn(`Skipping line ${i + 2}: invalid number format`);
        continue;
      }

      const marketValue = price * shares;

      positions.push({
        symbol: symbol.trim(),
        price,
        change,
        changePercent,
        shares,
        marketValue,
      });
    } catch (error) {
      console.warn(`Skipping line ${i + 2}: ${error}`);
    }
  }

  if (positions.length === 0) {
    throw new Error('No valid positions found in CSV file');
  }

  return positions;
}
