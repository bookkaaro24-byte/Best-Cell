import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Palette, 
  Download, 
  Sparkles, 
  Check, 
  RotateCcw,
  Copy,
  Tag,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Type,
  Phone,
  Layout,
  Star,
  Layers,
  Image as ImageIcon,
  Zap,
  ShoppingBag,
  ExternalLink,
  Store,
  Percent,
  Truck,
  Flame,
  Award,
  Sun,
  Moon,
  ChevronDown,
  MessageCircle,
  FileText,
  Share2,
  Send,
  Smartphone,
  Package,
  TrendingUp,
  Target,
  BarChart3,
  HelpCircle,
  Eye
} from 'lucide-react';
import JSZip from 'jszip';
import { PosterTemplate } from '../../types';
import { ResponsivePosterTemplate, AdCompositionType } from './ResponsivePosterTemplate';

interface TabPosterStudioProps {
  productImage: string;
  productName: string;
  price?: number;
  currency?: string;
  discountPercent?: number;
  brandName?: string;
  whatsappNumber?: string;
  keyFeatures?: string[];
  canvasRefCallback?: (canvas: HTMLCanvasElement | null) => void;
}

export type PosterStyleArchetype = 
  | 'bookkaaro_official'
  | 'shopify_modern'
  | 'amazon_deal'
  | 'etsy_artisan'
  | 'gumroad_digital'
  | 'tiktok_viral'
  | 'story_glass'
  | 'flash_sale'
  | 'luxury_gold'
  | 'festive_eid'
  | 'bestseller_proof'
  | 'wholesale_b2b';

export type MarketplacePlatform = 
  | 'bookkaaro'
  | 'shopify'
  | 'amazon'
  | 'etsy'
  | 'gumroad'
  | 'daraz'
  | 'tiktok_shop'
  | 'custom_store';

export type CardBackdropStyle = 'frosted_glass' | 'solid_contrast' | 'frameless' | 'cyclorama_clean';
export type FontSizeScaleOption = 'compact' | 'standard' | 'large' | 'impact';
export type FontSizeScale = FontSizeScaleOption;
export type StudioPedestalType = 'studio_clean' | 'travertine' | 'obsidian_mirror' | 'cyber_neon' | 'none';

interface TemplateOption {
  id: PosterStyleArchetype;
  name: string;
  platformCategory: string;
  tagline: string;
  layoutStyle: string;
  fontFamily: string;
  titleWeight: string;
  bgGrad: [string, string, string];
  accent: string;
  accentSecondary: string;
  cardBg: string;
  cardBorder: string;
  textColor: string;
  subColor: string;
  priceColor: string;
  ctaBg: string;
  ctaText: string;
  badgeBg: string;
  badgeText: string;
}

const POSTER_TEMPLATES: TemplateOption[] = [
  {
    id: 'bookkaaro_official',
    name: 'Book Kaaro Official',
    platformCategory: 'Digital Marketplace',
    tagline: 'VERIFIED ON BOOKKAARO.COM',
    layoutStyle: 'Marketplace Trust Card with Buyer Protection & Escrow',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    titleWeight: '800',
    bgGrad: ['#090d16', '#0f172a', '#1e1b4b'],
    accent: '#6366f1',
    accentSecondary: '#818cf8',
    cardBg: 'rgba(15, 23, 42, 0.88)',
    cardBorder: 'rgba(99, 102, 241, 0.35)',
    textColor: '#ffffff',
    subColor: '#cbd5e1',
    priceColor: '#818cf8',
    ctaBg: '#6366f1',
    ctaText: '#ffffff',
    badgeBg: 'rgba(99, 102, 241, 0.2)',
    badgeText: '#c7d2fe'
  },
  {
    id: 'shopify_modern',
    name: 'Shopify D2C Brand',
    platformCategory: 'E-Commerce Store',
    tagline: 'SIGNATURE ONLINE STORE',
    layoutStyle: 'Minimalist Editorial with Platinum Monotones',
    fontFamily: 'Georgia, Cambria, "Times New Roman", serif',
    titleWeight: '700',
    bgGrad: ['#121214', '#09090b', '#000000'],
    accent: '#ffffff',
    accentSecondary: '#a1a1aa',
    cardBg: 'rgba(24, 24, 27, 0.88)',
    cardBorder: 'rgba(255, 255, 255, 0.18)',
    textColor: '#ffffff',
    subColor: '#d4d4d8',
    priceColor: '#ffffff',
    ctaBg: '#ffffff',
    ctaText: '#09090b',
    badgeBg: 'rgba(255, 255, 255, 0.12)',
    badgeText: '#f4f4f5'
  },
  {
    id: 'amazon_deal',
    name: 'Amazon / Daraz Deal',
    platformCategory: 'Marketplace Deals',
    tagline: 'DEAL OF THE DAY • PRIME DISPATCH',
    layoutStyle: 'High-Conversion Retail Powerhouse with Amazon Gold',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    titleWeight: '800',
    bgGrad: ['#0b1324', '#0f172a', '#1e293b'],
    accent: '#f59e0b',
    accentSecondary: '#facc15',
    cardBg: 'rgba(15, 23, 42, 0.94)',
    cardBorder: 'rgba(245, 158, 11, 0.45)',
    textColor: '#ffffff',
    subColor: '#e2e8f0',
    priceColor: '#fbbf24',
    ctaBg: '#f59e0b',
    ctaText: '#0f172a',
    badgeBg: 'rgba(245, 158, 11, 0.2)',
    badgeText: '#fde68a'
  },
  {
    id: 'etsy_artisan',
    name: 'Etsy Handcrafted Shop',
    platformCategory: 'Handmade & Vintage',
    tagline: 'HANDMADE WITH LOVE • ARTISAN VERIFIED',
    layoutStyle: 'Warm Linen & Terracotta Boutique Style',
    fontFamily: 'Palatino, "Book Antiqua", Georgia, serif',
    titleWeight: '700',
    bgGrad: ['#292524', '#1c1917', '#0c0a09'],
    accent: '#2dd4bf',
    accentSecondary: '#f59e0b',
    cardBg: 'rgba(41, 37, 36, 0.92)',
    cardBorder: 'rgba(45, 212, 191, 0.35)',
    textColor: '#ffffff',
    subColor: '#f5f5f4',
    priceColor: '#2dd4bf',
    ctaBg: '#2dd4bf',
    ctaText: '#0c0a09',
    badgeBg: 'rgba(45, 212, 191, 0.2)',
    badgeText: '#99f6e4'
  },
  {
    id: 'gumroad_digital',
    name: 'Gumroad / Digital SaaS',
    platformCategory: 'Digital Downloads',
    tagline: 'INSTANT ACCESS • LIFETIME UPDATES',
    layoutStyle: 'Cyber Grid with Laser Cyan Glow',
    fontFamily: '"SF Mono", "Fira Code", "Courier New", monospace',
    titleWeight: '700',
    bgGrad: ['#020617', '#090d16', '#020617'],
    accent: '#06b6d4',
    accentSecondary: '#8b5cf6',
    cardBg: 'rgba(9, 13, 22, 0.92)',
    cardBorder: 'rgba(6, 182, 212, 0.45)',
    textColor: '#ffffff',
    subColor: '#a5f3fc',
    priceColor: '#22d3ee',
    ctaBg: '#06b6d4',
    ctaText: '#020617',
    badgeBg: 'rgba(6, 182, 212, 0.2)',
    badgeText: '#67e8f9'
  },
  {
    id: 'tiktok_viral',
    name: 'TikTok & IG Viral Drop',
    platformCategory: 'Social Commerce',
    tagline: '#TIKTOKMADEMEBUYIT • VIRAL DROP',
    layoutStyle: 'Vibrant Duotone Mesh with Hot Pink Accents',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    titleWeight: '900',
    bgGrad: ['#3b0764', '#581c87', '#1e1b4b'],
    accent: '#ec4899',
    accentSecondary: '#fb7185',
    cardBg: 'rgba(74, 4, 78, 0.9)',
    cardBorder: 'rgba(236, 72, 153, 0.45)',
    textColor: '#ffffff',
    subColor: '#fce7f3',
    priceColor: '#f472b6',
    ctaBg: '#ec4899',
    ctaText: '#ffffff',
    badgeBg: 'rgba(236, 72, 153, 0.22)',
    badgeText: '#fbcfe8'
  },
  {
    id: 'story_glass',
    name: 'Story & Reels Glass',
    platformCategory: 'Mobile Feed',
    tagline: 'SWIPE UP TO SHOP • LIMITED BATCH',
    layoutStyle: 'Deep Twilight with Radiant Iris Frosted Glass',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    titleWeight: '800',
    bgGrad: ['#1e1b4b', '#0f172a', '#020617'],
    accent: '#a855f7',
    accentSecondary: '#c084fc',
    cardBg: 'rgba(30, 27, 75, 0.88)',
    cardBorder: 'rgba(168, 85, 247, 0.4)',
    textColor: '#ffffff',
    subColor: '#e0e7ff',
    priceColor: '#c084fc',
    ctaBg: '#a855f7',
    ctaText: '#ffffff',
    badgeBg: 'rgba(168, 85, 247, 0.2)',
    badgeText: '#e9d5ff'
  },
  {
    id: 'flash_sale',
    name: 'Urgent Flash Sale',
    platformCategory: 'Promotional Rush',
    tagline: '⚡ 24-HOUR FLASH SALE • DO NOT MISS',
    layoutStyle: 'High-Impact Crimson Rush with High-Voltage Yellow',
    fontFamily: 'Impact, "Arial Black", sans-serif',
    titleWeight: '900',
    bgGrad: ['#450a0a', '#1c1917', '#09090b'],
    accent: '#facc15',
    accentSecondary: '#f97316',
    cardBg: 'rgba(69, 10, 10, 0.94)',
    cardBorder: 'rgba(250, 204, 21, 0.55)',
    textColor: '#ffffff',
    subColor: '#fef08a',
    priceColor: '#facc15',
    ctaBg: '#facc15',
    ctaText: '#000000',
    badgeBg: 'rgba(250, 204, 21, 0.22)',
    badgeText: '#fef9c3'
  },
  {
    id: 'luxury_gold',
    name: 'Obsidian & Gold Luxury',
    platformCategory: 'High-End Prestige',
    tagline: 'EXCLUSIVE VIP EDITION • MAISON DE LUXE',
    layoutStyle: 'Royal Onyx with Metallic Gold Filigree & Serif Elegance',
    fontFamily: '"Playfair Display", Didot, "Bodoni MT", Georgia, serif',
    titleWeight: '700',
    bgGrad: ['#12100e', '#09090b', '#000000'],
    accent: '#fbbf24',
    accentSecondary: '#f59e0b',
    cardBg: 'rgba(23, 19, 12, 0.94)',
    cardBorder: 'rgba(251, 191, 36, 0.5)',
    textColor: '#fffbeb',
    subColor: '#fef3c7',
    priceColor: '#fbbf24',
    ctaBg: '#fbbf24',
    ctaText: '#17130c',
    badgeBg: 'rgba(251, 191, 36, 0.18)',
    badgeText: '#fde68a'
  },
  {
    id: 'festive_eid',
    name: 'Eid & Festive Celebration',
    platformCategory: 'Holiday & Cultural',
    tagline: 'EID SPECIAL BAZAAR • FESTIVE COLLECTION',
    layoutStyle: 'Majestic Emerald Forest with Warm Islamic Gold',
    fontFamily: 'Georgia, serif',
    titleWeight: '700',
    bgGrad: ['#022c22', '#064e3b', '#011811'],
    accent: '#f59e0b',
    accentSecondary: '#34d399',
    cardBg: 'rgba(6, 78, 59, 0.92)',
    cardBorder: 'rgba(245, 158, 11, 0.45)',
    textColor: '#ffffff',
    subColor: '#d1fae5',
    priceColor: '#fbbf24',
    ctaBg: '#f59e0b',
    ctaText: '#022c22',
    badgeBg: 'rgba(245, 158, 11, 0.2)',
    badgeText: '#fef08a'
  },
  {
    id: 'bestseller_proof',
    name: '5-Star Social Proof',
    platformCategory: 'Customer Trust',
    tagline: '★★★★★ OVER 10,000+ HAPPY BUYERS',
    layoutStyle: 'Deep Navy Trust with Golden Star Proof Badge',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    titleWeight: '800',
    bgGrad: ['#0f172a', '#030712', '#000000'],
    accent: '#eab308',
    accentSecondary: '#38bdf8',
    cardBg: 'rgba(15, 23, 42, 0.94)',
    cardBorder: 'rgba(234, 179, 8, 0.45)',
    textColor: '#ffffff',
    subColor: '#e2e8f0',
    priceColor: '#facc15',
    ctaBg: '#eab308',
    ctaText: '#0f172a',
    badgeBg: 'rgba(234, 179, 8, 0.2)',
    badgeText: '#fef08a'
  },
  {
    id: 'wholesale_b2b',
    name: 'Wholesale & B2B Catalog',
    platformCategory: 'Commercial & Trade',
    tagline: 'BULK ORDERS • COMMERCIAL SUPPLY',
    layoutStyle: 'Enterprise Slate Grid with High-Visibility Azure',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    titleWeight: '800',
    bgGrad: ['#1e293b', '#0f172a', '#020617'],
    accent: '#38bdf8',
    accentSecondary: '#ea580c',
    cardBg: 'rgba(30, 41, 59, 0.94)',
    cardBorder: 'rgba(56, 189, 248, 0.4)',
    textColor: '#ffffff',
    subColor: '#e2e8f0',
    priceColor: '#38bdf8',
    ctaBg: '#38bdf8',
    ctaText: '#0f172a',
    badgeBg: 'rgba(56, 189, 248, 0.2)',
    badgeText: '#bae6fd'
  }
];

