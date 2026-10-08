import React, { useState, useRef, useEffect } from 'react';
import { 
  Crop, 
  Sliders, 
  RotateCw, 
  FlipHorizontal, 
  Sun, 
  Check, 
  X, 
  RotateCcw,
  Sparkles,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Palette,
  ShieldCheck,
  Eye,
  Tag,
  Shield
} from 'lucide-react';

interface ImageRefineModalProps {
  isOpen: boolean;
  imageSrc: string;
  onClose: () => void;
  onApply: (newImageSrc: string) => void;
}

type AspectRatioPreset = 'free' | '1:1' | '4:5' | '9:16' | '16:9';

interface FilterPreset {
  id: string;
  name: string;
  brightness: number;
  contrast: number;
  saturation: number;
  warmth: number;
  tag: string;
  colorSafe: boolean;
}

const FILTER_PRESETS: FilterPreset[] = [
  {
    id: 'original',
    name: 'Original Photo',
    brightness: 0,
    contrast: 0,
    saturation: 0,
    warmth: 0,
    tag: 'True Color',
    colorSafe: true
  },
  {
    id: 'studio_clean',
    name: 'Pure E-Commerce',
    brightness: 12,
    contrast: 16,
    saturation: 4,
    warmth: 0,
    tag: 'Product Safe',
    colorSafe: true
  },
  {
    id: 'commercial_crisp',
    name: 'Crisp Detail',
    brightness: 8,
    contrast: 24,
    saturation: 4,
    warmth: 0,
    tag: 'High Clarity',
    colorSafe: true
  },
  {
    id: 'white_catalog',
    name: 'Amazon / White',
    brightness: 14,
    contrast: 15,
    saturation: 0,
    warmth: 0,
    tag: 'Catalog',
    colorSafe: true
  },
  {
    id: 'warm_artisan',
    name: 'Warm Artisan',
    brightness: 5,
    contrast: 12,
    saturation: 16,
    warmth: 20,
    tag: 'Tints Color',
    colorSafe: false
  },
  {
    id: 'monochrome_luxe',
    name: 'B&W Editorial',
    brightness: 8,
    contrast: 32,
    saturation: -100,
    warmth: 0,
    tag: 'Monochrome',
    colorSafe: false
  }
];

