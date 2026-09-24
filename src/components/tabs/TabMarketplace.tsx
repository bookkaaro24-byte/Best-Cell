import React, { useState } from 'react';
import { 
  Store, 
  Copy, 
  Check, 
  Download, 
  ExternalLink,
  ShieldCheck,
  Tag, 
  Layers, 
  CheckCircle2,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { MarketplaceListingData } from '../../types';
import { copyToClipboard } from '../../utils/exportBundle';

interface TabMarketplaceProps {
  marketplaceData?: Record<string, any>;
  productName: string;
  price?: number;
  currency?: string;
}

type Platform = 'bookkaaro' | 'shopify' | 'daraz' | 'facebookMarketplace' | 'generic';

interface PlatformInfo {
  id: Platform;
  label: string;
  sub: string;
  url?: string;
  badge?: string;
  color: string;
}

const PLATFORMS: PlatformInfo[] = [
  { 
    id: 'bookkaaro', 
    label: 'Book Kaaro', 
    sub: 'Digital Marketplace',
    url: 'https://bookkaaro.com',
    badge: 'Official / Premier',
    color: 'from-indigo-600 to-violet-600'
  },
  { 
    id: 'shopify', 
    label: 'Shopify', 
    sub: 'D2C Storefront',
    color: 'from-emerald-600 to-teal-600'
  },
  { 
    id: 'daraz', 
    label: 'Daraz Mall', 
    sub: 'South Asia Marketplace',
    color: 'from-orange-500 to-amber-600'
  },
  { 
    id: 'facebookMarketplace', 
    label: 'FB Marketplace', 
    sub: 'Social Selling & Groups',
    color: 'from-blue-600 to-indigo-600'
  },
  { 
    id: 'generic', 
    label: 'WooCommerce', 
    sub: 'Standard E-commerce',
    color: 'from-purple-600 to-pink-600'
  },
];

export const TabMarketplace: React.FC<TabMarketplaceProps> = ({
  marketplaceData = {},
  productName,
  price,
  currency = "PKR"
}) => {
  const [activePlatform, setActivePlatform] = useState<Platform>('bookkaaro');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Helper to find listing from varied keys in data
  const findRawListing = (platformId: Platform) => {
    if (!marketplaceData) return null;
    if (platformId === 'bookkaaro') {
      return marketplaceData['Book Kaaro'] || 
             marketplaceData['bookkaaro'] || 
             marketplaceData['BookKaaro'] || 
             marketplaceData['book_kaaro'] || 
             null;
    }
    if (platformId === 'shopify') {
      return marketplaceData['Shopify'] || marketplaceData['shopify'] || null;
    }
    if (platformId === 'daraz') {
      return marketplaceData['Daraz'] || marketplaceData['daraz'] || null;
    }
    if (platformId === 'facebookMarketplace') {
      return marketplaceData['Facebook Marketplace'] || 
             marketplaceData['facebookMarketplace'] || 
             marketplaceData['facebook'] || 
             null;
    }
    if (platformId === 'generic') {
      return marketplaceData['WooCommerce'] || 
             marketplaceData['Generic Online Store'] || 
             marketplaceData['generic'] || 
             null;
    }
    return marketplaceData[platformId] || null;
  };

  const rawListing = findRawListing(activePlatform) || {};

  // Build high-quality default listing if not present in campaign
  const isBookKaaro = activePlatform === 'bookkaaro';

  const defaultTitle = isBookKaaro
    ? `${productName} | Verified Listing on Book Kaaro Digital Marketplace`
    : activePlatform === 'shopify'
    ? `${productName} | Premium Quality Online`
    : activePlatform === 'daraz'
    ? `[ORIGINAL] ${productName} - Premium Quality with Fast Delivery`
    : activePlatform === 'facebookMarketplace'
    ? `${productName} (Brand New) - Cash on Delivery Available`
    : `${productName} - Official Online Store`;

  const defaultShortDesc = isBookKaaro
    ? `Verified vendor listing on Book Kaaro Digital Marketplace (https://bookkaaro.com). Authentic product, express nationwide delivery, and direct buyer protection.`
    : `Experience superior craftsmanship and durability with ${productName}. 100% brand new with satisfaction guarantee.`;

  const defaultFullDesc = isBookKaaro
    ? `Welcome to the official verified listing for ${productName} on Book Kaaro Digital Marketplace (https://bookkaaro.com).\n\nKey Highlights:\n• Verified vendor with quality check on delivery\n• Fast doorstep dispatch across all cities\n• Cash on Delivery (COD) and secure payment available\n• Direct customer support and tracking on Book Kaaro`
    : `Introducing the ${productName}.\n\nBuilt for daily use and designed to impress. Every piece undergoes thorough quality assessment before packing to ensure you receive flawless quality.`;

  const defaultBullets = isBookKaaro ? [
    "Verified Seller on Book Kaaro Digital Marketplace (bookkaaro.com)",
    "Direct WhatsApp / Call Seller Inquiry Support",
    "Cash on Delivery (COD) Nationwide & Express Dispatch",
    "Authentic Quality Check & Buyer Protection Guaranteed"
  ] : [
    "Premium quality material and refined finishing",
    "Engineered for durable, everyday reliability",
    "Cash on Delivery & rapid doorstep shipping",
    "Friendly customer support and hassle-free returns"
  ];

  const defaultSpecs = isBookKaaro ? {
    "Platform": "Book Kaaro Digital Marketplace (bookkaaro.com)",
    "Condition": "100% Brand New",
    "Seller Status": "Verified Merchant",
    "Delivery": "Express Courier with Tracking",
    "Payment Options": "Cash on Delivery / Online Transfer"
  } : {
    "Condition": "Brand New",
    "Availability": "In Stock",
    "Dispatch": "Within 24 Hours",
    "Delivery": "Courier Delivery (COD)"
  };

  const defaultTags = isBookKaaro 
    ? ["bookkaaro", "book_kaaro", "digital_marketplace", productName.toLowerCase().replace(/\s+/g, '_'), "verified_product", "pakistan_shopping"]
    : [productName.toLowerCase().replace(/\s+/g, '_'), "deals", "online_shopping", "trending"];

  const listing: MarketplaceListingData = {
    platform: rawListing.platform || (isBookKaaro ? 'Book Kaaro Digital Marketplace' : activePlatform),
    marketplaceUrl: rawListing.marketplaceUrl || (isBookKaaro ? 'https://bookkaaro.com' : undefined),
    title: rawListing.title || rawListing.productTitle || defaultTitle,
    shortDescription: rawListing.shortDescription || defaultShortDesc,
    fullDescription: rawListing.fullDescription || rawListing.fullDescriptionHtml || defaultFullDesc,
    bulletFeatures: (rawListing.bulletFeatures && rawListing.bulletFeatures.length > 0) ? rawListing.bulletFeatures : defaultBullets,
    specifications: (rawListing.specifications && Object.keys(rawListing.specifications).length > 0) ? rawListing.specifications : defaultSpecs,
    tags: (rawListing.tags && rawListing.tags.length > 0) ? rawListing.tags : (rawListing.searchKeywords || defaultTags),
    seoTitle: rawListing.seoTitle || (isBookKaaro ? `Buy ${productName} Online - Book Kaaro Marketplace` : `${productName} Online Price`),
    seoMetaDescription: rawListing.seoMetaDescription || rawListing.metaDescription || (isBookKaaro ? `Buy authentic ${productName} on Book Kaaro Digital Marketplace (https://bookkaaro.com). Verified vendor, best pricing & rapid COD delivery.` : defaultShortDesc),
    category: rawListing.category || (isBookKaaro ? 'Digital & Retail Marketplace' : 'General Merchandise')
  };

  const handleCopy = async (key: string, text: string) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const getFullListingText = () => {
    const urlLine = listing.marketplaceUrl ? `MARKETPLACE URL: ${listing.marketplaceUrl}\n` : '';
    return `PLATFORM: ${listing.platform.toUpperCase()}
${urlLine}TITLE: ${listing.title}
CATEGORY: ${listing.category}
PRICE: ${price ? `${currency} ${price.toLocaleString()}` : 'Contact for Price'}

SHORT DESCRIPTION / OVERVIEW:
${listing.shortDescription}

FULL DESCRIPTION:
${listing.fullDescription}

KEY BULLET FEATURES:
${(listing.bulletFeatures || []).map((b: string) => `• ${b}`).join('\n')}

SPECIFICATIONS & ATTRIBUTES:
${Object.entries(listing.specifications || {}).map(([k, v]) => `${k}: ${String(v)}`).join('\n')}

SEO META TITLE:
${listing.seoTitle}

SEO META DESCRIPTION:
${listing.seoMetaDescription}

SEARCH KEYWORDS & TAGS:
${(listing.tags || []).join(', ')}`;
  };

  const downloadListingText = () => {
    const text = getFullListingText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${productName.replace(/\s+/g, '_')}_${activePlatform}_listing.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const currentPlatformInfo = PLATFORMS.find(p => p.id === activePlatform) || PLATFORMS[0];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
            <Store className="w-5 h-5 text-indigo-600" />
            <span>Marketplace Listing Generator</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Pre-formatted titles, descriptions, specifications, and SEO metadata ready for instant listing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activePlatform === 'bookkaaro' && (
            <a
              href="https://bookkaaro.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <span>Visit bookkaaro.com</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          <button
            onClick={() => handleCopy('all-listing', getFullListingText())}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-1.5 shadow-sm shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer"
          >
            {copiedKey === 'all-listing' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === 'all-listing' ? "Copied!" : "Copy Full Listing"}</span>
          </button>

          <button
            onClick={downloadListingText}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>.TXT</span>
          </button>
        </div>
      </div>

      {/* Platform Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {PLATFORMS.map((p) => {
          const isSelected = activePlatform === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setActivePlatform(p.id)}
              className={`relative p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/50 shadow-xs ring-2 ring-indigo-600/20'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
              }`}
            >
              {p.badge && (
                <span className="absolute -top-2 right-2 px-1.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-xs">
                  {p.badge}
                </span>
              )}
              <div className="flex items-center gap-1.5">
                {p.id === 'bookkaaro' ? (
                  <ShoppingBag className="w-4 h-4 text-indigo-600 shrink-0" />
                ) : (
                  <Store className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span className={`font-bold text-xs truncate ${isSelected ? 'text-indigo-950 dark:text-indigo-100 font-extrabold' : 'text-slate-800 dark:text-slate-200'}`}>
                  {p.label}
                </span>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 truncate">
                {p.sub}
              </div>
            </button>
          );
        })}
      </div>

      {/* Book Kaaro Spotlight Banner if active */}
      {isBookKaaro && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 text-white shadow-md flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center border border-white/20">
              <ShoppingBag className="w-5 h-5 text-indigo-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-display font-bold text-sm text-white">Book Kaaro Digital Marketplace</h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/40 text-indigo-100 border border-indigo-400/30">
                  Verified Format
                </span>
              </div>
              <p className="text-xs text-indigo-200 mt-0.5">
                Official listing template optimized for high trust, rapid checkout, and direct buyer inquiries on{' '}
                <a 
                  href="https://bookkaaro.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="underline font-semibold hover:text-white"
                >
                  bookkaaro.com
                </a>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://bookkaaro.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <span>Open bookkaaro.com</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* Listing Content Details */}
      <div className="space-y-6">
        
        {/* Title & Category Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {currentPlatformInfo.label} Listing Title
              </span>
              {isBookKaaro && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  SEO & High-Click Rate
                </span>
              )}
            </div>
            <button
              onClick={() => handleCopy('ltitle', listing.title || '')}
              className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1 cursor-pointer"
            >
              {copiedKey === 'ltitle' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy Title</span>
            </button>
          </div>
          <h4 className="font-bold text-base text-slate-900 dark:text-white leading-snug">
            {listing.title}
          </h4>
          <div className="mt-3 text-xs text-slate-500 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1">
              <span>Category:</span>
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">{listing.category}</span>
            </div>
            {price && (
              <div className="flex items-center gap-1">
                <span>Listed Price:</span>
                <span className="font-bold text-slate-900 dark:text-white">{currency} {price.toLocaleString()}</span>
              </div>
            )}
            {isBookKaaro && (
              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Book Kaaro Buyer Protection Ready</span>
              </div>
            )}
          </div>
        </div>

        {/* Full Listing Body & Bullets */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Description (7 cols) */}
          <div className="lg:col-span-7 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Item Description (Plain / HTML)
              </span>
              <button
                onClick={() => handleCopy('ldesc', listing.fullDescription || '')}
                className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === 'ldesc' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Description</span>
              </button>
            </div>

            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {listing.fullDescription}
            </p>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Key Bullet Points & Trust Highlights
                </span>
                <button
                  onClick={() => handleCopy('lbullets', (listing.bulletFeatures || []).map(b => `• ${b}`).join('\n'))}
                  className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === 'lbullets' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Bullets</span>
                </button>
              </div>
              <ul className="space-y-2">
                {(listing.bulletFeatures || []).map((b: string, i: number) => (
                  <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="leading-snug">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Specs & SEO (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Specifications Table */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Specification Table
                </span>
                <button
                  onClick={() => handleCopy('lspecs', Object.entries(listing.specifications || {}).map(([k, v]) => `${k}: ${v}`).join('\n'))}
                  className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === 'lspecs' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Specs</span>
                </button>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {Object.entries(listing.specifications || {}).map(([key, val]) => (
                  <div key={key} className="py-2 flex items-center justify-between gap-2">
                    <span className="text-slate-500 shrink-0">{key}:</span>
                    <span className="font-semibold text-slate-900 dark:text-white text-right truncate">{String(val)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SEO Meta */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  SEO & Search Visibility
                </span>
                <button
                  onClick={() => handleCopy('lseo', `TITLE: ${listing.seoTitle}\nDESCRIPTION: ${listing.seoMetaDescription}`)}
                  className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === 'lseo' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy SEO</span>
                </button>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 block mb-0.5">Meta Title:</span>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 p-2 rounded-lg">
                  {listing.seoTitle}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 block mb-0.5">Meta Description:</span>
                <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-2 rounded-lg">
                  {listing.seoMetaDescription}
                </p>
              </div>
            </div>

            {/* Tags */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Search Tags & Keywords ({listing.tags?.length || 0})
                </span>
                <button
                  onClick={() => handleCopy('ltags', (listing.tags || []).join(', '))}
                  className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === 'ltags' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Tags</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(listing.tags || []).map((tag: string, i: number) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-[11px] font-medium border border-indigo-100 dark:border-indigo-900/50"
                  >
                    #{tag.replace(/^#/, '')}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
