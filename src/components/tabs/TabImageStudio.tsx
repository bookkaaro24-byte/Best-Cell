import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Download, 
  Layers, 
  RefreshCw, 
  Check, 
  Trash2, 
  Sliders, 
  Image as ImageIcon,
  CheckCircle2,
  Coins,
  Copy,
  Maximize2,
  Sun,
  Eye,
  Camera,
  Palette,
  RotateCcw
} from 'lucide-react';
import { GeneratedStudioImage } from '../../types';

interface TabImageStudioProps {
  originalImage: string;
  productName: string;
  studioImages: GeneratedStudioImage[];
  onAddStudioImage: (img: GeneratedStudioImage) => void;
  onSetAsPrimaryImage: (url: string) => void;
  onDeleteStudioImage: (id: string) => void;
}

interface StudioPreset {
  id: string;
  name: string;
  category: string;
  bgGradient: [string, string, string];
  pedestalType: 'none' | 'marble' | 'sandstone' | 'wood' | 'slate' | 'glass' | 'moss';
  pedestalColor: string;
  shadowColor: string;
  spotlightColor: string;
  rimColor: string;
  description: string;
}

const STUDIO_PRESETS: StudioPreset[] = [
  {
    id: 'clean',
    name: 'Clean E-Commerce',
    category: 'Commercial',
    bgGradient: ['#ffffff', '#f8fafc', '#e2e8f0'],
    pedestalType: 'none',
    pedestalColor: '#ffffff',
    shadowColor: 'rgba(15, 23, 42, 0.35)',
    spotlightColor: 'rgba(255, 255, 255, 0.8)',
    rimColor: 'rgba(226, 232, 240, 0.6)',
    description: 'Pure white infinity cyclorama studio backdrop with soft drop shadows.'
  },
  {
    id: 'luxury_marble',
    name: 'Carrara Marble Pedestal',
    category: 'Luxury',
    bgGradient: ['#1e1b4b', '#0f172a', '#020617'],
    pedestalType: 'marble',
    pedestalColor: '#f1f5f9',
    shadowColor: 'rgba(0, 0, 0, 0.7)',
    spotlightColor: 'rgba(245, 158, 11, 0.25)',
    rimColor: 'rgba(56, 189, 248, 0.3)',
    description: 'Polished Italian white marble cylinder with warm gold architectural rim light.'
  },
  {
    id: 'minimal_clay',
    name: 'Scandinavian Sandstone',
    category: 'Minimalist',
    bgGradient: ['#faf5ef', '#f2ebe0', '#e7ded0'],
    pedestalType: 'sandstone',
    pedestalColor: '#ede5d8',
    shadowColor: 'rgba(68, 64, 60, 0.35)',
    spotlightColor: 'rgba(255, 255, 255, 0.6)',
    rimColor: 'rgba(214, 199, 179, 0.5)',
    description: 'Smooth clay podium with soft morning window light and gentle architectural shadows.'
  },
  {
    id: 'oak_living',
    name: 'Warm Oak Tabletop',
    category: 'Lifestyle',
    bgGradient: ['#fef3c7', '#fdf4ff', '#e2e8f0'],
    pedestalType: 'wood',
    pedestalColor: '#b45309',
    shadowColor: 'rgba(69, 26, 3, 0.45)',
    spotlightColor: 'rgba(254, 240, 138, 0.4)',
    rimColor: 'rgba(245, 158, 11, 0.3)',
    description: 'Natural oak wood surface with warm ambient interior daylight and soft bokeh.'
  },
  {
    id: 'dark_slate',
    name: 'Dark Velvet & Slate',
    category: 'Mood & Tech',
    bgGradient: ['#27272a', '#18181b', '#09090b'],
    pedestalType: 'slate',
    pedestalColor: '#18181b',
    shadowColor: 'rgba(0, 0, 0, 0.85)',
    spotlightColor: 'rgba(99, 102, 241, 0.3)',
    rimColor: 'rgba(129, 140, 248, 0.4)',
    description: 'Matte obsidian slab with dramatic overhead spotlight and indigo rim highlights.'
  },
  {
    id: 'sunlit_terrace',
    name: 'Mediterranean Sunlit',
    category: 'Outdoor',
    bgGradient: ['#fffbeb', '#fef3c7', '#fed7aa'],
    pedestalType: 'sandstone',
    pedestalColor: '#fef3c7',
    shadowColor: 'rgba(120, 53, 15, 0.35)',
    spotlightColor: 'rgba(253, 230, 138, 0.5)',
    rimColor: 'rgba(245, 158, 11, 0.4)',
    description: 'Sun-drenched outdoor stone terrace with gentle organic monstera leaf shadows.'
  },
  {
    id: 'boutique_shelf',
    name: 'Boutique Gallery Shelf',
    category: 'Retail',
    bgGradient: ['#334155', '#1e293b', '#0f172a'],
    pedestalType: 'glass',
    pedestalColor: '#f8fafc',
    shadowColor: 'rgba(15, 23, 42, 0.7)',
    spotlightColor: 'rgba(254, 240, 138, 0.35)',
    rimColor: 'rgba(217, 119, 6, 0.4)',
    description: 'Designer boutique display shelf with softly blurred ambient warm gallery lights.'
  },
  {
    id: 'sunset_glow',
    name: 'Sunset Terracotta',
    category: 'Vibrant',
    bgGradient: ['#4c0519', '#881337', '#1c1917'],
    pedestalType: 'slate',
    pedestalColor: '#9f1239',
    shadowColor: 'rgba(0, 0, 0, 0.75)',
    spotlightColor: 'rgba(251, 146, 60, 0.4)',
    rimColor: 'rgba(244, 63, 94, 0.5)',
    description: 'Deep dusk twilight palette with rich terracotta pedestal and warm sunset rim glow.'
  },
  {
    id: 'pastel_d2c',
    name: 'Pastel D2C Aesthetic',
    category: 'Modern',
    bgGradient: ['#ede9fe', '#fce7f3', '#e0f2fe'],
    pedestalType: 'sandstone',
    pedestalColor: '#f5f3ff',
    shadowColor: 'rgba(109, 40, 217, 0.22)',
    spotlightColor: 'rgba(255, 255, 255, 0.7)',
    rimColor: 'rgba(167, 139, 250, 0.4)',
    description: 'Trendy soft gradient studio environment favored by modern direct-to-consumer brands.'
  },
  {
    id: 'cyber_neon',
    name: 'Cyberpunk Glow',
    category: 'Mood & Tech',
    bgGradient: ['#0f172a', '#090d16', '#020408'],
    pedestalType: 'slate',
    pedestalColor: '#0f172a',
    shadowColor: 'rgba(0, 0, 0, 0.9)',
    spotlightColor: 'rgba(236, 72, 153, 0.4)',
    rimColor: 'rgba(6, 182, 212, 0.6)',
    description: 'High-tech dark studio with dual neon cyan and electric magenta floor reflections.'
  }
];

