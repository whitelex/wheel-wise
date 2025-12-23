
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TradeLog from './components/TradeLog';
import PortfolioView from './components/PortfolioView';
import AIInsights from './components/AIInsights';
import { Trade, TradeStatus, TradeType } from './types';

// Initial dummy data for better UI demonstration
const INITIAL_TRADES: Trade[] = [
  {
    id: '1',
    ticker: 'AAPL',
    type: TradeType.CSP,
    strikePrice: 185,
    premium: 2.15,
    contracts: 2,
    entryDate: '2024-03-01',
    expiryDate: '2024-03-15',
    status: TradeStatus.CLOSED,
    closingPrice: 0.10
  },
  {
    id: '2',
    ticker: 'NVDA',
    type: TradeType.CSP,
    strikePrice: 850,
    premium: 15.50,
    contracts: 1,
    entryDate: '2024-03-05',
    expiryDate: '2024-03-12',
    status: TradeStatus.ASSIGNED,
  },
  {
    id: '3',
    ticker: 'NVDA',
    type: TradeType.CC,
    strikePrice: 870,
    premium: 8.40,
    contracts: 1,
    entryDate: '2024-03-13',
    expiryDate: '2024-03-20',
    status: TradeStatus.OPEN,
  }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [trades, setTrades] = useState<Trade[]>(() => {
    const saved = localStorage.getItem('wheelwise_trades');
    return saved ? JSON.parse(saved) : INITIAL_TRADES;
  });

  useEffect(() => {
    localStorage.setItem('wheelwise_trades', JSON.stringify(trades));
  }, [trades]);

  const handleAddTrade = (newTrade: Trade) => {
    setTrades([newTrade, ...trades]);
  };

  const handleUpdateTrade = (id: string, updates: Partial<Trade>) => {
    setTrades(trades.map(t => t.id === id ? { ...t, ...updates } : t));
  };

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
      {renderContent()}
    </Layout>
  );
};

export default App;
