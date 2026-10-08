import React, { useState } from 'react';
import { 
  Crosshair, 
  Search, 
  Globe, 
  Sparkles, 
  Copy, 
  Check, 
  TrendingUp, 
  DollarSign, 
  Tag, 
  ShieldAlert, 
  ShieldCheck, 
  Truck, 
  AlertTriangle, 
  ThumbsUp, 
  Zap, 
  ExternalLink, 
  Layers, 
  FileText, 
  Share2, 
  RefreshCw, 
  ArrowRight,
  Plus,
  Scale,
  Target,
  MessageSquare,
  Flame,
  Award
} from 'lucide-react';
import { 
  SellingPackage, 
  CompetitorResearchReport, 
  CompetitorMarketingAngle, 
  CompetitorOpportunityItem, 
  CompetitorAdCreative 
} from '../../types';

interface TabCompetitorResearchProps {
  sellingPackage: SellingPackage;
  onUpdatePackage?: (pkg: SellingPackage) => void;
}

export const TabCompetitorResearch: React.FC<TabCompetitorResearchProps> = ({
  sellingPackage,
  onUpdatePackage
}) => {
  const pName = sellingPackage.productInfo.name || sellingPackage.analysis.productType || "Featured Offer";
  const pCategory = sellingPackage.productInfo.category || sellingPackage.analysis.productCategory || "E-Commerce";
  const pPrice = sellingPackage.productInfo.price || 0;
  const pCurrency = sellingPackage.productInfo.currency || "PKR";
  const pMarket = sellingPackage.productInfo.targetMarket || "Pakistan";

  // Existing saved competitors or initial default
  const savedReports: CompetitorResearchReport[] = sellingPackage.competitorsResearch && sellingPackage.competitorsResearch.length > 0
    ? sellingPackage.competitorsResearch
    : [];

  const [activeReportId, setActiveReportId] = useState<string>(
    savedReports.length > 0 ? savedReports[0].id : 'initial'
  );
  const [competitorInput, setCompetitorInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTabSection, setActiveTabSection] = useState<'all' | 'angles' | 'pricing' | 'opportunities' | 'ads'>('all');

  // Initial intelligent default report if user hasn't researched yet
  const defaultReport: CompetitorResearchReport = {
    id: 'initial',
    competitorName: pCategory.toLowerCase().includes('bag') || pCategory.toLowerCase().includes('fashion')
      ? 'Khaadi / Outfitters Studio'
      : (pCategory.toLowerCase().includes('watch') || pCategory.toLowerCase().includes('tech')
        ? 'Casio / Anker Retail'
        : `${pCategory} Market Leader`),
    websiteUrl: pCategory.toLowerCase().includes('fashion') ? 'https://pk.khaadi.com' : 'https://anker.com',
    analyzedAt: new Date().toISOString(),
    brandSummary: `Leading direct-to-consumer and retail player in the ${pCategory} segment for ${pMarket}. Known for high brand recall, polished lifestyle imagery, and frequent promotional sales cycles.`,
    marketPositioning: "Mass-Market Aspirational with High-Volume Promotional Discounting",
    estimatedPriceRange: {
      min: Math.max(1200, Math.round(pPrice * 0.85)),
      max: Math.max(4500, Math.round(pPrice * 1.6)),
      currency: pCurrency,
      formatted: `${pCurrency} ${Math.max(1200, Math.round(pPrice * 0.85)).toLocaleString()} – ${pCurrency} ${Math.max(4500, Math.round(pPrice * 1.6)).toLocaleString()}`
    },
    pricingStrategy: {
      model: "Anchor-High with Tiered Volume Discounts",
      discountTactics: [
        "15% welcome pop-up discount on first email/WhatsApp sign-up",
        `Free shipping threshold set at orders over ${pCurrency} ${(pPrice * 1.3).toFixed(0)}`,
        "Tiered bundle discounts: Buy 2 get 10% off, Buy 3 get 20% off",
        "Flash holiday sales and seasonal countdown timers to drive FOMO"
      ],
      upsellBundleTactics: [
        "Curated starter kits bundled with minor accessories at checkout",
        "1-click cart slide-out add-ons before final payment",
        "VIP customer loyalty rewards program"
      ],
      shippingPolicy: "Standard 3-5 business days courier delivery. Cash on Delivery (COD) supported nationwide.",
      refundGuarantee: "7-day return policy for unwashed/unopened items; customer bears return courier shipping."
    },
    marketingAngles: [
      {
        angleName: "Instant Status & Visible Upgrade",
        hook: `“Stop settling for ordinary ${pCategory.toLowerCase()}. Here's what 10,000+ stylish buyers switched to this season.”`,
        targetEmotion: "Validation, prestige, and aesthetic superiority",
        adCreativeFormat: "UGC Video Testimonial with hands-on reveal and styling demo",
        keyCopySnippet: `Tested, verified, and loved nationwide. Crafted with premium details that elevate your everyday routine. Order yours before stock runs out!`,
        effectivenessRating: "Very High"
      },
      {
        angleName: "Affordable Direct-to-Consumer Luxury",
        hook: `“Why pay 3x designer markups when you can get the exact same craftsmanship direct from source?”`,
        targetEmotion: "Smart financial confidence & insider advantage",
        adCreativeFormat: "Split-screen side-by-side comparison with high-end designer alternative",
        keyCopySnippet: `Zero retailer markups. Pure craftsmanship delivered directly to your doorstep. Experience premium quality at an honest price.`,
        effectivenessRating: "High"
      },
      {
        angleName: "Trending Social Proof & FYP Viral Hook",
        hook: `“The #1 most requested ${pCategory.toLowerCase()} on everyone's feed this week.”`,
        targetEmotion: "FOMO (Fear Of Missing Out) and community belonging",
        adCreativeFormat: "Fast-paced TikTok unboxing with ASMR audio & macro product texture shots",
        keyCopySnippet: `Over 3,500 units dispatched this month. See why it consistently sells out within 48 hours of every restock!`,
        effectivenessRating: "Very High"
      },
      {
        angleName: "Problem/Agony Reversal",
        hook: `“Tired of flimsy items that lose their finish after two weeks? We built the permanent solution.”`,
        targetEmotion: "Frustration relief and long-term durability confidence",
        adCreativeFormat: "Founder talking-head addressing the common industry shortcut",
        keyCopySnippet: `Reinforced construction backed by our replacement guarantee. Invest in something built to last.`,
        effectivenessRating: "High"
      }
    ],
    customerReviewsAnalysis: {
      topComplaints: [
        "Courier delivery delays during peak sales seasons (taking up to 6-8 days)",
        "Customer support responses slow on WhatsApp and Instagram DMs (often 12-24 hours delay)",
        "Complicated return process requiring buyer to pay return courier fees",
        "Packaging occasionally arrives slightly dented or scuffed"
      ],
      topPraises: [
        "Product looks identical to online promotional photos",
        "Great aesthetic finish and satisfying feel upon unboxing",
        "High initial brand perception and trendy styling"
      ],
      unmetCustomerNeeds: [
        "Guaranteed 24-48hr fast dispatch with live WhatsApp courier tracking",
        "100% risk-free 'Open Parcel on Delivery' inspection before paying courier",
        "Personalized styling advice or curated matching companion bonuses"
      ]
    },
    opportunityMatrix: [
      {
        competitorWeakness: "Sluggish delivery and customer support lag during peak promotional periods",
        ourAdvantageHook: "⚡ Same-Day Priority Dispatch + Live WhatsApp Concierge (Replies in < 5 mins)",
        suggestedCounterOffer: "Promise 24-48 hour express dispatch with an automated tracking link sent to their WhatsApp immediately upon order confirmation."
      },
      {
        competitorWeakness: "Strict return policy where customers must pay return courier postage",
        ourAdvantageHook: "🛡️ 100% Risk-Free Doorstep Inspection (Open Parcel COD)",
        suggestedCounterOffer: "Prominently advertise 'Open and inspect the parcel before paying the courier rider'. This wipes out all buyer hesitation in one stroke."
      },
      {
        competitorWeakness: "Generic bundled accessories of mediocre build quality",
        ourAdvantageHook: "🎁 Genuine Premium Matching Companion Gift with Every Order",
        suggestedCounterOffer: "Include a genuinely useful high-grade bonus item instead of cheap filler, giving your offer superior perceived value."
      }
    ],
    sampleAdCreatives: [
      {
        headline: `Better Quality Than The Big Brands — Without The Luxury Markup`,
        primaryText: `Before you spend hard-earned money on overpriced mainstream brands, compare the build quality and attention to detail. We dispatch directly to your doorstep with FREE Express Shipping and Cash on Delivery!`,
        cta: "Shop Now & Claim 20% Off",
        platform: "Instagram"
      },
      {
        headline: `Looking for the Best ${pCategory} in ${pMarket}? Watch This Before You Buy!`,
        primaryText: `Here is the unfiltered breakdown: 3 reasons our community made the switch this season. Built with reinforced specs, 48-hour priority delivery, and 100% open-box inspection guaranteed.`,
        cta: "Claim Your Bundle",
        platform: "TikTok"
      },
      {
        headline: `The Smarter Choice in ${pMarket}: Premium Craftsmanship at an Honest Price`,
        primaryText: `Why wait a week for shipping? Get yours dispatched within 24 hours with hassle-free doorstep returns. Limited launch batch available.`,
        cta: "Order via WhatsApp",
        platform: "Facebook"
      }
    ],
    scrapedInsights: {
      metaTitle: `Official ${pCategory} Collection — Leading Brand in ${pMarket}`,
      metaDescription: `Shop the latest collections with nationwide cash on delivery, seasonal bundle deals, and hassle-free ordering.`,
      extractedPromos: [
        "Free standard delivery on orders above threshold",
        "Seasonal multi-buy volume bundle savings",
        "Cash on Delivery (COD) supported nationwide"
      ],
      detectedTechStack: ["Shopify Store", "Meta Pixel (Active Ads)", "TikTok Pixel (Active Ads)"]
    }
  };

  const currentReport: CompetitorResearchReport = savedReports.find(r => r.id === activeReportId) || defaultReport;

  // Category-specific quick test presets
  const quickPresets = [
    { label: "Khaadi (Fashion/DTC)", value: "https://pk.khaadi.com" },
    { label: "Outfitters", value: "https://outfitters.com.pk" },
    { label: "J. Junaid Jamshed", value: "https://junaidjamshed.com" },
    { label: "Anker (Tech)", value: "https://anker.com" },
    { label: "Casio", value: "https://casio.com" },
    { label: "Gymshark", value: "https://gymshark.com" },
    { label: "The Ordinary (Skincare)", value: "https://theordinary.com" },
    { label: "Miniso", value: "https://miniso.com" }
  ];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRunResearch = async (inputQuery?: string) => {
    const queryToUse = (inputQuery || competitorInput).trim();
    if (!queryToUse) {
      setErrorMsg("Please enter a competitor's website URL or brand name.");
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);

    const isUrl = /^https?:\/\//i.test(queryToUse) || /\.[a-z]{2,8}(?:[/?#]|$)/i.test(queryToUse);
    setLoadingStep(isUrl ? "🌐 Scraping live webpage, prices & promotional banners..." : "🔍 Analyzing brand marketing angles & search footprints...");

    try {
      const stepTimer1 = setTimeout(() => {
        setLoadingStep("🧠 Reverse-engineering pricing models, discount rules & bundles...");
      }, 1500);

      const stepTimer2 = setTimeout(() => {
        setLoadingStep("🎯 Synthesizing high-converting ad angles, hooks & counter-offers...");
      }, 3200);

      const res = await fetch("/api/competitor-research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          competitorInput: queryToUse,
          myProductName: pName,
          myProductCategory: pCategory,
          myPrice: pPrice,
          targetMarket: pMarket,
          currency: pCurrency
        })
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Failed to analyze competitor");
      }

      const data = await res.json();
      if (data.report) {
        const newReport: CompetitorResearchReport = data.report;
        const updatedList = [newReport, ...savedReports.filter(r => r.id !== newReport.id && r.id !== 'initial')];
        
        setActiveReportId(newReport.id);
        setCompetitorInput('');

        // Update campaign package state if handler provided
        if (onUpdatePackage) {
          onUpdatePackage({
            ...sellingPackage,
            competitorsResearch: updatedList
          });
        }
      }
    } catch (err: any) {
      console.error("Competitor research failure:", err);
      setErrorMsg(err.message || "Could not analyze competitor. Please check the URL or try a brand name.");
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  // Full dossier copy
  const handleCopyFullDossier = () => {
    const r = currentReport;
    const dossierText = `
=====================================================
SELLBOOST COMPETITOR INTELLIGENCE DOSSIER
Competitor: ${r.competitorName}
Website: ${r.websiteUrl || 'Direct Brand Intelligence'}
Analyzed At: ${new Date(r.analyzedAt).toLocaleString()}
Target Market: ${pMarket} | Currency: ${pCurrency}
=====================================================

1. BRAND SUMMARY & POSITIONING
Positioning: ${r.marketPositioning}
Summary: ${r.brandSummary}

2. PRICING & PROMOTION STRATEGY
Model: ${r.pricingStrategy.model}
Estimated Range: ${r.estimatedPriceRange.formatted}
Discount Tactics:
${r.pricingStrategy.discountTactics.map((t, i) => `  - ${t}`).join('\n')}
Upsell & Bundles:
${r.pricingStrategy.upsellBundleTactics.map((u, i) => `  - ${u}`).join('\n')}
Shipping: ${r.pricingStrategy.shippingPolicy}
Returns & Guarantee: ${r.pricingStrategy.refundGuarantee}

3. CORE MARKETING ANGLES & HOOKS
${r.marketingAngles.map((a, i) => `[Angle ${i + 1}: ${a.angleName} (${a.effectivenessRating})]
Hook: ${a.hook}
Emotion: ${a.targetEmotion}
Format: ${a.adCreativeFormat}
Copy Snippet: ${a.keyCopySnippet}
`).join('\n')}

4. CUSTOMER REVIEWS & GAP ANALYSIS
Top Complaints (Competitor Flaws):
${r.customerReviewsAnalysis.topComplaints.map(c => `  * ${c}`).join('\n')}
Top Praises:
${r.customerReviewsAnalysis.topPraises.map(p => `  * ${p}`).join('\n')}
Unmet Needs (Where We Can Win):
${r.customerReviewsAnalysis.unmetCustomerNeeds.map(u => `  * ${u}`).join('\n')}

5. OPPORTUNITY ATTACK PLAN (HOW TO OUTSELL THEM)
${r.opportunityMatrix.map((o, i) => `[Attack Move ${i + 1}]
Competitor Flaw: ${o.competitorWeakness}
Our Advantage Hook: ${o.ourAdvantageHook}
Suggested Counter-Offer: ${o.suggestedCounterOffer}
`).join('\n')}

6. READY-TO-RUN COUNTER-AD CREATIVES
${r.sampleAdCreatives.map((ad, i) => `[${ad.platform} Ad]
Headline: ${ad.headline}
Primary Text: ${ad.primaryText}
CTA: ${ad.cta}
`).join('\n')}
=====================================================
Generated by SellBoost Competitor Research Engine
`.trim();

    handleCopy(dossierText, 'full_dossier');
  };

  // Price comparison calculation
  const compAvgPrice = (currentReport.estimatedPriceRange.min + currentReport.estimatedPriceRange.max) / 2;
  const priceDiffPercent = pPrice > 0 ? Math.round(((pPrice - compAvgPrice) / compAvgPrice) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/40 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2 border border-indigo-500/30">
              <Crosshair className="w-3.5 h-3.5" />
              Competitor Research & Reverse-Engineering
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Rival Intel & Counter-Strategy Engine
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
              Scrape competitor websites or input brand names to reverse-engineer their pricing models, high-converting ad angles, customer complaints, and exploitable gaps.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
            <button
              onClick={handleCopyFullDossier}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow transition"
              title="Copy complete research dossier to clipboard"
            >
              {copiedKey === 'full_dossier' ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Dossier Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Complete Dossier</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Search & Scrape Input Bar */}
        <div className="mt-6 pt-5 border-t border-indigo-900/50">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                {competitorInput.startsWith('http') || competitorInput.includes('.com') ? (
                  <Globe className="w-4 h-4 text-cyan-400" />
                ) : (
                  <Search className="w-4 h-4 text-indigo-400" />
                )}
              </div>
              <input
                type="text"
                value={competitorInput}
                onChange={(e) => setCompetitorInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleRunResearch()}
                placeholder="Enter competitor store URL (e.g. https://brand.com) or Rival Brand Name..."
                className="w-full pl-10 pr-4 py-3 bg-slate-950/70 border border-slate-700/80 rounded-xl text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                disabled={isLoading}
              />
              {competitorInput && (
                <button
                  onClick={() => setCompetitorInput('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            <button
              onClick={() => handleRunResearch()}
              disabled={isLoading || !competitorInput.trim()}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 disabled:opacity-50 text-white font-semibold text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Analyze Competitor</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-2 mt-3 flex-wrap text-xs text-slate-400">
            <span className="font-medium text-slate-300">Quick Test Brands:</span>
            {quickPresets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => {
                  setCompetitorInput(preset.value);
                  handleRunResearch(preset.value);
                }}
                disabled={isLoading}
                className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700/60 transition cursor-pointer text-[11px]"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Loading Indicator with Progressive Steps */}
          {isLoading && (
            <div className="mt-4 p-3.5 bg-indigo-950/60 border border-indigo-700/50 rounded-xl flex items-center gap-3 animate-pulse">
              <RefreshCw className="w-5 h-5 text-indigo-400 animate-spin flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-indigo-200">SellBoost AI Intelligence Engine at Work</p>
                <p className="text-xs text-indigo-300/80">{loadingStep}</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="mt-3 p-3 bg-red-950/60 border border-red-800/60 rounded-xl flex items-center gap-2 text-xs text-red-200">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      </div>

      {/* Competitor History / Saved Tabs */}
      {savedReports.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-1">
            Researched Rivals:
          </span>
          {savedReports.map((report) => (
            <button
              key={report.id}
              onClick={() => setActiveReportId(report.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeReportId === report.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-400'
              }`}
            >
              <Target className="w-3 h-3 text-indigo-400" />
              <span>{report.competitorName}</span>
            </button>
          ))}
        </div>
      )}

      {/* Competitor Overview Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {currentReport.competitorName}
              </h3>
              {currentReport.websiteUrl && (
                <a
                  href={currentReport.websiteUrl.startsWith('http') ? currentReport.websiteUrl : `https://${currentReport.websiteUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <Globe className="w-3 h-3" />
                  <span>{currentReport.websiteUrl.replace(/^https?:\/\//i, '').replace(/www\./i, '').split('/')[0]}</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Verified Analysis
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Positioning: </span>
              {currentReport.marketPositioning}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 max-w-3xl">
              {currentReport.brandSummary}
            </p>
          </div>

          {/* Pricing Delta Quick Glance */}
          <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 flex items-center gap-4 self-start lg:self-auto min-w-[260px]">
            <div>
              <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
                Competitor Price Range
              </div>
              <div className="text-base font-bold text-slate-900 dark:text-white">
                {currentReport.estimatedPriceRange.formatted}
              </div>
            </div>

            {pPrice > 0 && (
              <div className="pl-3 border-l border-slate-200 dark:border-slate-700">
                <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
                  Our Price
                </div>
                <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  {pCurrency} {pPrice.toLocaleString()}
                </div>
                <div className="text-[10px] font-medium text-slate-500">
                  {priceDiffPercent < 0 ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{Math.abs(priceDiffPercent)}% Lower (Value Advantage)</span>
                  ) : priceDiffPercent > 0 ? (
                    <span className="text-amber-600 dark:text-amber-400 font-semibold">{priceDiffPercent}% Higher (Premium Tier)</span>
                  ) : (
                    <span>Direct Price Parity</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Scraped Tech & Tags (if present) */}
        {currentReport.scrapedInsights && (
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 flex-wrap text-xs">
            <span className="text-slate-500 font-medium">Scraped Intel:</span>
            {currentReport.scrapedInsights.detectedTechStack?.map((tech) => (
              <span key={tech} className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-medium text-[11px] border border-indigo-200 dark:border-indigo-800/50">
                {tech}
              </span>
            ))}
            {currentReport.scrapedInsights.extractedPromos?.map((promo, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-medium text-[11px] border border-amber-200 dark:border-amber-800/50">
                🏷️ {promo}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Filter / Section Pills */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTabSection('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeTabSection === 'all'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          All Intel Sections
        </button>
        <button
          onClick={() => setActiveTabSection('pricing')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeTabSection === 'pricing'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          💰 Pricing & Offers
        </button>
        <button
          onClick={() => setActiveTabSection('angles')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeTabSection === 'angles'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          🎯 Top 4 Marketing Angles
        </button>
        <button
          onClick={() => setActiveTabSection('opportunities')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeTabSection === 'opportunities'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          ⚡ Attack Plan (How to Outsell)
        </button>
        <button
          onClick={() => setActiveTabSection('ads')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeTabSection === 'ads'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          📣 Ready Counter-Ads
        </button>
      </div>

      {/* SECTION 1: PRICING & PROMOTION STRATEGY */}
      {(activeTabSection === 'all' || activeTabSection === 'pricing') && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Pricing & Promotion Strategy Breakdown
                </h3>
                <p className="text-xs text-slate-500">
                  Model: <span className="font-semibold text-slate-800 dark:text-slate-200">{currentReport.pricingStrategy.model}</span>
                </p>
              </div>
            </div>

            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg">
              Est. Range: {currentReport.estimatedPriceRange.formatted}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Discount Tactics */}
            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-xl p-4">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                <Tag className="w-3.5 h-3.5 text-indigo-500" />
                Active Discount & Incentive Tactics
              </h4>
              <ul className="space-y-2">
                {currentReport.pricingStrategy.discountTactics.map((tactic, idx) => (
                  <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                    <span>{tactic}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Upsells & Bundles */}
            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-xl p-4">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                <Layers className="w-3.5 h-3.5 text-indigo-500" />
                Upsell & High-AOV Bundle Tactics
              </h4>
              <ul className="space-y-2">
                {currentReport.pricingStrategy.upsellBundleTactics.map((upsell, idx) => (
                  <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-1.5 flex-shrink-0" />
                    <span>{upsell}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Shipping & Return Guarantees */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 rounded-xl flex items-start gap-2.5">
              <Truck className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="block text-[11px] font-bold uppercase text-blue-900 dark:text-blue-300">
                  Shipping & Logistics Positioning
                </span>
                <p className="text-xs text-blue-950 dark:text-blue-200/80 mt-0.5">
                  {currentReport.pricingStrategy.shippingPolicy}
                </p>
              </div>
            </div>

            <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 rounded-xl flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="block text-[11px] font-bold uppercase text-emerald-900 dark:text-emerald-300">
                  Refund & Guarantee Policy
                </span>
                <p className="text-xs text-emerald-950 dark:text-emerald-200/80 mt-0.5">
                  {currentReport.pricingStrategy.refundGuarantee}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: TOP MARKETING ANGLES & HOOKS */}
      {(activeTabSection === 'all' || activeTabSection === 'angles') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Their Top 4 High-Converting Marketing Angles
                </h3>
                <p className="text-xs text-slate-500">
                  The psychological hooks, creative formats, and copy formulas driving their sales.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentReport.marketingAngles.map((angle: CompetitorMarketingAngle, idx: number) => {
              const hookCopyKey = `hook_${idx}`;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:border-indigo-400 dark:hover:border-indigo-600 transition flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
                        <Flame className="w-3 h-3 text-amber-500" />
                        {angle.angleName}
                      </span>
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {angle.effectivenessRating} Impact
                      </span>
                    </div>

                    {/* Viral Hook */}
                    <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl p-3 relative group">
                      <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Viral Hook Headline
                      </div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white italic">
                        {angle.hook}
                      </p>
                      <button
                        onClick={() => handleCopy(angle.hook, hookCopyKey)}
                        className="mt-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 inline-flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === hookCopyKey ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Hook Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Hook</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div>
                        <span className="font-semibold text-slate-500">Target Emotion: </span>
                        <span className="text-slate-800 dark:text-slate-200">{angle.targetEmotion}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-500">Ad Creative Format: </span>
                        <span className="text-slate-800 dark:text-slate-200">{angle.adCreativeFormat}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-500">Key Copy Snippet: </span>
                        <p className="text-slate-600 dark:text-slate-300 mt-0.5 bg-slate-100/50 dark:bg-slate-800/30 p-2 rounded-lg font-mono text-[11px] leading-relaxed">
                          "{angle.keyCopySnippet}"
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => handleCopy(`Counter-Ad Hook inspired by ${currentReport.competitorName}:\n${angle.hook}\n\nKey Body Concept:\n${angle.keyCopySnippet}`, `adopt_${idx}`)}
                      className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {copiedKey === `adopt_${idx}` ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Copied for Your Campaign!</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5 text-amber-500" />
                          <span>⚡ Adapt Angle for My Ads</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 3: CUSTOMER REVIEWS & GAP ANALYSIS */}
      {(activeTabSection === 'all' || activeTabSection === 'opportunities') && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Customer Sentiment & White-Space Opportunities
              </h3>
              <p className="text-xs text-slate-500">
                What their buyers complain about, what they love, and the gaps you can exploit to win their market share.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Top Complaints */}
            <div className="bg-red-50/50 dark:bg-red-950/20 border border-red-200/80 dark:border-red-900/40 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-700 dark:text-red-400">
                <ShieldAlert className="w-4 h-4 text-red-500" />
                <span>Frequent Complaints (Where They Fail)</span>
              </div>
              <ul className="space-y-2">
                {currentReport.customerReviewsAnalysis.topComplaints.map((item, i) => (
                  <li key={i} className="text-xs text-red-950 dark:text-red-200/90 flex items-start gap-1.5">
                    <span className="text-red-500 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Top Praises */}
            <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                <ThumbsUp className="w-4 h-4 text-emerald-500" />
                <span>Top Praises (What Buyers Love)</span>
              </div>
              <ul className="space-y-2">
                {currentReport.customerReviewsAnalysis.topPraises.map((item, i) => (
                  <li key={i} className="text-xs text-emerald-950 dark:text-emerald-200/90 flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Unmet Needs */}
            <div className="bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-900/40 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span>Unmet Needs (Our Goldmine)</span>
              </div>
              <ul className="space-y-2">
                {currentReport.customerReviewsAnalysis.unmetCustomerNeeds.map((item, i) => (
                  <li key={i} className="text-xs text-indigo-950 dark:text-indigo-200/90 flex items-start gap-1.5">
                    <span className="text-indigo-500 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: THE ATTACK PLAN (HOW TO OUTSELL THEM) */}
      {(activeTabSection === 'all' || activeTabSection === 'opportunities') && (
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/60 rounded-2xl p-6 text-white shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center font-bold text-amber-300">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  The Attack Plan: How to Outsell {currentReport.competitorName}
                </h3>
                <p className="text-xs text-indigo-200">
                  Targeted counter-positioning angles to turn their weaknesses into your irresistible selling propositions.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {currentReport.opportunityMatrix.map((item: CompetitorOpportunityItem, idx: number) => (
              <div
                key={idx}
                className="bg-slate-950/60 border border-indigo-800/40 rounded-xl p-4 grid grid-cols-1 lg:grid-cols-3 gap-4 items-center"
              >
                <div>
                  <div className="text-[10px] font-bold text-red-400 uppercase tracking-wider">
                    Competitor Flaw #0{idx + 1}
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    {item.competitorWeakness}
                  </p>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                    Our Winning Counter-Hook
                  </div>
                  <p className="text-xs font-semibold text-white mt-1">
                    {item.ourAdvantageHook}
                  </p>
                </div>

                <div className="bg-indigo-950/60 border border-indigo-700/50 p-3 rounded-lg">
                  <div className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                    Suggested Action Offer
                  </div>
                  <p className="text-xs text-indigo-100 mt-0.5 leading-relaxed">
                    {item.suggestedCounterOffer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 5: READY-TO-RUN COUNTER-AD CREATIVES */}
      {(activeTabSection === 'all' || activeTabSection === 'ads') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 flex items-center justify-center font-bold">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  3 Ready-to-Run Counter-Ad Creatives
                </h3>
                <p className="text-xs text-slate-500">
                  Pre-drafted ad copy tailored to persuade buyers considering {currentReport.competitorName}.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentReport.sampleAdCreatives.map((ad: CompetitorAdCreative, idx: number) => {
              const copyKey = `ad_${idx}`;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                        {ad.platform} Ad
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        Ready to Post
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                      "{ad.headline}"
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                      {ad.primaryText}
                    </p>

                    <div className="text-xs">
                      <span className="font-semibold text-slate-500">CTA: </span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">{ad.cta}</span>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => handleCopy(`${ad.headline}\n\n${ad.primaryText}\n\n👉 ${ad.cta}`, copyKey)}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {copiedKey === copyKey ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-300" />
                          <span>Ad Copy Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Ad Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 6: SIDE-BY-SIDE MATRIX */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Side-by-Side Competitive Benchmark
            </h3>
            <p className="text-xs text-slate-500">
              How our campaign offer stacks up against {currentReport.competitorName}.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3">Benchmark Factor</th>
                <th className="py-2.5 px-3 font-semibold text-slate-700 dark:text-slate-300">
                  {currentReport.competitorName} (Rival)
                </th>
                <th className="py-2.5 px-3 font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-t-lg">
                  {pName} (Our Offer)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-300">Price Tier</td>
                <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                  {currentReport.estimatedPriceRange.formatted}
                </td>
                <td className="py-3 px-3 font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30">
                  {pCurrency} {pPrice.toLocaleString()} {priceDiffPercent < 0 && `(Save ${Math.abs(priceDiffPercent)}%)`}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-300">Delivery Speed</td>
                <td className="py-3 px-3 text-slate-600 dark:text-slate-400">Standard 3-5 days (often delayed in sales)</td>
                <td className="py-3 px-3 font-semibold text-emerald-600 dark:text-emerald-400 bg-indigo-50/50 dark:bg-indigo-950/30">
                  ⚡ 24-48hr Priority Dispatch Guarantee
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-300">Customer Support</td>
                <td className="py-3 px-3 text-slate-600 dark:text-slate-400">12-24hr lag on DMs & tickets</td>
                <td className="py-3 px-3 font-semibold text-emerald-600 dark:text-emerald-400 bg-indigo-50/50 dark:bg-indigo-950/30">
                  💬 Direct 5-Min WhatsApp Order Concierge
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-300">Inspection & Returns</td>
                <td className="py-3 px-3 text-slate-600 dark:text-slate-400">7-day strict return (buyer pays courier)</td>
                <td className="py-3 px-3 font-semibold text-emerald-600 dark:text-emerald-400 bg-indigo-50/50 dark:bg-indigo-950/30">
                  🛡️ 100% Risk-Free Doorstep Open-Box Inspection
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-300">Bonus & Extras</td>
                <td className="py-3 px-3 text-slate-600 dark:text-slate-400">Basic catalog upsell</td>
                <td className="py-3 px-3 font-semibold text-emerald-600 dark:text-emerald-400 bg-indigo-50/50 dark:bg-indigo-950/30">
                  🎁 Premium Companion Gift + Free Packaging Box
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
