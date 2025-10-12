import { useState } from 'react';
import { useBinancePrice } from '@/hooks/useBinancePrice';
import { CandlestickChart } from '@/components/CandlestickChart';
import { DuelPanel } from '@/components/DuelPanel';
import { Header } from '@/components/Header';
import { ChartSidebar } from '@/components/ChartSidebar';
import { HistoryTabs } from '@/components/HistoryTabs';
import { TradeNotifications } from '@/components/TradeNotifications';
import { QuickChat } from '@/components/QuickChat';
import { Asset, Direction, Trade } from '@/types/trading';
import { useToast } from '@/hooks/use-toast';

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
  const [balance, setBalance] = useState(100.50);
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
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        assets={ASSETS}
        selectedAsset={selectedAsset}
        onAssetChange={setSelectedAsset}
        selectedTimeframe={timeframe}
        onTimeframeChange={setTimeframe}
        currentPrice={priceData?.price || 0}
        balance={balance}
        disabled={activeTrade !== null}
      />

      <div className="flex flex-1">
        <ChartSidebar />
        
        <div className="flex-1 flex flex-col">
          <div className="flex-1 grid grid-cols-[1fr,360px]">
            <div className="p-4">
              <CandlestickChart
                priceData={priceData}
                isConnected={isConnected}
                asset={selectedAsset.toUpperCase()}
              />
            </div>

            <div className="border-l border-border/50 p-4 bg-muted/20">
              <DuelPanel
                asset={selectedAsset.toUpperCase()}
                currentPrice={priceData?.price || 0}
                timeframe={timeframe}
                onStartDuel={handleStartDuel}
                isActive={activeTrade !== null}
              />
            </div>
          </div>

          <div className="border-t border-border/50">
            <HistoryTabs trades={tradeHistory} />
          </div>
        </div>
      </div>

      <TradeNotifications />
      <QuickChat />
    </div>
  );
};

export default Index;
