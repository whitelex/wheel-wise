
import { GoogleGenAI, Type } from "@google/genai";
import { Trade } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeTrades = async (trades: Trade[]) => {
  if (trades.length === 0) return "Add some trades to get AI analysis.";

  const tradeSummary = trades.map(t => 
    `${t.ticker}: ${t.type} @ $${t.strikePrice}, Premium: $${t.premium}, Status: ${t.status}`
  ).join('\n');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze the following options wheel strategy trades and provide 3-4 actionable insights or observations about the user's performance and strategy. Keep it professional and concise.\n\n${tradeSummary}`,
      config: {
        temperature: 0.7,
      }
    });
    return response.text || "Unable to generate analysis at this time.";
  } catch (error) {
    console.error("Gemini analysis error:", error);
    return "Error connecting to AI advisor. Please check your API key configuration.";
  }
};

export const getTickerInsight = async (ticker: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a quick summary of the current market sentiment and key price levels for the stock ticker: ${ticker}. Is it typically a good candidate for the Wheel Strategy (low/medium volatility)?`,
      config: {
        temperature: 0.5,
      }
    });
    return response.text || "No insights available.";
  } catch (error) {
    return "Failed to fetch ticker insights.";
  }
};
