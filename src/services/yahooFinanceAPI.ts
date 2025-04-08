
import { toast } from "sonner";

const RAPIDAPI_KEY = "e0c04b5ebcmshe468badcae64c5cp1112acjsn019d4b851b5d";
const RAPIDAPI_HOST = "yh-finance.p.rapidapi.com";

interface QuoteResponse {
  symbol: string;
  regularMarketPrice: number;
  regularMarketChangePercent: number;
  regularMarketVolume: number;
  regularMarketDayHigh: number;
  regularMarketDayLow: number;
  fiftyDayAverage?: number;
  twoHundredDayAverage?: number;
}

export interface StockData {
  symbol: string;
  price: number;
  changePercent: number;
  volume: number;
  dayHigh: number;
  dayLow: number;
  volatility?: number;
}

/**
 * Fetches stock data for multiple symbols from Yahoo Finance API
 * @param symbols Array of stock symbols to fetch
 * @returns Promise with stock data
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
    
    data.quoteResponse.result.forEach((quote: QuoteResponse) => {
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
    toast.error("Errore nel recupero dei dati finanziari");
    return {};
  }
};

/**
 * Fetches historical data for a symbol
 * @param symbol Stock symbol to fetch history for
 * @param interval Data interval (1d, 1wk, 1mo)
 * @param range Time range (1mo, 3mo, 6mo, 1y, 2y, 5y)
 * @returns Promise with historical data
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
    toast.error("Errore nel recupero dei dati storici");
    return [];
  }
};

/**
 * Fetch Consumer Confidence Index (CCI) from FRED API via RapidAPI
 * Note: This is a simplified mock as the actual CCI data might require a different API
 * @returns Promise with CCI data
 */
export const fetchConsumerConfidenceIndex = async (): Promise<{ date: string; cci: number }[]> => {
  // Since Yahoo Finance doesn't provide CCI data directly, we'll use the mock data for now
  // In a real app, you'd integrate with another data source like FRED API
  
  try {
    // Mock CCI with S&P 500 index as a proxy for sentiment
    const spyData = await fetchHistoricalData("SPY", "1mo", "2y");
    
    // Transform S&P data into CCI format with some normalization to mimic CCI range
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
    toast.error("Errore nel recupero dell'Indice di Fiducia dei Consumatori");
    
    // Return empty array if there's an error
    return [];
  }
};
