import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Copy, 
  Check, 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  MessageSquare, 
  Zap, 
  Video, 
  ShoppingBag, 
  PhoneCall, 
  Bot, 
  ArrowRight,
  Flame,
  ThumbsUp,
  RefreshCw,
  HelpCircle,
  Mic
} from 'lucide-react';
import { SellingPackage, ProductInput } from '../types';

interface SellingAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  activePackage: SellingPackage | null;
  productInfo?: ProductInput;
  uploadedImage?: string | null;
  onOpenLiveVoice?: () => void;
  onOpenGeminiChat?: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  actionScript?: string;
  category?: string;
}

export const SellingAssistantModal: React.FC<SellingAssistantModalProps> = ({
  isOpen,
  onClose,
  activePackage,
  productInfo,
  uploadedImage,
  onOpenLiveVoice,
  onOpenGeminiChat
}) => {
  const currentProduct = activePackage?.productInfo || productInfo;
  const productName = currentProduct?.name || activePackage?.analysis?.productType || "Your Product";
  const currency = currentProduct?.currency || "PKR";
  const price = currentProduct?.price || 2450;
  const targetMarket = currentProduct?.targetMarket || "Pakistan";

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'audit' | 'tools' | 'chat'>('audit');

  // Initialize initial greeting and tactical advice
  useEffect(() => {
    if (chatMessages.length === 0) {
      setChatMessages([
        {
          id: 'msg-welcome',
          sender: 'assistant',
          text: `👋 I'm your SellBoost AI Chief Sales Officer. I've audited "${productName}" for the ${targetMarket} market. 

Here are the 3 fastest ways to generate confirmed orders today:
1. **Price Positioning**: Anchor with a retail price and offer a 15-20% launch markdown with Free COD delivery.
2. **The #1 Objection**: Buyers fear receiving a cheap replica. Always emphasize "Doorstep Inspection Allowed before paying".
3. **WhatsApp Closing**: 70% of sales close in chat. Reply within 3 minutes using our structured greeting.

What sales challenge do you want to solve right now?`
        }
      ]);
    }
  }, [productName, targetMarket]);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSendQuery = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend
    };

    setChatMessages(prev => [...prev, userMsg]);
    if (!customPrompt) setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/selling-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToSend,
          productInfo: currentProduct,
          productName,
          currency,
          price,
          targetMarket,
          analysis: activePackage?.analysis
        })
      });

      if (res.ok) {
        const data = await res.json();
        const reply = data.reply || data.response;
        setChatMessages(prev => [
          ...prev, 
          {
            id: `ai-${Date.now()}`,
            sender: 'assistant',
            text: reply,
            actionScript: data.copyableScript
          }
        ]);
      } else {
        throw new Error('Fallback to local assistant');
      }
    } catch {
      // Local high-leverage fallback logic for instant response
      let answer = "";
      let script = "";

      if (textToSend.toLowerCase().includes('whatsapp') || textToSend.toLowerCase().includes('broadcast')) {
        answer = `Here is your high-converting WhatsApp Flash Sale broadcast with psychological urgency:`;
        script = `🔥 *URGENT 24-HOUR VIP DROP: ${productName.toUpperCase()}* 🔥\n\nAssalam o alaikum! We have just released a limited batch of the *${productName}*.\n\n✨ *Why Customers Love It:*\n• Premium export-grade finishing\n• 100% Doorstep Inspection Allowed\n• Free Express Courier Delivery\n\n💰 *Special Flash Price:* ${currency} ${Number(price).toLocaleString()} (Save 20% today)\n\n📍 *How to Order:* Simply reply with your *City Name* and we will reserve your parcel.\n\n⏳ *Only 12 pieces allocated for this broadcast!*`;
      } else if (textToSend.toLowerCase().includes('expensive') || textToSend.toLowerCase().includes('discount') || textToSend.toLowerCase().includes('price')) {
        answer = `When a customer says "Price is too high" or asks for a discount, never slash price immediately. First anchor quality, then offer a high-value bonus:`;
        script = `Assalam o alaikum! We completely understand you want the best value. The reason this ${productName} is priced at ${currency} ${Number(price).toLocaleString()} is because we use high-grade durable materials that don't lose finish or crack after a few weeks.\n\nPlus, we include Free Tracked Delivery and you can inspect the parcel at your door before paying.\n\nIf you confirm your order today, I can add a complimentary accessory pouch / free gift voucher for your next order. Shall I book one for you?`;
      } else if (textToSend.toLowerCase().includes('tiktok') || textToSend.toLowerCase().includes('reels') || textToSend.toLowerCase().includes('video')) {
        answer = `Here is a viral 15-second TikTok / Instagram Reels script formatted for high watch-time:`;
        script = `[0-3s HOOK]: (Hold item close to camera) "If you are still buying low quality items online, stop making this mistake..."\n[4-8s PROOF]: (Show crisp details, zipper/finish ASMR) "This is the ${productName}. Notice the structured walls and reinforced seams."\n[9-12s BENEFIT]: (Show in practical use) "Fits all your essentials and looks like a 3x more expensive luxury boutique piece."\n[13-15s CTA]: (On screen text: Free COD Delivery) "Link in bio for special 20% off with Cash on Delivery across Pakistan!"`;
      } else if (textToSend.toLowerCase().includes('cod') || textToSend.toLowerCase().includes('delivery') || textToSend.toLowerCase().includes('return')) {
        answer = `To stop customers from rejecting Cash on Delivery orders at the doorstep, send this confirmation message before dispatching:`;
        script = `Assalam o alaikum! Your order for *${productName}* (${currency} ${Number(price).toLocaleString()}) is packed and scheduled for dispatch via express courier.\n\n📦 *Tracking Details:* Will be sent within 24 hours.\n✅ *Doorstep Inspection:* You can inspect the item before paying.\n\nKindly reply with "CONFIRM" so our courier rider knows your address is accurate. Thank you!`;
      } else {
        answer = `Based on current e-commerce data for ${targetMarket}, the fastest way to scale sales for ${productName} is combining a 1-day WhatsApp Broadcast to existing contacts with a 3-ad Instagram/Facebook carousel showing real customer unboxings and the Cash on Delivery guarantee.`;
        script = `Assalam o alaikum! Limited stock available for the new ${productName}. Order now with 100% Cash on Delivery and doorstep inspection. WhatsApp: +92 300 1234567`;
      }

      setChatMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: answer,
          actionScript: script
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-indigo-500/40 w-full max-w-4xl h-[90vh] max-h-[820px] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white ring-1 ring-white/10">
        
        {/* Modal Header */}
        <div className="p-4 sm:px-6 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-white">SellBoost AI Selling Copilot</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  CEO & Sales Coach Mode
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Active Product: <span className="text-white font-semibold">{productName}</span> • {currency} {Number(price).toLocaleString()} • {targetMarket}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="hidden sm:flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('audit')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'audit' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                Executive Audit
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('tools')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'tools' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                1-Click Sales Tools
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('chat')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'chat' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                Ask Assistant
              </button>
            </div>

            {/* Live Voice Button */}
            {onOpenLiveVoice && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenLiveVoice();
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-300 bg-rose-950/60 hover:bg-rose-900/60 border border-rose-600/60 flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                title="Start Real-Time Voice Conversation (gemini-3.8-live)"
              >
                <Mic className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                <span className="hidden md:inline">Voice Call</span>
              </button>
            )}

            {/* Gemini Multi-turn Chatbot Button */}
            {onOpenGeminiChat && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenGeminiChat();
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-purple-300 bg-purple-950/60 hover:bg-purple-900/60 border border-purple-600/60 flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                title="Open Multi-Turn Gemini Chatbot"
              >
                <Bot className="w-3.5 h-3.5 text-purple-400" />
                <span className="hidden md:inline">Gemini Chat</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="sm:hidden grid grid-cols-3 p-1.5 bg-slate-950 border-b border-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className={`py-2 rounded-lg text-center ${activeTab === 'audit' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          >
            Audit
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tools')}
            className={`py-2 rounded-lg text-center ${activeTab === 'tools' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          >
            1-Click Tools
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('chat')}
            className={`py-2 rounded-lg text-center ${activeTab === 'chat' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          >
            Ask AI
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* TAB 1: EXECUTIVE SALES AUDIT */}
          {activeTab === 'audit' && (
            <div className="space-y-6 animate-in fade-in">
              {/* Executive Summary Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-500/30 shadow-xl">
                <div className="flex items-center gap-2 mb-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Executive Product Diagnostic</span>
                </div>
                <h4 className="text-xl font-extrabold text-white">
                  How to Maximize Conversion for &quot;{productName}&quot;
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                  Based on e-commerce transaction patterns across Pakistan, UAE, and direct-response social brands, here is your high-probability selling strategy:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                    <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Recommended Price Anchor</span>
                    </div>
                    <div className="text-base font-extrabold text-emerald-400 mt-1">
                      {currency} {Number(price).toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Anchor at {currency} {Math.round(price * 1.25).toLocaleString()} with 20% launch discount
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                    <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                      <span>COD Return Shield</span>
                    </div>
                    <div className="text-base font-extrabold text-blue-400 mt-1">
                      Doorstep Inspection
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Reduces parcel rejections by ~42%
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                    <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      <span>Top Sales Channel</span>
                    </div>
                    <div className="text-base font-extrabold text-amber-400 mt-1">
                      WhatsApp + Instagram
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Fastest cashflow with zero website friction
                    </div>
                  </div>
                </div>
              </div>

              {/* 4 Pillars of Conversion */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-sm text-white">The 3-Second Visual Hook</h5>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Do not open your video or ad with your brand logo. Open with extreme sensory close-up (texture, buckle click, or unboxing reveal) to stop Instagram/TikTok scrolling immediately.
                    </p>
                    <button
                      type="button"
                      onClick={() => handleSendQuery(`Write a 15-second viral video hook for ${productName}`)}
                      className="mt-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Generate Visual Hook</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600/30 text-emerald-400 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-sm text-white">The &quot;Price Please&quot; DM Strategy</h5>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      When someone comments &quot;Price&quot;, never reply with just the number. Reply with price + free shipping + immediate question: <em>&quot;Which city are you in so I can check delivery time?&quot;</em>
                    </p>
                    <button
                      type="button"
                      onClick={() => handleSendQuery(`How should I reply to customer asking price for ${productName}?`)}
                      className="mt-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Get Closing Script</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-600/30 text-amber-400 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-sm text-white">Overcoming Trust Deficit</h5>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Sellers in Pakistan & Middle East lose 60% of potential orders due to fear of receiving low quality copies. Feature customer voice notes and unboxing pictures prominently in WhatsApp stories.
                    </p>
                    <button
                      type="button"
                      onClick={() => handleSendQuery(`Generate trust badge and verification script for ${productName}`)}
                      className="mt-2 text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Get Trust Copy</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-600/30 text-purple-400 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-sm text-white">Upsell & Bundle Multiplier</h5>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Offer &quot;Buy 2 and save {currency} 1,000&quot; or pair with a matching cardholder. This boosts average order value by 38% with zero extra customer acquisition cost.
                    </p>
                    <button
                      type="button"
                      onClick={() => handleSendQuery(`Suggest high-profit bundle ideas for ${productName}`)}
                      className="mt-2 text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Get Bundle Formula</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 1-CLICK SALES ACTION TOOLS */}
          {activeTab === 'tools' && (
            <div className="space-y-4 animate-in fade-in">
              <p className="text-xs text-slate-400">
                Click any tool below to instantly generate ready-to-copy sales scripts customized for <strong>{productName}</strong>:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    title: '⚡ Urgent WhatsApp Flash Broadcast',
                    desc: '24-hour urgency message with bolding and emojis ready for WhatsApp lists.',
                    prompt: `Write an urgent 24-hour WhatsApp broadcast message for ${productName} with 15% discount and Cash on Delivery.`
                  },
                  {
                    title: '💬 Objection Solver: "Too Expensive"',
                    desc: 'High-converting polite reply that justifies price and closes the customer.',
                    prompt: `Write a DM reply when a customer says ${productName} at ${currency} ${price} is too expensive.`
                  },
                  {
                    title: '📦 Doorstep COD Verification Script',
                    desc: 'WhatsApp pre-dispatch confirmation message that cuts courier returns by 40%.',
                    prompt: `Write a WhatsApp order confirmation message for Cash on Delivery to stop courier returns for ${productName}.`
                  },
                  {
                    title: '📹 15-Sec Viral Reels / TikTok Script',
                    desc: 'Shot-by-shot visual actions, on-screen text, and voiceover.',
                    prompt: `Write a viral 15-second TikTok script for ${productName} focusing on quality and free COD delivery.`
                  },
                  {
                    title: '🇵🇰 Roman Urdu WhatsApp Closer',
                    desc: 'Natural, friendly Roman Urdu response to close hesitant Pakistani buyers.',
                    prompt: `Write a high-converting Roman Urdu WhatsApp reply to close customer inquiries for ${productName}.`
                  },
                  {
                    title: '🎯 Competitor Comparison Hook',
                    desc: 'Subtle copy highlighting why your item is superior to cheap market alternatives.',
                    prompt: `Write an ad copy explaining why ${productName} is better than cheap market alternatives without naming competitors.`
                  }
                ].map((tool, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setActiveTab('chat');
                      handleSendQuery(tool.prompt);
                    }}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/60 transition-all text-left group cursor-pointer shadow-md hover:scale-[1.01]"
                  >
                    <div className="font-extrabold text-sm text-white group-hover:text-indigo-300 transition-colors">
                      {tool.title}
                    </div>
                    <div className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {tool.desc}
                    </div>
                    <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-indigo-400 group-hover:translate-x-1 transition-transform">
                      <span>Generate Script</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: INTERACTIVE AI SALES CHAT */}
          {activeTab === 'chat' && (
            <div className="space-y-4 animate-in fade-in flex flex-col h-full">
              <div className="space-y-3">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-indigo-600 text-white rounded-tr-xs shadow-md'
                          : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-xs shadow-md'
                      }`}
                    >
                      <div className="whitespace-pre-line font-normal">{msg.text}</div>

                      {/* Action Script Box if present */}
                      {msg.actionScript && (
                        <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-indigo-500/40 text-xs font-mono text-indigo-200 relative group">
                          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[10px] font-sans font-bold text-slate-400 uppercase tracking-wider">
                            <span>Ready-to-Post Script</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(msg.actionScript!, msg.id)}
                              className="px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1 transition-all cursor-pointer"
                            >
                              {copiedId === msg.id ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-300" />
                                  <span>Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy Script</span>
                                </>
                              )}
                            </button>
                          </div>
                          <div className="whitespace-pre-line text-slate-200 select-all font-sans text-xs">
                            {msg.actionScript}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-center gap-2 text-xs text-indigo-400 animate-pulse p-3 bg-slate-950 rounded-2xl max-w-xs border border-slate-800">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing conversion data & formulating script...</span>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Chat Input Bar (Always active at bottom) */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendQuery();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask anything: e.g. How to price this, write a WhatsApp broadcast, or handle customer objections..."
              className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-98 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/30 shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Ask Assistant</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
