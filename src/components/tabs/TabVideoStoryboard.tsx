import React, { useState, useEffect } from 'react';
import { 
  Video, 
  Play, 
  Pause, 
  Volume2, 
  Copy, 
  Check, 
  Clock, 
  Film, 
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { VideoScriptData, VideoStoryboardScene } from '../../types';
import { copyToClipboard } from '../../utils/exportBundle';

interface TabVideoStoryboardProps {
  videoData: VideoScriptData;
  productImage: string;
  productName: string;
}

export const TabVideoStoryboard: React.FC<TabVideoStoryboardProps> = ({
  videoData,
  productImage,
  productName
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const scenes = videoData.scenes || [];
  const currentScene = scenes[currentSceneIndex] || scenes[0];

  const handleCopy = async (key: string, text: string) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  // Browser SpeechSynthesis playback for voiceover preview
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (!isPlaying) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      return;
    }

    if (currentSceneIndex >= scenes.length) {
      setIsPlaying(false);
      setCurrentSceneIndex(0);
      return;
    }

    const scene = scenes[currentSceneIndex];
    if (scene) {
      speakText(scene.voiceover);
      const timer = setTimeout(() => {
        if (currentSceneIndex < scenes.length - 1) {
          setCurrentSceneIndex((prev) => prev + 1);
        } else {
          setIsPlaying(false);
          setCurrentSceneIndex(0);
        }
      }, (scene.durationSeconds || 3) * 1000);

      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentSceneIndex, scenes]);

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    } else {
      setIsPlaying(true);
    }
  };

  const getFullScriptText = () => {
    return `VIDEO CONCEPT: ${videoData.videoConcept}
HOOK (FIRST 3s): ${videoData.hook}
DURATION: ${videoData.duration}s (${videoData.aspectRatio})

SCENE BREAKDOWN:
${scenes.map((s) => `[Scene ${s.sceneNumber} - ${s.durationSeconds}s] (${s.shotType})
Visual: ${s.visualPrompt}
Voiceover: "${s.voiceover}"
Text On Screen: ${s.onScreenText}
`).join('\n')}
CTA: ${videoData.cta}`;
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
            <Video className="w-5 h-5 text-indigo-600" />
            <span>Short Video Storyboard & Script (Reels / TikTok)</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Designed to capture attention in the first 3 seconds and drive purchase intent.
          </p>
        </div>

        <button
          onClick={() => handleCopy('video-script', getFullScriptText())}
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 flex items-center gap-1.5"
        >
          {copiedKey === 'video-script' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedKey === 'video-script' ? "Copied Script!" : "Copy Full Script"}</span>
        </button>
      </div>

      {/* Overview Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40">
          <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase block mb-1">
            3-Second Attention Hook
          </span>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            "{videoData.hook}"
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
            Format & Timing
          </span>
          <p className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <span>{videoData.duration} Seconds</span>
            <span className="text-slate-300">•</span>
            <span>{videoData.aspectRatio} Vertical</span>
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
            Call to Action
          </span>
          <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
            {videoData.cta}
          </p>
        </div>
      </div>

      {/* Two Column: Live Player Simulator & Scene By Scene List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Mobile Video Screen Simulator (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-xs aspect-9/16 rounded-3xl bg-slate-950 overflow-hidden relative border-4 border-slate-800 shadow-2xl flex flex-col justify-between p-4">
            
            {/* Background simulated visual */}
            <div className="absolute inset-0 z-0">
              <img
                src={productImage}
                alt="Storyboard visual"
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover opacity-60 transition-all duration-700 ${
                  isPlaying ? 'scale-105' : 'scale-100'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
            </div>

            {/* Top Scene indicator */}
            <div className="relative z-10 flex items-center justify-between text-white text-xs">
              <span className="px-2.5 py-1 rounded-full bg-black/60 font-bold backdrop-blur-xs">
                Scene {currentScene?.sceneNumber} of {scenes.length}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-indigo-600 font-semibold text-[10px]">
                {currentScene?.durationSeconds}s ({currentScene?.shotType})
              </span>
            </div>

            {/* Center: On-Screen Text Graphic */}
            <div className="relative z-10 text-center px-4 my-auto">
              <div className="inline-block bg-slate-900/90 text-white font-extrabold text-sm sm:text-base px-4 py-2 rounded-xl shadow-lg border border-white/20 backdrop-blur-xs animate-bounce">
                {currentScene?.onScreenText}
              </div>
            </div>

            {/* Bottom: Voiceover subtitle */}
            <div className="relative z-10 space-y-3">
              <div className="p-3 rounded-xl bg-black/70 backdrop-blur-md text-white text-xs leading-relaxed border border-white/10">
                <span className="text-[10px] text-amber-400 font-bold block mb-0.5 flex items-center gap-1">
                  <Volume2 className="w-3 h-3" /> Voiceover Script:
                </span>
                "{currentScene?.voiceover}"
              </div>

              {/* Player Controls */}
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={togglePlay}
                  className="w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5 fill-current" />}
                </button>

                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentSceneIndex(0);
                    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                  }}
                  className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
                  title="Restart storyboard"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          <p className="text-xs text-slate-400 mt-3 text-center">
            Click Play to test speech voiceover & scene transitions in real time.
          </p>
        </div>

        {/* Right: Scene by Scene Breakdown (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
            Shot-by-Shot Director's Guide ({scenes.length} Scenes)
          </span>

          {scenes.map((scene, idx) => (
            <div
              key={idx}
              onClick={() => {
                setCurrentSceneIndex(idx);
                speakText(scene.voiceover);
              }}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                currentSceneIndex === idx
                  ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                  Scene {scene.sceneNumber} • {scene.shotType}
                </span>
                <span className="text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {scene.durationSeconds}s
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="text-slate-600 dark:text-slate-300">
                  <strong className="text-slate-800 dark:text-white">Visual: </strong> {scene.visualPrompt}
                </div>
                <div className="text-slate-600 dark:text-slate-300">
                  <strong className="text-slate-800 dark:text-white">Voiceover: </strong> "{scene.voiceover}"
                </div>
                <div className="text-indigo-600 dark:text-indigo-400 font-medium">
                  <strong>On-Screen Text: </strong> "{scene.onScreenText}"
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
