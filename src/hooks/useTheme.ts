import { useState, useEffect } from 'react';
import { ThemeOption } from '@/components/ThemeSelector';

export const useTheme = () => {
  const [theme, setTheme] = useState<ThemeOption>(() => {
    const saved = localStorage.getItem('theme');
    const initialTheme = (saved as ThemeOption) || 'dark';
    
    // Aplica o tema inicial imediatamente
    document.documentElement.classList.remove(
      'theme-default',
      'theme-dark',
      'theme-neon-green',
      'theme-neon-blue',
      'theme-neon-purple',
      'theme-neon-pink',
      'theme-neon-orange',
      'theme-cyberpunk'
    );
    document.documentElement.classList.add(`theme-${initialTheme}`);
    
    return initialTheme;
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);

    // Remove todas as classes de tema
    document.documentElement.classList.remove(
      'theme-default',
      'theme-dark',
      'theme-neon-green',
      'theme-neon-blue',
      'theme-neon-purple',
      'theme-neon-pink',
      'theme-neon-orange',
      'theme-cyberpunk'
    );

    // Adiciona a nova classe de tema
    document.documentElement.classList.add(`theme-${theme}`);
  }, [theme]);

  return { theme, setTheme };
};