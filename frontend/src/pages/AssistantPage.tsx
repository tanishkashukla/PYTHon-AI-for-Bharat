import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Send, Scale, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatResponse, sendChatMessage, generateSessionId } from '../lib/api';
import { MessageBubble } from '../components/MessageBubble';
import { CustomCursor } from '../components/CustomCursor';
import { ThemeToggle } from '../components/ThemeToggle';

interface Message {
  role: 'user' | 'assistant';
  content?: string;
  structuredResponse?: ChatResponse;
}

export default function AssistantPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId] = useState(generateSessionId());
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initial disclaimer message
  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages([
        {
          role: 'assistant',
          content: "I am an AI specialized in legal information, not a lawyer. My responses are for awareness purposes and do not constitute legal advice."
        }
      ]);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userText = input;
    setMessages(prev => [...prev, { role: 'user', content: userText }]);
    setInput('');
    setLoading(true);
    setError(null);
    
    // Show typing indicator after a short delay
    const typingTimer = setTimeout(() => setIsTyping(true), 400);

    try {
      const response = await sendChatMessage({
        session_id: sessionId,
        language: 'en',
        message: userText,
      });

      clearTimeout(typingTimer);
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'assistant', structuredResponse: response }]);
    } catch (err: any) {
      clearTimeout(typingTimer);
      setIsTyping(false);
      setError("An error occurred while consulting the AI. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 bg-white dark:bg-[#f5f2ed] bg-grain flex flex-col z-[100] transition-colors duration-300"
    >
      <CustomCursor />
      {/* Header */}
      <header className="px-6 py-4 border-b border-[#5a3e2b]/10 flex items-center justify-between bg-white/80 dark:bg-[#f5f2ed]/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#5a3e2b] animate-pulse" />
          <span className="text-xs font-black uppercase tracking-[0.2em] text-[#5a3e2b]">Legal Assistant</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button 
            onClick={() => navigate('/')}
            className="p-2 hover:bg-[#5a3e2b]/5 rounded-full text-[#5a3e2b] transition-colors"
          >
            <X size={24} />
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 md:p-12 space-y-8 scroll-smooth"
      >
        <AnimatePresence mode="popLayout">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {/* Special styling for the first disclaimer message if it's just text */}
              {i === 0 && msg.role === 'assistant' && !msg.structuredResponse ? (
                <div className="flex justify-center mb-12">
                  <div className="max-w-md bg-[#f5f2ed] border border-red-500/20 p-6 rounded-[32px] flex gap-4 items-start shadow-sm">
                    <AlertCircle className="text-red-500 shrink-0" size={20} />
                    <p className="text-xs font-bold text-black leading-relaxed uppercase tracking-wider">
                      {msg.content}
                    </p>
                  </div>
                </div>
              ) : (
                <MessageBubble 
                  role={msg.role} 
                  content={msg.content} 
                  structuredResponse={msg.structuredResponse}
                  language="en"
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="glass-brown p-4 rounded-3xl rounded-tl-none border border-[#5a3e2b]/20 flex items-center gap-2">
              <div className="flex gap-1">
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }} 
                  transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                  className="w-1.5 h-1.5 rounded-full bg-[#5a3e2b]/40" 
                />
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }} 
                  transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                  className="w-1.5 h-1.5 rounded-full bg-[#5a3e2b]/40" 
                />
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }} 
                  transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                  className="w-1.5 h-1.5 rounded-full bg-[#5a3e2b]/40" 
                />
              </div>
            </div>
          </motion.div>
        )}

        {error && (
          <div className="flex justify-center">
            <div className="bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-full flex items-center gap-2 text-red-500 text-[10px] font-bold uppercase tracking-widest">
              <AlertCircle size={14} />
              {error}
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 md:p-10 bg-white dark:bg-[#f5f2ed] border-t border-[#5a3e2b]/10 transition-colors duration-300">
        <div className="max-w-4xl mx-auto relative">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center bg-[#f5f2ed] rounded-[32px] border border-[#5a3e2b]/20 p-2 focus-within:border-[#5a3e2b]/40 transition-all shadow-sm"
          >
            <input 
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a legal query..."
              className="flex-1 bg-transparent border-none focus:ring-0 py-4 px-6 text-sm placeholder:text-black/30 text-black font-medium"
            />
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-[#5a3e2b] text-[#f5f2ed] p-4 rounded-[24px] transition-all hover:bg-[#3d2b1f] disabled:opacity-30"
            >
              <Send size={20} />
            </motion.button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
