
import { Trade, User } from "../types";

/**
 * Note: These calls point to /api endpoints which would be hosted as 
 * Vercel Serverless Functions using the MONGODB_URI environment variable.
 */

export const dbService = {
  // Authentication
  login: async (email: string, password: string): Promise<{user: User, token: string}> => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Invalid credentials');
    return response.json();
  },

  register: async (name: string, email: string, password: string): Promise<User> => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Registration failed');
    return response.json();
  },

  // Trades
  fetchTrades: async (userId: string): Promise<Trade[]> => {
    const response = await fetch(`/api/trades?userId=${userId}`);
    if (!response.ok) return [];
    return response.json();
  },

  saveTrade: async (trade: Trade): Promise<Trade> => {
    const response = await fetch('/api/trades', {
      method: 'POST',
      body: JSON.stringify(trade),
      headers: { 'Content-Type': 'application/json' }
    });
    return response.json();
  },

  updateTrade: async (id: string, updates: Partial<Trade>): Promise<Trade> => {
    const response = await fetch(`/api/trades/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
      headers: { 'Content-Type': 'application/json' }
    });
    return response.json();
  }
};

// Simulated Local Version for Demo/Preview if API isn't ready
export const mockDbService = {
  getTrades: (userId: string): Trade[] => {
    const all = JSON.parse(localStorage.getItem('wheelwise_trades') || '[]');
    return all.filter((t: Trade) => t.userId === userId);
  },
  addTrade: (trade: Trade) => {
    const all = JSON.parse(localStorage.getItem('wheelwise_trades') || '[]');
    all.push(trade);
    localStorage.setItem('wheelwise_trades', JSON.stringify(all));
  },
  updateTrade: (id: string, updates: Partial<Trade>) => {
    const all = JSON.parse(localStorage.getItem('wheelwise_trades') || '[]');
    const updated = all.map((t: Trade) => t.id === id ? { ...t, ...updates } : t);
    localStorage.setItem('wheelwise_trades', JSON.stringify(updated));
  }
};
