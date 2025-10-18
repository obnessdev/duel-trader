import { useEffect } from 'react';

interface LossAnimationProps {
  isVisible: boolean;
  amount: number;
  onComplete: () => void;
}

export const LossAnimation = ({ isVisible, amount, onComplete }: LossAnimationProps) => {
  useEffect(() => {
    if (isVisible) {
      // Limpar após animação
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay com neon vermelho */}
      <div className="fixed inset-0 bg-red-500/20 animate-pulse z-40 pointer-events-none" />
      
      {/* Efeito de borda vermelha sem glow */}
      <div className="fixed inset-0 border-4 border-red-500/50 animate-pulse z-40 pointer-events-none" />

      {/* Texto de derrota central */}
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div className="text-center animate-pulse">
          <div className="text-8xl font-bold text-red-500 mb-4">
            😔 LOSS 😔
          </div>
          <div className="text-4xl font-bold text-red-400">
            -${amount.toFixed(2)}
          </div>
        </div>
      </div>
    </>
  );
};
