import React, { useRef, useEffect } from 'react';
import { MessageBubble } from './MessageBubble';
import { ChatResponse } from '../lib/api';
import { Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content?: string;
  structuredResponse?: ChatResponse;
}

interface ChatWindowProps {
  messages: Message[];
  loading: boolean;
  language: 'en' | 'hi';
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, loading, language }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  return (
    <div 
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 scroll-smooth bg-[#f5f2ed]/20"
    >
      {messages.length === 0 && (
        <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-60">
          <div className="w-24 h-24 bg-[#5a3e2b]/5 rounded-full flex items-center justify-center border-2 border-dashed border-[#5a3e2b]/20">
            <Loader2 size={40} className="text-[#5a3e2b]/30" />
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-lg text-[#5a3e2b]">Start a Consultation</h3>
            <p className="text-sm max-w-xs mx-auto text-[#3d2b1f] font-medium">
              {language === 'en' 
                ? 'Describe your situation or select a category below to begin.' 
                : 'अपनी स्थिति का वर्णन करें या शुरू करने के लिए नीचे एक श्रेणी चुनें।'}
            </p>
          </div>
        </div>
      )}

      {messages.map((msg, i) => (
        <MessageBubble 
          key={i} 
          role={msg.role} 
          content={msg.content} 
          structuredResponse={msg.structuredResponse}
          language={language}
        />
      ))}

      {loading && (
        <div className="flex justify-start">
          <div className="glass-brown p-6 rounded-3xl rounded-tl-none border border-[#5a3e2b]/20 flex items-center gap-4 glow-brown">
            <Loader2 className="animate-spin text-[#5a3e2b]" size={24} />
            <span className="text-xs font-bold text-[#5a3e2b] uppercase tracking-widest">
              {language === 'en' ? 'Consulting AI...' : 'AI से परामर्श कर रहे हैं...'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
