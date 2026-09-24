import React, { useState } from 'react';
import { 
  Globe2, 
  Copy, 
  Check, 
  MessageSquare, 
  Instagram, 
  Send 
} from 'lucide-react';
import { MultilingualData } from '../../types';
import { copyToClipboard } from '../../utils/exportBundle';

interface TabMultilingualProps {
  multilingual: MultilingualData;
  productName: string;
}

type LangTab = 'urdu' | 'romanUrdu' | 'arabic' | 'english';

export const TabMultilingual: React.FC<TabMultilingualProps> = ({
  multilingual,
  productName
}) => {
  const [activeLang, setActiveLang] = useState<LangTab>('urdu');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = async (key: string, text: string) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const getLangData = () => {
    switch (activeLang) {
      case 'urdu':
        return {
          title: "اردو (Urdu - Nastaliq Script)",
          isRtl: true,
          fontClass: "font-urdu text-base leading-loose",
          data: multilingual.urdu
        };
      case 'romanUrdu':
        return {
          title: "Roman Urdu (Phonetic English Alphabet)",
          isRtl: false,
          fontClass: "font-sans text-sm leading-relaxed",
          data: multilingual.romanUrdu
        };
      case 'arabic':
        return {
          title: "العربية (Arabic)",
          isRtl: true,
          fontClass: "font-sans text-base leading-relaxed",
          data: multilingual.arabic
        };
      case 'english':
      default:
        return {
          title: "English",
          isRtl: false,
          fontClass: "font-sans text-sm leading-relaxed",
          data: multilingual.english
        };
    }
  };

  const activeInfo = getLangData();

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-indigo-600" />
            <span>Multilingual Marketing Copy</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Native Urdu script, conversational Roman Urdu for WhatsApp buyers, and high-converting Arabic.
          </p>
        </div>

        {/* Language Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            onClick={() => setActiveLang('urdu')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeLang === 'urdu'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            اردو (Urdu)
          </button>

          <button
            onClick={() => setActiveLang('romanUrdu')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeLang === 'romanUrdu'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Roman Urdu
          </button>

          <button
            onClick={() => setActiveLang('arabic')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeLang === 'arabic'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            العربية (Arabic)
          </button>

          <button
            onClick={() => setActiveLang('english')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeLang === 'english'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            English
          </button>
        </div>
      </div>

      {/* Language Card */}
      <div 
        dir={activeInfo.isRtl ? 'rtl' : 'ltr'} 
        className="space-y-6"
      >
        {/* Title & Short Description */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              {activeInfo.title}
            </span>
            <button
              onClick={() => handleCopy('lang-title', `${activeInfo.data.title}\n\n${activeInfo.data.shortDescription}`)}
              className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1"
            >
              {copiedKey === 'lang-title' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'lang-title' ? "Copied!" : "Copy Title & Summary"}</span>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold text-slate-400 block mb-1">
                {activeInfo.isRtl ? "پروڈکٹ کا نام / عنوان" : "Product Title"}
              </span>
              <h4 className={`font-bold text-slate-900 dark:text-white ${activeInfo.fontClass}`}>
                {activeInfo.data.title}
              </h4>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-400 block mb-1">
                {activeInfo.isRtl ? "مختصر تفصیل" : "Short Description"}
              </span>
              <p className={`text-slate-700 dark:text-slate-200 ${activeInfo.fontClass}`}>
                {activeInfo.data.shortDescription}
              </p>
            </div>
          </div>

        </div>

        {/* WhatsApp & Instagram in selected language */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* WhatsApp Message */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4" />
                  <span>{activeInfo.isRtl ? "واٹس ایپ پیغام" : "WhatsApp Broadcast Message"}</span>
                </span>
                <button
                  onClick={() => handleCopy('lang-wa', activeInfo.data.whatsappMessage)}
                  className="text-xs font-semibold text-slate-500 hover:text-emerald-600 flex items-center gap-1"
                >
                  {copiedKey === 'lang-wa' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy</span>
                </button>
              </div>

              <div className={`p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 text-slate-800 dark:text-slate-200 whitespace-pre-wrap ${activeInfo.fontClass}`}>
                {activeInfo.data.whatsappMessage}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => {
                  const text = encodeURIComponent(activeInfo.data.whatsappMessage);
                  window.open(`https://wa.me/?text=${text}`, '_blank');
                }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-1.5"
              >
                <Send className="w-3 h-3" />
                <span>Share to WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Instagram Caption */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-900/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                  <Instagram className="w-4 h-4" />
                  <span>{activeInfo.isRtl ? "انسٹاگرام کیپشن" : "Instagram Caption"}</span>
                </span>
                <button
                  onClick={() => handleCopy('lang-insta', activeInfo.data.instagramCaption)}
                  className="text-xs font-semibold text-slate-500 hover:text-purple-600 flex items-center gap-1"
                >
                  {copiedKey === 'lang-insta' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy</span>
                </button>
              </div>

              <div className={`p-4 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 text-slate-800 dark:text-slate-200 whitespace-pre-wrap ${activeInfo.fontClass}`}>
                {activeInfo.data.instagramCaption}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
              Formatted with emojis and hashtags for social engagement.
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
