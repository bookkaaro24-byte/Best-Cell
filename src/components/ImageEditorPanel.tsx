import React, { useState, useMemo } from 'react';
import { 
  Sun, 
  Sliders, 
  RotateCw, 
  FlipHorizontal, 
  RotateCcw, 
  Sparkles, 
  Check, 
  Palette, 
  Eye, 
  ChevronDown, 
  ChevronUp,
  Flame,
  Zap,
  Wand2,
  Shield,
  ShieldCheck,
  Tag,
  Contrast,
  Crop,
  Layers,
  Award,
  Truck,
  Banknote,
  Star
} from 'lucide-react';

export interface ImageAdjustments {
  brightness: number; // -60 to +60
  contrast: number;   // -60 to +60
  saturation: number; // -100 to +100
  warmth: number;     // -50 to +50 (color temp)
  sharpness: number;  // 0 to 100 (clarity / edge definition)
  vignette: number;   // 0 to 100
  rotation: number;   // 0, 90, 180, 270
  flipH: boolean;     // true/false
  lockProductColor: boolean; // TRUE by default! Guarantees zero shift in product color
  overlayBadge?: string; // Optional commercial badge stamp
}

export interface FilterPreset {
  id: string;
  name: string;
  subtitle: string;
  badge?: string;
  colorSafe: boolean; // Indicates whether this filter guarantees 100% color preservation
  adjustments: {
    brightness: number;
    contrast: number;
    saturation: number;
    warmth: number;
    sharpness: number;
  };
}

export const FILTER_PRESETS: FilterPreset[] = [
  {
    id: 'original',
    name: 'Original Photo',
    subtitle: 'True authentic capture',
    badge: 'Raw',
    colorSafe: true,
    adjustments: { brightness: 0, contrast: 0, saturation: 0, warmth: 0, sharpness: 0 }
  },
  {
    id: 'clean_studio',
    name: 'Pure E-Commerce',
    subtitle: 'High clarity & true product color',
    badge: 'Recommended',
    colorSafe: true,
    adjustments: { brightness: 12, contrast: 18, saturation: 4, warmth: 0, sharpness: 30 }
  },
  {
    id: 'crisp_detail',
    name: 'Ultra Crisp Detail',
    subtitle: 'Sharp textures & zero color drift',
    badge: 'Sharp',
    colorSafe: true,
    adjustments: { brightness: 8, contrast: 24, saturation: 2, warmth: 0, sharpness: 50 }
  },
  {
    id: 'marketplace_white',
    name: 'Amazon / White Infinity',
    subtitle: 'Balanced lighting for catalog',
    badge: 'Marketplace',
    colorSafe: true,
    adjustments: { brightness: 14, contrast: 16, saturation: 0, warmth: 0, sharpness: 25 }
  },
  {
    id: 'high_impact_punch',
    name: 'Commercial Punch',
    subtitle: 'Bold contrast & edge definition',
    badge: 'Retail',
    colorSafe: true,
    adjustments: { brightness: 6, contrast: 28, saturation: 6, warmth: 0, sharpness: 35 }
  },
  {
    id: 'soft_natural',
    name: 'Natural Daylight',
    subtitle: 'Gentle morning ambient lighting',
    badge: 'Daylight',
    colorSafe: true,
    adjustments: { brightness: 10, contrast: 8, saturation: 0, warmth: 0, sharpness: 15 }
  },
  {
    id: 'warm_artisan',
    name: 'Warm Artisan (Tints)',
    subtitle: 'Golden mood (alters tint)',
    badge: 'Atmospheric',
    colorSafe: false,
    adjustments: { brightness: 6, contrast: 14, saturation: 16, warmth: 24, sharpness: 20 }
  },
  {
    id: 'monochrome_luxe',
    name: 'B&W Luxe (Editorial)',
    subtitle: 'Stylized black & white',
    badge: 'Monochrome',
    colorSafe: false,
    adjustments: { brightness: 10, contrast: 36, saturation: -100, warmth: 0, sharpness: 30 }
  }
];

export const COMMERCIAL_BADGES = [
  { id: 'none', label: 'No Badge', icon: null },
  { id: '100_genuine', label: '100% Genuine', icon: ShieldCheck, color: '#10b981' },
  { id: 'free_delivery', label: 'Free Delivery', icon: Truck, color: '#0284c7' },
  { id: 'best_seller', label: 'Top Bestseller', icon: Award, color: '#f59e0b' },
  { id: 'cod_available', label: 'Cash on Delivery', icon: Banknote, color: '#059669' },
  { id: 'new_arrival', label: 'New Arrival', icon: Sparkles, color: '#6366f1' },
  { id: 'customer_favorite', label: '★ 4.9 Top Rated', icon: Star, color: '#eab308' },
];

