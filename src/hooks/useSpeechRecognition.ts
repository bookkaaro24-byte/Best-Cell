import { useState, useEffect, useRef, useCallback } from 'react';

export interface SpeechRecognitionHookOptions {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
}

export function useSpeechRecognition(defaultOptions: SpeechRecognitionHookOptions = {}) {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const optionsRef = useRef<SpeechRecognitionHookOptions>(defaultOptions);
  optionsRef.current = defaultOptions;

  useEffect(() => {
    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      setIsSupported(true);
    } else {
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, []);

  const startListening = useCallback((overrideOptions?: Partial<SpeechRecognitionHookOptions>) => {
    setError(null);
    setTranscript('');
    setInterimTranscript('');

    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      const err = "Web Speech API is not supported in this browser. Try Chrome, Edge, or Safari.";
      setError(err);
      if (optionsRef.current.onError) optionsRef.current.onError(err);
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      const mergedOptions = { ...optionsRef.current, ...overrideOptions };
      recognition.continuous = mergedOptions.continuous ?? true;
      recognition.interimResults = mergedOptions.interimResults ?? true;
      recognition.lang = mergedOptions.lang || 'en-US';

      let accumulatedFinal = '';

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const res = event.results[i];
          const text = res[0]?.transcript || '';
          if (res.isFinal) {
            accumulatedFinal += text + ' ';
            setTranscript(accumulatedFinal.trim());
            if (mergedOptions.onResult) {
              mergedOptions.onResult(text.trim(), true);
            }
          } else {
            currentInterim += text;
          }
        }
        setInterimTranscript(currentInterim);
        if (currentInterim && mergedOptions.onResult) {
          mergedOptions.onResult(currentInterim, false);
        }
      };

      recognition.onerror = (event: any) => {
        // "no-speech" or "aborted" are normal lifecycle states
        if (event.error === 'no-speech') {
          return;
        }
        if (event.error === 'aborted') {
          setIsListening(false);
          return;
        }
        const errMsg = event.error === 'not-allowed'
          ? 'Microphone permission denied. Please allow microphone access in your browser settings.'
          : `Speech recognition error: ${event.error}`;
        setError(errMsg);
        setIsListening(false);
        if (mergedOptions.onError) {
          mergedOptions.onError(errMsg);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
        if (mergedOptions.onEnd) {
          mergedOptions.onEnd();
        }
      };

      recognition.start();
    } catch (err: any) {
      console.warn("Failed to start speech recognition:", err);
      setError(err?.message || "Failed to start microphone.");
      setIsListening(false);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    }
    setIsListening(false);
    setInterimTranscript('');
  }, []);

  const toggleListening = useCallback((overrideOptions?: Partial<SpeechRecognitionHookOptions>) => {
    if (isListening) {
      stopListening();
    } else {
      startListening(overrideOptions);
    }
  }, [isListening, startListening, stopListening]);

  return {
    isSupported,
    isListening,
    transcript,
    interimTranscript,
    error,
    startListening,
    stopListening,
    toggleListening
  };
}
