"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bot, Home, Settings, Play, FileText, Menu, X, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Bots', href: '/bots', icon: Settings },
    { name: 'Demo', href: '/demo', icon: Play },
    { name: 'Example', href: '/example.html', icon: FileText, external: true },
  ];

  return (
    <nav className="relative bg-white/95 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50 shadow-lg shadow-slate-200/20">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-transparent to-indigo-50/30 pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-4 group">
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl shadow-blue-500/25">
                  <Bot className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                </div>
              </div>
              <div className="space-y-1">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                  Multi-Tenant Chatbot
                </h1>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-500" />
                  <p className="text-xs sm:text-sm text-slate-600 font-medium">AI Platform</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              if (item.external) {
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "flex items-center space-x-2.5 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300",
                      "text-slate-600 hover:text-slate-900 hover:bg-white/80",
                      "border border-transparent hover:border-slate-200/60"
                    )}
                  >
                    <Icon className="w-4 h-4 text-slate-500 group-hover:text-slate-700 transition-all duration-300" />
                    <span>{item.name}</span>
                  </a>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2.5 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300",
                    "border border-transparent",
                    isActive
                      ? "text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/25 border-blue-500/20"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/80 hover:border-slate-200/60"
                  )}
                >
                  <Icon className={cn(
                    "w-4 h-4 transition-all duration-300",
                    isActive ? "text-white" : "text-slate-500 group-hover:text-slate-700"
                  )} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-3 text-slate-600 hover:text-slate-900 hover:bg-white/80 rounded-xl transition-all duration-300 border border-transparent hover:border-slate-200/60"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/60 bg-white/98 backdrop-blur-xl shadow-xl shadow-slate-200/30">
          <div className="px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              if (item.external) {
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300",
                      "text-slate-600 hover:text-slate-900 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50",
                      "border border-transparent hover:border-slate-200/60"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5 text-slate-500 group-hover:text-slate-700 transition-all duration-300" />
                    <span>{item.name}</span>
                  </a>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300",
                    "border border-transparent",
                    isActive
                      ? "text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/25"
                      : "text-slate-600 hover:text-slate-900 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 hover:border-slate-200/60"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className={cn(
                    "w-5 h-5 transition-all duration-300",
                    isActive ? "text-white" : "text-slate-500 group-hover:text-slate-700"
                  )} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
