"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage } from '@/components/ChatMessage';
import { ChatInput, ChatInputRef } from '@/components/ChatInput';
import { ChatMessage as ChatMessageType, ChatRequest, ChatResponse } from '@/types/chat';
import { generateId } from '@/lib/utils';
import { Bot, MessageCircle, AlertCircle } from 'lucide-react';

interface BotConfig {
  id: string;
  name: string;
  description?: string;
  companyName?: string;
  systemPrompt: string;
  isActive: boolean;
}

export default function EmbedPage() {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [streamingMessage, setStreamingMessage] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const [botConfig, setBotConfig] = useState<BotConfig | null>(null);
  const [botError, setBotError] = useState<string>('');
  const [isLoadingBot, setIsLoadingBot] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<ChatInputRef>(null);

  // Get bot ID from URL parameters
  const getBotId = () => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('bot-id');
    }
    return null;
  };

  // Simulate streaming effect
  const streamResponse = (fullMessage: string) => {
    setIsStreaming(true);
    setStreamingMessage('');
    
    let currentIndex = 0;
    const streamSpeed = 30;
    
    const streamInterval = setInterval(() => {
      if (currentIndex < fullMessage.length) {
        setStreamingMessage(fullMessage.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(streamInterval);
        setIsStreaming(false);
        setStreamingMessage('');
        
        const assistantMessage: ChatMessageType = {
          id: generateId(),
          role: 'assistant',
          content: fullMessage,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
        
        // Focus the input field after streaming completes
        setTimeout(() => {
          if (chatInputRef.current) {
            chatInputRef.current.focus();
          }
        }, 100);
      }
    }, streamSpeed);
  };

  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !botConfig) return;

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
          systemPrompt: botConfig.systemPrompt, // Use bot-specific system prompt
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
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, botConfig]);

  // Fetch bot configuration on component mount
  useEffect(() => {
    const botId = getBotId();
    
    if (!botId) {
      setBotError('No bot ID provided. Please specify a bot ID in the URL.');
      setIsLoadingBot(false);
      return;
    }

    const fetchBotConfig = async () => {
      try {
        const response = await fetch(`/api/bots/${botId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setBotError('Bot not found. Please check your bot ID.');
          } else {
            setBotError('Failed to load bot configuration.');
          }
          setIsLoadingBot(false);
          return;
        }

        const botData = await response.json();
        
        if (!botData.isActive) {
          setBotError('This bot is currently inactive. Please contact support.');
          setIsLoadingBot(false);
          return;
        }

        setBotConfig(botData);
        setIsLoadingBot(false);
        
        // Set page title
        document.title = `${botData.name} | Chat Widget`;
        
        // Send ready message to parent window
        if (typeof window !== 'undefined' && window.parent !== window) {
          window.parent.postMessage({ type: 'CHATBOT_READY' }, '*');
        }
      } catch (error) {
        console.error('Error fetching bot config:', error);
        setBotError('Failed to load bot configuration. Please try again.');
        setIsLoadingBot(false);
      }
    };

    fetchBotConfig();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingMessage]);

  // Focus input when chat becomes available and not loading
  useEffect(() => {
    if (botConfig && !isLoadingBot && !isLoading && !isStreaming) {
      setTimeout(() => {
        if (chatInputRef.current) {
          chatInputRef.current.focus();
        }
      }, 300);
    }
  }, [botConfig, isLoadingBot, isLoading, isStreaming]);

  // Initialize session on component mount
  useEffect(() => {
    if (!sessionId) {
      setSessionId(generateId());
    }
  }, [sessionId]);

  if (isLoadingBot) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bot className="w-8 h-8 text-white animate-pulse" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Loading Chatbot...</h2>
            <p className="text-slate-600">Please wait while we configure your bot.</p>
          </div>
        </div>
      </div>
    );
  }

  if (botError) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col">
        <div className="flex items-center justify-center h-full">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Bot Configuration Error</h2>
            <p className="text-slate-600 mb-4">{botError}</p>
            <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-700">
              <p className="font-medium mb-1">Required URL format:</p>
              <code className="bg-slate-200 px-2 py-1 rounded text-xs">
                ?bot-id=YOUR_BOT_ID
              </code>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!botConfig) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-sm">{botConfig.name}</h1>
            {botConfig.companyName && (
              <p className="text-xs text-slate-300">{botConfig.companyName}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title={isMinimized ? 'Expand' : 'Minimize'}
          >
            <MessageCircle className="w-4 h-4" />
          </button>
          
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
        {messages.length === 0 && !isLoading && !isStreaming && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Welcome to {botConfig.name}!</h2>
            <p className="text-slate-600 text-sm">
              {botConfig.description || 'How can I help you today?'}
            </p>
          </div>
        )}

        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-slate-600">
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        )}

        {isStreaming && streamingMessage && (
          <div className="flex items-start gap-2 p-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 max-w-[80%]">
              <p className="text-sm text-slate-900">{streamingMessage}</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="border-t border-slate-200 bg-white p-4">
        <ChatInput
          ref={chatInputRef}
          onSendMessage={handleSendMessage}
          disabled={isLoading || isStreaming}
          placeholder="Type your message..."
        />
      </div>
    </div>
  );
}
