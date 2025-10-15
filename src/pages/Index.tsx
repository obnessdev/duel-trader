import { useState, useCallback, useEffect, useRef } from 'react';
import { useMockPrice } from '@/hooks/useMockPrice';
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

  // Liquidity Equalizer states
  const [roundBets, setRoundBets] = useState<Array<{
    id: string;
    username: string;
    amount: number;
    direction: Direction;
    timestamp: number;
    status: 'pending' | 'accepted' | 'rejected';
  }>>([]);
  const [countdown, setCountdown] = useState<number>(0);
  const [isEqualizerActive, setIsEqualizerActive] = useState(false);
  const [availableLiquidity] = useState(10000); // $10k liquidez disponível
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const { priceData, isConnected } = useMockPrice(selectedAsset);
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

    // Criar nova aposta para a fila de liquidez
    const newBet = {
      id: crypto.randomUUID(),
      username: 'Você',
      amount,
      direction,
      timestamp: Date.now(),
      status: 'pending' as const
    };

    // Adicionar à fila de apostas
    setRoundBets(prev => [...prev, newBet]);

    // Se é a primeira aposta da rodada, iniciar countdown
    if (roundBets.length === 0) {
      setCountdown(60); // 60 segundos

      // Limpar interval anterior se existir
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }

      // Countdown timer
      countdownIntervalRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 5) { // Últimos 5 segundos (5, 4, 3, 2, 1)
            if (prev === 5) {
              setIsEqualizerActive(true);
            }
          }

          if (prev <= 0) {
            if (countdownIntervalRef.current) {
              clearInterval(countdownIntervalRef.current);
              countdownIntervalRef.current = null;
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
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

    // Dar 60% de chance de vitória para melhor experiência do usuário
    const winChance = Math.random();
    let isWin = winChance < 0.6; // 60% chance de vitória

    // Simular variação de preço baseada no resultado desejado
    let priceVariation;
    if (isWin) {
      // Se vai ganhar, criar variação favorável
      priceVariation = trade.direction === 'CALL'
        ? Math.random() * (trade.entryPrice * 0.005) + 0.01 // Variação positiva
        : -(Math.random() * (trade.entryPrice * 0.005) + 0.01); // Variação negativa
    } else {
      // Se vai perder, criar variação desfavorável
      priceVariation = trade.direction === 'CALL'
        ? -(Math.random() * (trade.entryPrice * 0.005) + 0.01) // Variação negativa
        : Math.random() * (trade.entryPrice * 0.005) + 0.01; // Variação positiva
    }

    const exitPrice = trade.entryPrice + priceVariation;
    const priceChange = exitPrice - trade.entryPrice;

    // Reconfirmar vitória baseada na variação real
    isWin = (trade.direction === 'CALL' && priceChange > 0) ||
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

    // Atualizar saldo baseado no resultado
    setBalance(prev => prev + (completedTrade.profit || 0));

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
      playVictorySound(); // Toca som de vitória
    } else {
      setShowLossAnimation(true);
    }

    // Toast removido - resultado já vai para o chat
  };

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

  // Reset do sistema quando scan termina
  useEffect(() => {
    if (isEqualizerActive) {
      const scanTimeout = setTimeout(() => {
        setIsEqualizerActive(false);

        // Processar resultados para cada aposta
        roundBets.forEach(bet => {
          if (bet.username === 'Você') {
            // Gerar resultado para o usuário (50% chance de vitória)
            const isWin = Math.random() < 0.5;
            const profit = isWin ? bet.amount : -bet.amount;

            // Atualizar saldo
            setBalance(prev => prev + profit);

            // Adicionar mensagem de resultado ao chat
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

            // Mostrar animação apenas para vitória
            if (isWin) {
              setAnimationAmount(Math.abs(profit));
              setShowWinAnimation(true);
              playVictorySound();
            }
          }
        });

        // Resetar o sistema após processar resultados
        setCountdown(0);
        setRoundBets([]);
      }, 5000); // Scan dura 5 segundos

      return () => clearTimeout(scanTimeout);
    }
  }, [isEqualizerActive, roundBets, playVictorySound]);

  // Limpar interval quando componente desmonta
  useEffect(() => {
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, []);

  // Adicionar apostas simuladas para demonstração
  const addSimulatedBets = () => {
    const simulatedBets = [
      { username: 'Trader_Alpha', amount: 150, direction: 'CALL' as Direction },
      { username: 'CryptoKing', amount: 300, direction: 'PUT' as Direction },
      { username: 'BullMarket', amount: 75, direction: 'CALL' as Direction },
      { username: 'BearHunter', amount: 225, direction: 'PUT' as Direction },
    ];

    simulatedBets.forEach((bet, index) => {
      setTimeout(() => {
        const newBet = {
          id: crypto.randomUUID(),
          username: bet.username,
          amount: bet.amount,
          direction: bet.direction,
          timestamp: Date.now(),
          status: 'pending' as const
        };

        setRoundBets(prev => [...prev, newBet]);

        addChatMessage({
          type: 'bet',
          username: bet.username,
          content: '',
          data: {
            direction: bet.direction,
            amount: bet.amount,
            asset: "BTC/USDT",
          }
        });
      }, index * 2000); // 2 segundos entre cada aposta
    });
  };

  // Auto-adicionar apostas simuladas quando countdown < 20
  useEffect(() => {
    if (countdown === 30 && roundBets.length === 1) {
      addSimulatedBets();
    }
  }, [countdown, roundBets.length]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        currentTheme={theme}
        onThemeChange={setTheme}
      />

      <div className="flex flex-1">
        <ChartSidebar
          selectedTimeframe={timeframe}
          onTimeframeChange={() => {}} // Função vazia já que timeframe é fixo
          selectedTool={selectedTool}
          onToolChange={setSelectedTool}
          chartType={chartType}
          onChartTypeChange={setChartType}
          showIndicators={showIndicators}
          onToggleIndicator={handleToggleIndicator}
          onAddAlert={handleAddAlert}
        />

        <div className="flex-1 flex flex-col">
          <div className="flex-1 grid grid-cols-[1fr,360px] min-h-0">
            <div className="p-4 flex flex-col min-h-0">
              <div className="flex-1 min-h-0">
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
            </div>

            <div className="border-l border-border/50 p-4 bg-muted/20">
              {/* Countdown Display */}
              {countdown > 0 && (
                <div className="mb-4 p-4 bg-muted border border-border rounded-lg text-center">
                  <div className="text-lg font-bold text-foreground">RODADA ATIVA</div>
                  <div className="text-3xl font-mono text-foreground">{countdown}s</div>
                  <div className="text-sm text-muted-foreground">
                    {countdown <= 5 ? '🔍 Equalizador ativo!' : 'Apostas abertas'}
                  </div>
                  <div className="text-xs mt-2 text-muted-foreground">
                    Apostas na fila: {roundBets.length} | Liquidez: ${availableLiquidity.toLocaleString()}
                  </div>
                </div>
              )}

              <DuelPanel
                asset="BTC/USDT"
                currentPrice={priceData?.price || 0}
                onStartDuel={handleStartDuel}
                isActive={activeTrade !== null || countdown > 0}
                isEqualizerActive={isEqualizerActive}
                bets={roundBets}
                availableLiquidity={availableLiquidity}
              />
            </div>
          </div>

          <div className="border-t border-border/50 h-80">
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel defaultSize={50} minSize={30}>
                <HistoryTabs trades={tradeHistory} />
              </ResizablePanel>

              <ResizableHandle withHandle className="w-2 bg-border/50 hover:bg-border" />

              <ResizablePanel defaultSize={50} minSize={30}>
                <div className="h-full bg-background">
                  <LiveChat
                    messages={chatMessages}
                    onSendEmoji={handleSendEmoji}
                    onSendMessage={handleSendMessage}
                    isEmbedded={true}
                  />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
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
