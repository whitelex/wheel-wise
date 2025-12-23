
export enum TradeType {
  CSP = 'Cash Secured Put',
  CC = 'Covered Call',
  STOCK_ADJUSTMENT = 'Stock Adjustment'
}

export enum TradeStatus {
  OPEN = 'Open',
  CLOSED = 'Closed',
  ASSIGNED = 'Assigned',
  EXPIRED = 'Expired',
  ROLLED = 'Rolled'
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Trade {
  id: string;
  userId: string;
  ticker: string;
  type: TradeType;
  strikePrice: number;
  premium: number;
  contracts: number;
  expiryDate: string;
  entryDate: string;
  status: TradeStatus;
  notes?: string;
  closingPrice?: number;
}

export interface PortfolioPosition {
  ticker: string;
  shares: number;
  averagePrice: number;
  totalPremiumCollected: number;
  currentCostBasis: number;
}

export interface DashboardStats {
  totalProfit: number;
  winRate: number;
  activePositions: number;
  totalPremiums: number;
}
