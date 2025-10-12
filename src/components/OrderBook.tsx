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
    <Card className="glass-card p-4 mt-4">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Badge variant="outline" className="bg-success/10 text-success border-success/30">
          CALL
        </Badge>
        <h3 className="text-sm font-semibold">Order Book</h3>
        <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
          PUT
        </Badge>
      </div>

      <div className="space-y-1">
        {orders.map((order, index) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            <span className="w-16 text-muted-foreground">{order.time}</span>
            
            <div className="flex-1 flex gap-1">
              <div className="flex-1 flex justify-end items-center gap-1">
                <div 
                  className="h-5 bg-success/20 border-r-2 border-success transition-all"
                  style={{ width: `${(order.callCount / maxCount) * 100}%` }}
                />
                <span className="text-success font-semibold w-4 text-right">{order.callCount}</span>
              </div>
              
              <div className="flex-1 flex items-center gap-1">
                <span className="text-destructive font-semibold w-4">{order.putCount}</span>
                <div 
                  className="h-5 bg-destructive/20 border-l-2 border-destructive transition-all"
                  style={{ width: `${(order.putCount / maxCount) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border/50 text-center">
        <span className="text-xs text-primary font-semibold">AI ORDER EQUALIZER</span>
      </div>
    </Card>
  );
};
