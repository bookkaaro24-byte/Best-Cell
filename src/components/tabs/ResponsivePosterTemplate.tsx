import React from 'react';
import { 
  ShieldCheck, 
  Truck, 
  Banknote, 
  Star, 
  ShoppingBag, 
  Sparkles, 
  Store, 
  Tag, 
  Flame, 
  Zap, 
  MessageCircle, 
  Clock, 
  ArrowRight, 
  Check, 
  CheckCircle2 
} from 'lucide-react';
import { PosterStyleArchetype, CardBackdropStyle, FontSizeScale, StudioPedestalType } from './TabPosterStudio';

export type AdCompositionType = 
  | 'marketplace_card' 
  | 'infographic_features' 
  | 'flash_urgency' 
  | 'editorial_hero' 
  | 'social_proof_ugc' 
  | 'whatsapp_catalog';

export type TargetCommercePlatform = 
  | 'bookkaaro' 
  | 'shopify' 
  | 'amazon' 
  | 'etsy' 
  | 'tiktok_shop' 
  | 'daraz' 
  | 'gumroad'
  | 'custom_store';

export interface ResponsivePosterTemplateProps {
  productImage: string;
  productName: string;
  format?: 'square' | 'portrait' | 'story' | 'landscape';
  archetype?: PosterStyleArchetype;
  composition?: AdCompositionType;
  targetPlatform?: TargetCommercePlatform;
  cardBackdrop?: CardBackdropStyle;
  fontSizeScale?: FontSizeScale;
  studioPedestal?: StudioPedestalType;
  customHeadline?: string;
  customSubhead?: string;
  customPrice?: string;
  originalPrice?: string;
  customDiscount?: string;
  customCta?: string;
  brandName?: string;
  storeHandle?: string;
  phoneText?: string;
  promoCode?: string;
  showPromoCode?: boolean;
  ratingText?: string;
  badgeCOD?: boolean;
  badgeFreeDelivery?: boolean;
  badgeVerifiedSeller?: boolean;
  showStrikethrough?: boolean;
  keyFeatures?: string[];
  urgencyText?: string;
  reviewQuote?: string;
  reviewerName?: string;
  bgColor?: string;
  accentColor?: string;
  titleColor?: string;
  priceColor?: string;
  badgeColor?: string;
}

