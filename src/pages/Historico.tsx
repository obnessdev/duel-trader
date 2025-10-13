import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Download, Grid3X3, Columns3, Filter, TrendingUp, Target, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type TabType = 'visao-geral' | 'depositar' | 'sacar' | 'seguranca' | 'historico' | 'suporte';

const mockOperations = [
  {
    id: '6814d6287b6',
    data: '02/05/2025',
    ativo: 'BTC/USDT',
    tempo: 'M1',
    previsao: 'Vender',
    vela: '11:27',
    pAbrt: '$ 97,149.67',
    pFech: '$ 97,176',
    valor: '$ 20',
    estornado: '$ 0',
    executado: '$ 20',
    status: 'Perda',
    resultado: '-$20.00'
  },
  {
    id: '6814d13e7b6',
    data: '02/05/2025',
    ativo: 'BTC/USDT',
    tempo: 'M1',
    previsao: 'Vender',
    vela: '11:06',
    pAbrt: '$ 97,148.8',
    pFech: '$ 97,154',
    valor: '$ 95',
    estornado: '$ 0',
    executado: '$ 95',
    status: 'Perda',
    resultado: '-$95.00'
  },
  {
    id: '6814d1057b6',
    data: '02/05/2025',
    ativo: 'BTC/USDT',
    tempo: 'M1',
    previsao: 'Vender',
    vela: '11:05',
    pAbrt: '$ 96,973.89',
    pFech: '$ 97,148.8',
    valor: '$ 20',
    estornado: '$ 0',
    executado: '$ 20',
    status: 'Perda',
    resultado: '-$20.00'
  },
  {
    id: '6814d0c47b6',
    data: '02/05/2025',
    ativo: 'BTC/USDT',
    tempo: 'M1',
    previsao: 'Vender',
    vela: '11:04',
    pAbrt: '$ 96,972.57',
    pFech: '$ 96,973.89',
    valor: '$ 30',
    estornado: '$ 0',
    executado: '$ 30',
    status: 'Perda',
    resultado: '-$30.00'
  },
  {
    id: '6814d08b7b6',
    data: '02/05/2025',
    ativo: 'BTC/USDT',
    tempo: 'M1',
    previsao: 'Vender',
    vela: '11:03',
    pAbrt: '$ 96,952.38',
    pFech: '$ 96,972.57',
    valor: '$ 15',
    estornado: '$ 0',
    executado: '$ 15',
    status: 'Perda',
    resultado: '-$15.00'
  },
  {
    id: '6814cccb363',
    data: '02/05/2025',
    ativo: 'BTC/USDT',
    tempo: 'M1',
    previsao: 'Vender',
    vela: '10:47',
    pAbrt: '$ 96,690.55',
    pFech: '$ 96,810.6',
    valor: '$ 32',
    estornado: '$ 0',
    executado: '$ 32',
    status: 'Ganho',
    resultado: '+$28.80'
  },
  {
    id: '6814cabf363',
    data: '02/05/2025',
    ativo: 'BTC/USDT',
    tempo: 'M1',
    previsao: 'Comp...',
    vela: '10:38',
    pAbrt: '$ 96,771.49',
    pFech: '$ 96,623.82',
    valor: '$ 5',
    estornado: '$ 0',
    executado: '$ 5',
    status: 'Ganho',
    resultado: '+$4.50'
  },
  {
    id: '6814ca70363',
    data: '02/05/2025',
    ativo: 'BTC/USDT',
    tempo: 'M1',
    previsao: 'Comp...',
    vela: '10:37',
    pAbrt: '$ 96,700.41',
    pFech: '$ 96,771.5',
    valor: '$ 14',
    estornado: '$ 0',
    executado: '$ 14',
    status: 'Ganho',
    resultado: '+$12.60'
  },
];

