import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Edit3, 
  Sparkles, 
  CheckCircle2, 
  Volume2, 
  RefreshCw 
} from 'lucide-react';
import { ProductDescriptionData } from '../../types';
import { copyToClipboard } from '../../utils/exportBundle';

interface TabDescriptionProps {
  description: ProductDescriptionData;
  onUpdateDescription: (updated: ProductDescriptionData) => void;
  onRegenerateField?: (field: string) => void;
}

export const TabDescription: React.FC<TabDescriptionProps> = ({
  description,
  onUpdateDescription
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedTitleIndex, setSelectedTitleIndex] = useState(0);
  const [selectedCtaIndex, setSelectedCtaIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(description);

  const handleCopy = async (key: string, text: string) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const handleSaveEdit = () => {
    onUpdateDescription(editForm);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header with actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">
            Product Description & Value Proposition
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Optimized for e-commerce listings, high conversion rates, and SEO clarity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (isEditing) handleSaveEdit();
              else {
                setEditForm(description);
                setIsEditing(true);
              }
            }}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? "Save Edits" : "Edit Text"}</span>
          </button>
        </div>
      </div>

      {isEditing ? (
        /* Edit Mode Form */
        <div className="space-y-4 bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Short Description
            </label>
            <textarea
              rows={3}
              value={editForm.shortDescription}
              onChange={(e) => setEditForm({ ...editForm, shortDescription: e.target.value })}
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Description
            </label>
            <textarea
              rows={6}
              value={editForm.fullDescription}
              onChange={(e) => setEditForm({ ...editForm, fullDescription: e.target.value })}
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      ) : (
        /* Normal View */
        <div className="space-y-6">
          
          {/* 3 Title Variations */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Product Title (3 Variations)
              </span>
              <button
                onClick={() => handleCopy('title', description.titleVariations[selectedTitleIndex])}
                className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1"
              >
                {copiedKey === 'title' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'title' ? "Copied!" : "Copy Title"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {description.titleVariations.map((title, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedTitleIndex(i)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedTitleIndex === i
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-slate-900 dark:text-white'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1">
                    <span>Variation {i + 1} {i === 0 ? '(SEO Rich)' : i === 1 ? '(Luxury / Brand)' : '(Social Media)'}</span>
                    {selectedTitleIndex === i && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
                  </div>
                  <p className="text-sm font-semibold leading-snug">
                    {title}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Short & Full Description */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Short Description (5 cols) */}
            <div className="md:col-span-5 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Short Hook Description
                  </span>
                  <button
                    onClick={() => handleCopy('short', description.shortDescription)}
                    className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1"
                  >
                    {copiedKey === 'short' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'short' ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  {description.shortDescription}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                Ideal for Instagram bio, WhatsApp preview snippet, or top of product page.
              </div>
            </div>

            {/* Full Description (7 cols) */}
            <div className="md:col-span-7 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Full E-Commerce Description
                </span>
                <button
                  onClick={() => handleCopy('full', description.fullDescription)}
                  className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1"
                >
                  {copiedKey === 'full' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'full' ? "Copied!" : "Copy"}</span>
                </button>
              </div>
              <div className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                {description.fullDescription}
              </div>
            </div>

          </div>

          {/* Key Features & Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Features */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Key Features (Grounded & Factual)
                </span>
                <button
                  onClick={() => handleCopy('features', description.keyFeatures.join('\n'))}
                  className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1"
                >
                  {copiedKey === 'features' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'features' ? "Copied!" : "Copy"}</span>
                </button>
              </div>
              <ul className="space-y-2">
                {description.keyFeatures.map((f, i) => (
                  <li key={i} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 mt-2 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Customer Benefits (Value to Buyer)
                </span>
                <button
                  onClick={() => handleCopy('benefits', description.benefits.join('\n'))}
                  className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1"
                >
                  {copiedKey === 'benefits' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'benefits' ? "Copied!" : "Copy"}</span>
                </button>
              </div>
              <ul className="space-y-2">
                {description.benefits.map((b, i) => (
                  <li key={i} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Call to Actions */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-3">
              Call to Action Choices (Select or Copy)
            </span>
            <div className="flex flex-wrap gap-2.5">
              {description.callToActionOptions.map((cta, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedCtaIndex(i);
                    handleCopy(`cta-${i}`, cta);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
                    selectedCtaIndex === i
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>{cta}</span>
                  {copiedKey === `cta-${i}` ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3 h-3 text-slate-400" />
                  )}
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
