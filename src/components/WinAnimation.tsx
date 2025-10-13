import { useEffect, useState } from 'react';

interface WinAnimationProps {
  isVisible: boolean;
  amount: number;
  onComplete: () => void;
}

export const WinAnimation = ({ isVisible, amount, onComplete }: WinAnimationProps) => {
  const [coins, setCoins] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    if (isVisible) {
      // Criar moedas voando
      const newCoins = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        delay: Math.random() * 1000
      }));
      
      setCoins(newCoins);
      
      // Limpar após animação
      setTimeout(() => {
        setCoins([]);
        onComplete();
      }, 3000);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay com neon verde */}
      <div className="fixed inset-0 bg-green-500/20 animate-pulse z-40 pointer-events-none" />
      
      {/* Efeito de neon verde na borda */}
      <div className="fixed inset-0 border-4 border-green-500/50 animate-pulse z-40 pointer-events-none shadow-2xl shadow-green-500/30" />
      
      {/* Moedas voando */}
      {coins.map((coin) => (
        <div
          key={coin.id}
          className="fixed text-4xl animate-bounce z-50 pointer-events-none"
          style={{
            left: `${coin.x}px`,
            top: `${coin.y}px`,
            animationDelay: `${coin.delay}ms`,
            animationDuration: '2s'
          }}
        >
          🪙
        </div>
      ))}
      
      {/* Texto de vitória central */}
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div className="text-center animate-pulse">
          <div className="text-8xl font-bold text-green-500 drop-shadow-2xl mb-4">
            🎉 WIN! 🎉
          </div>
          <div className="text-4xl font-bold text-green-400 drop-shadow-lg">
            +${amount.toFixed(2)}
          </div>
        </div>
      </div>
    </>
  );
};
