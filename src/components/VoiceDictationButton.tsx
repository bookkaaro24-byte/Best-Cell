import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, AlertCircle, Sparkles, Check } from 'lucide-react';

export interface VoiceDictationButtonProps {
  onTranscript: (newText: string, isFinal: boolean) => void;
  currentValue?: string;
  fieldLabel?: string;
  className?: string;
  defaultLang?: string;
  size?: 'sm' | 'md';
}

export const VoiceDictationButton: React.FC<VoiceDictationButtonProps> = ({
  onTranscript,
  fieldLabel = 'field',
  className = '',
  size = 'sm'
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startRecording = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setError(null);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setIsTranscribing(true);
        try {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            try {
              const base64Audio = reader.result as string;
              const res = await fetch('/api/transcribe-audio', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  audioData: base64Audio,
                  mimeType: 'audio/webm'
                })
              });

              if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || 'Transcription failed');
              }

              const data = await res.json();
              if (data.transcription && data.transcription.trim()) {
                onTranscript(data.transcription.trim(), true);
              }
            } catch (err: any) {
              console.error('Transcription error with gemini-3.5-transcribe:', err);
              setError(err.message || 'Transcription error');
            } finally {
              setIsTranscribing(false);
            }
          };
        } catch (err: any) {
          console.error('Failed to process recorded audio:', err);
          setError(err.message || 'Audio processing error');
          setIsTranscribing(false);
        } finally {
          if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
          }
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err: any) {
      console.error('Microphone error:', err);
      setError(err.message || 'Microphone access denied');
    }
  };

  const stopRecording = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className={`relative inline-flex items-center gap-1 ${className}`}>
      {/* Speech Button */}
      <button
        type="button"
        onClick={isRecording ? stopRecording : startRecording}
        title={
          isRecording
            ? `Recording for ${fieldLabel}... Click to transcribe with gemini-3.5-transcribe`
            : isTranscribing
            ? `Transcribing with gemini-3.5-transcribe...`
            : `Click to dictate ${fieldLabel} using gemini-3.5-transcribe`
        }
        className={`relative rounded-lg flex items-center justify-center transition-all cursor-pointer select-none active:scale-95 ${
          size === 'sm' ? 'w-7 h-7 p-1' : 'w-8 h-8 p-1.5'
        } ${
          isRecording
            ? 'bg-rose-500 text-white shadow-md shadow-rose-500/40 ring-2 ring-rose-400/60 animate-pulse'
            : isTranscribing
            ? 'bg-amber-500/20 text-amber-500 ring-1 ring-amber-400/50 animate-pulse'
            : 'text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800'
        }`}
      >
        {isRecording ? (
          <>
            <Mic className="w-3.5 h-3.5 animate-bounce" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
            </span>
          </>
        ) : isTranscribing ? (
          <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-500" />
        ) : (
          <Mic className="w-3.5 h-3.5" />
        )}
      </button>

      {/* Model Tag */}
      <span
        title="Powered by gemini-3.5-transcribe"
        className="hidden sm:inline-block px-1 py-0.2 rounded text-[9px] font-mono font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60"
      >
        AI
      </span>

      {/* Transcribing indicator tooltip */}
      {isTranscribing && (
        <div className="absolute left-0 bottom-full mb-1.5 px-2 py-0.5 bg-slate-900 text-amber-300 text-[10px] rounded-md shadow-lg border border-amber-500/40 whitespace-nowrap z-50 pointer-events-none flex items-center gap-1">
          <Sparkles className="w-3 h-3 animate-spin" />
          <span>Transcribing via gemini-3.5-transcribe...</span>
        </div>
      )}

      {/* Recording indicator tooltip */}
      {isRecording && (
        <div className="absolute left-0 bottom-full mb-1.5 px-2 py-0.5 bg-rose-950 text-rose-200 text-[10px] rounded-md shadow-lg border border-rose-800 whitespace-nowrap z-50 pointer-events-none flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
          <span>Listening... Click mic to transcribe</span>
        </div>
      )}

      {/* Error notice */}
      {error && (
        <div
          className="absolute left-0 bottom-full mb-1 px-2 py-1 bg-rose-900/90 text-rose-200 text-[10px] rounded shadow-lg border border-rose-700 whitespace-nowrap z-50 flex items-center gap-1"
          title={error}
        >
          <AlertCircle className="w-3 h-3 text-rose-300 shrink-0" />
          <span className="truncate max-w-[180px]">{error}</span>
        </div>
      )}
    </div>
  );
};
