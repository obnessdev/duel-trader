import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { PriceData } from '@/types/trading';

interface TradingChartProps {
  priceData: PriceData | null;
  isConnected: boolean;
  asset: string;
}

interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Gera histórico inicial de candles com mais variação
const generateInitialCandles = (currentPrice: number, count: number = 50): Candle[] => {
  const candles: Candle[] = [];
  const now = new Date();
  let price = currentPrice * 0.97; // Começa 3% abaixo
  
  for (let i = count; i > 0; i--) {
    const candleTime = new Date(now.getTime() - i * 60 * 1000);
    const time = candleTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    const open = price;
    
    // Variação maior para velas mais visíveis
    const volatility = currentPrice * 0.003; // 0.3% de volatilidade
    const trend = (Math.random() - 0.5) * 0.8; // Mais variação
    const change = trend * volatility + (Math.random() - 0.5) * volatility * 1.2;
    const close = Math.max(price * 0.985, Math.min(price * 1.015, price + change));
    
    // High e Low com mais variação
    const bodySize = Math.abs(close - open);
    const wickSize = bodySize * (1 + Math.random() * 3); // Wicks maiores
    
    const high = Math.max(open, close) + Math.random() * wickSize * 0.8;
    const low = Math.min(open, close) - Math.random() * wickSize * 0.8;
    
    // Volume baseado no movimento
    const priceMovement = Math.abs(close - open) / open;
    const baseVolume = 150 + Math.random() * 300;
    const volume = baseVolume * (1 + priceMovement * 8);
    
    candles.push({
      time,
      open,
      high,
      low,
      close,
      volume
    });
    
    price = close;
  }
  
  return candles;
};

