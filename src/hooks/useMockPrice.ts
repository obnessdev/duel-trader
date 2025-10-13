import { useState, useEffect, useRef } from 'react';
import { PriceData } from '@/types/trading';

interface MockPriceConfig {
  symbol: string;
  basePrice: number;
  volatility: number;
  trendStrength: number;
}

const ASSET_CONFIGS: Record<string, MockPriceConfig> = {
  btcusdt: { symbol: 'BTCUSDT', basePrice: 67500, volatility: 200, trendStrength: 0.3 },
  ethusdt: { symbol: 'ETHUSDT', basePrice: 3250, volatility: 50, trendStrength: 0.4 },
  bnbusdt: { symbol: 'BNBUSDT', basePrice: 615, volatility: 15, trendStrength: 0.35 },
  solusdt: { symbol: 'SOLUSDT', basePrice: 145, volatility: 5, trendStrength: 0.5 },
};

export const useMockPrice = (symbol: string) => {
  const [priceData, setPriceData] = useState<PriceData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();
  const trendRef = useRef(1); // 1 = alta, -1 = baixa
  const trendDurationRef = useRef(0);
  const initialPriceRef = useRef<number>(0);

  useEffect(() => {
    const config = ASSET_CONFIGS[symbol.toLowerCase()] || ASSET_CONFIGS.btcusdt;
    
    // Preço inicial aleatório próximo ao base
    const startPrice = config.basePrice + (Math.random() - 0.5) * config.volatility * 2;
    initialPriceRef.current = startPrice;
    
    // Simula conexão
    setTimeout(() => {
      setIsConnected(true);
    }, 500);

    // Gera variação de preço
    const generatePrice = () => {
      const config = ASSET_CONFIGS[symbol.toLowerCase()] || ASSET_CONFIGS.btcusdt;
      
      // Muda tendência periodicamente
      trendDurationRef.current++;
      if (trendDurationRef.current > 30 + Math.random() * 50) {
        trendRef.current = Math.random() > 0.5 ? 1 : -1;
        trendDurationRef.current = 0;
      }

      setPriceData(prevData => {
        const currentPrice = prevData?.price || startPrice;
        
        // Variação baseada em tendência + volatilidade aleatória
        const trend = trendRef.current * config.trendStrength;
        const randomVolatility = (Math.random() - 0.5) * config.volatility;
        const change = trend + randomVolatility * 0.1;
        
        // Novo preço com limites
        const newPrice = Math.max(
          config.basePrice * 0.85,
          Math.min(
            config.basePrice * 1.15,
            currentPrice + change
          )
        );

        // Calcula mudança 24h (baseado no inicial)
        const change24h = ((newPrice - initialPriceRef.current) / initialPriceRef.current) * 100;

        return {
          price: newPrice,
          timestamp: Date.now(),
          change24h: parseFloat(change24h.toFixed(2))
        };
      });
    };

    // Primeira atualização imediata
    generatePrice();

    // Atualiza preço a cada 2 segundos
    intervalRef.current = setInterval(() => {
      generatePrice();
    }, 2000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [symbol]);

  return { priceData, isConnected };
};

