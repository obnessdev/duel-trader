import { useEffect, useRef } from 'react';
import { Direction } from '@/types/trading';

const TRADER_NAMES = [
  'CryptoKing', 'TraderPro', 'MoonShot', 'DiamondHands', 'BullRunner',
  'BearHunter', 'WhaleTrades', 'DayTrader99', 'HODLer420', 'CoinMaster',
  'BitBoss', 'EthEnthusiast', 'AltCoinKing', 'ChartWizard', 'TrendFollower',
  'SwingMaster', 'ScalpKing', 'YieldFarmer', 'DefiLord', 'NFTTrader',
];

const EMOJIS = ['🚀', '💎', '🔥', '📈', '📉', '💰', '🎉', '👏', '😱', '🤑', '💪', '🎯'];

interface SimulatedTraderEvent {
  type: 'bet' | 'emoji';
  username: string;
  direction?: Direction;
  amount?: number;
  emoji?: string;
}

export const useSimulatedTraders = (
  asset: string,
  onEvent: (event: SimulatedTraderEvent) => void,
  enabled: boolean = true
) => {
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!enabled) return;

    const generateEvent = () => {
      // 70% chance de aposta, 30% chance de emoji
      const isBet = Math.random() > 0.3;
      const username = TRADER_NAMES[Math.floor(Math.random() * TRADER_NAMES.length)];

      if (isBet) {
        // Gera aposta
        const direction: Direction = Math.random() > 0.5 ? 'CALL' : 'PUT';
        const amounts = [5, 10, 15, 20, 25, 50, 100];
        const amount = amounts[Math.floor(Math.random() * amounts.length)];

        onEvent({
          type: 'bet',
          username,
          direction,
          amount,
        });
      } else {
        // Gera emoji
        const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
        
        onEvent({
          type: 'emoji',
          username,
          emoji,
        });
      }

      // Próximo evento em 5-20 segundos
      const nextDelay = 5000 + Math.random() * 15000;
      intervalRef.current = setTimeout(generateEvent, nextDelay);
    };

    // Primeiro evento após 3-8 segundos
    const initialDelay = 3000 + Math.random() * 5000;
    intervalRef.current = setTimeout(generateEvent, initialDelay);

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [asset, enabled, onEvent]);
};

