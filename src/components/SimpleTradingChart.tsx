import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import { Card } from '@/components/ui/card';
import { PriceData } from '@/types/trading';

interface SimpleTradingChartProps {
  priceData: PriceData | null;
  isConnected: boolean;
  asset: string;
}

interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

const generateHistoricalData = (currentPrice: number, count: number = 50): CandleData[] => {
  const data: CandleData[] = [];
  const now = Date.now();
  let price = currentPrice * 0.95;

  for (let i = count; i > 0; i--) {
    const time = Math.floor((now - i * 60 * 1000) / 1000);
    const open = price;

    const volatility = currentPrice * 0.002;
    const change = (Math.random() - 0.5) * volatility * 2;
    const close = Math.max(open * 0.98, Math.min(open * 1.02, open + change));

    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;

    data.push({
      time,
      open,
      high,
      low,
      close
    });

    price = close;
  }

  return data.sort((a, b) => a.time - b.time);
};

export const SimpleTradingChart = ({ priceData, isConnected, asset }: SimpleTradingChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const [candleData, setCandleData] = useState<CandleData[]>([]);

  useEffect(() => {
    if (!priceData) return;

    // Generate initial historical data
    if (candleData.length === 0) {
      const historicalData = generateHistoricalData(priceData.price);
      setCandleData(historicalData);
    }
  }, [priceData, candleData.length]);

  useEffect(() => {
    if (!chartContainerRef.current || candleData.length === 0) return;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#d1d5db',
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      grid: {
        vertLines: { color: '#374151' },
        horzLines: { color: '#374151' },
      },
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderColor: '#485563',
      },
      timeScale: {
        borderColor: '#485563',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    chartRef.current = chart;

    // Add candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });

    // Set data
    const chartData = candleData.map(d => ({
      time: d.time,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
    }));

    candlestickSeries.setData(chartData as any);

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chart) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [candleData]);

  return (
    <Card className="bg-background border-border/50 overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border/50 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">{asset.replace('USDT', '')}</span>
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-600 animate-pulse' : 'bg-red-600'}`}></div>
            </div>
            {priceData && (
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Preço Atual</div>
                <div className="text-xl font-bold">${priceData.price.toFixed(2)}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0">
        <div ref={chartContainerRef} className="w-full h-full" />
      </div>
    </Card>
  );
};