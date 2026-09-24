import React, { useState } from 'react';
import { 
  FileText, 
  MessageSquare, 
  Globe2, 
  Megaphone, 
  Image as ImageIcon, 
  Palette, 
  Video, 
  Store, 
  Calculator, 
  MessageSquareText, 
  Package, 
  Download, 
  ArrowLeft, 
  Sparkles,
  Share2,
  Check,
  ChevronDown,
  FileCheck,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { 
  SellingPackage, 
  GeneratedStudioImage, 
  ProductDescriptionData 
} from '../types';
import { TabDescription } from './tabs/TabDescription';
import { TabKeywordIntelligence } from './tabs/TabKeywordIntelligence';
import { TabThemedPlanner } from './tabs/TabThemedPlanner';
import { TabSocialMedia } from './tabs/TabSocialMedia';
import { TabMultilingual } from './tabs/TabMultilingual';
import { TabAdVariations } from './tabs/TabAdVariations';
import { TabImageStudio } from './tabs/TabImageStudio';
import { TabPosterStudio } from './tabs/TabPosterStudio';
import { TabVideoStoryboard } from './tabs/TabVideoStoryboard';
import { TabMarketplace } from './tabs/TabMarketplace';
import { TabPricingCalculator } from './tabs/TabPricingCalculator';
import { TabCustomerReplies } from './tabs/TabCustomerReplies';
import { TabCampaignSummary } from './tabs/TabCampaignSummary';
import { downloadCampaignZip } from '../utils/exportBundle';
import { downloadCampaignAsPdf, downloadCampaignAsText } from '../utils/campaignExport';
import { ShareToChatModal } from './ShareToChatModal';
import { ExportCampaignModal } from './ExportCampaignModal';

interface SellingPackageDashboardProps {
  sellingPackage: SellingPackage;
  onBackToWorkspace: () => void;
  onSaveCampaign: () => Promise<void>;
  isSaving: boolean;
  onUpdatePackage: (pkg: SellingPackage) => void;
}

export type DashboardTab = 
  | 'description'
  | 'keywords'
  | 'theme_plan'
  | 'social'
  | 'multilingual'
  | 'ads'
  | 'image_studio'
  | 'poster'
  | 'video'
  | 'marketplace'
  | 'calculator'
  | 'replies'
  | 'summary';

const TABS: { id: DashboardTab; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'description', label: 'Description', icon: FileText },
  { id: 'keywords', label: 'Keywords & Trends', icon: TrendingUp },
  { id: 'theme_plan', label: '1-2 Wk Themed Plan', icon: Calendar },
  { id: 'social', label: 'Social & WhatsApp', icon: MessageSquare },
  { id: 'multilingual', label: 'Urdu & Multilingual', icon: Globe2 },
  { id: 'ads', label: '5 Ad Angles', icon: Megaphone },
  { id: 'image_studio', label: 'Image Studio', icon: ImageIcon },
  { id: 'poster', label: 'Poster Studio', icon: Palette },
  { id: 'video', label: 'Video Script', icon: Video },
  { id: 'marketplace', label: 'Marketplaces', icon: Store },
  { id: 'calculator', label: 'Profit Calc', icon: Calculator },
  { id: 'replies', label: 'Customer DMs', icon: MessageSquareText },
  { id: 'summary', label: 'Export & Summary', icon: Package },
];

