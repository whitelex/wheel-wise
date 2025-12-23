
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TradeLog from './components/TradeLog';
import PortfolioView from './components/PortfolioView';
import AIInsights from './components/AIInsights';
import Auth from './components/Auth';
import { Trade, TradeStatus, TradeType, User } from './types';
import { mockDbService } from './services/dbService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  // Persistence check
  useEffect(() => {
    const savedSession = localStorage.getItem('wheelwise_session');
    if (savedSession) {
      setUser(JSON.parse(savedSession));
    }
    setLoading(false);
  }, []);

  // Fetch data when user is logged in
  useEffect(() => {
    if (user) {
      const userTrades = mockDbService.getTrades(user.id);
      setTrades(userTrades);
    }
  }, [user]);

  const handleAddTrade = (newTradeData: any) => {
    if (!user) return;
    const newTrade: Trade = {
      ...newTradeData,
      userId: user.id
    };
    mockDbService.addTrade(newTrade);
    setTrades([newTrade, ...trades]);
  };

  const handleUpdateTrade = (id: string, updates: Partial<Trade>) => {
    mockDbService.updateTrade(id, updates);
    setTrades(trades.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const handleLogout = () => {
    localStorage.removeItem('wheelwise_session');
    setUser(null);
    setTrades([]);
  };

  if (loading) return null;

  if (!user) {
    return <Auth onLogin={setUser} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard trades={trades} />;
      case 'trades':
        return <TradeLog trades={trades} onAddTrade={handleAddTrade} onUpdateTrade={handleUpdateTrade} />;
      case 'portfolio':
        return <PortfolioView trades={trades} />;
      case 'ai':
        return <AIInsights trades={trades} />;
      default:
        return <Dashboard trades={trades} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="flex justify-between items-center mb-8 p-4 bg-slate-900/30 border border-slate-800/50 rounded-2xl">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center font-bold text-slate-900">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-sm font-bold">Welcome back, {user.name}</h3>
            <p className="text-[10px] text-slate-500">{user.email}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="text-xs font-semibold text-slate-500 hover:text-rose-400 transition-colors bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800"
        >
          Logout
        </button>
      </div>
      {renderContent()}
    </Layout>
  );
};

export default App;
