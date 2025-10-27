import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import { Card } from '@/components/ui/card';
import { calculateRSI, calculateMACD } from '@/utils/indicators';

interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface IndicatorChartProps {
  candleData: CandleData[];
  type: 'rsi' | 'macd';
  height?: number;
}

export const IndicatorChart = ({ candleData, type, height = 150 }: IndicatorChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const [themeKey, setThemeKey] = useState(0);

  // Watch for theme changes
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          setThemeKey(prev => prev + 1);
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
    if (!chartContainerRef.current || !candleData || candleData.length === 0) return;

    // Theme detection
    const classList = Array.from(document.documentElement.classList);
    const isLightTheme = !classList.some(cls => cls.includes('dark') || cls.includes('neon') || cls.includes('cyberpunk'));

    const backgroundColor = isLightTheme ? '#FFFFFF' : '#131722';
    const gridLineColor = isLightTheme ? '#F0F0F0' : '#363A45';
    const chartTextColor = isLightTheme ? '#333333' : '#9598A1';

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor: chartTextColor,
        fontSize: 10,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
      },
      width: chartContainerRef.current.clientWidth,
      height: height,
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
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      timeScale: {
        borderColor: gridLineColor,
        timeVisible: false,
        secondsVisible: false,
        rightOffset: 0,
        barSpacing: 8,
        minBarSpacing: 1,
        fixLeftEdge: true,
        fixRightEdge: false,
      },
    });

    chartRef.current = chart;

    if (type === 'rsi') {
      // RSI Chart
      const rsiData = calculateRSI(candleData, 14);

      if (rsiData.length === 0) return;

      const rsiSeries = chart.addLineSeries({
        color: '#FF9500',
        lineWidth: 2,
        title: 'RSI(14)'
      });

      rsiSeries.setData(rsiData as any);

      // Add horizontal lines for overbought/oversold levels
      const overboughtSeries = chart.addLineSeries({
        color: '#FF4444',
        lineWidth: 1,
        lineStyle: 2, // dashed
        title: 'Overbought (70)'
      });

      const oversoldSeries = chart.addLineSeries({
        color: '#00AA00',
        lineWidth: 1,
        lineStyle: 2, // dashed
        title: 'Oversold (30)'
      });

      // Create constant lines for 70 and 30
      if (rsiData.length > 0) {
        const overboughtData = rsiData.map(d => ({ time: d.time, value: 70 }));
        const oversoldData = rsiData.map(d => ({ time: d.time, value: 30 }));

        overboughtSeries.setData(overboughtData as any);
        oversoldSeries.setData(oversoldData as any);
      }

      // Set price scale range for RSI (0-100)
      chart.priceScale('right').applyOptions({
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
        mode: 1, // Normal mode
      });

    } else if (type === 'macd') {
      // MACD Chart
      const macdData = calculateMACD(candleData, 12, 26, 9);

      if (macdData.length === 0) return;

      // MACD Line
      const macdSeries = chart.addLineSeries({
        color: '#2196F3',
        lineWidth: 2,
        title: 'MACD'
      });

      // Signal Line
      const signalSeries = chart.addLineSeries({
        color: '#FF9800',
        lineWidth: 2,
        title: 'Signal'
      });

      // Histogram
      const histogramSeries = chart.addHistogramSeries({
        color: '#4CAF50',
        title: 'Histogram'
      });

      macdSeries.setData(macdData.map(d => ({ time: d.time, value: d.macd })) as any);
      signalSeries.setData(macdData.map(d => ({ time: d.time, value: d.signal })) as any);
      histogramSeries.setData(macdData.map(d => ({
        time: d.time,
        value: d.histogram,
        color: d.histogram >= 0 ? '#4CAF50' : '#F44336'
      })) as any);

      // Add zero line
      const zeroSeries = chart.addLineSeries({
        color: chartTextColor,
        lineWidth: 1,
        lineStyle: 2, // dashed
        title: 'Zero Line'
      });

      if (macdData.length > 0) {
        const zeroData = macdData.map(d => ({ time: d.time, value: 0 }));
        zeroSeries.setData(zeroData as any);
      }
    }

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: height,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [candleData, type, height, themeKey]);

  // Get title for the chart
  const getTitle = () => {
    switch (type) {
      case 'rsi':
        return 'RSI (14)';
      case 'macd':
        return 'MACD (12, 26, 9)';
      default:
        return '';
    }
  };

  // Check if current theme is light for Card styling
  const classList = Array.from(document.documentElement.classList);
  const isLightTheme = !classList.some(cls => cls.includes('dark') || cls.includes('neon') || cls.includes('cyberpunk'));
  const cardClass = isLightTheme ? "bg-white border-gray-300" : "bg-card border-border";
  const headerClass = isLightTheme ? "bg-white border-gray-300" : "bg-card border-border";

  return (
    <Card className={`${cardClass} overflow-hidden flex flex-col p-0`}>
      {/* Header */}
      <div className={`p-1 sm:p-2 border-b ${headerClass} flex-shrink-0`}>
        <h3 className="text-xs sm:text-sm font-semibold text-muted-foreground">{getTitle()}</h3>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0">
        <div ref={chartContainerRef} className="w-full h-full relative" />
      </div>
    </Card>
  );
};