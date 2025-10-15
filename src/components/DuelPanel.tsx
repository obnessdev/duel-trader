import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUp, ArrowDown, Clock, DollarSign, Plus, Minus } from 'lucide-react';
import { Direction } from '@/types/trading';
import { useToast } from '@/hooks/use-toast';
import { OrderBook } from '@/components/OrderBook';

interface DuelPanelProps {
  asset: string;
  currentPrice: number;
  onStartDuel: (direction: Direction, amount: number) => void;
  isActive: boolean;
  isEqualizerActive?: boolean;
  bets?: Array<{
    id: string;
    username: string;
    amount: number;
    direction: 'CALL' | 'PUT';
    timestamp: number;
    status: 'pending' | 'accepted' | 'rejected';
  }>;
  availableLiquidity?: number;
  onScanComplete?: (acceptedBets: any[], rejectedBets: any[]) => void;
}

export const DuelPanel = ({
  asset,
  currentPrice,
  onStartDuel,
  isActive,
  isEqualizerActive = false,
  bets = [],
  availableLiquidity = 10000,
  onScanComplete
}: DuelPanelProps) => {
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

  const incrementAmount = () => {
    const current = parseFloat(amount) || 0;
    const newAmount = Math.min(current + 1, 1000);
    setAmount(newAmount.toString());
  };

  const decrementAmount = () => {
    const current = parseFloat(amount) || 0;
    const newAmount = Math.max(current - 1, 1);
    setAmount(newAmount.toString());
  };

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  return (
    <div className="space-y-4">
      <Card className="bg-background border-border/50 p-6">
        <div className="space-y-4">
          <div className="space-y-3">
            <label className="text-sm text-muted-foreground flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Valor da Aposta
            </label>

            {/* Input com botões + e - */}
            <div className="relative">
              <Button
                variant="outline"
                size="icon"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 h-12 w-12 rounded-full"
                onClick={decrementAmount}
                disabled={isActive || parseFloat(amount) <= 1}
                type="button"
              >
                <Minus className="w-4 h-4" />
              </Button>

              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isActive}
                className="text-3xl font-bold h-16 text-center bg-muted/50 border-border/50 px-16 cursor-text"
                min="1"
                max="1000"
                step="1"
                placeholder="Digite o valor..."
              />

              <Button
                variant="outline"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 h-12 w-12 rounded-full"
                onClick={incrementAmount}
                disabled={isActive || parseFloat(amount) >= 1000}
                type="button"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Botões de valores rápidos */}
            <div className="flex gap-2 justify-center">
              {[5, 10, 25, 50, 100].map((value) => (
                <Button
                  key={value}
                  variant="ghost"
                  size="sm"
                  className="text-xs px-3 py-1 h-7 bg-muted/30 hover:bg-muted/60"
                  onClick={() => handleQuickAmount(value)}
                  disabled={isActive}
                  type="button"
                >
                  ${value}
                </Button>
              ))}
            </div>

            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Taxa (5%): ${fee.toFixed(2)}</span>
              <span>Total: ${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Duration
            </label>
            <div className="px-3 py-2 bg-muted/50 border border-border/50 rounded text-sm font-medium text-center">
              1 minuto (fixo)
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => handleStartDuel('CALL')}
              disabled={isActive}
              className="h-32 bg-green-600 hover:bg-green-700 text-white transition-all disabled:opacity-50"
            >
              <div className="flex flex-col items-center gap-2">
                <ArrowUp className="w-10 h-10" />
                <div className="space-y-1">
                  <div className="font-bold text-2xl">CALL</div>
                  <div className="text-xs opacity-90">Preço vai subir ↗</div>
                </div>
              </div>
            </Button>

            <Button
              onClick={() => handleStartDuel('PUT')}
              disabled={isActive}
              className="h-32 bg-red-600 hover:bg-red-700 text-white transition-all disabled:opacity-50"
            >
              <div className="flex flex-col items-center gap-2">
                <ArrowDown className="w-10 h-10" />
                <div className="space-y-1">
                  <div className="font-bold text-2xl">PUT</div>
                  <div className="text-xs opacity-90">Preço vai cair ↘</div>
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

      <OrderBook
        isScanActive={isEqualizerActive}
        userBetAmount={bets.find(bet => bet.username === 'Você')?.amount || 0}
        wasUserBetAccepted={true} // Sempre aceitar para simplicidade
      />
    </div>
  );
};
