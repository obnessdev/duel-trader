# 🔌 API Documentation - Duel Trader

Este documento descreve todas as integrações externas e APIs utilizadas no projeto.

## 📡 Binance WebSocket API

### Overview

O Duel Trader se conecta diretamente à API pública da Binance via WebSocket para obter dados de preços em tempo real.

- **Tipo:** WebSocket público (sem autenticação)
- **Latência:** ~100-300ms
- **Rate Limit:** Não documentado para conexões públicas
- **Documentação oficial:** https://binance-docs.github.io/apidocs/spot/en/#websocket-market-streams

### Endpoint

```
wss://stream.binance.com:9443/ws/{symbol}@ticker
```

**Símbolos suportados:**
- `btcusdt` - Bitcoin/USDT
- `ethusdt` - Ethereum/USDT  
- `bnbusdt` - Binance Coin/USDT
- `solusdt` - Solana/USDT

### Implementação

```typescript
// src/hooks/useBinancePrice.ts
const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@ticker`)

ws.onopen = () => {
  console.log('Connected to Binance')
}

ws.onmessage = (event) => {
  const data = JSON.parse(event.data)
  // Processa dados
}

ws.onerror = (error) => {
  console.error('WebSocket error:', error)
}

ws.onclose = () => {
  // Reconecta após 3 segundos
  setTimeout(connectWebSocket, 3000)
}
```

### Estrutura de Resposta

```json
{
  "e": "24hrTicker",           // Event type
  "E": 1672515782136,          // Event time
  "s": "BTCUSDT",              // Symbol
  "p": "0.0015",               // Price change
  "P": "0.64",                 // Price change percent
  "w": "0.00349557",           // Weighted average price
  "x": "0.00349600",           // Previous close
  "c": "50123.45",             // Last price ← USADO
  "Q": "0.00001",              // Last quantity
  "b": "0.00349452",           // Best bid price
  "B": "81.88000000",          // Best bid quantity
  "a": "0.00349453",           // Best ask price
  "A": "8.07000000",           // Best ask quantity
  "o": "0.00349518",           // Open price
  "h": "0.00351600",           // High price
  "l": "0.00344000",           // Low price
  "v": "146405.21000000",      // Total traded base asset volume
  "q": "513.38429440",         // Total traded quote asset volume
  "O": 1672429382136,          // Statistics open time
  "C": 1672515782136,          // Statistics close time
  "F": 332634234,              // First trade ID
  "L": 332738423,              // Last trade ID
  "n": 104190                  // Total number of trades
}
```

### Campos Utilizados

| Campo | Tipo | Descrição | Uso no App |
|-------|------|-----------|-----------|
| `c` | string | Preço atual | Display de preço, cálculo de duel |
| `E` | number | Event timestamp | Timestamp dos dados |
| `P` | string | Mudança 24h (%) | Exibição de variação |

### Conversão de Dados

```typescript
// src/hooks/useBinancePrice.ts
const data = JSON.parse(event.data)

setPriceData({
  price: parseFloat(data.c),      // String → Number
  timestamp: data.E,               // Epoch ms
  change24h: parseFloat(data.P)   // String → Number (%)
})
```

### Tratamento de Erros

```typescript
// Cenários de erro
1. Conexão falha → Tenta reconectar após 3s
2. Símbolo inválido → WebSocket retorna erro
3. Internet cai → onclose dispara, reconecta
4. Rate limit → Não tratado (raro em uso público)
```

### Exemplo de Uso

```typescript
import { useBinancePrice } from '@/hooks/useBinancePrice'

function MyComponent() {
  const { priceData, isConnected } = useBinancePrice('btcusdt')

  if (!isConnected) {
    return <div>Conectando...</div>
  }

  return (
    <div>
      <p>Preço: ${priceData?.price.toFixed(2)}</p>
      <p>Mudança 24h: {priceData?.change24h.toFixed(2)}%</p>
    </div>
  )
}
```

## 💾 LocalStorage API

### Overview

Usado para persistir histórico de trades localmente no browser do usuário.

- **Capacidade:** ~5MB (varia por browser)
- **Persistência:** Permanente até limpeza manual
- **Sincronização:** Não sincroniza entre devices/browsers

### Estrutura de Dados

```typescript
// Key: 'tradeHistory'
// Value: JSON string de Trade[]

interface Trade {
  id: string              // UUID
  asset: string           // "BTCUSDT"
  timeframe: number       // Minutos (1, 5, 15, 30)
  direction: 'CALL' | 'PUT'
  amount: number          // Valor apostado
  fee: number             // 5% do amount
  entryPrice: number      // Preço de entrada
  exitPrice?: number      // Preço de saída
  startTime: number       // Timestamp início
  endTime?: number        // Timestamp fim
  status: 'waiting' | 'active' | 'completed'
  result?: 'win' | 'loss'
  profit?: number         // Lucro/prejuízo
}
```

### Implementação

#### Salvar Trade

```typescript
// src/pages/Index.tsx
const completedTrade: Trade = {
  ...trade,
  exitPrice,
  endTime: Date.now(),
  status: 'completed',
  result: isWin ? 'win' : 'loss',
  profit: isWin ? trade.amount : -trade.amount
}

