import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl bg-[#5a3e2b]/10 border border-[#5a3e2b]/20 text-[#5a3e2b] hover:bg-[#5a3e2b]/20 transition-all cursor-pointer flex items-center justify-center relative z-[70]"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
};
