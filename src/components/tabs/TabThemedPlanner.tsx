import React, { useState } from 'react';
import { 
  Calendar, 
  Sparkles, 
  Copy, 
  Check, 
  RefreshCw, 
  Clock, 
  Target, 
  MessageSquare, 
  Instagram, 
  Share2, 
  Layers, 
  Tag, 
  Compass, 
  ChevronRight,
  Flame,
  CheckCircle2,
  Send
} from 'lucide-react';
import { 
  ThemedCampaignPlan, 
  ThemedDayPlan, 
  ThemeDuration, 
  SellingPackage 
} from '../../types';

interface TabThemedPlannerProps {
  sellingPackage: SellingPackage;
  onUpdatePackage?: (pkg: SellingPackage) => void;
}

const PRESET_THEMES = [
  "VIP Product Launch & Early Bird Hype",
  "Problem Agitation & Solution Transformation",
  "Authority, Trust & Rapid Client Bookings",
  "Customer Case Study & Social Proof Showcase",
  "Flash Sale & Limited Stock Urgency",
  "Behind the Scenes & Craftsmanship Story",
  "Holiday & Festive Season Rush"
];

export const TabThemedPlanner: React.FC<TabThemedPlannerProps> = ({
  sellingPackage,
  onUpdatePackage
}) => {
  const [selectedDuration, setSelectedDuration] = useState<ThemeDuration>(
    sellingPackage.themedPlan?.duration || '7_days'
  );
  const [selectedTheme, setSelectedTheme] = useState<string>(
    sellingPackage.themedPlan?.themeTitle || (sellingPackage.productInfo.businessType === 'service' ? "Authority, Trust & Rapid Client Bookings" : "VIP Product Launch & Early Bird Hype")
  );
  const [customThemeInput, setCustomThemeInput] = useState('');
  const [isCustomThemeOpen, setIsCustomThemeOpen] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [copiedDay, setCopiedDay] = useState<number | null>(null);
  const [activeDayFilter, setActiveDayFilter] = useState<'all' | number>('all');

  const pName = sellingPackage.productInfo.name || sellingPackage.analysis.productType;
  const isService = sellingPackage.productInfo.businessType === 'service';

  const plan: ThemedCampaignPlan = sellingPackage.themedPlan || {
    themeTitle: selectedTheme,
    themeTagline: `High-Impact Sales & Engagement Sprint for ${pName}`,
    duration: selectedDuration,
    targetGoal: "Accelerate customer inquiries, WhatsApp orders, and brand authority",
    keyAudiencePainPoint: "Overcoming purchase hesitation and demonstrating verified value",
    calendarNotes: "Post consistently across Instagram, TikTok, and WhatsApp. Follow up with inquiries within 10 minutes.",
    dailyPlans: []
  };

  const handleRegeneratePlan = async (durationOverride?: ThemeDuration, themeOverride?: string) => {
    setIsRegenerating(true);
    const durationToUse = durationOverride || selectedDuration;
    const themeToUse = isCustomThemeOpen && customThemeInput.trim() 
      ? customThemeInput.trim() 
      : (themeOverride || selectedTheme);

    try {
      const res = await fetch('/api/generate-themed-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme: themeToUse,
          duration: durationToUse,
          productInfo: sellingPackage.productInfo,
          analysis: sellingPackage.analysis,
          isService: isService
        })
      });

      if (res.ok) {
        const json = await res.json();
        if (json.themedPlan && onUpdatePackage) {
          onUpdatePackage({
            ...sellingPackage,
            themedPlan: json.themedPlan
          });
        }
      }
    } catch (err) {
      console.error("Failed to generate themed plan:", err);
    } finally {
      setIsRegenerating(false);
    }
  };

  const copyDayContent = (day: ThemedDayPlan) => {
    const text = `📅 ${day.dayTitle} (${day.funnelStage} Stage | ${day.primaryPlatform})
🔥 Hook: ${day.hook}

📝 Suggested Post Copy:
${day.suggestedPostCopy}

🎨 Visual Direction: ${day.visualDirection}
🎯 Call to Action: ${day.callToAction}
🔑 Keywords: ${day.recommendedKeywords.join(', ')}
🏷️ Hashtags: ${day.recommendedHashtags.join(' ')}`;

    navigator.clipboard.writeText(text);
    setCopiedDay(day.dayNumber);
    setTimeout(() => setCopiedDay(null), 2000);
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Awareness':
        return 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'Consideration':
        return 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'Engagement':
        return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'Social Proof':
        return 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'Urgency':
        return 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      case 'Conversion':
        return 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  const displayedDays = activeDayFilter === 'all' 
    ? plan.dailyPlans 
    : plan.dailyPlans.filter(d => d.dayNumber === activeDayFilter);

  return (
    <div className="space-y-8">
      {/* Header & Campaign Theme Control Card */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <Calendar className="w-5 h-5 text-amber-400" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                1-Week or 2-Weeks Single-Theme Marketing Engine
              </span>
            </div>

            {/* Duration Selector Toggle */}
            <div className="flex items-center p-1 rounded-xl bg-white/10 border border-white/10">
              <button
                type="button"
                onClick={() => {
                  setSelectedDuration('7_days');
                  handleRegeneratePlan('7_days');
                }}
                disabled={isRegenerating}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedDuration === '7_days'
                    ? 'bg-amber-400 text-slate-900 shadow-xs'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                ⚡ 1 Week (7 Days)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedDuration('14_days');
                  handleRegeneratePlan('14_days');
                }}
                disabled={isRegenerating}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedDuration === '14_days'
                    ? 'bg-amber-400 text-slate-900 shadow-xs'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                🚀 2 Weeks (14 Days)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-500/30 inline-block mb-2">
                Unifying Theme
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
                {plan.themeTitle}
              </h2>
              <p className="text-amber-300/90 text-sm font-medium mt-1">
                "{plan.themeTagline}"
              </p>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-indigo-300 font-semibold block mb-0.5 flex items-center gap-1">
                    <Target className="w-3.5 h-3.5" /> Campaign Target Goal:
                  </span>
                  <span className="text-white/90">{plan.targetGoal}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-indigo-300 font-semibold block mb-0.5 flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5" /> Core Objection Solved:
                  </span>
                  <span className="text-white/90">{plan.keyAudiencePainPoint}</span>
                </div>
              </div>
            </div>

            {/* Theme Customizer Box */}
            <div className="lg:col-span-4 bg-white/5 backdrop-blur-xs border border-white/10 rounded-2xl p-5 space-y-3">
              <label className="text-xs font-bold text-indigo-200 uppercase tracking-wider block">
                Change Campaign Theme:
              </label>

              <select
                value={isCustomThemeOpen ? 'CUSTOM' : selectedTheme}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'CUSTOM') {
                    setIsCustomThemeOpen(true);
                  } else {
                    setIsCustomThemeOpen(false);
                    setSelectedTheme(val);
                  }
                }}
                className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-amber-400"
              >
                {PRESET_THEMES.map((theme, i) => (
                  <option key={i} value={theme} className="bg-slate-900 text-white">
                    {theme}
                  </option>
                ))}
                <option value="CUSTOM" className="bg-slate-900 text-amber-300">
                  ✨ Custom Theme...
                </option>
              </select>

              {isCustomThemeOpen && (
                <input
                  type="text"
                  placeholder="e.g. Ramadan Special / Wedding Season Glow..."
                  value={customThemeInput}
                  onChange={(e) => setCustomThemeInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/10 border border-amber-400/40 text-white placeholder-indigo-300/50 text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                />
              )}

              <button
                type="button"
                onClick={() => handleRegeneratePlan()}
                disabled={isRegenerating}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-900 active:scale-98 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-md"
              >
                {isRegenerating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Planning Campaign...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-slate-900" />
                    <span>Generate Themed Roadmap</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Ambient glow */}
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Strategic Execution Notes Banner */}
      {plan.calendarNotes && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
          <Flame className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block mb-0.5">Campaign Master Execution Rule:</span>
            <span>{plan.calendarNotes}</span>
          </div>
        </div>
      )}

      {/* Day Selector Quick Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveDayFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeDayFilter === 'all'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
          }`}
        >
          All {plan.dailyPlans.length} Days
        </button>
        {plan.dailyPlans.map((d) => (
          <button
            key={d.dayNumber}
            type="button"
            onClick={() => setActiveDayFilter(d.dayNumber)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeDayFilter === d.dayNumber
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <span>Day {d.dayNumber}</span>
          </button>
        ))}
      </div>

      {/* Daily Roadmap Cards Grid */}
      <div className="space-y-6">
        {displayedDays.map((day) => {
          const isCopied = copiedDay === day.dayNumber;
          return (
            <div
              key={day.dayNumber}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700 transition-all space-y-5"
            >
              {/* Card Header: Day, Stage, Channel, Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="w-9 h-9 rounded-2xl bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center shadow-xs">
                    {day.dayNumber}
                  </span>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      {day.dayTitle}
                    </h3>
                  </div>
                  
                  {/* Funnel Stage Badge */}
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStageColor(day.funnelStage)}`}>
                    {day.funnelStage} Funnel
                  </span>

                  {/* Channel Badge */}
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Share2 className="w-3 h-3 text-indigo-500" />
                    <span>{day.primaryPlatform}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyDayContent(day)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 transition-all flex items-center gap-1.5"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? "Copied Day Plan!" : "Copy Full Day Copy"}</span>
                  </button>
                </div>
              </div>

              {/* Hook Banner */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-transparent border border-amber-500/20">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block mb-0.5">
                  Opening Hook (First 3 Seconds)
                </span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {day.hook}
                </p>
              </div>

              {/* Content Concept & Suggested Post Copy */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Left: Suggested Post Copy (7 cols) */}
                <div className="lg:col-span-7 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Ready-to-Publish Post Script / Caption:
                    </label>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(day.suggestedPostCopy);
                        setCopiedDay(day.dayNumber);
                        setTimeout(() => setCopiedDay(null), 2000);
                      }}
                      className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" /> Copy Caption
                    </button>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 font-mono text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {day.suggestedPostCopy}
                  </div>
                </div>

                {/* Right: Visual Direction & Action (5 cols) */}
                <div className="lg:col-span-5 space-y-4">
                  {/* Visual Creative Direction */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                      Visual Direction & Creative Asset Guide:
                    </label>
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {day.visualDirection}
                    </div>
                  </div>

                  {/* Call to Action */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                      Primary Call to Action:
                    </label>
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
                      <Send className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{day.callToAction}</span>
                    </div>
                  </div>

                  {/* Targeted Keywords & Hashtags */}
                  <div className="space-y-2 pt-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Keywords:</span>
                      {day.recommendedKeywords.map((kw, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                          {kw}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Hashtags:</span>
                      {day.recommendedHashtags.map((ht, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {ht}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
