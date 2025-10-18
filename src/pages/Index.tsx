import { useState, useCallback, useEffect, useRef } from 'react';
import { useRealPrice } from '@/hooks/useRealPrice';
import { useSimulatedTraders } from '@/hooks/useSimulatedTraders';
import { useTheme } from '@/hooks/useTheme';
import { useSound } from '@/hooks/useSound';
import { AdvancedTradingChart } from '@/components/AdvancedTradingChart';
import { DuelPanel } from '@/components/DuelPanel';
import { Header } from '@/components/Header';
import { ChartSidebar } from '@/components/ChartSidebar';
import { HistoryTabs } from '@/components/HistoryTabs';
import { LiveChat } from '@/components/LiveChat';
import { WinAnimation } from '@/components/WinAnimation';
import { LossAnimation } from '@/components/LossAnimation';
import { ThemeSelector } from '@/components/ThemeSelector';
import { LiquidityScanner } from '@/components/LiquidityScanner';
import { OrderBook } from '@/components/OrderBook';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowUp, ArrowDown, Plus, Minus, Smile, MessageCircle } from 'lucide-react';
import { Asset, Direction, Trade, ChatMessage } from '@/types/trading';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

const ASSETS: Asset[] = [
  { symbol: 'btcusdt', name: 'BTC/USDT', icon: '₿' },
  { symbol: 'ethusdt', name: 'ETH/USDT', icon: 'Ξ' },
  { symbol: 'bnbusdt', name: 'BNB/USDT', icon: 'BNB' },
  { symbol: 'solusdt', name: 'SOL/USDT', icon: 'SOL' }
];

