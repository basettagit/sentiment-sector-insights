
import { toast } from "sonner";
import { sectorData } from "@/data/sectorData";

// Mock data to use as fallback when API fails
const MOCK_STOCK_DATA = {
  XLK: { price: 187.45, changePercent: 0.75, volatility: 1.2 },
  XLV: { price: 142.31, changePercent: -0.32, volatility: 0.8 },
  XLF: { price: 39.87, changePercent: 1.05, volatility: 1.5 },
  XLP: { price: 76.23, changePercent: 0.21, volatility: 0.5 },
  XLE: { price: 92.68, changePercent: -1.25, volatility: 2.1 },
  XLU: { price: 68.45, changePercent: 0.43, volatility: 0.7 }
};

// Mock historical data for fallback
const generateMockHistoricalData = (baseTicker: string, months: number = 24) => {
  const data = [];
  const baseDate = new Date();
  baseDate.setDate(1); // First day of current month
  
  // Generate data for the last X months
  for (let i = 0; i < months; i++) {
    const date = new Date(baseDate);
    date.setMonth(baseDate.getMonth() - i);
    
    // Generate some random but somewhat realistic values
    const randomFactor = Math.sin(i * 0.5) * 0.1 + 0.05;
    const baseValue = baseTicker === 'SPY' ? 400 + (i * -2) : 100 + (i * -1);
    const value = baseValue * (1 + randomFactor);
    
    data.unshift({
      date: `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`,
      value: parseFloat(value.toFixed(2))
    });
  }
  
  return data;
};

const RAPIDAPI_KEY = "e0c04b5ebcmshe468badcae64c5cp1112acjsn019d4b851b5d";
const RAPIDAPI_HOST = "yh-finance.p.rapidapi.com";

export interface StockData {
  symbol: string;
  price: number;
  changePercent: number;
  volume?: number;
  dayHigh?: number;
  dayLow?: number;
  volatility?: number;
}

/**
 * Fetches stock data for multiple symbols from Yahoo Finance API with fallback
 */
export const fetchStockData = async (symbols: string[]): Promise<Record<string, StockData>> => {
  try {
    const url = `https://yh-finance.p.rapidapi.com/market/v2/get-quotes?region=US&symbols=${symbols.join(',')}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST
      }
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data?.quoteResponse?.result) {
      throw new Error("No data received from API");
    }
    
    const stockData: Record<string, StockData> = {};
    
    data.quoteResponse.result.forEach((quote: any) => {
      // Calculate approximate volatility using high-low range
      const dailyVolatility = quote.regularMarketDayHigh && quote.regularMarketDayLow ? 
        ((quote.regularMarketDayHigh - quote.regularMarketDayLow) / quote.regularMarketPrice * 100) : 
        undefined;
      
      stockData[quote.symbol] = {
        symbol: quote.symbol,
        price: quote.regularMarketPrice,
        changePercent: quote.regularMarketChangePercent,
        volume: quote.regularMarketVolume,
        dayHigh: quote.regularMarketDayHigh,
        dayLow: quote.regularMarketDayLow,
        volatility: dailyVolatility
      };
    });
    
    return stockData;
  } catch (error) {
    console.error("Error fetching stock data:", error);
    
    // Return mock data as fallback
    const fallbackData: Record<string, StockData> = {};
    symbols.forEach(symbol => {
      const mockData = MOCK_STOCK_DATA[symbol as keyof typeof MOCK_STOCK_DATA] || 
        { price: 100, changePercent: 0, volatility: 1 };
      
      fallbackData[symbol] = {
        symbol,
        price: mockData.price,
        changePercent: mockData.changePercent,
        volatility: mockData.volatility
      };
    });
    
    toast.error("Usando dati di fallback - API non disponibile");
    return fallbackData;
  }
};

/**
 * Fetches historical data for a symbol with fallback
 */
export const fetchHistoricalData = async (
  symbol: string, 
  interval: string = "1mo", 
  range: string = "2y"
): Promise<{ date: string; value: number }[]> => {
  try {
    const url = `https://yh-finance.p.rapidapi.com/stock/v3/get-chart?interval=${interval}&symbol=${symbol}&range=${range}&includePrePost=false&useYfid=true&includeAdjustedClose=true&events=capitalGain%2Cdiv%2Csplit`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST
      }
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data?.chart?.result?.[0]?.timestamp || !data?.chart?.result?.[0]?.indicators?.quote?.[0]?.close) {
      throw new Error("Invalid historical data format");
    }
    
    const timestamps = data.chart.result[0].timestamp;
    const closePrices = data.chart.result[0].indicators.quote[0].close;
    
    // Convert timestamps to dates and pair with close prices
    const historicalData = timestamps.map((timestamp: number, index: number) => {
      const date = new Date(timestamp * 1000);
      return {
        date: `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`,
        value: closePrices[index] || null
      };
    }).filter((item: { date: string, value: number | null }) => item.value !== null);
    
    return historicalData;
  } catch (error) {
    console.error("Error fetching historical data:", error);
    
    // Return mock data as fallback
    toast.warning(`Usando dati di fallback per ${symbol}`);
    return generateMockHistoricalData(symbol);
  }
};

/**
 * Fetch Consumer Confidence Index (CCI) with fallback
 */
export const fetchConsumerConfidenceIndex = async (): Promise<{ date: string; cci: number }[]> => {
  try {
    // Use S&P 500 index as a proxy for sentiment
    const spyData = await fetchHistoricalData("SPY", "1mo", "2y");
    
    if (!spyData.length) {
      throw new Error("No historical data available");
    }
    
    // Transform S&P data into CCI format with some normalization
    const cciData = spyData.map(item => {
      // Scale SPY value to typical CCI range (around 100 with variations)
      const cciValue = item.value ? 100 + ((item.value - 400) / 10) : 100;
      
      return {
        date: item.date,
        cci: parseFloat(cciValue.toFixed(1))
      };
    });
    
    return cciData;
  } catch (error) {
    console.error("Error fetching CCI data:", error);
    
    // Return mock CCI data as fallback
    toast.warning("Usando dati di sentimento di fallback");
    
    const mockSPYData = generateMockHistoricalData("SPY");
    return mockSPYData.map(item => ({
      date: item.date,
      cci: 100 + ((item.value - 400) / 10)
    }));
  }
};