const updatedHistory = [...tradeHistory, completedTrade]
setTradeHistory(updatedHistory)
localStorage.setItem('tradeHistory', JSON.stringify(updatedHistory))
```

#### Carregar Histórico

```typescript
// src/pages/Index.tsx
const [tradeHistory, setTradeHistory] = useState<Trade[]>(() => {
  const saved = localStorage.getItem('tradeHistory')
  return saved ? JSON.parse(saved) : []
})
```

#### Limpar Histórico

```typescript
localStorage.removeItem('tradeHistory')
// ou
localStorage.clear() // Limpa tudo
```

### Limitações

- ⚠️ Dados não criptografados
- ⚠️ Pode ser limpo pelo usuário
- ⚠️ Não funciona em modo anônimo
- ⚠️ Limite de ~5MB total
- ⚠️ Não sincroniza entre devices

### Melhorias Futuras

```typescript
// Adicionar compressão para grandes volumes
import { compress, decompress } from 'lz-string'

// Salvar
const compressed = compress(JSON.stringify(data))
localStorage.setItem('key', compressed)

// Carregar
const compressed = localStorage.getItem('key')
const data = JSON.parse(decompress(compressed))
```

## 🔮 APIs Futuras (Planejadas)

### Backend API (Em Desenvolvimento)

```typescript
// Base URL (futuro)
const API_URL = process.env.VITE_API_URL || 'http://localhost:3000'

// Endpoints planejados
POST   /api/auth/register       // Criar conta
POST   /api/auth/login          // Login
GET    /api/user/profile        // Perfil do usuário
GET    /api/user/balance        // Saldo
POST   /api/duel/create         // Criar duel
GET    /api/duel/:id            // Detalhes do duel
GET    /api/duel/history        // Histórico
POST   /api/payment/deposit     // Depositar
POST   /api/payment/withdraw    // Sacar
```

### Authentication (JWT)

```typescript
// Headers de autenticação
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}

// Armazenar token
localStorage.setItem('authToken', token)

// Refresh token
POST /api/auth/refresh
```

### WebSocket Server (Futuro)

```typescript
// Server próprio para broadcasts
const ws = new WebSocket('wss://api.dueltrader.com/ws')

// Eventos
ws.send(JSON.stringify({
  type: 'subscribe',
  channels: ['trades', 'orderbook', 'chat']
}))

// Receber updates
ws.onmessage = (event) => {
  const { type, data } = JSON.parse(event.data)
  
  switch(type) {
    case 'trade_completed':
      // Notificar usuário
      break
    case 'orderbook_update':
      // Atualizar UI
      break
    case 'chat_message':
      // Mostrar mensagem
      break
  }
}
```

### Payment Gateway

```typescript
// Stripe (exemplo)
import { loadStripe } from '@stripe/stripe-js'

const stripe = await loadStripe(process.env.VITE_STRIPE_KEY)

// Criar checkout
const { error } = await stripe.redirectToCheckout({
  sessionId: checkoutSessionId
})
```

## 🛡️ Segurança

### Rate Limiting (Futuro)

```typescript
// Implementar no backend
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // 100 requests
})

app.use('/api/', limiter)
```

### CORS

```typescript
// Backend configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS.split(','),
  credentials: true
}))
```

### Validação

```typescript
// Usar Zod para validação
import { z } from 'zod'

const TradeSchema = z.object({
  asset: z.enum(['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT']),
  amount: z.number().min(1).max(1000),
  direction: z.enum(['CALL', 'PUT']),
  timeframe: z.enum([1, 5, 15, 30])
})

// Validar
const result = TradeSchema.safeParse(data)
if (!result.success) {
  throw new Error('Invalid trade data')
}
```

## 📊 Monitoramento (Futuro)

### Error Tracking

```typescript
// Sentry
import * as Sentry from "@sentry/react"

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.NODE_ENV
})
```

### Analytics

```typescript
// Google Analytics / Plausible
import { analytics } from '@/lib/analytics'

analytics.track('duel_started', {
  asset: 'BTCUSDT',
  amount: 100,
  direction: 'CALL'
})
```

## 🧪 Testing APIs

### Mock WebSocket

```typescript
// src/mocks/websocket.ts
export class MockWebSocket {
  onmessage: ((event: MessageEvent) => void) | null = null
  
  simulatePrice(price: number) {
    const mockData = {
      c: price.toString(),
      E: Date.now(),
      P: '0.5'
    }
    
    this.onmessage?.({
      data: JSON.stringify(mockData)
    } as MessageEvent)
  }
}
```

### Mock API Responses

```typescript
// src/mocks/handlers.ts (MSW)
import { rest } from 'msw'

export const handlers = [
  rest.get('/api/user/balance', (req, res, ctx) => {
    return res(
      ctx.json({ balance: 100.50 })
    )
  })
]
```

## 📖 Referências

- [Binance WebSocket Streams](https://binance-docs.github.io/apidocs/spot/en/#websocket-market-streams)
- [WebSocket API MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [LocalStorage MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [REST API Design](https://restfulapi.net/)

---

**Última atualização:** Outubro 2025

