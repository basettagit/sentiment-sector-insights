
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { sectorData } from '@/data/sectorData';
import { cn } from '@/lib/utils';

const CorrelationHeatmap: React.FC = () => {
  // For a first version, let's create a simplified correlation matrix
  const correlationMatrix = [
    { sector: 'XLK', value: 0.68 },
    { sector: 'XLV', value: 0.43 },
    { sector: 'XLF', value: 0.71 },
    { sector: 'XLP', value: 0.24 },
    { sector: 'XLE', value: 0.52 },
    { sector: 'XLU', value: 0.17 },
  ];
  
  // Function to get color shade based on correlation value
  const getColorShade = (value: number) => {
    if (value > 0.6) return 'bg-blue-700 text-white';
    if (value > 0.4) return 'bg-blue-500 text-white';
    if (value > 0.2) return 'bg-blue-300 text-slate-900';
    return 'bg-blue-100 text-slate-900';
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-medium">Correlazione Sentimento-Rendimenti</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2">
          {correlationMatrix.map((item) => {
            const sector = sectorData.find(s => s.ticker === item.sector);
            return (
              <div 
                key={item.sector} 
                className={cn(
                  "p-4 rounded-md flex flex-col items-center justify-center text-center",
                  getColorShade(item.value)
                )}
              >
                <div className="text-2xl font-bold">{item.value.toFixed(2)}</div>
                <div className="text-sm mt-1">{sector?.name}</div>
                <div className="text-xs font-semibold mt-1">{item.sector}</div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default CorrelationHeatmap;
