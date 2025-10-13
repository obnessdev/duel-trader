# 👨‍💻 Guia de Desenvolvimento - Duel Trader

Este guia ajudará você a contribuir com o projeto Duel Trader.

## 🚀 Setup Inicial

### 1. Pré-requisitos

```bash
# Verifique sua versão do Node
node --version  # Requer 18+

# Se não tiver Node.js, instale via nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

### 2. Clone e Instalação

```bash
# Clone o repositório
git clone <repository-url>
cd duel-trader

# Instale dependências
npm install

# Inicie o dev server
npm run dev
```

### 3. Abra no Browser

Acesse: `http://localhost:5173`

## 📂 Estrutura de Arquivos

```
duel-trader/
├── src/
│   ├── components/          # Componentes React
│   │   ├── ui/             # Componentes base shadcn-ui
│   │   ├── AssetSelector.tsx
│   │   ├── CandlestickChart.tsx
│   │   ├── DuelPanel.tsx
│   │   ├── Header.tsx
│   │   ├── OrderBook.tsx
│   │   └── ...
│   ├── hooks/              # Custom React hooks
│   │   ├── useBinancePrice.ts
│   │   └── use-toast.ts
│   ├── pages/              # Páginas da aplicação
│   │   ├── Index.tsx
│   │   └── NotFound.tsx
│   ├── types/              # TypeScript types
│   │   └── trading.ts
│   ├── lib/                # Utilitários
│   │   └── utils.ts
│   ├── App.tsx             # App root
│   ├── main.tsx            # Entry point
│   └── index.css           # Estilos globais
├── public/                 # Assets estáticos
├── docs/                   # Documentação
└── tests/                  # Testes (futuro)
```

## 🎨 Convenções de Código

### TypeScript

```typescript
// ✅ BOM - Tipos explícitos
interface UserProps {
  name: string;
  balance: number;
}

function User({ name, balance }: UserProps) {
  return <div>{name}: ${balance}</div>
}

// ❌ RUIM - Sem tipos
function User(props) {
  return <div>{props.name}</div>
}
```

### Componentes React

```typescript
// ✅ BOM - Functional component com tipos
export const MyComponent = ({ prop1, prop2 }: MyComponentProps) => {
  // lógica
  return <div>...</div>
}

// ❌ RUIM - Class component
export class MyComponent extends React.Component {
  render() {
    return <div>...</div>
  }
}
```

### Nomenclatura

- **Componentes:** PascalCase (`DuelPanel.tsx`)
- **Hooks:** camelCase com prefixo `use` (`useBinancePrice.ts`)
- **Utils:** camelCase (`formatPrice.ts`)
- **Types:** PascalCase para interfaces/types
- **Constantes:** UPPER_SNAKE_CASE

```typescript
// Exemplos
const API_URL = 'https://api.example.com'  // constante
const userId = '123'                        // variável
const handleClick = () => {}                // função
type UserRole = 'admin' | 'user'           // type
interface UserData { }                      // interface
```

### Imports

```typescript
// Ordem de imports
import { useState, useEffect } from 'react'              // 1. React
import { useNavigate } from 'react-router-dom'           // 2. Libraries
import { Button } from '@/components/ui/button'          // 3. UI components
import { useBinancePrice } from '@/hooks/useBinancePrice' // 4. Custom hooks
import { Trade } from '@/types/trading'                   // 5. Types
import './styles.css'                                     // 6. Styles
```

## 🧩 Adicionando Novos Componentes

### 1. Componente UI (shadcn-ui)

```bash
# Adicionar novo componente shadcn
npx shadcn-ui@latest add <component-name>

# Exemplos:
npx shadcn-ui@latest add button
npx shadcn-ui@latest add dialog
```

### 2. Componente Customizado

```typescript
// src/components/MyNewComponent.tsx
import { Card } from '@/components/ui/card'

interface MyNewComponentProps {
  title: string
  onAction: () => void
}

export const MyNewComponent = ({ title, onAction }: MyNewComponentProps) => {
  return (
    <Card className="p-4">
      <h2>{title}</h2>
      <button onClick={onAction}>Click me</button>
    </Card>
  )
}
```

### 3. Adicionar ao Index.tsx

```typescript
import { MyNewComponent } from '@/components/MyNewComponent'

// Usar no JSX
<MyNewComponent title="Test" onAction={() => console.log('clicked')} />
```

## 🎣 Criando Custom Hooks

```typescript
// src/hooks/useMyHook.ts
import { useState, useEffect } from 'react'

export const useMyHook = (param: string) => {
  const [data, setData] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // lógica
    setData(param)
    setLoading(false)
  }, [param])

  return { data, loading }
}
```

## 🎨 Estilização com Tailwind

### Classes Utilitárias

```tsx
// Layout
<div className="flex items-center justify-between gap-4">

// Responsividade
<div className="w-full md:w-1/2 lg:w-1/3">

// Estados
<button className="bg-primary hover:bg-primary/90 disabled:opacity-50">

// Cores do tema
<div className="bg-background text-foreground border-border">
<span className="text-success">Win</span>
<span className="text-destructive">Loss</span>
```