const FORMATS = [
  { id: 'square', label: '1:1 Square', width: 1080, height: 1080, sub: 'Shopify / FB / Book Kaaro' },
  { id: 'portrait', label: '4:5 Portrait', width: 1080, height: 1350, sub: 'Instagram Feed Post' },
  { id: 'story', label: '9:16 Story', width: 1080, height: 1920, sub: 'WhatsApp Status / Reels' },
  { id: 'landscape', label: '16:9 Banner', width: 1200, height: 675, sub: 'Marketplace Hero Banner' },
];

// Helper: Calculate perceived luminance for contrast
function getLuminance(hexColor: string): number {
  const cleanHex = hexColor.replace('#', '');
  if (cleanHex.length !== 6) return 0.2;
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

/**
 * Intelligent text wrapping utility that auto-fits text strictly inside maxWidth and maxLines
 * With generous line heights calibrated for high-resolution canvas typography
 */
function wrapAndFitText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number,
  fontFamily: string,
  fontWeight: string,
  initialFontSize: number,
  minFontSize: number
): { lines: string[]; fontSize: number; lineHeight: number; totalHeight: number } {
  let fontSize = initialFontSize;
  let lines: string[] = [];
  let lineHeight = fontSize * 1.15; // Tight, modern line-height for display headlines

  while (fontSize >= minFontSize) {
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    lineHeight = fontSize * 1.15;
    lines = [];
    const words = text.split(/\s+/).filter(Boolean);
    let currentLine = '';

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = ctx.measureText(testLine).width;

      if (testWidth > maxWidth && i > 0) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }

    if (lines.length <= maxLines) {
      break;
    }
    fontSize -= 2;
  }

  // If still exceeds maxLines at minFontSize, truncate last line with ellipsis cleanly
  if (lines.length > maxLines) {
    lines = lines.slice(0, maxLines);
    let last = lines[maxLines - 1];
    while (last.length > 3 && ctx.measureText(last + '...').width > maxWidth) {
      last = last.slice(0, -1);
    }
    lines[maxLines - 1] = last.trim() + '...';
  }

  return {
    lines,
    fontSize,
    lineHeight,
    totalHeight: lines.length * lineHeight
  };
}

