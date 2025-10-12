import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface OrderBookEntry {
  time: string;
  callCount: number;
  putCount: number;
}

export const OrderBook = () => {
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
          putCount: Math.floor(Math.random() * 6) + 1
        });
      }
      
      setOrders(entries);
    };

    generateOrders();
    const interval = setInterval(generateOrders, 15000);
    
    return () => clearInterval(interval);
  }, []);

  const maxCount = Math.max(...orders.flatMap(o => [o.callCount, o.putCount]), 1);

  return (
    <Card className="bg-background border-border/50 p-4">
      <div className="flex items-center justify-center gap-3 mb-4">
        <Badge className="bg-success text-white px-3 py-1">CALL</Badge>
        <h3 className="text-sm font-semibold">Order Book</h3>
        <Badge className="bg-destructive text-white px-3 py-1">PUT</Badge>
      </div>

      <div className="space-y-0.5">
        {orders.map((order, index) => {
          const callWidth = (order.callCount / maxCount) * 100;
          const putWidth = (order.putCount / maxCount) * 100;
          
          return (
            <div key={index} className="grid grid-cols-[1fr,auto,1fr] items-center gap-3 text-xs h-7">
              {/* CALL side */}
              <div className="flex items-center justify-end gap-2">
                <span className="text-success font-bold w-4 text-right">{order.callCount}</span>
                <span className="text-muted-foreground text-[10px] w-16 text-right">{order.time}</span>
                <div className="flex-1 flex justify-end">
                  <div 
                    className="h-6 bg-success/30 transition-all"
                    style={{ width: `${callWidth}%` }}
                  />
                </div>
              </div>

              {/* Center divider */}
              <div className="w-px h-6 bg-border/50" />

              {/* PUT side */}
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <div 
                    className="h-6 bg-destructive/30 transition-all"
                    style={{ width: `${putWidth}%` }}
                  />
                </div>
                <span className="text-muted-foreground text-[10px] w-16">{order.time}</span>
                <span className="text-destructive font-bold w-4">{order.putCount}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-border/50 text-center">
        <span className="text-xs text-success font-semibold">AI ORDER EQUALIZER</span>
      </div>
    </Card>
  );
};
