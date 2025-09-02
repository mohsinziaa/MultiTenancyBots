"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ChatMessage as ChatMessageType, ChatRequest, ChatResponse } from '@/types/chat';
import { generateId, formatTimestamp } from '@/lib/utils';
import { Bot, MessageCircle, Sparkles } from 'lucide-react';

export function Chat() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [streamingMessage, setStreamingMessage] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingMessage]);

  // Initialize session on component mount
  useEffect(() => {
    if (!sessionId) {
      setSessionId(generateId());
    }
  }, [sessionId]);

  // Simulate streaming effect
  const streamResponse = (fullMessage: string) => {
    setIsStreaming(true);
    setStreamingMessage('');
    
    let currentIndex = 0;
    const streamSpeed = 30; // milliseconds per character
    
    const streamInterval = setInterval(() => {
      if (currentIndex < fullMessage.length) {
        setStreamingMessage(fullMessage.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(streamInterval);
        setIsStreaming(false);
        setStreamingMessage('');
        
        // Add the complete message to the messages array
        const assistantMessage: ChatMessageType = {
          id: generateId(),
          role: 'assistant',
          content: fullMessage,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    }, streamSpeed);
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: ChatMessageType = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const request: ChatRequest = {
        message: content.trim(),
        sessionId,
        context: {
          industry: 'Home Services',
          service: 'General',
          location: 'Not specified',
        },
      };

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const chatResponse: ChatResponse = await response.json();
      setSessionId(chatResponse.sessionId);
      
      // Start streaming the response
      streamResponse(chatResponse.message);

    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: ChatMessageType = {
        id: generateId(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setSessionId(generateId());
    setStreamingMessage('');
    setIsStreaming(false);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-white/90 to-white/70 backdrop-blur-md border-b border-slate-200/40 px-4 sm:px-6 md:px-8 py-4 sm:py-6 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-2xl flex items-center justify-center shadow-xl">
                <Bot className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-3 border-white shadow-sm"></div>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Home Service Bot</h2>
              <p className="text-sm sm:text-base text-slate-600 mt-1">Your AI assistant for home services</p>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => router.push('/bots')}
              className="group px-4 py-2.5 sm:px-5 sm:py-3 text-slate-700 hover:text-slate-900 hover:bg-white/80 rounded-xl transition-all duration-300 cursor-pointer flex items-center gap-2 font-medium shadow-sm hover:shadow-md border border-slate-200/60"
            >
              <Bot className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110" />
              <span className="hidden sm:inline">Our Bots</span>
            </button>
            <button
              onClick={clearChat}
              className="group px-4 py-2.5 sm:px-5 sm:py-3 text-slate-700 hover:text-slate-900 hover:bg-white/80 rounded-xl transition-all duration-300 cursor-pointer font-medium shadow-sm hover:shadow-md border border-slate-200/60"
            >
              <span className="hidden sm:inline">Clear Chat</span>
              <span className="sm:hidden">Clear</span>
            </button>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 sm:py-6 space-y-3 sm:space-y-4">
        {messages.length === 0 && !isStreaming ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4 sm:p-8">
            <div className="relative mb-6 sm:mb-8">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-100 via-blue-200 to-indigo-200 rounded-3xl flex items-center justify-center shadow-xl">
                <MessageCircle className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600" />
              </div>
              <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-400 via-pink-400 to-rose-400 rounded-full flex items-center justify-center shadow-lg">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-3 sm:mb-4">
              Welcome to Home Service Bot!
            </h3>
            <p className="text-base sm:text-lg text-slate-600 max-w-lg leading-relaxed px-4 mb-6 sm:mb-8">
              I&apos;m here to help you with any questions about home services, repairs, 
              maintenance, or scheduling appointments. How can I assist you today?
            </p>
            <div className="flex flex-wrap gap-3 justify-center px-4">
              <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 rounded-full text-sm font-medium shadow-sm border border-blue-200/60">Plumbing</span>
              <span className="px-4 py-2 bg-gradient-to-r from-emerald-100 to-green-200 text-emerald-800 rounded-full text-sm font-medium shadow-sm border border-emerald-200/60">Electrical</span>
              <span className="px-4 py-2 bg-gradient-to-r from-orange-100 to-amber-200 text-orange-800 rounded-full text-sm font-medium shadow-sm border border-orange-200/60">HVAC</span>
              <span className="px-4 py-2 bg-gradient-to-r from-purple-100 to-violet-200 text-purple-800 rounded-full text-sm font-medium shadow-sm border border-violet-200/60">Cleaning</span>
            </div>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
              />
            ))}
            
            {/* Streaming message */}
            {isStreaming && (
              <div className="flex items-start gap-2 sm:gap-4 p-2">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                    <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                </div>
                <div className="max-w-[80%] sm:max-w-[75%] rounded-2xl px-3 py-2 sm:px-5 sm:py-3 shadow-lg bg-white border border-slate-200/60 text-slate-900">
                  <p className="text-sm leading-relaxed font-medium">
                    {streamingMessage}
                    <span className="inline-block w-2 h-4 bg-blue-500 ml-1 animate-pulse"></span>
                  </p>
                  <p className="text-xs mt-2 font-medium text-slate-500">
                    {formatTimestamp(new Date())}
                  </p>
                </div>
              </div>
            )}
            
            {/* Loading indicator */}
            {isLoading && !isStreaming && (
              <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="bg-white rounded-2xl px-4 py-3 sm:px-5 sm:py-4 shadow-lg border border-slate-200/60">
                  <div className="flex space-x-1 sm:space-x-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Chat Input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={isLoading || isStreaming}
        placeholder="Ask about home services, repairs, or maintenance..."
      />
    </div>
  );
}
