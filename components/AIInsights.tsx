
import React, { useState, useEffect } from 'react';
import { Trade } from '../types';
import { analyzeTrades } from '../services/geminiService';

interface AIInsightsProps {
  trades: Trade[];
}

const AIInsights: React.FC<AIInsightsProps> = ({ trades }) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const getAnalysis = async () => {
    setLoading(true);
    const result = await analyzeTrades(trades);
    setAnalysis(result);
    setLoading(false);
  };

  useEffect(() => {
    if (trades.length > 0 && !analysis) {
      getAnalysis();
    }
  }, [trades]);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/30 rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 text-indigo-500/20 text-6xl">🤖</div>
        <h3 className="text-2xl font-bold mb-2 flex items-center gap-3">
          WheelWise AI Advisor
        </h3>
        <p className="text-slate-400 text-sm mb-6">
          Personalized strategy review based on your trading patterns and outcomes.
        </p>

        <div className="min-h-[200px] flex flex-col justify-center">
          {loading ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-12">
              <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-400 animate-pulse">Scanning portfolio history...</p>
            </div>
          ) : (
            <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed space-y-4">
              {analysis.split('\n').map((line, i) => (
                <p key={i} className={line.startsWith('-') ? 'ml-4 list-item list-disc' : ''}>
                  {line.replace(/^- /, '')}
                </p>
              ))}
              <button 
                onClick={getAnalysis}
                className="mt-6 text-indigo-400 hover:text-indigo-300 text-sm font-bold underline decoration-indigo-500/50 underline-offset-4"
              >
                Refresh Analysis
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <h4 className="font-bold mb-4 text-emerald-400">Strategy Focus</h4>
          <p className="text-sm text-slate-400 leading-relaxed">
            The AI currently sees you focusing on high-beta tickers. Consider diversifying with some defensive Dividend stocks to balance your assignment risks.
          </p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <h4 className="font-bold mb-4 text-amber-400">Risk Warning</h4>
          <p className="text-sm text-slate-400 leading-relaxed">
            Concentration in a single sector (Tech) is over 70%. If the sector rotates, your cost basis reduction might not keep up with price declines.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;
