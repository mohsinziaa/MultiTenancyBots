"use client";

import React, { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export interface ChatInputRef {
  focus: () => void;
}

export const ChatInput = forwardRef<ChatInputRef, ChatInputProps>(({ onSendMessage, disabled = false, placeholder = "Type your message..." }, ref) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as React.FormEvent);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm border-t border-slate-200/60 p-2 sm:p-4 md:p-6 shadow-lg">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit}>
          {/* Main input container with consistent height */}
          <div className="flex items-stretch bg-white rounded-xl sm:rounded-2xl border border-slate-300 shadow-sm overflow-hidden">
            {/* Attachment button */}
            <button
              type="button"
              className="px-2 py-2 sm:px-3 sm:py-3 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all duration-200 cursor-pointer border-r border-slate-200 flex-shrink-0"
              disabled={disabled}
            >
              <Paperclip className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            
            {/* Text input field */}
            <div className="flex-1 min-w-0 flex items-center">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={placeholder}
                disabled={disabled}
                className={cn(
                  "w-full min-h-[36px] sm:min-h-[40px] max-h-20 sm:max-h-32 resize-none border-0 focus:outline-none focus:ring-0",
                  "px-3 py-2 sm:px-4 sm:py-2 text-slate-900 placeholder-slate-500 bg-transparent",
                  "text-sm sm:text-base",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "overflow-y-auto",
                  "leading-[36px] sm:leading-[40px]"
                )}
                rows={1}
              />
            </div>
            
            {/* Send button */}
            <button
              type="submit"
              disabled={!message.trim() || disabled}
              className={cn(
                "px-2 py-2 sm:px-4 sm:py-3 transition-all duration-200 cursor-pointer flex-shrink-0",
                "flex items-center justify-center",
                "border-l border-slate-200",
                "min-w-[44px] sm:min-w-[48px]",
                message.trim() && !disabled
                  ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
              )}
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

ChatInput.displayName = 'ChatInput';
