
import React from "react";
import { BarChart } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

interface SoldItemsFilterProps {
  minSold: number | null;
  onMinSoldChange: (minSold: number | null) => void;
}

const SoldItemsFilter: React.FC<SoldItemsFilterProps> = ({ minSold, onMinSoldChange }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    
    if (value === "") {
      onMinSoldChange(null);
    } else {
      const parsedValue = parseInt(value, 10);
      if (!isNaN(parsedValue) && parsedValue >= 0) {
        onMinSoldChange(parsedValue);
      }
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-2">
        <BarChart size={16} className="text-brand-500" />
        <h3 className="text-sm font-medium">Minimum Items Sold</h3>
      </div>
      <div className="px-2">
        <Slider
          value={[minSold ?? 0]}
          min={0}
          max={10000}
          step={10}
          onValueChange={(value) => onMinSoldChange(value[0])}
          className="my-4"
        />
        <div className="flex items-center justify-between gap-2">
          <div className="text-xs text-muted-foreground">Any</div>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={minSold ?? ""}
              onChange={handleInputChange}
              placeholder="Min items sold"
              className="w-20 h-8 text-sm"
              min={0}
            />
            <div className="text-sm">items sold</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoldItemsFilter;
