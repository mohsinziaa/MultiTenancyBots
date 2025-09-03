"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Zap, Shield, Smartphone, ArrowRight, CheckCircle, Star } from 'lucide-react';
import Script from 'next/script';

export default function Home() {
  const [currentFeature, setCurrentFeature] = useState(0);

  useEffect(() => {
    document.title = "Home | Multi Tenant Chatbot";
    
    // Auto-rotate features
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 3);
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Zap,
      title: "AI-Powered Responses",
      description: "Advanced AI that understands context and provides intelligent, helpful responses to customer inquiries."
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Secure iframe communication, message validation, and data privacy protection for your business."
    },
    {
      icon: Smartphone,
      title: "Mobile-First Design",
      description: "Responsive design that works perfectly on all devices with touch-friendly interface."
    }
  ];

  const benefits = [
    "Reduce customer support costs by 60%",
    "Provide 24/7 instant customer assistance",
    "Scale support without hiring more staff",
    "Improve customer satisfaction scores",
    "Capture leads and qualify prospects",
    "Integrate with your existing systems"
  ];

  const stats = [
    { number: "99.9%", label: "Uptime" },
    { number: "< 2s", label: "Response Time" },
    { number: "24/7", label: "Availability" },
    { number: "∞", label: "Scalability" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-8">
              <Star className="w-4 h-4 mr-2" />
              Multi-Tenant AI Platform
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Transform Customer Support with
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {" "}AI Chatbots
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Each client gets their own intelligent, branded chatbot with custom knowledge, 
              company branding, and specialized responses - all managed from one powerful dashboard.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/demo"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Try Demo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              
              <Link
                href="/bots"
                className="inline-flex items-center px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-slate-200"
              >
                Manage Bots
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              

            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm text-slate-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Built for businesses that need reliable, scalable, and intelligent customer support solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isActive = index === currentFeature;
              
              return (
                <div
                  key={index}
                  className={`text-center p-8 rounded-2xl transition-all duration-500 ${
                    isActive 
                      ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-lg scale-105' 
                      : 'bg-slate-50 border border-slate-200'
                  }`}
                >
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                    isActive 
                      ? 'bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg' 
                      : 'bg-slate-200'
                  }`}>
                    <Icon className={`w-8 h-8 transition-all duration-500 ${
                      isActive ? 'text-white' : 'text-slate-600'
                    }`} />
                  </div>
                  <h3 className={`text-xl font-semibold mb-3 transition-all duration-500 ${
                    isActive ? 'text-slate-900' : 'text-slate-700'
                  }`}>
                    {feature.title}
                  </h3>
                  <p className={`text-slate-600 leading-relaxed transition-all duration-500 ${
                    isActive ? 'text-slate-700' : 'text-slate-500'
                  }`}>
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Transform Your Business
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              See the real impact AI chatbots can have on your customer support operations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {benefits.slice(0, 3).map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-300 text-lg">{benefit}</p>
                </div>
              ))}
            </div>
            <div className="space-y-6">
              {benefits.slice(3).map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-300 text-lg">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              One Line Integration
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Get your branded chatbot live on any website in minutes, not days.
            </p>
          </div>

          <div className="bg-slate-900 rounded-2xl p-8 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-slate-400 text-sm">integration.js</span>
            </div>
            <div className="bg-slate-800 rounded-lg p-6">
              <code className="text-green-400 text-lg">
                &lt;script src=&quot;https://multi-tenancy-bots.vercel.app/chatbot-widget.js?bot-id=<span className="text-yellow-400">YOUR_BOT_ID</span>&quot; data-auto-init&gt;&lt;/script&gt;
              </code>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/example.html"
              target="_blank"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              View Full Integration Guide
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Customer Support?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join businesses that are already using AI to provide better customer experiences.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/demo"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 hover:bg-blue-50 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Start Free Demo
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            
            <Link
              href="/bots"
              className="inline-flex items-center px-8 py-4 bg-transparent hover:bg-white/10 text-white font-semibold rounded-xl transition-all duration-300 border-2 border-white hover:border-white/80"
            >
              Create Your First Bot
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Chatbot Widget */}
      <Script
        src="/chatbot-widget.js?bot-id=cmf2hx2yh0001pu0g1q86uyj1"
        data-auto-init
        strategy="afterInteractive"
      />
    </div>
  );
}
