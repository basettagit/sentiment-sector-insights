
import { useQuery } from '@tanstack/react-query';
import { fetchStockData, fetchHistoricalData, fetchConsumerConfidenceIndex, StockData } from '../services/yahooFinanceAPI';
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
    refetchOnWindowFocus: false
  });

  // Notify if there's an error
  useEffect(() => {
    if (stockError) {
      toast.error("Errore nel caricamento dei dati di mercato");
    }
  }, [stockError]);

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
    refetchOnWindowFocus: false
  });

  useEffect(() => {
    if (cciError) {
      toast.error("Errore nel caricamento dell'Indice di Fiducia dei Consumatori");
    }
  }, [cciError]);

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
        
        if (!cciData.length) {
          throw new Error("No CCI data available");
        }
        
        // Get sector historical data
        const sectorData = await fetchHistoricalData(sectorTicker);
        
        if (!sectorData.length) {
          throw new Error(`No historical data for ${sectorTicker}`);
        }
        
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
      } catch (error) {
        console.error("Error in useSectorCorrelation:", error);
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
