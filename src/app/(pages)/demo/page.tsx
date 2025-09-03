"use client";

import React, { useEffect, useState } from 'react';
import { Bot, MessageCircle, Settings, Code, Zap, Shield, Smartphone, Clock, Play } from 'lucide-react';
import Link from 'next/link';

export default function DemoPage() {
  const [widgetLoaded, setWidgetLoaded] = useState(false);
  const [botId, setBotId] = useState('cmf2hx2yh0001pu0g1q86uyj1');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    document.title = "Demo | Multi Tenant Chatbot";
    
    const urlParams = new URLSearchParams(window.location.search);
    const urlBotId = urlParams.get('bot-id');
    if (urlBotId) {
      setBotId(urlBotId);
    }

    setCurrentUrl(window.location.href);

    const script = document.createElement('script');
    script.src = `/chatbot-widget.js?bot-id=${botId}`;
    script.setAttribute('data-auto-init', '');
    
    const handleWidgetMessage = (event: MessageEvent) => {
      if (event.data.type === 'CHATBOT_READY') {
        setWidgetLoaded(true);
      }
    };
    
    window.addEventListener('message', handleWidgetMessage);
    
    script.onload = () => {
      setTimeout(() => {
        if (window.ChatbotWidget) {
          window.ChatbotWidget.init({ botId: botId });
          
          let checkCount = 0;
          const maxChecks = 20;
          
          const checkIframeReady = () => {
            checkCount++;
            
            if (window.ChatbotWidget.isReady && window.ChatbotWidget.isReady()) {
              setWidgetLoaded(true);
            } else if (checkCount >= maxChecks) {
              console.error('Widget failed to become ready after maximum checks');
            } else {
              setTimeout(checkIframeReady, 500);
            }
          };
          
          setTimeout(() => {
            checkIframeReady();
          }, 1000);
          
        } else {
          console.error('ChatbotWidget object not found');
        }
      }, 500);
    };

    document.body.appendChild(script);

    return () => {
      if (window.ChatbotWidget) {
        window.ChatbotWidget.destroy();
      }
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      window.removeEventListener('message', handleWidgetMessage);
    };
  }, [botId]);

  const openChat = () => {
    try {
      if (window.ChatbotWidget && window.ChatbotWidget.isReady && window.ChatbotWidget.isReady()) {
        window.ChatbotWidget.open();
      }
    } catch (error) {
      console.error('Error opening chat:', error);
    }
  };

  const minimizeChat = () => {
    try {
      if (window.ChatbotWidget && window.ChatbotWidget.isReady && window.ChatbotWidget.isReady()) {
        window.ChatbotWidget.minimize();
      }
    } catch (error) {
      console.error('Error minimizing chat:', error);
    }
  };

  const closeChat = () => {
    try {
      if (window.ChatbotWidget && window.ChatbotWidget.isReady && window.ChatbotWidget.isReady()) {
        window.ChatbotWidget.close();
      }
    } catch (error) {
      console.error('Error closing chat:', error);
    }
  };

  const sendTestMessage = () => {
    try {
      if (window.ChatbotWidget && window.ChatbotWidget.isReady && window.ChatbotWidget.isReady()) {
        window.ChatbotWidget.sendMessage('Hello! This is a test message from the demo page.');
      }
    } catch (error) {
      console.error('Error sending test message:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-8">
              <Play className="w-4 h-4 mr-2" />
              Interactive Demo
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-4 sm:mb-6 leading-tight px-4">
              Experience the Power of
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {" "}AI Chatbots
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed px-4">
              Test our multi-tenant chatbot platform in real-time. Each bot has unique knowledge, 
              company branding, and specialized responses - all configurable through our intuitive dashboard.
            </p>

            {/* Status Indicator */}
            <div className="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${widgetLoaded ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                  <span className="text-xs sm:text-sm font-medium text-slate-700">
                    {widgetLoaded ? '✅ Widget Ready' : '⏳ Loading Widget...'}
                  </span>
                </div>
                <div className="px-2 sm:px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-mono">
                  Bot ID: {botId.slice(0, 8)}...
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3 sm:mb-4 px-4">
            Why Choose Our Platform?
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto px-4">
            Advanced AI technology combined with enterprise-grade features for the ultimate chatbot experience.
          </p>
        </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 hover:shadow-lg transition-all duration-300">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2 sm:mb-3">AI-Powered Responses</h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Advanced AI that understands context and provides intelligent, 
                helpful responses to customer inquiries.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 hover:shadow-lg transition-all duration-300">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <Code className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2 sm:mb-3">One-Line Integration</h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Simple script tag integration. Copy, paste, and your 
                branded chatbot is live on any website.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 hover:shadow-lg transition-all duration-300">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <Smartphone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2 sm:mb-3">Mobile-First Design</h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Responsive design that works perfectly on all devices. 
                Touch-friendly interface for mobile users.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 hover:shadow-lg transition-all duration-300">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2 sm:mb-3">Custom Branding</h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Personalized appearance, company knowledge, and 
                conversation style for each client.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 hover:shadow-lg transition-all duration-300">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-600 to-pink-600 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2 sm:mb-3">Enterprise Security</h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Secure iframe communication, message validation, 
                and data privacy protection.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 hover:shadow-lg transition-all duration-300">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2 sm:mb-3">24/7 Availability</h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Always-on customer support. No downtime, 
                no waiting - instant responses anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-12 sm:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8 lg:p-12">
            <div className="text-center mb-6 sm:mb-8 lg:mb-12">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 sm:mb-4 px-2 sm:px-4">
                🎮 Interactive Widget Demo
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto px-2 sm:px-4">
                Test the chatbot widget functionality below. The widget is currently using bot ID: 
                <code className="bg-slate-100 px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-mono text-slate-800 ml-1 sm:ml-2">
                  {botId}
                </code>
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
              {/* Control Panel */}
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-4 sm:mb-6">Widget Controls</h3>
                
                <div className="space-y-3 sm:space-y-4">
                  <button
                    onClick={openChat}
                    disabled={!widgetLoaded}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-500 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base lg:text-lg transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed shadow-lg hover:shadow-xl cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2 sm:mr-3" />
                    Open Chat
                  </button>

                  <button
                    onClick={minimizeChat}
                    disabled={!widgetLoaded}
                    className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 disabled:from-slate-400 disabled:to-slate-500 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base lg:text-lg transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed shadow-lg hover:shadow-xl cursor-pointer"
                  >
                    <Bot className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2 sm:mr-3" />
                    Minimize Chat
                  </button>

                  <button
                    onClick={closeChat}
                    disabled={!widgetLoaded}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-slate-400 disabled:to-slate-500 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base lg:text-lg transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed shadow-lg hover:shadow-xl cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2 sm:mr-3" />
                    Close Chat
                  </button>

                  <button
                    onClick={sendTestMessage}
                    disabled={!widgetLoaded}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-slate-400 disabled:to-slate-500 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base lg:text-lg transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed shadow-lg hover:shadow-xl cursor-pointer"
                  >
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2 sm:mr-3" />
                    Send Test Message
                  </button>
                </div>

                <div className="pt-4 sm:pt-6 border-t border-slate-200">
                  <div className="flex items-center justify-center space-x-2">
                    <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${widgetLoaded ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <span className="text-xs sm:text-sm text-slate-600 font-medium">
                      {widgetLoaded ? '✅ Widget is ready and responsive' : '⏳ Loading widget...'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Integration Code */}
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-4 sm:mb-6">Integration Code</h3>
                
                <div className="bg-slate-900 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="flex space-x-2">
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-slate-400 text-xs sm:text-sm">integration.js</span>
                  </div>
                  <div className="bg-slate-800 rounded-lg sm:rounded-xl p-3 sm:p-4">
                    <code className="text-green-400 text-xs sm:text-sm leading-relaxed break-all">
                      {`<script src="https://multi-tenancy-bots.vercel.app/chatbot-widget.js?bot-id=${botId}" data-auto-init></script>`}
                    </code>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                  <h4 className="font-semibold text-blue-900 mb-2 sm:mb-3 text-sm sm:text-base">Current Bot Configuration</h4>
                  <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-blue-800">
                    <div><strong>Bot ID:</strong> {botId}</div>
                    <div><strong>Status:</strong> {widgetLoaded ? 'Active' : 'Loading'}</div>
                    <div><strong>URL:</strong> {currentUrl || 'Loading...'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              How Multi-Tenancy Works
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Each bot gets its own configuration, knowledge base, and branding while sharing the same powerful AI infrastructure.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900">Bot ID Detection</h3>
              <p className="text-slate-600 leading-relaxed">
                Widget reads the bot ID from script URL parameters or URL query string
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900">Configuration Fetch</h3>
              <p className="text-slate-600 leading-relaxed">
                Loads bot-specific settings, system prompt, and company branding
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900">Custom Experience</h3>
              <p className="text-slate-600 leading-relaxed">
                Displays bot-specific knowledge, branding, and behavior
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Experience the power of multi-tenant chatbots. Each bot provides a unique, 
            branded experience for your clients.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/example.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer"
            >
              <Code className="w-5 h-5 mr-3" />
              View Integration Examples
            </a>
            
            <Link
              href="/bots"
              className="inline-flex items-center px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-slate-200 cursor-pointer"
            >
              <Settings className="w-5 h-5 mr-3" />
              Manage Bots
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