const ASPECT_RATIOS = [
  { id: '1:1', label: '1:1 Square', width: 1080, height: 1080, sub: 'Shopify / Feed' },
  { id: '4:5', label: '4:5 Portrait', width: 1080, height: 1350, sub: 'Instagram Feed' },
  { id: '9:16', label: '9:16 Story', width: 1080, height: 1920, sub: 'Reels / TikTok' },
  { id: '16:9', label: '16:9 Banner', width: 1200, height: 675, sub: 'Website Hero' },
];

export const TabImageStudio: React.FC<TabImageStudioProps> = ({
  originalImage,
  productName,
  studioImages,
  onAddStudioImage,
  onSetAsPrimaryImage,
  onDeleteStudioImage
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('clean');
  const [selectedRatioId, setSelectedRatioId] = useState<string>('1:1');
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  
  // Interactive Studio Sliders
  const [productScale, setProductScale] = useState<number>(100); // 50 to 140
  const [offsetY, setOffsetY] = useState<number>(0); // -100 to 100
  const [offsetX, setOffsetX] = useState<number>(0); // -100 to 100
  const [shadowIntensity, setShadowIntensity] = useState<number>(70); // 0 to 100
  const [shadowBlur, setShadowBlur] = useState<number>(20); // 5 to 50
  const [showReflection, setShowReflection] = useState<boolean>(true);
  const [reflectionOpacity, setReflectionOpacity] = useState<number>(35); // 0 to 80
  const [brightness, setBrightness] = useState<number>(0); // -30 to +30
  const [contrast, setContrast] = useState<number>(0); // -30 to +30
  const [warmth, setWarmth] = useState<number>(0); // -30 to +30
  const [vignette, setVignette] = useState<number>(25); // 0 to 80
  
  // UI States
  const [compareSliderPosition, setCompareSliderPosition] = useState<number>(50);
  const [viewMode, setViewMode] = useState<'split' | 'rendered' | 'original'>('split');
  const [activeGalleryImage, setActiveGalleryImage] = useState<GeneratedStudioImage | null>(
    studioImages[0] || null
  );
  const [copiedNotice, setCopiedNotice] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loadedImageRef = useRef<HTMLImageElement | null>(null);
  const [isImageReady, setIsImageReady] = useState<boolean>(false);

  // Preload product image into memory once
  useEffect(() => {
    if (!originalImage) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      loadedImageRef.current = img;
      setIsImageReady(true);
      renderStudioCanvas();
    };
    img.onerror = () => {
      // Retry without anonymous if it was blocked by strict CORS
      const fallbackImg = new Image();
      fallbackImg.onload = () => {
        loadedImageRef.current = fallbackImg;
        setIsImageReady(true);
        renderStudioCanvas();
      };
      fallbackImg.src = originalImage;
    };
    img.src = originalImage;
  }, [originalImage]);

  // Re-render canvas whenever any slider or preset changes
  useEffect(() => {
    if (isImageReady) {
      renderStudioCanvas();
    }
  }, [
    isImageReady,
    selectedPresetId,
    selectedRatioId,
    productScale,
    offsetY,
    offsetX,
    shadowIntensity,
    shadowBlur,
    showReflection,
    reflectionOpacity,
    brightness,
    contrast,
    warmth,
    vignette
  ]);

  const renderStudioCanvas = () => {
    const canvas = canvasRef.current;
    const prodImg = loadedImageRef.current;
    if (!canvas) return;

    const fmt = ASPECT_RATIOS.find((f) => f.id === selectedRatioId) || ASPECT_RATIOS[0];
    canvas.width = fmt.width;
    canvas.height = fmt.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const preset = STUDIO_PRESETS.find((p) => p.id === selectedPresetId) || STUDIO_PRESETS[0];

    // 1. Draw Background Gradient
    const bgGrad = ctx.createRadialGradient(
      canvas.width * 0.5,
      canvas.height * 0.38,
      canvas.width * 0.1,
      canvas.width * 0.5,
      canvas.height * 0.5,
      canvas.width * 0.8
    );
    bgGrad.addColorStop(0, preset.bgGradient[0]);
    bgGrad.addColorStop(0.65, preset.bgGradient[1]);
    bgGrad.addColorStop(1, preset.bgGradient[2]);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Ambient Studio Glow / Spotlight
    ctx.save();
    ctx.fillStyle = preset.spotlightColor;
    ctx.beginPath();
    ctx.arc(canvas.width * 0.5, canvas.height * 0.35, canvas.width * 0.45, 0, Math.PI * 2);
    ctx.filter = 'blur(60px)';
    ctx.fill();
    ctx.restore();

    // 3. Studio Horizon line
    const horizonY = canvas.height * 0.72;
    ctx.strokeStyle = preset.rimColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, horizonY);
    ctx.lineTo(canvas.width, horizonY);
    ctx.stroke();

    // Calculate product dimensions and placement
    const scaleFactor = (productScale / 100);
    const baseSize = Math.min(canvas.width, canvas.height) * 0.58;
    const prodW = baseSize * scaleFactor;
    const prodH = baseSize * scaleFactor;
    const posX = (canvas.width - prodW) / 2 + offsetX * 2;
    const posY = (canvas.height * 0.18) + (offsetY * 2);
    const groundY = posY + prodH - (canvas.height * 0.04);

    // 4. Draw Pedestal (if preset has one)
    if (preset.pedestalType !== 'none') {
      const pedW = prodW * 1.15;
      const pedH = canvas.height * 0.16;
      const pedX = posX - (pedW - prodW) / 2;
      const pedY = groundY - 12;

      ctx.save();
      // Pedestal Cylinder Body
      const bodyGrad = ctx.createLinearGradient(pedX, 0, pedX + pedW, 0);
      bodyGrad.addColorStop(0, preset.pedestalColor);
      bodyGrad.addColorStop(0.5, '#ffffff');
      bodyGrad.addColorStop(1, preset.pedestalColor);
      ctx.fillStyle = bodyGrad;
      ctx.fillRect(pedX, pedY, pedW, pedH);

      // Pedestal Top Face (Ellipse)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(pedX + pedW / 2, pedY, pedW / 2, pedH * 0.28, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = preset.rimColor;
      ctx.lineWidth = 3;
      ctx.stroke();

      // Pedestal Base Rim (Ellipse)
      ctx.beginPath();
      ctx.ellipse(pedX + pedW / 2, pedY + pedH, pedW / 2, pedH * 0.28, 0, 0, Math.PI * 2);
      ctx.fillStyle = preset.pedestalColor;
      ctx.fill();

      ctx.restore();
    }

    // 5. Contact & Drop Shadows
    if (shadowIntensity > 0) {
      ctx.save();
      const shadowAlpha = shadowIntensity / 100;
      const shadowRadiusX = (prodW * 0.45);
      const shadowRadiusY = (prodH * 0.12);

      // Soft diffuse ambient shadow
      ctx.filter = `blur(${shadowBlur}px)`;
      ctx.fillStyle = preset.shadowColor;
      ctx.globalAlpha = shadowAlpha * 0.6;
      ctx.beginPath();
      ctx.ellipse(posX + prodW / 2, groundY + 10, shadowRadiusX * 1.2, shadowRadiusY * 1.3, 0, 0, Math.PI * 2);
      ctx.fill();

      // Sharp contact shadow right under product
      ctx.filter = `blur(${Math.max(4, shadowBlur * 0.3)}px)`;
      ctx.globalAlpha = shadowAlpha * 0.9;
      ctx.beginPath();
      ctx.ellipse(posX + prodW / 2, groundY, shadowRadiusX * 0.75, shadowRadiusY * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // 6. Mirror Floor Reflection (if enabled)
    if (showReflection && prodImg && reflectionOpacity > 0) {
      ctx.save();
      ctx.globalAlpha = (reflectionOpacity / 100) * 0.5;
      ctx.translate(0, groundY * 2);
      ctx.scale(1, -1);
      
      // Mask reflection with vertical gradient fade
      ctx.drawImage(prodImg, posX, posY, prodW, prodH);
      
      // Reflection fade overlay
      ctx.globalCompositeOperation = 'destination-out';
      const refFade = ctx.createLinearGradient(0, groundY, 0, groundY + prodH);
      refFade.addColorStop(0, 'rgba(0, 0, 0, 0.2)');
      refFade.addColorStop(0.6, 'rgba(0, 0, 0, 0.9)');
      refFade.addColorStop(1, 'rgba(0, 0, 0, 1.0)');
      ctx.fillStyle = refFade;
      ctx.fillRect(posX - 20, groundY, prodW + 40, prodH);
      ctx.restore();
    }

    // 7. Draw Main Product
    if (prodImg) {
      ctx.save();
      
      // Color correction filters
      const brightVal = 100 + brightness;
      const contVal = 100 + contrast;
      ctx.filter = `brightness(${brightVal}%) contrast(${contVal}%)`;

      ctx.drawImage(prodImg, posX, posY, prodW, prodH);
      ctx.restore();
    } else {
      // Elegant placeholder if image is still loading
      ctx.save();
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(posX, posY, prodW, prodH);
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(productName, posX + prodW / 2, posY + prodH / 2);
      ctx.restore();
    }

    // 8. Warmth / Temperature Tint Overlay
    if (warmth !== 0) {
      ctx.save();
      ctx.fillStyle = warmth > 0 ? '#f59e0b' : '#38bdf8';
      ctx.globalAlpha = Math.abs(warmth) / 250;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    }

    // 9. Vignette Border
    if (vignette > 0) {
      ctx.save();
      const vigGrad = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.4,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.85
      );
      vigGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vigGrad.addColorStop(1, `rgba(0, 0, 0, ${(vignette / 100) * 0.65})`);
      ctx.fillStyle = vigGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    }
  };

  // Trigger Instant High-Res PNG Download
  const handleDownloadRenderedPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const safeName = productName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        a.download = `${safeName}_studio_${selectedPresetId}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 'image/png');
    } catch (e: any) {
      // Fallback
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `${productName.replace(/\s+/g, '_')}_studio.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  // Save current canvas state to Studio Images Gallery
  const handleSaveToGallery = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    const presetObj = STUDIO_PRESETS.find(p => p.id === selectedPresetId);
    const newStudioImage: GeneratedStudioImage = {
      id: `studio-${Date.now()}`,
      url: dataUrl,
      preset: presetObj?.name || 'Custom Studio',
      aspectRatio: selectedRatioId,
      createdAt: new Date().toISOString()
    };
    onAddStudioImage(newStudioImage);
    setActiveGalleryImage(newStudioImage);
    setSuccessNotice(`Saved "${presetObj?.name}" to your Studio Gallery!`);
    setTimeout(() => setSuccessNotice(null), 3500);
  };

  // Set current canvas render as campaign primary photo
  const handleSetCurrentAsPrimary = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    onSetAsPrimaryImage(dataUrl);
    setSuccessNotice("Set as primary product photo for your campaign!");
    setTimeout(() => setSuccessNotice(null), 3500);
  };

  // Copy PNG to Clipboard
  const handleCopyImageToClipboard = async () => {
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
      // Ignore if browser permission denied
    }
  };

  // AI-Powered Synthesis Request
  const handleGenerateAI = async () => {
    setIsGeneratingAI(true);
    setErrorMessage(null);
    try {
      const presetObj = STUDIO_PRESETS.find((p) => p.id === selectedPresetId);
      const bgPrompt = customPrompt.trim() || presetObj?.description || 'Modern clean commercial studio background';

      const res = await fetch('/api/generate-studio-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: originalImage,
          prompt: bgPrompt,
          aspectRatio: selectedRatioId,
          preset: selectedPresetId
        })
      });

      const data = await res.json();
      if (data.imageUrl) {
        const newImg: GeneratedStudioImage = {
          id: `ai-img-${Date.now()}`,
          url: data.imageUrl,
          preset: `${presetObj?.name || 'AI'} (Synth)`,
          aspectRatio: selectedRatioId,
          createdAt: new Date().toISOString()
        };
        onAddStudioImage(newImg);
        setActiveGalleryImage(newImg);
        setSuccessNotice("AI Studio shot synthesized successfully!");
        setTimeout(() => setSuccessNotice(null), 3500);
      } else {
        // Fallback: Save local high-res render automatically
        handleSaveToGallery();
      }
    } catch (err: any) {
      // Fallback: Save local high-res render
      handleSaveToGallery();
      setSuccessNotice("High-resolution studio render created & saved!");
      setTimeout(() => setSuccessNotice(null), 3500);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const resetAdjustments = () => {
    setProductScale(100);
    setOffsetY(0);
    setOffsetX(0);
    setShadowIntensity(70);
    setShadowBlur(20);
    setShowReflection(true);
    setReflectionOpacity(35);
    setBrightness(0);
    setContrast(0);
    setWarmth(0);
    setVignette(25);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
            <Camera className="w-5 h-5 text-indigo-600" />
            <span>Product Image Studio & Lighting Compositor</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Render professional podiums, marble pedestals, realistic drop shadows, and reflections from your single product photo.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopyImageToClipboard}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Copy image to clipboard"
          >
            {copiedNotice ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedNotice ? "Copied!" : "Copy Image"}</span>
          </button>

          <button
            onClick={handleSetCurrentAsPrimary}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Use this rendered shot across all marketing channels"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Use in Campaign</span>
          </button>

          <button
            onClick={handleDownloadRenderedPNG}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 flex items-center gap-1.5 shadow-md shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download PNG (HD)</span>
          </button>
        </div>
      </div>

      {/* Notices */}
      {successNotice && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-200 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successNotice}</span>
          </div>
          <button onClick={() => setSuccessNotice(null)} className="font-bold text-emerald-600">✕</button>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 flex items-center justify-between text-xs text-rose-800 dark:text-rose-200">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="font-bold text-rose-600">✕</button>
        </div>
      )}

      {/* Main Studio Workspace: Controls (Left 5 cols) & Canvas Stage (Right 7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Preset Selection & Studio Sliders */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Preset Selector */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-indigo-600" />
                <span>10 Studio Environment Presets</span>
              </label>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                Instant Render
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {STUDIO_PRESETS.map((p) => {
                const isSelected = selectedPresetId === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPresetId(p.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/60 ring-2 ring-indigo-600/20'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold truncate ${isSelected ? 'text-indigo-950 dark:text-indigo-200' : 'text-slate-700 dark:text-slate-300'}`}>
                        {p.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate mt-0.5">
                      {p.category}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Output Aspect Ratio */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Aspect Ratio:
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {ASPECT_RATIOS.map((ar) => (
                  <button
                    key={ar.id}
                    onClick={() => setSelectedRatioId(ar.id)}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedRatioId === ar.id
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span className="text-xs block">{ar.id}</span>
                    <span className="text-[9px] opacity-75 truncate block">{ar.sub.split('/')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Studio Controls (Position, Scale, Shadow, Reflection) */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-indigo-600" />
                <span>Fine-Tuning & Lighting Adjustments</span>
              </span>
              <button
                onClick={resetAdjustments}
                className="text-[10px] font-semibold text-slate-400 hover:text-indigo-600 flex items-center gap-1 cursor-pointer"
                title="Reset all sliders to default"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Product Size Scale */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 mb-1">
                <span>Product Scale</span>
                <span className="font-mono font-bold text-indigo-600">{productScale}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="140"
                value={productScale}
                onChange={(e) => setProductScale(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            {/* Vertical Elevation / Offset Y */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 mb-1">
                <span>Elevation & Table Placement (Y)</span>
                <span className="font-mono font-bold text-slate-600">{offsetY > 0 ? `+${offsetY}` : offsetY}px</span>
              </div>
              <input
                type="range"
                min="-60"
                max="60"
                value={offsetY}
                onChange={(e) => setOffsetY(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            {/* Drop Shadow Intensity */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 mb-1">
                <span>Contact Drop Shadow</span>
                <span className="font-mono font-bold text-slate-600">{shadowIntensity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={shadowIntensity}
                onChange={(e) => setShadowIntensity(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            {/* Reflection Toggle & Opacity */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    checked={showReflection}
                    onChange={(e) => setShowReflection(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Mirror Floor Reflection</span>
                </label>
                {showReflection && (
                  <span className="font-mono text-xs font-bold text-slate-600">{reflectionOpacity}%</span>
                )}
              </div>
              {showReflection && (
                <input
                  type="range"
                  min="5"
                  max="70"
                  value={reflectionOpacity}
                  onChange={(e) => setReflectionOpacity(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              )}
            </div>

            {/* Brightness & Contrast Dual Row */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 mb-1">
                  <span>Brightness</span>
                  <span className="font-mono">{brightness > 0 ? `+${brightness}` : brightness}</span>
                </div>
                <input
                  type="range"
                  min="-30"
                  max="30"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 mb-1">
                  <span>Contrast</span>
                  <span className="font-mono">{contrast > 0 ? `+${contrast}` : contrast}</span>
                </div>
                <input
                  type="range"
                  min="-30"
                  max="30"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </div>

            {/* Warmth & Vignette Dual Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 mb-1">
                  <span>Warmth Tint</span>
                  <span className="font-mono">{warmth > 0 ? `+${warmth}` : warmth}</span>
                </div>
                <input
                  type="range"
                  min="-30"
                  max="30"
                  value={warmth}
                  onChange={(e) => setWarmth(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 mb-1">
                  <span>Vignette</span>
                  <span className="font-mono">{vignette}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="70"
                  value={vignette}
                  onChange={(e) => setVignette(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </div>

          </div>

          {/* AI Cloud Synthesis Trigger */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Save Render or AI Synthesize</span>
              </span>
              <button
                onClick={handleSaveToGallery}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 shadow-2xs hover:bg-slate-50 cursor-pointer"
              >
                + Add to Gallery
              </button>
            </div>

            <input
              type="text"
              placeholder="Custom prompt (e.g. on luxury marble pedestal with soft roses)"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
            />

            <button
              onClick={handleGenerateAI}
              disabled={isGeneratingAI}
              className="w-full py-2.5 px-3 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              {isGeneratingAI ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing Studio Shot...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate AI Studio Variant</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Right Column: Live Interactive Canvas Stage & Comparison (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Main Stage View Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            
            {/* View Mode Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setViewMode('split')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'split'
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  Interactive Split (Before / After)
                </button>
                <button
                  onClick={() => setViewMode('rendered')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'rendered'
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  Full Rendered
                </button>
              </div>

              <div className="text-[11px] font-semibold text-slate-400">
                Preset: <span className="text-indigo-600 font-bold">{STUDIO_PRESETS.find(p => p.id === selectedPresetId)?.name}</span>
              </div>
            </div>

            {/* Interactive Canvas Stage */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden select-none bg-slate-950 border border-slate-800 flex items-center justify-center">
              
              {/* Canvas Renderer (ALWAYS active and updated in real-time) */}
              <canvas
                ref={canvasRef}
                className="w-full h-full object-contain"
              />

              {/* If Split mode is active, overlay original image on left side */}
              {viewMode === 'split' && (
                <div
                  className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-white shadow-2xl transition-none"
                  style={{ width: `${compareSliderPosition}%` }}
                >
                  <img
                    src={originalImage}
                    alt="Original Upload"
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover max-w-none"
                    style={{ width: '100%', height: '100%' }}
                  />
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-xs shadow-xs">
                    Original Photo
                  </span>
                </div>
              )}

              {/* Rendered Badge on top right */}
              <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-indigo-600/90 text-white backdrop-blur-xs shadow-xs">
                Studio HD
              </span>

              {/* Draggable Split Slider Handle in Split Mode */}
              {viewMode === 'split' && (
                <div className="absolute inset-x-0 bottom-4 mx-auto w-3/4 flex items-center justify-center">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={compareSliderPosition}
                    onChange={(e) => setCompareSliderPosition(Number(e.target.value))}
                    className="w-full h-2 bg-white/40 rounded-lg appearance-none cursor-ew-resize accent-white"
                  />
                </div>
              )}

            </div>

            <p className="text-[11px] text-slate-400 text-center">
              Drag sliders on the left to customize shadows, reflections, and position. Click "Download PNG" above to save full 1080p resolution.
            </p>

          </div>

          {/* Generated Studio Gallery */}
          {studioImages && studioImages.length > 0 && (
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Studio Gallery Variants ({studioImages.length})
                </span>
                <span className="text-[10px] text-slate-400">
                  Click any variant to preview or use
                </span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                {studioImages.map((img) => (
                  <div
                    key={img.id}
                    onClick={() => setActiveGalleryImage(img)}
                    className={`group relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                      activeGalleryImage?.id === img.id
                        ? 'border-indigo-600 ring-2 ring-indigo-600/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-400'
                    }`}
                  >
                    <img
                      src={img.url || img.imageUrl}
                      alt={img.preset}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSetAsPrimaryImage(img.url || img.imageUrl || '');
                          setSuccessNotice("Set as primary campaign image!");
                          setTimeout(() => setSuccessNotice(null), 3500);
                        }}
                        title="Use in Campaign"
                        className="p-1 rounded-md bg-white text-indigo-600 hover:bg-slate-100 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteStudioImage(img.id);
                        }}
                        title="Delete Variant"
                        className="p-1 rounded-md bg-white text-rose-600 hover:bg-slate-100 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
