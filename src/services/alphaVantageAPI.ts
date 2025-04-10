
import { toast } from "sonner";
import { sectorData } from "@/data/sectorData";

// Alpha Vantage API key
const ALPHA_VANTAGE_API_KEY = "298NP5RGYWOAV0EC";

// Mock data to use as fallback when API fails
const MOCK_STOCK_DATA = {
  XLK: { price: 187.45, changePercent: 0.75, volatility: 1.2 },
  XLV: { price: 142.31, changePercent: -0.32, volatility: 0.8 },
  XLF: { price: 39.87, changePercent: 1.05, volatility: 1.5 },
  XLP: { price: 76.23, changePercent: 0.21, volatility: 0.5 },
  XLE: { price: 92.68, changePercent: -1.25, volatility: 2.1 },
  XLU: { price: 68.45, changePercent: 0.43, volatility: 0.7 }
};

// Cache implementation to avoid hitting API rate limits
interface CacheItem<T> {
  data: T;
  timestamp: number;
}

const cache: Record<string, CacheItem<any>> = {};

// Cache duration in milliseconds (10 minutes)
const CACHE_DURATION = 10 * 60 * 1000;

function getFromCache<T>(key: string): T | null {
  const item = cache[key];
  if (item && Date.now() - item.timestamp < CACHE_DURATION) {
    console.log(`Using cached data for ${key}`);
    return item.data;
  }
  return null;
}

function setCache<T>(key: string, data: T): void {
  cache[key] = {
    data,
    timestamp: Date.now()
  };
}

// Generate mock historical data for fallback
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
 * Fetches stock data for multiple symbols from Alpha Vantage API with fallback
 */
