import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { PriceData } from '@/types/trading';

interface CandlestickChartProps {
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

// Gera histórico inicial de candles com variação mais realista para velas japonesas
const generateInitialCandles = (currentPrice: number, count: number = 40): Candle[] => {
  const candles: Candle[] = [];
  const now = new Date();
  let price = currentPrice * 0.97; // Começa 3% abaixo do preço atual

  for (let i = count; i > 0; i--) {
    const candleTime = new Date(now.getTime() - i * 60 * 1000); // 1 minuto por candle
    const time = candleTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const open = price;

    // Variação maior para velas mais visíveis
    const volatility = currentPrice * 0.003; // 0.3% de volatilidade
    const trend = (Math.random() - 0.5) * 0.8; // Mais variação direcional
    const change = trend * volatility + (Math.random() - 0.5) * volatility * 1.2;
    const close = Math.max(price * 0.985, Math.min(price * 1.015, price + change));

    // High e Low com wicks mais realistas
    const bodySize = Math.abs(close - open);
    const wickSize = bodySize * (1 + Math.random() * 3); // Wicks maiores

    const high = Math.max(open, close) + Math.random() * wickSize * 0.8;
    const low = Math.min(open, close) - Math.random() * wickSize * 0.8;

    // Volume baseado no movimento da vela
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

    price = close; // Próximo candle começa onde o anterior fechou
  }

  return candles;
};

export const CandlestickChart = ({ priceData, isConnected, asset }: CandlestickChartProps) => {
  const [candles, setCandles] = useState<Candle[]>([]);
  const [priceChange, setPriceChange] = useState({ value: 0, percent: 0 });
  const [initialized, setInitialized] = useState(false);

  // Inicializa com histórico de candles
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
          volume: 50 + Math.random() * 100
        }];
      }
      
      const lastCandle = newCandles[newCandles.length - 1];
      
      if (lastCandle.time !== time) {
        // Novo candle - usa o close do anterior como open do novo
        newCandles.push({
          time,
          open: lastCandle.close,
          high: Math.max(lastCandle.close, priceData.price),
          low: Math.min(lastCandle.close, priceData.price),
          close: priceData.price,
          volume: 50 + Math.random() * 100
        });
      } else {
        // Atualiza candle atual
        lastCandle.high = Math.max(lastCandle.high, priceData.price);
        lastCandle.low = Math.min(lastCandle.low, priceData.price);
        lastCandle.close = priceData.price;

        // Volume aumenta com movimento
        const priceMovement = Math.abs(priceData.price - lastCandle.open) / lastCandle.open;
        lastCandle.volume = 150 + Math.random() * 200 + priceMovement * 1000;
      }

      // Mantém apenas últimos 50 candles
      if (newCandles.length > 50) {
        newCandles.shift();
      }

      // Calcula price change
      if (newCandles.length > 1) {
        const firstPrice = newCandles[0].open;
        const change = priceData.price - firstPrice;
        const changePercent = (change / firstPrice) * 100;
        setPriceChange({ value: change, percent: changePercent });
      }

      return newCandles;
    });
  }, [priceData, initialized]);

  const maxPrice = Math.max(...candles.map(c => c.high), 0);
  const minPrice = Math.min(...candles.map(c => c.low), Infinity);
  const priceRange = maxPrice - minPrice || 1;
  const maxVolume = Math.max(...candles.map(c => c.volume), 1);

  const getY = (price: number) => {
    return ((maxPrice - price) / priceRange) * 100;
  };

  const isPositive = priceChange.value >= 0;

  if (!initialized || candles.length === 0) {
    return (
      <Card className="bg-background border-border/50 flex items-center justify-center h-[450px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Carregando gráfico de velas...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-background border-border/50 overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">BTC/USDT · 1m · Binance</span>
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-600 animate-pulse' : 'bg-red-600'}`}></div>
          </div>
          <div className={`text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{priceChange.value.toFixed(2)} ({isPositive ? '+' : ''}{priceChange.percent.toFixed(2)}%)
          </div>
          <div className="text-xs text-muted-foreground">
            Vol: {candles[candles.length - 1]?.volume.toFixed(0) || '0'}
          </div>
          <div className="text-xs text-muted-foreground ml-auto">
            {candles.length} velas
          </div>
        </div>
      </div>

      <div className="relative flex-1 bg-chart min-h-0">
        {/* Price Grid Lines */}
        <div className="absolute inset-0">
          {[0, 25, 50, 75, 100].map(percent => (
            <div
              key={percent}
              className="absolute w-full border-t border-grid/20"
              style={{ top: `${percent}%` }}
            >
              <span className="absolute right-2 -translate-y-1/2 text-[10px] text-muted-foreground">
                {(maxPrice - (priceRange * percent / 100)).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Velas Japonesas Refinadas */}
        <div className="absolute inset-0 px-4 pb-8 pt-4">
          <div className="h-full flex gap-1">
          {candles.map((candle, i) => {
            const isGreen = candle.close >= candle.open;

            // Usar o sistema original mas com posicionamento baseado no getY
            const bodyTop = Math.min(getY(candle.open), getY(candle.close));
            const bodyHeight = Math.max(Math.abs(getY(candle.close) - getY(candle.open)), 2);
            const wickTop = getY(candle.high);
            const wickBottom = getY(candle.low);

            return (
              <div key={i} className="flex-1 relative group h-full" style={{ minWidth: '12px', maxWidth: '24px' }}>
                {/* Pavio Superior */}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 w-[2px] neon-glow ${isGreen ? 'bg-green-400' : 'bg-red-400'}`}
                  style={{
                    top: `${wickTop}%`,
                    height: `${Math.max(bodyTop - wickTop, 0)}%`
                  }}
                />

                {/* Pavio Inferior */}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 w-[2px] neon-glow ${isGreen ? 'bg-green-400' : 'bg-red-400'}`}
                  style={{
                    top: `${bodyTop + bodyHeight}%`,
                    height: `${Math.max(wickBottom - (bodyTop + bodyHeight), 0)}%`
                  }}
                />

                {/* Corpo da Vela */}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 w-full transition-all duration-200 border rounded-sm neon-glow ${
                    isGreen
                      ? 'bg-green-500 border-green-400 hover:bg-green-400 shadow-sm'
                      : 'bg-red-500 border-red-400 hover:bg-red-400 shadow-sm'
                  }`}
                  style={{
                    top: `${bodyTop}%`,
                    height: `${bodyHeight}%`,
                    minHeight: '3px'
                  }}
                />

                {/* Tooltip inteligente */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 hidden group-hover:block z-20 pointer-events-none"
                  style={{
                    top: bodyTop < 30 ? `${bodyTop + bodyHeight + 5}%` : `${Math.max(bodyTop - 5, 0)}%`
                  }}
                >
                  <div className={`bg-gray-900 text-white text-xs p-3 rounded-lg shadow-xl border border-gray-700 whitespace-nowrap ${
                    bodyTop < 30 ? 'transform translate-y-0' : 'transform -translate-y-full'
                  }`}>
                    <div className="font-semibold text-gray-200 mb-2">{candle.time}</div>
                    <div className="space-y-1">
                      <div className="flex justify-between gap-4">
                        <span className="text-gray-400">O:</span>
                        <span className="font-mono">${candle.open.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-gray-400">H:</span>
                        <span className="font-mono text-green-400">${candle.high.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-gray-400">L:</span>
                        <span className="font-mono text-red-400">${candle.low.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-gray-400">C:</span>
                        <span className={`font-mono ${isGreen ? 'text-green-400' : 'text-red-400'}`}>
                          ${candle.close.toFixed(2)}
                        </span>
                      </div>
                      <div className="border-t border-gray-700 pt-1 mt-1">
                        <div className="flex justify-between gap-4">
                          <span className="text-gray-400">Vol:</span>
                          <span className="font-mono text-blue-400">{candle.volume.toFixed(0)}</span>
                        </div>
                      </div>
                    </div>
                    {/* Seta condicional */}
                    {bodyTop < 30 ? (
                      /* Seta apontando para cima quando tooltip está embaixo */
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
                    ) : (
                      /* Seta apontando para baixo quando tooltip está em cima */
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        </div>


        {/* Time Labels */}
        <div className="absolute bottom-1 left-0 right-0 flex justify-between px-8 text-[10px] text-muted-foreground">
          {candles.filter((_, i) => i % Math.ceil(candles.length / 6) === 0).map((candle, i) => (
            <span key={i}>{candle.time}</span>
          ))}
        </div>

      </div>
    </Card>
  );
};
