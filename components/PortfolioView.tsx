
import React, { useMemo } from 'react';
import { Trade, TradeStatus, TradeType, PortfolioPosition } from '../types';

interface PortfolioProps {
  trades: Trade[];
}

const PortfolioView: React.FC<PortfolioProps> = ({ trades }) => {
  const positions = useMemo<PortfolioPosition[]>(() => {
    const portfolioMap: Record<string, { shares: number; totalCost: number; premiums: number }> = {};

    trades.forEach(t => {
      if (!portfolioMap[t.ticker]) {
        portfolioMap[t.ticker] = { shares: 0, totalCost: 0, premiums: 0 };
      }

      // Collect all premiums ever made for this ticker
      portfolioMap[t.ticker].premiums += t.premium * t.contracts * 100;

      // Track assignments (Buying shares)
      if (t.status === TradeStatus.ASSIGNED && t.type === TradeType.CSP) {
        portfolioMap[t.ticker].shares += t.contracts * 100;
        portfolioMap[t.ticker].totalCost += t.strikePrice * t.contracts * 100;
      }

      // Track Call Away (Selling shares)
      if (t.status === TradeStatus.ASSIGNED && t.type === TradeType.CC) {
        portfolioMap[t.ticker].shares -= t.contracts * 100;
        // Logic: if all shares sold, reset cost or proportional reduce?
        // Simplicity: if shares go to 0, cost goes to 0
        if (portfolioMap[t.ticker].shares <= 0) {
          portfolioMap[t.ticker].shares = 0;
          portfolioMap[t.ticker].totalCost = 0;
        }
      }
    });

    return Object.entries(portfolioMap)
      .filter(([_, data]) => data.shares > 0)
      .map(([ticker, data]) => ({
        ticker,
        shares: data.shares,
        averagePrice: data.totalCost / data.shares,
        totalPremiumCollected: data.premiums,
        currentCostBasis: (data.totalCost - data.premiums) / data.shares
      }));
  }, [trades]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Assigned Positions</h3>
        <p className="text-sm text-slate-500 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
          Tracking {positions.length} active stock holdings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {positions.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-800 rounded-3xl">
            <p className="text-slate-500">No stocks currently assigned. Log a CSP as 'Assigned' to see it here.</p>
          </div>
        )}
        {positions.map((pos) => (
          <div key={pos.ticker} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-emerald-500/10 transition-all"></div>
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <h4 className="text-2xl font-black text-emerald-400">{pos.ticker}</h4>
                <p className="text-xs text-slate-500 font-bold uppercase">{pos.shares} Shares Owned</p>
              </div>
              <div className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold">
                In Wheel
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Assignment Price</span>
                <span className="font-mono">${pos.averagePrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Premiums Collected</span>
                <span className="font-mono text-emerald-400">+${pos.totalPremiumCollected.toLocaleString()}</span>
              </div>
              <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Break-Even / Cost Basis</span>
                <span className="text-xl font-bold text-white font-mono">${pos.currentCostBasis.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-xs py-2 rounded-xl transition-colors font-medium">
                Sell Covered Call
              </button>
              <button className="px-3 bg-slate-800 hover:bg-slate-700 rounded-xl">
                ⚙️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioView;
