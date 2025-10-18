interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface IndicatorData {
  time: number;
  value: number;
}

// Simple Moving Average
export const calculateSMA = (data: CandleData[], period: number = 20): IndicatorData[] => {
  const result: IndicatorData[] = [];

  for (let i = period - 1; i < data.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j].close;
    }
    const sma = sum / period;

    result.push({
      time: data[i].time,
      value: sma
    });
  }

  return result;
};

// Exponential Moving Average
export const calculateEMA = (data: CandleData[], period: number = 20): IndicatorData[] => {
  const result: IndicatorData[] = [];
  const multiplier = 2 / (period + 1);

  // Start with SMA for first value
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += data[i].close;
  }
  let ema = sum / period;

  result.push({
    time: data[period - 1].time,
    value: ema
  });

  // Calculate EMA for remaining values
  for (let i = period; i < data.length; i++) {
    ema = (data[i].close - ema) * multiplier + ema;
    result.push({
      time: data[i].time,
      value: ema
    });
  }

  return result;
};

// Relative Strength Index
export const calculateRSI = (data: CandleData[], period: number = 14): IndicatorData[] => {
  const result: IndicatorData[] = [];

  if (data.length < period + 1) return result;

  // Calculate price changes
  const changes: number[] = [];
  for (let i = 1; i < data.length; i++) {
    changes.push(data[i].close - data[i - 1].close);
  }

  // Calculate initial average gain and loss
  let avgGain = 0;
  let avgLoss = 0;

  for (let i = 0; i < period; i++) {
    const change = changes[i];
    if (change > 0) {
      avgGain += change;
    } else {
      avgLoss += Math.abs(change);
    }
  }

  avgGain /= period;
  avgLoss /= period;

  // Calculate RSI
  for (let i = period; i < changes.length; i++) {
    const change = changes[i];

    if (change > 0) {
      avgGain = (avgGain * (period - 1) + change) / period;
      avgLoss = (avgLoss * (period - 1)) / period;
    } else {
      avgGain = (avgGain * (period - 1)) / period;
      avgLoss = (avgLoss * (period - 1) + Math.abs(change)) / period;
    }

    const rs = avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));

    result.push({
      time: data[i + 1].time,
      value: rsi
    });
  }

  return result;
};

// Bollinger Bands
export interface BollingerBands {
  time: number;
  upper: number;
  middle: number;
  lower: number;
}

export const calculateBollingerBands = (data: CandleData[], period: number = 20, stdDev: number = 2): BollingerBands[] => {
  const result: BollingerBands[] = [];

  for (let i = period - 1; i < data.length; i++) {
    // Calculate SMA
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j].close;
    }
    const sma = sum / period;

    // Calculate standard deviation
    let variance = 0;
    for (let j = 0; j < period; j++) {
      variance += Math.pow(data[i - j].close - sma, 2);
    }
    const standardDeviation = Math.sqrt(variance / period);

    result.push({
      time: data[i].time,
      middle: sma,
      upper: sma + (standardDeviation * stdDev),
      lower: sma - (standardDeviation * stdDev)
    });
  }

  return result;
};

// MACD
export interface MACDData {
  time: number;
  macd: number;
  signal: number;
  histogram: number;
}

export const calculateMACD = (data: CandleData[], fastPeriod: number = 12, slowPeriod: number = 26, signalPeriod: number = 9): MACDData[] => {
  const result: MACDData[] = [];

  const fastEMA = calculateEMA(data, fastPeriod);
  const slowEMA = calculateEMA(data, slowPeriod);

  // Calculate MACD line
  const macdLine: IndicatorData[] = [];
  const startIndex = Math.max(fastEMA.length, slowEMA.length) - Math.min(fastEMA.length, slowEMA.length);

  for (let i = startIndex; i < Math.min(fastEMA.length, slowEMA.length); i++) {
    const fastValue = fastEMA[i - (fastEMA.length - slowEMA.length < 0 ? 0 : fastEMA.length - slowEMA.length)];
    const slowValue = slowEMA[i - (slowEMA.length - fastEMA.length < 0 ? 0 : slowEMA.length - fastEMA.length)];

    if (fastValue && slowValue && fastValue.time === slowValue.time) {
      macdLine.push({
        time: fastValue.time,
        value: fastValue.value - slowValue.value
      });
    }
  }

  // Calculate signal line (EMA of MACD)
  const macdData: CandleData[] = macdLine.map(point => ({
    time: point.time,
    open: point.value,
    high: point.value,
    low: point.value,
    close: point.value,
    volume: 0
  }));

  const signalLine = calculateEMA(macdData, signalPeriod);

  // Combine MACD and Signal
  for (let i = 0; i < Math.min(macdLine.length, signalLine.length); i++) {
    const macdValue = macdLine[i + (macdLine.length - signalLine.length)];
    const signalValue = signalLine[i];

    if (macdValue && signalValue && macdValue.time === signalValue.time) {
      result.push({
        time: macdValue.time,
        macd: macdValue.value,
        signal: signalValue.value,
        histogram: macdValue.value - signalValue.value
      });
    }
  }

  return result;
};

