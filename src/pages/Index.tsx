import { useState } from 'react';
import { useBinancePrice } from '@/hooks/useBinancePrice';
import { TradingChart } from '@/components/TradingChart';
import { DuelPanel } from '@/components/DuelPanel';
import { TradeHistory } from '@/components/TradeHistory';
import { AssetSelector } from '@/components/AssetSelector';
import { Asset, Direction, Trade } from '@/types/trading';
import { useToast } from '@/hooks/use-toast';
import { Swords } from 'lucide-react';

const ASSETS: Asset[] = [
  { symbol: 'btcusdt', name: 'BTC/USDT', icon: '₿' },
  { symbol: 'ethusdt', name: 'ETH/USDT', icon: 'Ξ' },
  { symbol: 'bnbusdt', name: 'BNB/USDT', icon: 'BNB' },
  { symbol: 'solusdt', name: 'SOL/USDT', icon: 'SOL' }
];

const Index = () => {
  const [selectedAsset, setSelectedAsset] = useState('btcusdt');
  const [timeframe, setTimeframe] = useState(1);
  const [activeTrade, setActiveTrade] = useState<Trade | null>(null);
  const [tradeHistory, setTradeHistory] = useState<Trade[]>(() => {
    const saved = localStorage.getItem('tradeHistory');
    return saved ? JSON.parse(saved) : [];
  });
  
  const { priceData, isConnected } = useBinancePrice(selectedAsset);
  const { toast } = useToast();

  const handleStartDuel = (direction: Direction, amount: number) => {
    if (!priceData) {
      toast({
        title: "Connection error",
        description: "Please wait for price data to load",
        variant: "destructive"
      });
      return;
    }

    const fee = amount * 0.05;
    const trade: Trade = {
      id: crypto.randomUUID(),
      asset: selectedAsset.toUpperCase(),
      timeframe,
      direction,
      amount,
      fee,
      entryPrice: priceData.price,
      startTime: Date.now(),
      status: 'active'
    };

    setActiveTrade(trade);

    toast({
      title: "Duel Started! 🎯",
      description: `${direction} position opened at $${priceData.price.toFixed(2)}`
    });

    // Simulate duel completion
    setTimeout(() => {
      completeDuel(trade);
    }, timeframe * 60 * 1000);
  };

  const completeDuel = (trade: Trade) => {
    if (!priceData) return;

    const exitPrice = priceData.price;
    const priceChange = exitPrice - trade.entryPrice;
    const isWin = 
      (trade.direction === 'CALL' && priceChange > 0) ||
      (trade.direction === 'PUT' && priceChange < 0);

    const completedTrade: Trade = {
      ...trade,
      exitPrice,
      endTime: Date.now(),
      status: 'completed',
      result: isWin ? 'win' : 'loss',
      profit: isWin ? trade.amount : -trade.amount
    };

    const updatedHistory = [...tradeHistory, completedTrade];
    setTradeHistory(updatedHistory);
    localStorage.setItem('tradeHistory', JSON.stringify(updatedHistory));
    setActiveTrade(null);

    toast({
      title: isWin ? "Victory! 🎉" : "Defeat 😔",
      description: `You ${isWin ? 'won' : 'lost'} $${trade.amount.toFixed(2)}`,
      variant: isWin ? "default" : "destructive"
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3">
            <Swords className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">Trading Duel</h1>
          </div>
          <p className="text-muted-foreground">P2P Binary Options Trading Platform</p>
        </header>

        <AssetSelector
          assets={ASSETS}
          selectedAsset={selectedAsset}
          onAssetChange={setSelectedAsset}
          selectedTimeframe={timeframe}
          onTimeframeChange={setTimeframe}
          disabled={activeTrade !== null}
        />

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <TradingChart
              priceData={priceData}
              isConnected={isConnected}
              asset={selectedAsset.toUpperCase()}
            />
            <TradeHistory trades={tradeHistory} />
          </div>

          <div>
            <DuelPanel
              asset={selectedAsset.toUpperCase()}
              currentPrice={priceData?.price || 0}
              timeframe={timeframe}
              onStartDuel={handleStartDuel}
              isActive={activeTrade !== null}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
