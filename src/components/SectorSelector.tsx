
import React from 'react';
import { sectorData } from '@/data/sectorData';
import { Button } from '@/components/ui/button';

interface SectorSelectorProps {
  selectedSector: string;
  onSectorChange: (ticker: string) => void;
  darkMode?: boolean;
}

const SectorSelector: React.FC<SectorSelectorProps> = ({ 
  selectedSector, 
  onSectorChange,
  darkMode = false
}) => {
  const sectors = Array.isArray(sectorData) ? sectorData : [];
  
  return (
    <div className="flex flex-wrap gap-2">
      {sectors && sectors.length > 0 ? sectors.map((sector) => (
        <Button
          key={sector.ticker}
          onClick={() => onSectorChange(sector.ticker)}
          variant={selectedSector === sector.ticker ? "default" : "outline"}
          className={`
            text-xs px-3 py-1 h-auto
            ${selectedSector === sector.ticker 
              ? (darkMode 
                ? 'bg-gradient-to-r from-teal-600 to-lime-600 text-white border-0' 
                : '') 
              : (darkMode 
                ? 'bg-gray-900 border-gray-800 text-gray-400 hover:bg-gray-800' 
                : '')
            }
          `}
          style={
            selectedSector === sector.ticker && darkMode 
              ? { boxShadow: '0 2px 12px rgba(16, 185, 129, 0.2)' } 
              : {}
          }
        >
          {sector.ticker}
        </Button>
      )) : (
        <div className="text-sm text-gray-500">Nessun settore disponibile</div>
      )}
    </div>
  );
};

export default SectorSelector;
