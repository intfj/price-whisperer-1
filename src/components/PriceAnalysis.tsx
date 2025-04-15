
import React from "react";
import { ChevronsDown, ChevronsUp, BarChart3, Download, ExternalLink, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

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

interface PriceAnalysisProps {
  data: PriceData[];
  recommendedPrice: number | null;
  onDownloadSpreadsheet: () => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

const PriceAnalysis: React.FC<PriceAnalysisProps> = ({ 
  data, 
  recommendedPrice,
  onDownloadSpreadsheet 
}) => {
  const averagePrice = data.length > 0 
    ? data.reduce((sum, item) => sum + item.price, 0) / data.length 
    : 0;
  
  const lowestPrice = data.length > 0 
    ? Math.min(...data.map(item => item.price)) 
    : 0;
  
  const highestPrice = data.length > 0 
    ? Math.max(...data.map(item => item.price)) 
    : 0;

  const chartData = data.map(item => ({
    seller: item.seller.length > 12 ? item.seller.substring(0, 12) + '...' : item.seller,
    price: item.price,
    marketplace: item.marketplace
  }));

  const renderStarRating = (rating?: number) => {
    if (!rating) return "N/A";
    
    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star 
            key={i} 
            size={14} 
            className={i < (rating || 0) 
              ? "text-yellow-500 fill-yellow-500" 
              : "text-muted-foreground"
            } 
          />
        ))}
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 size={20} className="text-brand-500" />
            Price Analysis
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onDownloadSpreadsheet}>
            <Download size={16} className="mr-1" /> Download
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground">Average Price</p>
                    <span className="text-xl font-bold">{formatCurrency(averagePrice)}</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <ChevronsDown size={16} className="text-green-500 mr-1" />
                      <p className="text-sm font-medium text-muted-foreground">Lowest Price</p>
                    </div>
                    <span className="text-xl font-bold text-green-500">{formatCurrency(lowestPrice)}</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <ChevronsUp size={16} className="text-red-500 mr-1" />
                      <p className="text-sm font-medium text-muted-foreground">Highest Price</p>
                    </div>
                    <span className="text-xl font-bold text-red-500">{formatCurrency(highestPrice)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {recommendedPrice && (
              <div className="bg-secondary p-4 rounded-md">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Recommended Price</h3>
                    <p className="text-sm text-muted-foreground">Based on market analysis</p>
                  </div>
                  <Badge variant="default" className="text-lg px-3 py-1 bg-brand-500">
                    {formatCurrency(recommendedPrice)}
                  </Badge>
                </div>
              </div>
            )}

            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="seller" 
                    angle={-45} 
                    textAnchor="end" 
                    height={70} 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    tickFormatter={(value) => `$${value}`} 
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value) => [`$${value}`, 'Price']}
                    labelFormatter={(value) => `Seller: ${value}`}
                  />
                  <Bar 
                    dataKey="price" 
                    fill="#0080e6" 
                    name="Price" 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="overflow-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marketplace</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sold</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{item.marketplace}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{item.seller}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{formatCurrency(item.price)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{item.condition}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {renderStarRating(item.rating)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {item.itemsSold ? `${item.itemsSold.toLocaleString()}` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <a 
                          href={item.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center text-blue-600 hover:underline"
                        >
                          Visit <ExternalLink size={14} className="ml-1" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {window.location.search ? 
                "No sellers match your filters. Try adjusting your filter criteria." : 
                "Search for a product to see price analysis"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PriceAnalysis;
