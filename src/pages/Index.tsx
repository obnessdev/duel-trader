import { useState, useCallback } from 'react';
import { useMockPrice } from '@/hooks/useMockPrice';
import { useSimulatedTraders } from '@/hooks/useSimulatedTraders';
import { useTheme } from '@/hooks/useTheme';
import { CandlestickChart } from '@/components/CandlestickChart';
import { DuelPanel } from '@/components/DuelPanel';
import { Header } from '@/components/Header';
import { ChartSidebar } from '@/components/ChartSidebar';
import { HistoryTabs } from '@/components/HistoryTabs';
import { LiveChat } from '@/components/LiveChat';
import { WinAnimation } from '@/components/WinAnimation';
import { LossAnimation } from '@/components/LossAnimation';
import { ThemeSelector } from '@/components/ThemeSelector';
import { Asset, Direction, Trade, ChatMessage } from '@/types/trading';

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
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [showWinAnimation, setShowWinAnimation] = useState(false);
  const [showLossAnimation, setShowLossAnimation] = useState(false);
  const [animationAmount, setAnimationAmount] = useState(0);

  const { priceData, isConnected } = useMockPrice(selectedAsset);
  const { theme, setTheme } = useTheme();

  // Função para adicionar mensagem ao chat
  const addChatMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    setChatMessages(prev => [...prev, newMessage]);
  };

  const handleStartDuel = (direction: Direction, amount: number) => {
    if (!priceData) {
      // Silenciosamente aguarda dados
      return;
    }

    const fee = amount * 0.05;
    const trade: Trade = {
      id: crypto.randomUUID(),
      asset: "BTC/USDT",
      timeframe: 1,
      direction,
      amount,
      fee,
      entryPrice: priceData.price,
      startTime: Date.now(),
      status: 'active'
    };

    setActiveTrade(trade);

    // Adiciona mensagem ao chat
    addChatMessage({
      type: 'bet',
      username: 'Você',
      content: '',
      data: {
        direction,
        amount,
        asset: "BTC/USDT",
      }
    });

    // Toast removido - mensagem já vai para o chat

    // Simulate duel completion - sempre 1 minuto
    setTimeout(() => {
      completeDuel(trade);
    }, 1 * 60 * 1000);
  };

  const handleSendEmoji = (emoji: string) => {
    addChatMessage({
      type: 'emoji',
      username: 'Você',
      content: emoji,
    });
  };

  const handleSendMessage = (message: string) => {
    addChatMessage({
      type: 'text',
      username: 'Você',
      content: message,
    });
  };

  // Handler para eventos de traders simulados
  const handleSimulatedTraderEvent = useCallback((event: any) => {
    if (event.type === 'bet') {
      addChatMessage({
        type: 'bet',
        username: event.username,
        content: '',
        data: {
          direction: event.direction,
          amount: event.amount,
          asset: "BTC/USDT",
        }
      });
    } else if (event.type === 'emoji') {
      addChatMessage({
        type: 'emoji',
        username: event.username,
        content: event.emoji,
      });
    }
  }, [selectedAsset]);

  // Ativa traders simulados
  useSimulatedTraders(selectedAsset, handleSimulatedTraderEvent, true);

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

    // Adiciona mensagem de resultado ao chat
    addChatMessage({
      type: 'result',
      username: 'Você',
      content: '',
      data: {
        result: isWin ? 'win' : 'loss',
        profit: completedTrade.profit,
        asset: trade.asset,
      }
    });

    // Mostra animação de vitória ou derrota
    setAnimationAmount(Math.abs(completedTrade.profit || 0));
    if (isWin) {
      setShowWinAnimation(true);
    } else {
      setShowLossAnimation(true);
    }

    // Toast removido - resultado já vai para o chat
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
        currentTheme={theme}
        onThemeChange={setTheme}
      />

      <div className="flex flex-1">
        <ChartSidebar />

        <div className="flex-1 flex flex-col">
          <div className="flex-1 grid grid-cols-[1fr,360px] min-h-0">
            <div className="p-4 flex flex-col min-h-0">
              <div className="flex-1 min-h-0">
                <CandlestickChart
                  priceData={priceData}
                  isConnected={isConnected}
                  asset={selectedAsset.toUpperCase()}
                />
              </div>
            </div>

            <div className="border-l border-border/50 p-4 bg-muted/20">
              <DuelPanel
                asset="BTC/USDT"
                currentPrice={priceData?.price || 0}
                onStartDuel={handleStartDuel}
                isActive={activeTrade !== null}
              />
            </div>
          </div>

          <div className="border-t border-border/50 grid grid-cols-2 gap-0">
            <div className="border-r border-border/50">
              <HistoryTabs trades={tradeHistory} />
            </div>

            {/* Chat Fixo */}
            <div className="h-80 bg-background">
              <LiveChat
                messages={chatMessages}
                onSendEmoji={handleSendEmoji}
                onSendMessage={handleSendMessage}
                isEmbedded={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Animações de resultado */}
      <WinAnimation
        isVisible={showWinAnimation}
        amount={animationAmount}
        onComplete={() => setShowWinAnimation(false)}
      />
      <LossAnimation
        isVisible={showLossAnimation}
        amount={animationAmount}
        onComplete={() => setShowLossAnimation(false)}
      />
    </div>
  );
};

export default Index;
