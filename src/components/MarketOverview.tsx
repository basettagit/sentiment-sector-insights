
import React from 'react';
import Image from '../assets/crypto-icons/btc.svg';

interface SectorInfo {
  name: string;
  ticker: string;
  volatility: number;
  sentimentCorrelation: number;
  color: string;
  price?: number;
  changePercent?: number;
}

interface MarketOverviewProps {
  sectorData: SectorInfo[];
}

const MarketOverview: React.FC<MarketOverviewProps> = ({ sectorData }) => {
  // Use sectors from the provided data
  const marketData = sectorData.slice(0, 5).map((sector, index) => {
    return {
      id: index + 1,
      name: sector.name,
      ticker: sector.ticker,
      price: sector.price || (20000 + Math.random() * 1000).toFixed(2),
      change: sector.changePercent || (Math.random() * 8 - 4).toFixed(2),
      marketCap: `$${(398 + Math.random() * 10).toFixed(2)}B`
    };
  });

  // Custom crypto icons mapping
  const cryptoIcons: Record<string, string> = {
    XLK: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg',
    XLF: 'https://cryptologos.cc/logos/solana-sol-logo.svg',
    XLE: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg',
    XLI: 'https://cryptologos.cc/logos/cardano-ada-logo.svg',
    XLY: 'https://cryptologos.cc/logos/avalanche-avax-logo.svg',
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-12 text-xs text-gray-400 mb-3 px-2">
        <div className="col-span-1">#</div>
        <div className="col-span-5">Market</div>
        <div className="col-span-2 text-right">Price</div>
        <div className="col-span-2 text-right">Change</div>
        <div className="col-span-2 text-right">Market Cap</div>
      </div>
      
      <div className="space-y-3">
        {marketData.map((item) => (
          <div key={item.id} className="grid grid-cols-12 items-center px-2 py-2 rounded-lg hover:bg-gray-900/50 transition-colors">
            <div className="col-span-1 text-sm text-gray-500">{item.id.toString().padStart(2, '0')}</div>
            <div className="col-span-5 flex items-center">
              <div className="h-8 w-8 rounded-full mr-2 overflow-hidden bg-gray-800 flex items-center justify-center">
                <img 
                  src={cryptoIcons[item.ticker] || `https://cryptologos.cc/logos/ethereum-eth-logo.svg`} 
                  alt={item.ticker}
                  className="h-5 w-5 object-contain"
                />
              </div>
              <div>
                <div className="font-medium">{item.name}</div>
                <div className="text-xs text-gray-500">{item.ticker}</div>
              </div>
            </div>
            <div className="col-span-2 text-right font-medium">
              ${typeof item.price === 'number' ? item.price.toLocaleString() : item.price}
            </div>
            <div className={`col-span-2 text-right ${Number(item.change) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {Number(item.change) >= 0 ? '+' : ''}{item.change}%
            </div>
            <div className="col-span-2 text-right text-gray-400">
              {item.marketCap}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketOverview;
