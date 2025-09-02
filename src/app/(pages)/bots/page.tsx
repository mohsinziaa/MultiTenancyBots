"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Bot, Plus, Trash2, Edit, Eye, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BotData {
  id: string;
  name: string;
  description: string | null;
  companyName: string | null;
  systemPrompt: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface AddBotFormData {
  name: string;
  description: string;
  companyName: string;
  systemPrompt: string;
}

export default function BotsPage() {
  const [bots, setBots] = useState<BotData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedBot, setSelectedBot] = useState<BotData | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingBot, setEditingBot] = useState<BotData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<AddBotFormData>({
    name: '',
    description: '',
    companyName: '',
    systemPrompt: ''
  });

  // Fetch bots on component mount
  useEffect(() => {
    fetchBots();
  }, []);

  // Auto-scroll to bottom when chat messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, streamingMessage]);

  const fetchBots = async () => {
    try {
      const response = await fetch('/api/bots');
      if (response.ok) {
        const data = await response.json();
        setBots(data);
      }
    } catch (error) {
      console.error('Error fetching bots:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBot = async (botId: string) => {
    if (confirm('Are you sure you want to delete this bot?')) {
      try {
        const response = await fetch(`/api/bots/${botId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setBots(bots.filter(bot => bot.id !== botId));
        }
      } catch (error) {
        console.error('Error deleting bot:', error);
      }
    }
  };

  const handleInputChange = (field: keyof AddBotFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.systemPrompt.trim()) {
      alert('Name and System Prompt are required');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/bots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          companyName: formData.companyName.trim() || null,
          systemPrompt: formData.systemPrompt.trim()
        }),
      });

      if (response.ok) {
        const newBot = await response.json();
        setBots(prev => [newBot, ...prev]);
        handleCloseModal();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Failed to create bot'}`);
      }
    } catch (error) {
      console.error('Error creating bot:', error);
      alert('Failed to create bot. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowAddForm(false);
    setFormData({
      name: '',
      description: '',
      companyName: '',
      systemPrompt: ''
    });
  };

  const handleOpenChat = (bot: BotData) => {
    setSelectedBot(bot);
    setChatMessages([]);
    setChatInput('');
    setShowChatModal(true);
  };

  const handleCloseChat = () => {
    setShowChatModal(false);
    setSelectedBot(null);
    setChatMessages([]);
    setChatInput('');
    setStreamingMessage('');
    setIsStreaming(false);
  };

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
        const assistantMessage: {role: 'user' | 'assistant', content: string} = {
          role: 'assistant',
          content: fullMessage,
        };
        setChatMessages(prev => [...prev, assistantMessage]);
      }
    }, streamSpeed);
  };

  const handleSendChatMessage = async () => {
    if (!chatInput.trim() || !selectedBot) return;

    const userMessage = { role: 'user' as const, content: chatInput.trim() };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          context: {
            systemPrompt: selectedBot.systemPrompt
          }
        }),
      });

      if (response.ok) {
        const data = await response.json();
        streamResponse(data.message);
      } else {
        const error = await response.json();
        const errorMessage = { role: 'assistant' as const, content: `Error: ${error.error || 'Failed to get response'}` };
        setChatMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error sending chat message:', error);
      const errorMessage = { role: 'assistant' as const, content: 'Sorry, I encountered an error. Please try again.' };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleEditBot = (bot: BotData) => {
    setEditingBot(bot);
    setFormData({
      name: bot.name,
      description: bot.description || '',
      companyName: bot.companyName || '',
      systemPrompt: bot.systemPrompt
    });
    setShowEditForm(true);
  };

  const handleUpdateBot = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingBot || !formData.name.trim() || !formData.systemPrompt.trim()) {
      alert('Name and System Prompt are required');
      return;
    }

    setIsEditing(true);
    
    try {
      const response = await fetch(`/api/bots/${editingBot.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          companyName: formData.companyName.trim() || null,
          systemPrompt: formData.systemPrompt.trim()
        }),
      });

      if (response.ok) {
        const updatedBot = await response.json();
        setBots(prev => prev.map(bot => bot.id === editingBot.id ? updatedBot : bot));
        handleCloseEditModal();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Failed to update bot'}`);
      }
    } catch (error) {
      console.error('Error updating bot:', error);
      alert('Failed to update bot. Please try again.');
    } finally {
      setIsEditing(false);
    }
  };

  const handleCloseEditModal = () => {
    setShowEditForm(false);
    setEditingBot(null);
    setFormData({
      name: '',
      description: '',
      companyName: '',
      systemPrompt: ''
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto max-w-7xl p-3 sm:p-4 md:p-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-4 sm:p-6 md:p-8">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-200 rounded-2xl animate-pulse"></div>
                <div className="space-y-2">
                  <div className="w-32 h-6 bg-slate-200 rounded animate-pulse"></div>
                  <div className="w-48 h-4 bg-slate-200 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-20 h-9 bg-slate-200 rounded-lg animate-pulse"></div>
                <div className="w-24 h-9 bg-slate-200 rounded-lg animate-pulse"></div>
              </div>
            </div>

            {/* Table Skeleton */}
            <div className="space-y-4">
              {/* Table Header */}
              <div className="grid grid-cols-5 gap-3 sm:gap-4 py-3 border-b border-slate-200">
                {['Name', 'Company', 'Status', 'Created', 'Actions'].map((header, index) => (
                  <div key={index} className="h-4 bg-slate-200 rounded animate-pulse"></div>
                ))}
              </div>

              {/* Table Rows */}
              {[...Array(5)].map((_, index) => (
                <div key={index} className="grid grid-cols-5 gap-3 sm:gap-4 py-4 border-b border-slate-100">
                  <div className="space-y-2">
                    <div className="w-24 h-4 bg-slate-200 rounded animate-pulse"></div>
                    <div className="w-32 h-3 bg-slate-200 rounded animate-pulse"></div>
                  </div>
                  <div className="w-20 h-4 bg-slate-200 rounded animate-pulse"></div>
                  <div className="w-16 h-6 bg-slate-200 rounded-full animate-pulse"></div>
                  <div className="w-24 h-4 bg-slate-200 rounded animate-pulse"></div>
                  <div className="flex items-center gap-1">
                    {[...Array(3)].map((_, btnIndex) => (
                      <div key={btnIndex} className="w-6 h-6 bg-slate-200 rounded animate-pulse"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto max-w-7xl p-3 sm:p-4 md:p-6">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-white/90 to-white/70 backdrop-blur-md border-b border-slate-200/40 px-4 sm:px-6 md:px-8 py-6 sm:py-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4 sm:gap-5">
                <div className="relative">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-2xl flex items-center justify-center shadow-xl">
                    <Bot className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-3 border-white shadow-sm"></div>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Bot Management</h1>
                  <p className="text-sm sm:text-base text-slate-600 mt-1">Manage your AI chatbots and their configurations</p>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:gap-4">
                <button
                  onClick={() => window.location.href = '/'}
                  className="group px-4 py-2.5 sm:px-5 sm:py-3 text-slate-700 hover:text-slate-900 hover:bg-white/80 rounded-xl transition-all duration-300 flex items-center gap-2 cursor-pointer border border-slate-200/60 text-sm sm:text-base font-medium shadow-sm hover:shadow-md"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="hidden sm:inline">Home</span>
                </button>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="group px-4 py-2.5 sm:px-5 sm:py-3 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:via-indigo-700 hover:to-indigo-800 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl cursor-pointer text-sm sm:text-base font-medium transform hover:scale-105"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:rotate-90" />
                  <span className="hidden sm:inline">Add Bot</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 md:p-8">
            {bots.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <div className="relative mx-auto mb-6 sm:mb-8">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center shadow-lg">
                    <Bot className="w-8 h-8 sm:w-10 sm:h-10 text-slate-500" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">No bots found</h3>
                <p className="text-slate-600 mb-6 sm:mb-8 max-w-md mx-auto">Get started by creating your first AI chatbot to automate customer interactions</p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="group px-6 py-3 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:via-indigo-700 hover:to-indigo-800 transition-all duration-300 cursor-pointer text-sm sm:text-base font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2 transition-transform group-hover:rotate-90" />
                  Create Your First Bot
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-200/40 bg-white/50 backdrop-blur-sm">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-200/60">
                      <th className="text-left py-4 px-4 font-semibold text-slate-700 text-sm sm:text-base">Name</th>
                      <th className="text-left py-4 px-4 font-semibold text-slate-700 text-sm sm:text-base hidden sm:table-cell">Company</th>
                      <th className="text-left py-4 px-4 font-semibold text-slate-700 text-sm sm:text-base">Status</th>
                      <th className="text-left py-4 px-4 font-semibold text-slate-700 text-sm sm:text-base hidden md:table-cell">Created</th>
                      <th className="text-left py-4 px-4 font-semibold text-slate-700 text-sm sm:text-base">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bots.map((bot, index) => (
                      <tr key={bot.id} className={`border-b border-slate-100/60 hover:bg-white/80 transition-all duration-200 ${index % 2 === 0 ? 'bg-white/30' : 'bg-white/10'}`}>
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-semibold text-slate-900 text-sm sm:text-base">{bot.name}</div>
                            {bot.description && (
                              <div className="text-xs sm:text-sm text-slate-600 mt-1 hidden sm:block max-w-xs truncate">{bot.description}</div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-slate-600 text-sm sm:text-base hidden sm:table-cell">
                          {bot.companyName || <span className="text-slate-400 italic">—</span>}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={cn(
                              "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium shadow-sm",
                              bot.isActive
                                ? "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border border-emerald-200/60"
                                : "bg-gradient-to-r from-slate-100 to-gray-100 text-slate-700 border border-slate-200/60"
                            )}
                          >
                            <div className={`w-2 h-2 rounded-full mr-2 ${bot.isActive ? 'bg-emerald-500' : 'bg-slate-500'}`}></div>
                            {bot.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-xs sm:text-sm text-slate-600 hidden md:table-cell">
                          {formatDate(bot.createdAt)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1.5">
                            <button 
                              onClick={() => handleOpenChat(bot)}
                              className="group p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 cursor-pointer"
                              title="Test Bot"
                            >
                              <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            </button>
                            <button 
                              onClick={() => handleEditBot(bot)}
                              className="group p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all duration-200 cursor-pointer"
                              title="Edit Bot"
                            >
                              <Edit className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            </button>
                            <button
                              onClick={() => handleDeleteBot(bot.id)}
                              className="group p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 cursor-pointer"
                              title="Delete Bot"
                            >
                              <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Bot Modal - Compact Design */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-slate-200">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">Add New Bot</h2>
                  <p className="text-xs text-slate-600">Create a new AI chatbot configuration</p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-3 sm:p-4 space-y-3 sm:space-y-4">
              {/* Bot Name and Company Name in one line */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Bot Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-slate-900 placeholder-slate-500"
                    placeholder="Enter bot name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Company Name <span className="text-slate-400 text-xs">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-slate-900 placeholder-slate-500"
                    placeholder="Enter company name"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Description <span className="text-slate-400 text-xs">(Optional)</span>
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none bg-white text-slate-900 placeholder-slate-500"
                  placeholder="Describe what this bot does..."
                />
              </div>

              {/* System Prompt */}
              <div>
                <label htmlFor="systemPrompt" className="block text-sm font-medium text-slate-700 mb-1.5">
                  System Prompt <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="systemPrompt"
                  value={formData.systemPrompt}
                  onChange={(e) => handleInputChange('systemPrompt', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none bg-white text-slate-900 placeholder-slate-500"
                  placeholder="Enter the system prompt that defines this bot's behavior, knowledge, and personality..."
                  required
                />
                <p className="text-xs text-slate-500 mt-1.5">
                  This prompt defines how the bot behaves, what it knows, and how it responds to users.
                </p>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all duration-200 cursor-pointer"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Create Bot
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {showChatModal && selectedBot && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col border border-white/20">
            {/* Chat Modal Header */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                      <Bot className="w-7 h-7 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Test Bot: {selectedBot.name}</h2>
                    <p className="text-sm text-slate-600">Using system prompt: {selectedBot.systemPrompt.substring(0, 50)}...</p>
                  </div>
                </div>
                <button
                  onClick={handleCloseChat}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 sm:py-6 space-y-3 sm:space-y-4 bg-gradient-to-br from-slate-50 to-blue-50">
              {chatMessages.length === 0 && !isStreaming ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-4 sm:p-8">
                  <div className="relative mb-4 sm:mb-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl flex items-center justify-center shadow-lg">
                      <Bot className="w-8 w-8 sm:w-10 sm:h-10 text-blue-600" />
                    </div>
                    <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">
                    Start chatting with {selectedBot.name}!
                  </h3>
                  <p className="text-sm sm:text-lg text-slate-600 max-w-md leading-relaxed px-4">
                    This bot will respond using its configured system prompt. Test how it behaves and responds to different queries.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  {chatMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.role !== 'user' && (
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                            <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                          </div>
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] sm:max-w-[75%] rounded-2xl px-3 py-2 sm:px-5 sm:py-3 shadow-lg transition-all duration-200 ${
                          message.role === 'user'
                            ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white ml-auto'
                            : 'bg-white border border-slate-200/60 text-slate-900 hover:shadow-xl'
                        }`}
                      >
                        <p className="text-sm leading-relaxed font-medium">{message.content}</p>
                        <p
                          className={`text-xs mt-2 font-medium ${
                            message.role === 'user' ? 'text-blue-100' : 'text-slate-500'
                          }`}
                        >
                          {new Date().toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </p>
                      </div>
                      {message.role === 'user' && (
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center shadow-lg">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Streaming Message */}
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
                          {new Date().toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Loading Indicator */}
                  {isChatLoading && !isStreaming && (
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
            <div className="bg-white/80 backdrop-blur-sm border-t border-slate-200/60 p-2 sm:p-4 md:p-6 shadow-lg">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-stretch bg-white rounded-xl sm:rounded-2xl border border-slate-300 shadow-sm overflow-hidden">
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendChatMessage()}
                      placeholder="Type your message..."
                      className="w-full h-full min-h-[44px] sm:min-h-[48px] px-2 py-2 sm:px-4 sm:py-3 text-slate-900 placeholder-slate-500 bg-transparent text-sm sm:text-base border-0 focus:outline-none focus:ring-0 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isChatLoading || isStreaming}
                    />
                  </div>
                  <button
                    onClick={handleSendChatMessage}
                    disabled={!chatInput.trim() || isChatLoading || isStreaming}
                    className="px-2 py-2 sm:px-4 sm:py-3 transition-all duration-200 cursor-pointer flex items-center justify-center border-l border-slate-200 min-w-[44px] sm:min-w-[48px] bg-gradient-to-br from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Bot Modal */}
      {showEditForm && editingBot && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[85vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <Edit className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Edit Bot</h2>
                  <p className="text-xs text-slate-600">Update {editingBot.name} configuration</p>
                </div>
              </div>
              <button
                onClick={handleCloseEditModal}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleUpdateBot} className="p-4 space-y-4">
              {/* Bot Name and Company Name in one line */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit-name" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Bot Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-slate-900 placeholder-slate-500"
                    placeholder="Enter bot name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="edit-companyName" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Company Name <span className="text-slate-400 text-xs">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    id="edit-companyName"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-slate-900 placeholder-slate-500"
                    placeholder="Enter company name"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="edit-description" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Description <span className="text-slate-400 text-xs">(Optional)</span>
                </label>
                <textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none bg-white text-slate-900 placeholder-slate-500"
                  placeholder="Describe what this bot does..."
                />
              </div>

              {/* System Prompt */}
              <div>
                <label htmlFor="edit-systemPrompt" className="block text-sm font-medium text-slate-700 mb-1.5">
                  System Prompt <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="edit-systemPrompt"
                  value={formData.systemPrompt}
                  onChange={(e) => handleInputChange('systemPrompt', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none bg-white text-slate-900 placeholder-slate-500"
                  placeholder="Enter the system prompt that defines this bot's behavior, knowledge, and personality..."
                  required
                />
                <p className="text-xs text-slate-500 mt-1.5">
                  This prompt defines how the bot behaves, what it knows, and how it responds to users.
                </p>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all duration-200 cursor-pointer"
                  disabled={isEditing}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isEditing}
                  className="px-4 py-2 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                >
                  {isEditing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4" />
                      Update Bot
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