export const SellingPackageDashboard: React.FC<SellingPackageDashboardProps> = ({
  sellingPackage,
  onBackToWorkspace,
  onSaveCampaign,
  isSaving,
  onUpdatePackage
}) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('description');
  const [posterCanvasElement, setPosterCanvasElement] = useState<HTMLCanvasElement | null>(null);
  const [isShareToChatOpen, setIsShareToChatOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isQuickPdfLoading, setIsQuickPdfLoading] = useState(false);

  const productName = sellingPackage.productInfo.name || sellingPackage.analysis.productType;

  const handleQuickPdfDownload = async () => {
    setIsQuickPdfLoading(true);
    setIsExportMenuOpen(false);
    try {
      await downloadCampaignAsPdf(sellingPackage, posterCanvasElement);
    } catch (e: any) {
      alert('Could not export PDF: ' + (e.message || 'Unknown error'));
    } finally {
      setIsQuickPdfLoading(false);
    }
  };

  const handleQuickTextDownload = () => {
    setIsExportMenuOpen(false);
    downloadCampaignAsText(sellingPackage);
  };

  const handleUpdateDescription = (updatedDesc: ProductDescriptionData) => {
    onUpdatePackage({
      ...sellingPackage,
      description: updatedDesc
    });
  };

  const handleAddStudioImage = (newImg: GeneratedStudioImage) => {
    onUpdatePackage({
      ...sellingPackage,
      studioImages: [...(sellingPackage.studioImages || []), newImg]
    });
  };

  const handleSetPrimaryImage = (url: string) => {
    onUpdatePackage({
      ...sellingPackage,
      productImage: url
    });
  };

  const handleDeleteStudioImage = (id: string) => {
    onUpdatePackage({
      ...sellingPackage,
      studioImages: (sellingPackage.studioImages || []).filter((img) => img.id !== id)
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToWorkspace}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
            title="Back to Product Workspace"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
            <img
              src={sellingPackage.productImage}
              alt={productName}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white truncate max-w-sm sm:max-w-md">
                {productName}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                Ready
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {sellingPackage.productInfo.category || sellingPackage.analysis.productCategory} • {sellingPackage.productInfo.price ? `${sellingPackage.productInfo.currency} ${sellingPackage.productInfo.price.toLocaleString()}` : "Price on Inquiry"} • {sellingPackage.productInfo.targetMarket}
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 relative">
          <button
            onClick={() => setIsShareToChatOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/80 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 flex items-center gap-1.5 shadow-2xs active:scale-95 transition-all cursor-pointer"
            title="Share this campaign to Google Chat"
          >
            <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">Google Chat</span>
            <span className="sm:hidden">Chat</span>
          </button>

          {/* Export Action with Quick Menu */}
          <div className="relative inline-flex rounded-xl shadow-sm shadow-indigo-600/20">
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="px-3.5 sm:px-4 py-2 rounded-l-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
              title="Open campaign export options (PDF, Text, ZIP)"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>

            <button
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              className="px-2 py-2 rounded-r-xl text-white bg-indigo-600 hover:bg-indigo-700 border-l border-indigo-500/40 flex items-center justify-center transition-colors cursor-pointer"
              title="Quick export formats"
              aria-expanded={isExportMenuOpen}
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {/* Quick Export Dropdown */}
            {isExportMenuOpen && (
              <div 
                className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-30 animate-in fade-in zoom-in-95 duration-150"
                onMouseLeave={() => setIsExportMenuOpen(false)}
              >
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Quick Export Options
                </div>

                <button
                  onClick={handleQuickPdfDownload}
                  disabled={isQuickPdfLoading}
                  className="w-full px-3.5 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <FileCheck className="w-4 h-4 text-indigo-500" />
                  <div>
                    <div>Export as PDF Brief</div>
                    <div className="text-[10px] font-normal text-slate-400">Multi-page marketing doc</div>
                  </div>
                </button>

                <button
                  onClick={handleQuickTextDownload}
                  className="w-full px-3.5 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-slate-500" />
                  <div>
                    <div>Export as Text File (.txt)</div>
                    <div className="text-[10px] font-normal text-slate-400">Clean UTF-8 campaign copy</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsExportMenuOpen(false);
                    downloadCampaignZip(sellingPackage, posterCanvasElement);
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <Package className="w-4 h-4 text-purple-500" />
                  <div>
                    <div>Download ZIP Archive</div>
                    <div className="text-[10px] font-normal text-slate-400">Posters, images, text & json</div>
                  </div>
                </button>

                <div className="my-1.5 border-t border-slate-100 dark:border-slate-800" />

                <button
                  onClick={() => {
                    setIsExportMenuOpen(false);
                    setIsExportModalOpen(true);
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Open Full Export Hub...</span>
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Horizontal Scrollable Tabs Bar */}
      <div className="relative border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-none">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 shrink-0 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content Rendering */}
      <div className="pt-2">
        {activeTab === 'description' && (
          <TabDescription
            description={sellingPackage.description}
            onUpdateDescription={handleUpdateDescription}
          />
        )}

        {activeTab === 'keywords' && (
          <TabKeywordIntelligence
            sellingPackage={sellingPackage}
            onUpdatePackage={onUpdatePackage}
          />
        )}

        {activeTab === 'theme_plan' && (
          <TabThemedPlanner
            sellingPackage={sellingPackage}
            onUpdatePackage={onUpdatePackage}
          />
        )}

        {activeTab === 'social' && (
          <TabSocialMedia
            socialData={sellingPackage.socialMedia}
            productName={productName}
            whatsappNumber={sellingPackage.productInfo.contactPhone}
          />
        )}

        {activeTab === 'multilingual' && (
          <TabMultilingual
            multilingual={sellingPackage.multilingual}
            productName={productName}
          />
        )}

        {activeTab === 'ads' && (
          <TabAdVariations
            ads={sellingPackage.adVariations}
            productImage={sellingPackage.productImage}
            brandName={sellingPackage.productInfo.brandName}
            productPrice={sellingPackage.productInfo.price}
            currency={sellingPackage.productInfo.currency}
          />
        )}

        {activeTab === 'image_studio' && (
          <TabImageStudio
            originalImage={sellingPackage.productImage}
            productName={productName}
            studioImages={sellingPackage.studioImages || []}
            onAddStudioImage={handleAddStudioImage}
            onSetAsPrimaryImage={handleSetPrimaryImage}
            onDeleteStudioImage={handleDeleteStudioImage}
          />
        )}

        {activeTab === 'poster' && (
          <TabPosterStudio
            productImage={sellingPackage.productImage}
            productName={productName}
            price={sellingPackage.productInfo.price}
            currency={sellingPackage.productInfo.currency}
            discountPercent={sellingPackage.productInfo.discountPercent}
            brandName={sellingPackage.productInfo.brandName}
            whatsappNumber={sellingPackage.productInfo.contactPhone}
            keyFeatures={sellingPackage.description.keyFeatures}
            canvasRefCallback={(canvas) => setPosterCanvasElement(canvas)}
          />
        )}

        {activeTab === 'video' && (
          <TabVideoStoryboard
            videoData={sellingPackage.videoScript}
            productImage={sellingPackage.productImage}
            productName={productName}
          />
        )}

        {activeTab === 'marketplace' && (
          <TabMarketplace
            marketplaceData={sellingPackage.marketplaceListings}
            productName={productName}
            price={sellingPackage.productInfo.price}
            currency={sellingPackage.productInfo.currency}
          />
        )}

        {activeTab === 'calculator' && (
          <TabPricingCalculator
            initialPrice={sellingPackage.productInfo.price}
            initialCurrency={sellingPackage.productInfo.currency}
            productName={productName}
          />
        )}

        {activeTab === 'replies' && (
          <TabCustomerReplies
            replies={sellingPackage.customerReplies}
            productName={productName}
            whatsappNumber={sellingPackage.productInfo.contactPhone}
            currentPackage={sellingPackage}
          />
        )}

        {activeTab === 'summary' && (
          <TabCampaignSummary
            sellingPackage={sellingPackage}
            posterCanvas={posterCanvasElement}
            onSaveCampaign={onSaveCampaign}
            isSaving={isSaving}
          />
        )}
      </div>

      {/* Share to Google Chat Modal */}
      <ShareToChatModal
        isOpen={isShareToChatOpen}
        onClose={() => setIsShareToChatOpen(false)}
        sellingPackage={sellingPackage}
      />

      {/* Export Campaign Modal */}
      <ExportCampaignModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        sellingPackage={sellingPackage}
        posterCanvas={posterCanvasElement}
      />

    </div>
  );
};
