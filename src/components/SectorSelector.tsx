
import React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { sectorData } from '@/data/sectorData';

interface SectorSelectorProps {
  selectedSector: string;
  onSectorChange: (value: string) => void;
}

const SectorSelector: React.FC<SectorSelectorProps> = ({ 
  selectedSector, 
  onSectorChange 
}) => {
  const [open, setOpen] = React.useState(false);
  
  // Make sure we have valid sector data and it's never undefined
  const sectors = Array.isArray(sectorData) ? sectorData : [];
  
  // Ensure we have a valid selected sector
  const selectedSectorData = sectors.find(sector => sector.ticker === selectedSector);
  const displayText = selectedSectorData 
    ? `${selectedSectorData.name} (${selectedSectorData.ticker})` 
    : "Seleziona settore...";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {displayText}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Cerca settore..." />
          <CommandEmpty>Nessun settore trovato.</CommandEmpty>
          <CommandGroup>
            {sectors && sectors.length > 0 ? (
              sectors.map((sector) => (
                <CommandItem
                  key={sector.ticker}
                  value={sector.ticker}
                  onSelect={() => {
                    onSectorChange(sector.ticker);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedSector === sector.ticker ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span>{sector.name}</span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {sector.ticker}
                  </span>
                </CommandItem>
              ))
            ) : (
              <CommandItem disabled>Nessun settore disponibile</CommandItem>
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SectorSelector;
