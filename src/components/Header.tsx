import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Asset } from '@/types/trading';

interface HeaderProps {
  assets: Asset[];
  selectedAsset: string;
  onAssetChange: (asset: string) => void;
  selectedTimeframe: number;
  onTimeframeChange: (timeframe: number) => void;
  currentPrice: number;
  balance: number;
  disabled?: boolean;
}

export const Header = ({
  assets,
  selectedAsset,
  onAssetChange,
  selectedTimeframe,
  onTimeframeChange,
  currentPrice,
  balance,
  disabled
}: HeaderProps) => {
  const timeframes = [
    { value: 1, label: '1 minute' },
    { value: 5, label: '5 minutes' },
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' }
  ];

  return (
    <header className="bg-background border-b border-border/50 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <div className="w-2 h-2 bg-destructive rounded-full"></div>
            <h1 className="text-2xl font-bold tracking-tight">
              <span className="text-foreground">OB</span>
              <span className="text-destructive">NESS</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">Asset</div>
            <Select value={selectedAsset} onValueChange={onAssetChange} disabled={disabled}>
              <SelectTrigger className="w-[140px] bg-muted/50 border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {assets.map((asset) => (
                  <SelectItem key={asset.symbol} value={asset.symbol}>
                    {asset.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">Timeframe</div>
            <Select 
              value={selectedTimeframe.toString()} 
              onValueChange={(v) => onTimeframeChange(parseInt(v))}
              disabled={disabled}
            >
              <SelectTrigger className="w-[140px] bg-muted/50 border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeframes.map((tf) => (
                  <SelectItem key={tf.value} value={tf.value.toString()}>
                    {tf.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-success rounded-lg flex items-center justify-center">
            <span className="text-xs font-bold">⚔️</span>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Trading Duel</div>
            <div className="text-[10px] text-muted-foreground">P2P Binary Options Trading Platform</div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-xs text-muted-foreground">{selectedAsset.toUpperCase()}</div>
            <div className="text-xl font-bold">${currentPrice.toFixed(2)}</div>
          </div>

          <div className="text-right">
            <div className="text-xs text-muted-foreground">REAL BALANCE</div>
            <div className="text-2xl font-bold text-success">${balance.toFixed(2)}</div>
          </div>

          <div className="w-12 h-12 rounded-full bg-success flex items-center justify-center overflow-hidden">
            <div className="text-xs font-bold">👤</div>
          </div>
        </div>
      </div>
    </header>
  );
};
