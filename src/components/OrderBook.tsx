import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

interface OrderBookEntry {
  id: number;
  time: string;
  count: number;
  type: 'call' | 'put';
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
  const [callOrders, setCallOrders] = useState<OrderBookEntry[]>([]);
  const [putOrders, setPutOrders] = useState<OrderBookEntry[]>([]);
  const [callTotal, setCallTotal] = useState(6.00);
  const [putTotal, setPutTotal] = useState(14.00);

  useEffect(() => {
    // Simulate order book data similar to the screenshot
    const generateOrders = () => {
      const now = new Date();

      // Generate CALL orders (3 orders)
      const newCallOrders: OrderBookEntry[] = [
        {
          id: 1,
          time: '23:49:07',
          count: 1,
          type: 'call'
        },
        {
          id: 2,
          time: '23:49:21',
          count: 2,
          type: 'call'
        },
        {
          id: 3,
          time: '23:49:35',
          count: 3,
          type: 'call'
        }
      ];

      // Generate PUT orders (4 orders)
      const newPutOrders: OrderBookEntry[] = [
        {
          id: 4,
          time: '23:49:17',
          count: 4,
          type: 'put'
        },
        {
          id: 5,
          time: '23:49:26',
          count: 5,
          type: 'put'
        },
        {
          id: 6,
          time: '23:49:40',
          count: 6,
          type: 'put'
        },
        {
          id: 2,
          time: '23:49:52',
          count: 2,
          type: 'put'
        }
      ];

      setCallOrders(newCallOrders);
      setPutOrders(newPutOrders);
    };

    generateOrders();
    const interval = setInterval(generateOrders, 10000);

    return () => clearInterval(interval);
  }, []);

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

      <Card className="bg-background border-border/50 p-3 h-full flex flex-col" data-onboarding="orderbook">
        {/* Header */}
        <div className="text-center mb-3">
          <h3 className="text-sm font-semibold text-muted-foreground">Order Book</h3>
        </div>

        <div className="flex-1 flex flex-col space-y-3">
          {/* CALL Section - Green orders */}
          <div className="space-y-1">
            {callOrders.map((order) => {
              const width = (order.count * 15) + 30; // Width based on count
              return (
                <div key={`call-${order.id}`} className="flex items-center gap-2 text-xs">
                  <span className="text-green-400 font-bold w-4 text-left">{order.count}</span>
                  <div className="flex-1 relative">
                    <div
                      className="h-5 bg-green-600/90 rounded transition-all flex items-center justify-end pr-2"
                      style={{ width: `${Math.min(width, 95)}%` }}
                    >
                      <span className="text-white text-xs font-medium">{order.time}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Middle Section - VS */}
          <div className="border border-border/50 rounded-lg p-2">
            <div className="flex items-center justify-between text-center">
              <span className="text-green-400 font-bold text-sm">${callTotal.toFixed(2)}</span>
              <span className="text-muted-foreground text-xs font-bold">VS</span>
              <span className="text-red-400 font-bold text-sm">${putTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* PUT Section - Red orders */}
          <div className="space-y-1">
            {putOrders.map((order) => {
              const width = (order.count * 15) + 30; // Width based on count
              return (
                <div key={`put-${order.id}`} className="flex items-center gap-2 text-xs">
                  <span className="text-red-400 font-bold w-4 text-left">{order.count}</span>
                  <div className="flex-1 relative">
                    <div
                      className="h-5 bg-red-600/90 rounded transition-all flex items-center justify-end pr-2"
                      style={{ width: `${Math.min(width, 95)}%` }}
                    >
                      <span className="text-white text-xs font-medium">{order.time}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="text-center mt-auto">
            <span className="text-xs text-blue-400 font-semibold">AI EQUALIZER ORDER</span>
          </div>
        </div>
      </Card>
    </div>
  );
};