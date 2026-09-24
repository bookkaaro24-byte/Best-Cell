import React, { useState } from 'react';
import { 
  MessageSquareText, 
  Copy, 
  Check, 
  Send, 
  Sparkles, 
  HelpCircle, 
  RefreshCw 
} from 'lucide-react';
import { CustomerRepliesData, SellingPackage } from '../../types';
import { copyToClipboard } from '../../utils/exportBundle';

interface TabCustomerRepliesProps {
  replies: CustomerRepliesData;
  productName: string;
  whatsappNumber?: string;
  currentPackage: SellingPackage;
}

const COMMON_QUESTIONS = [
  { key: 'priceInquiry', label: 'Price Inquiry', question: 'How much is this? Price please?' },
  { key: 'availabilityInquiry', label: 'Availability', question: 'Is this available in stock?' },
  { key: 'deliveryTimeInquiry', label: 'Delivery Time', question: 'How long will delivery take?' },
  { key: 'codInquiry', label: 'Cash on Delivery (COD)', question: 'Do you offer Cash on Delivery?' },
  { key: 'discountInquiry', label: 'Discount Request', question: 'Any discount or best price possible?' },
  { key: 'qualityInquiry', label: 'Quality Guarantee', question: 'Is the quality good? Real pictures?' },
  { key: 'returnExchangeInquiry', label: 'Return / Exchange', question: 'What is your exchange policy?' },
  { key: 'sizingInquiry', label: 'Sizing & Dimensions', question: 'What are the exact dimensions or sizes?' },
  { key: 'urgentOrderInquiry', label: 'Urgent Order', question: 'I need this urgently for a gift tomorrow!' },
];

export const TabCustomerReplies: React.FC<TabCustomerRepliesProps> = ({
  replies,
  productName,
  whatsappNumber,
  currentPackage
}) => {
  const [selectedKey, setSelectedKey] = useState<string>('priceInquiry');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Custom inquiry input state
  const [customerMessage, setCustomerMessage] = useState('');
  const [replyTone, setReplyTone] = useState<'sales_closing' | 'friendly' | 'professional' | 'short'>('sales_closing');
  const [replyLang, setReplyLang] = useState<'english' | 'urdu' | 'roman_urdu'>('roman_urdu');
  const [isGeneratingCustom, setIsGeneratingCustom] = useState(false);
  const [customReplyResult, setCustomReplyResult] = useState<string | null>(null);

  const activeReplyText = replies[selectedKey] || replies.priceInquiry || "Yes, available! Please share your delivery address to place the order.";

  const handleCopy = async (key: string, text: string) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const handleGenerateCustomReply = async () => {
    if (!customerMessage.trim()) return;
    setIsGeneratingCustom(true);
    try {
      const res = await fetch('/api/generate-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerMessage,
          productPackage: currentPackage,
          tone: replyTone,
          language: replyLang
        })
      });

      const data = await res.json();
      if (data.reply) {
        setCustomReplyResult(data.reply);
      } else {
        alert(data.error || 'Could not generate reply');
      }
    } catch (err: any) {
      alert('Error generating reply: ' + err.message);
    } finally {
      setIsGeneratingCustom(false);
    }
  };

  const shareToWhatsApp = (text: string) => {
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquareText className="w-5 h-5 text-indigo-600" />
            <span>Customer Response Generator & DM Closer</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Turn WhatsApp & Instagram DMs into confirmed orders in seconds.
          </p>
        </div>
      </div>

      {/* Two Columns: Common Library & Custom AI DM Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Quick Question Library (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-3">
              Top 9 Common Buyer Questions
            </span>

            {/* Questions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              {COMMON_QUESTIONS.map((q) => (
                <button
                  key={q.key}
                  onClick={() => setSelectedKey(q.key)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                    selectedKey === q.key
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="font-bold">{q.label}</div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">"{q.question}"</div>
                </button>
              ))}
            </div>

            {/* Selected Reply Preview */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-indigo-600 dark:text-indigo-400">
                  Recommended Ready Response:
                </span>
                <button
                  onClick={() => handleCopy('lib-reply', activeReplyText)}
                  className="text-slate-500 hover:text-indigo-600 flex items-center gap-1 text-xs"
                >
                  {copiedKey === 'lib-reply' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'lib-reply' ? "Copied!" : "Copy"}</span>
                </button>
              </div>

              <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                {activeReplyText}
              </p>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => shareToWhatsApp(activeReplyText)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5"
                >
                  <Send className="w-3 h-3" />
                  <span>Send to WhatsApp</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Right: Custom Inquiry AI Answerer (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-1">
                Custom Customer Inquiry Generator
              </span>
              <p className="text-xs text-slate-500">
                Paste any customer's DM and AI will draft an instant response grounded in this product's specs.
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Paste Customer Message:
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Bhai is it genuine leather? Can you deliver to Lahore by Wednesday for Rs 15000?"
                value={customerMessage}
                onChange={(e) => setCustomerMessage(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>

            {/* Tone & Language selectors */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Tone:</label>
                <select
                  value={replyTone}
                  onChange={(e) => setReplyTone(e.target.value as any)}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                >
                  <option value="sales_closing">Sales Closing (High Conversion)</option>
                  <option value="friendly">Friendly & Polite</option>
                  <option value="professional">Formal Professional</option>
                  <option value="short">Short & Punchy</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Language:</label>
                <select
                  value={replyLang}
                  onChange={(e) => setReplyLang(e.target.value as any)}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                >
                  <option value="roman_urdu">Roman Urdu (Most Popular)</option>
                  <option value="english">English</option>
                  <option value="urdu">Urdu (اردو)</option>
                </select>
              </div>
            </div>

            {/* Generate Action */}
            <button
              onClick={handleGenerateCustomReply}
              disabled={isGeneratingCustom || !customerMessage.trim()}
              className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isGeneratingCustom ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Drafting Reply...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Customized Reply</span>
                </>
              )}
            </button>

            {/* Custom Reply Output */}
            {customReplyResult && (
              <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                  <span>Generated Tailored Reply:</span>
                  <button
                    onClick={() => handleCopy('custom-res', customReplyResult)}
                    className="hover:underline flex items-center gap-1"
                  >
                    {copiedKey === 'custom-res' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'custom-res' ? "Copied!" : "Copy"}</span>
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-100 whitespace-pre-wrap leading-relaxed">
                  {customReplyResult}
                </p>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    onClick={() => shareToWhatsApp(customReplyResult)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5"
                  >
                    <Send className="w-3 h-3" />
                    <span>Send via WhatsApp</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};
