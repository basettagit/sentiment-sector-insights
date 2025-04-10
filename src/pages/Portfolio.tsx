
import React, { useState } from 'react';
import { Wallet, BarChart3, ArrowUp, ArrowDown, PlusCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStockData } from '../hooks/useStockData';
import { sectorData } from '@/data/sectorData';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

type PortfolioItem = {
  ticker: string;
  name: string;
  allocation: number;
  shares: number;
};

const Portfolio = () => {
  const { stockData } = useStockData();
  
  // Sample portfolio data
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([
    { ticker: "XLK", name: "Technology", allocation: 35, shares: 15 },
    { ticker: "XLF", name: "Financial", allocation: 25, shares: 20 },
    { ticker: "XLE", name: "Energy", allocation: 20, shares: 12 },
    { ticker: "XLV", name: "Healthcare", allocation: 15, shares: 8 },
    { ticker: "XLP", name: "Consumer Staples", allocation: 5, shares: 4 },
  ]);

  const totalValue = portfolio.reduce((total, item) => {
    const price = stockData[item.ticker]?.price || 0;
    return total + (price * item.shares);
  }, 0);

  const handleAddAsset = () => {
    toast.info("Funzionalità di aggiunta asset in arrivo");
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-green-950 to-black text-white font-sans">
      <main className="flex-grow p-6">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold">Portfolio</h1>
            <p className="text-gray-300 text-sm">Gestione del tuo portafoglio di investimenti</p>
          </div>
          <Button 
            variant="outline"
            size="sm"
            className="bg-gray-900 border-gray-700 text-white hover:bg-gray-800"
            onClick={handleAddAsset}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Aggiungi Asset
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-gray-950 border-gray-800 shadow-xl lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Wallet className="mr-2 h-5 w-5 text-teal-400" />
                Riepilogo Portfolio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Valore Totale:</span>
                  <span className="text-xl font-semibold">${totalValue.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-4">
                {portfolio.map((item) => {
                  const price = stockData[item.ticker]?.price || 0;
                  const value = price * item.shares;
                  const changePercent = stockData[item.ticker]?.changePercent || 0;
                  const isPositive = changePercent >= 0;
                  const sector = sectorData.find(s => s.ticker === item.ticker);
                  
                  return (
                    <div key={item.ticker} className="p-3 bg-gray-900 rounded-lg border border-gray-800">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <div 
                            className="w-2 h-10 mr-3 rounded-full" 
                            style={{ backgroundColor: sector?.color || '#888' }} 
                          />
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-xs text-gray-400">{item.ticker}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${value.toFixed(2)}</div>
                          <div className={`text-xs flex items-center ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                            {isPositive ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                            {isPositive ? '+' : ''}{changePercent.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                      <Progress value={item.allocation} className="h-1.5 bg-gray-800" indicatorClassName={`bg-gradient-to-r from-${isPositive ? 'green' : 'red'}-500 to-${isPositive ? 'green' : 'red'}-400`} />
                      <div className="mt-1 text-xs text-gray-400 flex justify-between">
                        <span>{item.shares} azioni</span>
                        <span>{item.allocation}% del portfolio</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-950 border-gray-800 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <BarChart3 className="mr-2 h-5 w-5 text-teal-400" />
                Allocazione
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {portfolio.map((item) => {
                  const sector = sectorData.find(s => s.ticker === item.ticker);
                  return (
                    <div key={item.ticker} className="flex items-center">
                      <div 
                        className="w-2 h-6 mr-3 rounded-full" 
                        style={{ backgroundColor: sector?.color || '#888' }} 
                      />
                      <div className="flex-grow">
                        <div className="text-sm">{item.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-sm">{item.allocation}%</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-800">
                <Button 
                  variant="outline" 
                  className="w-full bg-gray-900 border-gray-700 text-white hover:bg-gray-800"
                  onClick={() => toast.info("Ottimizzatore di portfolio in arrivo")}
                >
                  Ottimizza Portfolio
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Portfolio;
