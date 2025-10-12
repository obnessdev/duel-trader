import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { PriceData } from '@/types/trading';

interface CandlestickChartProps {
  priceData: PriceData | null;
  isConnected: boolean;
  asset: string;
}

interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export const CandlestickChart = ({ priceData, isConnected, asset }: CandlestickChartProps) => {
  const [candles, setCandles] = useState<Candle[]>([]);
  const [priceChange, setPriceChange] = useState({ value: 0, percent: 0 });

  useEffect(() => {
    if (!priceData) return;

    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    setCandles(prev => {
      const newCandles = [...prev];
      
      if (newCandles.length === 0 || newCandles[newCandles.length - 1].time !== time) {
        // New candle
        newCandles.push({
          time,
          open: priceData.price,
          high: priceData.price,
          low: priceData.price,
          close: priceData.price,
          volume: Math.random() * 50 + 10
        });
      } else {
        // Update current candle
        const lastCandle = newCandles[newCandles.length - 1];
        lastCandle.high = Math.max(lastCandle.high, priceData.price);
        lastCandle.low = Math.min(lastCandle.low, priceData.price);
        lastCandle.close = priceData.price;
      }

      if (newCandles.length > 30) {
        newCandles.shift();
      }

      // Calculate price change
      if (newCandles.length > 0) {
        const firstPrice = newCandles[0].open;
        const change = priceData.price - firstPrice;
        const changePercent = (change / firstPrice) * 100;
        setPriceChange({ value: change, percent: changePercent });
      }

      return newCandles;
    });
  }, [priceData]);

  const maxPrice = Math.max(...candles.map(c => c.high), 0);
  const minPrice = Math.min(...candles.map(c => c.low), Infinity);
  const priceRange = maxPrice - minPrice || 1;
  const maxVolume = Math.max(...candles.map(c => c.volume), 1);

  const getY = (price: number) => {
    return ((maxPrice - price) / priceRange) * 100;
  };

  const isPositive = priceChange.value >= 0;

  return (
    <Card className="bg-background border-border/50 overflow-hidden">
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{asset.replace('USDT', '')} · 1 · Exness</span>
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-success' : 'bg-destructive'}`}></div>
          </div>
          <div className={`text-sm font-semibold ${isPositive ? 'text-success' : 'text-destructive'}`}>
            {isPositive ? '+' : ''}{priceChange.value.toFixed(2)} ({isPositive ? '+' : ''}{priceChange.percent.toFixed(2)}%)
          </div>
          <div className="text-xs text-muted-foreground">
            Volume {candles[candles.length - 1]?.volume.toFixed(0) || '0'}
          </div>
        </div>
      </div>

      <div className="relative h-[400px] bg-chart">
        {/* Price Grid Lines */}
        <div className="absolute inset-0">
          {[0, 25, 50, 75, 100].map(percent => (
            <div
              key={percent}
              className="absolute w-full border-t border-grid/20"
              style={{ top: `${percent}%` }}
            >
              <span className="absolute right-2 -translate-y-1/2 text-[10px] text-muted-foreground">
                {(maxPrice - (priceRange * percent / 100)).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Candlesticks */}
        <div className="absolute inset-0 flex items-end px-8 pt-4 pb-24">
          {candles.map((candle, i) => {
            const isGreen = candle.close >= candle.open;
            const bodyTop = Math.min(getY(candle.open), getY(candle.close));
            const bodyHeight = Math.abs(getY(candle.close) - getY(candle.open)) || 1;
            const wickTop = getY(candle.high);
            const wickBottom = getY(candle.low);

            return (
              <div key={i} className="flex-1 relative" style={{ minWidth: '8px' }}>
                {/* Wick */}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 w-[1px] ${isGreen ? 'bg-success' : 'bg-destructive'}`}
                  style={{
                    top: `${wickTop}%`,
                    height: `${wickBottom - wickTop}%`
                  }}
                />
                {/* Body */}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 w-full max-w-[8px] ${
                    isGreen ? 'bg-success' : 'bg-destructive'
                  }`}
                  style={{
                    top: `${bodyTop}%`,
                    height: `${bodyHeight}%`,
                    minHeight: '2px'
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Volume Bars */}
        <div className="absolute bottom-0 left-0 right-0 h-20 flex items-end px-8 border-t border-border/50">
          {candles.map((candle, i) => {
            const isGreen = candle.close >= candle.open;
            return (
              <div key={i} className="flex-1 flex items-end justify-center" style={{ minWidth: '8px' }}>
                <div
                  className={`w-full max-w-[8px] ${isGreen ? 'bg-success/50' : 'bg-destructive/50'}`}
                  style={{ height: `${(candle.volume / maxVolume) * 100}%` }}
                />
              </div>
            );
          })}
        </div>

        {/* Time Labels */}
        <div className="absolute bottom-1 left-0 right-0 flex justify-between px-8 text-[10px] text-muted-foreground">
          {candles.filter((_, i) => i % 5 === 0).map((candle, i) => (
            <span key={i}>{candle.time}</span>
          ))}
        </div>

        {/* Current Price Indicator */}
        {priceData && (
          <div 
            className="absolute right-0 flex items-center"
            style={{ top: `${getY(priceData.price)}%` }}
          >
            <div className="h-[1px] w-full bg-primary/50 border-t border-dashed border-primary" />
            <div className="bg-destructive text-white text-xs px-2 py-0.5 rounded-l">
              {priceData.price.toFixed(2)}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