export default function Historico() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('historico');

  const tabs = [
    { id: 'visao-geral', label: 'Visão geral' },
    { id: 'depositar', label: 'Depositar' },
    { id: 'sacar', label: 'Sacar' },
    { id: 'seguranca', label: 'Segurança' },
    { id: 'historico', label: 'Histórico' },
    { id: 'suporte', label: 'Suporte' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border/50 px-6 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <div className="w-2 h-2 bg-destructive rounded-full"></div>
            <h1 className="text-2xl font-bold tracking-tight">
              <span className="text-foreground">OB</span>
              <span className="text-destructive">NESS</span>
            </h1>
          </div>
        </div>
      </header>

      {/* User Section with Avatar */}
      <div className="px-6 py-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center">
            <span className="text-white text-sm font-bold">👤</span>
          </div>
          <h2 className="text-xl font-semibold">Minha conta</h2>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-8 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-foreground text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
              {tab.id === 'historico' && (
                <span className="ml-1 text-xs">▼</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-8">
        <h3 className="text-2xl font-semibold mb-8">Histórico de operações</h3>

        {/* Filters Row */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Select defaultValue="real">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="real">REAL</SelectItem>
                <SelectItem value="demo">DEMO</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="todos-tipos">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos-tipos">Todos os tipos</SelectItem>
                <SelectItem value="compra">Compra</SelectItem>
                <SelectItem value="venda">Venda</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="todas-previsoes">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas-previsoes">Todas as previsões</SelectItem>
                <SelectItem value="call">CALL</SelectItem>
                <SelectItem value="put">PUT</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="todos-ativos">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos-ativos">Todos os ativos</SelectItem>
                <SelectItem value="btc">BTC/USDT</SelectItem>
                <SelectItem value="eth">ETH/USDT</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="todos-status">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos-status">Todos os status</SelectItem>
                <SelectItem value="ganho">Ganho</SelectItem>
                <SelectItem value="perda">Perda</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">De</span>
            <Input type="date" className="w-36" defaultValue="2023-10-10" />
            <span className="text-sm text-muted-foreground">Até</span>
            <Input type="date" className="w-36" defaultValue="2025-10-12" />
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <Card className="bg-green-500/10 border-green-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                    <span className="text-white text-lg">$</span>
                  </div>
                  <span className="text-sm font-medium">Receita</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-green-500 mb-2">+$98.82</div>
              <div className="h-16 w-full bg-gradient-to-r from-green-500/20 to-green-500/40 rounded relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-green-500/30 to-transparent"></div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-500/10 border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium">Assertividade</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-purple-500 mb-2">53.1%</div>
              <div className="h-16 w-full bg-gradient-to-r from-purple-500/20 to-purple-500/40 rounded relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-purple-500/30 to-transparent"></div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-orange-500/10 border-orange-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium">Total de operações</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-orange-500 mb-2">3787</div>
              <div className="h-16 w-full bg-gradient-to-r from-orange-500/20 to-orange-500/40 rounded relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-orange-500/30 to-transparent"></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table Controls */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Exportar
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Grid3X3 className="w-4 h-4" />
            Densidade
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Columns3 className="w-4 h-4" />
            Colunas
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="w-4 h-4" />
            Filtros
          </Button>
        </div>

        {/* Operations Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Ativo</TableHead>
                  <TableHead>Tempo</TableHead>
                  <TableHead>Previsão</TableHead>
                  <TableHead>Vela</TableHead>
                  <TableHead>P. ABRT</TableHead>
                  <TableHead>P. FECH</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Estornado</TableHead>
                  <TableHead>Executado</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Resultado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockOperations.map((operation) => (
                  <TableRow key={operation.id}>
                    <TableCell className="font-mono text-xs">{operation.id}</TableCell>
                    <TableCell>{operation.data}</TableCell>
                    <TableCell>{operation.ativo}</TableCell>
                    <TableCell>{operation.tempo}</TableCell>
                    <TableCell>
                      <span className={operation.previsao === 'Vender' ? 'text-red-500' : 'text-green-500'}>
                        {operation.previsao}
                      </span>
                    </TableCell>
                    <TableCell>{operation.vela}</TableCell>
                    <TableCell>{operation.pAbrt}</TableCell>
                    <TableCell>{operation.pFech}</TableCell>
                    <TableCell>{operation.valor}</TableCell>
                    <TableCell>{operation.estornado}</TableCell>
                    <TableCell>{operation.executado}</TableCell>
                    <TableCell>
                      <span className={operation.status === 'Ganho' ? 'text-green-500' : 'text-red-500'}>
                        {operation.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={operation.resultado.startsWith('+') ? 'text-green-500' : 'text-red-500'}>
                        {operation.resultado}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}