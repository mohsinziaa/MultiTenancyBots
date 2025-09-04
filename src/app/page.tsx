"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Zap, Shield, ArrowRight, Star, 
  Bot, Globe, Users, Database, 
  Settings, BarChart3, MessageSquare,
  Building2, Globe2, Lock as LockIcon, Star as StarIcon
} from 'lucide-react';

export default function Home() {
  const [botId, setBotId] = useState('cmf2hx2yh0001pu0g1q86uyj1');

  useEffect(() => {
    document.title = "Home | Multi Tenant Chatbot";
    
    const urlParams = new URLSearchParams(window.location.search);
    const urlBotId = urlParams.get('bot-id');
    if (urlBotId) {
      setBotId(urlBotId);
    }

    const script = document.createElement('script');
    script.src = `/chatbot-widget.js?bot-id=${botId}`;
    script.setAttribute('data-auto-init', '');
    
    const handleWidgetMessage = (event: MessageEvent) => {
      if (event.data.type === 'CHATBOT_READY') {
        console.log('Chatbot widget is ready');
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
              console.log('Chatbot widget is ready');
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

  const highlights = [
    {
      icon: Bot,
      title: "Purpose-built for LLMs",
      description: "Advanced language models with reasoning capabilities for effective responses to complex queries."
    },
    {
      icon: Settings,
      title: "Designed for simplicity",
      description: "Create, manage, and deploy AI Agents easily, even without technical skills."
    },
    {
      icon: Shield,
      title: "Engineered for security",
      description: "Enjoy peace of mind with robust encryption and strict compliance standards."
    }
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Build & deploy your agent",
      description: "Train an agent on your business data, configure actions, then deploy for your customers."
    },
    {
      step: "02",
      title: "Agent solves customer problems",
      description: "Your AI agent handles inquiries 24/7 with intelligent, contextual responses."
    },
    {
      step: "03",
      title: "Refine & optimize",
      description: "Continuously improve performance based on real customer interactions."
    },
    {
      step: "04",
      title: "Route complex issues to humans",
      description: "Smart escalation ensures complex queries reach human agents when needed."
    },
    {
      step: "05",
      title: "Review analytics & insights",
      description: "Gain valuable insights into customer behavior and agent performance."
    }
  ];

  const features = [
    {
      icon: Database,
      title: "Real-time data sync",
      description: "Connect to CRMs, order management tools, and more for seamless data access."
    },
    {
      icon: Zap,
      title: "System actions",
      description: "Configure actions your agent can perform within your systems and integrations."
    },
    {
      icon: BarChart3,
      title: "AI model comparison",
      description: "Experiment with various models and configurations for optimal performance."
    },
    {
      icon: MessageSquare,
      title: "Smart escalation",
      description: "Natural language instructions for when to escalate queries to human agents."
    },
    {
      icon: BarChart3,
      title: "Advanced analytics",
      description: "Detailed insights to optimize agent performance and customer satisfaction."
    }
  ];



  const benefits = [
    {
      icon: Users,
      title: "Personalized responses",
      description: "User-aware AI that provides tailored answers based on individual context."
    },
    {
      icon: Zap,
      title: "Instant execution",
      description: "Execute actions immediately without human intervention or delays."
    },
    {
      icon: MessageSquare,
      title: "Brand consistency",
      description: "Maintain your voice and personality across all customer interactions."
    },
    {
      icon: Settings,
      title: "Intelligent routing",
      description: "Smart escalation ensures complex issues reach the right human agents."
    }
  ];

  const advantages = [
    {
      icon: Globe2,
      title: "Multi-channel support",
      description: "Smooth integration across Slack, WhatsApp, Messenger, and web widgets."
    },
    {
      icon: Shield,
      title: "Security first",
      description: "Built-in protection that refuses sensitive or unauthorized requests."
    },
    {
      icon: Building2,
      title: "Enterprise guardrails",
      description: "AI-powered controls prevent misinformation and maintain professionalism."
    },
    {
      icon: MessageSquare,
      title: "Natural conversations",
      description: "Adapts to modern conversational styles and handles unclear requests."
    },
    {
      icon: Globe,
      title: "Global reach",
      description: "80+ languages with real-time detection and translation support."
    }
  ];

  const testimonials = [
    {
      quote: "Multi-Tenant Chatbot is a strong signal of how customer support will evolve. The agentic approach will become increasingly effective and trusted.",
      author: "Marc Manara",
      company: "OpenAI"
    },
    {
      quote: "The multi-tenant approach is exactly what we needed for our agency. Seamless client management with branded experiences.",
      author: "Logan Kilpatrick",
      company: "Google"
    },
    {
      quote: "An overpowered tool built with modern technology. Each client gets their own branded experience seamlessly.",
      author: "Greg Kogan",
      company: "Pinecone"
    },
    {
      quote: "Answers questions it knows, delegates to our talent when stuck, and pushes clients to the funnel. 10/10 recommend.",
      author: "Martin Terskin",
      company: "OfferMarket"
    }
  ];

  const securityFeatures = [
    {
      icon: LockIcon,
      title: "Data ownership",
      description: "Your data stays yours and is never used to train models."
    },
    {
      icon: Database,
      title: "End-to-end encryption",
      description: "Industry-standard encryption at rest and in transit."
    },
    {
      icon: Shield,
      title: "Secure access",
      description: "Verified variables ensure users access only their own data."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-12 sm:pb-16">
          <div className="text-center">
            <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm font-medium mb-6 sm:mb-8">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Multi-Tenant AI Platform
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-4 sm:mb-6 leading-tight px-2">
              AI agents for magical
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {" "}customer experiences
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed px-4">
              The complete platform for building & deploying AI support agents that transform customer support.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 px-4">
              <Link
                href="/demo"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                Build your agent
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Link>
              
              <Link
                href="/bots"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl border border-slate-200 text-sm sm:text-base"
              >
                No credit card required
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Link>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 mb-6 sm:mb-8">Trusted by 9000+ businesses worldwide</p>

            {/* Company logos */}
            <div className="flex items-center justify-center space-x-4 sm:space-x-8 opacity-60 px-4">
              <div className="text-slate-400 font-semibold text-xs sm:text-sm">Siemens</div>
              <div className="text-slate-400 font-semibold text-xs sm:text-sm">Postman</div>
              <div className="text-slate-400 font-semibold text-xs sm:text-sm">PwC</div>
              <div className="text-slate-400 font-semibold text-xs sm:text-sm">Alpian</div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3 sm:mb-4 px-4">
              The complete platform for AI support agents
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto px-4">
              Built for businesses that need intelligent, scalable customer support solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {highlights.map((highlight, index) => {
              const Icon = highlight.icon;
              return (
                <div key={index} className="text-center p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                    <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-slate-900">
                    {highlight.title}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {highlight.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3 sm:mb-4 px-4">
              How it works
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto px-4">
              An end-to-end solution for conversational AI that transforms customer support.
            </p>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {howItWorks.map((step, index) => (
              <div key={index} className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6 p-4 sm:p-6 bg-white rounded-2xl shadow-sm border border-slate-200">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-lg mx-auto sm:mx-0">
                  {step.step}
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3 sm:mb-4 px-4">
              Features
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto px-4">
              Everything you need to build the perfect customer-facing AI agent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="p-4 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:shadow-lg transition-all duration-300">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>



      {/* Benefits Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3 sm:mb-4 px-4">
              Benefits
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto px-4">
              Works like the best customer service agents with your existing tools and workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4 p-4 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg flex-shrink-0 mx-auto sm:mx-0">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3 sm:mb-4 px-4">
              Advantages
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto px-4">
              Unlock the power of AI-driven agents with enterprise-grade capabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {advantages.map((advantage, index) => {
              const Icon = advantage.icon;
              return (
                <div key={index} className="p-4 sm:p-6 rounded-2xl bg-white border border-slate-200 hover:shadow-lg transition-all duration-300">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 sm:mb-3 text-slate-900">
                    {advantage.title}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {advantage.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3 sm:mb-4 px-4">
              Testimonials
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto px-4">
              What industry leaders say about Multi-Tenant Chatbot.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center mb-4">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                <blockquote className="text-slate-700 text-base sm:text-lg mb-4 sm:mb-6 italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                    {testimonial.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="text-center sm:text-left">
                    <div className="font-semibold text-slate-900 text-sm sm:text-base">{testimonial.author}</div>
                    <div className="text-slate-600 text-xs sm:text-sm">{testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>


        </div>
      </section>

      {/* Security Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-4">
              Security
            </h2>
            <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto px-4">
              Enterprise-grade security & privacy for your peace of mind.
            </p>
            <p className="text-base sm:text-lg text-slate-400 mt-3 sm:mt-4 px-4">
              SOC 2 Type II and GDPR compliant, trusted by thousands of businesses worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
            {securityFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center p-4 sm:p-6 rounded-2xl bg-slate-800 border border-slate-700">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                    <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <p className="text-slate-300 mb-4 sm:mb-6 px-4">
              Multi-Tenant Chatbot is committed to safeguarding your data.
            </p>
            <Link
              href="/demo"
              className="inline-flex items-center px-5 sm:px-6 py-2.5 sm:py-3 bg-white text-slate-900 hover:bg-slate-100 font-semibold rounded-xl transition-all duration-300 text-sm sm:text-base"
            >
              Learn more
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 px-4">
            Make customer experience your competitive edge
          </h2>
          <p className="text-lg sm:text-xl text-blue-100 mb-6 sm:mb-8 px-4">
            Deliver exceptional support experiences that set you apart from the competition.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href="/demo"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 hover:bg-blue-50 font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              Build your agent
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Link>
            
            <Link
              href="/bots"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-transparent hover:bg-white/10 text-white font-semibold rounded-xl transition-all duration-300 border-2 border-white hover:border-white/80 text-sm sm:text-base"
            >
              No credit card required
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>


    </div>
  );
}
