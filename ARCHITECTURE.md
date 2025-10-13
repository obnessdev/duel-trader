# 🏗️ Arquitetura do Duel Trader

Este documento descreve a arquitetura técnica, decisões de design e fluxos de dados do projeto Duel Trader.

## 📐 Visão Geral

O Duel Trader é uma Single Page Application (SPA) construída com React que se comunica diretamente com a API pública da Binance via WebSocket para obter dados de preços em tempo real.

```
┌─────────────┐          ┌──────────────┐          ┌─────────────┐
│   Browser   │ ◄────► │  React App   │ ◄────► │   Binance   │
│  (Client)   │          │   (Vite)     │          │  WebSocket  │
└─────────────┘          └──────────────┘          └─────────────┘
                                │
                                ▼
                         ┌──────────────┐
                         │ LocalStorage │
                         │  (Persist)   │
                         └──────────────┘
```

## 🧩 Componentes Principais

### 1. Pages Layer (`src/pages/`)

#### Index.tsx
- **Responsabilidade:** Página principal da aplicação, orquestra todos os componentes
- **Estado:** Gerencia estado global (asset selecionado, timeframe, trade ativo, histórico)
- **Lógica de Negócio:** Implementa regras de duel (início, conclusão, cálculo de ganhos)

```typescript
// Estados principais
- selectedAsset: string         // Asset atual (btcusdt, ethusdt, etc)
- timeframe: number             // Duração do duel em minutos
- activeTrade: Trade | null     // Duel ativo atual
- balance: number               // Saldo do usuário
- tradeHistory: Trade[]         // Histórico de duels
```

### 2. Components Layer (`src/components/`)

#### Header.tsx
- Seleção de asset e timeframe
- Exibição de preço atual e saldo
- Branding OBNESS
- **Props:** assets, selectedAsset, timeframe, balance, currentPrice

#### CandlestickChart.tsx
- **Responsabilidade:** Renderiza gráfico de candlesticks
- **Lógica:** 
  - Agrupa preços em candles por minuto
  - Mantém histórico de 30 candles
  - Calcula OHLC (Open, High, Low, Close)
  - Renderiza volume bars
- **Props:** priceData, isConnected, asset

```typescript
interface Candle {
  time: string      // Timestamp formatado
  open: number      // Preço de abertura
  high: number      // Preço máximo
  low: number       // Preço mínimo
  close: number     // Preço de fechamento
  volume: number    // Volume (simulado)
}
```

#### DuelPanel.tsx
- **Responsabilidade:** Interface para iniciar duels
- **Validações:**
  - Valor mínimo: $1
  - Valor máximo: $1000
  - Não permite novo duel se já existe um ativo
- **Cálculos:** Taxa de 5% sobre o valor apostado
- **Props:** asset, currentPrice, timeframe, onStartDuel, isActive

#### OrderBook.tsx
- **Responsabilidade:** Exibe ordem de trades CALL vs PUT
- **Dados:** Simulados (gerados randomicamente)
- **Update:** A cada 15 segundos
- **Visualização:** Barras horizontais mostrando demanda

#### ChartSidebar.tsx
- Ferramentas de análise técnica
- Indicadores (em desenvolvimento)

#### HistoryTabs.tsx
- Histórico de trades
- Estatísticas de desempenho

#### TradeNotifications.tsx
- Sistema de notificações toast

#### LiveChat.tsx
- **Responsabilidade:** Chat ao vivo estilo YouTube Live
- **Features:**
  - Feed de mensagens em tempo real
  - Auto-scroll para mensagens novas
  - 4 tipos de mensagens: bet, result, emoji, system
  - Painel de emojis (16 opções)
  - Contador de mensagens
  - Design responsivo e moderno
- **Props:** messages (ChatMessage[]), onSendEmoji (função)
- **Tipos de Mensagem:**
  - `bet`: Quando usuário abre posição CALL/PUT
  - `result`: Quando duel termina (WIN/LOSS)
  - `emoji`: Quando usuário envia emoji
  - `system`: Mensagens do sistema (futuro)

