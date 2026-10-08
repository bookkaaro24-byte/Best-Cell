import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Mic, 
  MicOff, 
  Copy, 
  Check, 
  Trash2, 
  Bot, 
  User, 
  Zap, 
  Brain, 
  Flame, 
  ShieldCheck, 
  PhoneCall, 
  ShoppingBag,
  TrendingUp,
  MessageSquare,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { ProductInput } from '../types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  modelUsed?: string;
  timestamp: string;
}

interface GeminiChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
  productInfo?: ProductInput;
  productName?: string;
  onOpenLiveVoice?: () => void;
}

type ChatRole = 'ceo_strategist' | 'copywriter' | 'cod_closer' | 'customer_support';
type GeminiModelType = 'gemini-3.1-pro-preview' | 'gemini-3.5-flash' | 'gemini-3.1-flash-lite';

const ROLES: { id: ChatRole; title: string; subtitle: string; icon: React.FC<{ className?: string }>; badge: string }[] = [
  {
    id: 'ceo_strategist',
    title: 'CEO & Sales Strategist',
    subtitle: 'Pricing, margins, launch roadmaps & commercial leverage',
    icon: Sparkles,
    badge: 'Executive'
  },
  {
    id: 'copywriter',
    title: 'Ad & Social Copywriter',
    subtitle: 'High-converting hooks, captions, TikTok scripts & WhatsApp copy',
    icon: Flame,
    badge: 'Creative'
  },
  {
    id: 'cod_closer',
    title: 'COD & WhatsApp Closer',
    subtitle: 'Handling price objections, doorstep verification & chat sales',
    icon: ShoppingBag,
    badge: 'Conversion'
  },
  {
    id: 'customer_support',
    title: '24/7 Support Rep',
    subtitle: 'Empathetic replies for order status, refunds & product inquiries',
    icon: ShieldCheck,
    badge: 'Support'
  }
];

const MODELS: { id: GeminiModelType; name: string; tag: string; description: string; icon: React.FC<{ className?: string }> }[] = [
  {
    id: 'gemini-3.5-flash',
    name: 'Gemini 3.5 Flash',
    tag: 'General Tasks',
    description: 'Balanced speed and high-fidelity generation',
    icon: Zap
  },
  {
    id: 'gemini-3.1-pro-preview',
    name: 'Gemini 3.1 Pro',
    tag: 'Complex Reasoning',
    description: 'In-depth commercial math, multi-channel strategy & complex prompts',
    icon: Brain
  },
  {
    id: 'gemini-3.1-flash-lite',
    name: 'Gemini 3.1 Flash-Lite',
    tag: 'Ultra Fast',
    description: 'Near-instant spitfire ideas, quick hooks & headlines',
    icon: Flame
  }
];

