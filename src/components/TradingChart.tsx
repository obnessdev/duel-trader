import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { ArrowUp, ArrowDown, TrendingUp } from 'lucide-react';
import { PriceData } from '@/types/trading';

interface TradingChartProps {
  priceData: PriceData | null;
  isConnected: boolean;
  asset: string;
}

export const TradingChart = ({ priceData, isConnected, asset }: TradingChartProps) => {
  const [priceHistory, setPriceHistory] = useState<number[]>([]);

  useEffect(() => {
    if (priceData) {
      setPriceHistory(prev => {
        const newHistory = [...prev, priceData.price];
        return newHistory.slice(-30);
      });
    }
  }, [priceData]);

  const formatPrice = (price: number) => {
    return price.toFixed(asset.includes('USDT') ? 2 : 8);
  };

  const isPositive = priceData && priceData.change24h >= 0;

  return (
    <Card className="glass-card p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">{asset}</h3>
            {!isConnected && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                <span className="text-xs text-muted-foreground">Connecting...</span>
              </div>
            )}
          </div>
          {priceData && (
            <div className={`flex items-center gap-1 ${isPositive ? 'text-success' : 'text-destructive'}`}>
              {isPositive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
              <span className="text-sm font-medium">{Math.abs(priceData.change24h).toFixed(2)}%</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="text-4xl font-bold tracking-tight">
            ${priceData ? formatPrice(priceData.price) : '---'}
          </div>
          
          <div className="h-24 flex items-end gap-1">
            {priceHistory.map((price, index) => {
              const maxPrice = Math.max(...priceHistory);
              const minPrice = Math.min(...priceHistory);
              const height = priceHistory.length > 1
                ? ((price - minPrice) / (maxPrice - minPrice)) * 100
                : 50;
              
              const prevPrice = index > 0 ? priceHistory[index - 1] : price;
              const isUp = price >= prevPrice;

              return (
                <div
                  key={index}
                  className={`flex-1 rounded-t transition-all duration-300 ${
                    isUp ? 'bg-success/50' : 'bg-destructive/50'
                  }`}
                  style={{ height: `${height}%` }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
};
