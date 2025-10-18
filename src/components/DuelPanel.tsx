import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Direction } from '@/types/trading';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from '@/translations';

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
  onRoundComplete?: () => void;
  onEqualizerActivate?: () => void;
}

export const DuelPanel = ({
  asset,
  currentPrice,
  onStartDuel,
  isActive,
  isEqualizerActive = false,
  bets = [],
  availableLiquidity = 10000,
  onRoundComplete,
  onEqualizerActivate
}: DuelPanelProps) => {
  const [amount, setAmount] = useState<string>('10');
  const [timeLeft, setTimeLeft] = useState(60); // Timer de 1 minuto
  const { toast } = useToast();
  const { language } = useLanguage();
  const t = useTranslation(language);

  // Timer de 1 minuto rodando automaticamente
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === 5 && isActive) {
          // Ativar AI Equalizer nos últimos 5 segundos usando setTimeout para evitar setState durante render
          setTimeout(() => {
            onEqualizerActivate?.();
          }, 0);
        }

        if (prev <= 1) {
          // Timer chegou a zero
          if (isActive) {
            // Se há apostas ativas, processar resultados usando setTimeout
            setTimeout(() => {
              onRoundComplete?.();
            }, 0);
          }
          return 60; // Reset para próxima rodada
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, onRoundComplete, onEqualizerActivate]);

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

  // Cálculos baseados no amount
  const numAmount = parseFloat(amount) || 0;
  const fee = numAmount * 0.05; // Taxa de 5%
  const payout = numAmount - fee; // $9.50 no exemplo (10 - 0.50)
  const winner = numAmount * 2; // $19 no exemplo (10 * 2 - taxa)

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

  // Formatar timer para mostrar minutos:segundos
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return { mins: mins.toString().padStart(2, '0'), secs: secs.toString().padStart(2, '0') };
  };

  const { mins, secs } = formatTime(timeLeft);

  return (
    <Card className="bg-background border-border/50 p-3 h-full flex flex-col">
      {/* Header */}
      <div className="text-center mb-3">
        <h3 className="text-sm font-semibold text-muted-foreground">{t('placeOrder')}</h3>
      </div>

      {/* Timer */}
      <div className="flex items-center justify-center gap-1 mb-4">
        <span className="text-2xl font-bold text-foreground">
          {mins}:{secs}
        </span>
      </div>

      {/* Amount Section */}
      <div className="mb-4">
        <label className="text-xs text-muted-foreground mb-2 block">{t('amount')}</label>
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-1 top-1/2 transform -translate-y-1/2 z-10 h-6 w-6 text-muted-foreground hover:text-foreground"
            onClick={decrementAmount}
            disabled={isActive || parseFloat(amount) <= 1}
            type="button"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="border border-border/50 rounded px-8 py-2 text-center">
            <span className="text-2xl font-bold">{amount}</span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 z-10 h-6 w-6 text-muted-foreground hover:text-foreground"
            onClick={incrementAmount}
            disabled={isActive || parseFloat(amount) >= 1000}
            type="button"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Rate and Values */}
      <div className="mb-4 space-y-2">
        <div className="text-xs text-muted-foreground">
          {t('rate')}: ${fee.toFixed(2)}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="border border-border/50 rounded p-2 text-center">
            <div className="text-lg font-bold">${payout.toFixed(2)}</div>
            <div className="text-[10px] text-muted-foreground">{t('payout')}</div>
          </div>
          <div className="border border-border/50 rounded p-2 text-center">
            <div className="text-lg font-bold">${winner.toFixed(0)}</div>
            <div className="text-[10px] text-muted-foreground">{t('winner')}</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 flex-1">
        <Button
          onClick={() => handleStartDuel('CALL')}
          disabled={isActive}
          className="h-12 btn-success-theme disabled:opacity-50 rounded text-lg font-bold"
        >
          {t('green')}
        </Button>

        <Button
          onClick={() => handleStartDuel('PUT')}
          disabled={isActive}
          className="h-12 btn-destructive-theme disabled:opacity-50 rounded text-lg font-bold"
        >
          {t('red')}
        </Button>
      </div>

      {isEqualizerActive && (
        <div className="text-center text-xs text-blue-400 animate-pulse mt-2">
          {t('equalizerActive')}
        </div>
      )}
    </Card>
  );
};
