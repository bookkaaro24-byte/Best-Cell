import React, { useState } from 'react';
import { 
  Package, 
  Download, 
  Copy, 
  Check, 
  Bookmark, 
  FileText, 
  Sparkles, 
  Palette, 
  Store, 
  MessageSquare,
  FileCheck,
  Eye,
  Share2,
  ExternalLink,
  Crosshair
} from 'lucide-react';
import { SellingPackage } from '../../types';
import { 
  downloadCampaignAsPdf, 
  downloadCampaignAsText, 
  generateCampaignPlainText, 
  copyCampaignToClipboard,
  shareCampaignContent 
} from '../../utils/campaignExport';
import { downloadCampaignZip } from '../../utils/exportBundle';

interface TabCampaignSummaryProps {
  sellingPackage: SellingPackage;
  posterCanvas?: HTMLCanvasElement | null;
  onSaveCampaign: () => Promise<void>;
  isSaving: boolean;
}

export const TabCampaignSummary: React.FC<TabCampaignSummaryProps> = ({
  sellingPackage,
  posterCanvas,
  onSaveCampaign,
  isSaving
}) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const fullText = generateCampaignPlainText(sellingPackage);

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      await downloadCampaignAsPdf(sellingPackage, posterCanvas);
    } catch (err: any) {
      alert('Error creating PDF document: ' + (err.message || 'Unknown error'));
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
      alert('Error creating ZIP bundle: ' + err.message);
    } finally {
      setIsZipping(false);
    }
  };

  const handleCopyAll = async () => {
    const ok = await copyCampaignToClipboard(fullText);
    if (ok) {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    }
  };

  const handleShare = async () => {
    await shareCampaignContent(sellingPackage);
  };

  const handleSave = async () => {
    await onSaveCampaign();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const productName = sellingPackage.productInfo.name || sellingPackage.analysis.productType;

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-300 text-xs font-semibold mb-3 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Campaign Package Ready to Export</span>
          </div>

          <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
            {productName}
          </h3>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            All 10 multi-channel marketing assets have been generated, formatted, and verified. Export your complete campaign as a polished PDF brief, plain text document, or full ZIP bundle.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-5 py-3 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-95 transition-all cursor-pointer"
            >
              <FileCheck className="w-4 h-4" />
              <span>{isGeneratingPdf ? "Creating PDF..." : "Export as PDF Brief"}</span>
            </button>

            <button
              onClick={handleDownloadText}
              className="px-5 py-3 rounded-xl font-bold text-sm bg-white/15 hover:bg-white/25 text-white border border-white/20 flex items-center gap-2 backdrop-blur-xs transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Export as Text (.txt)</span>
            </button>

            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="px-4 py-3 rounded-xl font-semibold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/10 flex items-center gap-2 backdrop-blur-xs transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isZipping ? "Packaging ZIP..." : "Download ZIP"}</span>
            </button>

            <button
              onClick={handleCopyAll}
              className="px-4 py-3 rounded-xl font-semibold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/10 flex items-center gap-2 backdrop-blur-xs transition-colors cursor-pointer"
            >
              {copiedAll ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedAll ? "Copied!" : "Copy Text"}</span>
            </button>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-3 rounded-xl font-semibold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/10 flex items-center gap-2 backdrop-blur-xs transition-colors cursor-pointer"
            >
              <Bookmark className="w-4 h-4" />
              <span>{savedSuccess ? "Saved!" : "Save"}</span>
            </button>
          </div>
        </div>

        {/* Ambient glow */}
        <div className="absolute right-0 top-0 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Primary Export Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* PDF Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-indigo-300 dark:hover:border-indigo-700 transition-all">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                <FileCheck className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300">
                PDF Document
              </span>
            </div>
            <h4 className="font-display font-bold text-base text-slate-900 dark:text-white">
              Export as PDF Marketing Brief
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Generate a clean, multi-page PDF formatted with executive styling. Contains full campaign metadata, 3 title variations, elevator pitch, 5 ad angles, social media copy, video script, and customer objection FAQs.
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Ready for clients & teams</span>
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 shadow-sm shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isGeneratingPdf ? 'Compiling PDF...' : 'Download PDF'}</span>
            </button>
          </div>
        </div>

        {/* Text File Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-indigo-300 dark:hover:border-indigo-700 transition-all">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                UTF-8 Text File (.txt)
              </span>
            </div>
            <h4 className="font-display font-bold text-base text-slate-900 dark:text-white">
              Export as Plain Text File
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Export all campaign copy as a clean text file with clear ASCII section dividers. Preserves full Urdu, Arabic, Roman Urdu, emojis, and hashtags. Easily paste into WhatsApp, Notes, or Meta Ads Manager.
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
            <button
              onClick={handleCopyAll}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedAll ? 'Copied!' : 'Copy to Clipboard'}</span>
            </button>

            <button
              onClick={handleDownloadText}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .txt</span>
            </button>
          </div>
        </div>

      </div>

      {/* Asset Count Checklist Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-1">
            <FileText className="w-4 h-4" />
            <span className="font-bold text-base text-slate-900 dark:text-white">3 Titles</span>
          </div>
          <p className="text-xs text-slate-500">SEO & luxury variations</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-1">
            <MessageSquare className="w-4 h-4" />
            <span className="font-bold text-base text-slate-900 dark:text-white">20+ Captions</span>
          </div>
          <p className="text-xs text-slate-500">Instagram, TikTok & WA</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
            <Sparkles className="w-4 h-4" />
            <span className="font-bold text-base text-slate-900 dark:text-white">5 Ad Angles</span>
          </div>
          <p className="text-xs text-slate-500">Meta & feed promotions</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 mb-1">
            <Palette className="w-4 h-4" />
            <span className="font-bold text-base text-slate-900 dark:text-white">10 Posters</span>
          </div>
          <p className="text-xs text-slate-500">Ready in 4 formats</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
            <Store className="w-4 h-4" />
            <span className="font-bold text-base text-slate-900 dark:text-white">4 Listings</span>
          </div>
          <p className="text-xs text-slate-500">Shopify, Daraz, FB & Woo</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-1">
            <Crosshair className="w-4 h-4" />
            <span className="font-bold text-base text-slate-900 dark:text-white">
              {sellingPackage.competitorsResearch && sellingPackage.competitorsResearch.length > 0
                ? `${sellingPackage.competitorsResearch.length} Rival Intel`
                : 'Competitor Intel'}
            </span>
          </div>
          <p className="text-xs text-slate-500">Angles & counter-offers</p>
        </div>

      </div>

      {/* Campaign Content Live Preview Drawer */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h4 className="font-display font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              Campaign Export Preview
              <span className="text-xs font-normal text-slate-500">({fullText.split('\n').length} lines)</span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Review full formatted text content before downloading or sharing.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showPreview ? 'Collapse Preview' : 'Expand Preview'}</span>
            </button>

            <button
              onClick={handleCopyAll}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedAll ? 'Copied!' : 'Copy Text'}</span>
            </button>
          </div>
        </div>

        {showPreview && (
          <div className="pt-2">
            <pre className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] leading-relaxed max-h-96 overflow-y-auto border border-slate-800 select-all scrollbar-thin">
              {fullText}
            </pre>
          </div>
        )}

        {/* Package Contents Breakdown */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Available Export Formats:
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 font-mono text-xs text-slate-700 dark:text-slate-300 space-y-1.5 border border-slate-200 dark:border-slate-700">
            <div>📄 <b>{productName.replace(/\s+/g, '_')}_Campaign_Brief.pdf</b> (Formatted multi-page brief with ad angles & copy)</div>
            <div>📝 <b>{productName.replace(/\s+/g, '_')}_Campaign_Content.txt</b> (Complete plain text file for WhatsApp & notepads)</div>
            <div>📦 <b>{productName.replace(/\s+/g, '_')}_SellBoost_Package.zip</b> (Full bundle with high-res poster PNG & JSON)</div>
          </div>
        </div>
      </div>

    </div>
  );
};
