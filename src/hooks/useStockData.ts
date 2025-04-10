import { useQuery } from '@tanstack/react-query';
import { fetchStockData, fetchHistoricalData, fetchConsumerConfidenceIndex, StockData } from '../services/alphaVantageAPI';
import { sectorData } from '@/data/sectorData';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export function useStockData() {
  // Get all sector tickers that we need to fetch
  const sectorTickers = Array.isArray(sectorData) 
    ? sectorData.map(sector => sector.ticker) 
    : [];

  // Fetch current stock data
  const { 
    data: stockData, 
    error: stockError, 
    isLoading: isStockLoading 
  } = useQuery({
    queryKey: ['stockData', sectorTickers],
    queryFn: () => fetchStockData(sectorTickers),
    enabled: sectorTickers.length > 0,
    staleTime: 60000, // 1 minute
    refetchOnWindowFocus: false,
    retry: 1, // Only retry once to avoid hitting API limits
  });

  // Notify if there's an error (toast is now handled in the API service)
  return {
    stockData: stockData || {},
    isStockLoading,
    hasStockError: !!stockError
  };
}

export function useConsumerConfidenceIndex() {
  const { 
    data: cciData, 
    error: cciError, 
    isLoading: isCCILoading 
  } = useQuery({
    queryKey: ['cciData'],
    queryFn: fetchConsumerConfidenceIndex,
    staleTime: 86400000, // 24 hours (CCI data doesn't change frequently)
    refetchOnWindowFocus: false,
    retry: 1, // Only retry once
  });

  return {
    cciData: cciData || [],
    isCCILoading,
    hasCCIError: !!cciError
  };
}

export function useSectorCorrelation(sectorTicker: string) {
  const [correlationData, setCorrelationData] = useState<{ 
    date: string; 
    cci: number; 
    returns?: number;
  }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Fetch both CCI data and sector historical data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setHasError(false);
      
      try {
        // Get CCI data
        const cciData = await fetchConsumerConfidenceIndex();
        
        // Get sector historical data (even if CCI failed, we'll try this anyway)
        const sectorData = await fetchHistoricalData(sectorTicker);
        
        // If we have any data from either source, try to combine them
        if (cciData.length && sectorData.length) {
          // Combine the datasets
          const combined = cciData.map(cci => {
            // Find corresponding sector return for the same date
            const sectorDataPoint = sectorData.find(sd => sd.date === cci.date);
            
            return {
              date: cci.date,
              cci: cci.cci,
              returns: sectorDataPoint?.value
            };
          }).filter(item => item.returns !== undefined);
          
          setCorrelationData(combined);
        } else {
          // If either dataset is empty, create synthetic data
          const syntheticData = [];
          const currentDate = new Date();
          
          // Generate 24 months of synthetic data
          for (let i = 0; i < 24; i++) {
            const date = new Date(currentDate);
            date.setMonth(currentDate.getMonth() - i);
            const dateStr = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
            
            // Create synthetic correlation where returns somewhat follow CCI
            const cci = 100 + (Math.sin(i * 0.5) * 10);
            const sectorMultiplier = sectorTicker === 'XLK' ? 1.2 : 
                                    sectorTicker === 'XLF' ? 1.1 : 
                                    sectorTicker === 'XLE' ? 0.9 : 1.0;
            const returns = 100 + (Math.sin(i * 0.5 + 0.2) * 15 * sectorMultiplier);
            
            syntheticData.unshift({
              date: dateStr,
              cci: parseFloat(cci.toFixed(1)),
              returns: parseFloat(returns.toFixed(1))
            });
          }
          
          setCorrelationData(syntheticData);
          toast.warning(`Usando dati sintetici per ${sectorTicker}`);
        }
      } catch (error) {
        console.error("Error in useSectorCorrelation:", error);
        // Create synthetic data on error
        const syntheticData = [];
        const currentDate = new Date();
        
        // Generate 24 months of synthetic data
        for (let i = 0; i < 24; i++) {
          const date = new Date(currentDate);
          date.setMonth(currentDate.getMonth() - i);
          const dateStr = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
          
          // Create synthetic correlation
          const cci = 100 + (Math.sin(i * 0.5) * 10);
          const returns = 100 + (Math.sin(i * 0.5 + 0.2) * 15);
          
          syntheticData.unshift({
            date: dateStr,
            cci: parseFloat(cci.toFixed(1)),
            returns: parseFloat(returns.toFixed(1))
          });
        }
        
        setCorrelationData(syntheticData);
        toast.error(`Errore nel calcolo della correlazione per ${sectorTicker}`);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (sectorTicker) {
      fetchData();
    }
  }, [sectorTicker]);

  return { correlationData, isLoading, hasError };
}
