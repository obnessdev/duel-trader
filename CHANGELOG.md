# 📝 Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Unreleased]

### ✨ Adicionado
- **Chat ao Vivo** estilo YouTube Live
  - Feed de mensagens em tempo real
  - Notificações automáticas quando apostas são feitas
  - Notificações de resultados (WIN/LOSS) com valores
  - Sistema de emojis (16 emojis disponíveis)
  - Auto-scroll para mensagens novas
  - Contador de mensagens
  - Design moderno com hover effects
  - **Traders simulados** - Apostas de outros usuários aparecem no chat
  
- **Sistema de Dados Mockados**
  - Hook `useMockPrice` para simular preços realistas
  - Geração automática de 40 barras históricas
  - Preços com tendências (alta/baixa) e volatilidade realista
  - Volumes proporcionais ao movimento de preço
  - Atualização suave a cada 2 segundos
  - **Gráfico de Barras OHLC** (ao invés de candlesticks)
  - Tooltips nas barras com OHLCV
  - Indicador de preço atual em tempo real
  - Loading state durante inicialização
  - Verde para alta, vermelho para baixa
  
- **Traders Simulados**
  - 20 nomes de traders fictícios
  - Apostas aleatórias (CALL/PUT) entre $5 e $100
  - Envio aleatório de emojis
  - Eventos a cada 5-20 segundos
  - Dá vida ao protótipo

### 🎯 Em Desenvolvimento
- Sistema de autenticação de usuários
- Backend API com Node.js
- Integração com gateway de pagamento
- Chat com múltiplos usuários (WebSocket)
- Sistema de ranking/leaderboard
- Modo demo com dinheiro virtual

---

## [0.1.0] - 2025-10-12

### 🎉 Versão Inicial

#### ✨ Adicionado
- **Trading Core**
  - Sistema de duels CALL/PUT
  - Integração com Binance WebSocket para preços em tempo real
  - Suporte para BTC/USDT, ETH/USDT, BNB/USDT, SOL/USDT
  - Timeframes de 1, 5, 15 e 30 minutos
  - Cálculo automático de resultados (win/loss)
  - Taxa de 5% por trade
  - Validação de valores mínimo ($1) e máximo ($1000)

- **Interface de Usuário**
  - Header com seleção de asset e timeframe
  - Gráfico de candlesticks em tempo real
  - Painel de duel com botões CALL/PUT
  - Order book simulado com visualização de demanda
  - Histórico de trades com persistência local
  - Sistema de notificações toast
  - Indicador de conexão WebSocket
  - Dark mode por padrão

- **Componentes**
  - `Header.tsx` - Navegação e controles principais
  - `CandlestickChart.tsx` - Gráfico de preços
  - `DuelPanel.tsx` - Interface de trading
  - `OrderBook.tsx` - Livro de ordens
  - `HistoryTabs.tsx` - Histórico de trades
  - `TradeNotifications.tsx` - Sistema de notificações
  - `QuickChat.tsx` - Chat placeholder
  - `ChartSidebar.tsx` - Ferramentas de análise

- **Hooks Customizados**
  - `useBinancePrice.ts` - WebSocket Binance com auto-reconexão
  - `use-toast.ts` - Sistema de notificações

- **Tipos TypeScript**
  - `Trade` - Interface para duels
  - `Asset` - Interface para criptomoedas
  - `PriceData` - Interface para dados de preço
  - `Direction` - Type para CALL/PUT
  - `DuelStatus` - Type para estados do duel

- **Persistência**
  - LocalStorage para histórico de trades
  - Carregamento automático ao iniciar

- **UI Components (shadcn-ui)**
  - Button, Card, Input, Select
  - Dialog, Alert, Badge
  - Tabs, Toast, Tooltip
  - Scroll Area, Separator
  - E muitos outros...

#### 🎨 Design
- Tema dark moderno
- Cores semânticas (verde para CALL/ganhos, vermelho para PUT/perdas)
- Animações suaves
- Layout responsivo (desktop-first)
- Tipografia limpa e legível

#### 📚 Documentação
- README.md completo
- ARCHITECTURE.md detalhando estrutura técnica
- DEVELOPMENT.md com guia para desenvolvedores
- API.md documentando integrações
- CHANGELOG.md (este arquivo)
- ROADMAP.md com planos futuros

#### 🔧 Configuração
- Vite para build e dev server
- TypeScript para type safety
- TailwindCSS para estilização
- ESLint para linting
- React Router para navegação
- React Query para state management

#### 🚀 Deploy
- Integração com Lovable
- Build otimizado para produção
- Suporte para deploy em Vercel/Netlify

---

## Tipos de Mudanças

- `✨ Adicionado` - Novas features
- `🔧 Modificado` - Mudanças em features existentes
- `🗑️ Removido` - Features removidas
- `🐛 Corrigido` - Bug fixes
- `🔒 Segurança` - Correções de segurança
- `📚 Documentação` - Apenas documentação
- `🎨 Estilo` - Mudanças de formatação/estilo
- `♻️ Refatorado` - Refatoração de código
- `⚡ Performance` - Melhorias de performance
- `🧪 Testes` - Adição ou correção de testes

---

## Como Contribuir com o Changelog

Ao adicionar uma nova feature ou fazer uma mudança significativa:

1. Adicione sua entrada na seção `[Unreleased]`
2. Use o formato apropriado
3. Seja claro e descritivo
4. Quando uma versão for lançada, mova itens de `[Unreleased]` para a nova versão

### Exemplo:

```markdown
## [Unreleased]

### ✨ Adicionado
- Sistema de chat em tempo real com WebSocket

### 🐛 Corrigido
- Bug na reconexão do WebSocket após perda de internet
```

---

**Legenda de Versões:**
- **Major (X.0.0)** - Mudanças incompatíveis com versões anteriores
- **Minor (0.X.0)** - Novas features compatíveis
- **Patch (0.0.X)** - Bug fixes e pequenas melhorias

[Unreleased]: https://github.com/yourusername/duel-trader/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/yourusername/duel-trader/releases/tag/v0.1.0

