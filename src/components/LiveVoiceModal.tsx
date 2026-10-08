import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  X, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  PhoneOff, 
  RotateCcw,
  Zap,
  ShoppingBag,
  TrendingUp,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { float32ToPcm16Base64, LiveAudioPlayer } from '../utils/audioStream';
import { ProductInput } from '../types';

interface LiveVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  productInfo?: ProductInput;
  productName?: string;
  onOpenChatbot?: () => void;
}

export const LiveVoiceModal: React.FC<LiveVoiceModalProps> = ({
  isOpen,
  onClose,
  productInfo,
  productName = 'Your Product',
  onOpenChatbot
}) => {
  const [connectionStatus, setConnectionStatus] = useState<
    'connecting' | 'connected' | 'speaking' | 'listening' | 'error' | 'disconnected'
  >('connecting');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  const wsRef = useRef<WebSocket | null>(null);
  const audioPlayerRef = useRef<LiveAudioPlayer | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const isMutedRef = useRef(false);

  isMutedRef.current = isMuted;

  // Initialize and tear down voice session
  useEffect(() => {
    if (!isOpen) {
      cleanup();
      return;
    }

    startLiveSession();

    return () => {
      cleanup();
    };
  }, [isOpen]);

  const cleanup = () => {
    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch (_) {}
      wsRef.current = null;
    }
    if (audioPlayerRef.current) {
      audioPlayerRef.current.close();
      audioPlayerRef.current = null;
    }
    if (scriptProcessorRef.current) {
      try {
        scriptProcessorRef.current.disconnect();
      } catch (_) {}
      scriptProcessorRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (_) {}
      audioContextRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    setConnectionStatus('disconnected');
    setAudioLevel(0);
  };

  const startLiveSession = async () => {
    setConnectionStatus('connecting');
    setErrorMessage(null);

    try {
      // 1. Setup Audio Player for 24kHz model voice output
      audioPlayerRef.current = new LiveAudioPlayer();

      // 2. Connect to server WebSocket at /live
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/live`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = async () => {
        // Send initial product context so Gemini 3.8 Live has the seller's active product
        const initialGreeting = {
          text: `The seller is active. Product name: "${productName}". Target market: "${productInfo?.targetMarket || 'Pakistan'}". Currency: "${productInfo?.currency || 'PKR'}". Price: "${productInfo?.price || '2500'}". Greet the seller warmly in one short sentence and ask how to help boost sales today.`
        };
        ws.send(JSON.stringify(initialGreeting));
        setConnectionStatus('connected');

        // Start microphone capture at 16kHz
        await initMicrophone(ws);
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);

          if (msg.error) {
            setErrorMessage(msg.error);
            setConnectionStatus('error');
            return;
          }

          if (msg.interrupted) {
            audioPlayerRef.current?.stopAndClear();
            setConnectionStatus('listening');
            return;
          }

          if (msg.audio) {
            setConnectionStatus('speaking');
            audioPlayerRef.current?.playChunk(msg.audio);
          }
        } catch (err) {
          console.error('Failed to parse WS message:', err);
        }
      };

      ws.onerror = (e) => {
        console.error('Live WebSocket error:', e);
        setErrorMessage('Failed to connect to Live API server. Ensure microphone permissions are allowed.');
        setConnectionStatus('error');
      };

      ws.onclose = () => {
        setConnectionStatus('disconnected');
      };
    } catch (err: any) {
      console.error('Error starting live voice session:', err);
      setErrorMessage(err.message || 'Microphone or WebSocket error');
      setConnectionStatus('error');
    }
  };

  const initMicrophone = async (ws: WebSocket) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          channelCount: 1, 
          echoCancellation: true, 
          noiseSuppression: true 
        } 
      });
      mediaStreamRef.current = stream;

      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtxClass({ sampleRate: 16000 });
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const processor = audioCtx.createScriptProcessor(4096, 1, 1);
      scriptProcessorRef.current = processor;

      processor.onaudioprocess = (e) => {
        if (isMutedRef.current || ws.readyState !== WebSocket.OPEN) return;

        const inputData = e.inputBuffer.getChannelData(0);
        
        // Calculate volume level for UI visualizer
        let sum = 0;
        for (let i = 0; i < inputData.length; i++) {
          sum += Math.abs(inputData[i]);
        }
        const avg = sum / inputData.length;
        setAudioLevel(Math.min(100, Math.round(avg * 400)));

        const base64Pcm = float32ToPcm16Base64(inputData);
        ws.send(JSON.stringify({ audio: base64Pcm }));
      };

      source.connect(processor);
      processor.connect(audioCtx.destination);
      setConnectionStatus('listening');
    } catch (err: any) {
      console.error('Microphone capture error:', err);
      setErrorMessage('Microphone access denied or unavailable: ' + err.message);
      setConnectionStatus('error');
    }
  };

  const handleSendPromptText = (text: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    audioPlayerRef.current?.stopAndClear();
    wsRef.current.send(JSON.stringify({ text }));
    setConnectionStatus('listening');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-indigo-500/40 w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white ring-1 ring-white/10">
        
        {/* Header */}
        <div className="p-4 sm:px-6 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <Mic className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-white">Live Voice Sales Coach</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                  gemini-3.8-live
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-Time Voice Conversation • {productName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenChatbot && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenChatbot();
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-300 bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-700/60 flex items-center gap-1.5 transition-all cursor-pointer"
                title="Switch to Text Chatbot"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Text Chat</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close Live Session"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Visualizer & Orb Stage */}
        <div className="p-8 sm:p-12 flex flex-col items-center justify-center relative overflow-hidden bg-radial from-indigo-950/40 via-slate-900 to-slate-950">
          
          {/* Animated Glow Rings */}
          <div className="relative flex items-center justify-center my-4">
            <div 
              className={`absolute w-48 h-48 sm:w-56 sm:h-56 rounded-full transition-all duration-300 ${
                connectionStatus === 'speaking'
                  ? 'bg-indigo-500/30 scale-125 blur-xl animate-pulse'
                  : connectionStatus === 'listening'
                  ? 'bg-rose-500/25 scale-110 blur-lg'
                  : 'bg-slate-700/20 scale-95 blur-md'
              }`} 
            />

            {/* Ripple ring based on mic audio level */}
            <div 
              className="absolute rounded-full border border-indigo-400/40 transition-all duration-100 pointer-events-none"
              style={{
                width: `${160 + audioLevel * 1.2}px`,
                height: `${160 + audioLevel * 1.2}px`,
                opacity: audioLevel > 5 ? 0.8 : 0.2
              }}
            />

            {/* Central Orb */}
            <div className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full flex flex-col items-center justify-center p-4 text-center z-10 shadow-2xl transition-all duration-500 border border-white/20 ${
              connectionStatus === 'speaking'
                ? 'bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 ring-4 ring-indigo-400/50 scale-105'
                : connectionStatus === 'listening'
                ? 'bg-gradient-to-tr from-rose-600 via-amber-600 to-indigo-600 ring-4 ring-rose-400/40'
                : connectionStatus === 'connecting'
                ? 'bg-slate-800 ring-2 ring-slate-700 animate-pulse'
                : 'bg-slate-800 ring-2 ring-slate-700'
            }`}>
              {connectionStatus === 'speaking' ? (
                <>
                  <Volume2 className="w-10 h-10 text-white animate-bounce" />
                  <span className="text-xs font-black tracking-wider uppercase mt-2 text-white">Speaking...</span>
                </>
              ) : connectionStatus === 'listening' ? (
                <>
                  <Mic className="w-10 h-10 text-white animate-pulse" />
                  <span className="text-xs font-black tracking-wider uppercase mt-2 text-white">Listening...</span>
                </>
              ) : connectionStatus === 'connecting' ? (
                <>
                  <Sparkles className="w-10 h-10 text-amber-300 animate-spin" />
                  <span className="text-xs font-bold text-slate-300 mt-2">Connecting...</span>
                </>
              ) : (
                <>
                  <MicOff className="w-10 h-10 text-slate-400" />
                  <span className="text-xs font-bold text-slate-400 mt-2">Paused</span>
                </>
              )}
            </div>
          </div>

          {/* Status badge */}
          <div className="mt-4 flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${
              connectionStatus === 'speaking'
                ? 'bg-indigo-400 animate-ping'
                : connectionStatus === 'listening'
                ? 'bg-emerald-400 animate-pulse'
                : connectionStatus === 'connecting'
                ? 'bg-amber-400 animate-spin'
                : 'bg-rose-400'
            }`} />
            <span className="text-xs font-medium text-slate-300 capitalize">
              {connectionStatus === 'speaking'
                ? 'Coach is answering with real-time audio'
                : connectionStatus === 'listening'
                ? 'Speak now — microphone is streaming to gemini-3.8-live'
                : connectionStatus === 'connecting'
                ? 'Initializing Live WebSocket session...'
                : 'Connection inactive'}
            </span>
          </div>

          {errorMessage && (
            <div className="mt-3 p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-center gap-2 max-w-md">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Instant Sales Topic Prompts */}
          <div className="mt-6 w-full max-w-lg">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-2.5">
              Or tap a sales challenge to ask live:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleSendPromptText(`Give me a punchy 15-second elevator pitch to sell ${productName}.`)}
                className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-indigo-900/40 border border-slate-700 hover:border-indigo-500/50 text-left transition-all cursor-pointer flex items-center gap-2 group"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="truncate">"15-second pitch for my product"</span>
              </button>

              <button
                type="button"
                onClick={() => handleSendPromptText(`A customer says "${productName}" is too expensive. How do I reply without lowering my price?`)}
                className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-indigo-900/40 border border-slate-700 hover:border-indigo-500/50 text-left transition-all cursor-pointer flex items-center gap-2 group"
              >
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="truncate">"Handling 'price is too high'"</span>
              </button>

              <button
                type="button"
                onClick={() => handleSendPromptText(`What is the most viral TikTok and Reels hook I can film for ${productName}?`)}
                className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-indigo-900/40 border border-slate-700 hover:border-indigo-500/50 text-left transition-all cursor-pointer flex items-center gap-2 group"
              >
                <Sparkles className="w-3.5 h-3.5 text-pink-400 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="truncate">"Viral TikTok video hook"</span>
              </button>

              <button
                type="button"
                onClick={() => handleSendPromptText(`How do I prevent customers from cancelling Cash on Delivery orders at delivery for ${productName}?`)}
                className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-indigo-900/40 border border-slate-700 hover:border-indigo-500/50 text-left transition-all cursor-pointer flex items-center gap-2 group"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-sky-400 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="truncate">"Stop COD parcel rejections"</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Call Controls */}
        <div className="p-4 sm:px-6 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {/* Mute Button */}
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-2 text-xs font-bold ${
                isMuted
                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 hover:bg-rose-500/30'
                  : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
              }`}
              title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
            >
              {isMuted ? <MicOff className="w-4 h-4 text-rose-400" /> : <Mic className="w-4 h-4 text-emerald-400" />}
              <span>{isMuted ? 'Unmute Mic' : 'Mute Mic'}</span>
            </button>

            {/* Reconnect button */}
            <button
              type="button"
              onClick={startLiveSession}
              className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
              title="Restart session"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reconnect</span>
            </button>
          </div>

          {/* End Call Button */}
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-rose-600/30 cursor-pointer active:scale-95 transition-all"
          >
            <PhoneOff className="w-4 h-4" />
            <span>End Call</span>
          </button>
        </div>

      </div>
    </div>
  );
};