export const ResponsivePosterTemplate: React.FC<ResponsivePosterTemplateProps> = ({
  productImage,
  productName,
  format = 'portrait',
  archetype = 'bookkaaro_official',
  composition = 'marketplace_card',
  targetPlatform = 'bookkaaro',
  cardBackdrop = 'frosted_glass',
  fontSizeScale = 'balanced',
  studioPedestal = 'studio_clean',
  customHeadline = 'NEW ARRIVAL',
  customSubhead,
  customPrice = 'PKR 2,450',
  originalPrice = 'PKR 3,500',
  customDiscount = '30% OFF',
  customCta = 'ORDER NOW',
  brandName = 'STORE',
  storeHandle = '@store',
  phoneText = '+92 300 1234567',
  promoCode = 'WELCOME10',
  showPromoCode = false,
  ratingText = '★ 4.9 (1.2k+ Reviews)',
  badgeCOD = true,
  badgeFreeDelivery = true,
  badgeVerifiedSeller = true,
  showStrikethrough = true,
  keyFeatures = [],
  urgencyText = '⚡ FLASH SALE • LIMITED STOCK',
  reviewQuote = 'Hands down the best purchase I made this season!',
  reviewerName = 'Verified Buyer',
  bgColor = '#090d16',
  accentColor = '#6366f1',
  titleColor,
  priceColor,
  badgeColor
}) => {
  const isLandscape = format === 'landscape';
  const effectiveTitle = customSubhead || productName || 'Premium Product';

  // Contrast brightness detection
  const hexToLuma = (hex: string) => {
    const c = hex.replace('#', '');
    const rgb = parseInt(c, 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const isLightBg = bgColor ? hexToLuma(bgColor) > 140 : false;

  const fontFamilyMap: Record<PosterStyleArchetype, string> = {
    bookkaaro_official: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    shopify_modern: 'Georgia, Cambria, "Times New Roman", serif',
    amazon_deal: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    etsy_artisan: 'Palatino, "Book Antiqua", Georgia, serif',
    gumroad_digital: '"SF Mono", "Fira Code", "Courier New", monospace',
    tiktok_viral: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    story_glass: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    flash_sale: 'Impact, "Arial Black", system-ui, sans-serif',
    luxury_gold: '"Playfair Display", Didot, Georgia, serif',
    festive_eid: 'Georgia, serif',
    bestseller_proof: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    wholesale_b2b: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  };

  const fontFamily = fontFamilyMap[archetype] || 'system-ui, sans-serif';
  const effectiveBadgeBg = isLightBg ? 'rgba(15, 23, 42, 0.08)' : 'rgba(255, 255, 255, 0.12)';
  const effectiveBadgeColor = badgeColor || (isLightBg ? '#0f172a' : '#c7d2fe');

  const dynamicStyles: Record<string, string | undefined> = {
    '--poster-bg': bgColor,
    '--poster-accent': accentColor,
    '--poster-text': titleColor || (isLightBg ? '#09090b' : '#ffffff'),
    '--poster-price': priceColor || (isLightBg ? '#1e1b4b' : accentColor),
    '--poster-badge-text': effectiveBadgeColor,
    '--poster-badge-bg': effectiveBadgeBg,
    fontFamily
  };

  const getSurfaceClass = () => {
    switch (cardBackdrop) {
      case 'solid_contrast':
        return isLightBg ? 'poster-surface-solid-light' : 'poster-surface-solid-dark';
      case 'cyclorama_clean':
        return 'poster-surface-cyclorama';
      case 'frameless':
        return 'poster-surface-atmospheric';
      case 'frosted_glass':
      default:
        return isLightBg ? 'poster-surface-frosted-light' : 'poster-surface-frosted-dark';
    }
  };

  const renderPlatformBadge = () => {
    switch (targetPlatform) {
      case 'amazon':
        return <span className="font-bold text-amber-400 text-[10px] tracking-wide">📦 AMAZON PRIME</span>;
      case 'shopify':
        return <span className="font-semibold text-emerald-400 text-[10px] tracking-wide">✦ OFFICIAL STORE</span>;
      case 'etsy':
        return <span className="font-semibold text-teal-400 text-[10px] tracking-wide">🌿 HANDCRAFTED</span>;
      case 'tiktok_shop':
        return <span className="font-bold text-rose-400 text-[10px] tracking-wide">⚡ VIRAL DROP</span>;
      case 'daraz':
        return <span className="font-bold text-orange-400 text-[10px] tracking-wide">🛍️ DARAZ MALL</span>;
      case 'gumroad':
        return <span className="font-mono text-cyan-400 text-[10px] tracking-wide">⌨ DIGITAL ESCROW</span>;
      case 'bookkaaro':
      default:
        return <span className="font-bold text-indigo-300 text-[10px] tracking-wide">🛡️ VERIFIED BRAND</span>;
    }
  };

  // Helper for studio pedestal
  const renderPedestal = () => {
    switch (studioPedestal) {
      case 'travertine':
        return <div className="poster-pedestal-travertine" />;
      case 'obsidian_mirror':
        return <div className="poster-pedestal-obsidian" />;
      case 'cyber_neon':
        return <div className="poster-pedestal-cyber" />;
      case 'none':
        return null;
      case 'studio_clean':
      default:
        return <div className="poster-contact-shadow" />;
    }
  };

  return (
    <div 
      className="poster-container-root rounded-2xl shadow-2xl overflow-hidden border border-slate-800 w-full"
      style={dynamicStyles as React.CSSProperties}
    >
      <div 
        className="poster-shell"
        data-format={format}
        data-archetype={archetype}
        style={{
          background: isLightBg 
            ? `linear-gradient(135deg, ${bgColor} 0%, #ffffff 50%, #f1f5f9 100%)`
            : `linear-gradient(135deg, ${bgColor} 0%, #090d16 55%, #020617 100%)`
        }}
      >
        {/* Subtle background ambient dot pattern */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `radial-gradient(${accentColor} 1.2px, transparent 1.2px)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* ---------------------------------------------------------------------
            LANDSCAPE MODE (16:9) — TWO COLUMN DUAL SPLIT (ZERO OVERLAP)
            --------------------------------------------------------------------- */}
        {isLandscape ? (
          <div className="relative z-10 w-full h-full grid grid-cols-12 gap-5 items-center">
            {/* Left Column: Product Showcase */}
            <div className="col-span-5 h-full flex flex-col justify-center relative">
              <div className="relative w-full h-full max-h-[90%] rounded-2xl overflow-hidden bg-slate-900/50 border border-white/10 shadow-xl flex items-center justify-center p-3">
                <div className="poster-product-halo" style={{ backgroundColor: accentColor }} />
                {renderPedestal()}

                {productImage ? (
                  <img
                    src={productImage}
                    alt={productName}
                    className="relative z-10 max-h-full max-w-full object-contain drop-shadow-2xl"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <ShoppingBag className="w-12 h-12 text-slate-500" />
                )}

                {customDiscount && (
                  <div 
                    className="absolute top-2.5 right-2.5 z-20 poster-discount-stamp"
                    style={{
                      backgroundColor: archetype === 'flash_sale' ? '#facc15' : accentColor,
                      color: archetype === 'flash_sale' ? '#000000' : '#ffffff'
                    }}
                  >
                    {customDiscount}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Typography & Offer */}
            <div className="col-span-7 flex flex-col justify-center space-y-2.5 relative z-10 text-left">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="poster-kicker font-bold" style={{ color: accentColor }}>{brandName}</span>
                <span className="text-slate-400 text-xs">·</span>
                <span className="poster-kicker text-slate-300 font-semibold">{customHeadline}</span>
              </div>

              <h2 className="poster-title font-extrabold tracking-tight line-clamp-2" data-scale={fontSizeScale} style={{ color: titleColor }}>
                {effectiveTitle}
              </h2>

              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="poster-price-active" style={{ color: priceColor }}>{customPrice}</span>
                {showStrikethrough && originalPrice && (
                  <span className="poster-price-strike text-slate-400">{originalPrice}</span>
                )}
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                {badgeCOD && (
                  <span className="poster-badge-chip bg-white/10 text-slate-200 border border-white/15">
                    <Banknote className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>Cash on Delivery</span>
                  </span>
                )}
                {badgeFreeDelivery && (
                  <span className="poster-badge-chip bg-white/10 text-slate-200 border border-white/15">
                    <Truck className="w-3 h-3 text-sky-400 shrink-0" />
                    <span>Free Shipping</span>
                  </span>
                )}
                {badgeVerifiedSeller && (
                  <span className="poster-badge-chip bg-white/10 text-slate-200 border border-white/15">
                    <ShieldCheck className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>Verified Quality</span>
                  </span>
                )}
              </div>

              <div className="pt-1 flex items-center gap-3 flex-wrap">
                <button
                  type="button"
                  className="poster-cta-button cursor-pointer"
                  style={{
                    backgroundColor: archetype === 'flash_sale' ? '#facc15' : accentColor,
                    color: archetype === 'flash_sale' ? '#000000' : '#ffffff'
                  }}
                >
                  <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                  <span>{customCta}</span>
                </button>

                <div className="poster-footer text-slate-400 flex items-center gap-2">
                  <span>Store: {storeHandle}</span>
                  {phoneText && (
                    <>
                      <span>·</span>
                      <span>WA: {phoneText}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ---------------------------------------------------------------------
             VERTICAL FORMATS: SQUARE (1:1), PORTRAIT (4:5), STORY (9:16)
             CLEAN 3-TIER HIERARCHY WITH ZERO OVERLAP
             --------------------------------------------------------------------- */
          <div className="relative z-10 w-full h-full flex flex-col justify-between overflow-hidden gap-2">
            
            {/* TIER 1: TOP BAR / HEADER (SHRINK-0) */}
            <div className="w-full shrink-0 flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-950/60 border border-white/10 backdrop-blur-sm shadow-xs">
              <div className="flex items-center gap-2 min-w-0">
                <Store className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="poster-kicker font-bold tracking-tight text-white truncate">
                  {brandName.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {composition === 'flash_urgency' ? (
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-600 text-white font-extrabold text-[10px] uppercase animate-pulse">
                    <Flame className="w-3 h-3 text-amber-300" />
                    <span>FLASH DEAL</span>
                  </div>
                ) : composition === 'whatsapp_catalog' ? (
                  <div className="inline-flex items-center gap-1 text-emerald-400 font-bold text-[10px]">
                    <MessageCircle className="w-3 h-3 fill-emerald-400" />
                    <span>WHATSAPP VIP</span>
                  </div>
                ) : (
                  renderPlatformBadge()
                )}
              </div>
            </div>

            {/* TIER 2: PRODUCT HERO STAGE (PROPORTIONAL HERO STAGE WITH COLOR FIDELITY) */}
            <div className="flex-1 min-h-0 w-full flex items-center justify-center relative p-1.5 overflow-hidden">
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Subtle soft backdrop ambient glow - low opacity so it never tints or washes product colors */}
                <div 
                  className="poster-product-halo opacity-25 pointer-events-none" 
                  style={{ backgroundColor: accentColor }} 
                />
                {renderPedestal()}

                {productImage ? (
                  <img
                    src={productImage}
                    alt={productName}
                    className="relative z-10 max-h-full max-w-full object-contain drop-shadow-xl select-none"
                    referrerPolicy="no-referrer"
                    style={{
                      // Ensure true product color is maintained without any filter bleed
                      filter: 'none',
                      imageRendering: 'auto'
                    }}
                  />
                ) : (
                  <div className="relative z-10 flex flex-col items-center justify-center text-slate-500">
                    <ShoppingBag className="w-10 h-10 stroke-1" />
                    <span className="text-[10px] uppercase tracking-wider mt-1 font-semibold">Product Showcase</span>
                  </div>
                )}

                {/* Clean Corner Discount Badge */}
                {customDiscount && (
                  <div 
                    className="absolute top-1 right-1 z-20 poster-discount-stamp shadow-lg"
                    style={{
                      backgroundColor: archetype === 'flash_sale' ? '#facc15' : accentColor,
                      color: archetype === 'flash_sale' ? '#000000' : '#ffffff'
                    }}
                  >
                    {customDiscount}
                  </div>
                )}

                {/* Clean Corner Promo Code */}
                {showPromoCode && promoCode && (
                  <div className="absolute top-1 left-1 z-20 poster-promo-pill bg-slate-950/85 text-white border border-white/20 backdrop-blur-xs shadow-md">
                    {promoCode}
                  </div>
                )}
              </div>
            </div>

            {/* TIER 3: CONVERSION & OFFER CARD (ORGANIZED ZERO-OVERLAP LAYOUT) */}
            <div className={`w-full shrink-0 rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 text-center flex flex-col justify-center gap-1 sm:gap-1.5 shadow-xl ${getSurfaceClass()}`}>
              
              {/* Contextual Single Highlight Row (Zero collision: exactly 1 contextual feature displayed cleanly) */}
              {composition === 'flash_urgency' ? (
                <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-amber-300 bg-red-950/80 border border-red-500/40 px-2.5 py-0.5 sm:py-1 rounded-lg">
                  <span className="flex items-center gap-1 truncate">
                    <Zap className="w-3 h-3 text-amber-300 shrink-0" />
                    <span className="truncate">{urgencyText}</span>
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-red-200 uppercase shrink-0 font-extrabold ml-1">Limited Stock</span>
                </div>
              ) : composition === 'social_proof_ugc' ? (
                <div className="bg-slate-950/70 border border-white/10 rounded-lg px-2.5 py-1 text-left flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div className="flex items-center text-amber-400 shrink-0">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-2.5 h-2.5 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-200 italic truncate font-medium">"{reviewQuote}"</p>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-400 shrink-0 flex items-center gap-0.5">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span className="hidden sm:inline">{reviewerName}</span>
                  </span>
                </div>
              ) : composition === 'infographic_features' && keyFeatures.length > 0 ? (
                <div className="flex items-center justify-center gap-1 overflow-x-auto no-scrollbar py-0.5">
                  {keyFeatures.slice(0, 3).map((feat, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 whitespace-nowrap">
                      ✦ {feat}
                    </span>
                  ))}
                </div>
              ) : ratingText ? (
                <div className="flex items-center justify-center gap-1 text-amber-400 poster-rating">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
                  <span className="text-[10px] font-bold">{ratingText}</span>
                </div>
              ) : null}

              {/* Product Headline - Calibrated line height and clamp */}
              <h2 
                className="poster-title font-extrabold tracking-tight line-clamp-1 sm:line-clamp-2 px-1"
                data-scale={fontSizeScale}
                style={{ color: cardBackdrop === 'cyclorama_clean' ? '#09090b' : titleColor }}
              >
                {effectiveTitle}
              </h2>

              {/* Price Row (Sale Price + Strikethrough) */}
              <div className="flex items-baseline justify-center gap-2 sm:gap-2.5 flex-wrap">
                <span 
                  className="poster-price-active"
                  style={{ color: cardBackdrop === 'cyclorama_clean' ? '#0f172a' : priceColor }}
                >
                  {customPrice}
                </span>
                {showStrikethrough && originalPrice && (
                  <span className="poster-price-strike text-slate-400 text-xs sm:text-sm font-semibold">{originalPrice}</span>
                )}
              </div>

              {/* Trust Badges Row - Clean single row with horizontal auto-fit (Never wraps awkwardly) */}
              {(badgeCOD || badgeFreeDelivery || badgeVerifiedSeller) && (
                <div className="flex items-center justify-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                  {badgeCOD && (
                    <span className="poster-badge-chip shrink-0" style={{ backgroundColor: effectiveBadgeBg, color: effectiveBadgeColor }}>
                      <Banknote className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400 shrink-0" />
                      <span>Cash on Delivery</span>
                    </span>
                  )}
                  {badgeFreeDelivery && (
                    <span className="poster-badge-chip shrink-0" style={{ backgroundColor: effectiveBadgeBg, color: effectiveBadgeColor }}>
                      <Truck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-sky-400 shrink-0" />
                      <span>Free Shipping</span>
                    </span>
                  )}
                  {badgeVerifiedSeller && (
                    <span className="poster-badge-chip shrink-0" style={{ backgroundColor: effectiveBadgeBg, color: effectiveBadgeColor }}>
                      <ShieldCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400 shrink-0" />
                      <span>Verified Quality</span>
                    </span>
                  )}
                </div>
              )}

              {/* Primary Call to Action Button */}
              <div className="pt-0.5">
                <button
                  type="button"
                  className="poster-cta-button w-full sm:w-auto mx-auto cursor-pointer"
                  style={{
                    backgroundColor: composition === 'whatsapp_catalog' 
                      ? '#059669' 
                      : (archetype === 'flash_sale' ? '#facc15' : accentColor),
                    color: archetype === 'flash_sale' ? '#000000' : '#ffffff'
                  }}
                >
                  {composition === 'whatsapp_catalog' ? (
                    <>
                      <MessageCircle className="w-3.5 h-3.5 fill-white shrink-0" />
                      <span>WhatsApp Us to Order</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                      <span>{customCta}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Clean Footer Info */}
              <div className="poster-footer text-slate-400 flex items-center justify-center gap-1.5 text-[9px] sm:text-[10px] truncate">
                <span className="truncate">{storeHandle}</span>
                {phoneText && (
                  <>
                    <span>·</span>
                    <span className="truncate">WA: {phoneText}</span>
                  </>
                )}
              </div>

            </div>

          </div>
        )}
      </div>
    </div>
  );
};
