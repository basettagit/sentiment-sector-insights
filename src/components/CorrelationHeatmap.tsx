
import React from 'react';
import { sectorData } from '@/data/sectorData';
import { cn } from '@/lib/utils';

interface CorrelationHeatmapProps {
  darkMode?: boolean;
}

const CorrelationHeatmap: React.FC<CorrelationHeatmapProps> = ({ darkMode = false }) => {
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
    if (value > 0.6) return 'bg-gradient-to-br from-teal-700 to-teal-900 text-white';
    if (value > 0.4) return 'bg-gradient-to-br from-teal-600 to-teal-800 text-white';
    if (value > 0.2) return 'bg-gradient-to-br from-teal-500 to-teal-700 text-white';
    return 'bg-gradient-to-br from-teal-400 to-teal-600 text-white';
  };

  return (
    <div className="h-full">
      <h3 className="text-lg font-medium mb-4">Correlazione Sentimento-Rendimenti</h3>
      <div className="grid grid-cols-3 gap-2">
        {correlationMatrix.map((item) => {
          const sector = sectorData.find(s => s.ticker === item.sector);
          return (
            <div 
              key={item.sector} 
              className={cn(
                "p-4 rounded-md flex flex-col items-center justify-center text-center shadow-md",
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
    </div>
  );
};

export default CorrelationHeatmap;
