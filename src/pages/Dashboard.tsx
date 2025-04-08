
import React, { useState } from 'react';
import SectorCard from '@/components/SectorCard';
import SentimentChart from '@/components/SentimentChart';
import VolatilityComparison from '@/components/VolatilityComparison';
import CorrelationHeatmap from '@/components/CorrelationHeatmap';
import SectorSelector from '@/components/SectorSelector';
import { sectorData } from '@/data/sectorData';
import { cciHistoricalData, generateSectorData } from '@/data/sentimentData';

const Dashboard = () => {
  const [selectedSector, setSelectedSector] = useState('XLK');
  
  // Find the selected sector data
  const sectorInfo = sectorData.find(s => s.ticker === selectedSector) || sectorData[0];
  
  // Generate correlation data for the selected sector
  const sectorCorrelationData = generateSectorData(selectedSector, sectorInfo.sentimentCorrelation);

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

      {/* Sector Cards */}
      <h2 className="text-xl font-semibold mb-4">Panoramica Settoriale</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {sectorData.map((sector) => (
          <SectorCard
            key={sector.ticker}
            name={sector.name}
            ticker={sector.ticker}
            volatility={sector.volatility}
            sentimentCorrelation={sector.sentimentCorrelation}
            color={sector.color}
          />
        ))}
      </div>

      {/* Charts Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Analisi Storica del Sentimento</h2>
        <div className="mb-4">
          <SentimentChart 
            data={cciHistoricalData} 
            title="Indice di Fiducia dei Consumatori (2018-2020)" 
          />
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
          <SentimentChart 
            data={sectorCorrelationData} 
            title={`Correlazione CCI - Rendimenti ${sectorInfo.name} (${sectorInfo.ticker})`}
            showReturns={true}
            sectorColor={sectorInfo.color}
          />
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
