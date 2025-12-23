
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

export interface Trade {
  id: string;
  ticker: string;
  type: TradeType;
  strikePrice: number;
  premium: number; // Net premium collected per share (e.g. 1.50)
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
  averagePrice: number; // Original assignment strike
  totalPremiumCollected: number;
  currentCostBasis: number; // (AvgPrice * Shares - TotalPremium) / Shares
}

export interface DashboardStats {
  totalProfit: number;
  winRate: number;
  activePositions: number;
  totalPremiums: number;
}