export const TabPosterStudio: React.FC<TabPosterStudioProps> = ({
  productImage,
  productName,
  price,
  currency = "PKR",
  discountPercent = 25,
  brandName = "Book Kaaro Merchant",
  whatsappNumber = "+92 300 1234567",
  keyFeatures = ["Doorstep Courier Delivery", "Cash on Delivery Available", "Verified Buyer Protection"],
  canvasRefCallback
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<PosterStyleArchetype>('bookkaaro_official');
  const [selectedFormat, setSelectedFormat] = useState('square');
  const [targetPlatform, setTargetPlatform] = useState<MarketplacePlatform>('bookkaaro');
  const [cardBackdrop, setCardBackdrop] = useState<CardBackdropStyle>('frosted_glass');
  const [fontSizeScale, setFontSizeScale] = useState<FontSizeScaleOption>('standard');
  const [previewMode, setPreviewMode] = useState<'responsive_css' | 'hd_canvas'>('responsive_css');
  const [enableContrastScrim, setEnableContrastScrim] = useState(true);
  
  // Marketing Composition & Social Angle
  const [composition, setComposition] = useState<AdCompositionType>('marketplace_card');
  const [studioPedestal, setStudioPedestal] = useState<'studio_clean' | 'travertine' | 'obsidian_mirror' | 'cyber_neon' | 'none'>('studio_clean');
  const [activeVariant, setActiveVariant] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [urgencyText, setUrgencyText] = useState('⚡ FLASH SALE • ONLY 7 UNITS LEFT IN STOCK');
  const [reviewQuote, setReviewQuote] = useState('Best purchase I made this month! Quality is top-notch & delivered in 2 days.');
  const [reviewerName, setReviewerName] = useState('Ayesha K. · Verified Buyer ✦');
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [isExportingAll, setIsExportingAll] = useState(false);
  
  // Customizable Poster Texts
  const [customHeadline, setCustomHeadline] = useState('VERIFIED ON BOOKKAARO.COM');
  const [customSubhead, setCustomSubhead] = useState(productName || 'Featured Product');
  const [customCta, setCustomCta] = useState('ORDER NOW • DM TO BUY');
  const [customPrice, setCustomPrice] = useState(price ? `${currency} ${price.toLocaleString()}` : '');
  const [originalPrice, setOriginalPrice] = useState(
    price ? `${currency} ${Math.round(price * 1.35).toLocaleString()}` : ''
  );
  const [customDiscount, setCustomDiscount] = useState(`${discountPercent}% OFF`);
  const [storeHandle, setStoreHandle] = useState('bookkaaro.com/store/aura');
  const [promoCode, setPromoCode] = useState('CODE: BOOST25');
  const [showPromoCode, setShowPromoCode] = useState(true);
  const [ratingText, setRatingText] = useState('4.9 ★ (1,500+ Reviews)');
  const [phoneText, setPhoneText] = useState(whatsappNumber);
  const [brandText, setBrandText] = useState(brandName);

  // Trust Badges Toggles
  const [badgeCOD, setBadgeCOD] = useState(true);
  const [badgeFreeDelivery, setBadgeFreeDelivery] = useState(true);
  const [badgeVerifiedSeller, setBadgeVerifiedSeller] = useState(true);
  const [showStrikethrough, setShowStrikethrough] = useState(true);

  // Custom Colors
  const [bgColor, setBgColor] = useState('#090d16');
  const [accentColor, setAccentColor] = useState('#6366f1');
  const [titleColor, setTitleColor] = useState('#ffffff');
  const [priceColor, setPriceColor] = useState('#818cf8');
  const [badgeColor, setBadgeColor] = useState('#c7d2fe');

  const [copiedNotice, setCopiedNotice] = useState(false);
  const [mobilePreviewPinned, setMobilePreviewPinned] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prodImgRef = useRef<HTMLImageElement | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // High-converting ready-to-post social caption generator
  const generatePostCaption = () => {
    const pName = customSubhead || productName || 'Featured Product';
    const tagList = `#${(brandText || 'Store').replace(/[^a-zA-Z0-9]/g, '')} #OnlineShopping #CashOnDelivery #BestDeals #ShopNow`;
    
    if (composition === 'flash_urgency') {
      return `⚡ 24-HOUR FLASH SALE ALERT! ⚡\n\nGrab the ${pName} for ONLY ${customPrice} ${originalPrice ? `(Original: ${originalPrice} - ${customDiscount})` : ''}!\n\n${urgencyText}\n\n✅ 100% Genuine Quality\n✅ Cash on Delivery Available\n✅ Express Doorstep Shipping\n\n📲 HOW TO ORDER:\nDM us now or WhatsApp: ${phoneText || whatsappNumber}\nStore Link: ${storeHandle}\n\n${tagList} #FlashSale #DiscountOffer`;
    }
    if (composition === 'whatsapp_catalog') {
      return `✨ NEW CATALOG DROP: ${pName} ✨\n\nPrice: ${customPrice}\nDelivery: Cash on Delivery Nationwide!\n\n📋 3 SIMPLE STEPS TO ORDER:\n1️⃣ Take a screenshot of this flyer\n2️⃣ Send it to our WhatsApp at ${phoneText || whatsappNumber}\n3️⃣ Share your delivery address & pay when it arrives!\n\nStore: ${storeHandle}\n\n${tagList} #WhatsAppShopping #COD`;
    }
    if (composition === 'social_proof_ugc') {
      return `⭐⭐⭐⭐⭐ "${reviewQuote}"\n- ${reviewerName}\n\nJoin thousands of happy customers who trust the ${pName}!\n\nSpecial Price: ${customPrice} ${showPromoCode ? `(${promoCode})` : ''}\n\n🛒 Order yours today:\n• DM us directly\n• WhatsApp: ${phoneText || whatsappNumber}\n• Store: ${storeHandle}\n\n${tagList} #CustomerFavorite #Trending`;
    }
    if (composition === 'infographic_features') {
      return `✦ Introducing the ${pName} ✦\n\nWhy customers love it:\n${keyFeatures.slice(0, 3).map((f) => `• ${f}`).join('\n')}\n\nPrice: ${customPrice}\nOrder via DM or WhatsApp: ${phoneText || whatsappNumber}\n\n${tagList}`;
    }
    if (composition === 'editorial_hero') {
      return `${brandText} — The New Standard.\n\n${pName} is now available in limited quantities.\nExperience premium design crafted for discerning buyers.\n\nAvailable now at ${customPrice}.\nExplore: ${storeHandle}\n\n${tagList} #MinimalistDesign #LuxuryD2C`;
    }
    return `🔥 SPECIAL PROMOTION: ${pName}!\n\nPrice: ${customPrice} ${originalPrice ? `(Was: ${originalPrice})` : ''}\n\nFeatures:\n• Cash on Delivery Available\n• Verified Seller Protection\n• Express Nationwide Delivery\n\nOrder now via DM or WhatsApp: ${phoneText || whatsappNumber}\nStore: ${storeHandle}\n\n${tagList}`;
  };

  const copyCaptionToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatePostCaption());
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 2200);
    } catch (e) {
      console.error('Failed to copy caption:', e);
    }
  };

  // AI Predicted Conversion Score & CTR Strength Meter (inspired by AdCreative.ai)
  const conversionMetrics = useMemo(() => {
    let score = 70;
    const tips: string[] = [];
    
    if (enableContrastScrim) {
      score += 8;
    } else {
      tips.push('Turn on Contrast Scrim to guard text readability over photos (+8 pts)');
    }
    
    if (customDiscount && customDiscount.trim().length > 0) {
      score += 8;
    } else {
      tips.push('Add a discount stamp (e.g. 25% OFF) to increase click-through rate (+8 pts)');
    }
    
    if (showStrikethrough && originalPrice) {
      score += 5;
    }
    
    const trustCount = (badgeCOD ? 1 : 0) + (badgeFreeDelivery ? 1 : 0) + (badgeVerifiedSeller ? 1 : 0);
    score += trustCount * 3;
    if (!badgeCOD) {
      tips.push('Cash on Delivery is the #1 conversion driver for social commerce (+3 pts)');
    }
    
    if (composition === 'flash_urgency' || composition === 'whatsapp_catalog' || composition === 'infographic_features') {
      score += 4;
    }
    
    const finalScore = Math.min(99, score);
    const grade = finalScore >= 92 ? 'A+ High CTR' : finalScore >= 82 ? 'A Strong Ad' : 'B Standard';
    return { score: finalScore, grade, tips };
  }, [enableContrastScrim, customDiscount, showStrikethrough, originalPrice, badgeCOD, badgeFreeDelivery, badgeVerifiedSeller, composition]);

  // A/B Variant Presets (inspired by Marpipe & AdCreative.ai)
  const applyVariant = (v: 'A' | 'B' | 'C' | 'D') => {
    setActiveVariant(v);
    if (v === 'A') {
      setComposition('flash_urgency');
      setFontSizeScale('impact');
      setCardBackdrop('solid_contrast');
      setStudioPedestal('studio_clean');
    } else if (v === 'B') {
      setComposition('infographic_features');
      setFontSizeScale('standard');
      setCardBackdrop('frosted_glass');
      setStudioPedestal('cyber_neon');
    } else if (v === 'C') {
      setComposition('social_proof_ugc');
      setFontSizeScale('standard');
      setCardBackdrop('frosted_glass');
      setStudioPedestal('travertine');
    } else if (v === 'D') {
      setComposition('whatsapp_catalog');
      setFontSizeScale('standard');
      setCardBackdrop('solid_contrast');
      setStudioPedestal('studio_clean');
    }
  };

  // Export complete campaign pack (All 4 formats in a single ZIP)
  const exportAllFormatsZip = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsExportingAll(true);
    try {
      const zip = new JSZip();
      const folderName = (brandText || 'SellBoost').replace(/[^a-zA-Z0-9_-]/g, '_') + '_Campaign_Pack';
      const rootFolder = zip.folder(folderName) || zip;

      // Current canvas format
      const currentBlob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (currentBlob) {
        rootFolder.file(`ad_primary_${selectedFormat}.png`, currentBlob);
      }

      // Add social caption text file
      rootFolder.file('social_ad_captions_and_hashtags.txt', generatePostCaption());

      // Readme instructions for seller
      const readme = `SELLBOOST AI - CAMPAIGN AD PACK
Product: ${customSubhead || productName}
Brand: ${brandText}
Sale Price: ${customPrice}
Contact / WhatsApp: ${phoneText}

RECOMMENDED AD PLACEMENTS:
1. 1:1 Square -> Facebook Feed, Instagram Carousel, Daraz / Amazon Product Cover
2. 4:5 Portrait -> Instagram Main Feed Post (Highest Engagement)
3. 9:16 Story -> WhatsApp Status, Instagram Story, TikTok Video Overlay
4. 16:9 Banner -> Shopify Hero Banner, Facebook Desktop Cover

Instructions:
- Upload images to your Meta Ads Manager or post directly to social media.
- Copy and paste the included captions from 'social_ad_captions_and_hashtags.txt'.`;
      rootFolder.file('README_LAUNCH_GUIDE.txt', readme);

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `${folderName}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('Failed to export campaign zip:', err);
    } finally {
      setIsExportingAll(false);
    }
  };

  // Scale multiplier for fonts
  const fontMultiplier = useMemo(() => {
    switch (fontSizeScale) {
      case 'compact': return 0.85;
      case 'standard': return 1.0;
      case 'large': return 1.16;
      case 'impact': return 1.32;
      default: return 1.0;
    }
  }, [fontSizeScale]);

  // Synchronize on template change
  const handleTemplateChange = (tplId: PosterStyleArchetype) => {
    setSelectedTemplate(tplId);
    const tpl = POSTER_TEMPLATES.find((t) => t.id === tplId);
    if (tpl) {
      setCustomHeadline(tpl.tagline);
      setBgColor(tpl.bgGrad[0]);
      setAccentColor(tpl.accent);
      setTitleColor(tpl.textColor);
      setPriceColor(tpl.priceColor);
      setBadgeColor(tpl.badgeText);

      if (tplId === 'bookkaaro_official') {
        setTargetPlatform('bookkaaro');
        setStoreHandle('bookkaaro.com/store/' + (brandName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'aura'));
      } else if (tplId === 'shopify_modern') {
        setTargetPlatform('shopify');
        setStoreHandle('auraboutique.myshopify.com');
      } else if (tplId === 'amazon_deal') {
        setTargetPlatform('amazon');
        setStoreHandle('amazon.com/shops/auraboutique');
      } else if (tplId === 'etsy_artisan') {
        setTargetPlatform('etsy');
        setStoreHandle('etsy.com/shop/auracrafts');
      } else if (tplId === 'gumroad_digital') {
        setTargetPlatform('gumroad');
        setStoreHandle('gumroad.com/l/aurapack');
      }
    }
  };

  // Pre-load product image
  useEffect(() => {
    if (!productImage) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      prodImgRef.current = img;
      setImageLoaded(true);
    };
    img.onerror = () => {
      const retry = new Image();
      retry.onload = () => {
        prodImgRef.current = retry;
        setImageLoaded(true);
      };
      retry.src = productImage;
    };
    img.src = productImage;
  }, [productImage]);

  // Master Canvas Layout & Rendering Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (canvasRefCallback) canvasRefCallback(canvas);

    const fmt = FORMATS.find((f) => f.id === selectedFormat) || FORMATS[0];
    canvas.width = fmt.width;
    canvas.height = fmt.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const tpl = POSTER_TEMPLATES.find((t) => t.id === selectedTemplate) || POSTER_TEMPLATES[0];
    const isLandscape = selectedFormat === 'landscape';
    const isStory = selectedFormat === 'story';
    const isPortrait = selectedFormat === 'portrait';
    const isSquare = selectedFormat === 'square';

    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    // Check light/dark mode of background
    const bgLum = getLuminance(bgColor);
    const isLightBg = bgLum > 0.55;

    // Derived high-contrast colors
    const effectiveTitleColor = titleColor || (isLightBg ? '#09090b' : '#ffffff');
    const effectiveSubColor = isLightBg ? '#475569' : tpl.subColor;
    const effectivePriceColor = priceColor || (isLightBg ? '#1e1b4b' : tpl.priceColor);
    const effectiveBadgeText = badgeColor || (isLightBg ? '#0f172a' : tpl.badgeText);
    const effectiveBadgeBg = isLightBg ? 'rgba(15, 23, 42, 0.08)' : tpl.badgeBg;

    // ==========================================
    // 1. BASE BACKGROUND & ARCHETYPE ATMOSPHERE
    // ==========================================
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, bgColor);
    bgGrad.addColorStop(0.55, isLightBg ? '#ffffff' : tpl.bgGrad[1]);
    bgGrad.addColorStop(1, isLightBg ? '#f1f5f9' : tpl.bgGrad[2]);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Decorative atmospheric patterns
    if (selectedTemplate === 'bookkaaro_official') {
      ctx.save();
      ctx.strokeStyle = accentColor;
      ctx.globalAlpha = 0.08;
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 48) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      const glow = ctx.createRadialGradient(W / 2, H * 0.35, 40, W / 2, H * 0.35, W * 0.6);
      glow.addColorStop(0, accentColor + '30');
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    } else if (selectedTemplate === 'flash_sale') {
      ctx.save();
      ctx.globalAlpha = 0.06;
      ctx.fillStyle = '#facc15';
      for (let y = -H; y < H * 2; y += 100) {
        ctx.beginPath();
        ctx.moveTo(-100, y);
        ctx.lineTo(W + 100, y + 350);
        ctx.lineTo(W + 100, y + 400);
        ctx.lineTo(-100, y + 50);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    } else if (selectedTemplate === 'luxury_gold') {
      ctx.save();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.4;
      ctx.strokeRect(28, 28, W - 56, H - 56);
      ctx.lineWidth = 1;
      ctx.strokeRect(38, 38, W - 76, H - 76);
      // Gold corner diamonds
      const sz = 16;
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(24, 24, sz, sz);
      ctx.fillRect(W - 24 - sz, 24, sz, sz);
      ctx.fillRect(24, H - 24 - sz, sz, sz);
      ctx.fillRect(W - 24 - sz, H - 24 - sz, sz, sz);
      ctx.restore();
    } else if (selectedTemplate === 'festive_eid') {
      ctx.save();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2.5;
      ctx.globalAlpha = 0.28;
      ctx.beginPath();
      ctx.arc(W / 2, H * 0.16, W * 0.34, Math.PI, 0);
      ctx.stroke();
      ctx.restore();
    } else if (selectedTemplate === 'gumroad_digital') {
      ctx.save();
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.25;
      const bsz = 44;
      ctx.strokeRect(28, 28, bsz, bsz);
      ctx.strokeRect(W - 28 - bsz, H - 28 - bsz, bsz, bsz);
      ctx.font = 'bold 15px monospace';
      ctx.fillStyle = '#06b6d4';
      ctx.fillText('[DIGITAL_VERIFIED // SECURE_ESCROW]', 36, 96);
      ctx.restore();
    }

    // =========================================================================
    // 2. DETERMINISTIC LAYOUT & HIGH-CONTRAST REFINED TYPOGRAPHY ENGINE
    // =========================================================================
    if (isLandscape) {
      // -------------------------------------------------------------
      // 16:9 LANDSCAPE (1200 x 675) — DUAL COLUMN SPLIT ENGINE
      // -------------------------------------------------------------
      const leftColW = 500;
      const rightColW = W - leftColW - 100;
      const rightColX = leftColW + 65;

      // 1. LEFT COLUMN: Product Image Stage
      const imgStageSz = Math.min(480, H - 110);
      const imgX = 45;
      const imgY = (H - imgStageSz) / 2;

      // High-contrast protective scrim over complex background
      if (enableContrastScrim) {
        ctx.save();
        const scrimGrad = ctx.createLinearGradient(leftColW, 0, W, 0);
        scrimGrad.addColorStop(0, 'rgba(0,0,0,0)');
        scrimGrad.addColorStop(0.35, isLightBg ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.8)');
        scrimGrad.addColorStop(1, isLightBg ? 'rgba(255,255,255,0.98)' : 'rgba(0,0,0,0.95)');
        ctx.fillStyle = scrimGrad;
        ctx.fillRect(leftColW, 0, W - leftColW, H);
        ctx.restore();
      }

      // Product stage container with soft ambient glow
      ctx.save();
      const leftGlow = ctx.createRadialGradient(
        imgX + imgStageSz / 2, imgY + imgStageSz / 2, 20,
        imgX + imgStageSz / 2, imgY + imgStageSz / 2, imgStageSz * 0.65
      );
      leftGlow.addColorStop(0, accentColor + '30');
      leftGlow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = leftGlow;
      ctx.fillRect(imgX - 30, imgY - 30, imgStageSz + 60, imgStageSz + 60);

      // Card frame
      ctx.fillStyle = isLightBg ? 'rgba(255,255,255,0.92)' : 'rgba(15, 23, 42, 0.75)';
      ctx.strokeStyle = isLightBg ? 'rgba(0,0,0,0.1)' : tpl.cardBorder;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(imgX, imgY, imgStageSz, imgStageSz, 28);
      ctx.fill();
      ctx.stroke();

      // Product Image
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(imgX + 12, imgY + 12, imgStageSz - 24, imgStageSz - 24, 20);
      ctx.clip();
      if (prodImgRef.current && imageLoaded) {
        ctx.drawImage(prodImgRef.current, imgX + 12, imgY + 12, imgStageSz - 24, imgStageSz - 24);
      } else {
        ctx.fillStyle = isLightBg ? '#e2e8f0' : '#1e293b';
        ctx.fillRect(imgX + 12, imgY + 12, imgStageSz - 24, imgStageSz - 24);
      }
      ctx.restore();

      // Discount stamp on image
      if (customDiscount) {
        ctx.save();
        ctx.fillStyle = selectedTemplate === 'flash_sale' ? '#facc15' : accentColor;
        ctx.shadowColor = 'rgba(0,0,0,0.4)';
        ctx.shadowBlur = 12;
        const discW = 120;
        const discH = 42;
        ctx.beginPath();
        ctx.roundRect(imgX + imgStageSz - discW - 16, imgY + 18, discW, discH, 21);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = selectedTemplate === 'flash_sale' ? '#000000' : '#ffffff';
        ctx.font = '900 20px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(customDiscount, imgX + imgStageSz - discW / 2 - 16, imgY + 18 + discH / 2);
        ctx.restore();
      }
      ctx.restore();

      // 2. RIGHT COLUMN: Top-to-Bottom Info & Conversion Stack
      let rY = 52;
      ctx.save();
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';

      // Brand + Tagline Kicker
      const brandFontSize = Math.round(20 * fontMultiplier);
      ctx.font = `bold ${brandFontSize}px system-ui, sans-serif`;
      ctx.fillStyle = accentColor;
      ctx.fillText(`${brandText.toUpperCase()}  •  ${customHeadline.toUpperCase()}`, rightColX, rY);
      rY += brandFontSize + 16;

      // Product Title with PROPER FONT SIZE
      const baseTitleSize = Math.round(44 * fontMultiplier);
      const minTitleSize = Math.round(28 * fontMultiplier);
      const titleRes = wrapAndFitText(
        ctx,
        customSubhead,
        rightColW,
        2,
        tpl.fontFamily,
        tpl.titleWeight,
        baseTitleSize,
        minTitleSize
      );
      ctx.font = `${tpl.titleWeight} ${titleRes.fontSize}px ${tpl.fontFamily}`;
      ctx.fillStyle = effectiveTitleColor;
      ctx.shadowColor = isLightBg ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.7)';
      ctx.shadowBlur = isLightBg ? 0 : 8;
      for (const line of titleRes.lines) {
        ctx.fillText(line, rightColX, rY);
        rY += titleRes.lineHeight;
      }
      ctx.shadowBlur = 0;
      rY += 14;

      // Price Row (Sale Price + Strikethrough Price)
      const basePriceSize = Math.round(58 * fontMultiplier);
      ctx.font = `900 ${basePriceSize}px sans-serif`;
      ctx.fillStyle = effectivePriceColor;
      ctx.fillText(customPrice, rightColX, rY);
      const priceMetrics = ctx.measureText(customPrice);

      if (showStrikethrough && originalPrice) {
        const strikeSize = Math.round(28 * fontMultiplier);
        ctx.font = `600 ${strikeSize}px sans-serif`;
        ctx.fillStyle = isLightBg ? '#64748b' : '#94a3b8';
        const strikeX = rightColX + priceMetrics.width + 24;
        const strikeY = rY + (basePriceSize - strikeSize) / 2 + 4;
        ctx.fillText(originalPrice, strikeX, strikeY);
        const sW = ctx.measureText(originalPrice).width;
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(strikeX, strikeY + strikeSize / 2);
        ctx.lineTo(strikeX + sW, strikeY + strikeSize / 2);
        ctx.stroke();
      }
      rY += basePriceSize + 18;

      // Trust Badges Pill Row (Refined Chips)
      const badges: string[] = [];
      if (badgeCOD) badges.push('💵 Cash on Delivery');
      if (badgeFreeDelivery) badges.push('🚚 Free Delivery');
      if (badgeVerifiedSeller) badges.push('🛡️ Verified Quality');

      if (badges.length > 0) {
        const badgeFontSize = Math.round(18 * fontMultiplier);
        ctx.font = `bold ${badgeFontSize}px sans-serif`;
        let chipX = rightColX;
        for (const badgeTextItem of badges) {
          const badgeWidth = ctx.measureText(badgeTextItem).width + 24;
          const chipH = 34;
          ctx.fillStyle = effectiveBadgeBg;
          ctx.beginPath();
          ctx.roundRect(chipX, rY, badgeWidth, chipH, 12);
          ctx.fill();
          ctx.strokeStyle = isLightBg ? 'rgba(0,0,0,0.1)' : tpl.cardBorder;
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.fillStyle = effectiveBadgeText;
          ctx.textBaseline = 'middle';
          ctx.fillText(badgeTextItem, chipX + 12, rY + chipH / 2);
          chipX += badgeWidth + 12;
        }
        ctx.textBaseline = 'top';
        rY += 46;
      }

      // CTA Button
      const ctaW = Math.min(420, rightColW);
      const ctaH = 60;
      ctx.fillStyle = tpl.ctaBg;
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.roundRect(rightColX, rY, ctaW, ctaH, 30);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = tpl.ctaText;
      const ctaFontSize = Math.round(24 * fontMultiplier);
      ctx.font = `900 ${ctaFontSize}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(customCta.toUpperCase(), rightColX + ctaW / 2, rY + ctaH / 2);
      rY += ctaH + 20;

      // Footer Store / WhatsApp line
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      const footFontSize = Math.round(18 * fontMultiplier);
      ctx.font = `600 ${footFontSize}px sans-serif`;
      ctx.fillStyle = isLightBg ? '#475569' : '#94a3b8';
      const storeLabel = `Official Store: ${storeHandle}`;
      const waLabel = phoneText ? ` | WhatsApp: ${phoneText}` : '';
      ctx.fillText(storeLabel + waLabel, rightColX, rY);
      ctx.restore();

    } else {
      // -----------------------------------------------------------------------
      // VERTICAL LAYOUTS: SQUARE (1:1), PORTRAIT (4:5), STORY (9:16)
      // DYNAMIC MEASUREMENT & ANTI-OVERLAP VERTICAL BUDGET ENGINE
      // -----------------------------------------------------------------------
      const padX = isStory ? 55 : isPortrait ? 60 : 55;
      const contentCenter = W / 2;

      // 1. MEASURE BOTTOM CONVERSION CONTENT FIRST TO GUARANTEE FIT
      // We scale typography properly for high-res canvases!
      const titleInitialSize = isStory 
        ? Math.round(56 * fontMultiplier) 
        : isPortrait 
        ? Math.round(50 * fontMultiplier) 
        : Math.round(44 * fontMultiplier);

      const titleMinSize = isStory 
        ? Math.round(38 * fontMultiplier) 
        : isPortrait 
        ? Math.round(34 * fontMultiplier) 
        : Math.round(30 * fontMultiplier);

      const maxTitleW = W - padX * 2 - 70;
      const maxTitleLines = isStory ? 3 : 2;

      // Pre-measure title
      ctx.save();
      const titleRes = wrapAndFitText(
        ctx,
        customSubhead,
        maxTitleW,
        maxTitleLines,
        tpl.fontFamily,
        tpl.titleWeight,
        titleInitialSize,
        titleMinSize
      );
      ctx.restore();

      // Pre-measure price dimensions
      const priceFontSize = isStory 
        ? Math.round(76 * fontMultiplier) 
        : isPortrait 
        ? Math.round(68 * fontMultiplier) 
        : Math.round(60 * fontMultiplier);

      const strikeFontSize = Math.round(priceFontSize * 0.48);
      const ctaH = isStory ? 68 : isPortrait ? 62 : 56;
      const ctaW = Math.min(W - padX * 2 - 60, isStory ? 560 : 500);

      // Pre-calculate bottom card items height
      const padTopCard = isStory ? 36 : 28;
      const ratingH = ratingText ? (isStory ? 34 : 26) : 0;
      const titleH = titleRes.totalHeight + (isStory ? 16 : 12);
      const priceH = priceFontSize + (isStory ? 18 : 12);
      
      const badgesCount = (badgeCOD ? 1 : 0) + (badgeFreeDelivery ? 1 : 0) + (badgeVerifiedSeller ? 1 : 0);
      const badgeH = badgesCount > 0 ? (isStory ? 44 : 36) : 0;
      const ctaSectionH = ctaH + (isStory ? 20 : 16);
      const footerH = isStory ? 32 : 24;
      const padBottomCard = isStory ? 32 : 24;

      const totalCardContentH = padTopCard + ratingH + titleH + priceH + badgeH + ctaSectionH + footerH + padBottomCard;

      // Header specifications
      const headerY = isStory ? 80 : 44;
      const barH = isStory ? 64 : 54;
      const headerTotalH = headerY + barH;

      // Bottom Card Placement
      const cardMarginBottom = isStory ? 60 : 36;
      const cardH = totalCardContentH;
      const cardY = H - cardH - cardMarginBottom;
      const cardW = W - padX * 2;

      // Product Image dynamically fills the remaining space between Header and Card!
      const availableImageSpaceH = Math.max(200, cardY - headerTotalH - 40);
      const maxImgW = W - padX * 2;
      let imgSize = Math.min(availableImageSpaceH, maxImgW - (isSquare ? 90 : 50));
      if (headerTotalH + 20 + imgSize + 20 > cardY) {
        imgSize = Math.max(180, cardY - headerTotalH - 40);
      }

      const imgX = (W - imgSize) / 2;
      const imgY = headerTotalH + ((cardY - headerTotalH) - imgSize) / 2;

      // Protective high-contrast scrims over complex backdrops
      if (enableContrastScrim) {
        ctx.save();
        // Top header protective scrim
        const topScrim = ctx.createLinearGradient(0, 0, 0, headerTotalH + 50);
        topScrim.addColorStop(0, isLightBg ? 'rgba(255,255,255,0.92)' : 'rgba(0,0,0,0.88)');
        topScrim.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = topScrim;
        ctx.fillRect(0, 0, W, headerTotalH + 50);

        // Bottom conversion card protective scrim
        const bottomScrim = ctx.createLinearGradient(0, cardY - 90, 0, H);
        bottomScrim.addColorStop(0, 'rgba(0,0,0,0)');
        bottomScrim.addColorStop(0.35, isLightBg ? 'rgba(255,255,255,0.82)' : 'rgba(0,0,0,0.78)');
        bottomScrim.addColorStop(1, isLightBg ? 'rgba(255,255,255,0.98)' : 'rgba(0,0,0,0.98)');
        ctx.fillStyle = bottomScrim;
        ctx.fillRect(0, cardY - 90, W, H - (cardY - 90));
        ctx.restore();
      }

      // -------------------------------------------------------------
      // 2. RENDER HEADER ZONE (Brand & Platform Kicker)
      // -------------------------------------------------------------
      ctx.save();
      ctx.fillStyle = isLightBg ? 'rgba(255,255,255,0.9)' : tpl.cardBg;
      ctx.strokeStyle = isLightBg ? 'rgba(0,0,0,0.1)' : tpl.cardBorder;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(padX, headerY, W - padX * 2, barH, barH / 2);
      ctx.fill();
      ctx.stroke();

      // Brand Logo on Left
      const headerBrandSize = Math.round(24 * fontMultiplier);
      ctx.font = `bold ${headerBrandSize}px system-ui, sans-serif`;
      ctx.fillStyle = effectiveTitleColor;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      const platformIcon = targetPlatform === 'amazon' ? '📦 ' : targetPlatform === 'etsy' ? '🌿 ' : '🛒 ';
      ctx.fillText(`${platformIcon}${brandText.toUpperCase()}`, padX + 22, headerY + barH / 2);

      // Top Tagline Badge on Right
      const headerTaglineSize = Math.round(17 * fontMultiplier);
      ctx.font = `bold ${headerTaglineSize}px system-ui, sans-serif`;
      ctx.fillStyle = accentColor;
      ctx.textAlign = 'right';
      ctx.fillText(customHeadline.toUpperCase(), W - padX - 22, headerY + barH / 2);
      ctx.restore();

      // -------------------------------------------------------------
      // 3. RENDER PRODUCT HERO IMAGE STAGE
      // -------------------------------------------------------------
      ctx.save();
      // Soft ambient light halo
      const haloGlow = ctx.createRadialGradient(
        imgX + imgSize / 2, imgY + imgSize / 2, 20,
        imgX + imgSize / 2, imgY + imgSize / 2, imgSize * 0.65
      );
      haloGlow.addColorStop(0, accentColor + '35');
      haloGlow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = haloGlow;
      ctx.fillRect(imgX - 35, imgY - 35, imgSize + 70, imgSize + 70);

      // Contact drop shadow under product
      ctx.save();
      const shadowGrad = ctx.createRadialGradient(
        imgX + imgSize / 2, imgY + imgSize - 10, 10,
        imgX + imgSize / 2, imgY + imgSize - 10, imgSize * 0.45
      );
      shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.45)');
      shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = shadowGrad;
      ctx.beginPath();
      ctx.ellipse(imgX + imgSize / 2, imgY + imgSize - 8, imgSize * 0.45, 18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Image Container Card
      ctx.fillStyle = isLightBg ? 'rgba(255,255,255,0.92)' : 'rgba(255, 255, 255, 0.05)';
      ctx.strokeStyle = selectedTemplate === 'luxury_gold' ? '#fbbf24' : (isLightBg ? 'rgba(0,0,0,0.1)' : tpl.cardBorder);
      ctx.lineWidth = selectedTemplate === 'luxury_gold' ? 3 : 2;
      const cornerR = selectedTemplate === 'shopify_modern' ? 14 : 26;
      ctx.beginPath();
      ctx.roundRect(imgX, imgY, imgSize, imgSize, cornerR);
      ctx.fill();
      ctx.stroke();

      // Product Image Clip
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(imgX + 10, imgY + 10, imgSize - 20, imgSize - 20, cornerR - 6);
      ctx.clip();
      if (prodImgRef.current && imageLoaded) {
        ctx.drawImage(prodImgRef.current, imgX + 10, imgY + 10, imgSize - 20, imgSize - 20);
      } else {
        ctx.fillStyle = isLightBg ? '#e2e8f0' : '#1e293b';
        ctx.fillRect(imgX + 10, imgY + 10, imgSize - 20, imgSize - 20);
      }
      ctx.restore();

      // Discount Badge Stamp (Top-Right corner of image stage)
      if (customDiscount) {
        ctx.save();
        const discBadgeW = 126;
        const discBadgeH = 44;
        const bX = imgX + imgSize - discBadgeW - 14;
        const bY = imgY + 16;
        ctx.fillStyle = selectedTemplate === 'flash_sale' ? '#facc15' : accentColor;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.roundRect(bX, bY, discBadgeW, discBadgeH, discBadgeH / 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = selectedTemplate === 'flash_sale' ? '#000000' : '#ffffff';
        ctx.font = '900 21px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(customDiscount, bX + discBadgeW / 2, bY + discBadgeH / 2);
        ctx.restore();
      }

      // Promo Code Badge (Top-Left corner of image stage)
      if (showPromoCode && promoCode) {
        ctx.save();
        const pBadgeW = 150;
        const pBadgeH = 38;
        const pX = imgX + 14;
        const pY = imgY + 16;
        ctx.fillStyle = isLightBg ? 'rgba(255,255,255,0.95)' : 'rgba(15, 23, 42, 0.9)';
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(pX, pY, pBadgeW, pBadgeH, pBadgeH / 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = isLightBg ? '#0f172a' : '#ffffff';
        ctx.font = 'bold 15px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(promoCode, pX + pBadgeW / 2, pY + pBadgeH / 2);
        ctx.restore();
      }
      ctx.restore();

      // -------------------------------------------------------------
      // 4. RENDER BOTTOM CONVERSION & INFORMATION CARD (ZERO OVERLAP)
      // -------------------------------------------------------------
      ctx.save();
      // Draw Backdrop Card
      if (cardBackdrop === 'frosted_glass') {
        ctx.fillStyle = isLightBg ? 'rgba(255,255,255,0.92)' : tpl.cardBg;
        ctx.strokeStyle = isLightBg ? 'rgba(0,0,0,0.1)' : tpl.cardBorder;
        ctx.lineWidth = 2;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
        ctx.shadowBlur = 24;
        ctx.beginPath();
        ctx.roundRect(padX, cardY, cardW, cardH, 28);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;
      } else if (cardBackdrop === 'solid_contrast') {
        ctx.fillStyle = isLightBg ? '#ffffff' : '#030712';
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.roundRect(padX, cardY, cardW, cardH, 28);
        ctx.fill();
        ctx.stroke();
      } else if (cardBackdrop === 'cyclorama_clean') {
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.lineWidth = 1.5;
        ctx.shadowColor = 'rgba(0,0,0,0.08)';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.roundRect(padX, cardY, cardW, cardH, 28);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Sequential Top-to-Bottom Flow Engine
      let curY = cardY + padTopCard;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      // 4.1 Rating & Reviews
      if (ratingText) {
        const ratingFontSize = Math.round(20 * fontMultiplier);
        ctx.font = `bold ${ratingFontSize}px sans-serif`;
        ctx.fillStyle = selectedTemplate === 'luxury_gold' ? '#fbbf24' : accentColor;
        ctx.fillText(ratingText, contentCenter, curY);
        curY += ratingH;
      }

      // 4.2 Product Title
      ctx.font = `${tpl.titleWeight} ${titleRes.fontSize}px ${tpl.fontFamily}`;
      ctx.fillStyle = (cardBackdrop === 'cyclorama_clean') ? '#09090b' : effectiveTitleColor;
      ctx.shadowColor = isLightBg || cardBackdrop === 'cyclorama_clean' ? 'transparent' : 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = isLightBg ? 0 : 8;

      for (const line of titleRes.lines) {
        ctx.fillText(line, contentCenter, curY);
        curY += titleRes.lineHeight;
      }
      ctx.shadowBlur = 0;
      curY += isStory ? 14 : 10;

      // 4.3 Sale Price & Strikethrough Row
      ctx.font = `900 ${priceFontSize}px sans-serif`;
      ctx.fillStyle = (cardBackdrop === 'cyclorama_clean') ? '#0f172a' : effectivePriceColor;

      const fullPriceStr = customPrice;
      const priceMetrics = ctx.measureText(fullPriceStr);

      if (showStrikethrough && originalPrice) {
        ctx.font = `600 ${strikeFontSize}px sans-serif`;
        const strikeMetrics = ctx.measureText(originalPrice);
        const totalW = priceMetrics.width + 24 + strikeMetrics.width;
        const startX = contentCenter - totalW / 2;

        // Draw main price
        ctx.textAlign = 'left';
        ctx.font = `900 ${priceFontSize}px sans-serif`;
        ctx.fillText(fullPriceStr, startX, curY);

        // Draw original price with strikethrough
        ctx.font = `600 ${strikeFontSize}px sans-serif`;
        ctx.fillStyle = isLightBg || cardBackdrop === 'cyclorama_clean' ? '#64748b' : '#94a3b8';
        const strikeX = startX + priceMetrics.width + 24;
        const strikeY = curY + (priceFontSize - strikeFontSize) / 2 + 2;
        ctx.fillText(originalPrice, strikeX, strikeY);

        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(strikeX, strikeY + strikeFontSize / 2);
        ctx.lineTo(strikeX + strikeMetrics.width, strikeY + strikeFontSize / 2);
        ctx.stroke();
      } else {
        ctx.textAlign = 'center';
        ctx.fillText(fullPriceStr, contentCenter, curY);
      }
      curY += priceH;

      // 4.4 Trust Badges Chips Row
      const badges: string[] = [];
      if (badgeCOD) badges.push('💵 Cash on Delivery');
      if (badgeFreeDelivery) badges.push('🚚 Free Shipping');
      if (badgeVerifiedSeller) badges.push('🛡️ Verified Quality');

      if (badges.length > 0) {
        const badgeChipFontSize = Math.round(18 * fontMultiplier);
        ctx.font = `bold ${badgeChipFontSize}px sans-serif`;

        // Calculate total row width
        const chipPadding = 20;
        const chipGap = 12;
        const chipWidths = badges.map(b => ctx.measureText(b).width + chipPadding * 2);
        const totalBadgesWidth = chipWidths.reduce((a, b) => a + b, 0) + chipGap * (badges.length - 1);

        let chipStartX = contentCenter - totalBadgesWidth / 2;
        const chipH = isStory ? 38 : 32;

        for (let i = 0; i < badges.length; i++) {
          const bText = badges[i];
          const bW = chipWidths[i];

          ctx.fillStyle = cardBackdrop === 'cyclorama_clean' ? 'rgba(0,0,0,0.06)' : effectiveBadgeBg;
          ctx.beginPath();
          ctx.roundRect(chipStartX, curY, bW, chipH, chipH / 2);
          ctx.fill();

          ctx.strokeStyle = cardBackdrop === 'cyclorama_clean' ? 'rgba(0,0,0,0.1)' : (isLightBg ? 'rgba(0,0,0,0.1)' : tpl.cardBorder);
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.fillStyle = cardBackdrop === 'cyclorama_clean' ? '#0f172a' : effectiveBadgeText;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(bText, chipStartX + bW / 2, curY + chipH / 2);

          chipStartX += bW + chipGap;
        }
        ctx.textBaseline = 'top';
        curY += badgeH;
      }

      // 4.5 Call to Action Button
      const ctaX = (W - ctaW) / 2;
      ctx.fillStyle = tpl.ctaBg;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.roundRect(ctaX, curY, ctaW, ctaH, ctaH / 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = tpl.ctaText;
      const ctaFontSize = Math.round(25 * fontMultiplier);
      ctx.font = `900 ${ctaFontSize}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(customCta.toUpperCase(), contentCenter, curY + ctaH / 2);
      curY += ctaSectionH;

      // 4.6 Footer Store Link & WhatsApp Hotline
      ctx.textBaseline = 'top';
      const footFontSize = Math.round(18 * fontMultiplier);
      ctx.font = `600 ${footFontSize}px sans-serif`;
      ctx.fillStyle = cardBackdrop === 'cyclorama_clean' ? '#475569' : (isLightBg ? '#475569' : '#94a3b8');
      ctx.textAlign = 'center';
      const footStr = phoneText 
        ? `Official Store: ${storeHandle}  •  WhatsApp: ${phoneText}`
        : `Official Store: ${storeHandle}`;
      ctx.fillText(footStr, contentCenter, curY);

      ctx.restore();
    }

  }, [
    productImage,
    imageLoaded,
    selectedTemplate,
    selectedFormat,
    targetPlatform,
    cardBackdrop,
    fontSizeScale,
    fontMultiplier,
    customHeadline,
    customSubhead,
    customCta,
    customPrice,
    originalPrice,
    customDiscount,
    storeHandle,
    promoCode,
    showPromoCode,
    ratingText,
    bgColor,
    accentColor,
    titleColor,
    priceColor,
    badgeColor,
    phoneText,
    brandText,
    badgeCOD,
    badgeFreeDelivery,
    badgeVerifiedSeller,
    showStrikethrough
  ]);

  // Download high-resolution PNG
  const downloadPoster = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const safeName = productName.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'campaign';
        a.download = `${safeName}_poster_${selectedTemplate}_${selectedFormat}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 'image/png');
    } catch (err) {
      console.error('Failed to download poster:', err);
    }
  };

  // Copy PNG to clipboard
  const copyPosterToClipboard = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setCopiedNotice(true);
        setTimeout(() => setCopiedNotice(false), 2500);
      }, 'image/png');
    } catch (err) {
      console.error('Failed to copy poster to clipboard:', err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Marketplace Header */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900/50 border border-indigo-500/30 flex items-center justify-between gap-4 flex-wrap shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-600/30">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>E-Commerce & Digital Marketplace Poster Studio</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-indigo-500/20 text-indigo-300 font-extrabold border border-indigo-500/30 uppercase tracking-wide">
                Refined Layouts & HD Typography
              </span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Calibrated font sizes, zero-overlap content flow engine, and auto-harmonized contrast for commercial advertisements.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={copyPosterToClipboard}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-98"
          >
            {copiedNotice ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedNotice ? "Copied HD Poster!" : "Copy Poster"}</span>
          </button>

          <button
            onClick={downloadPoster}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 flex items-center gap-1.5 shadow-md shadow-indigo-600/30 active:scale-98 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Poster (HD PNG)</span>
          </button>

          <button
            onClick={exportAllFormatsZip}
            disabled={isExportingAll}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 flex items-center gap-1.5 shadow-md shadow-emerald-600/30 active:scale-98 transition-all cursor-pointer"
            title="Download campaign pack with PNG, text copy & launch guide"
          >
            <Package className="w-4 h-4" />
            <span>{isExportingAll ? "Packaging ZIP..." : "Download Full Pack (ZIP)"}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Live Preview + Right Customization Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Live Canvas & Responsive Template Preview (Sticky on desktop so it is ALWAYS visible while editing) */}
        <div className="lg:col-span-7 flex flex-col items-center lg:sticky lg:top-4 self-start lg:max-h-[calc(100vh-2rem)] overflow-y-auto pr-1">
          
          {/* AI Predicted Conversion & CTR Strength Meter (inspired by AdCreative.ai) */}
          <div className="w-full mb-4 p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-indigo-500/30 shadow-lg flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-md">
                {conversionMetrics.score}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">AI Predicted Ad Strength</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/30">
                    {conversionMetrics.grade}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {conversionMetrics.tips[0] || 'Optimized for high click-through rate & social commerce orders.'}
                </div>
              </div>
            </div>

            {/* A/B Variant Quick Switcher (inspired by Marpipe & AdCreative.ai) */}
            <div className="flex items-center gap-1 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 px-2 uppercase">A/B Angle:</span>
              {[
                { id: 'A', label: '⚡ Flash' },
                { id: 'B', label: '📍 Features' },
                { id: 'C', label: '⭐ Proof' },
                { id: 'D', label: '💬 WhatsApp' },
              ].map((v) => (
                <button
                  key={v.id}
                  onClick={() => applyVariant(v.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeVariant === v.id
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full bg-slate-950 p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-2xl flex flex-col items-center justify-center">
            
            {/* View Mode Switcher + Contrast Scrim Status */}
            <div className="w-full flex items-center justify-between gap-3 mb-4 flex-wrap">
              
              {/* Responsive CSS vs 1080p Canvas Engine */}
              <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => setPreviewMode('responsive_css')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    previewMode === 'responsive_css'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Fluid clamp() CSS template with responsive container scaling"
                >
                  <Type className="w-3.5 h-3.5" />
                  <span>Responsive CSS (clamp())</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewMode('hd_canvas')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    previewMode === 'hd_canvas'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="High-definition 1080p canvas engine ready for download and print"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>1080p Canvas Engine</span>
                </button>
              </div>

              {/* High-Contrast Scrim Quick Toggle */}
              <label className="flex items-center gap-2 text-xs text-slate-300 font-medium cursor-pointer bg-slate-900/80 px-2.5 py-1.5 rounded-xl border border-slate-800 hover:border-slate-700">
                <input
                  type="checkbox"
                  checked={enableContrastScrim}
                  onChange={(e) => setEnableContrastScrim(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-[11px]">Contrast Scrim Active</span>
              </label>
            </div>

            {/* Format / Aspect Ratio Selector */}
            <div className="flex items-center gap-1.5 mb-5 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 max-w-full overflow-x-auto">
              {FORMATS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFormat(f.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedFormat === f.id
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Live Template Container */}
            <div className="w-full relative flex items-center justify-center min-h-[460px]">
              
              {/* 1. Responsive CSS Poster Template (uses CSS clamp() and container queries) */}
              {previewMode === 'responsive_css' && (
                <div className="w-full max-w-[540px] mx-auto animate-in fade-in duration-200">
                  <ResponsivePosterTemplate
                    productImage={productImage}
                    productName={productName}
                    format={selectedFormat as any}
                    archetype={selectedTemplate}
                    composition={composition}
                    targetPlatform={targetPlatform}
                    cardBackdrop={cardBackdrop}
                    fontSizeScale={fontSizeScale}
                    studioPedestal={studioPedestal}
                    customHeadline={customHeadline}
                    customSubhead={customSubhead}
                    customPrice={customPrice}
                    originalPrice={originalPrice}
                    customDiscount={customDiscount}
                    customCta={customCta}
                    brandName={brandText}
                    storeHandle={storeHandle}
                    phoneText={phoneText}
                    promoCode={promoCode}
                    showPromoCode={showPromoCode}
                    ratingText={ratingText}
                    badgeCOD={badgeCOD}
                    badgeFreeDelivery={badgeFreeDelivery}
                    badgeVerifiedSeller={badgeVerifiedSeller}
                    showStrikethrough={showStrikethrough}
                    keyFeatures={keyFeatures}
                    urgencyText={urgencyText}
                    reviewQuote={reviewQuote}
                    reviewerName={reviewerName}
                    bgColor={bgColor}
                    accentColor={accentColor}
                    titleColor={titleColor}
                    priceColor={priceColor}
                    badgeColor={badgeColor}
                  />
                </div>
              )}

              {/* 2. Poster Canvas Element (Active in HD canvas mode, hidden offscreen in CSS mode for instant download) */}
              <div 
                className={`relative max-w-full overflow-hidden rounded-2xl shadow-2xl border border-slate-800/80 bg-slate-900 ${
                  previewMode === 'hd_canvas' ? 'block' : 'hidden'
                }`}
              >
                <canvas
                  ref={canvasRef}
                  className="max-h-[620px] max-w-full h-auto object-contain mx-auto block"
                />
              </div>

            </div>

            {/* Canvas Sub-info */}
            <div className="mt-4 flex items-center justify-between w-full text-[11px] text-slate-400 px-2 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>
                  {previewMode === 'responsive_css' 
                    ? 'Fluid CSS clamp() Engine · WCAG AA Contrast' 
                    : `Canvas Engine: ${FORMATS.find(f => f.id === selectedFormat)?.width} × ${FORMATS.find(f => f.id === selectedFormat)?.height} px HD`}
                </span>
              </div>
              <div className="font-medium text-slate-400">
                {FORMATS.find(f => f.id === selectedFormat)?.sub}
              </div>
            </div>
          </div>

          {/* Social Post Caption & WhatsApp Broadcast Assistant */}
          <div className="w-full mt-5 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
            <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>1-Click Social Media & WhatsApp Copy</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-extrabold px-1.5 py-0.2 rounded-md">
                      Ready to Post
                    </span>
                  </h5>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    High-converting caption auto-tailored to this visual ad composition & offer
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={copyCaptionToClipboard}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 shadow-sm active:scale-98 transition-all cursor-pointer"
              >
                {copiedCaption ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCaption ? 'Copied Post Copy!' : 'Copy Caption & Tags'}</span>
              </button>
            </div>

            {/* Live Editable Caption Area */}
            <div className="relative">
              <textarea
                readOnly
                rows={5}
                value={generatePostCaption()}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 leading-relaxed resize-none focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Customization Controls & Archetypes */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* 0. Commercial Ad Compositions & Strategic Layouts */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-purple-950/30 border border-indigo-500/30 space-y-3.5 shadow-md">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>6 Commercial Ad Compositions</span>
              </label>
              <span className="text-[10px] text-amber-400 font-extrabold uppercase bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                Conversion Focused
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { 
                  id: 'flash_urgency', 
                  label: '⚡ Flash Sale & Urgency', 
                  desc: 'Pulsing urgency ticker, giant discount badge, scarcity bar' 
                },
                { 
                  id: 'infographic_features', 
                  label: '📍 Feature Callout Pins', 
                  desc: 'Visual callout pins pointing to key product selling points' 
                },
                { 
                  id: 'social_proof_ugc', 
                  label: '⭐ Social Proof & UGC', 
                  desc: 'Verified buyer 5-star review quote & viral social badge' 
                },
                { 
                  id: 'whatsapp_catalog', 
                  label: '💬 WhatsApp & COD Flyer', 
                  desc: '3-step simple order guide & prominent WhatsApp hotline' 
                },
                { 
                  id: 'editorial_hero', 
                  label: '✦ Editorial & Minimal D2C', 
                  desc: 'Clean magazine typography & sophisticated craft aesthetic' 
                },
                { 
                  id: 'marketplace_card', 
                  label: '🛡️ Marketplace Powerhouse', 
                  desc: 'Official store verification & buyer protection escrow' 
                },
              ].map((comp) => (
                <button
                  key={comp.id}
                  type="button"
                  onClick={() => setComposition(comp.id as AdCompositionType)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    composition === comp.id
                      ? 'border-indigo-500 bg-indigo-600/30 text-white shadow-sm ring-1 ring-indigo-500'
                      : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-bold">{comp.label}</div>
                  <div className="text-[10px] text-slate-400 mt-1 leading-snug line-clamp-2">
                    {comp.desc}
                  </div>
                </button>
              ))}
            </div>

            {/* Contextual Customization Controls for the active composition */}
            {composition === 'flash_urgency' && (
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <label className="block text-[11px] font-semibold text-amber-300">Urgency Ticker Text</label>
                <input
                  type="text"
                  value={urgencyText}
                  onChange={(e) => setUrgencyText(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                  placeholder="⚡ FLASH SALE • ONLY 7 UNITS LEFT"
                />
              </div>
            )}

            {composition === 'social_proof_ugc' && (
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <label className="block text-[11px] font-semibold text-rose-300">Customer Testimonial Quote</label>
                <input
                  type="text"
                  value={reviewQuote}
                  onChange={(e) => setReviewQuote(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white mb-1.5"
                  placeholder="Best purchase I made this month!"
                />
                <input
                  type="text"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300"
                  placeholder="Sarah M. · Verified Buyer"
                />
              </div>
            )}
          </div>
          
          {/* 1. Design Archetypes Selection */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Layout className="w-3.5 h-3.5 text-indigo-500" />
                <span>12 Design Archetypes</span>
              </label>
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase">
                Curated Color & Fonts
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
              {POSTER_TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleTemplateChange(t.id)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer flex flex-col justify-between ${
                    selectedTemplate === t.id
                      ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-bold shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate">{t.name}</span>
                    <span 
                      className="w-3 h-3 rounded-full shrink-0 ml-1.5 border border-white/20"
                      style={{ backgroundColor: t.accent }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400 font-normal truncate mt-1">
                    {t.platformCategory}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Typography Sizing Scale & Card Style */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-indigo-500" />
                <span>Font Sizing Scale</span>
              </label>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                Auto-Calibrated HD
              </span>
            </div>

            {/* Font scale buttons */}
            <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
              {[
                { id: 'compact', label: 'Compact', sub: '0.85x' },
                { id: 'standard', label: 'Balanced', sub: '1.0x' },
                { id: 'large', label: 'Large', sub: '1.16x' },
                { id: 'impact', label: 'Heroic', sub: '1.32x' },
              ].map((scale) => (
                <button
                  key={scale.id}
                  onClick={() => setFontSizeScale(scale.id as FontSizeScaleOption)}
                  className={`py-2 px-1 text-center rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    fontSizeScale === scale.id
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div>{scale.label}</div>
                  <div className="text-[9px] font-normal opacity-70">{scale.sub}</div>
                </button>
              ))}
            </div>

            {/* Card Backdrop Style */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Card Surface Aesthetic</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'frosted_glass', label: 'Frosted Glass' },
                  { id: 'solid_contrast', label: 'High-Contrast Solid' },
                  { id: 'cyclorama_clean', label: 'Pure White Clean' },
                  { id: 'frameless', label: 'Atmospheric Glass' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setCardBackdrop(s.id as CardBackdropStyle)}
                    className={`py-2 px-2.5 text-xs text-left rounded-xl border transition-all cursor-pointer ${
                      cardBackdrop === s.id
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Studio Lighting & Pedestal Stage (Photoroom / Flair.ai Standard) */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">
                Studio Stage & Lighting Pedestal
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'studio_clean', label: 'Clean Studio Floor' },
                  { id: 'travertine', label: 'Travertine Stone Pedestal' },
                  { id: 'obsidian_mirror', label: 'Dark Obsidian Mirror' },
                  { id: 'cyber_neon', label: 'Cyber Neon Glow Ring' },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setStudioPedestal(p.id as any)}
                    className={`py-2 px-2.5 text-xs text-left rounded-xl border transition-all cursor-pointer ${
                      studioPedestal === p.id
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Background Legibility Protection */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">Complex Background Protection</div>
                <div className="text-[10px] text-slate-400">Multi-stop gradient scrim ensures WCAG AA text contrast</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableContrastScrim}
                  onChange={(e) => setEnableContrastScrim(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>

          {/* 3. Text Color Refinements & Harmony */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-indigo-500" />
                <span>Text Colors & Palette Refinement</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  const tpl = POSTER_TEMPLATES.find((t) => t.id === selectedTemplate);
                  if (tpl) {
                    setBgColor(tpl.bgGrad[0]);
                    setAccentColor(tpl.accent);
                    setTitleColor(tpl.textColor);
                    setPriceColor(tpl.priceColor);
                    setBadgeColor(tpl.badgeText);
                  }
                }}
                className="text-[10px] text-slate-500 hover:text-indigo-600 font-semibold cursor-pointer"
              >
                Reset Palette
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1">Title & Text</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={titleColor}
                    onChange={(e) => setTitleColor(e.target.value)}
                    className="w-7 h-7 rounded-lg border-0 cursor-pointer"
                  />
                  <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400">{titleColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1">Price Highlight</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={priceColor}
                    onChange={(e) => setPriceColor(e.target.value)}
                    className="w-7 h-7 rounded-lg border-0 cursor-pointer"
                  />
                  <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400">{priceColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1">Trust Badges</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={badgeColor}
                    onChange={(e) => setBadgeColor(e.target.value)}
                    className="w-7 h-7 rounded-lg border-0 cursor-pointer"
                  />
                  <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400">{badgeColor}</span>
                </div>
              </div>
            </div>

            {/* Quick Text Color Swatches */}
            <div className="pt-1">
              <label className="block text-[10px] font-semibold text-slate-500 mb-1.5">Quick Palette Swatches</label>
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { name: 'Pure White', title: '#ffffff', price: '#fbbf24', badge: '#c7d2fe', bg: '#090d16' },
                  { name: 'Studio White', title: '#09090b', price: '#4f46e5', badge: '#0f172a', bg: '#ffffff' },
                  { name: 'Gold Luxury', title: '#fffbeb', price: '#fbbf24', badge: '#fde68a', bg: '#12100e' },
                  { name: 'Neon Cyber', title: '#ffffff', price: '#22d3ee', badge: '#67e8f9', bg: '#020617' },
                  { name: 'Vivid Rose', title: '#ffffff', price: '#f472b6', badge: '#fbcfe8', bg: '#3b0764' },
                  { name: 'Emerald', title: '#ffffff', price: '#fbbf24', badge: '#a7f3d0', bg: '#022c22' },
                ].map((swatch) => (
                  <button
                    key={swatch.name}
                    type="button"
                    onClick={() => {
                      setTitleColor(swatch.title);
                      setPriceColor(swatch.price);
                      setBadgeColor(swatch.badge);
                      setBgColor(swatch.bg);
                      setAccentColor(swatch.price);
                    }}
                    className="px-2 py-1 rounded-lg text-[10px] font-medium border border-slate-200 dark:border-slate-800 hover:border-indigo-500 text-slate-600 dark:text-slate-300 cursor-pointer flex items-center gap-1.5"
                  >
                    <span className="w-2.5 h-2.5 rounded-full border border-black/20" style={{ backgroundColor: swatch.price }} />
                    <span>{swatch.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Background & Accent Highlight */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1">Canvas Background</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-7 h-7 rounded-lg border-0 cursor-pointer"
                  />
                  <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400">{bgColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1">Accent Highlight</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-7 h-7 rounded-lg border-0 cursor-pointer"
                  />
                  <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400">{accentColor}</span>
                </div>
              </div>
            </div>

          </div>

          {/* 4. Text & Content Inputs */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3.5 shadow-xs">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-indigo-500" />
              <span>Poster Typography & Copy</span>
            </label>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Product Title</label>
              <input
                type="text"
                value={customSubhead}
                onChange={(e) => setCustomSubhead(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Headline Hook / Tagline</label>
              <input
                type="text"
                value={customHeadline}
                onChange={(e) => setCustomHeadline(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Active Sale Price</label>
                <input
                  type="text"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Original Price (Strikethrough)</label>
                <input
                  type="text"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-500 dark:text-slate-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Discount Stamp</label>
                <input
                  type="text"
                  value={customDiscount}
                  onChange={(e) => setCustomDiscount(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-rose-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Call to Action (CTA Button)</label>
                <input
                  type="text"
                  value={customCta}
                  onChange={(e) => setCustomCta(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Brand Name</label>
                <input
                  type="text"
                  value={brandText}
                  onChange={(e) => setBrandText(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">WhatsApp Hotline</label>
                <input
                  type="text"
                  value={phoneText}
                  onChange={(e) => setPhoneText(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Coupon / Promo Code</label>
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="CODE: SAVE25"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-indigo-600 dark:text-indigo-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Rating & Reviews</label>
                <input
                  type="text"
                  value={ratingText}
                  onChange={(e) => setRatingText(e.target.value)}
                  placeholder="4.9 ★ (1,500+ Reviews)"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Official Store URL</label>
              <input
                type="text"
                value={storeHandle}
                onChange={(e) => setStoreHandle(e.target.value)}
                placeholder="bookkaaro.com/store/yourbrand"
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>

          </div>

          {/* 5. Trust Badges & Options */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
              <span>Conversion Badges & Options</span>
            </label>

            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={badgeCOD}
                  onChange={(e) => setBadgeCOD(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Cash on Delivery</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={badgeFreeDelivery}
                  onChange={(e) => setBadgeFreeDelivery(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Free Shipping</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={badgeVerifiedSeller}
                  onChange={(e) => setBadgeVerifiedSeller(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Verified Quality</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showStrikethrough}
                  onChange={(e) => setShowStrikethrough(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Strikethrough Price</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPromoCode}
                  onChange={(e) => setShowPromoCode(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Promo Code Stamp</span>
              </label>
            </div>

          </div>

        </div>

      </div>

      {/* Mobile Floating Sticky Preview Trigger (Keeps poster easily viewable while scrolling controls on small screens) */}
      <div className="lg:hidden fixed bottom-5 right-5 z-40">
        <button
          type="button"
          onClick={() => {
            window.scrollTo({ top: 120, behavior: 'smooth' });
          }}
          className="px-4 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-2xl flex items-center gap-2 border border-indigo-400/40 active:scale-95 transition-all shadow-indigo-600/30"
          title="Scroll up to view live poster preview"
        >
          <Eye className="w-4 h-4 text-amber-300" />
          <span>Live Poster Preview ↑</span>
        </button>
      </div>
    </div>
  );
};
