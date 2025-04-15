
import React from "react";
import { Package } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ConditionSelectorProps {
  condition: string;
  onConditionChange: (condition: string) => void;
}

const ConditionSelector: React.FC<ConditionSelectorProps> = ({ condition, onConditionChange }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-2">
        <Package size={16} className="text-brand-500" />
        <h3 className="text-sm font-medium">Product Condition</h3>
      </div>
      <RadioGroup 
        value={condition} 
        onValueChange={onConditionChange}
        className="grid grid-cols-2 gap-2 md:grid-cols-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="all" id="all" />
          <Label htmlFor="all" className="cursor-pointer ml-2">All</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="new" id="new" />
          <Label htmlFor="new" className="cursor-pointer ml-2">New</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="refurbished" id="refurbished" />
          <Label htmlFor="refurbished" className="cursor-pointer ml-2">Refurbished</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="used" id="used" />
          <Label htmlFor="used" className="cursor-pointer ml-2">Used</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default ConditionSelector;
