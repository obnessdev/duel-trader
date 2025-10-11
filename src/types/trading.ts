export type Direction = 'CALL' | 'PUT';

export type DuelStatus = 'waiting' | 'active' | 'completed';

export interface Trade {
  id: string;
  asset: string;
  timeframe: number;
  direction: Direction;
  amount: number;
  fee: number;
  entryPrice: number;
  exitPrice?: number;
  startTime: number;
  endTime?: number;
  status: DuelStatus;
  result?: 'win' | 'loss';
  profit?: number;
}

export interface Asset {
  symbol: string;
  name: string;
  icon: string;
}

export interface PriceData {
  price: number;
  timestamp: number;
  change24h: number;
}
