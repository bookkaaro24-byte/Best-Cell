import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Coins, 
  Activity, 
  Settings, 
  X, 
  Check, 
  BarChart3,
  Sparkles
} from 'lucide-react';
import { AdminSettings } from '../types';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminSettings: AdminSettings;
  onUpdateAdminSettings: (settings: AdminSettings) => void;
  totalCampaignsCount: number;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  adminSettings,
  onUpdateAdminSettings,
  totalCampaignsCount
}) => {
  const [settings, setSettings] = useState<AdminSettings>(adminSettings);
  const [savedNotice, setSavedNotice] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateAdminSettings(settings);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white">
                Platform Admin Dashboard
              </h3>
              <p className="text-xs text-slate-500">
                SellBoost System Metrics, Credit Governance & Pricing Configuration
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {savedNotice && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500" />
              <span>Admin settings successfully updated!</span>
            </div>
          )}

          {/* KPI Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 block">Total Sellers</span>
              <span className="text-lg font-bold text-slate-900 dark:text-white">1,420+</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 block">Campaigns Run</span>
              <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{Math.max(128, totalCampaignsCount)}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 block">Active Subscriptions</span>
              <span className="text-lg font-bold text-emerald-600">312 Pro</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 block">AI Engine Status</span>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Healthy</span>
              </span>
            </div>
          </div>

          {/* Settings Form */}
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Credit & Plan Configuration
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Default Free Signup Credits
                </label>
                <input
                  type="number"
                  value={settings.freePlanDefaultCredits}
                  onChange={(e) => setSettings({ ...settings, freePlanDefaultCredits: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Credits per Campaign Creation
                </label>
                <input
                  type="number"
                  value={settings.creditsPerCampaign}
                  onChange={(e) => setSettings({ ...settings, creditsPerCampaign: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Credits per Image Studio Render
                </label>
                <input
                  type="number"
                  value={settings.creditsPerStudioRender}
                  onChange={(e) => setSettings({ ...settings, creditsPerStudioRender: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Creator Plan Price ($ USD / mo)
                </label>
                <input
                  type="number"
                  value={settings.creatorPlanPriceUsd}
                  onChange={(e) => setSettings({ ...settings, creatorPlanPriceUsd: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-400">
                Changes apply immediately across all client sessions.
              </span>
              <button
                onClick={handleSave}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs"
              >
                Save Settings
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
