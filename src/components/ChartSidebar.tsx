import {
  MousePointer2,
  Activity,
  BarChart3,
  LineChart,
  Target,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface ChartSidebarProps {
  selectedTimeframe?: number;
  onTimeframeChange?: (timeframe: number) => void;
  selectedTool?: string;
  onToolChange?: (tool: string) => void;
  chartType?: 'candlestick' | 'line' | 'area';
  onChartTypeChange?: (type: 'candlestick' | 'line' | 'area') => void;
  showIndicators?: any;
  onToggleIndicator?: (indicator: string) => void;
  onAddAlert?: () => void;
}

export const ChartSidebar = ({
  selectedTimeframe = 1,
  onTimeframeChange,
  selectedTool = 'cursor',
  onToolChange,
  chartType = 'candlestick',
  onChartTypeChange,
  showIndicators,
  onToggleIndicator,
  onAddAlert
}: ChartSidebarProps) => {
  const [activeTool, setActiveTool] = useState(selectedTool);

  const timeframes = [
    { value: 1, label: '1m' },
    { value: 5, label: '5m' },
    { value: 15, label: '15m' },
    { value: 30, label: '30m' },
    { value: 60, label: '1h' },
    { value: 240, label: '4h' },
    { value: 1440, label: '1d' }
  ];

  const tools = [
    { id: 'cursor', icon: MousePointer2, label: 'Cursor' },
    { id: 'crosshair', icon: Target, label: 'Crosshair' },
    { id: 'alert', icon: AlertCircle, label: 'Alertas' }
  ];

  const chartTypes = [
    { id: 'candlestick', icon: BarChart3, label: 'Velas' },
    { id: 'line', icon: LineChart, label: 'Linha' },
    { id: 'area', icon: Activity, label: 'Área' }
  ];

  const indicators = [
    { id: 'bollinger', label: 'BB', name: 'Bollinger Bands' },
    { id: 'sma20', label: 'SMA', name: 'SMA(20)' },
    { id: 'ema20', label: 'EMA', name: 'EMA(20)' },
    { id: 'rsi', label: 'RSI', name: 'RSI(14)' },
    { id: 'macd', label: 'MACD', name: 'MACD' },
    { id: 'volume', label: 'VOL', name: 'Volume' }
  ];

  const handleToolClick = (toolId: string) => {
    setActiveTool(toolId);
    if (onToolChange) {
      onToolChange(toolId);
    }
    if (toolId === 'alert' && onAddAlert) {
      onAddAlert();
    }
  };

  return (
    <div className="w-12 bg-background border-r border-border/50 flex flex-col items-center py-3 gap-1 overflow-y-auto">

      {/* Chart Type */}
      <div className="flex flex-col items-center mb-3 border-b border-border/30 pb-2">
        <div className="text-[10px] text-muted-foreground mb-1">Tipo</div>
        {chartTypes.map((type) => (
          <Button
            key={type.id}
            variant={chartType === type.id ? "default" : "ghost"}
            size="icon"
            className="w-8 h-8 mb-1"
            onClick={() => onChartTypeChange?.(type.id as any)}
            title={type.label}
          >
            <type.icon className="w-3 h-3" />
          </Button>
        ))}
      </div>

      {/* Tools */}
      <div className="flex flex-col items-center mb-3 border-b border-border/30 pb-2">
        <div className="text-[10px] text-muted-foreground mb-1">Tools</div>
        {tools.map((tool) => (
          <Button
            key={tool.id}
            variant={activeTool === tool.id ? "default" : "ghost"}
            size="icon"
            className="w-8 h-8 mb-1"
            onClick={() => handleToolClick(tool.id)}
            title={tool.label}
          >
            <tool.icon className="w-3 h-3" />
          </Button>
        ))}
      </div>

      {/* Indicators */}
      <div className="flex flex-col items-center">
        <div className="text-[10px] text-muted-foreground mb-1">Ind</div>
        {indicators.map((indicator) => (
          <Button
            key={indicator.id}
            variant={showIndicators?.[indicator.id] ? "default" : "ghost"}
            size="sm"
            className="w-8 h-6 text-[9px] p-0 mb-1"
            onClick={() => onToggleIndicator?.(indicator.id)}
            title={indicator.name}
          >
            {indicator.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
