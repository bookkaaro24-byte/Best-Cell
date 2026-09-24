import React, { useState, useRef } from 'react';
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
  ShieldCheck
} from 'lucide-react';
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
  onOpenCreditsModal
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isEditingAnalysis, setIsEditingAnalysis] = useState(false);
  const [categoryTypeFilter, setCategoryTypeFilter] = useState<'all' | 'product' | 'service'>('all');
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [isCustomCategoryActive, setIsCustomCategoryActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Determine current active category definition
  const currentCategory = ALL_CATEGORIES.find(c => c.name === productInfo.category);
  const isService = productInfo.businessType === 'service' || (currentCategory && currentCategory.type === 'service');

  const filteredCategories = ALL_CATEGORIES.filter((c) => {
    if (categoryTypeFilter === 'product' && c.type !== 'product') return false;
    if (categoryTypeFilter === 'service' && c.type !== 'service') return false;
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

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Image Upload Area (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
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
              /* Empty upload box */
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center p-8 sm:p-12 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                  dragOver
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20'
                    : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100/70 dark:hover:bg-slate-800/70'
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 shadow-inner">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 text-center">
                  Drag & drop your product photo here
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-center">
                  Supports JPG, PNG, WebP up to 12MB
                </p>

                <div className="mt-5 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 shadow-xs"
                  >
                    Browse Files
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      cameraInputRef.current?.click();
                    }}
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 flex items-center gap-1.5"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Camera</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Image preview with replace/remove controls */
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-950">
                <div className="aspect-square w-full flex items-center justify-center overflow-hidden">
                  <img
                    src={image}
                    alt="Uploaded product preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain p-2"
                  />
                </div>

                {/* Bottom toolbar */}
                <div className="p-3 bg-white/95 dark:bg-slate-900/95 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Replace Image</span>
                  </button>

                  <button
                    onClick={() => {
                      setImage(null);
                      setAnalysis(null);
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            )}

            <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>For best results, use a well-lit photo showing the full product clearly.</span>
            </div>
          </div>

          {/* Analyze Button */}
          {image && !analysis && (
            <button
              onClick={onAnalyze}
              disabled={isAnalyzing}
              className="w-full py-3.5 px-5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 disabled:opacity-60 transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing Product with Gemini Vision...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Product</span>
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
                    <label className="text-slate-500 block mb-1">Product Type</label>
                    <input
                      type="text"
                      value={analysis.productType}
                      onChange={(e) => setAnalysis({ ...analysis, productType: e.target.value })}
                      className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 block mb-1">Style</label>
                    <input
                      type="text"
                      value={analysis.style}
                      onChange={(e) => setAnalysis({ ...analysis, style: e.target.value })}
                      className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 block mb-1">Material Confirmation</label>
                    <input
                      type="text"
                      value={analysis.visibleMaterials}
                      onChange={(e) => setAnalysis({ ...analysis, visibleMaterials: e.target.value })}
                      className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 block mb-1">Target Audience</label>
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
              
              {/* Business Type Switcher */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Campaign Target Type
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setProductInfo(prev => ({ 
                        ...prev, 
                        businessType: 'product',
                        category: prev.category && SERVICE_CATEGORIES.some(s => s.name === prev.category) ? 'Fashion & Apparel' : (prev.category || 'Fashion & Apparel')
                      }));
                      setCategoryTypeFilter('product');
                    }}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      !isService
                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>📦 Physical Product</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProductInfo(prev => ({ 
                        ...prev, 
                        businessType: 'service',
                        category: prev.category && PRODUCT_CATEGORIES.some(p => p.name === prev.category) ? 'Digital Marketing & Social Media Agency' : (prev.category || 'Digital Marketing & Social Media Agency')
                      }));
                      setCategoryTypeFilter('service');
                    }}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      isService
                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>💼 Professional Service</span>
                  </button>
                </div>
              </div>

              {/* Product / Service Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {isService ? "Service / Package Name" : "Product Name"}
                </label>
                <input
                  type="text"
                  placeholder={currentCategory?.placeholderName || (isService ? "e.g. Turnkey AC Deep Cleaning & Inverter Repair" : "e.g. Premium Women's Leather Handbag")}
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
                      {isService ? "Service Category" : "Product Category"}
                    </label>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                      {ALL_CATEGORIES.length}+ Categories
                    </span>
                  </div>
                  
                  <select
                    value={productInfo.category || (isService ? "Digital Marketing & Social Media Agency" : "Fashion & Apparel")}
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
                    <optgroup label="📦 Physical Products">
                      {PRODUCT_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="💼 Professional & B2B Services">
                      {SERVICE_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </optgroup>
                    <option value="CUSTOM_CATEGORY">✨ Custom Category / Other...</option>
                  </select>

                  {/* Custom Category Input if selected */}
                  {(isCustomCategoryActive || productInfo.category === 'Other Products & Services (Custom)') && (
                    <div className="mt-2">
                      <input
                        type="text"
                        placeholder="Type your exact custom product/service niche..."
                        value={productInfo.customCategory || ""}
                        onChange={(e) => setProductInfo({ ...productInfo, customCategory: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-indigo-300 dark:border-indigo-700 bg-indigo-50/50 dark:bg-indigo-950/30 text-slate-900 dark:text-white text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    {currentCategory?.priceLabel || (isService ? "Service Rate / Package Fee" : "Selling Price & Currency")}
                  </label>
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
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {isService ? "Key Service Deliverables / Scope / Guarantees (Optional)" : "Key Features / Specifications (Optional)"}
                </label>
                <textarea
                  rows={2}
                  placeholder={isService 
                    ? "e.g. Free diagnostic inspection, 30-day work warranty, certified technicians, same-day response" 
                    : "e.g. Structured silhouette, gold hardware, adjustable strap, waterproof interior"}
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
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Brand Name
                  </label>
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
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    WhatsApp Order Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. +92 300 1234567"
                    value={productInfo.contactPhone || ""}
                    onChange={(e) => setProductInfo({ ...productInfo, contactPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Offer / Discount % (Optional)
                  </label>
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

    </div>
  );
};
