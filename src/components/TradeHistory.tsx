import { Card } from '@/components/ui/card';
import { Trade } from '@/types/trading';
import { ArrowUp, ArrowDown, TrendingUp, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface TradeHistoryProps {
  trades: Trade[];
}

export const TradeHistory = ({ trades }: TradeHistoryProps) => {
  const stats = {
    total: trades.length,
    wins: trades.filter(t => t.result === 'win').length,
    losses: trades.filter(t => t.result === 'loss').length,
    totalProfit: trades.reduce((sum, t) => sum + (t.profit || 0), 0)
  };

  const winRate = stats.total > 0 ? (stats.wins / stats.total * 100).toFixed(1) : '0';

  return (
    <Card className="glass-card p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Trade History
          </h3>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Total Trades</div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Win Rate</div>
            <div className="text-2xl font-bold text-success">{winRate}%</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Wins</div>
            <div className="text-2xl font-bold text-success">{stats.wins}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Total P&L</div>
            <div className={`text-2xl font-bold ${stats.totalProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
              ${stats.totalProfit.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {trades.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No trades yet. Start your first duel!
            </div>
          ) : (
            trades.slice().reverse().map((trade) => (
              <div
                key={trade.id}
                className={`p-4 rounded-lg border transition-all ${
                  trade.result === 'win'
                    ? 'border-success/30 bg-success/5'
                    : 'border-destructive/30 bg-destructive/5'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      trade.direction === 'CALL' ? 'bg-success/20' : 'bg-destructive/20'
                    }`}>
                      {trade.direction === 'CALL' ? (
                        <ArrowUp className="w-4 h-4 text-success" />
                      ) : (
                        <ArrowDown className="w-4 h-4 text-destructive" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold">{trade.asset}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(trade.startTime, { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${
                      trade.result === 'win' ? 'text-success' : 'text-destructive'
                    }`}>
                      {trade.result === 'win' ? '+' : ''}{trade.profit?.toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ${trade.entryPrice.toFixed(2)} → ${trade.exitPrice?.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
};