export const TradingChart = ({ priceData, isConnected, asset }: TradingChartProps) => {
  const [candles, setCandles] = useState<Candle[]>([]);
  const [initialized, setInitialized] = useState(false);

  // Inicializa com histórico realista
  useEffect(() => {
    if (priceData && !initialized) {
      const initialCandles = generateInitialCandles(priceData.price);
      setCandles(initialCandles);
      setInitialized(true);
    }
  }, [priceData, initialized]);

  useEffect(() => {
    if (!priceData || !initialized) return;

    const now = new Date();
    const time = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    setCandles(prev => {
      const newCandles = [...prev];
      
      if (newCandles.length === 0) {
        return [{
          time,
          open: priceData.price,
          high: priceData.price,
          low: priceData.price,
          close: priceData.price,
          volume: 100 + Math.random() * 100
        }];
      }
      
      const lastCandle = newCandles[newCandles.length - 1];
      
      if (lastCandle.time !== time) {
        // Novo candle
        const open = lastCandle.close;
        const volatility = priceData.price * 0.001;
        const change = (Math.random() - 0.5) * volatility;
        const close = Math.max(open * 0.995, Math.min(open * 1.005, priceData.price));
        
        const high = Math.max(open, close) + Math.random() * volatility * 0.5;
        const low = Math.min(open, close) - Math.random() * volatility * 0.5;
        
        newCandles.push({
          time,
          open,
          high,
          low,
          close,
          volume: 100 + Math.random() * 200
        });
      } else {
        // Atualiza candle atual
        lastCandle.high = Math.max(lastCandle.high, priceData.price);
        lastCandle.low = Math.min(lastCandle.low, priceData.price);
        lastCandle.close = priceData.price;
        
        // Volume aumenta com movimento
        const priceMovement = Math.abs(priceData.price - lastCandle.open) / lastCandle.open;
        lastCandle.volume = 100 + Math.random() * 100 + priceMovement * 1000;
      }

      // Manter apenas últimos 60 candles
      if (newCandles.length > 60) {
        newCandles.shift();
      }

      return newCandles;
    });
  }, [priceData, initialized]);

  if (!initialized || candles.length === 0) {
    return (
      <Card className="bg-background border-border/50 flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Carregando gráfico...</p>
        </div>
      </Card>
    );
  }

  const maxPrice = Math.max(...candles.map(c => c.high));
  const minPrice = Math.min(...candles.map(c => c.low));
  const priceRange = maxPrice - minPrice || 1;
  const maxVolume = Math.max(...candles.map(c => c.volume));

  const getY = (price: number) => {
    return ((maxPrice - price) / priceRange) * 100;
  };

  const firstPrice = candles[0]?.open || 0;
  const lastPrice = candles[candles.length - 1]?.close || 0;
  const priceChange = lastPrice - firstPrice;
  const priceChangePercent = (priceChange / firstPrice) * 100;
  const isPositive = priceChange >= 0;

  return (
    <Card className="bg-background border-border/50 overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border/50 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">{asset.replace('USDT', '')}</span>
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-600 animate-pulse' : 'bg-red-600'}`}></div>
            </div>
            <div className={`text-lg font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}{priceChange.toFixed(2)} ({isPositive ? '+' : ''}{priceChangePercent.toFixed(2)}%)
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Último Preço</div>
            <div className="text-xl font-bold">{lastPrice.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="flex-1 relative p-4 min-h-0">
        <div className="h-full relative">
          {/* Price Grid Lines */}
          <div className="absolute inset-0">
            {[0, 25, 50, 75, 100].map(percent => (
              <div
                key={percent}
                className="absolute w-full border-t border-border/20"
                style={{ top: `${percent}%` }}
              >
                <span className="absolute right-0 -translate-y-1/2 text-xs text-muted-foreground bg-background px-1">
                  {(maxPrice - (priceRange * percent / 100)).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Japanese Candlesticks */}
          <div className="absolute inset-0 flex items-end gap-2 px-4">
            {candles.map((candle, i) => {
              const isGreen = candle.close >= candle.open;
              const bodyTop = Math.min(getY(candle.open), getY(candle.close));
              const bodyHeight = Math.abs(getY(candle.close) - getY(candle.open));
              const wickTop = getY(candle.high);
              const wickBottom = getY(candle.low);

              return (
                <div key={i} className="flex-1 relative group" style={{ minWidth: '12px', maxWidth: '24px' }}>
                  {/* Upper Wick */}
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 w-[3px] ${isGreen ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{
                      top: `${wickTop}%`,
                      height: `${Math.max(bodyTop - wickTop, 0)}%`
                    }}
                  />
                  
                  {/* Lower Wick */}
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 w-[3px] ${isGreen ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{
                      top: `${Math.min(bodyTop + bodyHeight, 100)}%`,
                      height: `${Math.max(wickBottom - (bodyTop + bodyHeight), 0)}%`
                    }}
                  />
                  
                  {/* Candle Body - Main */}
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 w-full transition-all duration-200 ${
                      isGreen
                        ? 'bg-green-500 hover:bg-green-400'
                        : 'bg-red-500 hover:bg-red-400'
                    }`}
                    style={{
                      top: `${bodyTop}%`,
                      height: `${Math.max(bodyHeight, 4)}%`,
                      minHeight: '4px'
                    }}
                  />
                  
                  {/* Candle Body - Border */}
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 w-full transition-all duration-200 ${
                      isGreen 
                        ? 'border border-green-400' 
                        : 'border border-red-400'
                    }`}
                    style={{
                      top: `${bodyTop}%`,
                      height: `${Math.max(bodyHeight, 4)}%`,
                      minHeight: '4px'
                    }}
                  />
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 pointer-events-none">
                    <div className="bg-popover text-popover-foreground text-xs p-2 rounded shadow-lg border border-border whitespace-nowrap">
                      <div className="font-semibold mb-1">{candle.time}</div>
                      <div className={isGreen ? 'text-green-500' : 'text-red-500'}>
                        <div>O: ${candle.open.toFixed(2)}</div>
                        <div>H: ${candle.high.toFixed(2)}</div>
                        <div>L: ${candle.low.toFixed(2)}</div>
                        <div>C: ${candle.close.toFixed(2)}</div>
                      </div>
                      <div className="mt-1 border-t border-border pt-1 text-muted-foreground">
                        V: {candle.volume.toFixed(0)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Current Price Line */}
          {priceData && (
            <div 
              className="absolute right-0 flex items-center z-10"
              style={{ top: `${getY(priceData.price)}%` }}
            >
              <div className="h-[2px] w-full bg-blue-500 border-t-2 border-dashed border-blue-500" />
              <div className="bg-blue-600 text-white text-sm px-2 py-1 rounded-l font-bold">
                {priceData.price.toFixed(2)}
              </div>
            </div>
          )}

          {/* Time Labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-muted-foreground">
            {candles.filter((_, i) => i % Math.ceil(candles.length / 8) === 0).map((candle, i) => (
              <span key={i}>{candle.time}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Volume Chart */}
      <div className="h-20 border-t border-border/50 p-2 flex-shrink-0">
        <div className="h-full flex items-end gap-1 px-2">
          {candles.map((candle, i) => {
            const isGreen = candle.close >= candle.open;
            return (
              <div key={i} className="flex-1 flex items-end justify-center" style={{ minWidth: '8px', maxWidth: '20px' }}>
                <div
                  className={`w-full transition-all rounded-t ${isGreen ? 'bg-green-600/50 hover:bg-green-600/70' : 'bg-red-600/50 hover:bg-red-600/70'}`}
                  style={{ height: `${(candle.volume / maxVolume) * 100}%`, minHeight: '3px' }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};