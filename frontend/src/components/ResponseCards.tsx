import React, { useRef } from 'react';
import { 
  ShieldCheck, 
  ListOrdered, 
  Building2, 
  Phone, 
  Globe, 
  AlertTriangle, 
  Volume2, 
  BookOpen 
} from 'lucide-react';
import { ChatResponse } from '../lib/api';

interface ResponseCardsProps {
  response: ChatResponse;
  language: 'en' | 'hi';
}

export const ResponseCards: React.FC<ResponseCardsProps> = ({ response, language }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const labels = {
    en: {
      rights: 'Your Rights',
      steps: 'Action Steps',
      authority: 'Relevant Authority',
      cited: 'Cited',
      disclaimer: 'Disclaimer',
      visit: 'Visit Website',
      play: 'Listen to Response'
    },
    hi: {
      rights: 'आपके अधिकार',
      steps: 'कार्यवाही के कदम',
      authority: 'संबंधित प्राधिकरण',
      cited: 'उद्धृत',
      disclaimer: 'अस्वीकरण',
      visit: 'वेबसाइट पर जाएं',
      play: 'जवाब सुनें'
    }
  };

  const l = labels[language];

  return (
    <div className="space-y-6 w-full max-w-2xl">
      {/* Rights Card */}
      <div className="bg-[#f5f2ed] rounded-2xl p-6 border border-[#5a3e2b]/20 shadow-sm glow-brown transition-all duration-300">
        <div className="flex items-center gap-2 mb-4 text-black">
          <ShieldCheck size={20} />
          <h3 className="font-bold text-xs uppercase tracking-widest">{l.rights}</h3>
        </div>
        <ul className="space-y-3">
          {response.rights.map((right, i) => (
            <li key={i} className="flex gap-3 text-sm text-black font-medium leading-relaxed">
              <span className="text-[#5a3e2b] font-bold">•</span>
              {right}
            </li>
          ))}
        </ul>
      </div>

      {/* Action Steps Card */}
      <div className="bg-[#f5f2ed] rounded-2xl p-6 border border-[#5a3e2b]/20 shadow-sm glow-brown transition-all duration-300">
        <div className="flex items-center gap-2 mb-4 text-black">
          <ListOrdered size={20} />
          <h3 className="font-bold text-xs uppercase tracking-widest">{l.steps}</h3>
        </div>
        <div className="space-y-4">
          {response.steps.map((step, i) => (
            <div key={i} className="flex gap-4 group">
              <div className="w-8 h-8 rounded-lg bg-[#5a3e2b]/10 border border-[#5a3e2b]/20 flex items-center justify-center text-xs font-bold text-[#5a3e2b] shrink-0 group-hover:bg-[#5a3e2b] group-hover:text-[#f5f2ed] transition-all">
                {i + 1}
              </div>
              <p className="text-sm text-black font-medium pt-1.5 leading-relaxed">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Authority Card */}
      <div className="bg-[#5a3e2b]/10 rounded-2xl p-6 border border-[#5a3e2b]/30 glow-brown-strong transition-all duration-300">
        <div className="flex items-center gap-2 mb-4 text-black">
          <Building2 size={20} />
          <h3 className="font-bold text-xs uppercase tracking-widest">{l.authority}</h3>
        </div>
        <div className="space-y-4">
          <div className="font-bold text-lg text-black">{response.authority.name}</div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm text-black font-medium">
              <Phone size={16} className="text-[#5a3e2b]" />
              {response.authority.phone}
            </div>
            <a 
              href={response.authority.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-[#5a3e2b] font-bold hover:underline"
            >
              <Globe size={16} />
              {l.visit}
            </a>
          </div>
        </div>
      </div>

      {/* Citation & Audio */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-[10px] font-bold text-[#5a3e2b]/70 uppercase tracking-widest">
          <BookOpen size={14} className="text-[#5a3e2b]" />
          {l.cited}: {response.article_cited}
        </div>

        {response.audio_url && (
          <div className="flex items-center gap-3">
            <audio ref={audioRef} src={response.audio_url} className="hidden" />
            <button 
              onClick={playAudio}
              className="flex items-center gap-2 bg-[#5a3e2b]/10 border border-[#5a3e2b]/20 px-4 py-2 rounded-full text-[10px] font-bold text-[#5a3e2b] hover:bg-[#5a3e2b]/20 transition-all shadow-sm"
            >
              <Volume2 size={16} />
              {l.play}
            </button>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="p-4 bg-[#f5f2ed] border border-red-500/20 rounded-xl flex gap-3 shadow-sm">
        <AlertTriangle size={18} className="text-red-500 shrink-0" />
        <div className="space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-widest text-black">{l.disclaimer}</div>
          <p className="text-[11px] text-black font-medium leading-relaxed italic">
            {response.disclaimer}
          </p>
        </div>
      </div>
    </div>
  );
};
