import React, { useState } from 'react';
import { 
  Coins, 
  Check, 
  Zap, 
  Sparkles, 
  X, 
  ShieldCheck, 
  CreditCard 
} from 'lucide-react';
import { UserProfile, SubscriptionPlan } from '../types';

interface CreditsAndPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
}

export const CreditsAndPlansModal: React.FC<CreditsAndPlansModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile
}) => {
  const [activeTab, setActiveTab] = useState<'plans' | 'packs'>('plans');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    let addCredits = plan === 'business' ? 250 : plan === 'creator' ? 50 : 5;
    onUpdateProfile({
      plan: plan,
      credits: userProfile.credits + addCredits
    });
    setSuccessNotice(`Upgraded to ${plan.toUpperCase()} Plan! Added ${addCredits} credits to your account.`);
    setTimeout(() => setSuccessNotice(null), 3500);
  };

  const handleBuyCredits = (amount: number, label: string) => {
    onUpdateProfile({
      credits: userProfile.credits + amount
    });
    setSuccessNotice(`Purchased ${label}! New credit balance: ${userProfile.credits + amount}`);
    setTimeout(() => setSuccessNotice(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
              <Coins className="w-5 h-5 fill-amber-500" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white">
                Credits & Subscription Plans
              </h3>
              <p className="text-xs text-slate-500">
                Current Balance: <strong className="text-amber-600 font-bold">{userProfile.credits} Credits</strong> • Plan: <strong className="capitalize">{userProfile.plan}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="px-6 pt-4 pb-2 flex gap-2">
          <button
            onClick={() => setActiveTab('plans')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'plans'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            Monthly Plans
          </button>
          <button
            onClick={() => setActiveTab('packs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'packs'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            Pay-As-You-Go Credit Packs
          </button>
        </div>

        {successNotice && (
          <div className="mx-6 my-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-500" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'plans' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Free Plan */}
              <div className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                userProfile.plan === 'free'
                  ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
              }`}>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">Free Plan</h4>
                    {userProfile.plan === 'free' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">Current</span>
                    )}
                  </div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white mb-3">
                    $0 <span className="text-xs font-normal text-slate-500">/ forever</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 mb-6">
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> 5 Campaign Credits</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Standard Descriptions</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Instagram & FB Copy</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> WhatsApp Direct Share</li>
                  </ul>
                </div>
                <button
                  onClick={() => handleSelectPlan('free')}
                  disabled={userProfile.plan === 'free'}
                  className="w-full py-2.5 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 disabled:opacity-50"
                >
                  {userProfile.plan === 'free' ? "Active Plan" : "Downgrade to Free"}
                </button>
              </div>

              {/* Creator Plan */}
              <div className={`p-5 rounded-2xl border-2 relative flex flex-col justify-between transition-all ${
                userProfile.plan === 'creator'
                  ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/20'
                  : 'border-indigo-400 bg-white dark:bg-slate-900 shadow-md'
              }`}>
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white uppercase tracking-wider">
                  Most Popular
                </span>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">Creator Plan</h4>
                    {userProfile.plan === 'creator' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">Current</span>
                    )}
                  </div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white mb-3">
                    $9 <span className="text-xs font-normal text-slate-500">/ mo (~PKR 2,500)</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 mb-6">
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> 50 Campaign Credits/mo</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> High-Res Poster Studio</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Urdu & Roman Urdu copy</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Video Storyboards + Audio</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Customer DM Auto-Replies</li>
                  </ul>
                </div>
                <button
                  onClick={() => handleSelectPlan('creator')}
                  disabled={userProfile.plan === 'creator'}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 shadow-xs"
                >
                  {userProfile.plan === 'creator' ? "Active Plan" : "Upgrade to Creator"}
                </button>
              </div>

              {/* Business Plan */}
              <div className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                userProfile.plan === 'business'
                  ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
              }`}>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">Business / Agency</h4>
                    {userProfile.plan === 'business' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">Current</span>
                    )}
                  </div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white mb-3">
                    $29 <span className="text-xs font-normal text-slate-500">/ mo (~PKR 7,900)</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 mb-6">
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> 250 Campaign Credits/mo</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Product Studio Renders</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Arabic, Urdu & English</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Full Bulk ZIP Downloads</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Priority Processing Speed</li>
                  </ul>
                </div>
                <button
                  onClick={() => handleSelectPlan('business')}
                  disabled={userProfile.plan === 'business'}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-slate-800 disabled:opacity-50"
                >
                  {userProfile.plan === 'business' ? "Active Plan" : "Upgrade to Business"}
                </button>
              </div>

            </div>
          ) : (
            /* Credit Packs */
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
                  <Coins className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm">Starter Pack</h4>
                <div className="text-2xl font-black">10 Credits</div>
                <p className="text-xs text-slate-500">$3.00 (PKR 850)</p>
                <button
                  onClick={() => handleBuyCredits(10, '10 Credits')}
                  className="w-full py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Top Up 10 Credits
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-indigo-600 text-center space-y-3 relative">
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white uppercase">
                  Best Value
                </span>
                <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
                  <Coins className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm">Pro Seller Pack</h4>
                <div className="text-2xl font-black">50 Credits</div>
                <p className="text-xs text-slate-500">$12.00 (PKR 3,300)</p>
                <button
                  onClick={() => handleBuyCredits(50, '50 Credits')}
                  className="w-full py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs"
                >
                  Top Up 50 Credits
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
                  <Coins className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm">Agency Bulk Pack</h4>
                <div className="text-2xl font-black">150 Credits</div>
                <p className="text-xs text-slate-500">$29.00 (PKR 7,900)</p>
                <button
                  onClick={() => handleBuyCredits(150, '150 Credits')}
                  className="w-full py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Top Up 150 Credits
                </button>
              </div>

            </div>
          )}

          {/* Credit Costs Reference */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs space-y-1 text-slate-600 dark:text-slate-400">
            <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
              Transparent Credit Usage Rules:
            </span>
            <div>• <strong>1 Credit:</strong> Full 10-asset selling campaign creation</div>
            <div>• <strong>2 Credits:</strong> AI Studio Image background regeneration</div>
            <div>• <strong>0 Credits:</strong> Copying, exporting, poster customization & CRM replies are always free!</div>
          </div>
        </div>

      </div>
    </div>
  );
};
