import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Asset } from '@/types/trading';
import { ThemeOption } from '@/components/ThemeSelector';
import { Palette, User, History, Wallet, LogOut, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { DepositDialog } from './DepositDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState } from 'react';

interface HeaderProps {
  assets: Asset[];
  selectedAsset: string;
  onAssetChange: (asset: string) => void;
  selectedTimeframe: number;
  onTimeframeChange: (timeframe: number) => void;
  currentPrice: number;
  balance: number;
  disabled?: boolean;
  currentTheme: ThemeOption;
  onThemeChange: (theme: ThemeOption) => void;
}

export const Header = ({
  assets,
  selectedAsset,
  onAssetChange,
  selectedTimeframe,
  onTimeframeChange,
  currentPrice,
  balance,
  disabled,
  currentTheme,
  onThemeChange
}: HeaderProps) => {
  const [depositOpen, setDepositOpen] = useState(false);
  const timeframes = [
    { value: 1, label: '1 minute' },
    { value: 5, label: '5 minutes' },
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' }
  ];

  const themes = [
    { value: 'default', label: 'Padrão' },
    { value: 'dark', label: 'Escuro' },
    { value: 'neon-green', label: 'Neon Verde' },
    { value: 'neon-blue', label: 'Neon Azul' },
    { value: 'neon-purple', label: 'Neon Roxo' },
    { value: 'neon-pink', label: 'Neon Rosa' },
    { value: 'neon-orange', label: 'Neon Laranja' },
    { value: 'cyberpunk', label: 'Cyberpunk' }
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
            <div className="px-3 py-2 bg-muted/50 border border-border/50 rounded text-sm font-medium">
              BTC/USDT
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">Timeframe</div>
            <div className="px-3 py-2 bg-muted/50 border border-border/50 rounded text-sm font-medium">
              1 minute
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">Tema</div>
            <Select value={currentTheme} onValueChange={onThemeChange}>
              <SelectTrigger className="w-[140px] bg-muted/50 border-border/50">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                {themes.map((theme) => (
                  <SelectItem key={theme.value} value={theme.value}>
                    {theme.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

          <DepositDialog open={depositOpen} onOpenChange={setDepositOpen} />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="focus:outline-none">
                <Avatar className="w-12 h-12 cursor-pointer hover:opacity-80 transition-opacity">
                  <AvatarImage src="" alt="User" />
                  <AvatarFallback className="bg-success text-background">
                    <User className="w-6 h-6" />
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>MINHA CONTA</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <History className="mr-2 h-4 w-4" />
                <span>HISTÓRICO</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={() => setDepositOpen(true)}>
                <ArrowDownToLine className="mr-2 h-4 w-4" />
                <span>DEPOSITAR</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <ArrowUpFromLine className="mr-2 h-4 w-4" />
                <span>SACAR</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>DESLOGAR</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
