import React, { useState } from 'react';
import { 
  Megaphone, 
  Copy, 
  Check, 
  Edit3, 
  Sparkles, 
  ThumbsUp, 
  MessageCircle, 
  Share2, 
  MoreHorizontal 
} from 'lucide-react';
import { AdVariation } from '../../types';
import { copyToClipboard } from '../../utils/exportBundle';

interface TabAdVariationsProps {
  ads: AdVariation[];
  productImage: string;
  brandName?: string;
  productPrice?: number;
  currency?: string;
}

export const TabAdVariations: React.FC<TabAdVariationsProps> = ({
  ads,
  productImage,
  brandName = "Shop Official",
  productPrice,
  currency = "PKR"
}) => {
  const [selectedAdIndex, setSelectedAdIndex] = useState(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [editingAd, setEditingAd] = useState<AdVariation | null>(null);
  const [localAds, setLocalAds] = useState<AdVariation[]>(ads);

  const activeAd = localAds[selectedAdIndex] || localAds[0];

  const handleCopy = async (key: string, text: string) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const saveEdit = () => {
    if (!editingAd) return;
    const updated = [...localAds];
    updated[selectedAdIndex] = editingAd;
    setLocalAds(updated);
    setEditingAd(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-indigo-600" />
            <span>High-Converting Ad Variations (5 Strategic Angles)</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Tested ad structures designed for Meta (Facebook & Instagram) ads and TikTok promotions.
          </p>
        </div>

        <button
          onClick={() => setEditingAd({ ...activeAd })}
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 flex items-center gap-1.5"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit Active Angle</span>
        </button>
      </div>

      {/* 5 Angle Pill Selector */}
      <div className="flex flex-wrap gap-2">
        {localAds.map((ad, i) => (
          <button
            key={i}
            onClick={() => setSelectedAdIndex(i)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              selectedAdIndex === i
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
            <span>{ad.angle}</span>
          </button>
        ))}
      </div>

      {/* Two Column: Ad Details & Live Social Feed Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Copy & Breakdown (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {activeAd.angle} Angle
              </span>

              <button
                onClick={() => handleCopy(`ad-${selectedAdIndex}`, `HEADLINE: ${activeAd.headline}\n\nPRIMARY TEXT:\n${activeAd.primaryText}\n\nCALL TO ACTION: ${activeAd.cta}`)}
                className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1"
              >
                {copiedKey === `ad-${selectedAdIndex}` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === `ad-${selectedAdIndex}` ? "Copied All!" : "Copy Full Ad"}</span>
              </button>
            </div>

            {editingAd ? (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">Headline</label>
                  <input
                    type="text"
                    value={editingAd.headline}
                    onChange={(e) => setEditingAd({ ...editingAd, headline: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">Primary Text</label>
                  <textarea
                    rows={6}
                    value={editingAd.primaryText}
                    onChange={(e) => setEditingAd({ ...editingAd, primaryText: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">Call To Action Button</label>
                  <input
                    type="text"
                    value={editingAd.cta}
                    onChange={(e) => setEditingAd({ ...editingAd, cta: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditingAd(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveEdit}
                    className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg"
                  >
                    Apply Edits
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Headline */}
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-1">
                    <span>Ad Headline (Meta / Facebook)</span>
                    <button
                      onClick={() => handleCopy('hl', activeAd.headline)}
                      className="hover:text-indigo-600"
                    >
                      {copiedKey === 'hl' ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                    {activeAd.headline}
                  </h4>
                </div>

                {/* Primary Text */}
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-1">
                    <span>Primary Text / Post Body</span>
                    <button
                      onClick={() => handleCopy('pt', activeAd.primaryText)}
                      className="hover:text-indigo-600"
                    >
                      {copiedKey === 'pt' ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                    {activeAd.primaryText}
                  </p>
                </div>

                {/* CTA */}
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <span className="text-xs font-semibold text-slate-400 block">Button Action</span>
                    <span className="inline-block mt-1 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-lg border border-indigo-200 dark:border-indigo-800">
                      {activeAd.cta}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Best Placement</span>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      Facebook / Instagram Feed & Reels
                    </span>
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

        {/* Right: Live Meta Sponsored Ad Simulator (5 cols) */}
        <div className="lg:col-span-5">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden max-w-sm mx-auto">
            
            {/* Ad Header */}
            <div className="p-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                  {(brandName || "Brand").charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-xs text-slate-900 dark:text-white leading-tight">
                    {brandName || "Brand"}
                  </div>
                  <div className="text-[10px] text-slate-400">Sponsored • Paid Partnership</div>
                </div>
              </div>
              <MoreHorizontal className="w-4 h-4 text-slate-400" />
            </div>

            {/* Ad Primary Text Preview */}
            <div className="px-3 pt-2.5 pb-2 text-xs text-slate-800 dark:text-slate-200 line-clamp-3 leading-snug">
              {activeAd.primaryText}
            </div>

            {/* Product Image */}
            <div className="aspect-square w-full bg-slate-100 dark:bg-slate-950 relative overflow-hidden">
              <img
                src={productImage}
                alt="Sponsored Product"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {productPrice && (
                <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-slate-900/90 text-white text-xs font-bold backdrop-blur-xs">
                  {currency} {productPrice.toLocaleString()}
                </div>
              )}
            </div>

            {/* Ad Bottom Bar with Headline and CTA */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/80 flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800">
              <div className="min-w-0 flex-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block truncate">
                  officialstore.com
                </span>
                <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
                  {activeAd.headline}
                </p>
              </div>

              <button className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 shadow-xs shrink-0">
                {activeAd.cta}
              </button>
            </div>

            {/* Social Engagement Fake Stats */}
            <div className="px-3 py-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <ThumbsUp className="w-3.5 h-3.5 text-blue-500 fill-blue-500" /> 1.4K
              </span>
              <div className="flex gap-3">
                <span>128 Comments</span>
                <span>84 Shares</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
