import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2, Loader2 } from 'lucide-react';

interface GenerationProgressModalProps {
  isOpen: boolean;
  productName?: string;
}

const STEPS = [
  { id: 1, label: "Analyzing product & visual cues", tip: "Extracting color palette, silhouette, and textures..." },
  { id: 2, label: "Creating product description", tip: "Crafting 3 title variations, bullet points, and benefits..." },
  { id: 3, label: "Creating captions & social media copy", tip: "Writing Instagram, Facebook, TikTok, and WhatsApp messages..." },
  { id: 4, label: "Creating advertisements (5 angles)", tip: "Generating Product-focused, Lifestyle, and Offer variations..." },
  { id: 5, label: "Creating marketplace listings", tip: "Tailoring listings for Shopify, Daraz, and Facebook Marketplace..." },
  { id: 6, label: "Creating poster concepts & visual studio", tip: "Formatting promotional poster templates & badges..." },
  { id: 7, label: "Creating customer responses & FAQs", tip: "Drafting smart answers for top customer questions..." },
  { id: 8, label: "Preparing campaign package", tip: "Finalizing multilingual translations in Urdu, Roman Urdu, Arabic..." }
];

export const GenerationProgressModal: React.FC<GenerationProgressModalProps> = ({
  isOpen,
  productName
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < STEPS.length) return prev + 1;
        return prev;
      });
    }, 1800);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const progressPercent = Math.round((currentStep / STEPS.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 overflow-hidden relative">
        
        {/* Top Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center mb-4 shadow-inner">
            <Sparkles className="w-7 h-7 animate-pulse" />
          </div>
          <h3 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white">
            Building Your Selling Campaign
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {productName ? `Creating complete sales toolkit for "${productName}"` : "Turning your product photo into a multi-channel campaign"}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
            <span>Progress</span>
            <span className="text-indigo-600 dark:text-indigo-400">{progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Pipeline Steps */}
        <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
          {STEPS.map((step) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;

            return (
              <div
                key={step.id}
                className={`p-2.5 rounded-xl border transition-all flex items-center gap-3 ${
                  isCurrent
                    ? 'border-indigo-300 dark:border-indigo-700 bg-indigo-50/50 dark:bg-indigo-950/30'
                    : isCompleted
                    ? 'border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/20 opacity-80'
                    : 'border-transparent text-slate-400 dark:text-slate-600'
                }`}
              >
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : isCurrent ? (
                    <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
                  ) : (
                    <span className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700 text-[10px] font-bold flex items-center justify-center">
                      {step.id}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold truncate ${
                    isCurrent 
                      ? 'text-slate-900 dark:text-white font-bold' 
                      : isCompleted 
                      ? 'text-slate-700 dark:text-slate-300' 
                      : 'text-slate-400 dark:text-slate-500'
                  }`}>
                    {step.label}
                  </p>
                  {isCurrent && (
                    <p className="text-[11px] text-indigo-600 dark:text-indigo-400 truncate mt-0.5">
                      {step.tip}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500">
          Powered by Gemini Vision & AI Architecture • Please wait a few moments...
        </div>

      </div>
    </div>
  );
};
