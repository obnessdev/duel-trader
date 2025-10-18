import { useEffect, useState } from 'react';

// URL do efeito sonoro de vitória
const VICTORY_SOUND_URL = 'https://flyughatwfagmonhnmby.supabase.co/storage/v1/object/sign/Arquivos/Efeito%20sonoro%20vitoria%20-%20OBNESS.mp3?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDBiZWRmZi02N2IwLTRjMjEtYjQ4Ny00ZTc1YzhhZWEwYTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBcnF1aXZvcy9FZmVpdG8gc29ub3JvIHZpdG9yaWEgLSBPQk5FU1MubXAzIiwiaWF0IjoxNzYwNTAyMzE3LCJleHAiOjIwNzU4NjIzMTd9.nIRn13oscXgDuZBh9EEmnW9fF5_g7qvDE1aRPgSKpRE';

// URL da imagem de moedas
const COINS_IMAGE_URL = 'https://flyughatwfagmonhnmby.supabase.co/storage/v1/object/sign/Arquivos/Moedas.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDBiZWRmZi02N2IwLTRjMjEtYjQ4Ny00ZTc1YzhhZWEwYTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBcnF1aXZvcy9Nb2VkYXMucG5nIiwiaWF0IjoxNzYwNTAyMzQ2LCJleHAiOjIwNzU4NjIzNDZ9.tntX4VyU-wOkYOj7qwxdctHMQ5Pf1kdd4zhAvElG8rY';

interface WinAnimationProps {
  isVisible: boolean;
  amount: number;
  onComplete: () => void;
}

export const WinAnimation = ({ isVisible, amount, onComplete }: WinAnimationProps) => {
  const [coins, setCoins] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);
  const [hasPlayedSound, setHasPlayedSound] = useState(false);

  useEffect(() => {
    if (isVisible && !hasPlayedSound) {
      // Tocar efeito sonoro de vitória apenas uma vez
      const audio = new Audio(VICTORY_SOUND_URL);
      audio.volume = 0.7;
      audio.play().catch(console.error);
      setHasPlayedSound(true);

      // Criar uma moeda gigantesca no centro
      const centerCoin = [{
        id: 0,
        x: window.innerWidth / 2 - 480, // Centralizar (moeda de 960px)
        y: window.innerHeight / 2 - 480,
        delay: 0
      }];

      setCoins(centerCoin);
      
      // Limpar após animação
      setTimeout(() => {
        setCoins([]);
        setHasPlayedSound(false); // Reset para próxima vitória
        onComplete();
      }, 3000);
    } else if (!isVisible) {
      // Reset quando animação não está visível
      setHasPlayedSound(false);
    }
  }, [isVisible, onComplete, hasPlayedSound]);

  if (!isVisible) return null;

  return (
    <>
      
      {/* Moedas voando com fundo verde */}
      {coins.map((coin) => (
        <div
          key={coin.id}
          className="fixed z-50 pointer-events-none animate-bounce"
          style={{
            left: `${coin.x}px`,
            top: `${coin.y}px`,
            animationDelay: `${coin.delay}ms`,
            animationDuration: '1.5s'
          }}
        >
          {/* Apenas a imagem das moedas, gigantesca */}
          <img
            src={COINS_IMAGE_URL}
            alt="Moedas"
            className="w-[60rem] h-[60rem] object-contain"
          />
        </div>
      ))}
      
    </>
  );
};
