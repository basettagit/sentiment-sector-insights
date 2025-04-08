
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import SectorCard from '@/components/SectorCard';
import SentimentChart from '@/components/SentimentChart';
import VolatilityComparison from '@/components/VolatilityComparison';
import CorrelationHeatmap from '@/components/CorrelationHeatmap';
import SectorSelector from '@/components/SectorSelector';
import { sectorData } from '@/data/sectorData';
import { useStockData, useConsumerConfidenceIndex, useSectorCorrelation } from '@/hooks/useStockData';
import LoadingSpinner from '@/components/LoadingSpinner';

// Define a type for sector data to avoid type errors
interface SectorInfo {
  name: string;
  ticker: string;
  volatility: number;
  sentimentCorrelation: number;
  color: string;
  price?: number;
  changePercent?: number;
}

const Dashboard = () => {
  // Ensure we have valid sector data
  const validSectorData: SectorInfo[] = Array.isArray(sectorData) && sectorData.length > 0 ? sectorData : [];
  
  // Default to the first sector or a fallback if empty
  const [selectedSector, setSelectedSector] = useState(
    validSectorData.length > 0 ? validSectorData[0].ticker : 'XLK'
  );
  
  // Fetch real data from APIs
  const { stockData, isStockLoading } = useStockData();
  const { cciData, isCCILoading } = useConsumerConfidenceIndex();
  const { correlationData, isLoading: isCorrelationLoading } = useSectorCorrelation(selectedSector);
  
  // Find the selected sector data with a fallback
  const defaultSector: SectorInfo = { 
    ticker: 'XLK', 
    name: 'Tecnologia', 
    volatility: 0, 
    sentimentCorrelation: 0,
    color: '#3B82F6' 
  };
  
  const sectorInfo = validSectorData.find(s => s.ticker === selectedSector) || defaultSector;
  
  // Update sector cards with real-time data
  const enhancedSectorData = validSectorData.map(sector => {
    const liveData = stockData[sector.ticker];
    
    if (liveData) {
      return {
        ...sector,
        // Use real volatility if available, otherwise keep the mock value
        volatility: liveData.volatility !== undefined ? liveData.volatility : sector.volatility,
        // Add live price and change percentage
        price: liveData.price,
        changePercent: liveData.changePercent
      };
    }
    
    return sector;
  });
  
  // Notify when data is successfully loaded
  useEffect(() => {
    if (stockData && Object.keys(stockData).length > 0) {
      toast.success("Dati di mercato aggiornati in tempo reale");
    }
  }, [stockData]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Dashboard Title and Description */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard di Analisi del Sentimento</h1>
        <p className="text-slate-600 max-w-3xl">
          Questa dashboard esplora l'impatto del sentimento degli investitori sui rendimenti azionari per settori 
          specifici, sfidando la Teoria del Mercato Efficiente (EMH) attraverso l'analisi della correlazione tra 
          l'Indice di Fiducia dei Consumatori e i rendimenti settoriali.
        </p>
      </div>

      {/* Loading state */}
      {isStockLoading && (
        <div className="my-8 p-6 bg-slate-50 rounded-lg text-center">
          <LoadingSpinner size="large" className="mb-4" />
          <p className="text-slate-600">Caricamento dei dati di mercato in tempo reale...</p>
        </div>
      )}

      {/* Sector Cards */}
      <h2 className="text-xl font-semibold mb-4">Panoramica Settoriale</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {enhancedSectorData.map((sector) => (
          <SectorCard
            key={sector.ticker}
            name={sector.name}
            ticker={sector.ticker}
            volatility={sector.volatility}
            sentimentCorrelation={sector.sentimentCorrelation}
            color={sector.color}
            price={sector.price}
            changePercent={sector.changePercent}
          />
        ))}
      </div>

      {/* Charts Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Analisi Storica del Sentimento</h2>
        <div className="mb-4">
          {isCCILoading ? (
            <div className="bg-white p-6 rounded-lg shadow-sm h-[350px] flex items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <SentimentChart 
              data={cciData} 
              title="Indice di Fiducia dei Consumatori (Dati Storici)" 
            />
          )}
        </div>
      </div>

      {/* Sector Specific Analysis */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Analisi Specifica per Settore</h2>
        <div className="mb-4">
          <SectorSelector 
            selectedSector={selectedSector}
            onSectorChange={setSelectedSector}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {isCorrelationLoading ? (
            <div className="bg-white p-6 rounded-lg shadow-sm h-[350px] flex items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <SentimentChart 
              data={correlationData} 
              title={`Correlazione CCI - Rendimenti ${sectorInfo.name} (${sectorInfo.ticker})`}
              showReturns={true}
              sectorColor={sectorInfo.color}
            />
          )}
          <VolatilityComparison />
        </div>
      </div>

      {/* Correlation Heatmap */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Mappa di Correlazione</h2>
        <CorrelationHeatmap />
      </div>
    </div>
  );
};

export default Dashboard;
