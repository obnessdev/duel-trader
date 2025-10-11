import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Asset } from '@/types/trading';

interface AssetSelectorProps {
  assets: Asset[];
  selectedAsset: string;
  onAssetChange: (asset: string) => void;
  selectedTimeframe: number;
  onTimeframeChange: (timeframe: number) => void;
  disabled?: boolean;
}

export const AssetSelector = ({
  assets,
  selectedAsset,
  onAssetChange,
  selectedTimeframe,
  onTimeframeChange,
  disabled
}: AssetSelectorProps) => {
  const timeframes = [1, 5, 15, 30, 60];

  return (
    <Card className="glass-card p-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Asset</label>
          <Select value={selectedAsset} onValueChange={onAssetChange} disabled={disabled}>
            <SelectTrigger>
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

        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Timeframe</label>
          <Select 
            value={selectedTimeframe.toString()} 
            onValueChange={(v) => onTimeframeChange(parseInt(v))}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeframes.map((tf) => (
                <SelectItem key={tf} value={tf.toString()}>
                  {tf} minute{tf > 1 ? 's' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
};
