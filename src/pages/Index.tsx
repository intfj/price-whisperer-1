import React, { useState } from "react";
import Layout from "@/components/Layout";
import ProductSearch from "@/components/ProductSearch";
import PriceAnalysis, { PriceData } from "@/components/PriceAnalysis";
import ProfitCalculator from "@/components/ProfitCalculator";
import { fetchPriceData, calculateRecommendedPrice } from "@/services/priceDataService";
import { generateCSV, downloadCSV } from "@/utils/spreadsheetUtils";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [filteredPriceData, setFilteredPriceData] = useState<PriceData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendedPrice, setRecommendedPrice] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentMinRating, setCurrentMinRating] = useState(0);
  const [currentCondition, setCurrentCondition] = useState("all");
  const [currentMinSold, setCurrentMinSold] = useState<number | null>(null);
  const { toast } = useToast();

  const filterData = (data: PriceData[], minRating: number, condition: string, minSold: number | null) => {
    let filtered = data;
    
    // Filter by rating
    if (minRating > 0) {
      filtered = filtered.filter(item => (item.rating || 0) >= minRating);
    }
    
    // Filter by condition
    if (condition !== "all") {
      filtered = filtered.filter(item => item.condition.toLowerCase() === condition.toLowerCase());
    }
    
    // Filter by number sold
    if (minSold !== null && minSold > 0) {
      filtered = filtered.filter(item => (item.itemsSold || 0) >= minSold);
    }
    
    return filtered;
  };

  const handleSearchProduct = async (
    query: string, 
    marketplaces: string[], 
    minRating: number, 
    condition: string,
    minSold: number | null
  ) => {
    setIsLoading(true);
    setSearchQuery(query);
    setCurrentMinRating(minRating);
    setCurrentCondition(condition);
    setCurrentMinSold(minSold);
    
    try {
      const data = await fetchPriceData(query, marketplaces);
      setPriceData(data);
      
      // Filter data by all criteria
      const filtered = filterData(data, minRating, condition, minSold);
      setFilteredPriceData(filtered);
      
      // Calculate recommended price based on filtered data
      const recommended = calculateRecommendedPrice(filtered);
      setRecommendedPrice(recommended);
      
      let filterDescription = "";
      if (minRating > 0 || condition !== "all" || (minSold !== null && minSold > 0)) {
        const filters = [];
        if (minRating > 0) filters.push(`${minRating}+ stars`);
        if (condition !== "all") filters.push(`${condition} condition`);
        if (minSold !== null && minSold > 0) filters.push(`${minSold}+ items sold`);
        
        filterDescription = ` with filters: ${filters.join(", ")}`;
      }
      
      toast({
        title: "Price Data Retrieved",
        description: `Found ${filtered.length} listings (from ${data.length} total)${filterDescription}.`,
        duration: 3000,
      });
    } catch (error) {
      console.error("Error fetching price data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch price data. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadSpreadsheet = () => {
    if (filteredPriceData.length === 0) {
      toast({
        title: "No Data",
        description: "No price data available to download.",
        variant: "destructive",
      });
      return;
    }
    
    const csvData = generateCSV(filteredPriceData, recommendedPrice);
    downloadCSV(csvData, `price_analysis_${searchQuery.replace(/[^a-zA-Z0-9]/g, '_')}`);
    
    toast({
      title: "Spreadsheet Downloaded",
      description: "Your price analysis spreadsheet has been downloaded.",
    });
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Price Whisperer</h1>
          <p className="text-muted-foreground mt-1">
            Analyze competitor pricing and optimize your profit margins
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ProductSearch onSearchProduct={handleSearchProduct} isLoading={isLoading} />
          </div>
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <PriceAnalysis 
                data={filteredPriceData} 
                recommendedPrice={recommendedPrice} 
                onDownloadSpreadsheet={handleDownloadSpreadsheet} 
              />
              
              <ProfitCalculator recommendedPrice={recommendedPrice} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
