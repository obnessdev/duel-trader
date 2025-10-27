import { Language } from '@/hooks/useLanguage';

interface Translations {
  // Header
  asset: string;
  timeframe: string;
  btcPrice: string;
  theme: string;
  realBalance: string;
  deposit: string;

  // User Menu
  myAccount: string;
  history: string;
  withdraw: string;
  logout: string;

  // DuelPanel
  placeOrder: string;
  amount: string;
  rate: string;
  payout: string;
  winner: string;
  green: string;
  red: string;
  equalizerActive: string;

  // OrderBook
  vs: string;
  scanning: string;

  // Chat
  chatPlaceholder: string;
  won: string;
  lost: string;
  aiEqualizerRefund: string;

  // HistoryTabs
  historyTab: string;
  ordersTab: string;
  operationsTab: string;

  // Chart
  open: string;
  high: string;
  low: string;
  close: string;

  // Common
  loading: string;
  time: string;
  price: string;

  // Languages
  languages: {
    pt: string;
    en: string;
    es: string;
  };
}

export const translations: Record<Language, Translations> = {
  pt: {
    // Header
    asset: 'Asset',
    timeframe: 'Timeframe',
    btcPrice: 'BTC Price',
    theme: 'Theme',
    realBalance: 'REAL BALANCE',
    deposit: '$ DEPOSIT',

    // User Menu
    myAccount: 'Minha Conta',
    history: 'Histórico',
    withdraw: 'Sacar',
    logout: 'Deslogar',

    // DuelPanel
    placeOrder: 'Place Order 1 MIN',
    amount: 'Amount',
    rate: 'Rate (5%)',
    payout: 'Payout 100%',
    winner: 'Winner',
    green: 'GREEN',
    red: 'RED',
    equalizerActive: '🔍 Equalizer Active',

    // OrderBook
    vs: 'VS',
    scanning: 'SCANNING...',

    // Chat
    chatPlaceholder: 'Digite sua mensagem...',
    won: 'GANHOU',
    lost: 'PERDEU',
    aiEqualizerRefund: '🤖 AI EQUALIZER REEMBOLSOU',

    // HistoryTabs
    historyTab: 'Histórico',
    ordersTab: 'Ordens',
    operationsTab: 'Operações',

    // Chart
    open: 'O',
    high: 'H',
    low: 'L',
    close: 'C',

    // Common
    loading: 'Loading...',
    time: 'Tempo',
    price: 'Preço',

    // Languages
    languages: {
      pt: 'Português',
      en: 'English',
      es: 'Español'
    }
  },

  en: {
    // Header
    asset: 'Asset',
    timeframe: 'Timeframe',
    btcPrice: 'BTC Price',
    theme: 'Theme',
    realBalance: 'REAL BALANCE',
    deposit: '$ DEPOSIT',

    // User Menu
    myAccount: 'My Account',
    history: 'History',
    withdraw: 'Withdraw',
    logout: 'Logout',

    // DuelPanel
    placeOrder: 'Place Order 1 MIN',
    amount: 'Amount',
    rate: 'Rate (5%)',
    payout: 'Payout 100%',
    winner: 'Winner',
    green: 'GREEN',
    red: 'RED',
    equalizerActive: '🔍 Equalizer Active',

    // OrderBook
    vs: 'VS',
    scanning: 'SCANNING...',

    // Chat
    chatPlaceholder: 'Type your message...',
    won: 'WON',
    lost: 'LOST',
    aiEqualizerRefund: '🤖 AI EQUALIZER REFUNDED',

    // HistoryTabs
    historyTab: 'History',
    ordersTab: 'Orders',
    operationsTab: 'Operations',

    // Chart
    open: 'O',
    high: 'H',
    low: 'L',
    close: 'C',

    // Common
    loading: 'Loading...',
    time: 'Time',
    price: 'Price',

    // Languages
    languages: {
      pt: 'Português',
      en: 'English',
      es: 'Español'
    }
  },

  es: {
    // Header
    asset: 'Activo',
    timeframe: 'Marco Temporal',
    btcPrice: 'Precio BTC',
    theme: 'Tema',
    realBalance: 'BALANCE REAL',
    deposit: '$ DEPOSITAR',

    // User Menu
    myAccount: 'Mi Cuenta',
    history: 'Historial',
    withdraw: 'Retirar',
    logout: 'Cerrar Sesión',

    // DuelPanel
    placeOrder: 'Realizar Orden 1 MIN',
    amount: 'Cantidad',
    rate: 'Tasa (5%)',
    payout: 'Pago 100%',
    winner: 'Ganador',
    green: 'VERDE',
    red: 'ROJO',
    equalizerActive: '🔍 Ecualizador Activo',

    // OrderBook
    vs: 'VS',
    scanning: 'ESCANEANDO...',

    // Chat
    chatPlaceholder: 'Escribe tu mensaje...',
    won: 'GANÓ',
    lost: 'PERDIÓ',
    aiEqualizerRefund: '🤖 AI ECUALIZADOR REEMBOLSÓ',

    // HistoryTabs
    historyTab: 'Historial',
    ordersTab: 'Órdenes',
    operationsTab: 'Operaciones',

    // Chart
    open: 'A',
    high: 'M',
    low: 'B',
    close: 'C',

    // Common
    loading: 'Cargando...',
    time: 'Tiempo',
    price: 'Precio',

    // Languages
    languages: {
      pt: 'Português',
      en: 'English',
      es: 'Español'
    }
  }
};

export const useTranslation = (language: Language) => {
  return (key: keyof Translations | string): string => {
    // Handle nested keys like 'languages.pt'
    if (key.includes('.')) {
      const keys = key.split('.');
      let value: any = translations[language];
      
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          return key; // Return key if not found
        }
      }
      
      return typeof value === 'string' ? value : key;
    }
    
    // Handle direct keys
    const value = translations[language][key as keyof Translations];
    return typeof value === 'string' ? value : key;
  };
};