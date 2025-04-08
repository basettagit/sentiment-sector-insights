
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

interface SectorCardProps {
  name: string;
  ticker: string;
  volatility: number;
  sentimentCorrelation: number;
  color: string;
  price?: number;
  changePercent?: number;
}

// Generate mock data for sparkline
const generateSparklineData = (volatility: number) => {
  const dataPoints = 20;
  const baseValue = 100;
  const data = [];
  
  for (let i = 0; i < dataPoints; i++) {
    const random = (Math.random() - 0.5) * volatility;
    data.push(baseValue + random);
  }
  
  return data;
};

const SectorCard = ({ 
  name, 
  ticker, 
  volatility, 
  sentimentCorrelation, 
  color,
  price,
  changePercent 
}: SectorCardProps) => {
  // Generate sparkline data based on volatility
  const sparklineData = generateSparklineData(volatility);
  
  // Format price with 2 decimal places if available
  const formattedPrice = price !== undefined ? price.toFixed(2) : null;
  
  // Format change percentage with 2 decimal places if available
  const formattedChange = changePercent !== undefined ? changePercent.toFixed(2) : null;
  
  // Determine change direction and icon
  const isPositiveChange = changePercent !== undefined && changePercent > 0;
  const changeIcon = isPositiveChange ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />;
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className={`py-3 flex flex-row justify-between items-center`} style={{ backgroundColor: color, color: "#fff" }}>
        <div>
          <h3 className="text-lg font-medium text-white">{name}</h3>
          <p className="text-sm text-white opacity-90">{ticker}</p>
        </div>
        <TrendingUp className="text-white opacity-80" size={20} />
      </CardHeader>
      <CardContent className="p-4">
        {/* Stock price and change if available */}
        {formattedPrice && (
          <div className="mb-3 flex justify-between items-center">
            <div className="text-base font-semibold">${formattedPrice}</div>
            {formattedChange && (
              <div className={`flex items-center ${isPositiveChange ? 'text-green-500' : 'text-red-500'}`}>
                {changeIcon}
                <span className="ml-1">{isPositiveChange ? '+' : ''}{formattedChange}%</span>
              </div>
            )}
          </div>
        )}
        
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-slate-600">Volatilità</span>
            <span className="text-sm font-medium">{volatility.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600">Correlazione al Sentiment</span>
            <span className="text-sm font-medium">{(sentimentCorrelation * 100).toFixed(0)}%</span>
          </div>
        </div>
        
        {/* Sparkline visualization */}
        <div className="h-10 mt-4">
          <Sparklines data={sparklineData} margin={5}>
            <SparklinesLine color={color} style={{ fill: "none" }} />
          </Sparklines>
        </div>
      </CardContent>
    </Card>
  );
};

export default SectorCard;
