import React from 'react';

interface LanguageToggleProps {
  language: 'en' | 'hi';
  onToggle: (lang: 'en' | 'hi') => void;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ language, onToggle }) => {
  return (
    <div className="flex items-center gap-2 bg-[#5a3e2b]/5 p-1 rounded-xl border border-[#5a3e2b]/20">
      <button
        onClick={() => onToggle('en')}
        className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
          language === 'en' 
            ? 'bg-[#5a3e2b] text-[#f5f2ed] shadow-lg shadow-[#5a3e2b]/20' 
            : 'text-[#5a3e2b]/60 hover:text-[#5a3e2b]/80'
        }`}
      >
        English
      </button>
      <button
        onClick={() => onToggle('hi')}
        className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
          language === 'hi' 
            ? 'bg-[#5a3e2b] text-[#f5f2ed] shadow-lg shadow-[#5a3e2b]/20' 
            : 'text-[#5a3e2b]/60 hover:text-[#5a3e2b]/80'
        }`}
      >
        हिंदी
      </button>
    </div>
  );
};
