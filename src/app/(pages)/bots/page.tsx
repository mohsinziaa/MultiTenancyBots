"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Bot, Plus, Trash2, Edit, Eye, X, Copy, ArrowRight, Star, Settings, MessageSquare, Globe } from 'lucide-react';
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

  // Set page title
  useEffect(() => {
    document.title = "Manage Bots | Multi Tenant Chatbot";
  }, []);

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

  const handleCopyScript = async (botId: string) => {
    const script = `<script src="https://multi-tenancy-bots.vercel.app/chatbot-widget.js?bot-id=${botId}" data-auto-init></script>`;
    
    try {
      await navigator.clipboard.writeText(script);
      alert('Script copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy script:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = script;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Script copied to clipboard!');
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
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Loading your bots...</h2>
            <div className="flex justify-center space-x-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-8">
              <Star className="w-4 h-4 mr-2" />
              Bot Management
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-4 sm:mb-6 leading-tight px-4">
              Manage Your
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {" "}AI Chatbots
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed px-4">
              Create, configure, and deploy intelligent AI agents for your business. Each bot gets its own knowledge, branding, and personality.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 px-4">
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer text-sm sm:text-base"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Create New Bot
              </button>
              
                                      <Link
                          href="/"
                          className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl border border-slate-200 text-sm sm:text-base"
                        >
                          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                          Back to Home
                        </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 max-w-4xl mx-auto px-4">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-1 sm:mb-2">
                  {bots.length}
                </div>
                <div className="text-xs sm:text-sm text-slate-600 font-medium">Total Bots</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-1 sm:mb-2">
                  {bots.filter(bot => bot.isActive).length}
                </div>
                <div className="text-xs sm:text-sm text-slate-600 font-medium">Active Bots</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-1 sm:mb-2">
                  {bots.filter(bot => bot.companyName).length}
                </div>
                <div className="text-xs sm:text-sm text-slate-600 font-medium">Branded Bots</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-1 sm:mb-2">
                  ∞
                </div>
                <div className="text-xs sm:text-sm text-slate-600 font-medium">Scalability</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bots Section */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {bots.length === 0 ? (
            <div className="text-center py-12 sm:py-20">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 sm:mb-8 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shadow-lg">
                <Bot className="w-8 h-8 sm:w-10 sm:h-10 text-slate-500" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 sm:mb-4">No bots found</h3>
              <p className="text-sm sm:text-base text-slate-600 mb-6 sm:mb-8 max-w-md mx-auto px-4">
                Get started by creating your first AI chatbot to automate customer interactions and provide 24/7 support.
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer text-sm sm:text-base"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Create Your First Bot
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {bots.map((bot) => (
                <div key={bot.id} className="bg-slate-50 rounded-2xl border border-slate-200 p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-4 sm:space-y-0">
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg flex-shrink-0">
                        <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
                          <h3 className="text-lg sm:text-xl font-semibold text-slate-900">{bot.name}</h3>
                          <span
                            className={cn(
                              "inline-flex items-center px-2 py-1 sm:px-2.5 sm:py-1 rounded-full text-xs font-medium w-fit",
                              bot.isActive
                                ? "bg-green-100 text-green-800 border border-green-200"
                                : "bg-slate-100 text-slate-700 border border-slate-200"
                            )}
                          >
                            <div className={`w-2 h-2 rounded-full mr-2 ${bot.isActive ? 'bg-green-500' : 'bg-slate-500'}`}></div>
                            {bot.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        
                        {bot.description && (
                          <p className="text-sm sm:text-base text-slate-600 mb-3">{bot.description}</p>
                        )}
                        
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm text-slate-500">
                          {bot.companyName && (
                            <div className="flex items-center space-x-2">
                              <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span>{bot.companyName}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-2">
                            <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>Created {formatDate(bot.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center sm:justify-end space-x-1 sm:space-x-2">
                      <button 
                        onClick={() => handleOpenChat(bot)}
                        className="p-1.5 sm:p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 cursor-pointer"
                        title="Test Bot"
                      >
                        <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                      <button 
                        onClick={() => handleCopyScript(bot.id)}
                        className="p-1.5 sm:p-2 text-slate-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 cursor-pointer"
                        title="Copy Embed Script"
                      >
                        <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                      <button 
                        onClick={() => handleEditBot(bot)}
                        className="p-1.5 sm:p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all duration-200 cursor-pointer"
                        title="Edit Bot"
                      >
                        <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteBot(bot.id)}
                        className="p-1.5 sm:p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 cursor-pointer"
                        title="Delete Bot"
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Add Bot Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Create New Bot</h2>
                  <p className="text-sm text-slate-600">Configure your AI chatbot</p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Bot Name and Company Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                    Bot Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-slate-900 placeholder-slate-500"
                    placeholder="Enter bot name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-slate-700 mb-2">
                    Company Name <span className="text-slate-400 text-xs">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-slate-900 placeholder-slate-500"
                    placeholder="Enter company name"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                  Description <span className="text-slate-400 text-xs">(Optional)</span>
                </label>
                                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none bg-white text-slate-900 placeholder-slate-500"
                    placeholder="Describe what this bot does..."
                  />
              </div>

              {/* System Prompt */}
              <div>
                <label htmlFor="systemPrompt" className="block text-sm font-medium text-slate-700 mb-2">
                  System Prompt <span className="text-red-500">*</span>
                </label>
                                  <textarea
                    id="systemPrompt"
                    value={formData.systemPrompt}
                    onChange={(e) => handleInputChange('systemPrompt', e.target.value)}
                    rows={5}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none bg-white text-slate-900 placeholder-slate-500"
                    placeholder="Enter the system prompt that defines this bot's behavior, knowledge, and personality..."
                    required
                  />
                <p className="text-sm text-slate-500 mt-2">
                  This prompt defines how the bot behaves, what it knows, and how it responds to users.
                </p>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-3 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all duration-200 cursor-pointer"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
            {/* Chat Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-5 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Bot className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Test Bot: {selectedBot.name}</h2>
                    <p className="text-blue-100 text-sm">Using system prompt: {selectedBot.systemPrompt.substring(0, 50)}...</p>
                  </div>
                </div>
                <button
                  onClick={handleCloseChat}
                  className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-slate-50">
              {chatMessages.length === 0 && !isStreaming ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center shadow-lg mb-6">
                    <MessageSquare className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    Start chatting with {selectedBot.name}!
                  </h3>
                  <p className="text-slate-600 max-w-md leading-relaxed">
                    This bot will respond using its configured system prompt. Test how it behaves and responds to different queries.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {chatMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.role !== 'user' && (
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <div
                        className={`max-w-[75%] rounded-2xl px-5 py-3 shadow-lg transition-all duration-200 ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white ml-4'
                            : 'bg-white border border-slate-200 text-slate-900 mr-4 hover:shadow-xl'
                        }`}
                      >
                        <p className="leading-relaxed">{message.content}</p>
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
                        <div className="w-10 h-10 bg-slate-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Streaming Message */}
                  {isStreaming && (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div className="max-w-[75%] rounded-2xl px-5 py-3 shadow-lg bg-white border border-slate-200 text-slate-900">
                        <p className="leading-relaxed">
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
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div className="bg-white rounded-2xl px-5 py-4 shadow-lg border border-slate-200">
                        <div className="flex space-x-2">
                          <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
                          <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="bg-white border-t border-slate-200 p-6">
              <div className="flex items-stretch bg-slate-50 rounded-2xl border border-slate-300 overflow-hidden">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendChatMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-5 py-4 text-slate-900 placeholder-slate-500 bg-transparent border-0 focus:outline-none focus:ring-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isChatLoading || isStreaming}
                />
                <button
                  onClick={handleSendChatMessage}
                  disabled={!chatInput.trim() || isChatLoading || isStreaming}
                  className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
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
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Edit className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Edit Bot</h2>
                  <p className="text-sm text-slate-600">Update {editingBot.name} configuration</p>
                </div>
              </div>
              <button
                onClick={handleCloseEditModal}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleUpdateBot} className="p-6 space-y-6">
              {/* Bot Name and Company Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit-name" className="block text-sm font-medium text-slate-700 mb-2">
                    Bot Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-slate-900 placeholder-slate-500"
                    placeholder="Enter bot name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="edit-companyName" className="block text-sm font-medium text-slate-700 mb-2">
                    Company Name <span className="text-slate-400 text-xs">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    id="edit-companyName"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-slate-900 placeholder-slate-500"
                    placeholder="Enter company name"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="edit-description" className="block text-sm font-medium text-slate-700 mb-2">
                  Description <span className="text-slate-400 text-xs">(Optional)</span>
                </label>
                                  <textarea
                    id="edit-description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none bg-white text-slate-900 placeholder-slate-500"
                    placeholder="Describe what this bot does..."
                  />
              </div>

              {/* System Prompt */}
              <div>
                <label htmlFor="edit-systemPrompt" className="block text-sm font-medium text-slate-700 mb-2">
                  System Prompt <span className="text-red-500">*</span>
                </label>
                                  <textarea
                    id="edit-systemPrompt"
                    value={formData.systemPrompt}
                    onChange={(e) => handleInputChange('systemPrompt', e.target.value)}
                    rows={5}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none bg-white text-slate-900 placeholder-slate-500"
                    placeholder="Enter the system prompt that defines this bot's behavior, knowledge, and personality..."
                    required
                  />
                <p className="text-sm text-slate-500 mt-2">
                  This prompt defines how the bot behaves, what it knows, and how it responds to users.
                </p>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="px-6 py-3 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all duration-200 cursor-pointer"
                  disabled={isEditing}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isEditing}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
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
