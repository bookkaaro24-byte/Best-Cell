import React, { useState, useRef, useMemo, useEffect } from 'react';
import { 
  UploadCloud, 
  Camera, 
  Trash2, 
  RefreshCw, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  ChevronRight, 
  Layers, 
  Coins, 
  Sliders,
  Check, 
  TrendingUp, 
  Calendar, 
  ShieldCheck, 
  Crop, 
  Wand2, 
  Mic,
  Eye,
  Grid,
  Pin,
  Lock,
  Ratio,
  Tag,
  Zap
} from 'lucide-react';
import { FixedProductOverlay } from './FixedProductOverlay';
import { ImageRefineModal } from './ImageRefineModal';
import { CameraCaptureModal } from './CameraCaptureModal';
import { BackgroundRemovalModal } from './BackgroundRemovalModal';
import { 
  ImageEditorPanel, 
  ImageAdjustments, 
  DEFAULT_ADJUSTMENTS, 
  renderAdjustedImage 
} from './ImageEditorPanel';
import { VoiceDictationButton } from './VoiceDictationButton';
import { 
  ProductInput, 
  AIProductAnalysis, 
  CurrencyCode, 
  TargetMarket, 
  LanguageCode, 
  UserProfile,
  BusinessType
} from '../types';
import { 
  PRODUCT_CATEGORIES, 
  DIGITAL_CATEGORIES,
  HANDMADE_CATEGORIES,
  RENTAL_CATEGORIES,
  REAL_ESTATE_CATEGORIES,
  INDUSTRIAL_CATEGORIES,
  SERVICE_CATEGORIES, 
  ALL_CATEGORIES,
  CategoryDefinition 
} from '../data/categories';

interface ProductWorkspaceProps {
  image: string | null;
  setImage: (img: string | null) => void;
  productInfo: ProductInput;
  setProductInfo: React.Dispatch<React.SetStateAction<ProductInput>>;
  analysis: AIProductAnalysis | null;
  setAnalysis: React.Dispatch<React.SetStateAction<AIProductAnalysis | null>>;
  onAnalyze: () => Promise<void>;
  isAnalyzing: boolean;
  onCreateSellingPackage: () => Promise<void>;
  isGeneratingPackage: boolean;
  userProfile: UserProfile;
  onOpenCreditsModal: () => void;
  onOpenAssistant?: () => void;
}

const CATEGORIES = [
  "Fashion",
  "Shoes",
  "Bags",
  "Jewelry",
  "Beauty",
  "Cosmetics",
  "Electronics",
  "Mobile Accessories",
  "Home & Kitchen",
  "Furniture",
  "Food",
  "Sports",
  "Automotive",
  "Kids",
  "Other"
];

const CURRENCIES: CurrencyCode[] = ["PKR", "AED", "USD", "GBP", "EUR"];
const TARGET_MARKETS: TargetMarket[] = ["Pakistan", "UAE", "International", "Custom"];

const LANGUAGES: { code: LanguageCode; label: string; sub: string }[] = [
  { code: 'en', label: 'English', sub: 'Global' },
  { code: 'ur', label: 'Urdu', sub: 'اردو رسم الخط' },
  { code: 'roman_ur', label: 'Roman Urdu', sub: 'Casual Latin' },
  { code: 'ar', label: 'Arabic', sub: 'العربية' },
];

