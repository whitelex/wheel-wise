
import React, { useMemo } from 'react';
import { Trade, TradeStatus, DashboardStats } from '../types';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

interface DashboardProps {
  trades: Trade[];
}

const Dashboard: React.FC<DashboardProps> = ({ trades }) => {
  const stats = useMemo<DashboardStats>(() => {
    const closedTrades = trades.filter(t => t.status === TradeStatus.CLOSED || t.status === TradeStatus.EXPIRED);
    const winCount = closedTrades.filter(t => {
      if (t.status === TradeStatus.EXPIRED) return true;
      if (t.closingPrice !== undefined) return t.premium > t.closingPrice;
      return false;
    }).length;

    const totalPremiums = trades.reduce((acc, t) => acc + (t.premium * t.contracts * 100), 0);
    const totalProfit = trades.reduce((acc, t) => {
      if (t.status === TradeStatus.CLOSED && t.closingPrice !== undefined) {
        return acc + (t.premium - t.closingPrice) * t.contracts * 100;
      }
      if (t.status === TradeStatus.EXPIRED) {
        return acc + t.premium * t.contracts * 100;
      }
      return acc;
    }, 0);

    return {
      totalProfit,
      winRate: closedTrades.length > 0 ? (winCount / closedTrades.length) * 100 : 0,
      activePositions: trades.filter(t => t.status === TradeStatus.OPEN).length,
      totalPremiums
    };
  }, [trades]);

  const chartData = useMemo(() => {
    // Basic aggregation by entry date
    const sortedTrades = [...trades].sort((a, b) => new Date(a.entryDate).getTime() - new Date(b.entryDate).getTime());
    let runningProfit = 0;
    return sortedTrades.map(t => {
      let tradeProfit = 0;
      if (t.status === TradeStatus.CLOSED && t.closingPrice !== undefined) {
        tradeProfit = (t.premium - t.closingPrice) * t.contracts * 100;
      } else if (t.status === TradeStatus.EXPIRED) {
        tradeProfit = t.premium * t.contracts * 100;
      }
      runningProfit += tradeProfit;
      return {
        date: new Date(t.entryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        profit: runningProfit
      };
    });
  }, [trades]);

  const tickerPerformance = useMemo(() => {
    const performance: Record<string, number> = {};
    trades.forEach(t => {
      let profit = 0;
      if (t.status === TradeStatus.CLOSED && t.closingPrice !== undefined) {
        profit = (t.premium - t.closingPrice) * t.contracts * 100;
      } else if (t.status === TradeStatus.EXPIRED) {
        profit = t.premium * t.contracts * 100;
      }
      performance[t.ticker] = (performance[t.ticker] || 0) + profit;
    });
    return Object.entries(performance)
      .map(([ticker, profit]) => ({ ticker, profit }))
      .sort((a, b) => b.profit - a.profit);
  }, [trades]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total P/L" value={`$${stats.totalProfit.toLocaleString()}`} color="emerald" icon="💰" />
        <StatCard title="Total Premium" value={`$${stats.totalPremiums.toLocaleString()}`} color="blue" icon="💎" />
        <StatCard title="Win Rate" value={`${stats.winRate.toFixed(1)}%`} color="amber" icon="📈" />
        <StatCard title="Open Trades" value={stats.activePositions.toString()} color="purple" icon="📂" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profit Curve */}
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <span className="text-emerald-400">●</span> Cumulative Profit
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Area type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Tickers */}
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <span className="text-blue-400">●</span> Top Performing Tickers
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tickerPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="ticker" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip 
                  cursor={{ fill: '#1e293b', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                />
                <Bar dataKey="profit" radius={[4, 4, 0, 0]}>
                  {tickerPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.profit >= 0 ? '#10b981' : '#f43f5e'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string; color: string; icon: string }> = ({ title, value, color, icon }) => {
  const colorClasses: Record<string, string> = {
    emerald: 'text-emerald-400 bg-emerald-400/10 border-emerald-500/20',
    blue: 'text-blue-400 bg-blue-400/10 border-blue-500/20',
    amber: 'text-amber-400 bg-amber-400/10 border-amber-500/20',
    purple: 'text-purple-400 bg-purple-400/10 border-purple-500/20',
  };

  return (
    <div className={`p-6 rounded-3xl border ${colorClasses[color]} flex items-center justify-between`}>
      <div>
        <p className="text-xs uppercase tracking-wider text-slate-400 font-medium mb-1">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div className="text-3xl opacity-80">{icon}</div>
    </div>
  );
};

export default Dashboard;
