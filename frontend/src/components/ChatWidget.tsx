import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Mic, AlertCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatWindow } from './ChatWindow';
import { ChatResponse, sendChatMessage } from '../lib/api';

interface Message {
  role: 'user' | 'assistant';
  content?: string;
  structuredResponse?: ChatResponse;
}

interface ChatWidgetProps {
  language: 'en' | 'hi';
  sessionId: string;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ language, sessionId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const labels = {
    en: {
      title: 'Legal Assistant',
      placeholder: 'Ask a legal query...',
      send: 'Send',
      error: 'Error occurred.',
      retry: 'Retry'
    },
    hi: {
      title: 'कानूनी सहायक',
      placeholder: 'कानूनी प्रश्न पूछें...',
      send: 'भेजें',
      error: 'त्रुटि हुई।',
      retry: 'पुनः प्रयास'
    }
  };

  const l = labels[language];

  const handleSend = async (overrideInput?: string) => {
    const text = overrideInput || input;
    if (!text.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const response = await sendChatMessage({
        session_id: sessionId,
        language,
        message: text,
      });

      setMessages(prev => [...prev, { role: 'assistant', structuredResponse: response }]);
    } catch (err: any) {
      if (err.message === "GEMINI_API_KEY_MISSING" || err.message === "GEMINI_API_KEY_INVALID") {
        setError(language === 'hi' ? 'कृपया एक मान्य API कुंजी चुनें।' : 'Please select a valid API key.');
        // If the platform provides a key selection dialog, we can trigger it
        if ((window as any).aistudio?.openSelectKey) {
          (window as any).aistudio.openSelectKey();
        }
      } else {
        setError(l.error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] flex flex-col glass-brown rounded-3xl overflow-hidden shadow-2xl border border-[#5a3e2b]/20 glow-brown-strong"
          >
            {/* Header */}
            <div className="p-4 bg-[#5a3e2b]/10 border-b border-[#5a3e2b]/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#5a3e2b] animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5a3e2b]">{l.title}</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-[#5a3e2b]/10 rounded-lg text-[#5a3e2b]/50 hover:text-[#5a3e2b] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-hidden flex flex-col bg-[#f5f2ed]/40">
              <ChatWindow messages={messages} loading={loading} language={language} />
            </div>

            {/* Error State */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-4 py-2 bg-red-500/10 border-t border-red-500/20 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 text-red-500 text-[10px] font-bold">
                    <AlertCircle size={14} />
                    <span className="truncate max-w-[150px]">{error}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {(error.includes('API') || error.includes('key')) && (window as any).aistudio?.openSelectKey && (
                      <button 
                        onClick={() => (window as any).aistudio.openSelectKey()}
                        className="text-[10px] font-black uppercase tracking-widest text-[#5a3e2b] hover:text-[#8c6e5a]"
                      >
                        {language === 'hi' ? 'कुंजी चुनें' : 'Select Key'}
                      </button>
                    )}
                    <button 
                      onClick={() => handleSend()}
                      className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-400"
                    >
                      {l.retry}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input Area */}
            <div className="p-4 bg-[#f5f2ed]/60 border-t border-[#5a3e2b]/10">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="relative flex items-center bg-[#5a3e2b]/5 rounded-2xl border border-[#5a3e2b]/20 p-1 focus-within:border-[#5a3e2b]/40 transition-all"
              >
                <input 
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={l.placeholder}
                  className="flex-1 bg-transparent border-none focus:ring-0 py-2 px-3 text-xs placeholder:text-[#5a3e2b]/50 text-[#3d2b1f]"
                />
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="bg-[#5a3e2b]/10 border border-[#5a3e2b]/20 disabled:opacity-30 text-[#5a3e2b] p-2 rounded-xl transition-all shadow-sm hover:bg-[#5a3e2b]/20"
                >
                  <Send size={14} />
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all border ${
          isOpen 
            ? 'bg-[#f5f2ed] border-[#5a3e2b]/50 text-[#5a3e2b]' 
            : 'bg-[#f5f2ed] border-[#5a3e2b]/30 text-[#5a3e2b] glow-brown'
        }`}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </motion.button>
    </div>
  );
};
