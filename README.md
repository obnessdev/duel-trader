# 🎯 Duel Trader - OBNESS

**Trading Duel Platform** - Uma plataforma P2P de opções binárias gamificada para trading de criptomoedas em tempo real.

![Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 📋 Sobre o Projeto

Duel Trader é uma aplicação web moderna que transforma trading de criptomoedas em uma experiência gamificada. Os usuários podem criar "duelos" apostando se o preço de uma criptomoeda vai subir (**CALL**) ou cair (**PUT**) dentro de um período específico de tempo.

### 🎮 Como Funciona

1. **Selecione um Ativo** - Escolha entre BTC, ETH, BNB ou SOL
2. **Defina o Timeframe** - 1, 5, 15 ou 30 minutos
3. **Aposte um Valor** - Mínimo $1, máximo $1000
4. **Escolha a Direção** - CALL (subir) ou PUT (cair)
5. **Aguarde o Resultado** - Sistema verifica automaticamente se você ganhou ou perdeu

## ✨ Features Principais

- 📊 **Gráficos em Tempo Real** - Candlesticks atualizados via WebSocket
- 💱 **Múltiplos Ativos** - BTC/USDT, ETH/USDT, BNB/USDT, SOL/USDT
- ⏱️ **Timeframes Flexíveis** - 1m, 5m, 15m, 30m
- 📈 **Order Book Simulado** - Visualize a demanda por CALL e PUT
- 📜 **Histórico de Trades** - Acompanhe seus duelos passados
- 🔔 **Notificações** - Feedback em tempo real
- 💬 **Chat ao Vivo** - Estilo YouTube Live com apostas e emojis
- 🎨 **UI Moderna** - Interface dark mode com shadcn-ui

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** - Biblioteca UI
- **TypeScript** - Type safety
- **Vite** - Build tool e dev server
- **TailwindCSS** - Estilização
- **shadcn-ui** - Componentes UI modernos
- **Recharts** - Visualização de dados

### Integrações
- **Binance WebSocket API** - Preços em tempo real
- **React Query** - State management e cache
- **LocalStorage** - Persistência de dados

### Ferramentas
- **ESLint** - Linting
- **React Router** - Roteamento
- **Lucide React** - Ícones

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+ (recomendado usar [nvm](https://github.com/nvm-sh/nvm))
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone <your-git-url>

# Entre no diretório
cd duel-trader

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O projeto estará disponível em `http://localhost:5173`

### Scripts Disponíveis

```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build de produção
npm run build:dev    # Build em modo desenvolvimento
npm run lint         # Executa linter
npm run preview      # Preview do build de produção
```

## 📁 Estrutura do Projeto

```
duel-trader/
├── public/              # Arquivos estáticos
├── src/
│   ├── components/      # Componentes React
│   │   ├── ui/         # Componentes shadcn-ui
│   │   ├── CandlestickChart.tsx
│   │   ├── DuelPanel.tsx
│   │   ├── Header.tsx
│   │   ├── OrderBook.tsx
│   │   └── ...
│   ├── hooks/          # React hooks customizados
│   │   └── useBinancePrice.ts
│   ├── pages/          # Páginas da aplicação
│   │   ├── Index.tsx
│   │   └── NotFound.tsx
│   ├── types/          # Definições TypeScript
│   │   └── trading.ts
│   ├── lib/            # Utilitários
│   │   └── utils.ts
│   ├── App.tsx         # Componente raiz
│   └── main.tsx        # Entry point
├── ARCHITECTURE.md     # Documentação da arquitetura
├── DEVELOPMENT.md      # Guia para desenvolvedores
├── API.md             # Documentação das APIs
└── CHANGELOG.md       # Histórico de mudanças
```

## 🎨 Design System

- **Cores Principais:**
  - Success (Verde): Operações CALL / Ganhos
  - Destructive (Vermelho): Operações PUT / Perdas
  - Muted: Informações secundárias
  
- **Tipografia:** System fonts com fallbacks
- **Espaçamento:** Sistema de grid do TailwindCSS
- **Animações:** Transições suaves via CSS

## 📊 Modelo de Negócio

- **Taxa por Trade:** 5% sobre o valor apostado
- **Payout:** 1:1 (100% de lucro em caso de vitória)
- **Limites:** $1 mínimo, $1000 máximo por duel

## 🔐 Segurança

⚠️ **IMPORTANTE:** Este é um projeto de demonstração. Para produção:
- Implementar autenticação de usuários
- Adicionar backend seguro
- Integrar gateway de pagamento
- Implementar KYC/AML
- Adicionar rate limiting
- Validação de servidor

## 🤝 Contribuindo

Este projeto está em desenvolvimento ativo. Contribuições são bem-vindas!

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Documentação Adicional

- [Arquitetura](./ARCHITECTURE.md) - Estrutura técnica e decisões de design
- [Desenvolvimento](./DEVELOPMENT.md) - Guia para contribuidores
- [API](./API.md) - Documentação das integrações
- [Changelog](./CHANGELOG.md) - Histórico de versões

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🔗 Links

- **Projeto Lovable:** https://lovable.dev/projects/cf22767c-82ed-4906-a08f-ead6dc337f42
- **Binance API:** https://binance-docs.github.io/apidocs/

---

Desenvolvido com ❤️ para a comunidade de traders
