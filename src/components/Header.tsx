import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ThemeOption } from '@/components/ThemeSelector';
import { Palette, User, History, Wallet, LogOut, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { useRealPrice } from '@/hooks/useRealPrice';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  currentTheme: ThemeOption;
  onThemeChange: (theme: ThemeOption) => void;
}

export const Header = ({
  currentTheme,
  onThemeChange
}: HeaderProps) => {
  const navigate = useNavigate();
  const { price: realBtcPrice, isLoading } = useRealPrice('BTCUSDT');

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
          <img
            src="https://flyughatwfagmonhnmby.supabase.co/storage/v1/object/sign/Arquivos/Logo%20.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDBiZWRmZi02N2IwLTRjMjEtYjQ4Ny00ZTc1YzhhZWEwYTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBcnF1aXZvcy9Mb2dvIC5wbmciLCJpYXQiOjE3NjA1MDIzMzUsImV4cCI6MjA3NTg2MjMzNX0.8YZ5W0Y-mit3FneDxYSh03YiZ0Ulz0VsDi4NKqN9Cvs"
            alt="OBNESS Logo"
            className="h-12 w-auto"
          />

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
            <div className="text-xs text-muted-foreground">BTC/USDT</div>
            <div className="text-xl font-bold text-[#26a69a]">
              {isLoading ? (
                <span className="animate-pulse">Loading...</span>
              ) : (
                `$${realBtcPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              )}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="focus:outline-none">
                <Avatar className="w-12 h-12 cursor-pointer hover:opacity-80 transition-opacity">
                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" alt="User" />
                  <AvatarFallback className="bg-success text-background">
                    <User className="w-6 h-6" />
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/minha-conta')}>
                <User className="mr-2 h-4 w-4" />
                <span>MINHA CONTA</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/historico')}>
                <History className="mr-2 h-4 w-4" />
                <span>HISTÓRICO</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/deposito')}>
                <ArrowDownToLine className="mr-2 h-4 w-4" />
                <span>DEPOSITAR</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/saque')}>
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