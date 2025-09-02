"use client";

import React from 'react';
import { ChatMessage as ChatMessageType } from '@/types/chat';
import { formatTimestamp } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex items-start gap-2 sm:gap-4 p-2 transition-all duration-200',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isUser && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
            <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
        </div>
      )}
      
      <div
        className={cn(
          'max-w-[80%] sm:max-w-[75%] rounded-2xl px-3 py-2 sm:px-5 sm:py-3 shadow-lg transition-all duration-200',
          isUser
            ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white ml-auto'
            : 'bg-white border border-slate-200/60 text-slate-900 hover:shadow-xl'
        )}
      >
        <p className="text-sm leading-relaxed font-medium">{message.content}</p>
        <p
          className={cn(
            'text-xs mt-2 font-medium',
            isUser ? 'text-blue-100' : 'text-slate-500'
          )}
        >
          {formatTimestamp(message.timestamp)}
        </p>
      </div>

      {isUser && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center shadow-lg">
            <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
        </div>
      )}
    </div>
  );
}