export const ProductWorkspace: React.FC<ProductWorkspaceProps> = ({
  image,
  setImage,
  productInfo,
  setProductInfo,
  analysis,
  setAnalysis,
  onAnalyze,
  isAnalyzing,
  onCreateSellingPackage,
  isGeneratingPackage,
  userProfile,
  onOpenCreditsModal,
  onOpenAssistant
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isEditingAnalysis, setIsEditingAnalysis] = useState(false);
  const [categoryTypeFilter, setCategoryTypeFilter] = useState<'all' | BusinessType>('all');
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [isCustomCategoryActive, setIsCustomCategoryActive] = useState(false);
  const [isRefineModalOpen, setIsRefineModalOpen] = useState(false);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [isBgRemovalOpen, setIsBgRemovalOpen] = useState(false);
  const [rawSourceImage, setRawSourceImage] = useState<string | null>(image);
  const [adjustments, setAdjustments] = useState<ImageAdjustments>(DEFAULT_ADJUSTMENTS);
  const [isComparing, setIsComparing] = useState(false);
  const [isApplyingEdits, setIsApplyingEdits] = useState(false);
  const [isLayoutOverlayActive, setIsLayoutOverlayActive] = useState(true);
  const [showGridGuide, setShowGridGuide] = useState(false);
  const [aspectGuide, setAspectGuide] = useState<'none' | '1:1' | '4:5' | '9:16'>('none');
  const [fixedOverlayEnabled, setFixedOverlayEnabled] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Synchronize rawSourceImage if image changed
  useEffect(() => {
    if (image && !rawSourceImage) {
      setRawSourceImage(image);
    }
  }, [image, rawSourceImage]);

  const hasAdjustments = useMemo(() => {
    return (
      adjustments.brightness !== 0 ||
      adjustments.contrast !== 0 ||
      adjustments.saturation !== 0 ||
      adjustments.warmth !== 0 ||
      adjustments.rotation !== 0 ||
      adjustments.flipH !== false
    );
  }, [adjustments]);

  const previewFilterStyle = useMemo(() => {
    if (isComparing || !hasAdjustments) return 'none';
    const bVal = 100 + adjustments.brightness;
    const cVal = 100 + adjustments.contrast;
    // When lockProductColor is active, preserve true product hues and avoid excessive saturation distortion
    const effectiveSat = adjustments.lockProductColor 
      ? Math.min(125, Math.max(75, 100 + adjustments.saturation * 0.4))
      : 100 + adjustments.saturation;

    let filterStr = `brightness(${bVal}%) contrast(${cVal}%) saturate(${effectiveSat}%)`;

    // Only apply warmth / hue tint when color lock is EXPLICITLY turned off by the user
    if (!adjustments.lockProductColor) {
      if (adjustments.warmth > 0) {
        filterStr += ` sepia(${adjustments.warmth * 0.4}%) hue-rotate(-${adjustments.warmth * 0.15}deg)`;
      } else if (adjustments.warmth < 0) {
        filterStr += ` hue-rotate(${Math.abs(adjustments.warmth) * 0.3}deg)`;
      }
    }
    return filterStr;
  }, [adjustments, isComparing, hasAdjustments]);

  const previewTransformStyle = useMemo(() => {
    if (isComparing || !hasAdjustments) return 'none';
    return `rotate(${adjustments.rotation}deg) scaleX(${adjustments.flipH ? -1 : 1})`;
  }, [adjustments.rotation, adjustments.flipH, isComparing, hasAdjustments]);

  const handleApplyEdits = async () => {
    const baseImg = rawSourceImage || image;
    if (!baseImg) return;
    setIsApplyingEdits(true);
    try {
      const baked = await renderAdjustedImage(baseImg, adjustments);
      setImage(baked);
      setRawSourceImage(baked);
      setAdjustments(DEFAULT_ADJUSTMENTS);
      setAnalysis(null);
    } catch (err) {
      console.error('Failed to apply image edits:', err);
    } finally {
      setIsApplyingEdits(false);
    }
  };

  const handleResetToOriginal = () => {
    if (rawSourceImage) {
      setImage(rawSourceImage);
    }
    setAdjustments(DEFAULT_ADJUSTMENTS);
  };

  const handleAnalyzeWithEdits = async () => {
    if (hasAdjustments) {
      const baseImg = rawSourceImage || image;
      if (baseImg) {
        setIsApplyingEdits(true);
        try {
          const baked = await renderAdjustedImage(baseImg, adjustments);
          setImage(baked);
          setRawSourceImage(baked);
          setAdjustments(DEFAULT_ADJUSTMENTS);
        } catch (e) {
          console.warn('Failed auto-bake before analyze:', e);
        } finally {
          setIsApplyingEdits(false);
        }
      }
    }
    await onAnalyze();
  };

  const handleCameraCapture = (capturedDataUrl: string) => {
    setErrorMessage(null);
    setImage(capturedDataUrl);
    setRawSourceImage(capturedDataUrl);
    setAdjustments(DEFAULT_ADJUSTMENTS);
    setAnalysis(null);
  };

  const handleApplyBgRemoval = (newImageSrc: string) => {
    setErrorMessage(null);
    setImage(newImageSrc);
    setRawSourceImage(newImageSrc);
    setAdjustments(DEFAULT_ADJUSTMENTS);
    setAnalysis(null);
  };

  // Determine current active category definition
  const currentCategory = ALL_CATEGORIES.find(c => c.name === productInfo.category);
  const isNonPhysical = productInfo.businessType && productInfo.businessType !== 'product';
  const isService = productInfo.businessType === 'service' || (currentCategory && currentCategory.type === 'service');

  const filteredCategories = ALL_CATEGORIES.filter((c) => {
    if (categoryTypeFilter !== 'all' && c.type !== categoryTypeFilter) return false;
    if (!categorySearchQuery) return true;
    const q = categorySearchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.group.toLowerCase().includes(q) ||
      c.examples.some(ex => ex.toLowerCase().includes(q))
    );
  });

  const handleFile = (file: File) => {
    setErrorMessage(null);
    if (!file.type.match(/^image\/(jpeg|png|webp|jpg)$/i)) {
      setErrorMessage("Please upload a valid image (JPG, PNG, or WebP).");
      return;
    }

    const maxSize = 12 * 1024 * 1024; // 12 MB
    if (file.size > maxSize) {
      setErrorMessage("Image is larger than 12MB. Please select a smaller photo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImage(result);
      setRawSourceImage(result);
      setAdjustments(DEFAULT_ADJUSTMENTS);
      // Reset previous analysis when new image is uploaded
      setAnalysis(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const toggleLanguage = (lang: LanguageCode) => {
    setProductInfo((prev) => {
      const current = prev.preferredLanguages || ['en', 'ur', 'roman_ur'];
      if (current.includes(lang)) {
        if (current.length === 1) return prev; // keep at least one
        return { ...prev, preferredLanguages: current.filter((l) => l !== lang) };
      } else {
        return { ...prev, preferredLanguages: [...current, lang] };
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Breadcrumb & Step Info */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
            Product Creation Workspace
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Step 1: Upload photo → Step 2: Review AI analysis → Step 3: Generate entire sales campaign
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400">Balance:</span>
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800">
            {userProfile.credits} Credits
          </span>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 flex items-start gap-3 text-rose-800 dark:text-rose-200 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Primary 1-Click Launch Header Bar (Instant Utility) */}
      {image && (
        <div className="mb-8 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/40 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 shrink-0">
              <Zap className="w-6 h-6 text-amber-300 fill-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg text-white">
                  1-Click Selling Campaign Ready
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Instant Output
                </span>
              </div>
              <p className="text-xs text-indigo-200/90 mt-0.5 max-w-xl">
                Generate all 14 marketing assets now: 5 Ad Variations • HD Posters • Multilingual Urdu/English • WhatsApp Broadcasts • Profit & COD Margins
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0 flex-wrap justify-end">
            {onOpenAssistant && (
              <button
                type="button"
                onClick={onOpenAssistant}
                className="px-4 py-3 rounded-2xl text-xs font-bold text-amber-300 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                title="Consult SellBoost Chief Sales Officer"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>AI Sales Copilot</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleAnalyzeWithEdits}
              disabled={isAnalyzing || isGeneratingPackage}
              className="flex-1 md:flex-none px-7 py-3.5 rounded-2xl text-xs sm:text-sm font-black text-slate-950 bg-gradient-to-r from-amber-300 via-white to-amber-200 hover:from-white hover:to-slate-100 active:scale-98 transition-all flex items-center justify-center gap-2 shadow-xl shadow-amber-400/20 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-slate-950 fill-slate-950" />
              <span>{isGeneratingPackage ? "Generating Full Campaign..." : "LAUNCH SELLING PACKAGE NOW"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Image Upload Area (5 cols - Sticky on desktop so it is always visible up while editing) */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-4 self-start">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                <span>{isService ? "Service Creative / Flyer / Portfolio" : "Product Photo"}</span>
                <span className="text-rose-500">*</span>
              </h3>
              {image && (
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                </span>
              )}
            </div>

            {/* Hidden file inputs */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
            />

            {!image ? (
              /* Upload / Camera Capture box */
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`relative flex flex-col items-center justify-center p-6 sm:p-8 border-2 border-dashed rounded-2xl transition-all ${
                  dragOver
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20'
                    : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100/70 dark:hover:bg-slate-800/70'
                }`}
              >
                {/* Primary Action: Direct In-App Camera Trigger */}
                <div className="w-full max-w-sm">
                  <button
                    type="button"
                    onClick={() => setIsCameraModalOpen(true)}
                    className="w-full py-4 px-5 rounded-2xl font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 hover:from-indigo-500 hover:to-indigo-700 active:scale-98 transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-3.5 cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="text-sm font-extrabold flex items-center gap-2">
                        <span>Capture with Camera</span>
                        <span className="text-[10px] uppercase font-black bg-emerald-400/90 text-slate-950 px-1.5 py-0.5 rounded tracking-wide shadow-xs">
                          Live
                        </span>
                      </div>
                      <div className="text-[11px] text-indigo-100 font-normal">
                        Snap photo directly in app with live viewfinder
                      </div>
                    </div>
                  </button>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 w-full max-w-xs my-3.5">
                  <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    or choose file
                  </span>
                  <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                </div>

                {/* Secondary Option: File browse / drag drop */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex flex-col items-center justify-center py-2 px-4 cursor-pointer rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors text-center"
                >
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                    <UploadCloud className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Upload existing photo or drag & drop</span>
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Supports JPG, PNG, WebP up to 12MB
                  </p>
                </div>
              </div>
            ) : (
              /* Image preview with permanent fixed overlay controls */
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-950 shadow-md">
                
                {/* Permanent Fixed Overlay Banner Status */}
                <div className="px-3 py-1.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-slate-800 flex items-center justify-between text-[11px] text-white">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span className="font-extrabold text-white flex items-center gap-1">
                      <Pin className="w-3 h-3 text-indigo-400 rotate-45" />
                      <span>Permanent Fixed Overlay</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[10px]">
                    <Lock className="w-3 h-3 text-emerald-400" />
                    <span>Original Pixels 100% Preserved</span>
                  </div>
                </div>

                <div className="aspect-square w-full flex items-center justify-center overflow-hidden relative bg-slate-950/20 select-none">
                  {/* Layer 0: The Permanent Fixed Product Image (Original Pixels Completely Untouched) */}
                  <img
                    src={rawSourceImage || image}
                    alt="Uploaded product preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain p-2 transition-all duration-150 relative z-10"
                    style={{
                      filter: isComparing ? 'none' : previewFilterStyle,
                      transform: isComparing ? 'none' : previewTransformStyle
                    }}
                  />

                  {/* Non-Destructive Overlay Layer 1: Rule of Thirds Guide Grid */}
                  {showGridGuide && !isComparing && (
                    <div className="absolute inset-0 pointer-events-none z-20 grid grid-cols-3 grid-rows-3 border border-indigo-400/30">
                      <div className="border-r border-b border-indigo-400/25" />
                      <div className="border-r border-b border-indigo-400/25" />
                      <div className="border-b border-indigo-400/25" />
                      <div className="border-r border-b border-indigo-400/25" />
                      <div className="border-r border-b border-indigo-400/25" />
                      <div className="border-b border-indigo-400/25" />
                      <div className="border-r border-b border-indigo-400/25" />
                      <div className="border-r border-b border-indigo-400/25" />
                      <div className="" />
                    </div>
                  )}

                  {/* Non-Destructive Overlay Layer 2: Safe Aspect Ratio Framing */}
                  {aspectGuide === '4:5' && !isComparing && (
                    <div className="absolute inset-x-6 inset-y-2 border-2 border-dashed border-amber-400/70 pointer-events-none z-20 rounded-xl flex items-start justify-end p-1.5">
                      <span className="text-[10px] font-black bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded shadow-sm">4:5 Feed</span>
                    </div>
                  )}
                  {aspectGuide === '9:16' && !isComparing && (
                    <div className="absolute inset-x-12 inset-y-0 border-2 border-dashed border-purple-400/70 pointer-events-none z-20 rounded-xl flex items-start justify-end p-1.5">
                      <span className="text-[10px] font-black bg-purple-400 text-slate-950 px-1.5 py-0.5 rounded shadow-sm">9:16 Story</span>
                    </div>
                  )}

                  {/* Non-Destructive Overlay Layer 3: Live Real-Time Commerce Layout */}
                  {isLayoutOverlayActive && !isComparing && (
                    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-3.5">
                      {/* Top Overlay: Category & Brand Stamp */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="px-2.5 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold shadow-lg flex items-center gap-1.5">
                          <Tag className="w-3 h-3 text-indigo-400" />
                          <span className="truncate max-w-[150px]">{productInfo.category || "General"}</span>
                        </div>
                        {productInfo.brandName && (
                          <div className="px-2.5 py-1 rounded-full bg-indigo-600/90 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-lg backdrop-blur-md">
                            {productInfo.brandName}
                          </div>
                        )}
                      </div>

                      {/* Bottom Overlay: Live Title, Price & Commercial Stamp */}
                      <div className="space-y-1.5">
                        {/* Commercial Badge Overlay Stamp */}
                        {adjustments.overlayBadge && adjustments.overlayBadge !== 'none' && (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 text-white font-extrabold text-xs shadow-xl border border-white/30 backdrop-blur-xs">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-200" />
                            <span className="uppercase tracking-wide">{adjustments.overlayBadge.replace(/_/g, ' ')}</span>
                          </div>
                        )}

                        <div className="p-3 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-white/15 shadow-2xl">
                          <div className="text-xs font-black text-white truncate">
                            {productInfo.name?.trim() || "Live Product Title"}
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-sm font-black text-emerald-400">
                              {productInfo.price 
                                ? `${productInfo.currency || 'PKR'} ${Number(productInfo.price).toLocaleString()}`
                                : `${productInfo.currency || 'PKR'} Price`}
                            </span>
                            {productInfo.discountPercent ? (
                              <span className="text-[10px] font-black bg-rose-500 text-white px-2 py-0.5 rounded-full shadow-xs">
                                {productInfo.discountPercent}% OFF
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-slate-400">
                                Live Overlay
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Active Touch-Ups indicator on image */}
                  {hasAdjustments && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/85 backdrop-blur-md border border-amber-400/40 text-amber-300 text-[11px] font-bold flex items-center gap-1.5 shadow-md z-30 pointer-events-none">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isComparing ? 'Showing Raw Pixels' : 'Live Touch-Ups Active'}</span>
                    </div>
                  )}

                  {/* Raw pixels compare indicator */}
                  {isComparing && (
                    <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-40 pointer-events-none">
                      <span className="px-4 py-1.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow-xl uppercase tracking-wider">
                        Original Raw Image Pixels
                      </span>
                    </div>
                  )}

                  {/* Floating Quick Action Buttons */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 sm:gap-2 z-30">
                    <button
                      type="button"
                      onClick={() => setIsBgRemovalOpen(true)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-900/85 hover:bg-slate-900 text-white text-xs font-bold backdrop-blur-md border border-white/20 shadow-lg flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105"
                      title="Remove background / isolate product"
                    >
                      <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Remove BG</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsCameraModalOpen(true)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-900/85 hover:bg-slate-900 text-white text-xs font-bold backdrop-blur-md border border-white/20 shadow-lg flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105"
                      title="Snap a new photo with camera"
                    >
                      <Camera className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Camera</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsRefineModalOpen(true)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-900/85 hover:bg-slate-900 text-white text-xs font-bold backdrop-blur-md border border-white/20 shadow-lg flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105"
                    >
                      <Crop className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Crop & Filter</span>
                    </button>
                  </div>
                </div>

                {/* Real-Time Layout & Guide Overlay Controls */}
                <div className="px-3 py-2 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setIsLayoutOverlayActive(!isLayoutOverlayActive)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        isLayoutOverlayActive
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}
                      title="Toggle live commerce card overlay"
                    >
                      <Tag className="w-3.5 h-3.5" />
                      <span>Layout Card</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowGridGuide(!showGridGuide)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        showGridGuide
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}
                      title="Toggle composition grid"
                    >
                      <Grid className="w-3.5 h-3.5" />
                      <span>Grid</span>
                    </button>

                    <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-700 pl-1.5 ml-0.5">
                      <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-0.5">
                        <Ratio className="w-3 h-3" /> Frame:
                      </span>
                      {(['none', '4:5', '9:16'] as const).map((ratio) => (
                        <button
                          key={ratio}
                          type="button"
                          onClick={() => setAspectGuide(aspectGuide === ratio ? 'none' : ratio)}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                            aspectGuide === ratio
                              ? 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700'
                              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                          }`}
                        >
                          {ratio === 'none' ? 'Full' : ratio}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onMouseDown={() => setIsComparing(true)}
                      onMouseUp={() => setIsComparing(false)}
                      onTouchStart={() => setIsComparing(true)}
                      onTouchEnd={() => setIsComparing(false)}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-700/60 hover:bg-amber-500/20 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                      title="Press and hold to view original raw pixels"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Hold for Raw</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFixedOverlayEnabled(!fixedOverlayEnabled)}
                      className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        fixedOverlayEnabled
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                          : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
                      }`}
                      title={fixedOverlayEnabled ? "Permanent Fixed HUD is Active" : "Enable Permanent Fixed HUD"}
                    >
                      <Pin className={`w-3.5 h-3.5 ${fixedOverlayEnabled ? 'rotate-45' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Bottom toolbar */}
                <div className="p-3 bg-white/95 dark:bg-slate-900/95 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setIsBgRemovalOpen(true)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800/80 flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-98"
                      title="Remove background and isolate product"
                    >
                      <Wand2 className="w-3.5 h-3.5" />
                      <span>Remove BG</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsRefineModalOpen(true)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800/80 flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-98"
                    >
                      <Crop className="w-3.5 h-3.5" />
                      <span>Crop & Refine Photo</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setIsCameraModalOpen(true)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800/80 flex items-center gap-1 cursor-pointer transition-all active:scale-98"
                      title="Trigger camera to capture new photo"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Camera</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 cursor-pointer"
                      title="Choose file from your device"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Files</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setImage(null);
                        setRawSourceImage(null);
                        setAdjustments(DEFAULT_ADJUSTMENTS);
                        setAnalysis(null);
                      }}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Suite of Basic Image Editing Tools (Brightness, Contrast, Saturation, Warmth, Presets, Rotate, Flip) */}
            {image && (
              <div className="mt-4">
                <ImageEditorPanel
                  imageSrc={rawSourceImage || image}
                  adjustments={adjustments}
                  onChangeAdjustments={setAdjustments}
                  onApplyEdits={handleApplyEdits}
                  onResetToOriginal={handleResetToOriginal}
                  isApplying={isApplyingEdits}
                  isComparing={isComparing}
                  setIsComparing={setIsComparing}
                  onOpenBgRemoval={() => setIsBgRemovalOpen(true)}
                />
              </div>
            )}

            {/* Live Camera Capture Modal */}
            <CameraCaptureModal
              isOpen={isCameraModalOpen}
              onClose={() => setIsCameraModalOpen(false)}
              onCapture={handleCameraCapture}
              onSelectFromFile={() => fileInputRef.current?.click()}
            />

            {/* Background Removal Modal */}
            {image && (
              <BackgroundRemovalModal
                isOpen={isBgRemovalOpen}
                imageSrc={rawSourceImage || image}
                onClose={() => setIsBgRemovalOpen(false)}
                onApply={handleApplyBgRemoval}
              />
            )}

            {/* Refine / Crop & Filter Modal */}
            {image && (
              <ImageRefineModal
                isOpen={isRefineModalOpen}
                imageSrc={image}
                onClose={() => setIsRefineModalOpen(false)}
                onApply={(newImageSrc) => {
                  setImage(newImageSrc);
                  setRawSourceImage(newImageSrc);
                  setAdjustments(DEFAULT_ADJUSTMENTS);
                  setAnalysis(null);
                }}
              />
            )}

            <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>For best results, use a well-lit photo showing the full product clearly.</span>
            </div>
          </div>

          {/* Analyze Button */}
          {image && !analysis && (
            <button
              onClick={handleAnalyzeWithEdits}
              disabled={isAnalyzing || isApplyingEdits}
              className="w-full py-3.5 px-5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 disabled:opacity-60 transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2"
            >
              {isAnalyzing || isApplyingEdits ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>
                    {isApplyingEdits
                      ? "Applying Touch-Ups..."
                      : "Analyzing Product with Gemini Vision..."}
                  </span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{hasAdjustments ? "Apply Touch-Ups & Analyze Product" : "Analyze Product"}</span>
                </>
              )}
            </button>
          )}

          {/* AI Analysis Preview Card (once analyzed) */}
          {analysis && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                    AI Visual Analysis
                  </h4>
                </div>
                <button
                  onClick={() => setIsEditingAnalysis(!isEditingAnalysis)}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  {isEditingAnalysis ? "Save Changes" : "Edit Analysis"}
                </button>
              </div>

              {!isEditingAnalysis ? (
                <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-start justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Product Type:</span>
                    <span className="font-medium text-slate-900 dark:text-white text-right">{analysis.productType}</span>
                  </div>
                  <div className="flex items-start justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Category:</span>
                    <span className="font-medium text-slate-900 dark:text-white text-right">{analysis.productCategory}</span>
                  </div>
                  <div className="flex items-start justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Visible Colors:</span>
                    <span className="font-medium text-slate-900 dark:text-white text-right">
                      {analysis.visibleColors.join(", ")}
                    </span>
                  </div>
                  <div className="flex items-start justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Style:</span>
                    <span className="font-medium text-slate-900 dark:text-white text-right">{analysis.style}</span>
                  </div>
                  <div className="flex items-start justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Visible Material:</span>
                    <span className="font-medium text-slate-900 dark:text-white text-right">{analysis.visibleMaterials}</span>
                  </div>
                  <div className="py-1">
                    <span className="text-slate-500 block mb-1">Suggested Angle:</span>
                    <p className="font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50/60 dark:bg-indigo-950/40 p-2 rounded-lg">
                      {analysis.suggestedMarketingAngle}
                    </p>
                  </div>

                  {analysis.confidenceNotes && (
                    <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 text-[11px] text-amber-800 dark:text-amber-300">
                      <strong>Note: </strong> {analysis.confidenceNotes}
                    </div>
                  )}
                </div>
              ) : (
                /* Editable form for analysis */
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-500 font-medium">Product Type</label>
                      <VoiceDictationButton
                        fieldLabel="Product Type"
                        currentValue={analysis.productType}
                        onTranscript={(text, isFinal) => {
                          if (isFinal) {
                            setAnalysis(prev => prev ? ({
                              ...prev,
                              productType: prev.productType ? `${prev.productType} ${text}`.trim() : text
                            }) : null);
                          }
                        }}
                      />
                    </div>
                    <input
                      type="text"
                      value={analysis.productType}
                      onChange={(e) => setAnalysis({ ...analysis, productType: e.target.value })}
                      className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-500 font-medium">Style</label>
                      <VoiceDictationButton
                        fieldLabel="Style"
                        currentValue={analysis.style}
                        onTranscript={(text, isFinal) => {
                          if (isFinal) {
                            setAnalysis(prev => prev ? ({
                              ...prev,
                              style: prev.style ? `${prev.style} ${text}`.trim() : text
                            }) : null);
                          }
                        }}
                      />
                    </div>
                    <input
                      type="text"
                      value={analysis.style}
                      onChange={(e) => setAnalysis({ ...analysis, style: e.target.value })}
                      className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-500 font-medium">Material Confirmation</label>
                      <VoiceDictationButton
                        fieldLabel="Materials"
                        currentValue={analysis.visibleMaterials}
                        onTranscript={(text, isFinal) => {
                          if (isFinal) {
                            setAnalysis(prev => prev ? ({
                              ...prev,
                              visibleMaterials: prev.visibleMaterials ? `${prev.visibleMaterials} ${text}`.trim() : text
                            }) : null);
                          }
                        }}
                      />
                    </div>
                    <input
                      type="text"
                      value={analysis.visibleMaterials}
                      onChange={(e) => setAnalysis({ ...analysis, visibleMaterials: e.target.value })}
                      className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-500 font-medium">Target Audience</label>
                      <VoiceDictationButton
                        fieldLabel="Target Audience"
                        currentValue={analysis.possibleTargetAudience}
                        onTranscript={(text, isFinal) => {
                          if (isFinal) {
                            setAnalysis(prev => prev ? ({
                              ...prev,
                              possibleTargetAudience: prev.possibleTargetAudience ? `${prev.possibleTargetAudience} ${text}`.trim() : text
                            }) : null);
                          }
                        }}
                      />
                    </div>
                    <input
                      type="text"
                      value={analysis.possibleTargetAudience}
                      onChange={(e) => setAnalysis({ ...analysis, possibleTargetAudience: e.target.value })}
                      className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <button
                    onClick={() => setIsEditingAnalysis(false)}
                    className="w-full py-2 bg-indigo-600 text-white rounded-lg font-semibold"
                  >
                    Done Editing
                  </button>
                </div>
              )}

            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Optional Product Information & Main Button (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-base">
                  Product Details (Optional)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  All fields are optional. SellBoost can generate everything directly from your photo.
                </p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                Optional
              </span>
            </div>

            <div className="mt-5 space-y-4">
              
              {/* Web Speech API Quick Assistant Banner */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-50/90 via-purple-50/60 to-slate-50 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-slate-900 border border-indigo-200/80 dark:border-indigo-800/60 flex items-center justify-between gap-3 text-xs shadow-xs">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-xs">
                    <Mic className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">Voice Dictation Enabled: </span>
                    <span className="text-slate-600 dark:text-slate-400">Click any microphone icon beside a field to dictate product titles, specifications, and descriptions hands-free.</span>
                  </div>
                </div>
                <span className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  Web Speech API
                </span>
              </div>

              {/* Expanded Industry / Sector Switcher */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Industry / Business Sector
                  </label>
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                    {ALL_CATEGORIES.length}+ Verified Niches
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
                  {[
                    { id: 'product', label: 'Physical', icon: '📦', defaultCat: 'Fashion & Apparel' },
                    { id: 'service', label: 'Services', icon: '💼', defaultCat: 'Digital Marketing & Social Media Agency' },
                    { id: 'digital', label: 'Digital', icon: '💻', defaultCat: 'SaaS, Software & Web Applications' },
                    { id: 'handmade', label: 'Handmade', icon: '🎨', defaultCat: 'Handmade Resin Art, Trays & Coasters' },
                    { id: 'rentals', label: 'Rentals', icon: '🚗', defaultCat: 'Luxury Car & Wedding Vehicle Rentals' },
                    { id: 'real_estate', label: 'Real Estate', icon: '🏢', defaultCat: 'Residential Homes, Villas & Luxury Apartments' },
                    { id: 'industrial', label: 'Industrial', icon: '🏭', defaultCat: 'Industrial Machinery, CNC & Factory Equipment' },
                  ].map((ind) => {
                    const isActive = productInfo.businessType === ind.id || (!productInfo.businessType && ind.id === 'product');
                    return (
                      <button
                        key={ind.id}
                        type="button"
                        onClick={() => {
                          setProductInfo(prev => ({ 
                            ...prev, 
                            businessType: ind.id as BusinessType,
                            category: ind.defaultCat
                          }));
                          setCategoryTypeFilter(ind.id as BusinessType);
                        }}
                        className={`py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          isActive
                            ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold ring-1 ring-indigo-500/20'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                        }`}
                      >
                        <span className="text-sm">{ind.icon}</span>
                        <span className="truncate">{ind.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Product / Service / Listing Name */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {currentCategory?.type === 'service' 
                      ? "Service / Retainer Package Name" 
                      : currentCategory?.type === 'digital'
                      ? "Digital Product / Software Name"
                      : currentCategory?.type === 'handmade'
                      ? "Handmade Piece / Artwork Name"
                      : currentCategory?.type === 'rentals'
                      ? "Rental Item / Fleet Asset Name"
                      : currentCategory?.type === 'real_estate'
                      ? "Property / Listing Title"
                      : currentCategory?.type === 'industrial'
                      ? "Machinery / Equipment Model Name"
                      : "Product Name"}
                  </label>
                  <VoiceDictationButton
                    fieldLabel="Product Name"
                    currentValue={productInfo.name || ''}
                    onTranscript={(text, isFinal) => {
                      if (isFinal) {
                        setProductInfo(prev => ({
                          ...prev,
                          name: prev.name ? `${prev.name} ${text}`.trim() : text
                        }));
                      }
                    }}
                  />
                </div>
                <input
                  type="text"
                  placeholder={currentCategory?.placeholderName || "e.g. Premium Item Name"}
                  value={productInfo.name || ""}
                  onChange={(e) => setProductInfo({ ...productInfo, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Category & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Niche Category
                    </label>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                      Select Niche
                    </span>
                  </div>
                  
                  <select
                    value={productInfo.category || "Fashion & Apparel"}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'CUSTOM_CATEGORY') {
                        setIsCustomCategoryActive(true);
                        setProductInfo({ ...productInfo, category: 'Other Products & Services (Custom)' });
                      } else {
                        setIsCustomCategoryActive(false);
                        const found = ALL_CATEGORIES.find(c => c.name === val);
                        setProductInfo({ 
                          ...productInfo, 
                          category: val,
                          businessType: found ? found.type : productInfo.businessType
                        });
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  >
                    <optgroup label="📦 Physical Products & E-Commerce">
                      {PRODUCT_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="💻 Digital Products, SaaS & Online Courses">
                      {DIGITAL_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="🎨 Handmade, Crafts & Artisanal Goods">
                      {HANDMADE_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="🚗 Rentals, Fleet & Event Equipment">
                      {RENTAL_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="🏢 Real Estate, Property & Construction">
                      {REAL_ESTATE_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="🏭 Industrial, Machinery & B2B Supplies">
                      {INDUSTRIAL_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="💼 Professional & Local Services">
                      {SERVICE_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </optgroup>
                    <option value="CUSTOM_CATEGORY">✨ Custom Category / Other Specialized Niche...</option>
                  </select>

                  {/* Custom Category Input if selected */}
                  {(isCustomCategoryActive || productInfo.category === 'Other Products & Services (Custom)') && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] text-slate-500 font-semibold">Custom Niche Description</span>
                        <VoiceDictationButton
                          fieldLabel="Custom Category"
                          currentValue={productInfo.customCategory || ''}
                          onTranscript={(text, isFinal) => {
                            if (isFinal) {
                              setProductInfo(prev => ({
                                ...prev,
                                customCategory: prev.customCategory ? `${prev.customCategory} ${text}`.trim() : text
                              }));
                            }
                          }}
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Type or dictate your exact custom product/service niche..."
                        value={productInfo.customCategory || ""}
                        onChange={(e) => setProductInfo({ ...productInfo, customCategory: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-indigo-300 dark:border-indigo-700 bg-indigo-50/50 dark:bg-indigo-950/30 text-slate-900 dark:text-white text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {currentCategory?.priceLabel || (isService ? "Service Rate / Package Fee" : "Selling Price & Currency")}
                    </label>
                    <VoiceDictationButton
                      fieldLabel="Price"
                      currentValue={productInfo.price ? String(productInfo.price) : ''}
                      onTranscript={(text, isFinal) => {
                        if (isFinal) {
                          const digits = text.replace(/[^0-9.]/g, '');
                          if (digits) {
                            setProductInfo(prev => ({ ...prev, price: Number(digits) }));
                          }
                        }
                      }}
                    />
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={productInfo.currency}
                      onChange={(e) => setProductInfo({ ...productInfo, currency: e.target.value as CurrencyCode })}
                      className="w-24 px-2.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    >
                      {CURRENCIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>

                    <input
                      type="number"
                      placeholder={isService ? "e.g. 25000" : "e.g. 18500"}
                      value={productInfo.price || ""}
                      onChange={(e) => setProductInfo({ ...productInfo, price: e.target.value ? Number(e.target.value) : undefined })}
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Key Features / Service Deliverables */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {isService ? "Key Service Deliverables / Scope / Guarantees (Optional)" : "Key Features & Description Details (Optional)"}
                  </label>
                  <VoiceDictationButton
                    fieldLabel="Product Description & Features"
                    currentValue={productInfo.keyFeatures || ''}
                    onTranscript={(text, isFinal) => {
                      if (isFinal) {
                        setProductInfo(prev => ({
                          ...prev,
                          keyFeatures: prev.keyFeatures ? `${prev.keyFeatures} ${text}`.trim() : text
                        }));
                      }
                    }}
                  />
                </div>
                <textarea
                  rows={3}
                  placeholder={isService 
                    ? "e.g. Free diagnostic inspection, 30-day work warranty, certified technicians, same-day response (or click mic to dictate)" 
                    : "e.g. Structured silhouette, gold hardware, adjustable strap, waterproof interior (or click mic to dictate specifications)"}
                  value={productInfo.keyFeatures || ""}
                  onChange={(e) => setProductInfo({ ...productInfo, keyFeatures: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Target Market & Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Target Market
                  </label>
                  <select
                    value={productInfo.targetMarket}
                    onChange={(e) => setProductInfo({ ...productInfo, targetMarket: e.target.value as TargetMarket })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  >
                    {TARGET_MARKETS.map((tm) => (
                      <option key={tm} value={tm}>{tm}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Brand Name
                    </label>
                    <VoiceDictationButton
                      fieldLabel="Brand Name"
                      currentValue={productInfo.brandName || ''}
                      onTranscript={(text, isFinal) => {
                        if (isFinal) {
                          setProductInfo(prev => ({
                            ...prev,
                            brandName: prev.brandName ? `${prev.brandName} ${text}`.trim() : text
                          }));
                        }
                      }}
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. Aura Leather"
                    value={productInfo.brandName || ""}
                    onChange={(e) => setProductInfo({ ...productInfo, brandName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* WhatsApp Contact & Discount */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      WhatsApp Order Number
                    </label>
                    <VoiceDictationButton
                      fieldLabel="WhatsApp Number"
                      currentValue={productInfo.contactPhone || ''}
                      onTranscript={(text, isFinal) => {
                        if (isFinal) {
                          setProductInfo(prev => ({
                            ...prev,
                            contactPhone: prev.contactPhone ? `${prev.contactPhone} ${text}`.trim() : text
                          }));
                        }
                      }}
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. +92 300 1234567"
                    value={productInfo.contactPhone || ""}
                    onChange={(e) => setProductInfo({ ...productInfo, contactPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Offer / Discount % (Optional)
                    </label>
                    <VoiceDictationButton
                      fieldLabel="Discount Percentage"
                      currentValue={productInfo.discountPercent ? String(productInfo.discountPercent) : ''}
                      onTranscript={(text, isFinal) => {
                        if (isFinal) {
                          const digits = text.replace(/[^0-9.]/g, '');
                          if (digits) {
                            setProductInfo(prev => ({ ...prev, discountPercent: Number(digits) }));
                          }
                        }
                      }}
                    />
                  </div>
                  <input
                    type="number"
                    placeholder="e.g. 15 for 15% OFF"
                    value={productInfo.discountPercent || ""}
                    onChange={(e) => setProductInfo({ ...productInfo, discountPercent: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Preferred Languages (Multi-select) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Preferred Output Languages (Select Multiple)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {LANGUAGES.map((lang) => {
                    const isSelected = (productInfo.preferredLanguages || []).includes(lang.code);
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => toggleLanguage(lang.code)}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200'
                            : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-xs">{lang.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                        </div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
                          {lang.sub}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Campaign Planning Strategy: 1-Week or 2-Weeks Single Theme */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                    <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Campaign Duration & Single-Theme Strategy</span>
                  </div>
                  <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                    Cohesive Theme Focus
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <button
                    type="button"
                    onClick={() => setProductInfo({ ...productInfo, campaignThemeDuration: '7_days' })}
                    className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                      (productInfo.campaignThemeDuration || '7_days') === '7_days'
                        ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/60 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-xl">⚡</span>
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white">
                        1-Week Launch Sprint (7 Days)
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                        High-velocity funnel from teaser to urgency & COD closing.
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProductInfo({ ...productInfo, campaignThemeDuration: '14_days' })}
                    className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                      productInfo.campaignThemeDuration === '14_days'
                        ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/60 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-xl">🚀</span>
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white">
                        2-Weeks Deep Campaign (14 Days)
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Deep brand storytelling, ASMR, bundles, and sustained order volume.
                      </div>
                    </div>
                  </button>
                </div>

                {/* Campaign Theme Preset */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Unifying Campaign Theme Concept
                  </label>
                  <select
                    value={productInfo.preferredTheme || (isService ? "Authority, Trust & Rapid Client Bookings" : "VIP Product Launch & Early Bird Hype")}
                    onChange={(e) => setProductInfo({ ...productInfo, preferredTheme: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="VIP Product Launch & Early Bird Hype">🔥 VIP Product Launch & Early Bird Hype</option>
                    <option value="Problem Agitation & Solution Transformation">🛑 Problem Agitation & Solution Transformation</option>
                    <option value="Authority, Trust & Rapid Client Bookings">💼 Authority, Trust & Rapid Client Bookings</option>
                    <option value="Customer Case Study & Social Proof Showcase">⭐ Customer Case Study & Social Proof Showcase</option>
                    <option value="Flash Sale & Limited Stock Urgency">⏳ Flash Sale & Limited Stock Urgency</option>
                    <option value="Behind the Scenes & Craftsmanship Story">☕ Behind the Scenes & Craftsmanship Story</option>
                    <option value="Holiday & Festive Season Rush">🎉 Holiday & Festive Season Rush</option>
                  </select>
                </div>
              </div>

              {/* Keyword & Trends Trust Indicator */}
              <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
                    <span>Google Trends & Search Volume Engine Included</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <p className="text-indigo-800/80 dark:text-indigo-300/80 text-[11px] mt-0.5 leading-relaxed">
                    Keywords and hashtags will be cross-checked against Google Trends (2024-2026 index), Google search autocomplete, and Meta/TikTok explore data with exact monthly search volumes and source citations.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Section 7: THE LARGE PRIMARY BUTTON */}
          <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Primary Campaign Generator</span>
              </div>

              <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
                {isService ? "Ready to Launch This Service Campaign?" : "Ready to Launch This Campaign?"}
              </h3>
              <p className="text-indigo-200 text-sm mt-1 max-w-xl">
                One click generates everything: High-search volume keywords & hashtag intelligence (backed by Google Trends), 1-to-2 week themed marketing schedule, 5 ad variations, Instagram/TikTok copy, WhatsApp broadcasts, promotional posters, and marketplace listings (including Book Kaaro Digital Marketplace, Shopify & Daraz).
              </p>

              <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
                <button
                  onClick={onCreateSellingPackage}
                  disabled={!image || isGeneratingPackage}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl font-extrabold text-base sm:text-lg text-slate-900 bg-white hover:bg-slate-100 active:scale-98 disabled:opacity-50 transition-all shadow-lg shadow-white/10 flex items-center justify-center gap-2.5"
                >
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  <span>{isService ? "GENERATE SERVICE CAMPAIGN PACKAGE" : "CREATE MY SELLING PACKAGE"}</span>
                </button>

                <div className="text-xs text-indigo-300 flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span>Uses 1 campaign credit</span>
                </div>
              </div>

              {!image && (
                <p className="text-xs text-amber-300/90 mt-3 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Please upload a product photo on the left to start.</span>
                </p>
              )}
            </div>

            {/* Background glow */}
            <div className="absolute right-0 bottom-0 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
          </div>

        </div>

      </div>

      {/* Permanent Fixed Overlay Dock (Picture-in-Picture / Fixed Live Companion) */}
      {image && fixedOverlayEnabled && (
        <FixedProductOverlay
          image={image}
          rawSourceImage={rawSourceImage}
          adjustments={adjustments}
          productInfo={productInfo}
          previewFilterStyle={previewFilterStyle}
          previewTransformStyle={previewTransformStyle}
          hasAdjustments={hasAdjustments}
          onResetAdjustments={handleResetToOriginal}
        />
      )}

    </div>
  );
};
