
import React from 'react';
import { BarChart3, LineChart, PieChart, TrendingUp, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStockData, useConsumerConfidenceIndex } from '../hooks/useStockData';
import { sectorData } from '@/data/sectorData';
import SentimentChart from '@/components/SentimentChart';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Analytics = () => {
  const { stockData, isStockLoading } = useStockData();
  const { cciData, isCCILoading } = useConsumerConfidenceIndex();
  
  // Filter to most volatile sectors for analysis
  const volatileSectors = [...sectorData]
    .sort((a, b) => b.volatility - a.volatility)
    .slice(0, 3);

  const handleExportData = () => {
    toast.success("Report esportato correttamente");
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-green-950 to-black text-white font-sans">
      <main className="flex-grow p-6">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold">Analytics</h1>
            <p className="text-gray-300 text-sm">Analisi dettagliata dei dati di mercato e correlazioni</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-gray-900 border-gray-700 text-white hover:bg-gray-800"
            onClick={handleExportData}
          >
            Esporta Report
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-gray-950 border-gray-800 shadow-xl col-span-full mb-4">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <TrendingUp className="mr-2 h-5 w-5 text-teal-400" />
                Correlazione Sentimento-Mercato
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white">
              <p className="mb-4 text-gray-300">Questo grafico mostra la correlazione tra l'indice di fiducia dei consumatori e l'andamento di mercato generale nell'ultimo anno.</p>
              <div className="h-72">
                {!isCCILoading ? (
                  <SentimentChart 
                    data={cciData} 
                    title="Indice di Fiducia dei Consumatori" 
                    darkMode={true}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-gray-400">Caricamento dati...</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {volatileSectors.map((sector) => (
            <Card key={sector.ticker} className="bg-gray-950 border-gray-800 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <BarChart3 className="mr-2 h-5 w-5" style={{ color: sector.color }} />
                  Analisi {sector.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-white">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Volatilità:</span>
                    <span className="font-semibold">{sector.volatility.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Correlazione Sentiment:</span>
                    <span className="font-semibold">{(sector.sentimentCorrelation * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Prezzo Attuale:</span>
                    <span className="font-semibold">${stockData[sector.ticker]?.price?.toFixed(2) || 'N/A'}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-2 bg-gray-900 border-gray-700 text-white hover:bg-gray-800"
                    onClick={() => toast.info(`Dettagli completi su ${sector.name}`)}
                  >
                    <Info className="h-4 w-4 mr-2" />
                    Dettagli completi
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Analytics;
