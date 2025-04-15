
// Common interfaces for price data services

export interface PriceData {
  id: string;
  marketplace: string;
  seller: string;
  price: number;
  rating?: number;
  shipping?: number;
  condition: string;
  url: string;
  itemsSold?: number;
}

// Interface for API configuration
export interface MarketplaceApiConfig {
  name: string;
  apiBaseUrl: string;
  apiKey?: string;
  fetchFunction: (query: string, config: MarketplaceApiConfig) => Promise<PriceData[]>;
}

// Scraper API configuration
export interface ScraperApiConfig {
  name: string;
  apiBaseUrl: string;
  apiKey: string;
  supportedMarketplaces: string[];
}