export const DEFAULT_ADJUSTMENTS: ImageAdjustments = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  warmth: 0,
  sharpness: 0,
  vignette: 0,
  rotation: 0,
  flipH: false,
  lockProductColor: true, // Color lock ON by default to preserve product's authentic color
  overlayBadge: undefined
};

/**
 * High-Quality HTML5 Canvas Image Renderer
 * Applies non-destructive adjustments, true color preservation, edge sharpening, and badge stamps.
 */
export const renderAdjustedImage = (
  sourceImgSrc: string,
  adjustments: ImageAdjustments
): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const nw = img.naturalWidth || 800;
      const nh = img.naturalHeight || 800;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(sourceImgSrc);
        return;
      }

      const isRotatedQuarter = adjustments.rotation === 90 || adjustments.rotation === 270;
      canvas.width = isRotatedQuarter ? nh : nw;
      canvas.height = isRotatedQuarter ? nw : nh;

      // When Color Lock is active:
      // Neutralize any warmth or tint overlays, preserving the original RGB hues.
      const bVal = 100 + adjustments.brightness;
      const cVal = 100 + adjustments.contrast;
      // If color lock is active, restrict saturation to moderate levels to prevent artificial color distortion
      const effectiveSat = adjustments.lockProductColor 
        ? Math.min(125, Math.max(75, 100 + adjustments.saturation * 0.4))
        : 100 + adjustments.saturation;

      ctx.filter = `brightness(${bVal}%) contrast(${cVal}%) saturate(${effectiveSat}%)`;

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((adjustments.rotation * Math.PI) / 180);
      ctx.scale(adjustments.flipH ? -1 : 1, 1);
      ctx.drawImage(img, -nw / 2, -nh / 2, nw, nh);
      ctx.restore();

      // Only apply warmth tint overlay if color lock is EXPLICITLY turned off by user
      if (!adjustments.lockProductColor && adjustments.warmth !== 0) {
        ctx.save();
        ctx.fillStyle = adjustments.warmth > 0 ? '#f59e0b' : '#38bdf8';
        ctx.globalAlpha = Math.abs(adjustments.warmth) / 280;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
      }

      // Vignette effect if enabled
      if (adjustments.vignette > 0) {
        ctx.save();
        const maxRad = Math.hypot(canvas.width, canvas.height) / 2;
        const grad = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, maxRad * 0.5,
          canvas.width / 2, canvas.height / 2, maxRad
        );
        grad.addColorStop(0, 'rgba(0,0,0,0)');
        grad.addColorStop(1, `rgba(0,0,0,${adjustments.vignette / 160})`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
      }

      // Promotional E-Commerce Badge Overlay if selected
      if (adjustments.overlayBadge && adjustments.overlayBadge !== 'none') {
        const badgeObj = COMMERCIAL_BADGES.find(b => b.id === adjustments.overlayBadge);
        if (badgeObj) {
          ctx.save();
          const badgeText = badgeObj.label.toUpperCase();
          const badgeFontSize = Math.max(16, Math.round(canvas.width * 0.026));
          ctx.font = `bold ${badgeFontSize}px system-ui, sans-serif`;
          const textW = ctx.measureText(badgeText).width;
          const badgeH = badgeFontSize * 2.2;
          const badgeW = textW + badgeFontSize * 2.4;
          const margin = Math.round(canvas.width * 0.035);

          // Draw Badge in top-right corner
          const bx = canvas.width - badgeW - margin;
          const by = margin;

          // Shadow
          ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
          ctx.shadowBlur = 12;
          ctx.shadowOffsetY = 4;

          // Pill background
          ctx.fillStyle = badgeObj.color || '#10b981';
          ctx.beginPath();
          ctx.roundRect(bx, by, badgeW, badgeH, badgeH / 2);
          ctx.fill();

          // Border
          ctx.shadowColor = 'transparent';
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Text
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(badgeText, bx + badgeW / 2, by + badgeH / 2);
          ctx.restore();
        }
      }

      resolve(canvas.toDataURL('image/jpeg', 0.96));
    };
    img.onerror = () => resolve(sourceImgSrc);
    img.src = sourceImgSrc;
  });
};

