import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trade } from '@/types/trading';

interface HistoryTabsProps {
  trades: Trade[];
}

export const HistoryTabs = ({ trades }: HistoryTabsProps) => {
  const completedTrades = trades.filter(t => t.status === 'completed');

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('pt-BR');
  };

  return (
    <Tabs defaultValue="history" className="w-full h-80 flex flex-col">
      <TabsList className="bg-background border-b border-border/50 rounded-none w-full justify-start h-12">
        <TabsTrigger value="history" className="text-sm">Histórico</TabsTrigger>
        <TabsTrigger value="orders" className="text-sm">Ordens</TabsTrigger>
        <TabsTrigger value="operations" className="text-sm">Operações</TabsTrigger>
      </TabsList>

      <TabsContent value="history" className="mt-0 bg-background border border-t-0 border-border/50 flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent bg-muted/50">
              <TableHead className="text-xs font-semibold text-muted-foreground">ID</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground">Data</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground">Ativo</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground">Tempo</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground">Previsão</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground">Vela</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground">P. ABRT</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground">P. FECH</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground">Valor</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground">Estornado</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground">Executado</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground">Status</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground text-right">Resultado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {completedTrades.length === 0 ? (
              <TableRow>
                <TableCell colSpan={13} className="text-center text-muted-foreground text-sm py-8">
                  Nenhuma operação ainda
                </TableCell>
              </TableRow>
            ) : (
              completedTrades.slice().reverse().map((trade) => (
                <TableRow key={trade.id} className="border-border/50 hover:bg-muted/30">
                  <TableCell className="text-xs font-mono text-muted-foreground">{trade.id.slice(-10)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDate(trade.startTime)}
                  </TableCell>
                  <TableCell className="text-xs font-semibold">{trade.asset}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">M{trade.timeframe}</TableCell>
                  <TableCell>
                    <span className={`text-xs font-semibold ${
                      trade.direction === 'CALL' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {trade.direction === 'CALL' ? 'Comp...' : 'Vender'}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatTime(trade.startTime)}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">$ {trade.entryPrice.toFixed(2)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">$ {trade.exitPrice?.toFixed(2)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">$ {trade.amount}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">$ 0</TableCell>
                  <TableCell className="text-xs text-muted-foreground">$ {trade.amount}</TableCell>
                  <TableCell>
                    <span className={`text-xs font-semibold ${
                      trade.result === 'win' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {trade.result === 'win' ? 'Ganho' : 'Perda'}
                    </span>
                  </TableCell>
                  <TableCell className={`text-xs font-bold text-right ${
                    trade.result === 'win' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {trade.result === 'win' ? '+$' : '-$'}{Math.abs(trade.profit || 0).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination Footer */}
        {completedTrades.length > 0 && (
          <div className="flex items-center justify-between px-4 py-2 border-t border-border/50 bg-muted/20">
            <div className="text-xs text-muted-foreground">
              Linhas por página: 10 ▼
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>1–{Math.min(10, completedTrades.length)} de {completedTrades.length}</span>
              <button className="px-2 py-1 hover:bg-muted/50 rounded">‹</button>
              <button className="px-2 py-1 hover:bg-muted/50 rounded">›</button>
            </div>
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="orders" className="mt-0 bg-background border border-t-0 border-border/50 flex-1 overflow-auto p-8 text-center text-muted-foreground text-sm">
        No active orders
      </TabsContent>

      <TabsContent value="operations" className="mt-0 bg-background border border-t-0 border-border/50 flex-1 overflow-auto p-8 text-center text-muted-foreground text-sm">
        No operations
      </TabsContent>
    </Tabs>
  );
};
