import { useState, useEffect, useRef } from 'react';
import { PriceData } from '@/types/trading';

export const useBinancePrice = (symbol: string) => {
  const [priceData, setPriceData] = useState<PriceData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const connectWebSocket = () => {
      try {
        const formattedSymbol = symbol.toLowerCase();
        const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${formattedSymbol}@ticker`);
        
        ws.onopen = () => {
          console.log('WebSocket connected');
          setIsConnected(true);
        };

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          setPriceData({
            price: parseFloat(data.c),
            timestamp: data.E,
            change24h: parseFloat(data.P)
          });
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          setIsConnected(false);
        };

        ws.onclose = () => {
          console.log('WebSocket closed');
          setIsConnected(false);
          setTimeout(connectWebSocket, 3000);
        };

        wsRef.current = ws;
      } catch (error) {
        console.error('Error connecting to Binance:', error);
      }
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [symbol]);

  return { priceData, isConnected };
};
