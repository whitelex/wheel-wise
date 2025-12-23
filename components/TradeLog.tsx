
import React, { useState } from 'react';
import { Trade, TradeType, TradeStatus } from '../types';

interface TradeLogProps {
  trades: Trade[];
  onAddTrade: (trade: Trade) => void;
  onUpdateTrade: (id: string, updates: Partial<Trade>) => void;
}

const TradeLog: React.FC<TradeLogProps> = ({ trades, onAddTrade, onUpdateTrade }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Trade>>({
    ticker: '',
    type: TradeType.CSP,
    strikePrice: 0,
    premium: 0,
    contracts: 1,
    entryDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    status: TradeStatus.OPEN,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTrade: Trade = {
      ...(formData as Trade),
      id: Math.random().toString(36).substr(2, 9),
    };
    onAddTrade(newTrade);
    setIsAdding(false);
    setFormData({
      ticker: '',
      type: TradeType.CSP,
      strikePrice: 0,
      premium: 0,
      contracts: 1,
      entryDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
      status: TradeStatus.OPEN,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Transaction History</h3>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2"
        >
          {isAdding ? 'Cancel' : '➕ Log New Trade'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-4 duration-300">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Ticker</label>
            <input
              required
              type="text"
              placeholder="e.g. NVDA"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
              value={formData.ticker}
              onChange={e => setFormData({ ...formData, ticker: e.target.value.toUpperCase() })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Strategy Type</label>
            <select
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value as TradeType })}
            >
              <option value={TradeType.CSP}>Cash Secured Put</option>
              <option value={TradeType.CC}>Covered Call</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Strike Price ($)</label>
            <input
              required
              type="number"
              step="0.01"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
              value={formData.strikePrice || ''}
              onChange={e => setFormData({ ...formData, strikePrice: parseFloat(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Premium Collected (Per Share)</label>
            <input
              required
              type="number"
              step="0.01"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
              value={formData.premium || ''}
              onChange={e => setFormData({ ...formData, premium: parseFloat(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Contracts</label>
            <input
              required
              type="number"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
              value={formData.contracts || 1}
              onChange={e => setFormData({ ...formData, contracts: parseInt(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Expiry Date</label>
            <input
              required
              type="date"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-300"
              value={formData.expiryDate}
              onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
            />
          </div>
          <div className="md:col-span-3">
            <button type="submit" className="w-full bg-emerald-500 text-white font-bold py-3 rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20">
              Confirm Transaction
            </button>
          </div>
        </form>
      )}

      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-slate-900 border-b border-slate-800">
              <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Ticker</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Type</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Strike</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Premium</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Credit</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Expiry</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {trades.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                  No trades logged yet. Start by logging your first option trade.
                </td>
              </tr>
            )}
            {trades.map((trade) => (
              <tr key={trade.id} className="hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4 font-bold text-emerald-400">{trade.ticker}</td>
                <td className="px-6 py-4 text-sm text-slate-300">{trade.type}</td>
                <td className="px-6 py-4 font-mono text-sm">${trade.strikePrice.toFixed(2)}</td>
                <td className="px-6 py-4 font-mono text-sm text-emerald-400">+${trade.premium.toFixed(2)}</td>
                <td className="px-6 py-4 font-mono text-sm font-semibold">${(trade.premium * trade.contracts * 100).toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-slate-400">{trade.expiryDate}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    trade.status === TradeStatus.OPEN ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                    trade.status === TradeStatus.CLOSED ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    trade.status === TradeStatus.EXPIRED ? 'bg-slate-500/10 text-slate-400 border border-slate-500/20' :
                    'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {trade.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    {trade.status === TradeStatus.OPEN && (
                      <>
                        <button 
                          onClick={() => onUpdateTrade(trade.id, { status: TradeStatus.EXPIRED })}
                          className="p-1 hover:text-emerald-400 transition-colors" title="Expired Worthless"
                        >
                          ✅
                        </button>
                        <button 
                          onClick={() => onUpdateTrade(trade.id, { status: TradeStatus.ASSIGNED })}
                          className="p-1 hover:text-amber-400 transition-colors" title="Assigned"
                        >
                          📦
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TradeLog;
