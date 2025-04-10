
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  Settings, 
  Home, 
  Wallet, 
  Bell, 
  Search,
  MoreVertical,
  ChevronDown
} from 'lucide-react';

import SentimentChart from '@/components/SentimentChart';
import VolatilityComparison from '@/components/VolatilityComparison';
import CorrelationHeatmap from '@/components/CorrelationHeatmap';
import SectorSelector from '@/components/SectorSelector';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { sectorData } from '@/data/sectorData';
import { 
  useStockData, 
  useConsumerConfidenceIndex, 
  useSectorCorrelation 
} from '@/hooks/useStockData';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Check } from 'lucide-react';
import MarketOverview from '@/components/MarketOverview';

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
  const validSectorData: SectorInfo[] = Array.isArray(sectorData) && sectorData.length > 0 ? sectorData : [];
  
  const [selectedSector, setSelectedSector] = useState(
    validSectorData.length > 0 ? validSectorData[0].ticker : 'XLK'
  );
  
  const { stockData, isStockLoading } = useStockData();
  const { cciData, isCCILoading } = useConsumerConfidenceIndex();
  const { correlationData, isLoading: isCorrelationLoading } = useSectorCorrelation(selectedSector);
  
  const defaultSector: SectorInfo = { 
    ticker: 'XLK', 
    name: 'Tecnologia', 
    volatility: 0, 
    sentimentCorrelation: 0,
    color: '#3B82F6' 
  };
  
  const sectorInfo = validSectorData.find(s => s.ticker === selectedSector) || defaultSector;
  
  const enhancedSectorData = validSectorData.map(sector => {
    const liveData = stockData[sector.ticker];
    
    if (liveData) {
      return {
        ...sector,
        volatility: liveData.volatility !== undefined ? liveData.volatility : sector.volatility,
        price: liveData.price,
        changePercent: liveData.changePercent
      };
    }
    
    return sector;
  });
  
  useEffect(() => {
    if (stockData && Object.keys(stockData).length > 0) {
      toast.success("Dati di mercato aggiornati");
    }
  }, [stockData]);

  const [apiStatus, setApiStatus] = useState<'connecting' | 'success' | 'error'>('connecting');
  
  useEffect(() => {
    const hasRealData = stockData && Object.keys(stockData).length > 0 && 
                        stockData.XLK && stockData.XLK.price !== 187.45;
    
    setApiStatus(hasRealData ? 'success' : 'error');
  }, [stockData]);

  // Calculate total market value (example data)
  const totalMarketValue = 234352.21;
  const marketChange = -1.43;

  const sidebarIcons = [
    { icon: Home, active: true },
    { icon: BarChart3, active: false },
    { icon: LineChart, active: false },
    { icon: PieChart, active: false },
    { icon: Wallet, active: false },
    { icon: Settings, active: false },
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-green-950 to-black text-white font-sans">
      {/* Sidebar */}
      <nav className="w-20 flex flex-col items-center py-8 bg-gradient-to-b from-[#0F2517] to-black">
        <div className="mb-12">
          <div className="h-10 w-10 bg-gradient-to-r from-teal-300 to-lime-300 flex items-center justify-center rounded">
            <span className="text-black font-bold">SS</span>
          </div>
        </div>
        
        <div className="flex flex-col items-center space-y-8">
          {sidebarIcons.map((item, index) => (
            <button 
              key={index} 
              className={`p-3 rounded-xl transition-all ${
                item.active 
                ? 'bg-gradient-to-r from-teal-900/50 to-lime-900/50 text-teal-300 shadow-lg shadow-teal-900/20' 
                : 'text-gray-400 hover:text-white'
              }`}
            >
              <item.icon size={24} />
            </button>
          ))}
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="flex-grow p-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold">Dashboard di Analisi del Sentimento</h1>
            <p className="text-gray-400 text-sm">Esplorazione dell'impatto del sentimento degli investitori sui rendimenti azionari</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {apiStatus === 'connecting' && (
              <Alert className="bg-gray-900/50 border border-gray-800 text-white">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Connessione ad Alpha Vantage API in corso...
                </AlertDescription>
              </Alert>
            )}
            {apiStatus === 'success' && (
              <Alert className="bg-green-900/50 border border-green-800/50 text-green-300">
                <Check className="h-4 w-4" />
                <AlertDescription>
                  API connessa
                </AlertDescription>
              </Alert>
            )}
            {apiStatus === 'error' && (
              <Alert variant="destructive" className="bg-red-900/50 border border-red-800/50 text-red-300">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Dati di fallback
                </AlertDescription>
              </Alert>
            )}
            
            <Button variant="ghost" size="icon" className="rounded-full bg-gray-800/50">
              <Bell size={20} />
            </Button>
            
            <Button variant="ghost" size="icon" className="rounded-full bg-gray-800/50">
              <Search size={20} />
            </Button>
          </div>
        </div>
        
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Market Summary - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Token Overview */}
            <Card className="bg-gray-950 border-gray-800 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-medium">Token Overview</CardTitle>
                <div className="flex space-x-1">
                  {enhancedSectorData.slice(0, 3).map((sector, index) => (
                    <div key={index} className={`px-3 py-1 rounded-md text-sm ${
                      index === 0 ? 'bg-green-950 text-green-300' : 'bg-gray-900'
                    }`}>
                      {sector.ticker}
                    </div>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-6">
                  {enhancedSectorData.slice(0, 3).map((sector, index) => (
                    <div key={index} className={`p-5 rounded-xl ${
                      index === 0 
                      ? 'bg-gradient-to-br from-teal-900/50 to-lime-800/20' 
                      : 'bg-gray-900/50'
                    }`}>
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-semibold">{sector.name}</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical size={16} />
                        </Button>
                      </div>
                      <div className="text-2xl font-bold mb-1">
                        ${sector.price?.toLocaleString() || '50,000'}
                      </div>
                      <div className={`text-sm flex items-center ${
                        (sector.changePercent || 0) >= 0 
                          ? 'text-green-400' 
                          : 'text-red-400'
                      }`}>
                        {(sector.changePercent || 0) >= 0 ? '↑' : '↓'} 
                        {Math.abs(sector.changePercent || 0).toFixed(2)}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Main Chart */}
            <Card className="bg-gray-950 border-gray-800 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-medium">Analisi Storica del Sentimento</CardTitle>
                <Button variant="outline" className="text-xs bg-gray-900 border-gray-800 hover:bg-gray-800">
                  Mensile <ChevronDown size={14} />
                </Button>
              </CardHeader>
              <CardContent>
                {isCCILoading ? (
                  <div className="h-[300px] flex items-center justify-center">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <div className="h-[300px]">
                    <SentimentChart 
                      data={cciData} 
                      title="" 
                      darkMode={true}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Balance Card */}
            <Card className="bg-gray-950 border-gray-800 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-medium">Bilancio Stimato</CardTitle>
                <div className="flex space-x-2">
                  <div className="flex items-center space-x-1">
                    <div className="h-3 w-3 rounded-full bg-teal-400"></div>
                    <span className="text-xs text-gray-400">Asset</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="h-3 w-3 rounded-full bg-gray-500"></div>
                    <span className="text-xs text-gray-400">Profitti</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">{totalMarketValue.toLocaleString()}</span>
                    <span className="ml-2 text-sm text-gray-400">USD</span>
                  </div>
                  <div className={`text-sm ${marketChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {marketChange >= 0 ? '↑' : '↓'} {Math.abs(marketChange).toFixed(2)}%
                  </div>
                </div>
                
                <div className="h-[200px]">
                  <VolatilityComparison darkMode={true} />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right column - Market data and more */}
          <div className="space-y-6">
            {/* Bitcoin Retention */}
            <Card className="bg-gray-950 border-gray-800 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-medium">
                  {sectorInfo.name} Retention
                </CardTitle>
                <Button variant="ghost" size="icon">
                  <MoreVertical size={16} />
                </Button>
              </CardHeader>
              <CardContent>
                {isCorrelationLoading ? (
                  <div className="h-[260px] flex items-center justify-center">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <div className="h-[260px]">
                    <SentimentChart 
                      data={correlationData} 
                      showReturns={true}
                      sectorColor={sectorInfo.color}
                      title=""
                      darkMode={true}
                    />
                  </div>
                )}
                <div className="mt-4">
                  <SectorSelector 
                    selectedSector={selectedSector}
                    onSectorChange={setSelectedSector}
                    darkMode={true}
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Market Table */}
            <Card className="bg-gray-950 border-gray-800 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-medium">Market</CardTitle>
                <Button variant="ghost" size="icon">
                  <MoreVertical size={16} />
                </Button>
              </CardHeader>
              <CardContent>
                <MarketOverview sectorData={enhancedSectorData} />
              </CardContent>
            </Card>
            
            {/* Correlation Card */}
            <Card className="bg-gray-950 border-gray-800 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-medium">Correlazione</CardTitle>
                <Button variant="ghost" size="icon">
                  <MoreVertical size={16} />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <CorrelationHeatmap darkMode={true} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
