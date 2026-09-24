import React, { useState, useEffect, useRef } from 'react';
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
  Star
} from 'lucide-react';
import { PosterTemplate } from '../../types';

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
  | 'modern_minimal'
  | 'bold_flash_sale'
  | 'bookkaaro_official'
  | 'luxury_gold'
  | 'split_showcase'
  | 'festive_eid'
  | 'cyber_tech'
  | 'story_status'
  | 'retail_mega'
  | 'bestseller_5star'
  | 'boutique_artisan'
  | 'fresh_drop';

interface TemplateOption {
  id: PosterStyleArchetype;
  name: string;
  tagline: string;
  bgGrad: [string, string];
  accent: string;
  accentSecondary: string;
  textColor: string;
  subColor: string;
  badgeBg: string;
  badgeText: string;
}

const POSTER_TEMPLATES: TemplateOption[] = [
  {
    id: 'bookkaaro_official',
    name: 'Book Kaaro Official',
    tagline: 'VERIFIED ON BOOKKAARO.COM',
    bgGrad: ['#1e1b4b', '#0f172a'],
    accent: '#6366f1',
    accentSecondary: '#818cf8',
    textColor: '#ffffff',
    subColor: '#cbd5e1',
    badgeBg: '#4f46e5',
    badgeText: '#ffffff'
  },
  {
    id: 'modern_minimal',
    name: 'Modern Minimal D2C',
    tagline: 'SIGNATURE COLLECTION',
    bgGrad: ['#0f172a', '#020617'],
    accent: '#38bdf8',
    accentSecondary: '#818cf8',
    textColor: '#ffffff',
    subColor: '#94a3b8',
    badgeBg: '#38bdf8',
    badgeText: '#0f172a'
  },
  {
    id: 'bold_flash_sale',
    name: 'Flash Sale (Urgent)',
    tagline: '24-HOUR FLASH SALE',
    bgGrad: ['#450a0a', '#18181b'],
    accent: '#ef4444',
    accentSecondary: '#f97316',
    textColor: '#ffffff',
    subColor: '#fed7aa',
    badgeBg: '#ef4444',
    badgeText: '#ffffff'
  },
  {
    id: 'luxury_gold',
    name: 'Luxury Obsidian Gold',
    tagline: 'EXCLUSIVE VIP EDITION',
    bgGrad: ['#1c1917', '#09090b'],
    accent: '#d97706',
    accentSecondary: '#f59e0b',
    textColor: '#ffffff',
    subColor: '#d6d3d1',
    badgeBg: '#d97706',
    badgeText: '#ffffff'
  },
  {
    id: 'split_showcase',
    name: 'Split Contrast Studio',
    tagline: 'PREMIUM QUALITY',
    bgGrad: ['#312e81', '#1e1b4b'],
    accent: '#a855f7',
    accentSecondary: '#c084fc',
    textColor: '#ffffff',
    subColor: '#e0e7ff',
    badgeBg: '#a855f7',
    badgeText: '#ffffff'
  },
  {
    id: 'festive_eid',
    name: 'Eid & Ramadan Mubarak',
    tagline: 'EID SPECIAL CELEBRATION',
    bgGrad: ['#064e3b', '#022c22'],
    accent: '#10b981',
    accentSecondary: '#34d399',
    textColor: '#ffffff',
    subColor: '#a7f3d0',
    badgeBg: '#10b981',
    badgeText: '#ffffff'
  },
  {
    id: 'bestseller_5star',
    name: '5-Star Best Seller',
    tagline: '★★★★★ #1 TOP RATED',
    bgGrad: ['#111827', '#030712'],
    accent: '#eab308',
    accentSecondary: '#facc15',
    textColor: '#ffffff',
    subColor: '#fef08a',
    badgeBg: '#eab308',
    badgeText: '#0f172a'
  },
  {
    id: 'retail_mega',
    name: 'Retail Mega Discount',
    tagline: 'BIGGEST DEALS OF THE YEAR',
    bgGrad: ['#7f1d1d', '#3b0764'],
    accent: '#f43f5e',
    accentSecondary: '#fb7185',
    textColor: '#ffffff',
    subColor: '#fecdd3',
    badgeBg: '#f43f5e',
    badgeText: '#ffffff'
  },
  {
    id: 'cyber_tech',
    name: 'Cyberpunk Neo',
    tagline: 'NEXT-GEN INNOVATION',
    bgGrad: ['#020617', '#0f172a'],
    accent: '#06b6d4',
    accentSecondary: '#ec4899',
    textColor: '#ffffff',
    subColor: '#67e8f9',
    badgeBg: '#06b6d4',
    badgeText: '#020617'
  },
  {
    id: 'story_status',
    name: 'Story & Reels Vertical',
    tagline: 'SWIPE UP / DM TO BUY',
    bgGrad: ['#4c1d95', '#1e1b4b'],
    accent: '#ec4899',
    accentSecondary: '#f472b6',
    textColor: '#ffffff',
    subColor: '#fbcfe8',
    badgeBg: '#ec4899',
    badgeText: '#ffffff'
  },
  {
    id: 'boutique_artisan',
    name: 'Boutique Handcrafted',
    tagline: 'AUTHENTIC CRAFTSMANSHIP',
    bgGrad: ['#292524', '#1c1917'],
    accent: '#14b8a6',
    accentSecondary: '#2dd4bf',
    textColor: '#ffffff',
    subColor: '#ccfbf1',
    badgeBg: '#14b8a6',
    badgeText: '#ffffff'
  },
  {
    id: 'fresh_drop',
    name: 'Fresh Season Drop',
    tagline: 'JUST ARRIVED IN STOCK',
    bgGrad: ['#0369a1', '#0c4a6e'],
    accent: '#38bdf8',
    accentSecondary: '#7dd3fc',
    textColor: '#ffffff',
    subColor: '#e0f2fe',
    badgeBg: '#38bdf8',
    badgeText: '#0c4a6e'
  }
];