### 3. Hooks Layer (`src/hooks/`)

#### useBinancePrice.ts
- **Responsabilidade:** Conexão WebSocket com Binance
- **Features:**
  - Auto-reconexão (3s delay)
  - Parse de dados de ticker
  - Estados de conexão
  
```typescript
// Retorna
{
  priceData: {
    price: number        // Preço atual
    timestamp: number    // Timestamp do evento
    change24h: number    // Mudança percentual 24h
  },
  isConnected: boolean   // Status da conexão
}

// Conecta em: wss://stream.binance.com:9443/ws/{symbol}@ticker
```

#### useToast.ts
- Hook do shadcn-ui para notificações

### 4. Types Layer (`src/types/`)

#### trading.ts
Define todas as interfaces TypeScript do domínio:

```typescript
// Direção do trade
type Direction = 'CALL' | 'PUT'

// Status do duel
type DuelStatus = 'waiting' | 'active' | 'completed'

// Trade completo
interface Trade {
  id: string
  asset: string
  timeframe: number
  direction: Direction
  amount: number
  fee: number
  entryPrice: number
  exitPrice?: number
  startTime: number
  endTime?: number
  status: DuelStatus
  result?: 'win' | 'loss'
  profit?: number
}

// Asset disponível
interface Asset {
  symbol: string    // btcusdt, ethusdt, etc
  name: string      // BTC/USDT
  icon: string      // Ícone
}

// Dados de preço
interface PriceData {
  price: number
  timestamp: number
  change24h: number
}

// Tipo de mensagem do chat
type ChatMessageType = 'bet' | 'result' | 'emoji' | 'system'

// Mensagem do chat ao vivo
interface ChatMessage {
  id: string
  type: ChatMessageType
  username: string
  content: string
  timestamp: number
  data?: {
    direction?: Direction
    amount?: number
    asset?: string
    result?: 'win' | 'loss'
    profit?: number
  }
}
```

## 🔄 Fluxos de Dados

### Fluxo 1: Inicialização

```
1. App.tsx monta
2. Index.tsx carrega tradeHistory do localStorage
3. useBinancePrice conecta WebSocket
4. Componentes recebem props e renderizam
```

### Fluxo 2: Início de Duel

```
1. Usuário define valor no DuelPanel
2. Clica em CALL ou PUT
3. DuelPanel valida input
4. Chama onStartDuel() do Index
5. Index.tsx cria objeto Trade
6. Define setTimeout() para timeframe
7. Atualiza activeTrade state
8. Mostra toast de confirmação
9. Componentes re-renderizam (DuelPanel fica disabled)
```

### Fluxo 3: Conclusão de Duel

```
1. setTimeout() dispara completeDuel()
2. Compara exitPrice com entryPrice
3. Determina resultado (win/loss):
   - CALL + price up = win
   - CALL + price down = loss
   - PUT + price down = win
   - PUT + price up = loss
4. Calcula profit/loss
5. Adiciona ao tradeHistory
6. Salva no localStorage
7. Limpa activeTrade
8. Mostra toast com resultado
```

### Fluxo 4: Atualização de Preços

```
1. WebSocket recebe mensagem
2. useBinancePrice parseia dados
3. Atualiza priceData state
4. React re-renderiza componentes:
   - Header mostra novo preço
   - CandlestickChart atualiza candle
   - DuelPanel atualiza display
```

### Fluxo 5: Chat ao Vivo

```
Quando Duel Inicia:
1. handleStartDuel() é chamado
2. addChatMessage() cria mensagem tipo 'bet'
3. Mensagem é adicionada ao chatMessages state
4. LiveChat re-renderiza com nova mensagem
5. Auto-scroll para o bottom

Quando Duel Termina:
1. completeDuel() calcula resultado
2. addChatMessage() cria mensagem tipo 'result'
3. Mostra WIN/LOSS com valor do lucro/prejuízo
4. LiveChat atualiza feed

Quando Usuário Envia Emoji:
1. Usuário clica em emoji no painel
2. handleSendEmoji() é chamado
3. addChatMessage() cria mensagem tipo 'emoji'
4. Emoji aparece no feed com username e timestamp
```

