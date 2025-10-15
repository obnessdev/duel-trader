import { useCallback } from 'react';

export const useSound = () => {
  const playVictorySound = useCallback(() => {
    try {
      const audio = new Audio('/victory-sound.mp3');
      audio.volume = 0.6;
      audio.play().catch(console.error);
    } catch (error) {
      console.error('Erro ao reproduzir som de vitória:', error);
    }
  }, []);

  const playSound = useCallback((soundPath: string, volume: number = 0.6) => {
    try {
      const audio = new Audio(soundPath);
      audio.volume = volume;
      audio.play().catch(console.error);
    } catch (error) {
      console.error('Erro ao reproduzir som:', error);
    }
  }, []);

  return {
    playVictorySound,
    playSound
  };
};