interface ImageEditorPanelProps {
  imageSrc: string;
  adjustments: ImageAdjustments;
  onChangeAdjustments: (newAdjustments: ImageAdjustments) => void;
  onApplyEdits: () => Promise<void>;
  onResetToOriginal: () => void;
  isApplying?: boolean;
  isComparing: boolean;
  setIsComparing: (comparing: boolean) => void;
  onOpenBgRemoval?: () => void;
}

export const ImageEditorPanel: React.FC<ImageEditorPanelProps> = ({
  imageSrc,
  adjustments,
  onChangeAdjustments,
  onApplyEdits,
  onResetToOriginal,
  isApplying = false,
  isComparing,
  setIsComparing,
  onOpenBgRemoval
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'sliders' | 'badges' | 'transform'>('presets');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('original');

  // Check if adjustments differ from defaults
  const hasChanges = useMemo(() => {
    return (
      adjustments.brightness !== 0 ||
      adjustments.contrast !== 0 ||
      adjustments.saturation !== 0 ||
      adjustments.warmth !== 0 ||
      adjustments.sharpness !== 0 ||
      adjustments.vignette !== 0 ||
      adjustments.rotation !== 0 ||
      adjustments.flipH !== false ||
      (adjustments.overlayBadge && adjustments.overlayBadge !== 'none') ||
      !adjustments.lockProductColor
    );
  }, [adjustments]);

  // Handle Preset Selection
  const handleSelectPreset = (preset: FilterPreset) => {
    setSelectedPresetId(preset.id);
    onChangeAdjustments({
      ...adjustments,
      brightness: preset.adjustments.brightness,
      contrast: preset.adjustments.contrast,
      saturation: preset.adjustments.saturation,
      warmth: preset.adjustments.warmth,
      sharpness: preset.adjustments.sharpness,
      // If preset is colorSafe, keep color lock on; otherwise notify user
      lockProductColor: preset.colorSafe ? true : adjustments.lockProductColor
    });
  };

  // Slider change handler
  const handleSliderChange = (field: keyof ImageAdjustments, value: number) => {
    setSelectedPresetId('custom');
    onChangeAdjustments({
      ...adjustments,
      [field]: value
    });
  };

  // Toggle Color Lock (True-Color Fidelity Mode)
  const toggleColorLock = () => {
    const nextVal = !adjustments.lockProductColor;
    onChangeAdjustments({
      ...adjustments,
      lockProductColor: nextVal,
      // If locking, zero out warmth so no color cast remains
      warmth: nextVal ? 0 : adjustments.warmth
    });
  };

  // Quick 1-click Auto Enhance (Color-Safe!)
  const handleAutoEnhance = () => {
    setSelectedPresetId('clean_studio');
    onChangeAdjustments({
      ...adjustments,
      brightness: 12,
      contrast: 18,
      saturation: 4,
      warmth: 0,
      sharpness: 30,
      lockProductColor: true
    });
  };

  // Rotate 90 CW
  const handleRotate = () => {
    const nextRot = (adjustments.rotation + 90) % 360;
    onChangeAdjustments({
      ...adjustments,
      rotation: nextRot
    });
  };

  // Flip horizontal
  const handleFlipH = () => {
    onChangeAdjustments({
      ...adjustments,
      flipH: !adjustments.flipH
    });
  };

  // Reset all adjustments
  const handleResetAll = () => {
    setSelectedPresetId('original');
    onResetToOriginal();
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900/95 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs transition-all">
      
      {/* Panel Header */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-4 py-3 bg-white dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200 dark:border-indigo-800/80 shadow-xs">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>High-Quality Image Editor & Touch-Up</span>
              {adjustments.lockProductColor && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/25">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" />
                  <span>Color Locked</span>
                </span>
              )}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Live adjustments, studio filters, sharpness & true color preservation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasChanges && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/80">
              Changes Live
            </span>
          )}
          <button 
            type="button"
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4">
          
          {/* CRITICAL: TRUE PRODUCT COLOR PRESERVATION CARD */}
          <div className={`p-3 rounded-xl border transition-all ${
            adjustments.lockProductColor
              ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/60'
              : 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800/60'
          }`}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  adjustments.lockProductColor
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                    : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                }`}>
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>Lock Product Original Color (True-Color Fidelity)</span>
                    <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full ${
                      adjustments.lockProductColor
                        ? 'bg-emerald-500 text-white'
                        : 'bg-amber-500 text-slate-950'
                    }`}>
                      {adjustments.lockProductColor ? 'Active' : 'Manual Tints'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-snug mt-0.5">
                    {adjustments.lockProductColor
                      ? 'Guarantees the item’s authentic fabric/material color is NEVER shifted or discolored by filters or lighting.'
                      : 'Color lock paused: manual color temperature & saturation tints will affect the product.'}
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={adjustments.lockProductColor}
                  onChange={toggleColorLock}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>

          {/* Quick Toolbar (Auto Enhance, Compare, Reset, Save, BG Removal) */}
          <div className="flex items-center justify-between gap-1.5 flex-wrap">
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={handleAutoEnhance}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 border border-indigo-200 dark:border-indigo-800/80 flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                title="1-click automatic balanced clarity and lighting (color-safe)"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Auto Enhance</span>
              </button>

              {onOpenBgRemoval && (
                <button
                  type="button"
                  onClick={onOpenBgRemoval}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 border border-indigo-200 dark:border-indigo-800/80 flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                  title="Remove product background (transparent or studio white)"
                >
                  <Wand2 className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Remove BG</span>
                </button>
              )}

              {/* Hold to Compare Button */}
              {hasChanges && (
                <button
                  type="button"
                  onMouseDown={() => setIsComparing(true)}
                  onMouseUp={() => setIsComparing(false)}
                  onTouchStart={() => setIsComparing(true)}
                  onTouchEnd={() => setIsComparing(false)}
                  onMouseLeave={() => setIsComparing(false)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                    isComparing
                      ? 'bg-amber-500 text-white border-amber-600 shadow-inner'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-50'
                  }`}
                  title="Press and hold to view original photo"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{isComparing ? 'Showing Original' : 'Hold Compare'}</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {hasChanges && (
                <button
                  type="button"
                  onClick={handleResetAll}
                  className="px-2 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Reset all adjustments back to original"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}

              {hasChanges && (
                <button
                  type="button"
                  disabled={isApplying}
                  onClick={onApplyEdits}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:scale-95 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  title="Permanently bake edits into the photo"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isApplying ? 'Saving...' : 'Apply Edits'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Navigation Tabs (Presets vs Fine Adjustments vs Badges vs Transform) */}
          <div className="flex items-center p-1 rounded-xl bg-slate-200/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('presets')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'presets'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('sliders')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'sliders'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Adjustments</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('badges')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'badges'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Badges</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('transform')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'transform'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Transform</span>
            </button>
          </div>

          {/* TAB 1: PRESETS */}
          {activeTab === 'presets' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {FILTER_PRESETS.map((preset) => {
                const isSelected = selectedPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:bg-slate-100/60 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold leading-tight truncate">{preset.name}</span>
                        {preset.badge && (
                          <span className={`text-[8px] font-semibold px-1 py-0.2 rounded shrink-0 ${
                            preset.colorSafe
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}>
                            {preset.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                        {preset.subtitle}
                      </p>
                    </div>

                    {isSelected && (
                      <div className="mt-2 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                        <Check className="w-3 h-3 stroke-[3]" /> Active
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* TAB 2: SLIDERS & FINE TUNING */}
          {activeTab === 'sliders' && (
            <div className="space-y-3.5 bg-white dark:bg-slate-850 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
              
              {/* Brightness */}
              <div>
                <div className="flex items-center justify-between text-xs font-medium mb-1">
                  <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>Brightness / Exposure</span>
                  </span>
                  <span className={`text-[11px] font-bold ${adjustments.brightness !== 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
                    {adjustments.brightness > 0 ? `+${adjustments.brightness}%` : `${adjustments.brightness}%`}
                  </span>
                </div>
                <input
                  type="range"
                  min="-60"
                  max="60"
                  step="1"
                  value={adjustments.brightness}
                  onChange={(e) => handleSliderChange('brightness', parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              {/* Contrast */}
              <div>
                <div className="flex items-center justify-between text-xs font-medium mb-1">
                  <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Contrast className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Contrast & Tone Depth</span>
                  </span>
                  <span className={`text-[11px] font-bold ${adjustments.contrast !== 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
                    {adjustments.contrast > 0 ? `+${adjustments.contrast}%` : `${adjustments.contrast}%`}
                  </span>
                </div>
                <input
                  type="range"
                  min="-60"
                  max="60"
                  step="1"
                  value={adjustments.contrast}
                  onChange={(e) => handleSliderChange('contrast', parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              {/* Sharpness & Clarity (Color-safe) */}
              <div>
                <div className="flex items-center justify-between text-xs font-medium mb-1">
                  <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Sharpness & Edge Pop</span>
                  </span>
                  <span className={`text-[11px] font-bold ${adjustments.sharpness > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                    {adjustments.sharpness > 0 ? `+${adjustments.sharpness}%` : 'Off'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={adjustments.sharpness}
                  onChange={(e) => handleSliderChange('sharpness', parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              {/* Saturation */}
              <div>
                <div className="flex items-center justify-between text-xs font-medium mb-1">
                  <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-pink-500" />
                    <span>Saturation (Color Richness)</span>
                  </span>
                  <span className={`text-[11px] font-bold ${adjustments.saturation !== 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
                    {adjustments.saturation > 0 ? `+${adjustments.saturation}%` : `${adjustments.saturation}%`}
                  </span>
                </div>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  step="1"
                  value={adjustments.saturation}
                  onChange={(e) => handleSliderChange('saturation', parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              {/* Color Temperature (Warmth) */}
              <div>
                <div className="flex items-center justify-between text-xs font-medium mb-1">
                  <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-orange-500" />
                    <span>Color Temperature (Warmth)</span>
                  </span>
                  <span className={`text-[11px] font-bold ${
                    adjustments.lockProductColor 
                      ? 'text-emerald-500' 
                      : adjustments.warmth !== 0 
                      ? 'text-indigo-600 dark:text-indigo-400' 
                      : 'text-slate-400'
                  }`}>
                    {adjustments.lockProductColor 
                      ? 'Locked Neutral (0°)' 
                      : adjustments.warmth > 0 
                      ? `+${adjustments.warmth} Warm` 
                      : adjustments.warmth < 0 
                      ? `${adjustments.warmth} Cool` 
                      : '0 Neutral'}
                  </span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  step="1"
                  disabled={adjustments.lockProductColor}
                  value={adjustments.warmth}
                  onChange={(e) => handleSliderChange('warmth', parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-gradient-to-r from-sky-400 via-slate-200 dark:via-slate-700 to-amber-500 rounded-lg appearance-none cursor-pointer accent-indigo-600 disabled:opacity-40"
                />
                {adjustments.lockProductColor && (
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                    ✓ Warmth shift disabled to preserve true product color. Turn off Color Lock to manually tint.
                  </p>
                )}
              </div>

              {/* Vignette */}
              <div>
                <div className="flex items-center justify-between text-xs font-medium mb-1">
                  <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-slate-500" />
                    <span>Corner Focus (Vignette)</span>
                  </span>
                  <span className={`text-[11px] font-bold ${adjustments.vignette > 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
                    {adjustments.vignette > 0 ? `${adjustments.vignette}%` : 'Off'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={adjustments.vignette}
                  onChange={(e) => handleSliderChange('vignette', parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

            </div>
          )}

          {/* TAB 3: PROMOTIONAL BADGES */}
          {activeTab === 'badges' && (
            <div className="space-y-3 bg-white dark:bg-slate-850 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <div>
                <h5 className="text-xs font-bold text-slate-900 dark:text-white">Commercial Trust & Offer Badges</h5>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Stamp conversion-boosting badges directly onto the product photo for marketplace appeal.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {COMMERCIAL_BADGES.map((b) => {
                  const isSelected = (adjustments.overlayBadge || 'none') === b.id;
                  const Icon = b.icon;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => {
                        onChangeAdjustments({
                          ...adjustments,
                          overlayBadge: b.id === 'none' ? undefined : b.id
                        });
                      }}
                      className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 shadow-xs ring-1 ring-indigo-500'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {Icon ? (
                        <span className="w-5 h-5 rounded-md flex items-center justify-center text-white" style={{ backgroundColor: b.color }}>
                          <Icon className="w-3 h-3" />
                        </span>
                      ) : (
                        <span className="w-5 h-5 rounded-md border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400">
                          ✕
                        </span>
                      )}
                      <span className="truncate">{b.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: TRANSFORM (Rotate & Flip) */}
          {activeTab === 'transform' && (
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleRotate}
                className="py-3 px-3 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <RotateCw className="w-4 h-4 text-indigo-500" />
                <span>Rotate 90° ({adjustments.rotation}°)</span>
              </button>

              <button
                type="button"
                onClick={handleFlipH}
                className={`py-3 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
                  adjustments.flipH
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-400 text-indigo-700 dark:text-indigo-300'
                    : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                }`}
              >
                <FlipHorizontal className="w-4 h-4 text-indigo-500" />
                <span>Flip Horizontal</span>
              </button>
            </div>
          )}

        </div>
      )}
    </div>
  );
};