## 🎨 UI/UX Design Decisions

### Cores Semânticas
- **Verde (Success):** CALL, ganhos, positivo
- **Vermelho (Destructive):** PUT, perdas, negativo
- **Tema:** Dark mode padrão

### Feedback Visual
- Indicador de conexão WebSocket (bolinha verde/vermelha)
- Candles verdes/vermelhos baseado em open/close
- Preço atual mostrado com linha tracejada no gráfico
- Animações suaves em transições

### Responsividade
- Layout grid com sidebar fixa
- Chart responsivo
- Mobile-first (em desenvolvimento)

## 🔧 Decisões Técnicas

### Por que WebSocket direto?
- **Prós:** Baixa latência, dados em tempo real, simples
- **Contras:** Sem controle de rate limiting, sem cache server-side
- **Decisão:** OK para MVP, backend necessário para produção

### Por que LocalStorage?
- **Prós:** Simples, rápido, sem backend necessário
- **Contras:** Limitado a 5MB, não compartilhado entre devices
- **Decisão:** Suficiente para histórico local, migrar para DB futuramente

### Por que Vite?
- **Prós:** Fast refresh, build rápido, ESM nativo
- **Contras:** Nenhum relevante
- **Decisão:** Melhor DX para projetos React modernos

### Por que shadcn-ui?
- **Prós:** Componentes copiáveis, customizáveis, sem overhead
- **Contras:** Setup inicial manual
- **Decisão:** Controle total sobre UI components

## 📊 Performance

### Otimizações Implementadas
- React.memo em componentes puros (a fazer)
- useMemo para cálculos pesados (a fazer)
- useCallback para funções passadas como props (a fazer)
- Limita histórico de candles a 30 itens
- LocalStorage com debounce (a implementar)

### Métricas Alvo
- First Contentful Paint: < 1s
- Time to Interactive: < 2s
- WebSocket latency: < 100ms
- Re-render time: < 16ms (60fps)

## 🔐 Segurança (Futuro)

### Vulnerabilidades Atuais
- ⚠️ Sem autenticação de usuário
- ⚠️ Validação apenas no frontend
- ⚠️ Saldo apenas local
- ⚠️ Sem proteção contra manipulação

### Melhorias Necessárias para Produção
- [ ] Backend com autenticação JWT
- [ ] Validação server-side de trades
- [ ] Database real (PostgreSQL/MongoDB)
- [ ] Rate limiting
- [ ] Auditoria de trades
- [ ] Criptografia de dados sensíveis

## 🧪 Testing Strategy (Futuro)

```
Unit Tests       → Lógica de negócio, utils
Integration Tests → Fluxos de duel, WebSocket
E2E Tests        → Fluxos críticos de usuário
```

## 📈 Escalabilidade

### Limitações Atuais
- Single page, sem code splitting
- Todos os componentes carregados de uma vez
- Sem otimização de bundle

### Melhorias Planejadas
- Lazy loading de páginas
- Code splitting por rota
- Bundle optimization
- CDN para assets estáticos

## 🔄 Estado da Aplicação

### Estado Local (Component State)
- Inputs de formulário
- UI transient state (modals, dropdowns)

### Estado Compartilhado (Props drilling)
- selectedAsset
- timeframe
- balance
- activeTrade
- chatMessages[]

### Estado Persistente (LocalStorage)
- tradeHistory[]

### Estado Assíncrono (React Query - futuro)
- Dados da API
- Cache de preços históricos

## 🎯 Próximos Passos Arquiteturais

1. **Context API** - Eliminar props drilling
2. **React Query** - Cache e sync de dados
3. **Backend API** - Node.js + Express + PostgreSQL
4. **WebSocket Server** - Controle próprio de conexões
5. **State Machine** - XState para fluxo de duels
6. **Micro-frontends** - Separar módulos (opcional)

---

**Última atualização:** Outubro 2025

