import React, { useState } from 'react';
import { 
  Instagram, 
  Facebook, 
  MessageSquare, 
  Copy, 
  Check, 
  Send, 
  Hash, 
  Sparkles,
  Share2
} from 'lucide-react';
import { SocialMediaData } from '../../types';
import { copyToClipboard } from '../../utils/exportBundle';

interface TabSocialMediaProps {
  socialData: SocialMediaData;
  productName: string;
  whatsappNumber?: string;
}

type SocialChannel = 'instagram' | 'whatsapp' | 'facebook' | 'tiktok';

export const TabSocialMedia: React.FC<TabSocialMediaProps> = ({
  socialData,
  productName,
  whatsappNumber
}) => {
  const [activeChannel, setActiveChannel] = useState<SocialChannel>('whatsapp');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedInstaIndex, setSelectedInstaIndex] = useState(0);
  const [whatsappTone, setWhatsappTone] = useState<'friendly' | 'professional' | 'premium' | 'urgent' | 'casual'>('friendly');

  const handleCopy = async (key: string, text: string) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const getActiveWhatsAppMessage = () => {
    if (socialData.whatsapp?.toneVariations && socialData.whatsapp.toneVariations[whatsappTone]) {
      return socialData.whatsapp.toneVariations[whatsappTone];
    }
    return socialData.whatsapp?.promotionalMessage || "";
  };

  const openWhatsAppDirect = () => {
    const text = encodeURIComponent(getActiveWhatsAppMessage());
    const cleanNum = whatsappNumber?.replace(/[^0-9]/g, '') || "";
    const url = cleanNum ? `https://wa.me/${cleanNum}?text=${text}` : `https://wa.me/?text=${text}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* Platform Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl max-w-fit">
        <button
          onClick={() => setActiveChannel('whatsapp')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
            activeChannel === 'whatsapp'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>WhatsApp (One-Tap Share)</span>
        </button>

        <button
          onClick={() => setActiveChannel('instagram')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
            activeChannel === 'instagram'
              ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
          }`}
        >
          <Instagram className="w-4 h-4" />
          <span>Instagram</span>
        </button>

        <button
          onClick={() => setActiveChannel('facebook')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
            activeChannel === 'facebook'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
          }`}
        >
          <Facebook className="w-4 h-4" />
          <span>Facebook Ads</span>
        </button>

        <button
          onClick={() => setActiveChannel('tiktok')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
            activeChannel === 'tiktok'
              ? 'bg-slate-900 dark:bg-slate-700 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>TikTok Hook</span>
        </button>
      </div>

      {/* WHATSAPP VIEW */}
      {activeChannel === 'whatsapp' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/60 shadow-xs">
            
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4" />
                  <span>Ready-To-Send WhatsApp Broadcast & Direct Message</span>
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  One-tap copy or instant send to customer chats, groups, and status updates.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy('whatsapp', getActiveWhatsAppMessage())}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 flex items-center gap-1.5"
                >
                  {copiedKey === 'whatsapp' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'whatsapp' ? "Copied Message!" : "Copy Text"}</span>
                </button>

                <button
                  onClick={openWhatsAppDirect}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-sm shadow-emerald-600/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send via WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Tone Selector */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                Select Message Tone:
              </label>
              <div className="flex flex-wrap gap-2">
                {(['friendly', 'professional', 'premium', 'urgent', 'casual'] as const).map((tone) => (
                  <button
                    key={tone}
                    onClick={() => setWhatsappTone(tone)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                      whatsappTone === tone
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {tone}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Bubble Simulator */}
            <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/40">
              <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xs max-w-xl border border-slate-200 dark:border-slate-700 whitespace-pre-wrap text-sm text-slate-800 dark:text-slate-100 leading-relaxed font-sans">
                {getActiveWhatsAppMessage()}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* INSTAGRAM VIEW */}
      {activeChannel === 'instagram' && (
        <div className="space-y-6">
          
          {/* Captions */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Instagram Captions (3 Angles)
              </span>
              <button
                onClick={() => handleCopy('insta-cap', socialData.instagram.captions[selectedInstaIndex])}
                className="text-xs font-semibold text-slate-500 hover:text-purple-600 flex items-center gap-1"
              >
                {copiedKey === 'insta-cap' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'insta-cap' ? "Copied!" : "Copy Selected Caption"}</span>
              </button>
            </div>

            {/* Caption Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
              {socialData.instagram.captions.map((cap, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedInstaIndex(i)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                    selectedInstaIndex === i
                      ? 'border-purple-600 bg-purple-50/60 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Angle {i + 1}: {i === 0 ? "Storytelling" : i === 1 ? "Aesthetic / Minimal" : "Direct Offer"}
                </button>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 whitespace-pre-wrap text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
              {socialData.instagram.captions[selectedInstaIndex]}
            </div>
          </div>

          {/* Hashtags */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <Hash className="w-3.5 h-3.5" />
                <span>Niche & High-Reach Instagram Hashtags (20 Tags)</span>
              </span>
              <button
                onClick={() => handleCopy('insta-tags', socialData.instagram.hashtags.join(' '))}
                className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1"
              >
                {copiedKey === 'insta-tags' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'insta-tags' ? "Copied All Tags!" : "Copy All"}</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {socialData.instagram.hashtags.map((tag, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono"
                >
                  {tag.startsWith('#') ? tag : `#${tag}`}
                </span>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* FACEBOOK VIEW */}
      {activeChannel === 'facebook' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Short Ad */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Short Facebook Ad / Feed Post
                </span>
                <button
                  onClick={() => handleCopy('fb-short', socialData.facebook.shortAd)}
                  className="text-xs font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1"
                >
                  {copiedKey === 'fb-short' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy</span>
                </button>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                {socialData.facebook.shortAd}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500">
              CTA: {socialData.facebook.cta || "Shop Now"}
            </div>
          </div>

          {/* Long Ad */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Long Persuasive Facebook Ad
                </span>
                <button
                  onClick={() => handleCopy('fb-long', socialData.facebook.longAd)}
                  className="text-xs font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1"
                >
                  {copiedKey === 'fb-long' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy</span>
                </button>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                {socialData.facebook.longAd}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500">
              CTA: {socialData.facebook.cta || "Learn More / Order"}
            </div>
          </div>

        </div>
      )}

      {/* TIKTOK VIEW */}
      {activeChannel === 'tiktok' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>TikTok Viral Hook & Concept</span>
              </span>
              <button
                onClick={() => handleCopy('tiktok-hook', `Hook: ${socialData.tiktok.hook}\nConcept: ${socialData.tiktok.videoConcept}\nCaption: ${socialData.tiktok.shortCaption}`)}
                className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1"
              >
                {copiedKey === 'tiktok-hook' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Script</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50">
                <span className="text-[11px] font-bold uppercase text-amber-800 dark:text-amber-300 block mb-1">
                  First 3-Seconds Hook (Stops Scrolling)
                </span>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  "{socialData.tiktok.hook}"
                </p>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-500 block mb-1">
                  Video Concept / Visual Flow
                </span>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {socialData.tiktok.videoConcept}
                </p>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-500 block mb-1">
                  Post Caption & Hashtags
                </span>
                <p className="text-sm text-slate-700 dark:text-slate-300 font-mono">
                  {socialData.tiktok.shortCaption} {socialData.tiktok.hashtags.join(' ')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
