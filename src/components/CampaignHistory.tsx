import React, { useState } from 'react';
import { 
  History, 
  Download, 
  Trash2, 
  ExternalLink, 
  Copy, 
  Calendar, 
  Tag, 
  ShoppingBag,
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import { SellingPackage } from '../types';
import { downloadCampaignZip } from '../utils/exportBundle';
import { ShareToChatModal } from './ShareToChatModal';

interface CampaignHistoryProps {
  campaigns: SellingPackage[];
  onOpenCampaign: (pkg: SellingPackage) => void;
  onDeleteCampaign: (id: string) => void;
  onNewCampaign: () => void;
}

export const CampaignHistory: React.FC<CampaignHistoryProps> = ({
  campaigns,
  onOpenCampaign,
  onDeleteCampaign,
  onNewCampaign
}) => {
  const [sharingPackage, setSharingPackage] = useState<SellingPackage | null>(null);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-6 h-6 text-indigo-600" />
            <span>Saved Product Campaigns</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Your generated campaigns, posters, ad copy, and video storyboards saved in local project storage.
          </p>
        </div>

        <button
          onClick={onNewCampaign}
          className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 flex items-center gap-1.5 shadow-sm shadow-indigo-600/20"
        >
          <span>+ Create New Campaign</span>
        </button>
      </div>

      {campaigns.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <ShoppingBag className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-base">
            No Campaigns Saved Yet
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Upload your first product photo or test with our ready demo products to create a complete marketing package.
          </p>
          <button
            onClick={onNewCampaign}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Start First Campaign
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((pkg) => {
            const productName = pkg.productInfo.name || pkg.analysis.productType;
            return (
              <div
                key={pkg.id}
                className="group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail Image */}
                  <div className="relative aspect-16/10 bg-slate-100 dark:bg-slate-950 overflow-hidden">
                    <img
                      src={pkg.productImage}
                      alt={productName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-xs">
                      {pkg.productInfo.category || pkg.analysis.productCategory}
                    </span>
                    {pkg.productInfo.price && (
                      <span className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg text-xs font-black bg-indigo-600 text-white shadow-xs">
                        {pkg.productInfo.currency} {pkg.productInfo.price.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Body Info */}
                  <div className="p-4 space-y-2">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {productName}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {pkg.description.shortDescription}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(pkg.createdAt).toLocaleDateString()}
                      </span>
                      <span>10 Assets Included</span>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onOpenCampaign(pkg)}
                    className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 flex items-center justify-center gap-1 shadow-xs"
                  >
                    <span>Open Dashboard</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => setSharingPackage(pkg)}
                    className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                    title="Share campaign to Google Chat"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => downloadCampaignZip(pkg)}
                    className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    title="Download ZIP package"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDeleteCampaign(pkg.id)}
                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    title="Delete campaign"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Share to Google Chat Modal */}
      {sharingPackage && (
        <ShareToChatModal
          isOpen={true}
          onClose={() => setSharingPackage(null)}
          sellingPackage={sharingPackage}
        />
      )}

    </div>
  );
};
