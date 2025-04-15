
import { PriceData, ScraperApiConfig } from "../types/priceDataTypes";
import { constructMarketplaceUrl } from "../utils/priceDataUtils";
import { parseAmazonHtml } from "./marketplaces/amazonService";
import { parseEbayHtml } from "./marketplaces/ebayService";
import { parseWalmartHtml } from "./marketplaces/walmartService";
import { parseGenericHtml } from "./marketplaces/otherMarketplaceServices";

// Function to fetch data using a scraper API
export async function fetchDataWithScraperApi(
  query: string, 
  marketplaces: string[], 
  scraperConfig: ScraperApiConfig,
  fetchMockDataForMarketplace: (query: string, marketplace: string) => Promise<PriceData[]>
): Promise<PriceData[]> {
  // Check if we have an API key
  if (!scraperConfig.apiKey || scraperConfig.apiKey === "YOUR_SCRAPER_API_KEY_HERE") {
    console.warn(`No API key provided for ${scraperConfig.name}. Using mock data instead.`);
    // Fall back to mock data
    return fetchMockDataForMarketplaces(query, marketplaces, fetchMockDataForMarketplace);
  }
  
  console.log(`Fetching data from ${scraperConfig.name} for marketplaces: ${marketplaces.join(", ")}`);
  
  const allResults: PriceData[] = [];
  
  // Process each marketplace in sequence to avoid rate limiting issues
  for (const marketplace of marketplaces) {
    if (!scraperConfig.supportedMarketplaces.includes(marketplace)) {
      console.warn(`${scraperConfig.name} does not support ${marketplace}`);
      continue;
    }
    
    try {
      // Construct the target URL for scraping based on the marketplace
      const targetUrl = constructMarketplaceUrl(marketplace, query);
      
      console.log(`Scraping data from ${targetUrl}`);
      
      // Create scraper API request
      const apiUrl = `${scraperConfig.apiBaseUrl}/scrape?api_key=${scraperConfig.apiKey}&url=${encodeURIComponent(targetUrl)}&render=true`;
      
      console.log(`Making API request to: ${apiUrl}`);
      
      // Make the actual API request
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'text/html',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        console.error(`ScraperAPI request failed with status: ${response.status}`);
        const errorText = await response.text();
        console.error(`Error details: ${errorText}`);
        throw new Error(`ScraperAPI request failed with status: ${response.status}`);
      }
      
      const htmlContent = await response.text();
      console.log(`Received HTML content of length: ${htmlContent.length}`);
      
      // Process the HTML content and extract product data
      const products = extractProductsFromHtml(htmlContent, marketplace);
      
      console.log(`Extracted ${products.length} products from ${marketplace}`);
      
      if (products.length === 0) {
        console.warn(`No products extracted from ${marketplace}, falling back to mock data`);
        const mockData = await fetchMockDataForMarketplace(query, marketplace);
        
        // Add marketplace identifier to each product
        const mockDataWithMarketplace = mockData.map(product => ({
          ...product,
          marketplace: product.marketplace || marketplace.charAt(0).toUpperCase() + marketplace.slice(1)
        }));
        
        allResults.push(...mockDataWithMarketplace);
      } else {
        // Add marketplace identifier to each product if not already present
        const productsWithMarketplace = products.map(product => ({
          ...product,
          marketplace: product.marketplace || marketplace.charAt(0).toUpperCase() + marketplace.slice(1)
        }));
        
        // Add results to the collection
        allResults.push(...productsWithMarketplace);
      }
      
      // Add a small delay between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1500));
      
    } catch (error) {
      console.error(`Error fetching data for ${marketplace}:`, error);
      // Fall back to mock data for this marketplace
      const mockData = await fetchMockDataForMarketplace(query, marketplace);
      allResults.push(...mockData);
    }
  }
  
  return allResults;
}

// Extract product data from HTML content
export function extractProductsFromHtml(html: string, marketplace: string): PriceData[] {
  console.log(`Parsing HTML content for ${marketplace}...`);
  
  // Create a document from the HTML string to parse it
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // Different parsing logic based on marketplace
  switch (marketplace) {
    case 'amazon':
      return parseAmazonHtml(doc);
    case 'ebay':
      return parseEbayHtml(doc);
    case 'walmart':
      return parseWalmartHtml(doc);
    default:
      return parseGenericHtml(doc, marketplace);
  }
}

// Fetch mock data for multiple marketplaces
async function fetchMockDataForMarketplaces(
  query: string, 
  marketplaces: string[],
  fetchMockDataForMarketplace: (query: string, marketplace: string) => Promise<PriceData[]>
): Promise<PriceData[]> {
  const fetchPromises = marketplaces.map(marketplace => fetchMockDataForMarketplace(query, marketplace));
  const results = await Promise.all(fetchPromises);
  return results.flat();
}
