import { Pencil, TrendingUp, Activity, BarChart3, LineChart, Crosshair, Type, Smile, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ChartSidebar = () => {
  const tools = [
    { icon: Crosshair, label: 'Cursor' },
    { icon: Pencil, label: 'Draw' },
    { icon: TrendingUp, label: 'Trend' },
    { icon: Activity, label: 'Indicators' },
    { icon: BarChart3, label: 'Bars' },
    { icon: LineChart, label: 'Line' },
    { icon: Type, label: 'Text' },
    { icon: Smile, label: 'Emoji' },
    { icon: Clock, label: 'Time' },
  ];

  return (
    <div className="w-12 bg-background border-r border-border/50 flex flex-col items-center py-4 gap-2">
      <div className="text-xs font-semibold mb-2 text-muted-foreground">1m</div>
      {tools.map((tool, index) => (
        <Button
          key={index}
          variant="ghost"
          size="icon"
          className="w-8 h-8 text-muted-foreground hover:text-foreground hover:bg-muted/50"
        >
          <tool.icon className="w-4 h-4" />
        </Button>
      ))}
    </div>
  );
};
