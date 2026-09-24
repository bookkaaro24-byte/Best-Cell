import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Download, 
  Copy, 
  Check, 
  Share2, 
  Package, 
  Sparkles, 
  Printer, 
  ExternalLink,
  MessageCircle,
  FileCode,
  FileCheck,
  Eye,
  ChevronRight
} from 'lucide-react';
import { SellingPackage } from '../types';
import { 
  downloadCampaignAsPdf, 
  downloadCampaignAsText, 
  generateCampaignPlainText, 
  copyCampaignToClipboard,
  shareCampaignContent 
} from '../utils/campaignExport';
import { downloadCampaignZip } from '../utils/exportBundle';

interface ExportCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  sellingPackage: SellingPackage;
  posterCanvas?: HTMLCanvasElement | null;
}

export const ExportCampaignModal: React.FC<ExportCampaignModalProps> = ({
  isOpen,
  onClose,
  sellingPackage,
  posterCanvas
}) => {
  const [activeFormat, setActiveFormat] = useState<'pdf' | 'txt' | 'zip' | 'share'>('pdf');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [copiedWaSuccess, setCopiedWaSuccess] = useState(false);
  const [showTextPreview, setShowTextPreview] = useState(false);

  if (!isOpen) return null;

  const productName = sellingPackage.productInfo.name || sellingPackage.analysis.productType || 'Product';
  const fullCampaignText = generateCampaignPlainText(sellingPackage);

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      await downloadCampaignAsPdf(sellingPackage, posterCanvas);
    } catch (err: any) {
      console.error('PDF generation error:', err);
      alert('Could not generate PDF: ' + (err.message || 'Unknown error'));
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDownloadText = () => {
    downloadCampaignAsText(sellingPackage);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      await downloadCampaignZip(sellingPackage, posterCanvas);
    } catch (err: any) {
      alert('Could not package ZIP: ' + (err.message || 'Unknown error'));
    } finally {
      setIsZipping(false);
    }
  };

  const handleCopyAll = async () => {
    const success = await copyCampaignToClipboard(fullCampaignText);
    if (success) {
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 2200);
    }
  };

  const handleCopyWhatsAppMsg = async () => {
    const waMsg = sellingPackage.socialMedia?.whatsapp?.promotionalMessage || fullCampaignText;
    const success = await copyCampaignToClipboard(waMsg);
    if (success) {
      setCopiedWaSuccess(true);
      setTimeout(() => setCopiedWaSuccess(false), 2200);
    }
  };

  const handleNativeShare = async () => {
    await shareCampaignContent(sellingPackage);
  };

  const handleOpenWhatsAppWeb = () => {
    const text = encodeURIComponent(
      `🚀 *${productName}*\n\n${sellingPackage.description?.shortDescription || ''}\n\nPrice: ${sellingPackage.productInfo.currency} ${sellingPackage.productInfo.price || ''}\n\n👉 Learn more / Order now!`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div 
        className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 dark:bg-indigo-400/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                Export Campaign Assets
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                  Ready to Share
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-md">
                {productName} • Export professional PDF brief or clean text files
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selector Bar */}
        <div className="px-6 pt-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none">
            <button
              onClick={() => setActiveFormat('pdf')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
                activeFormat === 'pdf'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <FileCheck className="w-4 h-4 text-indigo-300" />
              <span>PDF Marketing Brief</span>
              <span className="text-[10px] opacity-75 font-normal">(.pdf)</span>
            </button>

            <button
              onClick={() => setActiveFormat('txt')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
                activeFormat === 'txt'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <FileText className="w-4 h-4 text-indigo-300" />
              <span>Plain Text File</span>
              <span className="text-[10px] opacity-75 font-normal">(.txt)</span>
            </button>

            <button
              onClick={() => setActiveFormat('share')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
                activeFormat === 'share'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Share2 className="w-4 h-4 text-indigo-300" />
              <span>Direct Share & DMs</span>
            </button>

            <button
              onClick={() => setActiveFormat('zip')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
                activeFormat === 'zip'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Package className="w-4 h-4 text-indigo-300" />
              <span>Full ZIP Bundle</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* TAB 1: PDF EXPORT */}
          {activeFormat === 'pdf' && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>Executive Marketing Campaign Brief (PDF)</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-lg leading-relaxed">
                    Formatted multi-page document ideal for team review, client presentations, agencies, and printed pitch sheets. Includes titles, descriptions, 5 ad angles, social media copy, and video storyboard.
                  </p>
                </div>

                <button
                  onClick={handleDownloadPdf}
                  disabled={isGeneratingPdf}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 active:scale-95 transition-all shrink-0 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download PDF Brief'}</span>
                </button>
              </div>

              {/* What's Inside the PDF */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Included in this PDF document:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 text-xs font-bold">
                      1
                    </div>
                    <div>
                      <h5 className="font-semibold text-xs text-slate-900 dark:text-white">Product Overview & Specs</h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Category, MSRP pricing, target demographic, and AI strategic strengths.</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 text-xs font-bold">
                      2
                    </div>
                    <div>
                      <h5 className="font-semibold text-xs text-slate-900 dark:text-white">Copy & Value Propositions</h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">3 SEO title variations, elevator pitch, full product description, and bullet benefits.</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 text-xs font-bold">
                      3
                    </div>
                    <div>
                      <h5 className="font-semibold text-xs text-slate-900 dark:text-white">5 High-Converting Ad Angles</h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Product-focused, Problem/Solution, Lifestyle, Premium, and Limited-time Offer ads.</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 text-xs font-bold">
                      4
                    </div>
                    <div>
                      <h5 className="font-semibold text-xs text-slate-900 dark:text-white">Social, WA & Video Script</h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Instagram captions, TikTok hooks, WhatsApp promotional broadcast, and video scenes.</p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TEXT FILE EXPORT */}
          {activeFormat === 'txt' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
                    <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Plain Text Campaign File (.txt)</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-lg leading-relaxed">
                    Clean, formatted text document preserving all UTF-8 characters (Urdu, Arabic, Roman Urdu, emojis, hashtags). Easily open in Notepad, TextEdit, Google Docs, or copy into ads managers.
                  </p>
                </div>

                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleCopyAll}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl font-bold text-xs bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedSuccess ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-500" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy All</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleDownloadText}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-1.5 shadow-sm shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download .txt</span>
                  </button>
                </div>
              </div>

              {/* Text Preview Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setShowTextPreview(!showTextPreview)}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{showTextPreview ? 'Hide File Preview' : 'Preview Text File Content'}</span>
                  </button>
                  <span className="text-[11px] text-slate-400">
                    {fullCampaignText.split('\n').length} lines • {(fullCampaignText.length / 1024).toFixed(1)} KB
                  </span>
                </div>

                {showTextPreview && (
                  <div className="relative">
                    <pre className="p-4 rounded-2xl bg-slate-950 text-slate-200 font-mono text-[11px] leading-relaxed max-h-72 overflow-y-auto border border-slate-800 select-all scrollbar-thin">
                      {fullCampaignText}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: DIRECT SHARE & DM */}
          {activeFormat === 'share' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Share campaign marketing copy directly with team members, marketing partners, or buyers through your favorite channels:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* WhatsApp Share */}
                <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                    <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>WhatsApp Direct Share</span>
                  </div>
                  <p className="text-[11px] text-emerald-900/80 dark:text-emerald-300/80 leading-relaxed">
                    Open WhatsApp Web / Mobile with the prefilled product elevator pitch and promotional message ready to send.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={handleOpenWhatsAppWeb}
                      className="px-3 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open in WhatsApp</span>
                    </button>
                    <button
                      onClick={handleCopyWhatsAppMsg}
                      className="px-3 py-2 rounded-xl text-xs font-medium bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-200 transition-colors cursor-pointer"
                    >
                      {copiedWaSuccess ? 'Copied WA Msg!' : 'Copy WA Copy'}
                    </button>
                  </div>
                </div>

                {/* Device Share Sheet */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xs">
                    <Share2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>System Share (AirDrop / Apps)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Trigger your computer or mobile operating system share sheet to send directly via Messages, Slack, Telegram, or AirDrop.
                  </p>
                  <div className="pt-1">
                    <button
                      onClick={handleNativeShare}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Trigger Share Sheet</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: COMPLETE ZIP BUNDLE */}
          {activeFormat === 'zip' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
                    <Package className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Complete Multi-Channel ZIP Archive</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-lg leading-relaxed">
                    Downloads an all-in-one ZIP package containing the promotional poster PNG, high-res product photo, full marketing copy TXT, and raw JSON schema.
                  </p>
                </div>

                <button
                  onClick={handleDownloadZip}
                  disabled={isZipping}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 active:scale-95 transition-all shrink-0 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{isZipping ? 'Creating ZIP...' : 'Download ZIP Bundle'}</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Export format: <span className="font-bold text-slate-900 dark:text-white uppercase">{activeFormat}</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
