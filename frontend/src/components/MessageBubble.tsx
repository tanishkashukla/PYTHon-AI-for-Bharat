import React from 'react';
import { Scale, User } from 'lucide-react';
import { ChatResponse } from '../lib/api';
import { ResponseCards } from './ResponseCards';

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content?: string;
  structuredResponse?: ChatResponse;
  language: 'en' | 'hi';
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ role, content, structuredResponse, language }) => {
  const isAssistant = role === 'assistant';

  return (
    <div className={`flex w-full mb-10 ${isAssistant ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex max-w-[90%] md:max-w-[80%] gap-4 ${isAssistant ? 'flex-row' : 'flex-row-reverse'}`}>
        {/* Avatar */}
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border ${
          isAssistant ? 'bg-[#5a3e2b] text-[#f5f2ed] border-[#5a3e2b]/20' : 'bg-[#5a3e2b]/10 text-[#5a3e2b] border-[#5a3e2b]/20'
        }`}>
          {isAssistant ? <Scale size={20} /> : <User size={20} />}
        </div>

        {/* Content */}
        <div className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}>
          {content && (
            <div className={`p-5 rounded-3xl text-sm leading-relaxed shadow-sm transition-all duration-300 ${
              isAssistant 
                ? 'bg-[#f5f2ed] text-black rounded-tl-none border border-[#5a3e2b]/20' 
                : 'bg-[#5a3e2b]/10 text-[#3d2b1f] rounded-tr-none border border-[#5a3e2b]/20 font-bold'
            }`}>
              {content}
            </div>
          )}

          {structuredResponse && (
            <div className="mt-4 w-full">
              <ResponseCards response={structuredResponse} language={language} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
