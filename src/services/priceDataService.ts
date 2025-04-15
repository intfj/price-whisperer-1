
import { PriceData, MarketplaceApiConfig } from "@/types/priceDataTypes";
import { fetchDataWithScraperApi } from "@/services/scraperService";
import { 
  mockFetchAmazon 
} from "@/services/marketplaces/amazonService";
import { 
  mockFetchEbay 
} from "@/services/marketplaces/ebayService";
import { 
  mockFetchEtsy, 
  mockFetchArgos, 
  mockFetchJohnLewis, 
  mockFetchCurrys 
} from "@/services/marketplaces/otherMarketplaceServices";
import { calculateRecommendedPrice } from "@/utils/priceDataUtils";

const scraperConfig = {
  name: 'Scraper API',
  apiBaseUrl: 'https://api.scraperapi.com/v1',
  apiKey: '32f9326539f91b64524c0dbf72b48153', // ScraperAPI key
  supportedMarketplaces: ['amazon', 'ebay', 'walmart', 'etsy', 'argos', 'johnlewis', 'currys']
};

const mockDataFunctions = {
  amazon: (query: string, config: MarketplaceApiConfig) => mockFetchAmazon(query, {
    ...config,
    apiBaseUrl: `https://www.amazon.com/s?k=${encodeURIComponent(query)}`,
    fetchFunction: mockFetchAmazon
  }),
  ebay: (query: string, config: MarketplaceApiConfig) => mockFetchEbay(query, {
    ...config,
    apiBaseUrl: `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}`,
    fetchFunction: mockFetchEbay
  }),
  etsy: (query: string, config: MarketplaceApiConfig) => mockFetchEtsy(query, {
    ...config,
    apiBaseUrl: `https://www.etsy.com/search?q=${encodeURIComponent(query)}`,
    fetchFunction: mockFetchEtsy
  }),
  argos: (query: string, config: MarketplaceApiConfig) => mockFetchArgos(query, {
    ...config,
    apiBaseUrl: `https://www.argos.co.uk/search/${encodeURIComponent(query)}`,
    fetchFunction: mockFetchArgos
  }),
  johnlewis: (query: string, config: MarketplaceApiConfig) => mockFetchJohnLewis(query, {
    ...config,
    apiBaseUrl: `https://www.johnlewis.com/search?search-term=${encodeURIComponent(query)}`,
    fetchFunction: mockFetchJohnLewis
  }),
  currys: (query: string, config: MarketplaceApiConfig) => mockFetchCurrys(query, {
    ...config,
    apiBaseUrl: `https://www.currys.co.uk/search?q=${encodeURIComponent(query)}`,
    fetchFunction: mockFetchCurrys
  })
};

export async function fetchPriceData(
  query: string, 
  marketplaces: string[]
): Promise<PriceData[]> {
  try {
    const data = await fetchDataWithScraperApi(
      query, 
      marketplaces, 
      scraperConfig, 
      (query: string, marketplace: string) => {
        const mockFunc = mockDataFunctions[marketplace as keyof typeof mockDataFunctions];
        return mockFunc ? mockFunc(query, { name: marketplace }) : Promise.resolve([]);
      }
    );
    
    return data;
  } catch (error) {
    console.error('Error fetching price data:', error);
    
    // Fallback to mock data if scraper fails
    const fallbackData: PriceData[] = [];
    for (const marketplace of marketplaces) {
      const mockFunc = mockDataFunctions[marketplace as keyof typeof mockDataFunctions];
      if (mockFunc) {
        const marketplaceData = await mockFunc(query, { name: marketplace });
        fallbackData.push(...marketplaceData);
      }
    }
    
    return fallbackData;
  }
}

// Export calculateRecommendedPrice for use in Index.tsx
export { calculateRecommendedPrice };
