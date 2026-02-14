export interface Position {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  shares: number;
  marketValue: number;
}

export type SortField = 'symbol' | 'price' | 'change' | 'changePercent' | 'shares' | 'marketValue';
export type SortDirection = 'asc' | 'desc';
