import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PriceData } from '@/types/trading';

interface AdvancedTradingChartProps {
  priceData: PriceData | null;
  isConnected: boolean;
  asset: string;
  timeframe?: number;
  chartType?: 'candlestick' | 'line' | 'area';
  showIndicators?: any;
  onToggleIndicator?: (indicator: string) => void;
  onAddAlert?: () => void;
}

interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

const generateHistoricalData = (currentPrice: number, timeframeMinutes: number = 1, count: number = 100): CandleData[] => {
  const data: CandleData[] = [];
  const now = Date.now();
  let price = currentPrice * 0.95;

  for (let i = count; i > 0; i--) {
    const time = Math.floor((now - i * timeframeMinutes * 60 * 1000) / 1000);
    const open = price;

    const volatility = currentPrice * 0.002;
    const change = (Math.random() - 0.5) * volatility * 2;
    const close = Math.max(open * 0.98, Math.min(open * 1.02, open + change));

    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;

    const volume = 1000 + Math.random() * 2000;

    data.push({
      time,
      open,
      high,
      low,
      close,
      volume
    });

    price = close;
  }

  return data.sort((a, b) => a.time - b.time);
};

export const AdvancedTradingChart = ({
  priceData,
  isConnected,
  asset,
  timeframe = 1,
  chartType: propChartType = 'candlestick',
}: AdvancedTradingChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const candlestickSeriesRef = useRef<any>(null);

  const [candleData, setCandleData] = useState<CandleData[]>([]);
  const [chartType, setChartType] = useState<'candlestick' | 'line' | 'area'>(propChartType);

  useEffect(() => {
    setChartType(propChartType);
  }, [propChartType]);

  useEffect(() => {
    if (!priceData) return;

    // Generate initial historical data or regenerate when timeframe changes
    const historicalData = generateHistoricalData(priceData.price, timeframe);
    setCandleData(historicalData);
  }, [priceData, timeframe]);

  useEffect(() => {
    if (!chartContainerRef.current || candleData.length === 0) return;

    // Create chart using TradingView style
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#131722' },
        textColor: '#9598A1',
        fontSize: 11,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      grid: {
        vertLines: {
          color: '#363A45',
          style: 2,
          visible: true,
        },
        horzLines: {
          color: '#363A45',
          style: 2,
          visible: true,
        },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: '#9598A1',
          width: 1,
          style: 3,
        },
        horzLine: {
          color: '#9598A1',
          width: 1,
          style: 3,
        },
      },
      rightPriceScale: {
        borderColor: '#363A45',
        textColor: '#9598A1',
        scaleMargins: {
          top: 0.08,
          bottom: 0.05,
        },
      },
      timeScale: {
        borderColor: '#363A45',
        timeVisible: true,
        secondsVisible: false,
        tickMarkFormatter: (time: any) => {
          const date = new Date(time * 1000);
          return date.toLocaleDateString('en-US', { month: 'short' });
        },
      },
    });

    chartRef.current = chart;

    // Create series based on chart type - TradingView colors
    let mainSeries;
    if (chartType === 'candlestick') {
      mainSeries = chart.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
      });
    } else if (chartType === 'line') {
      mainSeries = chart.addLineSeries({
        color: '#2962FF',
        lineWidth: 2,
      });
    } else if (chartType === 'area') {
      mainSeries = chart.addAreaSeries({
        topColor: 'rgba(41, 98, 255, 0.4)',
        bottomColor: 'rgba(41, 98, 255, 0.1)',
        lineColor: '#2962FF',
        lineWidth: 2,
      });
    }

    candlestickSeriesRef.current = mainSeries;

    // Set data based on chart type
    let chartData;
    if (chartType === 'candlestick') {
      chartData = candleData.map(d => ({
        time: d.time,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
      }));
    } else {
      // For line and area charts, only use close price
      chartData = candleData.map(d => ({
        time: d.time,
        value: d.close,
      }));
    }

    mainSeries.setData(chartData);

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [candleData, chartType]);

  // Update current price
  useEffect(() => {
    if (!priceData || !candlestickSeriesRef.current) return;

    const now = Math.floor(Date.now() / 1000);
    const lastCandle = candleData[candleData.length - 1];

    if (lastCandle) {
      const newPrice = priceData.price;
      const updatedCandle = {
        time: now,
        open: lastCandle.close,
        high: Math.max(lastCandle.close, newPrice),
        low: Math.min(lastCandle.close, newPrice),
        close: newPrice,
      };

      if (chartType === 'candlestick') {
        candlestickSeriesRef.current.update(updatedCandle);
      } else {
        candlestickSeriesRef.current.update({
          time: now,
          value: newPrice,
        });
      }
    }
  }, [priceData, chartType, candleData]);

  const formatPrice = (price: number) => price.toFixed(2);
  const calculateChange = () => {
    if (!priceData || candleData.length === 0) return { change: 0, percentage: 0 };
    const firstPrice = candleData[0]?.open || priceData.price;
    const change = priceData.price - firstPrice;
    const percentage = (change / firstPrice) * 100;
    return { change, percentage };
  };

  const { change, percentage } = calculateChange();

  return (
    <Card className="bg-[#131722] border-[#363A45] overflow-hidden h-full flex flex-col">
      {/* TradingView Style Header */}
      <div className="p-3 border-b border-[#363A45] flex-shrink-0 bg-[#131722]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-lg">{asset}</span>
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-[#26a69a]' : 'bg-[#ef5350]'}`}></div>
          </div>
          {priceData && (
            <div className="flex items-center gap-4 text-sm">
              <span className="text-[#9598A1]">O</span>
              <span className="text-[#9598A1]">{formatPrice(candleData[0]?.open || priceData.price)}</span>
              <span className="text-[#9598A1]">H</span>
              <span className="text-[#9598A1]">{formatPrice(Math.max(...candleData.map(d => d.high), priceData.price))}</span>
              <span className="text-[#9598A1]">L</span>
              <span className="text-[#9598A1]">{formatPrice(Math.min(...candleData.map(d => d.low), priceData.price))}</span>
              <span className="text-[#9598A1]">C</span>
              <span className="text-white font-bold">{formatPrice(priceData.price)}</span>
              <span className={`${change >= 0 ? 'text-[#26a69a]' : 'text-[#ef5350]'}`}>
                {change >= 0 ? '+' : ''}{formatPrice(change)} ({percentage >= 0 ? '+' : ''}{percentage.toFixed(2)}%)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 flex flex-col min-h-0 bg-[#131722]">
        {/* Main Price Chart */}
        <div className="flex-1 min-h-0">
          <div ref={chartContainerRef} className="w-full h-full" />
        </div>

        {/* TradingView Style Bottom Bar */}
        <div className="border-t border-[#363A45] bg-[#131722] p-2 flex items-center justify-between">
          {/* Asset and Timeframe Display (Fixed) */}
          <div className="flex items-center gap-4">
            <div className="text-[#9598A1] text-xs">
              <span className="text-white font-medium">BTC/USD</span>
            </div>
            <div className="text-[#9598A1] text-xs">
              <span className="text-white font-medium">1m</span>
            </div>
          </div>

          {/* Right side info */}
          <div className="flex items-center gap-4 text-xs text-[#9598A1]">
            <span>{new Date().toLocaleTimeString('pt-BR')} (UTC)</span>
          </div>
        </div>
      </div>
    </Card>
  );
};