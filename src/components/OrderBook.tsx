import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface OrderBookEntry {
  time: string;
  callCount: number;
  putCount: number;
  callAmount: number;
  putAmount: number;
}

interface OrderBookProps {
  isScanActive?: boolean;
  userBetAmount?: number;
  wasUserBetAccepted?: boolean;
}

export const OrderBook = ({
  isScanActive = false,
  userBetAmount = 0,
  wasUserBetAccepted = false
}: OrderBookProps) => {
  const [orders, setOrders] = useState<OrderBookEntry[]>([]);

  useEffect(() => {
    // Simulate order book data
    const generateOrders = () => {
      const now = new Date();
      const entries: OrderBookEntry[] = [];

      for (let i = 0; i < 8; i++) {
        const time = new Date(now.getTime() + i * 15000);
        entries.push({
          time: time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          callCount: Math.floor(Math.random() * 6) + 1,
          putCount: Math.floor(Math.random() * 6) + 1,
          callAmount: Math.floor(Math.random() * 500) + 50, // $50-$550
          putAmount: Math.floor(Math.random() * 500) + 50   // $50-$550
        });
      }

      setOrders(entries);
    };

    generateOrders();
    const interval = setInterval(generateOrders, 15000);

    return () => clearInterval(interval);
  }, []);

  const maxAmount = Math.max(...orders.flatMap(o => [o.callAmount, o.putAmount]), 1);

  return (
    <div className="relative">
      {isScanActive && (
        <div className="absolute inset-0 z-20 rounded-lg bg-background border-2 border-blue-500 p-4">
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="text-lg font-bold text-blue-400 animate-pulse">
              🔍 PROCESSANDO APOSTAS
            </div>
          </div>
        </div>
      )}

      <Card className="bg-background border-border/50 p-4 relative">
        <div className="text-center mb-4">
          <h3 className="text-sm font-semibold">Order Book</h3>
        </div>

            {/* CALL Section - Vai subir */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <Badge className="bg-success text-white px-3 py-1">CALL - Vai Subir ↗</Badge>
                <span className="text-xs text-muted-foreground">Apostas/Valor</span>
              </div>
              <div className="space-y-1">
                {orders.slice(0, 4).map((order, index) => {
                  const callWidth = Math.max((order.callAmount / maxAmount) * 100, 15); // Mínimo 15%
                  return (
                    <div key={`call-${index}`} className="flex items-center gap-2 text-xs h-6">
                      <span className="text-muted-foreground text-[10px] w-14">{order.time}</span>
                      <div className="flex-1 relative">
                        <div
                          className="h-5 bg-green-500/70 border border-green-500 transition-all rounded"
                          style={{ width: `${callWidth}%` }}
                        />
                        <div className="absolute inset-0 flex items-center justify-between px-2">
                          <span className="text-success font-bold text-[10px]">{order.callCount}</span>
                          <span className="text-success font-bold text-[10px]">${order.callAmount}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-border/50 my-3"></div>

            {/* PUT Section - Vai cair */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <Badge className="bg-destructive text-white px-3 py-1">PUT - Vai Cair ↘</Badge>
                <span className="text-xs text-muted-foreground">Apostas/Valor</span>
              </div>
              <div className="space-y-1">
                {orders.slice(4, 8).map((order, index) => {
                  const putWidth = Math.max((order.putAmount / maxAmount) * 100, 15); // Mínimo 15%
                  return (
                    <div key={`put-${index}`} className="flex items-center gap-2 text-xs h-6">
                      <span className="text-muted-foreground text-[10px] w-14">{order.time}</span>
                      <div className="flex-1 relative">
                        <div
                          className="h-5 bg-destructive/60 border border-destructive/80 transition-all rounded"
                          style={{ width: `${putWidth}%` }}
                        />
                        <div className="absolute inset-0 flex items-center justify-between px-2">
                          <span className="text-destructive font-bold text-[10px]">{order.putCount}</span>
                          <span className="text-destructive font-bold text-[10px]">${order.putAmount}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

        <div className="pt-3 border-t border-border/50 text-center">
          <span className="text-xs text-success font-semibold">AI ORDER EQUALIZER</span>
        </div>
      </Card>
    </div>
  );
};