// Volume Profile (simplified)
export interface VolumeProfileData {
  price: number;
  volume: number;
  percentage: number;
}

export const calculateVolumeProfile = (data: CandleData[], levels: number = 20): VolumeProfileData[] => {
  if (data.length === 0) return [];

  // Find price range
  const prices = data.flatMap(d => [d.high, d.low]);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceStep = (maxPrice - minPrice) / levels;

  // Create price levels
  const volumeProfile: { [price: number]: number } = {};

  for (let i = 0; i < levels; i++) {
    const priceLevel = minPrice + (i * priceStep);
    volumeProfile[priceLevel] = 0;
  }

  // Calculate volume at each price level
  data.forEach(candle => {
    const volumePerPrice = candle.volume / 4; // Distribute volume across OHLC

    [candle.open, candle.high, candle.low, candle.close].forEach(price => {
      // Find closest price level
      const levelIndex = Math.min(levels - 1, Math.floor((price - minPrice) / priceStep));
      const priceLevel = minPrice + (levelIndex * priceStep);
      volumeProfile[priceLevel] += volumePerPrice;
    });
  });

  // Convert to array and calculate percentages
  const totalVolume = Object.values(volumeProfile).reduce((sum, vol) => sum + vol, 0);

  return Object.entries(volumeProfile)
    .map(([price, volume]) => ({
      price: parseFloat(price),
      volume,
      percentage: (volume / totalVolume) * 100
    }))
    .sort((a, b) => a.price - b.price);
};

// Support and Resistance Levels
export interface SupportResistanceLevel {
  price: number;
  strength: number;
  type: 'support' | 'resistance';
  touches: number;
}

export const calculateSupportResistance = (data: CandleData[], sensitivity: number = 0.02): SupportResistanceLevel[] => {
  if (data.length < 10) return [];

  const levels: SupportResistanceLevel[] = [];
  const pricePoints = data.flatMap(d => [d.high, d.low]);
  const tolerance = (Math.max(...pricePoints) - Math.min(...pricePoints)) * sensitivity;

  // Find potential levels by looking for price clusters
  const clusters: { [key: string]: { price: number; count: number; highs: number; lows: number } } = {};

  data.forEach(candle => {
    [
      { price: candle.high, type: 'high' },
      { price: candle.low, type: 'low' }
    ].forEach(({ price, type }) => {
      const key = Math.round(price / tolerance).toString();

      if (!clusters[key]) {
        clusters[key] = { price, count: 0, highs: 0, lows: 0 };
      }

      clusters[key].count++;
      clusters[key].price = (clusters[key].price + price) / 2; // Average price

      if (type === 'high') clusters[key].highs++;
      if (type === 'low') clusters[key].lows++;
    });
  });

  // Convert clusters to support/resistance levels
  Object.values(clusters).forEach(cluster => {
    if (cluster.count >= 3) { // Minimum 3 touches
      const isResistance = cluster.highs > cluster.lows;

      levels.push({
        price: cluster.price,
        strength: cluster.count,
        type: isResistance ? 'resistance' : 'support',
        touches: cluster.count
      });
    }
  });

  // Sort by strength (most touches first)
  return levels.sort((a, b) => b.strength - a.strength).slice(0, 10); // Top 10 levels
};