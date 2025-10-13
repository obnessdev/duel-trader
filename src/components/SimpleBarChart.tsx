import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { PriceData } from '@/types/trading';

interface SimpleBarChartProps {
  priceData: PriceData | null;
  isConnected: boolean;
  asset: string;
}

export const SimpleBarChart = ({ priceData, isConnected, asset }: SimpleBarChartProps) => {
  const [bars, setBars] = useState<number[]>([]);

  useEffect(() => {
    // Gerar barras aleatórias entre 10 e 100
    const newBars = Array.from({ length: 40 }, () => Math.floor(Math.random() * 90) + 10);
    setBars(newBars);
  }, [priceData]);

  return (
    <Card className="bg-background border-border/50 overflow-hidden">
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{asset.replace('USDT', '')} · 1m · Exness</span>
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-600 animate-pulse' : 'bg-red-600'}`}></div>
          </div>
          <div className="text-sm font-semibold text-green-600">
            +{Math.floor(Math.random() * 1000)} (+{Math.floor(Math.random() * 10)}%)
          </div>
          <div className="text-xs text-muted-foreground">
            Vol: {Math.floor(Math.random() * 500)}
          </div>
          <div className="text-xs text-muted-foreground ml-auto">
            {bars.length} barras
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="h-[300px] flex items-end gap-1">
          {bars.map((height, i) => (
            <div
              key={i}
              className={`flex-1 rounded-t transition-all duration-500 ${
                Math.random() > 0.5 ? 'bg-green-600' : 'bg-red-600'
              }`}
              style={{
                height: `${height}%`,
                minHeight: '10px'
              }}
            />
          ))}
        </div>
      </div>
    </Card>
  );
};
