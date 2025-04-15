
import { MarketplaceApiConfig } from "../types/priceDataTypes";

// Helper function to construct marketplace URLs
export function constructMarketplaceUrl(marketplace: string, query: string): string {
  const encodedQuery = encodeURIComponent(query);
  
  switch (marketplace) {
    case 'amazon':
      return `https://www.amazon.com/s?k=${encodedQuery}`;
    case 'ebay':
      return `https://www.ebay.com/sch/i.html?_nkw=${encodedQuery}`;
    case 'walmart':
      return `https://www.walmart.com/search?q=${encodedQuery}`;
    case 'etsy':
      return `https://www.etsy.com/search?q=${encodedQuery}`;
    case 'argos':
      return `https://www.argos.co.uk/search/${encodedQuery}`;
    case 'johnlewis':
      return `https://www.johnlewis.com/search?search-term=${encodedQuery}`;
    case 'currys':
      return `https://www.currys.co.uk/search?q=${encodedQuery}`;
    default:
      return `https://www.google.com/search?q=${encodedQuery}+${marketplace}`;
  }
}

// Calculate recommended price based on market analysis
export const calculateRecommendedPrice = (data: any[]): number | null => {
  if (data.length === 0) return null;
  
  // Get the prices and adjust by adding shipping costs
  const adjustedPrices = data.map(item => {
    return item.price + (item.shipping || 0);
  });
  
  // Sort prices from low to high
  adjustedPrices.sort((a, b) => a - b);
  
  // Strategy: Position the price at 25% from the lowest price point
  const lowestPrice = adjustedPrices[0];
  const highestPrice = adjustedPrices[adjustedPrices.length - 1];
  const priceRange = highestPrice - lowestPrice;
  
  // Calculate a price that's competitive but not the lowest
  // Target a price point 25% into the range from the lowest
  const recommendedPrice = lowestPrice + (priceRange * 0.25);
  
  // Round to 2 decimal places
  return Math.round(recommendedPrice * 100) / 100;
};
