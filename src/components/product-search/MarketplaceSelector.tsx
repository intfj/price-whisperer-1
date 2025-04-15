
import React from "react";
import { Tag } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface Marketplaces {
  amazon: boolean;
  ebay: boolean;
  walmart: boolean;
  etsy: boolean;
  argos: boolean;
  johnlewis: boolean;
  currys: boolean;
}

interface MarketplaceSelectorProps {
  marketplaces: Marketplaces;
  onChange: (marketplaces: Marketplaces) => void;
}

const MarketplaceSelector: React.FC<MarketplaceSelectorProps> = ({ marketplaces, onChange }) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Tag size={16} className="text-brand-500" />
        <h3 className="text-sm font-medium">Select Marketplaces</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="amazon"
            checked={marketplaces.amazon}
            onCheckedChange={(checked) => 
              onChange({ ...marketplaces, amazon: !!checked })
            }
          />
          <label htmlFor="amazon" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Amazon
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="ebay"
            checked={marketplaces.ebay}
            onCheckedChange={(checked) => 
              onChange({ ...marketplaces, ebay: !!checked })
            }
          />
          <label htmlFor="ebay" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            eBay
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="walmart"
            checked={marketplaces.walmart}
            onCheckedChange={(checked) => 
              onChange({ ...marketplaces, walmart: !!checked })
            }
          />
          <label htmlFor="walmart" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Walmart
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="etsy"
            checked={marketplaces.etsy}
            onCheckedChange={(checked) => 
              onChange({ ...marketplaces, etsy: !!checked })
            }
          />
          <label htmlFor="etsy" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Etsy
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="argos"
            checked={marketplaces.argos}
            onCheckedChange={(checked) => 
              onChange({ ...marketplaces, argos: !!checked })
            }
          />
          <label htmlFor="argos" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Argos
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="johnlewis"
            checked={marketplaces.johnlewis}
            onCheckedChange={(checked) => 
              onChange({ ...marketplaces, johnlewis: !!checked })
            }
          />
          <label htmlFor="johnlewis" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            John Lewis
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="currys"
            checked={marketplaces.currys}
            onCheckedChange={(checked) => 
              onChange({ ...marketplaces, currys: !!checked })
            }
          />
          <label htmlFor="currys" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Currys
          </label>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceSelector;
