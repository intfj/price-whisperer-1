
export interface PriceDataForExport {
  id: string;
  marketplace: string;
  seller: string;
  price: number;
  condition: string;
  rating?: number;
  shipping?: number;
  url: string;
  itemsSold?: number;
}

export const generateCSV = (data: PriceDataForExport[], recommendedPrice: number | null): string => {
  // Define the CSV header row
  const headers = [
    "Marketplace",
    "Seller",
    "Price",
    "Condition",
    "Rating",
    "Shipping Cost",
    "Items Sold",
    "Store URL"
  ];
  
  // Convert data to CSV rows
  const rows = data.map((item) => [
    item.marketplace,
    item.seller,
    item.price.toFixed(2),
    item.condition,
    item.rating?.toString() || "N/A",
    item.shipping?.toFixed(2) || "0.00",
    item.itemsSold?.toString() || "N/A",
    item.url
  ]);
  
  // Add summary row if we have a recommended price
  if (recommendedPrice !== null) {
    rows.push([
      "RECOMMENDED PRICE",
      "",
      recommendedPrice.toFixed(2),
      "",
      "",
      "",
      "",
      ""
    ]);
  }
  
  // Calculate average, min, max
  if (data.length > 0) {
    const prices = data.map(item => item.price);
    const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    rows.push(["ANALYSIS", "", "", "", "", "", "", ""]);
    rows.push(["Average Price", "", avgPrice.toFixed(2), "", "", "", "", ""]);
    rows.push(["Lowest Price", "", minPrice.toFixed(2), "", "", "", "", ""]);
    rows.push(["Highest Price", "", maxPrice.toFixed(2), "", "", "", "", ""]);
    
    // Add rating analysis if ratings are available
    const ratings = data
      .map(item => item.rating)
      .filter(rating => rating !== undefined) as number[];
      
    if (ratings.length > 0) {
      const avgRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
      rows.push(["Average Rating", "", "", "", avgRating.toFixed(1), "", "", ""]);
    }
    
    // Add items sold analysis if available
    const soldCounts = data
      .map(item => item.itemsSold)
      .filter(count => count !== undefined) as number[];
      
    if (soldCounts.length > 0) {
      const totalSold = soldCounts.reduce((sum, count) => sum + count, 0);
      const avgSold = totalSold / soldCounts.length;
      rows.push(["Total Items Sold", "", "", "", "", "", totalSold.toString(), ""]);
      rows.push(["Average Items Sold", "", "", "", "", "", avgSold.toFixed(0), ""]);
    }
  }
  
  // Combine headers and rows
  return [
    headers.join(","),
    ...rows.map(row => row.join(","))
  ].join("\n");
};

export const downloadCSV = (csvData: string, filename = "price_analysis"): void => {
  // Create a Blob containing the CSV data
  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  
  // Create a download link
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", `${filename}.csv`);
  
  // Append to body, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Revoke the object URL to free up memory
  URL.revokeObjectURL(link.href);
};
