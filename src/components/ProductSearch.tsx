
import React, { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

import SearchInput from "./product-search/SearchInput";
import MarketplaceSelector from "./product-search/MarketplaceSelector";
import RatingFilter from "./product-search/RatingFilter";
import ConditionSelector from "./product-search/ConditionSelector";
import SoldItemsFilter from "./product-search/SoldItemsFilter";

interface ProductSearchProps {
  onSearchProduct: (query: string, marketplaces: string[], minRating: number, condition: string, minSold: number | null) => void;
  isLoading: boolean;
}

const ProductSearch: React.FC<ProductSearchProps> = ({ onSearchProduct, isLoading }) => {
  const [query, setQuery] = useState("");
  const [marketplaces, setMarketplaces] = useState({
    amazon: true,
    ebay: true,
    walmart: true,
    etsy: false,
    argos: false,
    johnlewis: false,
    currys: false
  });
  const [minRating, setMinRating] = useState(0);
  const [condition, setCondition] = useState("all");
  const [minSold, setMinSold] = useState<number | null>(null);
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      toast({
        title: "Empty Search",
        description: "Please enter a product name or keyword to search",
        variant: "destructive",
      });
      return;
    }

    const selectedMarketplaces = Object.entries(marketplaces)
      .filter(([_, selected]) => selected)
      .map(([name]) => name);

    if (selectedMarketplaces.length === 0) {
      toast({
        title: "No Marketplaces Selected",
        description: "Please select at least one marketplace",
        variant: "destructive",
      });
      return;
    }

    onSearchProduct(query, selectedMarketplaces, minRating, condition, minSold);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag size={20} className="text-brand-500" />
          Product Search
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="space-y-6">
          <SearchInput query={query} onChange={setQuery} />
          
          <MarketplaceSelector 
            marketplaces={marketplaces} 
            onChange={setMarketplaces} 
          />
          
          <RatingFilter 
            minRating={minRating} 
            onRatingChange={setMinRating} 
          />
          
          <ConditionSelector 
            condition={condition} 
            onConditionChange={setCondition} 
          />
          
          <SoldItemsFilter 
            minSold={minSold} 
            onMinSoldChange={setMinSold} 
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Searching..." : "Find Competing Prices"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductSearch;