export const GeminiChatbotModal: React.FC<GeminiChatbotModalProps> = ({
  isOpen,
  onClose,
  productInfo,
  productName = 'Your Product',
  onOpenLiveVoice
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-init',
      role: 'assistant',
      text: `👋 Hello! I am your SellBoost Gemini Selling Copilot. I'm configured to help you sell **${productName}** with maximum conversion and margin. What sales or marketing challenge can I solve with you right now?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [selectedRole, setSelectedRole] = useState<ChatRole>('ceo_strategist');
  const [selectedModel, setSelectedModel] = useState<GeminiModelType>('gemini-3.5-flash');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Audio transcription recording state using gemini-3.5-transcribe
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = (customPrompt || inputText).trim();
    if (!textToSend || isLoading) return;

    const userMessage: Message = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    if (!customPrompt) setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            text: m.text
          })),
          model: selectedModel,
          role: selectedRole,
          productContext: {
            name: productName,
            category: productInfo?.category,
            price: productInfo?.price,
            currency: productInfo?.currency,
            targetMarket: productInfo?.targetMarket
          }
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await res.json();
      const assistantMessage: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        text: data.reply || 'No response returned from model.',
        modelUsed: data.modelUsed || selectedModel,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMessage: Message = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        text: `⚠️ **Error:** ${err.message || 'Could not connect to Gemini model. Please try again.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Audio transcription using gemini-3.5-transcribe
  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setIsTranscribing(true);
        try {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            const base64Audio = reader.result as string;
            const res = await fetch('/api/transcribe-audio', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                audioData: base64Audio,
                mimeType: 'audio/webm'
              })
            });

            if (res.ok) {
              const data = await res.json();
              if (data.transcription) {
                setInputText((prev) => (prev ? `${prev} ${data.transcription}` : data.transcription));
              }
            }
            setIsTranscribing(false);
          };
        } catch (err) {
          console.error('Transcription error:', err);
          setIsTranscribing(false);
        } finally {
          stream.getTracks().forEach((track) => track.stop());
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err: any) {
      console.error('Mic access error for transcription:', err);
      alert('Microphone permission required for transcription: ' + err.message);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'msg-init-cleared',
        role: 'assistant',
        text: `New conversation started with **${ROLES.find((r) => r.id === selectedRole)?.title}** using **${selectedModel}**. How can I assist you with "${productName}"?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  if (!isOpen) return null;

  const currentRoleObj = ROLES.find((r) => r.id === selectedRole) || ROLES[0];
  const RoleIcon = currentRoleObj.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-indigo-500/40 w-full max-w-4xl h-[90vh] max-h-[840px] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white ring-1 ring-white/10">
        
        {/* Top Header */}
        <div className="p-4 sm:px-6 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <RoleIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-white">SellBoost Gemini Copilot</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  Multi-Turn Chat
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 truncate max-w-sm sm:max-w-md">
                Active Product: <span className="text-white font-semibold">{productName}</span> • {currentRoleObj.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Live Voice CTA button */}
            {onOpenLiveVoice && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenLiveVoice();
                }}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-rose-300 bg-rose-950/60 hover:bg-rose-900/60 border border-rose-600/60 flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                title="Switch to Real-Time Voice Conversation (gemini-3.8-live)"
              >
                <PhoneCall className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                <span className="hidden sm:inline">Voice Call (Live API)</span>
                <span className="sm:hidden">Voice</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleClearHistory}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Clear conversation history"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close Chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sub-Header: Role & Model Configuration Bar */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          
          {/* Role Switcher */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Role:</span>
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              {ROLES.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRole(role.id)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                    selectedRole === role.id
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                  title={role.subtitle}
                >
                  {role.badge}
                </button>
              ))}
            </div>
          </div>

          {/* Model Switcher */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Model:</span>
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              {MODELS.map((model) => (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => setSelectedModel(model.id)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1 ${
                    selectedModel === model.id
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                  title={`${model.name} — ${model.description}`}
                >
                  <model.icon className="w-3 h-3" />
                  <span>{model.tag}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Scrollable Conversation Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs ${
                    isUser
                      ? 'bg-indigo-600'
                      : 'bg-gradient-to-tr from-purple-600 to-indigo-600 border border-white/20'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed border transition-all ${
                    isUser
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                      : 'bg-slate-800/90 text-slate-100 border-slate-700 shadow-sm'
                  }`}
                >
                  {/* Model & Time metadata for AI messages */}
                  {!isUser && (
                    <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-700/60 text-[10px] text-slate-400">
                      <div className="flex items-center gap-1.5 font-bold text-indigo-300">
                        <Sparkles className="w-3 h-3" />
                        <span>{msg.modelUsed || selectedModel}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>{msg.timestamp}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(msg.text, msg.id)}
                          className="hover:text-white transition-colors cursor-pointer"
                          title="Copy message"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Message Body */}
                  <div className="whitespace-pre-wrap font-sans">
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3 max-w-xl mr-auto animate-pulse">
              <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="rounded-2xl p-4 bg-slate-800/90 border border-slate-700 text-xs text-slate-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400 animate-spin" />
                <span>{selectedModel} is thinking and drafting reply...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Suggestion Prompts */}
        <div className="px-4 sm:px-6 py-2 bg-slate-950/70 border-t border-slate-800/80 overflow-x-auto flex items-center gap-2 text-xs scrollbar-none shrink-0">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0">Quick Ask:</span>
          <button
            type="button"
            onClick={() => handleSendMessage(`Write 3 high-converting hooks for an Instagram carousel featuring ${productName}.`)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] whitespace-nowrap cursor-pointer transition-colors"
          >
            🔥 3 Instagram Hooks
          </button>
          <button
            type="button"
            onClick={() => handleSendMessage(`Draft a psychological WhatsApp broadcast message offering a 24-hour deal on ${productName}.`)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] whitespace-nowrap cursor-pointer transition-colors"
          >
            💬 WhatsApp Flash Sale
          </button>
          <button
            type="button"
            onClick={() => handleSendMessage(`How do I respond to a customer asking "What is the final discount price?" for ${productName}?`)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] whitespace-nowrap cursor-pointer transition-colors"
          >
            💰 Discount Objection Script
          </button>
          <button
            type="button"
            onClick={() => handleSendMessage(`Calculate the break-even ROAS and recommended COD pricing buffer for ${productName}.`)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] whitespace-nowrap cursor-pointer transition-colors"
          >
            📊 ROAS & Margin Math
          </button>
        </div>

        {/* Input Bar with Audio Transcription using gemini-3.5-transcribe */}
        <div className="p-4 sm:px-6 bg-slate-950 border-t border-slate-800 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* Audio Transcription Mic Button (gemini-3.5-transcribe) */}
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className={`p-3 rounded-2xl border transition-all cursor-pointer relative shrink-0 ${
                isRecording
                  ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                  : isTranscribing
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
              title={
                isRecording
                  ? 'Recording audio... click to transcribe with gemini-3.5-transcribe'
                  : isTranscribing
                  ? 'Transcribing audio with gemini-3.5-transcribe...'
                  : 'Record voice to transcribe with gemini-3.5-transcribe'
              }
            >
              {isRecording ? (
                <MicOff className="w-5 h-5 text-white" />
              ) : isTranscribing ? (
                <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
              ) : (
                <Mic className="w-5 h-5 text-slate-300" />
              )}
              {isRecording && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-400 animate-ping" />
              )}
            </button>

            {/* Text Input */}
            <div className="relative flex-1">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  isRecording
                    ? 'Recording your voice... tap red mic to transcribe with gemini-3.5-transcribe'
                    : isTranscribing
                    ? 'Transcribing speech using gemini-3.5-transcribe...'
                    : `Ask ${currentRoleObj.title} anything about selling ${productName}...`
                }
                disabled={isLoading}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {isTranscribing && (
                <span className="absolute right-3 top-3 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                  gemini-3.5-transcribe
                </span>
              )}
            </div>

            {/* Send Button */}
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-lg shadow-indigo-600/30 active:scale-95"
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Audio transcription badge indicator */}
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <Mic className="w-3 h-3 text-indigo-400" />
              <span>Voice input transcribed via <span className="font-semibold text-slate-400">gemini-3.5-transcribe</span></span>
            </div>
            <div>
              <span>Role: <strong className="text-slate-400">{currentRoleObj.title}</strong></span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