### Componentes shadcn-ui

```tsx
// Sempre use as variantes do tema
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="ghost">Ghost</Button>
```

## 🔌 Integrações de API

### WebSocket da Binance

```typescript
// Já implementado em useBinancePrice.ts
// Endpoint: wss://stream.binance.com:9443/ws/{symbol}@ticker

// Para adicionar novos símbolos, edite:
// src/pages/Index.tsx - array ASSETS
const ASSETS: Asset[] = [
  { symbol: 'btcusdt', name: 'BTC/USDT', icon: '₿' },
  // adicione aqui
]
```

### Adicionando Nova API

```typescript
// src/hooks/useNewApi.ts
import { useState, useEffect } from 'react'

export const useNewApi = () => {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch('https://api.example.com/data')
      .then(res => res.json())
      .then(setData)
  }, [])

  return { data }
}
```

## 🐛 Debugging

### Console Logs

```typescript
// Durante desenvolvimento, use console.log
console.log('Current price:', priceData.price)

// Em produção, remova ou use biblioteca de logging
```

### React DevTools

```bash
# Instale a extensão do navegador
# Chrome: https://chrome.google.com/webstore
# Firefox: https://addons.mozilla.org
```

### Vite DevTools

```bash
# HMR (Hot Module Replacement) automático
# Erros aparecem no browser e no terminal
```

## 🧪 Testing (Em Desenvolvimento)

### Setup Jest (Futuro)

```bash
npm install -D jest @testing-library/react @testing-library/jest-dom
```

### Exemplo de Test

```typescript
// src/components/__tests__/DuelPanel.test.tsx
import { render, screen } from '@testing-library/react'
import { DuelPanel } from '../DuelPanel'

test('renders duel panel', () => {
  render(<DuelPanel asset="BTC" currentPrice={50000} />)
  expect(screen.getByText('CALL')).toBeInTheDocument()
})
```

## 📦 Build e Deploy

### Build Local

```bash
# Build de produção
npm run build

# Preview do build
npm run preview
```

### Deploy via Lovable

```bash
# 1. Commit suas mudanças
git add .
git commit -m "feat: add new feature"
git push origin main

# 2. Lovable detecta automaticamente e faz deploy
# 3. Acesse: Lovable > Share > Publish
```

### Deploy Manual (Vercel/Netlify)

```bash
# Vercel
npm install -g vercel
vercel

# Netlify
npm install -g netlify-cli
netlify deploy --prod
```

## 🔧 Troubleshooting

### Problema: Módulo não encontrado

```bash
# Limpe cache e reinstale
rm -rf node_modules package-lock.json
npm install
```

### Problema: TypeScript errors

```bash
# Verifique tipos
npm run type-check

# Se não existir, adicione ao package.json:
"scripts": {
  "type-check": "tsc --noEmit"
}
```

### Problema: WebSocket não conecta

```bash
# Verifique console do browser
# Certifique-se que a URL da Binance está correta
# wss://stream.binance.com:9443/ws/{symbol}@ticker
```

### Problema: Styles não aplicam

```bash
# Rebuild Tailwind
npm run dev -- --force
```

## 📋 Checklist para Pull Request

- [ ] Código segue convenções do projeto
- [ ] TypeScript sem erros (`npm run lint`)
- [ ] Componentes têm tipos definidos
- [ ] Funcionalidade testada manualmente
- [ ] Sem console.logs desnecessários
- [ ] Imports organizados
- [ ] Documentação atualizada (se necessário)

## 🎯 Boas Práticas

### Performance

```typescript
// ✅ Memoize cálculos pesados
const expensiveValue = useMemo(() => {
  return heavyCalculation(data)
}, [data])

// ✅ Use useCallback para funções passadas como props
const handleClick = useCallback(() => {
  doSomething()
}, [dependency])
```

### State Management

```typescript
// ✅ Use estado local quando possível
const [count, setCount] = useState(0)

// ✅ Eleve estado apenas quando necessário
// Evite passar props por muitos níveis (prop drilling)
```

### Acessibilidade

```tsx
// ✅ Use labels semânticos
<button aria-label="Start duel">Start</button>

// ✅ Use alt em imagens
<img src="..." alt="Chart candlestick" />
```

## 🚦 Git Workflow

```bash
# 1. Crie uma branch
git checkout -b feature/my-new-feature

# 2. Faça commits descritivos
git commit -m "feat: add order book animation"
git commit -m "fix: websocket reconnection issue"

# 3. Push para remote
git push origin feature/my-new-feature

# 4. Abra Pull Request no GitHub
```

### Convenção de Commits

```
feat: nova feature
fix: correção de bug
docs: atualização de documentação
style: mudanças de formatação
refactor: refatoração de código
test: adição de testes
chore: tarefas de manutenção
```

## 🆘 Precisa de Ajuda?

- Leia [ARCHITECTURE.md](./ARCHITECTURE.md) para entender a estrutura
- Leia [API.md](./API.md) para documentação de APIs
- Abra uma issue no GitHub
- Pergunte no chat do projeto

---

**Happy Coding! 🚀**