const Index = () => {
  const selectedAsset = 'btcusdt'; // Fixo em BTC/USDT
  const timeframe = 1; // Fixo em 1 minuto
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
  const [amount, setAmount] = useState<string>('10');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMessagePicker, setShowMessagePicker] = useState(false);

  // Chart states
  const [chartType, setChartType] = useState<'candlestick' | 'line' | 'area'>('candlestick');
  const [selectedTool, setSelectedTool] = useState('cursor');
  const [showIndicators, setShowIndicators] = useState({
    bollinger: true,
    sma20: true,
    ema20: false,
    rsi: true,
    macd: true,
    volume: true
  });

  // New betting system states
  const [currentRoundBets, setCurrentRoundBets] = useState<Array<{
    id: string;
    username: string;
    amount: number;
    direction: Direction;
    timestamp: number;
    status: 'pending' | 'accepted' | 'rejected';
  }>>([]);
  const [roundStartPrice, setRoundStartPrice] = useState<number | null>(null);
  const [isRoundActive, setIsRoundActive] = useState(false);
  const [isEqualizerActive, setIsEqualizerActive] = useState(false);
  const [availableLiquidity] = useState(10000);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);

  const { price: realPrice, isLoading } = useRealPrice('BTCUSDT');
  const priceData = realPrice ? { price: realPrice } : null;
  const isConnected = !isLoading;
  const { theme, setTheme } = useTheme();
  const { playVictorySound } = useSound();

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
      return;
    }

    // Criar nova aposta
    const newBet = {
      id: crypto.randomUUID(),
      username: 'Você',
      amount,
      direction,
      timestamp: Date.now(),
      status: 'pending' as const
    };

    // Adicionar à rodada atual
    setCurrentRoundBets(prev => [...prev, newBet]);

    // Se não há rodada ativa, iniciar nova rodada
    if (!isRoundActive) {
      setIsRoundActive(true);
      setRoundStartPrice(priceData.price);
    }

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

  // Processo de finalização da rodada quando timer chega a zero
  const processRoundResults = useCallback(() => {
    if (!priceData || !roundStartPrice || currentRoundBets.length === 0) {
      return;
    }

    const endPrice = priceData.price;
    const priceChange = endPrice - roundStartPrice;
    const priceDirection = priceChange > 0 ? 'CALL' : 'PUT';

    // Processar cada aposta
    currentRoundBets.forEach(bet => {
      if (bet.username === 'Você') {
        const isWin = bet.direction === priceDirection;
        const profit = isWin ? bet.amount : -bet.amount;

        // Atualizar saldo
        setBalance(prev => prev + profit);

        // Criar trade history
        const completedTrade: Trade = {
          id: bet.id,
          asset: 'BTC/USDT',
          direction: bet.direction,
          amount: bet.amount,
          entryPrice: roundStartPrice,
          exitPrice: endPrice,
          startTime: bet.timestamp,
          endTime: Date.now(),
          duration: 60,
          status: 'completed',
          result: isWin ? 'win' : 'loss',
          profit
        };

        const updatedHistory = [...tradeHistory, completedTrade];
        setTradeHistory(updatedHistory);
        localStorage.setItem('tradeHistory', JSON.stringify(updatedHistory));

        // Simular se o equalizer devolveu dinheiro (30% chance)
        const equalizerRefund = Math.random() < 0.3;
        const refundAmount = equalizerRefund ? bet.amount * 0.5 : 0; // 50% de reembolso

        if (equalizerRefund && !isWin) {
          // Se perdeu mas teve reembolso
          setBalance(prev => prev + refundAmount);
          addChatMessage({
            type: 'result',
            username: 'Você',
            content: '',
            data: {
              result: 'refund',
              profit: refundAmount,
              originalLoss: profit,
              asset: 'BTC/USDT',
            }
          });
        } else {
          // Resultado normal (ganhou ou perdeu sem reembolso)
          addChatMessage({
            type: 'result',
            username: 'Você',
            content: '',
            data: {
              result: isWin ? 'win' : 'loss',
              profit,
              asset: 'BTC/USDT',
            }
          });
        }

        // Animação apenas para vitória
        if (isWin) {
          setAnimationAmount(Math.abs(profit));
          setShowWinAnimation(true);
          playVictorySound();
        }
      }
    });

    // Reset para próxima rodada
    setCurrentRoundBets([]);
    setRoundStartPrice(null);
    setIsRoundActive(false);
    setIsEqualizerActive(false);
  }, [priceData, roundStartPrice, currentRoundBets, tradeHistory, playVictorySound]);

  // Handler para eventos de traders simulados
  const handleSimulatedTraderEvent = useCallback((event: any) => {
    if (event.type === 'bet') {
      // Adicionar apostas simuladas à rodada atual
      const simulatedBet = {
        id: crypto.randomUUID(),
        username: event.username,
        amount: event.amount,
        direction: event.direction,
        timestamp: Date.now(),
        status: 'pending' as const
      };

      setCurrentRoundBets(prev => [...prev, simulatedBet]);

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
  }, []);

  // Ativa traders simulados
  useSimulatedTraders(selectedAsset, handleSimulatedTraderEvent, true);

  // Adiciona AI Equalizer nos últimos 5 segundos
  const activateEqualizerIfNeeded = useCallback(() => {
    if (isRoundActive && currentRoundBets.length > 0) {
      setIsEqualizerActive(true);

      // Desativar equalizer após 5 segundos
      setTimeout(() => {
        setIsEqualizerActive(false);
      }, 5000);
    }
  }, [isRoundActive, currentRoundBets]);

  // Chart control functions
  const handleToggleIndicator = (indicator: string) => {
    setShowIndicators(prev => ({
      ...prev,
      [indicator]: !prev[indicator]
    }));
  };

  const handleAddAlert = () => {
    if (!priceData) return;

    const alertPrice = prompt(`Criar alerta para qual preço? (Preço atual: ${priceData.price.toFixed(2)})`);
    if (!alertPrice) return;

    const price = parseFloat(alertPrice);
    if (isNaN(price)) return;

    console.log(`Alerta criado para: $${price}`);
    // Aqui você pode implementar a lógica de salvar o alerta
  };


  return (
    <div className="h-screen w-screen bg-background flex flex-col overflow-hidden">
      <Header
        currentTheme={theme}
        onThemeChange={setTheme}
      />

      <div className="flex flex-1 min-h-0">
        {/* Sidebar - Esconde em mobile */}
        <div className="hidden lg:block">
          <ChartSidebar
            selectedTimeframe={timeframe}
            onTimeframeChange={() => {}}
            selectedTool={selectedTool}
            onToolChange={setSelectedTool}
            chartType={chartType}
            onChartTypeChange={setChartType}
            showIndicators={showIndicators}
            onToggleIndicator={handleToggleIndicator}
            onAddAlert={handleAddAlert}
          />
        </div>

        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* Desktop Layout */}
          <div className="hidden md:block w-full">
            <ResizablePanelGroup direction="horizontal" className="w-full">
              <ResizablePanel defaultSize={70} minSize={50}>
                <div className="flex flex-col h-full w-full overflow-hidden">
                  <div className={`overflow-hidden w-full transition-all duration-300 ${isHistoryExpanded ? 'flex-1' : 'flex-[2]'}`}>
                    <AdvancedTradingChart
                      priceData={priceData}
                      isConnected={isConnected}
                      asset={selectedAsset.toUpperCase()}
                      timeframe={timeframe}
                      chartType={chartType}
                      showIndicators={showIndicators}
                      onToggleIndicator={handleToggleIndicator}
                      onAddAlert={handleAddAlert}
                    />
                  </div>
                  <div className={`border-t border-border/50 w-full overflow-hidden transition-all duration-300 ${isHistoryExpanded ? 'flex-1' : 'h-48'}`}>
                    <HistoryTabs
                      trades={tradeHistory}
                      isExpanded={isHistoryExpanded}
                      onToggleExpand={() => setIsHistoryExpanded(!isHistoryExpanded)}
                    />
                  </div>
                </div>
              </ResizablePanel>

              <ResizableHandle withHandle className="w-2 bg-border/50 hover:bg-border" />

              <ResizablePanel defaultSize={30} minSize={25}>
                <div className="flex flex-col h-full w-full overflow-hidden">
                  <div className="flex flex-1 border-b border-border/50 min-h-0 overflow-hidden w-full">
                    <div className="w-1/2 border-r border-border/50 p-2 lg:p-3 overflow-hidden h-full">
                      <OrderBook
                        isScanActive={isEqualizerActive}
                        userBetAmount={currentRoundBets.find(bet => bet.username === 'Você')?.amount || 0}
                        wasUserBetAccepted={currentRoundBets.some(bet => bet.username === 'Você')}
                      />
                    </div>
                    <div className="w-1/2 p-2 lg:p-3 overflow-hidden h-full">
                      <DuelPanel
                        asset="BTC/USDT"
                        currentPrice={priceData?.price || 0}
                        onStartDuel={handleStartDuel}
                        isActive={isRoundActive}
                        isEqualizerActive={isEqualizerActive}
                        bets={currentRoundBets}
                        availableLiquidity={availableLiquidity}
                        onRoundComplete={processRoundResults}
                        onEqualizerActivate={activateEqualizerIfNeeded}
                      />
                    </div>
                  </div>
                  <div className="h-60 lg:h-72 border-t border-border/50 flex-shrink-0 w-full overflow-hidden">
                    <LiveChat
                      messages={chatMessages}
                      onSendEmoji={handleSendEmoji}
                      onSendMessage={handleSendMessage}
                      isEmbedded={true}
                    />
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden w-full flex flex-col">
            {/* Gráfico em mobile */}
            <div className="h-1/2 border-b border-border/50">
              <AdvancedTradingChart
                priceData={priceData}
                isConnected={isConnected}
                asset={selectedAsset.toUpperCase()}
                timeframe={timeframe}
                chartType={chartType}
                showIndicators={showIndicators}
                onToggleIndicator={handleToggleIndicator}
                onAddAlert={handleAddAlert}
              />
            </div>

            {/* Trading Panel em mobile */}
            <div className="h-1/2 p-3">
              <DuelPanel
                asset="BTC/USDT"
                currentPrice={priceData?.price || 0}
                onStartDuel={handleStartDuel}
                isActive={isRoundActive}
                isEqualizerActive={isEqualizerActive}
                bets={currentRoundBets}
                availableLiquidity={availableLiquidity}
                onRoundComplete={processRoundResults}
                onEqualizerActivate={activateEqualizerIfNeeded}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal antigo removido - scanner agora aparece no histórico */}

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
