import { useState, useEffect } from 'react';

export const useRealPrice = (symbol: string = 'BTCUSDT') => {
  const [price, setPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        // Usando API da Binance para preço real
        const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
        const data = await response.json();

        if (data.price) {
          setPrice(parseFloat(data.price));
          setError(null);
        } else {
          throw new Error('Preço não encontrado');
        }
      } catch (err) {
        console.error('Erro ao buscar preço real:', err);
        setError('Erro ao carregar preço');
        // Fallback para preço mock se API falhar
        setPrice(65000 + Math.random() * 5000);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrice();

    // Atualizar preço a cada 30 segundos
    const interval = setInterval(fetchPrice, 30000);

    return () => clearInterval(interval);
  }, [symbol]);

  return { price, isLoading, error };
};