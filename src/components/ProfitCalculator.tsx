
import React, { useState, useEffect } from "react";
import { Calculator, ArrowRight, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";

interface ProfitCalculatorProps {
  recommendedPrice: number | null;
}

const ProfitCalculator: React.FC<ProfitCalculatorProps> = ({ recommendedPrice }) => {
  const [sellingPrice, setSellingPrice] = useState(recommendedPrice || 0);
  const [costPrice, setCostPrice] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [platformFee, setPlatformFee] = useState(10); // Default 10%
  const [profit, setProfit] = useState(0);
  const [profitMargin, setProfitMargin] = useState(0);
  const [roi, setRoi] = useState(0);

  useEffect(() => {
    if (recommendedPrice && recommendedPrice > 0) {
      setSellingPrice(recommendedPrice);
    }
  }, [recommendedPrice]);

  useEffect(() => {
    const calculateProfit = () => {
      const platformFeesAmount = (sellingPrice * platformFee) / 100;
      const totalCost = Number(costPrice) + Number(shippingCost) + platformFeesAmount;
      const profitAmount = sellingPrice - totalCost;
      
      setProfit(profitAmount);
      setProfitMargin(sellingPrice > 0 ? (profitAmount / sellingPrice) * 100 : 0);
      setRoi(totalCost > 0 ? (profitAmount / totalCost) * 100 : 0);
    };

    calculateProfit();
  }, [sellingPrice, costPrice, shippingCost, platformFee]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const getMarginColor = () => {
    if (profitMargin < 15) return "text-red-500";
    if (profitMargin < 30) return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator size={20} className="text-brand-500" />
          Profit Margin Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="selling-price">Selling Price ($)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                <Input
                  id="selling-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(parseFloat(e.target.value) || 0)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cost-price">Product Cost ($)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                <Input
                  id="cost-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={costPrice}
                  onChange={(e) => setCostPrice(parseFloat(e.target.value) || 0)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="shipping-cost">Shipping Cost ($)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                <Input
                  id="shipping-cost"
                  type="number"
                  min="0"
                  step="0.01"
                  value={shippingCost}
                  onChange={(e) => setShippingCost(parseFloat(e.target.value) || 0)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="platform-fee">Platform Fee (%)</Label>
                <span className="text-sm text-muted-foreground">{platformFee}%</span>
              </div>
              <Slider
                id="platform-fee"
                min={0}
                max={40}
                step={0.5}
                value={[platformFee]}
                onValueChange={(value) => setPlatformFee(value[0])}
              />
            </div>
          </div>
          
          <div className="bg-muted rounded-lg p-4 space-y-4">
            <h3 className="font-medium text-lg">Profit Analysis</h3>
            
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Costs</span>
                <span>{formatCurrency(Number(costPrice) + Number(shippingCost) + ((sellingPrice * platformFee) / 100))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Revenue</span>
                <span>{formatCurrency(sellingPrice)}</span>
              </div>
              <div className="border-t my-2"></div>
              <div className="flex justify-between font-medium">
                <span>Net Profit</span>
                <span className={profit < 0 ? "text-red-500" : "text-green-500"}>
                  {formatCurrency(profit)}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Profit Margin</span>
                <span className={`font-medium ${getMarginColor()}`}>
                  {profitMargin.toFixed(2)}%
                </span>
              </div>
              <Progress value={profitMargin > 100 ? 100 : profitMargin} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Return on Investment (ROI)</span>
                <span className="font-medium">
                  {roi.toFixed(2)}%
                </span>
              </div>
              <Progress value={roi > 100 ? 100 : roi} className="h-2" />
            </div>
            
            <div className="mt-4 p-3 border border-dashed rounded-md">
              <div className="flex items-center gap-2">
                <DollarSign size={18} className="text-brand-500" />
                <div>
                  <p className="text-sm font-medium">Breakeven Price</p>
                  <p className="text-xs text-muted-foreground">Minimum selling price to make profit</p>
                </div>
                <ArrowRight size={16} className="ml-auto text-muted-foreground" />
                <span className="font-medium">
                  {formatCurrency((Number(costPrice) + Number(shippingCost)) / (1 - platformFee / 100))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfitCalculator;
