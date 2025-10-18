import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface LiquidityScannerProps {
  isActive: boolean;
  bets: Array<{
    id: string;
    username: string;
    amount: number;
    direction: 'CALL' | 'PUT';
    timestamp: number;
    status: 'pending' | 'accepted' | 'rejected';
  }>;
  availableLiquidity: number;
  onScanComplete: (acceptedBets: any[], rejectedBets: any[]) => void;
  isEmbedded?: boolean;
}

export const LiquidityScanner = ({
  isActive,
  bets,
  availableLiquidity,
  onScanComplete,
  isEmbedded = false
}: LiquidityScannerProps) => {
  const [currentScanIndex, setCurrentScanIndex] = useState(0);
  const [scanProgress, setScanProgress] = useState(0);
  const [processedBets, setProcessedBets] = useState<any[]>([]);
  const [scanPhase, setScanPhase] = useState<'scanning' | 'processing' | 'complete'>('scanning');

  useEffect(() => {
    if (!isActive) {
      setCurrentScanIndex(0);
      setScanProgress(0);
      setProcessedBets([]);
      setScanPhase('scanning');
      return;
    }

    // Scanner animation
    const scanInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(scanInterval);
          setScanPhase('processing');
          processLiquidity();
          return 100;
        }
        return prev + 2; // 5 seconds total (100/2 = 50 steps * 100ms = 5s)
      });
    }, 100);

    return () => clearInterval(scanInterval);
  }, [isActive]);

  const processLiquidity = () => {
    // Ordenar apostas por timestamp (ordem de chegada)
    const sortedBets = [...bets].sort((a, b) => a.timestamp - b.timestamp);

    let remainingLiquidity = availableLiquidity;
    const acceptedBets: any[] = [];
    const rejectedBets: any[] = [];

    // Garantir que pelo menos 70% das apostas sejam aceitas para ter mais jogos
    const minAcceptedBets = Math.max(1, Math.floor(sortedBets.length * 0.7));
    let acceptedCount = 0;

    // Processar cada aposta em ordem
    sortedBets.forEach((bet, index) => {
      setTimeout(() => {
        setCurrentScanIndex(index);

        // Lógica melhorada: aceitar mais apostas para ter mais resultados
        const shouldAccept =
          (remainingLiquidity >= bet.amount) ||
          (acceptedCount < minAcceptedBets && remainingLiquidity >= bet.amount * 0.5);

        if (shouldAccept) {
          remainingLiquidity -= bet.amount;
          acceptedBets.push({ ...bet, status: 'accepted' });
          acceptedCount++;
        } else {
          rejectedBets.push({ ...bet, status: 'rejected' });
        }

        setProcessedBets([...acceptedBets, ...rejectedBets]);

        // Se processou todas as apostas
        if (index === sortedBets.length - 1) {
          setTimeout(() => {
            setScanPhase('complete');
            onScanComplete(acceptedBets, rejectedBets);
          }, 500);
        }
      }, index * 200); // 200ms entre cada processamento
    });
  };

  if (!isActive) return null;

  const containerClass = isEmbedded
    ? "h-full w-full"
    : "fixed inset-0 bg-black/50 flex items-center justify-center z-50";

  const cardClass = isEmbedded
    ? "bg-background border-2 border-blue-500 p-4 w-full h-full animate-pulse flex flex-col rounded-lg"
    : "bg-background border-2 border-blue-500 p-6 w-96 max-w-90vw animate-pulse";

  return (
    <div className={containerClass}>
      {isEmbedded ? (
        <div className="p-4 w-full h-full flex flex-col relative overflow-hidden min-h-full">
          {/* Conteúdo do scanner embarcado */}
        {/* Header */}
        <div className="text-center mb-2 flex-shrink-0">
          <div className={`font-bold text-blue-400 mb-1 ${isEmbedded ? 'text-sm' : 'text-xl'}`}>
            🔍 EQUALIZADOR DE LIQUIDEZ
          </div>
          <div className={`text-muted-foreground ${isEmbedded ? 'text-xs' : 'text-sm'}`}>
            Processando apostas nos últimos 5 segundos...
          </div>
        </div>

        {/* Scanner Progress */}
        <div className={`flex-shrink-0 ${isEmbedded ? "mb-2" : "mb-6"}`}>
          <div className="flex justify-between text-xs mb-1">
            <span>Scanner</span>
            <span>{scanProgress.toFixed(0)}%</span>
          </div>
          <Progress
            value={scanProgress}
            className="h-2 bg-gray-700"
          />
        </div>

        {/* Scanner Animation */}
        <div className={`relative bg-gray-900 rounded overflow-hidden flex-shrink-0 ${isEmbedded ? 'mb-2 h-16' : 'mb-6 h-32'}`}>
          {/* Linha de scan */}
          <div
            className="absolute top-0 w-full h-0.5 bg-blue-400 transition-transform duration-100"
            style={{
              transform: `translateY(${(scanProgress / 100) * (isEmbedded ? 64 : 128)}px)`,
              boxShadow: '0 0 10px #60a5fa'
            }}
          />

          {/* Grid de fundo */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="border-b border-blue-500/30 h-4"
              />
            ))}
          </div>

          {/* Texto overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-blue-400 text-xs text-center">
              {scanPhase === 'scanning' && 'Escaneando...'}
              {scanPhase === 'processing' && 'Processando Liquidez...'}
              {scanPhase === 'complete' && 'Processamento Concluído!'}
            </div>
          </div>
        </div>

        {/* Liquidez Info */}
        <div className={`grid grid-cols-2 gap-2 text-xs flex-shrink-0 ${isEmbedded ? 'mb-2' : 'mb-4'}`}>
          <div className="text-center">
            <div className="text-muted-foreground">Liquidez Disponível</div>
            <div className="font-bold text-green-400">${availableLiquidity.toLocaleString()}</div>
          </div>
          <div className="text-center">
            <div className="text-muted-foreground">Total de Apostas</div>
            <div className="font-bold text-blue-400">{bets.length}</div>
          </div>
        </div>

        {/* Lista de apostas sendo processadas - espaço fixo */}
        <div className={`overflow-y-auto flex-1 ${isEmbedded ? 'min-h-0' : 'max-h-32'}`}>
          {scanPhase === 'processing' ? (
            <>
              <div className="text-xs font-semibold mb-1">Processando:</div>
              {processedBets.map((bet, index) => (
                <div
                  key={bet.id}
                  className={`flex justify-between items-center py-1 px-2 rounded mb-1 text-xs ${
                    bet.status === 'accepted'
                      ? 'bg-green-900/30 text-green-400'
                      : 'bg-red-900/30 text-red-400'
                  }`}
                >
                  <span>{bet.username}</span>
                  <span>${bet.amount}</span>
                  <span>
                    {bet.status === 'accepted' ? '✅' : '❌'}
                  </span>
                </div>
              ))}
            </>
          ) : (
            <div className="text-xs text-center text-muted-foreground py-4">
              Aguardando processamento...
            </div>
          )}
        </div>
        </div>
      ) : (
        <Card className={cardClass}>
          {/* Header */}
          <div className="text-center mb-2 flex-shrink-0">
            <div className={`font-bold text-blue-400 mb-1 ${isEmbedded ? 'text-sm' : 'text-xl'}`}>
              🔍 EQUALIZADOR DE LIQUIDEZ
            </div>
            <div className={`text-muted-foreground ${isEmbedded ? 'text-xs' : 'text-sm'}`}>
              Processando apostas nos últimos 5 segundos...
            </div>
          </div>

          {/* Scanner Progress */}
          <div className={`flex-shrink-0 ${isEmbedded ? "mb-2" : "mb-6"}`}>
            <div className="flex justify-between text-xs mb-1">
              <span>Scanner</span>
              <span>{scanProgress.toFixed(0)}%</span>
            </div>
            <Progress
              value={scanProgress}
              className="h-2 bg-gray-700"
            />
          </div>

          {/* Scanner Animation */}
          <div className={`relative bg-gray-900 rounded border overflow-hidden flex-shrink-0 ${isEmbedded ? 'mb-2 h-16' : 'mb-6 h-32'}`}>
            {/* Linha de scan */}
            <div
              className="absolute top-0 w-full h-0.5 bg-blue-400 transition-transform duration-100"
              style={{
                transform: `translateY(${(scanProgress / 100) * (isEmbedded ? 64 : 128)}px)`,
                boxShadow: 'none'
              }}
            />

            {/* Grid de fundo */}
            <div className="absolute inset-0 opacity-20">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="border-b border-blue-500/30 h-4"
                />
              ))}
            </div>

            {/* Texto overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-blue-400 text-xs text-center">
                {scanPhase === 'scanning' && 'Escaneando...'}
                {scanPhase === 'processing' && 'Processando Liquidez...'}
                {scanPhase === 'complete' && 'Processamento Concluído!'}
              </div>
            </div>
          </div>

          {/* Liquidez Info */}
          <div className={`grid grid-cols-2 gap-2 text-xs flex-shrink-0 ${isEmbedded ? 'mb-2' : 'mb-4'}`}>
            <div className="text-center">
              <div className="text-muted-foreground">Liquidez Disponível</div>
              <div className="font-bold text-green-400">${availableLiquidity.toLocaleString()}</div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground">Total de Apostas</div>
              <div className="font-bold text-blue-400">{bets.length}</div>
            </div>
          </div>

          {/* Lista de apostas sendo processadas - espaço fixo */}
          <div className={`overflow-y-auto flex-1 ${isEmbedded ? 'min-h-0' : 'max-h-32'}`}>
            {scanPhase === 'processing' ? (
              <>
                <div className="text-xs font-semibold mb-1">Processando:</div>
                {processedBets.map((bet, index) => (
                  <div
                    key={bet.id}
                    className={`flex justify-between items-center py-1 px-2 rounded mb-1 text-xs ${
                      bet.status === 'accepted'
                        ? 'bg-green-900/30 text-green-400'
                        : 'bg-red-900/30 text-red-400'
                    }`}
                  >
                    <span>{bet.username}</span>
                    <span>${bet.amount}</span>
                    <span>
                      {bet.status === 'accepted' ? '✅' : '❌'}
                    </span>
                  </div>
                ))}
              </>
            ) : (
              <div className="text-xs text-center text-muted-foreground py-4">
                Aguardando processamento...
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};