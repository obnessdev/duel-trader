import { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import { Card } from '@/components/ui/card';
import { PriceData } from '@/types/trading';

interface WorkingChartProps {
  priceData: PriceData | null;
  isConnected: boolean;
  asset: string;
}

export const WorkingChart = ({ priceData, isConnected, asset }: WorkingChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        backgroundColor: 'transparent',
        textColor: '#d1d5db',
      },
      grid: {
        vertLines: {
          color: '#374151',
        },
        horzLines: {
          color: '#374151',
        },
      },
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderColor: '#485563',
      },
      timeScale: {
        borderColor: '#485563',
      },
    });

    chartRef.current = chart;

    // Try different methods to add candlestick series
    let series;
    try {
      // Method 1: Direct addCandlestickSeries
      series = chart.addCandlestickSeries({
        upColor: '#22c55e',
        downColor: '#ef4444',
        wickUpColor: '#22c55e',
        wickDownColor: '#ef4444',
      });
    } catch (error) {
      console.log('Method 1 failed, trying method 2');
      try {
        // Method 2: Line series fallback
        series = chart.addLineSeries({
          color: '#22c55e',
          lineWidth: 2,
        });
      } catch (error2) {
        console.log('Method 2 failed, trying method 3');
        // Method 3: Area series fallback
        series = chart.addAreaSeries({
          topColor: '#22c55e',
          bottomColor: 'rgba(34, 197, 94, 0.1)',
          lineColor: '#22c55e',
          lineWidth: 2,
        });
      }
    }

    // Generate sample data
    const data = [];
    const now = Math.floor(Date.now() / 1000);
    let price = priceData?.price || 67000;

    for (let i = -50; i <= 0; i++) {
      const time = now + i * 60;
      const open = price;
      const volatility = price * 0.001;
      const change = (Math.random() - 0.5) * volatility;
      const close = price + change;
      const high = Math.max(open, close) + Math.random() * volatility * 0.5;
      const low = Math.min(open, close) - Math.random() * volatility * 0.5;

      if (series.setData) {
        // For candlestick data
        data.push({ time, open, high, low, close });
      } else {
        // For line/area data
        data.push({ time, value: close });
      }
      price = close;
    }

    series.setData(data);

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: 400
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [priceData]);

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
          <div className="text-sm text-muted-foreground">
            TradingView Lightweight Charts v4.1.3
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0 p-4">
        <div ref={chartContainerRef} className="w-full h-full" />
      </div>
    </Card>
  );
};