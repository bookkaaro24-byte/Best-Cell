import React, { useState } from 'react';
import { 
  Eye, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  Grid, 
  Tag, 
  Minimize2, 
  Maximize2, 
  Pin, 
  Lock, 
  Sliders, 
  X,
  CheckCircle2,
  Ratio,
  ShoppingBag
} from 'lucide-react';
import { ImageAdjustments, COMMERCIAL_BADGES } from './ImageEditorPanel';
import { ProductInput } from '../types';

export type OverlayMode = 'commerce' | 'grid' | 'clean';
export type AspectGuide = 'none' | '1:1' | '4:5' | '9:16';

interface FixedProductOverlayProps {
  image: string;
  rawSourceImage: string | null;
  adjustments: ImageAdjustments;
  productInfo: ProductInput;
  previewFilterStyle: string;
  previewTransformStyle: string;
  hasAdjustments: boolean;
  onScrollToEditor?: () => void;
  onScrollToDetails?: () => void;
  onResetAdjustments?: () => void;
}

export const FixedProductOverlay: React.FC<FixedProductOverlayProps> = ({
  image,
  rawSourceImage,
  adjustments,
  productInfo,
  previewFilterStyle,
  previewTransformStyle,
  hasAdjustments,
  onScrollToEditor,
  onScrollToDetails,
  onResetAdjustments
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [overlayMode, setOverlayMode] = useState<OverlayMode>('commerce');
  const [aspectGuide, setAspectGuide] = useState<AspectGuide>('none');
  const [isComparingOriginal, setIsComparingOriginal] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  if (!image || !isVisible) {
    return (
      <div className="fixed bottom-5 right-5 z-40">
        <button
          type="button"
          onClick={() => setIsVisible(true)}
          className="px-3 py-2 rounded-full bg-slate-900/90 text-white hover:bg-slate-900 border border-indigo-500/40 shadow-xl backdrop-blur-md text-xs font-bold flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
          title="Restore Permanent Fixed Overlay"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          <span>Live Overlay HUD</span>
        </button>
      </div>
    );
  }

  const selectedBadgeObj = adjustments.overlayBadge 
    ? COMMERCIAL_BADGES.find(b => b.id === adjustments.overlayBadge)
    : null;

  const displayTitle = productInfo.name?.trim() || "Product Title";
  const displayPrice = productInfo.price 
    ? `${productInfo.currency || 'PKR'} ${Number(productInfo.price).toLocaleString()}` 
    : `${productInfo.currency || 'PKR'} Price`;
  const displayCategory = productInfo.category || "General Product";

  // Minimized Floating Pill View
  if (isMinimized) {
    return (
      <aside 
        aria-label="Minimized product overlay HUD"
        className="fixed bottom-5 right-5 z-40 bg-slate-950/95 text-white border border-slate-700/80 rounded-2xl shadow-2xl p-2.5 flex items-center gap-3 backdrop-blur-xl animate-in slide-in-from-bottom-2 duration-200"
      >
        <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 shrink-0">
          <img
            src={isComparingOriginal ? (rawSourceImage || image) : (rawSourceImage || image)}
            alt="Product thumbnail"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain p-0.5"
            style={{
              filter: isComparingOriginal ? 'none' : previewFilterStyle,
              transform: isComparingOriginal ? 'none' : previewTransformStyle
            }}
          />
          <div className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
        </div>

        <div className="text-left max-w-[150px] sm:max-w-[200px]">
          <div className="text-xs font-bold text-white truncate">{displayTitle}</div>
          <div className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
            <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="truncate">Original Pixels Protected</span>
          </div>
        </div>

        <div className="flex items-center gap-1 border-l border-slate-800 pl-2">
          <button
            type="button"
            onClick={() => setIsMinimized(false)}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Expand Fixed Overlay"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setIsVisible(false)}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
            title="Hide HUD"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </aside>
    );
  }

  // Standard or Expanded Fixed Floating Overlay
  return (
    <aside 
      aria-label="Permanent fixed product overlay HUD"
      className={`fixed z-40 transition-all duration-200 ${
        isExpanded
          ? 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[420px] max-w-[95vw]'
          : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[280px] sm:w-[320px]'
      }`}
    >
      <div className="bg-slate-950/95 text-white border border-indigo-500/40 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl ring-1 ring-white/10 flex flex-col">
        {/* Header Bar */}
        <div className="px-3.5 py-2.5 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border-b border-slate-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <div className="text-xs font-black tracking-wide text-white flex items-center gap-1.5">
              <Pin className="w-3.5 h-3.5 text-indigo-400 rotate-45" />
              <span>Fixed Live Overlay</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
              title={isExpanded ? "Standard Size" : "Expand Size"}
            >
              {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
            <button
              type="button"
              onClick={() => setIsMinimized(true)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
              title="Minimize to Pill"
            >
              <div className="w-3.5 h-0.5 bg-current rounded-full" />
            </button>
            <button
              type="button"
              onClick={() => setIsVisible(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 transition-colors cursor-pointer"
              title="Close HUD"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Live Overlay Viewport */}
        <div className="relative p-2.5 bg-slate-900/60 flex flex-col items-center">
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center select-none shadow-inner group">
            
            {/* The Permanent Fixed Product Image */}
            <img
              src={isComparingOriginal ? (rawSourceImage || image) : (rawSourceImage || image)}
              alt="Permanent Product Overlay Preview"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain p-2 transition-all duration-150 relative z-10"
              style={{
                filter: isComparingOriginal ? 'none' : previewFilterStyle,
                transform: isComparingOriginal ? 'none' : previewTransformStyle
              }}
            />

            {/* Non-Destructive Overlay Layer 1: Rule of Thirds / Safe Framing Grid */}
            {overlayMode === 'grid' && !isComparingOriginal && (
              <div className="absolute inset-0 pointer-events-none z-20 grid grid-cols-3 grid-rows-3 border border-indigo-400/30">
                <div className="border-r border-b border-indigo-400/25" />
                <div className="border-r border-b border-indigo-400/25" />
                <div className="border-b border-indigo-400/25" />
                <div className="border-r border-b border-indigo-400/25" />
                <div className="border-r border-b border-indigo-400/25" />
                <div className="border-b border-indigo-400/25" />
                <div className="border-r border-indigo-400/25" />
                <div className="border-r border-indigo-400/25" />
                <div className="" />
              </div>
            )}

            {/* Non-Destructive Overlay Layer 2: Aspect Ratio Frame Safe Guide */}
            {aspectGuide === '4:5' && !isComparingOriginal && (
              <div className="absolute inset-x-4 inset-y-1 border-2 border-dashed border-amber-400/60 pointer-events-none z-20 rounded-lg flex items-start justify-end p-1">
                <span className="text-[9px] font-bold bg-amber-400/90 text-slate-950 px-1 rounded">4:5 Feed</span>
              </div>
            )}
            {aspectGuide === '9:16' && !isComparingOriginal && (
              <div className="absolute inset-x-8 inset-y-0 border-2 border-dashed border-purple-400/60 pointer-events-none z-20 rounded-lg flex items-start justify-end p-1">
                <span className="text-[9px] font-bold bg-purple-400/90 text-slate-950 px-1 rounded">9:16 Reel</span>
              </div>
            )}

            {/* Non-Destructive Overlay Layer 3: Live Real-Time Commerce Layout Overlay */}
            {overlayMode === 'commerce' && !isComparingOriginal && (
              <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-2.5">
                {/* Top Overlay: Category & Brand Stamp */}
                <div className="flex items-center justify-between gap-1.5">
                  <div className="px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 text-[10px] font-bold text-slate-200 truncate max-w-[130px] shadow-md">
                    {displayCategory}
                  </div>
                  {productInfo.brandName && (
                    <div className="px-2 py-0.5 rounded-full bg-indigo-600/90 backdrop-blur-md text-white text-[9px] font-extrabold uppercase tracking-wider shadow-md">
                      {productInfo.brandName}
                    </div>
                  )}
                </div>

                {/* Bottom Overlay: Live Real-Time Layout Card (Title, Price, Discount) */}
                <div className="space-y-1">
                  {/* Commercial Badge Stamp if active */}
                  {selectedBadgeObj && selectedBadgeObj.id !== 'none' && (
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-extrabold shadow-md border border-emerald-400/30">
                      <ShieldCheck className="w-3 h-3 text-emerald-200" />
                      <span className="uppercase">{selectedBadgeObj.label}</span>
                    </div>
                  )}

                  {/* Product Title & Price Card */}
                  <div className="p-2 rounded-xl bg-slate-950/85 backdrop-blur-md border border-white/15 shadow-xl">
                    <div className="text-[11px] font-extrabold text-white truncate leading-tight">
                      {displayTitle}
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs font-black text-emerald-400">
                        {displayPrice}
                      </span>
                      {productInfo.discountPercent ? (
                        <span className="text-[9px] font-black bg-rose-500 text-white px-1.5 py-0.5 rounded shadow-xs">
                          {productInfo.discountPercent}% OFF
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Compare overlay tag */}
            {isComparingOriginal && (
              <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-30 pointer-events-none">
                <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow-lg uppercase tracking-wider">
                  Original Raw Pixels
                </span>
              </div>
            )}
          </div>

          {/* Mode Switcher & Overlays Toolbar */}
          <div className="w-full mt-2 grid grid-cols-3 gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-[10px] font-bold">
            <button
              type="button"
              onClick={() => setOverlayMode('commerce')}
              className={`py-1 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                overlayMode === 'commerce'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Show live layout details (title, price, badge) over the image"
            >
              <Tag className="w-3 h-3" />
              <span>Layout</span>
            </button>
            <button
              type="button"
              onClick={() => setOverlayMode('grid')}
              className={`py-1 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                overlayMode === 'grid'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Show composition & alignment grid guides"
            >
              <Grid className="w-3 h-3" />
              <span>Guides</span>
            </button>
            <button
              type="button"
              onClick={() => setOverlayMode('clean')}
              className={`py-1 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                overlayMode === 'clean'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Show pure photo with adjustments only"
            >
              <Layers className="w-3 h-3" />
              <span>Clean</span>
            </button>
          </div>

          {/* Aspect Guides Toggle */}
          <div className="w-full mt-1.5 flex items-center justify-between px-1 text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <Ratio className="w-3 h-3 text-slate-500" />
              <span>Frame:</span>
            </span>
            <div className="flex items-center gap-1">
              {(['none', '1:1', '4:5', '9:16'] as AspectGuide[]).map((guide) => (
                <button
                  key={guide}
                  type="button"
                  onClick={() => setAspectGuide(guide)}
                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase transition-colors cursor-pointer ${
                    aspectGuide === guide
                      ? 'bg-slate-800 text-indigo-300 border border-indigo-500/40'
                      : 'hover:text-slate-200'
                  }`}
                >
                  {guide}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer: Hold to Compare & Status */}
        <div className="p-2.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-2">
          {/* Hold to Compare Button */}
          <button
            type="button"
            onMouseDown={() => setIsComparingOriginal(true)}
            onMouseUp={() => setIsComparingOriginal(false)}
            onTouchStart={() => setIsComparingOriginal(true)}
            onTouchEnd={() => setIsComparingOriginal(false)}
            className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Press and hold to view original raw photo"
          >
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>Hold for Raw</span>
          </button>

          {/* Non-Destructive Pixel Protection Status */}
          <div className="text-right flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
            <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
            <span title="Original pixels are 100% preserved in memory without degradation">
              Pixels Locked
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
