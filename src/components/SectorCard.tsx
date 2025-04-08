
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface SectorCardProps {
  name: string;
  ticker: string;
  volatility: number;
  sentimentCorrelation: number;
  color: string;
}

const SectorCard: React.FC<SectorCardProps> = ({
  name,
  ticker,
  volatility,
  sentimentCorrelation,
  color,
}) => {
  const isPositiveCorrelation = sentimentCorrelation > 0;
  
  return (
    <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: color }}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">{name}</CardTitle>
          <span className="text-sm font-bold bg-slate-100 px-2 py-1 rounded-md">{ticker}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Volatilità</p>
            <p className="text-xl font-semibold">{volatility.toFixed(2)}%</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Correlazione</p>
            <div className="flex items-center">
              {isPositiveCorrelation ? (
                <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1 text-red-500" />
              )}
              <span className={`text-xl font-semibold ${isPositiveCorrelation ? 'text-green-600' : 'text-red-600'}`}>
                {sentimentCorrelation.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SectorCard;
