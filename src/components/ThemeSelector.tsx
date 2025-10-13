import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Palette, Check } from 'lucide-react';

export type ThemeOption = 'default' | 'dark' | 'neon-green' | 'neon-blue' | 'neon-purple' | 'neon-pink' | 'neon-orange' | 'cyberpunk';

interface ThemeSelectorProps {
  currentTheme: ThemeOption;
  onThemeChange: (theme: ThemeOption) => void;
}

const THEMES = [
  {
    id: 'default' as ThemeOption,
    name: 'Padrão',
    description: 'Tema claro padrão',
    preview: 'bg-gradient-to-r from-gray-100 to-gray-200',
    colors: ['bg-gray-100', 'bg-gray-300', 'bg-gray-500']
  },
  {
    id: 'dark' as ThemeOption,
    name: 'Escuro',
    description: 'Tema escuro clássico',
    preview: 'bg-gradient-to-r from-gray-800 to-gray-900',
    colors: ['bg-gray-800', 'bg-gray-600', 'bg-gray-400']
  },
  {
    id: 'neon-green' as ThemeOption,
    name: 'Neon Verde',
    description: 'Matrix vibes',
    preview: 'bg-gradient-to-r from-green-400 via-green-500 to-green-600',
    colors: ['bg-green-400', 'bg-green-500', 'bg-green-600']
  },
  {
    id: 'neon-blue' as ThemeOption,
    name: 'Neon Azul',
    description: 'Cyber azul',
    preview: 'bg-gradient-to-r from-blue-400 via-cyan-500 to-blue-600',
    colors: ['bg-blue-400', 'bg-cyan-500', 'bg-blue-600']
  },
  {
    id: 'neon-purple' as ThemeOption,
    name: 'Neon Roxo',
    description: 'Synthwave',
    preview: 'bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600',
    colors: ['bg-purple-400', 'bg-pink-500', 'bg-purple-600']
  },
  {
    id: 'neon-pink' as ThemeOption,
    name: 'Neon Rosa',
    description: 'Vaporwave',
    preview: 'bg-gradient-to-r from-pink-400 via-rose-500 to-pink-600',
    colors: ['bg-pink-400', 'bg-rose-500', 'bg-pink-600']
  },
  {
    id: 'neon-orange' as ThemeOption,
    name: 'Neon Laranja',
    description: 'Fire mode',
    preview: 'bg-gradient-to-r from-orange-400 via-red-500 to-orange-600',
    colors: ['bg-orange-400', 'bg-red-500', 'bg-orange-600']
  },
  {
    id: 'cyberpunk' as ThemeOption,
    name: 'Cyberpunk',
    description: 'Full neon',
    preview: 'bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500',
    colors: ['bg-cyan-400', 'bg-purple-500', 'bg-pink-500']
  }
];

export const ThemeSelector = ({ currentTheme, onThemeChange }: ThemeSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="fixed top-4 right-4 z-50 gap-2"
      >
        <Palette className="w-4 h-4" />
        Temas
      </Button>
    );
  }

  return (
    <Card className="fixed top-4 right-4 w-80 bg-background/95 backdrop-blur border-border/50 shadow-xl z-50">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm">Escolher Tema</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="h-6 w-6 p-0"
          >
            ×
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {THEMES.map((theme) => (
            <div
              key={theme.id}
              className={`cursor-pointer p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                currentTheme === theme.id
                  ? 'border-primary shadow-lg'
                  : 'border-border/50 hover:border-border'
              }`}
              onClick={() => {
                onThemeChange(theme.id);
                setIsOpen(false);
              }}
            >
              {/* Preview */}
              <div className={`w-full h-8 rounded mb-2 ${theme.preview}`} />

              {/* Colors */}
              <div className="flex gap-1 mb-2">
                {theme.colors.map((color, i) => (
                  <div key={i} className={`w-3 h-3 rounded-full ${color}`} />
                ))}
              </div>

              {/* Info */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold">{theme.name}</div>
                  <div className="text-[10px] text-muted-foreground">{theme.description}</div>
                </div>
                {currentTheme === theme.id && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-[10px] text-muted-foreground text-center">
          🎨 Escolha seu estilo favorito
        </div>
      </div>
    </Card>
  );
};