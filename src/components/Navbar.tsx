import React from 'react';
import { 
  Sparkles, 
  History, 
  MessageSquare,
  MessageSquareText, 
  Calculator, 
  Coins, 
  ShieldCheck, 
  Moon, 
  Sun, 
  Plus, 
  User,
  ShoppingBag,
  Zap,
  Mic,
  Bot
} from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  activeView: 'landing' | 'workspace' | 'inquiries' | 'history' | 'calculator' | 'chat';
  setActiveView: (view: 'landing' | 'workspace' | 'inquiries' | 'history' | 'calculator' | 'chat') => void;
  userProfile: UserProfile;
  onOpenCreditsModal: () => void;
  onOpenAdminModal: () => void;
  onOpenProfileModal: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onNewCampaign: () => void;
  onOpenDemoCampaign?: () => void;
  onOpenAssistant?: () => void;
  onOpenLiveVoice?: () => void;
  onOpenGeminiChat?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  userProfile,
  onOpenCreditsModal,
  onOpenAdminModal,
  onOpenProfileModal,
  darkMode,
  setDarkMode,
  onNewCampaign,
  onOpenDemoCampaign,
  onOpenAssistant,
  onOpenLiveVoice,
  onOpenGeminiChat
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveView('landing')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                Sell<span className="text-indigo-600 dark:text-indigo-400">Boost</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50">
                AI Selling Assistant
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <button
            onClick={() => setActiveView('workspace')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeView === 'workspace'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Workspace
          </button>
          <button
            onClick={() => setActiveView('history')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              activeView === 'history'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Campaigns</span>
          </button>
          <button
            onClick={() => setActiveView('inquiries')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              activeView === 'inquiries'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <MessageSquareText className="w-4 h-4" />
            <span>Inquiries</span>
          </button>
          <button
            onClick={() => setActiveView('calculator')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              activeView === 'calculator'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Profit Calc</span>
          </button>
          <button
            onClick={() => setActiveView('chat')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              activeView === 'chat'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Google Chat</span>
          </button>
        </nav>

        {/* Right side utilities */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Demo Instant Showcase */}
          {onOpenDemoCampaign && (
            <button
              onClick={onOpenDemoCampaign}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-300 dark:border-amber-700/60 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30 text-amber-900 dark:text-amber-200 text-xs font-bold hover:bg-amber-100 transition-all shadow-xs cursor-pointer"
              title="Instantly explore completed selling campaign demo"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Live Demo</span>
            </button>
          )}

          {/* Live Voice Button (gemini-3.8-live) */}
          {onOpenLiveVoice && (
            <button
              onClick={onOpenLiveVoice}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-300 dark:border-rose-700/80 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-bold hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-all shadow-xs cursor-pointer"
              title="Real-Time Voice Call with gemini-3.8-live"
            >
              <Mic className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
              <span className="hidden sm:inline">Live Voice</span>
            </button>
          )}

          {/* Gemini Chatbot Button */}
          {onOpenGeminiChat && (
            <button
              onClick={onOpenGeminiChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-purple-300 dark:border-purple-700/80 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold hover:bg-purple-100 dark:hover:bg-purple-900/60 transition-all shadow-xs cursor-pointer"
              title="Multi-Turn Gemini Chatbot (Pro / Flash / Flash-Lite)"
            >
              <Bot className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span className="hidden sm:inline">Gemini Chat</span>
            </button>
          )}

          {/* AI Sales Copilot Button */}
          {onOpenAssistant && (
            <button
              onClick={onOpenAssistant}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-300 dark:border-indigo-700/80 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-all shadow-xs cursor-pointer"
              title="Open AI Sales Copilot (CEO & Sales Coach Mode)"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden sm:inline">Sales Copilot</span>
            </button>
          )}

          {/* Credits button */}
          <button
            onClick={onOpenCreditsModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-amber-200 dark:border-amber-800/60 bg-amber-50/80 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 text-xs font-semibold hover:bg-amber-100 transition-colors shadow-xs"
            title="Available AI Credits"
          >
            <Coins className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>{userProfile.credits} Credits</span>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 uppercase tracking-wider font-bold">
              +{userProfile.plan}
            </span>
          </button>

          {/* Admin toggle if admin */}
          {userProfile.role === 'admin' && (
            <button
              onClick={onOpenAdminModal}
              className="p-2 rounded-lg text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Admin Dashboard"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>
          )}

          {/* Dark mode */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User profile avatar */}
          <button
            onClick={onOpenProfileModal}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Account & Brand Settings"
          >
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 font-semibold text-xs border border-slate-300 dark:border-slate-600">
              {(userProfile?.name || "User").charAt(0).toUpperCase()}
            </div>
          </button>

          {/* Persistent Primary CTA */}
          <button
            onClick={onNewCampaign}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all shadow-sm shadow-indigo-600/30"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Create Campaign</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>

      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setActiveView('workspace')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[10px] transition-colors ${
            activeView === 'workspace'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Workspace</span>
        </button>
        <button
          onClick={() => setActiveView('history')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[10px] transition-colors ${
            activeView === 'history'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Campaigns</span>
        </button>
        <button
          onClick={() => setActiveView('inquiries')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[10px] transition-colors ${
            activeView === 'inquiries'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <MessageSquareText className="w-4 h-4" />
          <span>Inquiries</span>
        </button>
        <button
          onClick={() => setActiveView('chat')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[10px] transition-colors ${
            activeView === 'chat'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Chat</span>
        </button>
      </nav>
    </header>
  );
};