export const fetchStockData = async (symbols: string[]): Promise<Record<string, StockData>> => {
  // Check if we have all symbols in cache
  const cacheKey = `stockData_${symbols.join('_')}`;
  const cachedData = getFromCache<Record<string, StockData>>(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  const stockData: Record<string, StockData> = {};
  const promises: Promise<void>[] = [];

  // Alpha Vantage has a limit of 5 API calls per minute
  // Process only first 5 symbols to avoid rate limiting
  const limitedSymbols = symbols.slice(0, 5);

  try {
    // Fetch data for each symbol separately (Alpha Vantage doesn't support batch requests)
    for (const symbol of limitedSymbols) {
      const promise = fetchSingleStockData(symbol)
        .then(data => {
          if (data) {
            stockData[symbol] = data;
          }
        })
        .catch(error => {
          console.error(`Error fetching data for ${symbol}:`, error);
          // Use fallback data for this symbol
          stockData[symbol] = createFallbackData(symbol);
        });
      
      promises.push(promise);
    }

    // For any symbols beyond the limit, use fallback data
    symbols.slice(5).forEach(symbol => {
      stockData[symbol] = createFallbackData(symbol);
    });

    // Wait for all the promises to resolve
    await Promise.all(promises);
    
    // If we didn't get any real data, show a message
    if (Object.keys(stockData).length === 0) {
      throw new Error("No data received from API");
    }

    // Cache the results
    setCache(cacheKey, stockData);
    return stockData;
  } catch (error) {
    console.error("Error fetching stock data:", error);
    
    // Return mock data as fallback
    const fallbackData: Record<string, StockData> = {};
    symbols.forEach(symbol => {
      fallbackData[symbol] = createFallbackData(symbol);
    });
    
    toast.error("Usando dati di fallback - API non disponibile");
    return fallbackData;
  }
};

/**
 * Helper function to fetch data for a single stock
 */
const fetchSingleStockData = async (symbol: string): Promise<StockData | null> => {
  try {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check if we have valid data
    if (data["Global Quote"] && Object.keys(data["Global Quote"]).length > 0) {
      const quote = data["Global Quote"];
      
      // Calculate approximate volatility (or use a default)
      const price = parseFloat(quote["05. price"]);
      const high = parseFloat(quote["03. high"]);
      const low = parseFloat(quote["04. low"]);
      
      const dailyVolatility = high && low ? ((high - low) / price * 100) : 1.0;
      
      // Parse change percent from string like "1.25%"
      const changePercentStr = quote["10. change percent"] || "0.00%";
      const changePercent = parseFloat(changePercentStr.replace('%', ''));
      
      return {
        symbol,
        price,
        changePercent,
        volume: parseFloat(quote["06. volume"]),
        dayHigh: high,
        dayLow: low,
        volatility: dailyVolatility
      };
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
    return null;
  }
};

/**
 * Helper function to create fallback data for a symbol
 */
const createFallbackData = (symbol: string): StockData => {
  const mockData = MOCK_STOCK_DATA[symbol as keyof typeof MOCK_STOCK_DATA] || 
    { price: 100, changePercent: 0, volatility: 1 };
  
  return {
    symbol,
    price: mockData.price,
    changePercent: mockData.changePercent,
    volatility: mockData.volatility
  };
};

/**
 * Fetches historical data for a symbol with fallback
 */
export const fetchHistoricalData = async (
  symbol: string, 
  interval: string = "1mo", 
  range: string = "2y"
): Promise<{ date: string; value: number }[]> => {
  // Check cache first
  const cacheKey = `historical_${symbol}_${interval}_${range}`;
  const cachedData = getFromCache<{ date: string; value: number }[]>(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    // Alpha Vantage uses different parameters
    // Convert interval from Yahoo to Alpha Vantage format
    const outputsize = range === "2y" ? "full" : "compact";
    
    let alphaInterval;
    switch (interval) {
      case "1d": alphaInterval = "daily"; break;
      case "1wk": alphaInterval = "weekly"; break;
      case "1mo": 
      default: alphaInterval = "monthly";
    }
    
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_${alphaInterval.toUpperCase()}&symbol=${symbol}&outputsize=${outputsize}&apikey=${ALPHA_VANTAGE_API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check which time series data we have
    const timeSeriesKey = `Time Series (${alphaInterval === "daily" ? "Daily" : alphaInterval === "weekly" ? "Weekly" : "Monthly"})`;
    
    if (!data[timeSeriesKey]) {
      throw new Error("Invalid historical data format");
    }
    
    const timeSeries = data[timeSeriesKey];
    
    // Convert to our required format
    const historicalData = Object.entries(timeSeries)
      .map(([dateStr, values]: [string, any]) => {
        // Format date to YYYY-MM for consistency
        const date = new Date(dateStr);
        const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        
        return {
          date: formattedDate,
          value: parseFloat(values["4. close"])
        };
      })
      .filter(item => !isNaN(item.value))
      .sort((a, b) => a.date.localeCompare(b.date));
    
    // Cache the results
    setCache(cacheKey, historicalData);
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
 * Using Economic Indicators from Alpha Vantage as a proxy
 */
export const fetchConsumerConfidenceIndex = async (): Promise<{ date: string; cci: number }[]> => {
  // Check cache first
  const cacheKey = "cci_data";
  const cachedData = getFromCache<{ date: string; cci: number }[]>(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    // Use Consumer Sentiment index or Retail Sales as a proxy for consumer confidence
    const url = `https://www.alphavantage.co/query?function=RETAIL_SALES&apikey=${ALPHA_VANTAGE_API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.data) {
      throw new Error("Invalid economic data format");
    }
    
    // Extract data points, most recent first
    const cciData = data.data
      .slice(0, 24) // Last 24 months
      .map((item: any) => {
        // Parse date (format: YYYY-MM-DD)
        const dateParts = item.date.split('-');
        const formattedDate = `${dateParts[0]}-${dateParts[1]}`;
        
        // Scale the value to a reasonable CCI range (around 100)
        const value = parseFloat(item.value);
        const normalizedValue = 100 + ((value - 500000) / 10000);
        
        return {
          date: formattedDate,
          cci: parseFloat(normalizedValue.toFixed(1))
        };
      })
      .sort((a: any, b: any) => a.date.localeCompare(b.date));
    
    // Cache the results
    setCache(cacheKey, cciData);
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