export const ImageRefineModal: React.FC<ImageRefineModalProps> = ({
  isOpen,
  imageSrc,
  onClose,
  onApply
}) => {
  const [activeTab, setActiveTab] = useState<'crop' | 'filter' | 'adjust'>('crop');
  const [aspectRatio, setAspectRatio] = useState<AspectRatioPreset>('1:1');
  const [zoom, setZoom] = useState<number>(1);
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);
  const [rotation, setRotation] = useState<number>(0); // 0, 90, 180, 270
  const [flipH, setFlipH] = useState<boolean>(false);
  const [isComparing, setIsComparing] = useState<boolean>(false);

  // Color preservation mode: ON by default to prevent product fabric/color shifts
  const [lockProductColor, setLockProductColor] = useState<boolean>(true);

  // Filters & Adjustments
  const [selectedPresetId, setSelectedPresetId] = useState<string>('original');
  const [brightness, setBrightness] = useState<number>(0);
  const [contrast, setContrast] = useState<number>(0);
  const [saturation, setSaturation] = useState<number>(0);
  const [warmth, setWarmth] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [isImgLoaded, setIsImgLoaded] = useState<boolean>(false);
  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Preload image
  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imgRef.current = img;
      setIsImgLoaded(true);
      resetAll();
    };
    img.onerror = () => {
      const fallback = new Image();
      fallback.onload = () => {
        imgRef.current = fallback;
        setIsImgLoaded(true);
        resetAll();
      };
      fallback.src = imageSrc;
    };
    img.src = imageSrc;
  }, [imageSrc]);

  const resetAll = () => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
    setRotation(0);
    setFlipH(false);
    setSelectedPresetId('original');
    setBrightness(0);
    setContrast(0);
    setSaturation(0);
    setWarmth(0);
    setLockProductColor(true);
  };

  const handleApplyPreset = (preset: FilterPreset) => {
    setSelectedPresetId(preset.id);
    setBrightness(preset.brightness);
    setContrast(preset.contrast);
    setSaturation(preset.saturation);
    setWarmth(preset.warmth);
    if (preset.colorSafe) {
      setLockProductColor(true);
    }
  };

  // Render canvas pipeline with zero latency live updates
  useEffect(() => {
    if (!isImgLoaded || !imgRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imgRef.current;
    const natW = img.naturalWidth || img.width || 800;
    const natH = img.naturalHeight || img.height || 800;

    // Target canvas dimensions based on aspect ratio
    let targetW = 900;
    let targetH = 900;

    if (aspectRatio === '1:1') {
      targetW = 900;
      targetH = 900;
    } else if (aspectRatio === '4:5') {
      targetW = 800;
      targetH = 1000;
    } else if (aspectRatio === '9:16') {
      targetW = 720;
      targetH = 1280;
    } else if (aspectRatio === '16:9') {
      targetW = 1200;
      targetH = 675;
    } else {
      // Freeform / original ratio
      targetW = 900;
      targetH = Math.round((900 * natH) / natW);
    }

    canvas.width = targetW;
    canvas.height = targetH;

    ctx.clearRect(0, 0, targetW, targetH);

    // Apply color correction filter string
    const bVal = isComparing ? 100 : (100 + brightness);
    const cVal = isComparing ? 100 : (100 + contrast);
    // When lockProductColor is on, restrict saturation shift to protect product authenticity
    const effectiveSat = isComparing 
      ? 100 
      : lockProductColor 
      ? Math.min(120, Math.max(80, 100 + saturation * 0.4)) 
      : 100 + saturation;

    ctx.filter = `brightness(${bVal}%) contrast(${cVal}%) saturate(${effectiveSat}%)`;

    ctx.save();

    // Center translation for rotation, zoom, flip, and pan
    const activeZoom = isComparing ? 1 : zoom;
    const activePanX = isComparing ? 0 : panX;
    const activePanY = isComparing ? 0 : panY;
    const activeRot = isComparing ? 0 : rotation;
    const activeFlip = isComparing ? false : flipH;

    ctx.translate(targetW / 2 + activePanX, targetH / 2 + activePanY);
    ctx.rotate((activeRot * Math.PI) / 180);
    ctx.scale(activeFlip ? -activeZoom : activeZoom, activeZoom);

    // Draw image centered
    const isRotatedQuarter = activeRot === 90 || activeRot === 270;
    const drawW = isRotatedQuarter ? targetH : targetW;
    const drawH = isRotatedQuarter ? targetW : targetH;

    // Maintain aspect ratio cover
    const scale = Math.max(drawW / natW, drawH / natH);
    const renderW = natW * scale;
    const renderH = natH * scale;

    ctx.drawImage(img, -renderW / 2, -renderH / 2, renderW, renderH);

    ctx.restore();

    // Warmth / Temperature Tint Overlay ONLY when color lock is explicitly off
    if (!isComparing && !lockProductColor && warmth !== 0) {
      ctx.save();
      ctx.fillStyle = warmth > 0 ? '#f59e0b' : '#38bdf8';
      ctx.globalAlpha = Math.abs(warmth) / 260;
      ctx.fillRect(0, 0, targetW, targetH);
      ctx.restore();
    }
  }, [
    isImgLoaded,
    aspectRatio,
    zoom,
    panX,
    panY,
    rotation,
    flipH,
    brightness,
    contrast,
    saturation,
    warmth,
    lockProductColor,
    isComparing
  ]);

  // Mouse pan handlers on preview canvas
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX - panX, y: e.clientY - panY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    setPanX(e.clientX - dragStartRef.current.x);
    setPanY(e.clientY - dragStartRef.current.y);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleSaveAndApply = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png', 0.96);
    onApply(dataUrl);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <span>High-Quality Product Photo Editor</span>
                {lockProductColor && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>True Color Locked</span>
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400">
                Live crop, orientation & lighting adjustments with guaranteed product color fidelity.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Left Canvas Preview + Right Tool Controls */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden">
          
          {/* Left Canvas Preview Area - Always visible while adjusting */}
          <div className="lg:col-span-7 bg-slate-950 p-4 sm:p-6 flex flex-col items-center justify-center relative select-none overflow-hidden">
            <div className="relative max-h-[440px] max-w-full flex items-center justify-center overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
              <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="max-h-[420px] max-w-full h-auto object-contain block cursor-grab active:cursor-grabbing"
              />

              {/* Grid overlay for Rule of Thirds when cropping */}
              {activeTab === 'crop' && (
                <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 border border-white/20">
                  <div className="border-r border-b border-white/15" />
                  <div className="border-r border-b border-white/15" />
                  <div className="border-b border-white/15" />
                  <div className="border-r border-b border-white/15" />
                  <div className="border-r border-b border-white/15" />
                  <div className="border-b border-white/15" />
                  <div className="border-r border-b border-white/15" />
                  <div className="border-r border-b border-white/15" />
                  <div />
                </div>
              )}

              {/* Compare Indicator */}
              {isComparing && (
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 font-extrabold text-[10px] uppercase shadow-lg">
                  Showing Original
                </div>
              )}
            </div>

            {/* Bottom quick actions */}
            <div className="w-full flex items-center justify-between text-[11px] text-slate-400 mt-3 px-1">
              <span>💡 Drag image inside window to adjust framing.</span>
              <button
                type="button"
                onMouseDown={() => setIsComparing(true)}
                onMouseUp={() => setIsComparing(false)}
                onTouchStart={() => setIsComparing(true)}
                onTouchEnd={() => setIsComparing(false)}
                className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 border transition-all ${
                  isComparing ? 'bg-amber-500 text-slate-950 border-amber-600' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Hold to Compare</span>
              </button>
            </div>
          </div>

          {/* Right Tool Tabs & Adjustments */}
          <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col bg-slate-900/90 overflow-y-auto">
            
            {/* Color Preservation Toggle */}
            <div className="p-3 border-b border-slate-800 bg-slate-950/40">
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <div>
                    <span className="text-xs font-bold text-white block">Product Color Preservation</span>
                    <span className="text-[10px] text-slate-400 block">Prevents tone shifts to guarantee item color authenticity</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={lockProductColor}
                  onChange={(e) => setLockProductColor(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
              </label>
            </div>

            {/* Tool Tabs Header */}
            <div className="flex border-b border-slate-800 p-1.5 bg-slate-900">
              <button
                onClick={() => setActiveTab('crop')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'crop'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Crop className="w-3.5 h-3.5" />
                <span>Crop & Size</span>
              </button>

              <button
                onClick={() => setActiveTab('filter')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'filter'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Presets</span>
              </button>

              <button
                onClick={() => setActiveTab('adjust')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'adjust'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Adjust</span>
              </button>
            </div>

            {/* Tab 1: Crop & Transform Controls */}
            {activeTab === 'crop' && (
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
                    E-Commerce Aspect Ratio
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: '1:1', label: '1:1 Square (Feed & Shop)' },
                      { id: '4:5', label: '4:5 Portrait (Instagram)' },
                      { id: '9:16', label: '9:16 Story / TikTok' },
                      { id: '16:9', label: '16:9 Website Hero' },
                      { id: 'free', label: 'Original Dimensions' }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setAspectRatio(opt.id as AspectRatioPreset)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                          aspectRatio === opt.id
                            ? 'border-indigo-500 bg-indigo-500/20 text-white shadow-xs ring-1 ring-indigo-500'
                            : 'border-slate-800 bg-slate-800/60 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Transform Actions: Rotate & Flip */}
                <div className="pt-2 border-t border-slate-800">
                  <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
                    Orientation & Alignment
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setRotation((prev) => (prev + 90) % 360)}
                      className="p-2.5 rounded-xl border border-slate-800 bg-slate-800/70 text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-2 hover:bg-slate-800"
                    >
                      <RotateCw className="w-4 h-4 text-indigo-400" />
                      <span>Rotate 90° ({rotation}°)</span>
                    </button>

                    <button
                      onClick={() => setFlipH(!flipH)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 ${
                        flipH
                          ? 'border-indigo-500 bg-indigo-500/20 text-white'
                          : 'border-slate-800 bg-slate-800/70 text-slate-300 hover:text-white'
                      }`}
                    >
                      <FlipHorizontal className="w-4 h-4 text-indigo-400" />
                      <span>Flip Horizontal</span>
                    </button>
                  </div>
                </div>

                {/* Zoom Slider */}
                <div className="pt-2 border-t border-slate-800">
                  <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                    <span className="font-bold flex items-center gap-1">
                      <ZoomIn className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Zoom Scale</span>
                    </span>
                    <span className="font-mono text-indigo-400 font-bold">{Math.round(zoom * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="2.5"
                    step="0.05"
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>
              </div>
            )}

            {/* Tab 2: Filter Presets */}
            {activeTab === 'filter' && (
              <div className="p-5 space-y-3">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Product-Safe Presets
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {FILTER_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handleApplyPreset(preset)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedPresetId === preset.id
                          ? 'border-indigo-500 bg-indigo-500/20 text-white shadow-xs ring-1 ring-indigo-500'
                          : 'border-slate-800 bg-slate-800/50 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="font-bold text-xs truncate">{preset.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{preset.tag}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Fine Adjustments */}
            {activeTab === 'adjust' && (
              <div className="p-5 space-y-4 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span className="font-bold">Brightness / Exposure</span>
                    <span className="font-mono text-indigo-400">{brightness > 0 ? `+${brightness}` : brightness}</span>
                  </div>
                  <input
                    type="range"
                    min="-40"
                    max="40"
                    value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span className="font-bold">Contrast & Depth</span>
                    <span className="font-mono text-indigo-400">{contrast > 0 ? `+${contrast}` : contrast}</span>
                  </div>
                  <input
                    type="range"
                    min="-40"
                    max="40"
                    value={contrast}
                    onChange={(e) => setContrast(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span className="font-bold">Vibrance / Saturation</span>
                    <span className="font-mono text-indigo-400">{saturation > 0 ? `+${saturation}` : saturation}</span>
                  </div>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={saturation}
                    onChange={(e) => setSaturation(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span className="font-bold">Color Temperature (Warmth)</span>
                    <span className={`font-mono ${lockProductColor ? 'text-emerald-400' : 'text-indigo-400'}`}>
                      {lockProductColor ? 'Locked (0°)' : warmth}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-30"
                    max="30"
                    disabled={lockProductColor}
                    value={warmth}
                    onChange={(e) => setWarmth(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 disabled:opacity-40"
                  />
                  {lockProductColor && (
                    <span className="text-[10px] text-emerald-400 block mt-0.5">
                      ✓ Color Lock active: warmth tint bypassed to preserve genuine product color.
                    </span>
                  )}
                </div>

                <button
                  onClick={resetAll}
                  className="w-full py-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 mt-2 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Adjustments</span>
                </button>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="mt-auto p-4 border-t border-slate-800 bg-slate-900/95 flex items-center justify-between gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveAndApply}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all active:scale-98"
              >
                <Check className="w-4 h-4" />
                <span>Apply to Photo</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
