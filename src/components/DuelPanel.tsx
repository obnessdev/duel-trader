import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowUp, ArrowDown, Clock, DollarSign } from 'lucide-react';
import { Direction } from '@/types/trading';
import { useToast } from '@/hooks/use-toast';

interface DuelPanelProps {
  asset: string;
  currentPrice: number;
  timeframe: number;
  onStartDuel: (direction: Direction, amount: number) => void;
  isActive: boolean;
}

export const DuelPanel = ({ asset, currentPrice, timeframe, onStartDuel, isActive }: DuelPanelProps) => {
  const [amount, setAmount] = useState<string>('10');
  const { toast } = useToast();

  const handleStartDuel = (direction: Direction) => {
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount) || numAmount < 1) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount (minimum $1)",
        variant: "destructive"
      });
      return;
    }

    if (numAmount > 1000) {
      toast({
        title: "Amount too high",
        description: "Maximum amount is $1000",
        variant: "destructive"
      });
      return;
    }

    onStartDuel(direction, numAmount);
  };

  const fee = parseFloat(amount) * 0.05;
  const total = parseFloat(amount) + fee;

  return (
    <Card className="glass-card p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Bet Amount
          </label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isActive}
            className="text-lg font-semibold"
            min="1"
            max="1000"
            step="1"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Fee (5%): ${fee.toFixed(2)}</span>
            <span>Total: ${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>Duration: {timeframe}m</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => handleStartDuel('CALL')}
            disabled={isActive}
            className="h-24 gradient-success glow-success hover:opacity-90 transition-all"
          >
            <div className="flex flex-col items-center gap-2">
              <ArrowUp className="w-8 h-8" />
              <div className="space-y-1">
                <div className="font-bold text-lg">CALL</div>
                <div className="text-xs opacity-80">Price will rise</div>
              </div>
            </div>
          </Button>

          <Button
            onClick={() => handleStartDuel('PUT')}
            disabled={isActive}
            className="h-24 gradient-destructive glow-destructive hover:opacity-90 transition-all"
          >
            <div className="flex flex-col items-center gap-2">
              <ArrowDown className="w-8 h-8" />
              <div className="space-y-1">
                <div className="font-bold text-lg">PUT</div>
                <div className="text-xs opacity-80">Price will fall</div>
              </div>
            </div>
          </Button>
        </div>

        {isActive && (
          <div className="text-center text-sm text-muted-foreground animate-pulse">
            Duel in progress...
          </div>
        )}
      </div>
    </Card>
  );
};
