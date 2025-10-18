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

  // Start from a price close to current and gradually move towards it
  let price = currentPrice * 0.995; // Start very close to current price
  const targetPrice = currentPrice;
  const priceStep = (targetPrice - price) / count; // Gradual movement towards current price

  for (let i = count; i > 0; i--) {
    const time = Math.floor((now - i * timeframeMinutes * 60 * 1000) / 1000);
    const open = price;

    // Very small volatility for smooth movement
    const volatility = currentPrice * 0.0005;
    const change = (Math.random() - 0.5) * volatility;

    // Move gradually towards target price
    let close = open + change + priceStep;

    // For the last few candles, get very close to current price
    if (i <= 3) {
      close = targetPrice + (Math.random() - 0.5) * volatility * 0.5;
    }

    // Keep within reasonable bounds
    close = Math.max(open * 0.999, Math.min(open * 1.001, close));

    const highVariation = Math.random() * volatility * 0.2;
    const lowVariation = Math.random() * volatility * 0.2;

    const high = Math.max(open, close) + highVariation;
    const low = Math.min(open, close) - lowVariation;

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
  const [themeKey, setThemeKey] = useState(0); // Force re-render on theme change

  useEffect(() => {
    setChartType(propChartType);
  }, [propChartType]);

  // Watch for theme changes
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          setThemeKey(prev => prev + 1); // Force re-render
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!priceData) return;

    // Only generate historical data once when we first get price data
    if (candleData.length === 0) {
      const historicalData = generateHistoricalData(priceData.price, timeframe);
      setCandleData(historicalData);
    }
  }, [priceData, timeframe]);

  useEffect(() => {
    if (!chartContainerRef.current || candleData.length === 0) return;

    // Get CSS custom properties for current theme
    const styles = getComputedStyle(document.documentElement);
    const chartBg = styles.getPropertyValue('--chart').trim();
    const gridColor = styles.getPropertyValue('--grid').trim();
    const textColor = styles.getPropertyValue('--muted-foreground').trim();

    // Check if current theme is light (default theme)
    const classList = Array.from(document.documentElement.classList);
    const isLightTheme = !classList.some(cls => cls.includes('dark') || cls.includes('neon') || cls.includes('cyberpunk'));

    console.log('Theme detection:', {
      isLightTheme,
      classList,
      chartBg,
      gridColor,
      textColor
    });

    // Use specific light/dark colors based on theme
    const backgroundColor = isLightTheme ? '#FFFFFF' : '#131722';
    const gridLineColor = isLightTheme ? '#F0F0F0' : '#363A45';
    const chartTextColor = isLightTheme ? '#333333' : '#9598A1';

    // Create chart using theme colors
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor: chartTextColor,
        fontSize: 11,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: true,
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      grid: {
        vertLines: {
          color: gridLineColor,
          style: 2,
          visible: true,
        },
        horzLines: {
          color: gridLineColor,
          style: 2,
          visible: true,
        },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: chartTextColor,
          width: 1,
          style: 3,
        },
        horzLine: {
          color: chartTextColor,
          width: 1,
          style: 3,
        },
      },
      leftPriceScale: {
        visible: false,
        borderVisible: false,
      },
      rightPriceScale: {
        borderColor: gridLineColor,
        textColor: chartTextColor,
        width: 60,
        scaleMargins: {
          top: 0.005,
          bottom: 0.005,
        },
      },
      timeScale: {
        borderColor: gridLineColor,
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 0,
        leftOffset: 0,
        barSpacing: 8,
        minBarSpacing: 1,
        fixLeftEdge: true,
        fixRightEdge: false,
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

    // Força o gráfico a usar toda a largura disponível
    chart.timeScale().fitContent();

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [candleData, chartType, propChartType, themeKey]);

  // Update current price - create new candle every minute with real price
  useEffect(() => {
    if (!priceData || !candlestickSeriesRef.current || candleData.length === 0) return;

    const lastCandle = candleData[candleData.length - 1];
    const newPrice = priceData.price;
    const currentTime = Math.floor(Date.now() / (60 * 1000)) * 60; // Current minute timestamp

    // Only update if price change is reasonable (within 2% of last price)
    if (lastCandle && Math.abs(newPrice - lastCandle.close) / lastCandle.close < 0.02) {

      // If it's a new minute, create a new candle
      if (currentTime > lastCandle.time) {
        const newCandle = {
          time: currentTime,
          open: lastCandle.close,
          high: Math.max(lastCandle.close, newPrice),
          low: Math.min(lastCandle.close, newPrice),
          close: newPrice,
        };

        if (chartType === 'candlestick') {
          candlestickSeriesRef.current.update(newCandle);
        } else {
          candlestickSeriesRef.current.update({
            time: currentTime,
            value: newPrice,
          });
        }

        // Update our local data
        setCandleData(prev => [...prev, {
          time: currentTime,
          open: lastCandle.close,
          high: Math.max(lastCandle.close, newPrice),
          low: Math.min(lastCandle.close, newPrice),
          close: newPrice,
          volume: 1000 + Math.random() * 2000
        }]);
      } else {
        // Update current candle
        const updatedCandle = {
          time: lastCandle.time,
          open: lastCandle.open,
          high: Math.max(lastCandle.open, lastCandle.high, newPrice),
          low: Math.min(lastCandle.open, lastCandle.low, newPrice),
          close: newPrice,
        };

        if (chartType === 'candlestick') {
          candlestickSeriesRef.current.update(updatedCandle);
        } else {
          candlestickSeriesRef.current.update({
            time: lastCandle.time,
            value: newPrice,
          });
        }
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

  // Check if current theme is light for Card styling
  const classList = Array.from(document.documentElement.classList);
  const isLightTheme = !classList.some(cls => cls.includes('dark') || cls.includes('neon') || cls.includes('cyberpunk'));
  const cardClass = isLightTheme ? "bg-white border-gray-300" : "bg-card border-border";
  const headerClass = isLightTheme ? "bg-white border-gray-300" : "bg-card border-border";

  return (
    <Card className={`${cardClass} overflow-hidden h-full flex flex-col p-0`}>
      {/* TradingView Style Header */}
      <div className={`p-2 border-b ${headerClass} flex-shrink-0`}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-foreground font-bold text-lg">{asset}</span>
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          </div>
          {priceData && (
            <div className="flex items-center gap-4 text-sm">
              <span className="text-muted-foreground">O</span>
              <span className="text-muted-foreground">{formatPrice(candleData[0]?.open || priceData.price)}</span>
              <span className="text-muted-foreground">H</span>
              <span className="text-muted-foreground">{formatPrice(Math.max(...candleData.map(d => d.high), priceData.price))}</span>
              <span className="text-muted-foreground">L</span>
              <span className="text-muted-foreground">{formatPrice(Math.min(...candleData.map(d => d.low), priceData.price))}</span>
              <span className="text-muted-foreground">C</span>
              <span className="text-foreground font-bold">{formatPrice(priceData.price)}</span>
              <span className={`${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {change >= 0 ? '+' : ''}{formatPrice(change)} ({percentage >= 0 ? '+' : ''}{percentage.toFixed(2)}%)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className={`flex-1 flex flex-col min-h-0 ${cardClass}`}>
        {/* Main Price Chart */}
        <div className="flex-1 min-h-0">
          <div ref={chartContainerRef} className="w-full h-full relative" />
        </div>

        {/* TradingView Style Bottom Bar */}
        <div className={`border-t ${headerClass} p-1 flex items-center justify-between`}>
          {/* Asset and Timeframe Display (Fixed) */}
          <div className="flex items-center gap-4">
            <div className="text-muted-foreground text-xs">
              <span className="text-foreground font-medium">BTC/USD</span>
            </div>
            <div className="text-muted-foreground text-xs">
              <span className="text-foreground font-medium">1m</span>
            </div>
          </div>

          {/* Right side info */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>{new Date().toLocaleTimeString('pt-BR')} (UTC)</span>
          </div>
        </div>
      </div>
    </Card>
  );
};