const FORMATS = [
  { id: 'square', label: '1:1 Square', width: 1080, height: 1080, sub: 'Instagram / FB / Book Kaaro' },
  { id: 'story', label: '9:16 Story', width: 1080, height: 1920, sub: 'WhatsApp Status / Reels' },
  { id: 'portrait', label: '4:5 Portrait', width: 1080, height: 1350, sub: 'Instagram Feed Post' },
  { id: 'landscape', label: '16:9 Banner', width: 1200, height: 675, sub: 'Facebook / Web Banner' },
];

export const TabPosterStudio: React.FC<TabPosterStudioProps> = ({
  productImage,
  productName,
  price,
  currency = "PKR",
  discountPercent = 25,
  brandName = "Shop Official",
  whatsappNumber = "+92 300 1234567",
  keyFeatures = ["Verified Authentic Quality", "Cash on Delivery Available", "Fast Doorstep Dispatch"],
  canvasRefCallback
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<PosterStyleArchetype>('bookkaaro_official');
  const [selectedFormat, setSelectedFormat] = useState('square');
  
  // Customizable Poster Texts
  const [customHeadline, setCustomHeadline] = useState('VERIFIED ON BOOKKAARO.COM');
  const [customSubhead, setCustomSubhead] = useState(productName || 'Luxury Edition');
  const [customCta, setCustomCta] = useState('ORDER NOW • DM TO BUY');
  const [customPrice, setCustomPrice] = useState(price ? `${currency} ${price.toLocaleString()}` : '');
  const [originalStrikethroughPrice, setOriginalStrikethroughPrice] = useState(
    price ? `${currency} ${Math.round(price * 1.35).toLocaleString()}` : ''
  );
  const [customDiscount, setCustomDiscount] = useState(`${discountPercent}% OFF`);
  const [bgColor, setBgColor] = useState('#1e1b4b');
  const [accentColor, setAccentColor] = useState('#6366f1');
  const [phoneText, setPhoneText] = useState(whatsappNumber);
  const [brandText, setBrandText] = useState(brandName);

  // Trust Badges & Badges Toggles
  const [badgeCOD, setBadgeCOD] = useState(true);
  const [badgeFreeDelivery, setBadgeFreeDelivery] = useState(true);
  const [badgeVerifiedSeller, setBadgeVerifiedSeller] = useState(true);
  const [showStrikethrough, setShowStrikethrough] = useState(true);

  const [copiedNotice, setCopiedNotice] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prodImgRef = useRef<HTMLImageElement | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Handle template selection
  const handleTemplateChange = (tplId: PosterStyleArchetype) => {
    setSelectedTemplate(tplId);
    const tpl = POSTER_TEMPLATES.find((t) => t.id === tplId);
    if (tpl) {
      setCustomHeadline(tpl.tagline);
      setBgColor(tpl.bgGrad[0]);
      setAccentColor(tpl.accent);
    }
  };

  // Pre-load product image into an Image instance safely
  useEffect(() => {
    if (!productImage) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      prodImgRef.current = img;
      setImageLoaded(true);
    };
    img.onerror = () => {
      // Retry without anonymous in case CORS is restricted
      const retry = new Image();
      retry.onload = () => {
        prodImgRef.current = retry;
        setImageLoaded(true);
      };
      retry.src = productImage;
    };
    img.src = productImage;
  }, [productImage]);

  // Render on canvas whenever any property changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (canvasRefCallback) canvasRefCallback(canvas);

    const fmt = FORMATS.find((f) => f.id === selectedFormat) || FORMATS[0];
    canvas.width = fmt.width;
    canvas.height = fmt.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const tpl = POSTER_TEMPLATES.find(t => t.id === selectedTemplate) || POSTER_TEMPLATES[0];
    const isStory = selectedFormat === 'story';
    const isLandscape = selectedFormat === 'landscape';
    const isPortrait = selectedFormat === 'portrait';

    // 1. Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bgGrad.addColorStop(0, bgColor);
    bgGrad.addColorStop(0.65, tpl.bgGrad[1]);
    bgGrad.addColorStop(1, '#020617');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative geometric rings / ambient background lines
    ctx.save();
    ctx.strokeStyle = accentColor;
    ctx.globalAlpha = 0.12;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(canvas.width * 0.85, canvas.height * 0.18, canvas.width * 0.38, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(canvas.width * 0.12, canvas.height * 0.82, canvas.width * 0.35, 0, Math.PI * 2);
    ctx.stroke();

    // Subtle diagonal decorative stripe for bold sale template
    if (selectedTemplate === 'bold_flash_sale' || selectedTemplate === 'retail_mega') {
      ctx.globalAlpha = 0.08;
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.moveTo(-100, canvas.height * 0.4);
      ctx.lineTo(canvas.width + 100, canvas.height * 0.2);
      ctx.lineTo(canvas.width + 100, canvas.height * 0.35);
      ctx.lineTo(-100, canvas.height * 0.55);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    // 2. Top Header Bar: Brand Name & Headline Tag Pill
    const paddingX = isLandscape ? 60 : 70;
    const topY = isStory ? 100 : 70;

    // Brand Name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(brandText.toUpperCase(), paddingX, topY + 25);

    // Headline Pill on Right
    ctx.save();
    ctx.fillStyle = accentColor;
    const pillText = customHeadline.toUpperCase();
    ctx.font = 'bold 20px sans-serif';
    const pillWidth = ctx.measureText(pillText).width + 36;
    const pillHeight = 42;
    const pillX = canvas.width - paddingX - pillWidth;
    const pillY = topY - 5;
    ctx.beginPath();
    ctx.roundRect(pillX, pillY, pillWidth, pillHeight, 21);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(pillText, pillX + pillWidth / 2, pillY + 27);
    ctx.restore();

    // 3. Draw Product Image Stage & Placement
    const imgSize = isLandscape 
      ? canvas.height * 0.75 
      : isStory 
      ? canvas.width * 0.72 
      : isPortrait 
      ? canvas.width * 0.65 
      : canvas.width * 0.58;

    const imgX = isLandscape ? paddingX : (canvas.width - imgSize) / 2;
    const imgY = isLandscape 
      ? (canvas.height - imgSize) / 2 
      : isStory 
      ? canvas.height * 0.20 
      : isPortrait 
      ? canvas.height * 0.16 
      : canvas.height * 0.17;

    // Soft Ambient Glow / Spotlight behind product
    ctx.save();
    ctx.shadowColor = accentColor;
    ctx.shadowBlur = 45;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(imgX + imgSize / 2, imgY + imgSize / 2, imgSize * 0.44, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Draw Image or Fallback Container
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(imgX, imgY, imgSize, imgSize, 32);
    ctx.clip();

    if (prodImgRef.current && imageLoaded) {
      ctx.drawImage(prodImgRef.current, imgX, imgY, imgSize, imgSize);
    } else {
      // Fallback graphic if image is loading or unavailable
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(imgX, imgY, imgSize, imgSize);
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 28px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(productName, imgX + imgSize / 2, imgY + imgSize / 2);
    }
    ctx.restore();

    // High-End Product Border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.roundRect(imgX, imgY, imgSize, imgSize, 32);
    ctx.stroke();

    // 4. Discount Badge Stamp (Top-Right of Product Box)
    if (customDiscount) {
      ctx.save();
      const badgeX = imgX + imgSize - 25;
      const badgeY = imgY + 35;
      const badgeRadius = 52;

      ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
      ctx.shadowBlur = 15;
      ctx.fillStyle = '#ef4444'; // Bright high-converting discount red
      ctx.beginPath();
      ctx.arc(badgeX, badgeY, badgeRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(customDiscount, badgeX, badgeY + 8);
      ctx.restore();
    }

    // 5. Typography & Product Details Section
    const contentStartX = isLandscape ? canvas.width * 0.48 : canvas.width / 2;
    const contentStartY = isLandscape 
      ? 150 
      : isStory 
      ? canvas.height * 0.60 
      : isPortrait 
      ? canvas.height * 0.64 
      : canvas.height * 0.68;

    ctx.textAlign = isLandscape ? 'left' : 'center';

    // Subhead / Product Name (with line wrap if long)
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 42px sans-serif';
    const maxTextWidth = isLandscape ? canvas.width * 0.46 : canvas.width - 140;

    // Smart Wrap Function
    const words = customSubhead.split(' ');
    let line1 = '';
    let line2 = '';
    for (let n = 0; n < words.length; n++) {
      const testLine = line1 ? `${line1} ${words[n]}` : words[n];
      const testWidth = ctx.measureText(testLine).width;
      if (testWidth > maxTextWidth && n > 0 && !line2) {
        line2 = words[n];
      } else if (line2) {
        line2 += ` ${words[n]}`;
      } else {
        line1 = testLine;
      }
    }

    ctx.fillText(line1, contentStartX, contentStartY);
    let titleOffset = 0;
    if (line2) {
      titleOffset = 48;
      ctx.fillText(line2, contentStartX, contentStartY + titleOffset);
    }

    // Price Badges & Strikethrough
    const priceY = contentStartY + 65 + titleOffset;
    if (customPrice) {
      ctx.save();
      // Main Active Sale Price
      ctx.fillStyle = accentColor;
      ctx.font = '900 48px sans-serif';
      ctx.fillText(customPrice, contentStartX, priceY);

      // Strikethrough original price if enabled
      if (showStrikethrough && originalStrikethroughPrice) {
        ctx.font = '600 28px sans-serif';
        ctx.fillStyle = '#94a3b8';
        const mainPriceWidth = ctx.measureText(customPrice).width;
        const strikeX = isLandscape ? contentStartX + mainPriceWidth + 30 : contentStartX + 180;
        const strikeY = isLandscape ? priceY : priceY - 4;
        
        ctx.fillText(originalStrikethroughPrice, strikeX, strikeY);
        // Strikethrough line
        const strikeWidth = ctx.measureText(originalStrikethroughPrice).width;
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3;
        ctx.beginPath();
        const startX = isLandscape ? strikeX : strikeX - strikeWidth / 2;
        ctx.moveTo(startX, strikeY - 8);
        ctx.lineTo(startX + strikeWidth, strikeY - 8);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Trust Bullet Highlights
    if (!isLandscape && keyFeatures.length > 0) {
      const bulletsY = priceY + 50;
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '600 20px sans-serif';
      const bulletStr = keyFeatures.slice(0, 2).join('   •   ');
      ctx.fillText(bulletStr, contentStartX, bulletsY);
    }

    // 6. Badges Row (COD, Free Delivery, Verified)
    const badgesY = isLandscape ? priceY + 60 : priceY + 95;
    const badges: string[] = [];
    if (badgeCOD) badges.push('CASH ON DELIVERY');
    if (badgeFreeDelivery) badges.push('FREE SHIPPING');
    if (badgeVerifiedSeller) badges.push('VERIFIED QUALITY');

    if (badges.length > 0) {
      ctx.save();
      ctx.font = 'bold 15px sans-serif';
      ctx.fillStyle = '#38bdf8';
      const badgeStr = badges.join('   |   ');
      ctx.fillText(badgeStr, contentStartX, badgesY);
      ctx.restore();
    }

    // 7. Bottom CTA Button & WhatsApp
    const bottomY = canvas.height - (isStory ? 140 : 95);

    // Call to Action Box
    const ctaWidth = isLandscape ? 340 : 440;
    const ctaHeight = 64;
    const ctaX = isLandscape ? contentStartX : (canvas.width - ctaWidth) / 2;
    const ctaY = bottomY - 32;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 18;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(ctaX, ctaY, ctaWidth, ctaHeight, 32);
    ctx.fill();

    ctx.fillStyle = '#0f172a';
    ctx.font = '900 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(customCta.toUpperCase(), ctaX + ctaWidth / 2, ctaY + 40);
    ctx.restore();

    // WhatsApp / Phone Direct Ordering Line
    if (phoneText) {
      ctx.fillStyle = '#cbd5e1';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = isLandscape ? 'left' : 'center';
      const phoneX = isLandscape ? contentStartX : canvas.width / 2;
      const phoneY = isLandscape ? canvas.height - 35 : canvas.height - 30;
      ctx.fillText(`WhatsApp Orders: ${phoneText}`, phoneX, phoneY);
    }
  }, [
    productImage,
    imageLoaded,
    selectedTemplate,
    selectedFormat,
    customHeadline,
    customSubhead,
    customCta,
    customPrice,
    originalStrikethroughPrice,
    customDiscount,
    bgColor,
    accentColor,
    phoneText,
    brandText,
    keyFeatures,
    badgeCOD,
    badgeFreeDelivery,
    badgeVerifiedSeller,
    showStrikethrough
  ]);

  // Safe PNG download handler
  const downloadPoster = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const safeName = productName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        a.download = `${safeName}_${selectedTemplate}_poster.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 'image/png');
    } catch {
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `${productName.replace(/\s+/g, '_')}_poster.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  // Copy poster to clipboard
  const handleCopyPosterToClipboard = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        // @ts-ignore
        if (navigator.clipboard && navigator.clipboard.write) {
          // @ts-ignore
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          setCopiedNotice(true);
          setTimeout(() => setCopiedNotice(false), 2000);
        }
      });
    } catch {
      // Ignore if permission denied
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-indigo-600" />
            <span>High-Converting Promotional Poster Studio</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Render high-resolution marketing creatives formatted for Book Kaaro, Instagram, Facebook, and WhatsApp Status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyPosterToClipboard}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copiedNotice ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedNotice ? "Copied!" : "Copy Poster"}</span>
          </button>

          <button
            onClick={downloadPoster}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 flex items-center gap-1.5 shadow-md shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Poster (PNG)</span>
          </button>
        </div>
      </div>

      {/* Templates Selector */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
          Select Campaign Style & Design Archetype (12 Designs):
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {POSTER_TEMPLATES.map((tpl) => {
            const isSelected = selectedTemplate === tpl.id;
            return (
              <button
                key={tpl.id}
                onClick={() => handleTemplateChange(tpl.id)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 ring-2 ring-indigo-600/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span className={`text-xs font-bold block truncate ${isSelected ? 'text-indigo-950 dark:text-indigo-200' : 'text-slate-700 dark:text-slate-300'}`}>
                  {tpl.name}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate mt-0.5">
                  {tpl.tagline}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Controls & Canvas Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Customization Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
            
            {/* Format Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Output Format:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {FORMATS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFormat(f.id)}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                      selectedFormat === f.id
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="font-bold">{f.label}</div>
                    <div className="text-[10px] opacity-75 truncate">{f.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Background Base
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-8 h-8 rounded-lg border-0 cursor-pointer p-0"
                  />
                  <span className="text-xs font-mono text-slate-500">{bgColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Accent Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-8 h-8 rounded-lg border-0 cursor-pointer p-0"
                  />
                  <span className="text-xs font-mono text-slate-500">{accentColor}</span>
                </div>
              </div>
            </div>

            {/* Text Inputs */}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Top Tag / Headline Pill
                </label>
                <input
                  type="text"
                  value={customHeadline}
                  onChange={(e) => setCustomHeadline(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Product Display Title
                </label>
                <input
                  type="text"
                  value={customSubhead}
                  onChange={(e) => setCustomSubhead(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Sale Price Badge
                  </label>
                  <input
                    type="text"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Original Price (Cut)
                  </label>
                  <input
                    type="text"
                    value={originalStrikethroughPrice}
                    onChange={(e) => setOriginalStrikethroughPrice(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Discount Stamp
                  </label>
                  <input
                    type="text"
                    value={customDiscount}
                    onChange={(e) => setCustomDiscount(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-rose-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={customCta}
                    onChange={(e) => setCustomCta(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    value={brandText}
                    onChange={(e) => setBrandText(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={phoneText}
                    onChange={(e) => setPhoneText(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </div>
              </div>

              {/* Trust Badges Checkbox Toggles */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Conversion & Trust Badges:
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={badgeCOD}
                      onChange={(e) => setBadgeCOD(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>COD Ready</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={badgeFreeDelivery}
                      onChange={(e) => setBadgeFreeDelivery(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Free Shipping</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={badgeVerifiedSeller}
                      onChange={(e) => setBadgeVerifiedSeller(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Verified</span>
                  </label>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Right: Live Canvas Preview (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="p-4 bg-slate-900 rounded-3xl shadow-2xl max-w-lg w-full flex items-center justify-center border border-slate-800">
            <canvas
              ref={canvasRef}
              className="max-h-[640px] w-auto h-auto rounded-2xl shadow-2xl object-contain"
            />
          </div>
          <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
            <span>Template: <strong className="text-white">{POSTER_TEMPLATES.find(t => t.id === selectedTemplate)?.name}</strong></span>
            <span>•</span>
            <span>Format: <strong className="text-white">{FORMATS.find(f => f.id === selectedFormat)?.label}</strong></span>
          </div>
        </div>

      </div>

    </div>
  );
};
