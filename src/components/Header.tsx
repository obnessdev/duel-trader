import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ThemeOption } from '@/components/ThemeSelector';
import { Palette, User, History, Wallet, LogOut, ArrowDownToLine, ArrowUpFromLine, Globe } from 'lucide-react';
import { useRealPrice } from '@/hooks/useRealPrice';
import { useLanguage, Language } from '@/hooks/useLanguage';
import { useTranslation } from '@/translations';
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
  const { language, setLanguage } = useLanguage();
  const t = useTranslation(language);

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
    <header className="bg-background border-b border-border/50 px-3 sm:px-6 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4">
          <img
            src="https://flyughatwfagmonhnmby.supabase.co/storage/v1/object/sign/Arquivos/Logo%20.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDBiZWRmZi02N2IwLTRjMjEtYjQ4Ny00ZTc1YzhhZWEwYTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBcnF1aXZvcy9Mb2dvIC5wbmciLCJpYXQiOjE3NjA1MDIzMzUsImV4cCI6MjA3NTg2MjMzNX0.8YZ5W0Y-mit3FneDxYSh03YiZ0Ulz0VsDi4NKqN9Cvs"
            alt="OBNESS Logo"
            className="h-6 sm:h-8 md:h-10 w-auto cursor-pointer hover:opacity-80 transition-opacity drop-shadow-sm"
            onClick={() => window.location.reload()}
          />

          <div className="hidden lg:flex items-center gap-3">
            <div className="text-xs text-primary">{t('asset')}</div>
            <div className="text-sm font-semibold border border-border/50 rounded px-2 py-1">BTC/USDT</div>
          </div>

          <div className="hidden xl:flex items-center gap-3">
            <div className="text-xs text-primary">{t('timeframe')}</div>
            <div className="text-sm font-semibold border border-border/50 rounded px-2 py-1">1M</div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <div className="hidden md:block text-xs text-primary">{t('btcPrice')}</div>
            <div className="text-xs sm:text-sm font-semibold text-green-500">
              {isLoading ? (
                <span className="animate-pulse">...</span>
              ) : (
                `$${realBtcPrice.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <div className="hidden lg:block text-xs text-primary">{t('theme')}</div>
            <Select value={currentTheme} onValueChange={onThemeChange}>
              <SelectTrigger className="w-[80px] sm:w-[100px] bg-muted/50 border-border/50 h-7 sm:h-8 text-xs">
                <SelectValue />
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

          <div className="hidden md:flex items-center gap-2">
            <div className="hidden lg:block text-xs text-primary">{t('realBalance')}</div>
            <div className="text-sm font-bold text-foreground">$100.50</div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-7 h-7 sm:w-8 sm:h-8 p-0" variant="outline">
                <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setLanguage('pt')}
              >
                <span className={language === 'pt' ? 'font-bold' : ''}>
                  🇧🇷 {t('languages').pt}
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setLanguage('en')}
              >
                <span className={language === 'en' ? 'font-bold' : ''}>
                  🇺🇸 {t('languages').en}
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setLanguage('es')}
              >
                <span className={language === 'es' ? 'font-bold' : ''}>
                  🇪🇸 {t('languages').es}
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button className="btn-primary-theme px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm">
            {t('deposit')}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="focus:outline-none">
                <Avatar className="w-7 h-7 sm:w-8 sm:h-8 cursor-pointer hover:opacity-80 transition-opacity">
                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" alt="User" />
                  <AvatarFallback className="bg-success text-background">
                    <User className="w-3 h-3 sm:w-4 sm:h-4" />
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/minha-conta')}>
                <User className="mr-2 h-4 w-4" />
                <span>{t('myAccount')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/historico')}>
                <History className="mr-2 h-4 w-4" />
                <span>{t('history')}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/deposito')}>
                <ArrowDownToLine className="mr-2 h-4 w-4" />
                <span>{t('deposit')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/saque')}>
                <ArrowUpFromLine className="mr-2 h-4 w-4" />
                <span>{t('withdraw')}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t('logout')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};