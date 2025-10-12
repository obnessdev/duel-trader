import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trade } from '@/types/trading';

interface HistoryTabsProps {
  trades: Trade[];
}

export const HistoryTabs = ({ trades }: HistoryTabsProps) => {
  const completedTrades = trades.filter(t => t.status === 'completed');

  return (
    <Tabs defaultValue="history" className="w-full">
      <TabsList className="bg-background border-b border-border/50 rounded-none w-full justify-start h-12">
        <TabsTrigger value="history" className="text-sm">History</TabsTrigger>
        <TabsTrigger value="orders" className="text-sm">Orders</TabsTrigger>
        <TabsTrigger value="operations" className="text-sm">Operations</TabsTrigger>
      </TabsList>
      
      <TabsContent value="history" className="mt-0 bg-background border border-t-0 border-border/50">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-xs">ID</TableHead>
              <TableHead className="text-xs">Date</TableHead>
              <TableHead className="text-xs">Asset</TableHead>
              <TableHead className="text-xs">Time</TableHead>
              <TableHead className="text-xs">Direction</TableHead>
              <TableHead className="text-xs">Win</TableHead>
              <TableHead className="text-xs">P. Start</TableHead>
              <TableHead className="text-xs">P. End</TableHead>
              <TableHead className="text-xs">Value</TableHead>
              <TableHead className="text-xs">Estimated</TableHead>
              <TableHead className="text-xs">Executed</TableHead>
              <TableHead className="text-xs">Status</TableHead>
              <TableHead className="text-xs text-right">Result</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {completedTrades.length === 0 ? (
              <TableRow>
                <TableCell colSpan={13} className="text-center text-muted-foreground text-sm py-8">
                  No trades yet
                </TableCell>
              </TableRow>
            ) : (
              completedTrades.slice().reverse().map((trade) => (
                <TableRow key={trade.id} className="border-border/50 hover:bg-muted/30">
                  <TableCell className="text-xs font-mono">{trade.id.slice(0, 8)}</TableCell>
                  <TableCell className="text-xs">
                    {new Date(trade.startTime).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-xs font-semibold">{trade.asset}</TableCell>
                  <TableCell className="text-xs">{trade.timeframe}m</TableCell>
                  <TableCell>
                    <span className={`text-xs font-semibold ${
                      trade.direction === 'CALL' ? 'text-success' : 'text-destructive'
                    }`}>
                      {trade.direction}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs">
                    {trade.result === 'win' ? 'Yes' : 'No'}
                  </TableCell>
                  <TableCell className="text-xs">${trade.entryPrice.toFixed(2)}</TableCell>
                  <TableCell className="text-xs">${trade.exitPrice?.toFixed(2)}</TableCell>
                  <TableCell className="text-xs">${trade.amount.toFixed(2)}</TableCell>
                  <TableCell className="text-xs">$0</TableCell>
                  <TableCell className="text-xs">$0</TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      trade.result === 'win' 
                        ? 'bg-success/20 text-success' 
                        : 'bg-destructive/20 text-destructive'
                    }`}>
                      {trade.result === 'win' ? 'Won' : 'Lost'}
                    </span>
                  </TableCell>
                  <TableCell className={`text-xs font-bold text-right ${
                    trade.result === 'win' ? 'text-success' : 'text-destructive'
                  }`}>
                    {trade.result === 'win' ? '+' : '-'}${Math.abs(trade.profit || 0).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TabsContent>
      
      <TabsContent value="orders" className="mt-0 bg-background border border-t-0 border-border/50 p-8 text-center text-muted-foreground text-sm">
        No active orders
      </TabsContent>
      
      <TabsContent value="operations" className="mt-0 bg-background border border-t-0 border-border/50 p-8 text-center text-muted-foreground text-sm">
        No operations
      </TabsContent>
    </Tabs>
  );
};
