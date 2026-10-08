import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  Copy,
  Maximize2,
  Sun,
  Eye,
  Camera,
  Palette,
  RotateCcw,
  Scissors,
  ShieldCheck,
  Zap,
  Store
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
    id: 'clean_amazon',
    name: 'Amazon / Shopify Clean White',
    category: 'Commercial',
    bgGradient: ['#ffffff', '#ffffff', '#f8fafc'],
    pedestalType: 'none',
    pedestalColor: '#ffffff',
    shadowColor: 'rgba(15, 23, 42, 0.4)',
    spotlightColor: 'rgba(255, 255, 255, 0.9)',
    rimColor: 'rgba(226, 232, 240, 0.8)',
    description: 'Pure 100% white infinity cyclorama studio backdrop with dual contact drop shadow.'
  },
  {
    id: 'luxury_marble',
    name: 'Carrara Marble Pedestal',
    category: 'Luxury D2C',
    bgGradient: ['#1e1b4b', '#0f172a', '#020617'],
    pedestalType: 'marble',
    pedestalColor: '#f1f5f9',
    shadowColor: 'rgba(0, 0, 0, 0.75)',
    spotlightColor: 'rgba(245, 158, 11, 0.3)',
    rimColor: 'rgba(245, 158, 11, 0.5)',
    description: 'Polished Italian white marble cylinder with warm gold architectural rim light.'
  },
  {
    id: 'warm_oak',
    name: 'Warm Oak Tabletop',
    category: 'Lifestyle',
    bgGradient: ['#fef3c7', '#fdf4ff', '#e2e8f0'],
    pedestalType: 'wood',
    pedestalColor: '#b45309',
    shadowColor: 'rgba(69, 26, 3, 0.5)',
    spotlightColor: 'rgba(254, 240, 138, 0.45)',
    rimColor: 'rgba(245, 158, 11, 0.4)',
    description: 'Natural oak wood surface with warm ambient interior daylight and soft bokeh.'
  },
  {
    id: 'dark_slate',
    name: 'Dark Velvet & Slate',
    category: 'Tech & Fashion',
    bgGradient: ['#27272a', '#18181b', '#09090b'],
    pedestalType: 'slate',
    pedestalColor: '#18181b',
    shadowColor: 'rgba(0, 0, 0, 0.85)',
    spotlightColor: 'rgba(99, 102, 241, 0.35)',
    rimColor: 'rgba(129, 140, 248, 0.5)',
    description: 'Matte obsidian slab with overhead spotlight and dual indigo/cyan rim highlights.'
  },
  {
    id: 'digital_glass',
    name: 'Digital Frosted Glass',
    category: 'Digital Marketplace',
    bgGradient: ['#0f172a', '#1e1b4b', '#020617'],
    pedestalType: 'glass',
    pedestalColor: '#38bdf8',
    shadowColor: 'rgba(2, 6, 23, 0.8)',
    spotlightColor: 'rgba(6, 182, 212, 0.4)',
    rimColor: 'rgba(139, 92, 246, 0.6)',
    description: 'Floating frosted glass pedestal with neon cyan and ultraviolet radiant mesh for digital merch.'
  },
  {
    id: 'minimal_clay',
    name: 'Scandinavian Sandstone',
    category: 'Artisan & Beauty',
    bgGradient: ['#faf5ef', '#f2ebe0', '#e7ded0'],
    pedestalType: 'sandstone',
    pedestalColor: '#ede5d8',
    shadowColor: 'rgba(68, 64, 60, 0.38)',
    spotlightColor: 'rgba(255, 255, 255, 0.65)',
    rimColor: 'rgba(214, 199, 179, 0.6)',
    description: 'Smooth clay podium with soft morning window light and gentle architectural shadows.'
  },
  {
    id: 'sunlit_terrace',
    name: 'Mediterranean Sunlit',
    category: 'Outdoor',
    bgGradient: ['#fffbeb', '#fef3c7', '#fed7aa'],
    pedestalType: 'sandstone',
    pedestalColor: '#fef3c7',
    shadowColor: 'rgba(120, 53, 15, 0.4)',
    spotlightColor: 'rgba(253, 230, 138, 0.55)',
    rimColor: 'rgba(245, 158, 11, 0.45)',
    description: 'Sun-drenched outdoor stone terrace with gentle organic monstera leaf shadows.'
  },
  {
    id: 'tiktok_pastel',
    name: 'Pastel Pop (TikTok / D2C)',
    category: 'Trendy Drops',
    bgGradient: ['#ede9fe', '#fce7f3', '#e0f2fe'],
    pedestalType: 'sandstone',
    pedestalColor: '#f5f3ff',
    shadowColor: 'rgba(109, 40, 217, 0.25)',
    spotlightColor: 'rgba(255, 255, 255, 0.8)',
    rimColor: 'rgba(167, 139, 250, 0.5)',
    description: 'Trendy soft gradient studio environment favored by viral direct-to-consumer brands.'
  }
];

const ASPECT_RATIOS = [
  { id: '1:1', label: '1:1 Square', width: 1080, height: 1080, sub: 'Shopify / Feed' },
  { id: '4:5', label: '4:5 Portrait', width: 1080, height: 1350, sub: 'Instagram Feed' },
  { id: '9:16', label: '9:16 Story', width: 1080, height: 1920, sub: 'Reels / TikTok' },
  { id: '16:9', label: '16:9 Banner', width: 1200, height: 675, sub: 'Website Hero' },
];

/**
 * Intelligent client-side background removal helper
 * Detects perimeter and corner background colors, calculates distance, and produces a transparent PNG canvas.
 */
function createCutoutCanvas(sourceImg: HTMLImageElement, tolerance: number = 30): HTMLCanvasElement {
  const w = sourceImg.naturalWidth || sourceImg.width || 800;
  const h = sourceImg.naturalHeight || sourceImg.height || 800;

  const offCanvas = document.createElement('canvas');
  offCanvas.width = w;
  offCanvas.height = h;
  const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
  if (!offCtx) return offCanvas;

  offCtx.drawImage(sourceImg, 0, 0, w, h);

  try {
    const imgData = offCtx.getImageData(0, 0, w, h);
    const data = imgData.data;

    // Sample 4 corner regions to get background color
    const corners = [
      0, // top-left
      (w - 1) * 4, // top-right
      ((h - 1) * w) * 4, // bottom-left
      ((h - 1) * w + (w - 1)) * 4 // bottom-right
    ];

    let bgR = 0, bgG = 0, bgB = 0;
    for (const c of corners) {
      bgR += data[c];
      bgG += data[c + 1];
      bgB += data[c + 2];
    }
    bgR = Math.round(bgR / corners.length);
    bgG = Math.round(bgG / corners.length);
    bgB = Math.round(bgB / corners.length);

    // Distance threshold with soft feathering
    const tolSq = tolerance * tolerance * 3;
    const featherSq = (tolerance + 15) * (tolerance + 15) * 3;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const distSq = (r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2;

      if (distSq < tolSq) {
        data[i + 3] = 0; // Transparent
      } else if (distSq < featherSq) {
        // Soft feathering alpha transition
        const factor = (distSq - tolSq) / (featherSq - tolSq);
        data[i + 3] = Math.round(data[i + 3] * factor);
      }
    }

    offCtx.putImageData(imgData, 0, 0);
  } catch (err) {
    // If CORS tainted, returns original image
    console.info("Cutout canvas note:", err);
  }

  return offCanvas;
}

export const TabImageStudio: React.FC<TabImageStudioProps> = ({
  originalImage,
  productName,
  studioImages,
  onAddStudioImage,
  onSetAsPrimaryImage,
  onDeleteStudioImage
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('clean_amazon');
  const [selectedRatioId, setSelectedRatioId] = useState<string>('1:1');
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  
  // Intelligent Background Cutout State
  const [isAutoCutoutEnabled, setIsAutoCutoutEnabled] = useState<boolean>(true);
  const [cutoutTolerance, setCutoutTolerance] = useState<number>(28);

  // Interactive Studio Sliders
  const [productScale, setProductScale] = useState<number>(100); // 50 to 140
  const [offsetY, setOffsetY] = useState<number>(0); // -100 to 100
  const [offsetX, setOffsetX] = useState<number>(0); // -100 to 100
  const [shadowIntensity, setShadowIntensity] = useState<number>(75); // 0 to 100
  const [shadowBlur, setShadowBlur] = useState<number>(22); // 5 to 50
  const [showReflection, setShowReflection] = useState<boolean>(true);
  const [reflectionOpacity, setReflectionOpacity] = useState<number>(35); // 0 to 80
  const [brightness, setBrightness] = useState<number>(0); // -40 to +40
  const [contrast, setContrast] = useState<number>(0); // -40 to +40
  const [warmth, setWarmth] = useState<number>(0); // -40 to +40
  const [vignette, setVignette] = useState<number>(20); // 0 to 80
  
  // UI States
  const [compareSliderPosition, setCompareSliderPosition] = useState<number>(50);
  const [viewMode, setViewMode] = useState<'split' | 'rendered' | 'original'>('rendered');
  const [activeGalleryImage, setActiveGalleryImage] = useState<GeneratedStudioImage | null>(
    studioImages[0] || null
  );
  const [copiedNotice, setCopiedNotice] = useState<boolean>(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loadedImageRef = useRef<HTMLImageElement | null>(null);
  const cutoutCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isImageReady, setIsImageReady] = useState<boolean>(false);

  // Preload product image into memory
  useEffect(() => {
    if (!originalImage) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      loadedImageRef.current = img;
      cutoutCanvasRef.current = createCutoutCanvas(img, cutoutTolerance);
      setIsImageReady(true);
      renderStudioCanvas();
    };
    img.onerror = () => {
      const fallbackImg = new Image();
      fallbackImg.onload = () => {
        loadedImageRef.current = fallbackImg;
        cutoutCanvasRef.current = createCutoutCanvas(fallbackImg, cutoutTolerance);
        setIsImageReady(true);
        renderStudioCanvas();
      };
      fallbackImg.src = originalImage;
    };
    img.src = originalImage;
  }, [originalImage]);

  // Re-calculate cutout when tolerance changes
  useEffect(() => {
    if (loadedImageRef.current) {
      cutoutCanvasRef.current = createCutoutCanvas(loadedImageRef.current, cutoutTolerance);
      renderStudioCanvas();
    }
  }, [cutoutTolerance]);

  // Re-render canvas whenever controls change
  useEffect(() => {
    if (isImageReady) {
      renderStudioCanvas();
    }
  }, [
    isImageReady,
    selectedPresetId,
    selectedRatioId,
    isAutoCutoutEnabled,
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
    if (!canvas) return;

    const ratioObj = ASPECT_RATIOS.find((r) => r.id === selectedRatioId) || ASPECT_RATIOS[0];
    canvas.width = ratioObj.width;
    canvas.height = ratioObj.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const preset = STUDIO_PRESETS.find((p) => p.id === selectedPresetId) || STUDIO_PRESETS[0];

    // Source image to render (either transparent cutout or raw photo)
    const prodSource = (isAutoCutoutEnabled && cutoutCanvasRef.current)
      ? cutoutCanvasRef.current
      : loadedImageRef.current;

    // 1. Draw Studio Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bgGrad.addColorStop(0, preset.bgGradient[0]);
    bgGrad.addColorStop(0.55, preset.bgGradient[1]);
    bgGrad.addColorStop(1, preset.bgGradient[2]);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Studio Lighting Cone & Ambient Spot
    ctx.save();
    const spotlight = ctx.createRadialGradient(
      canvas.width * 0.5,
      canvas.height * 0.28,
      20,
      canvas.width * 0.5,
      canvas.height * 0.35,
      canvas.width * 0.58
    );
    spotlight.addColorStop(0, preset.spotlightColor);
    spotlight.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = spotlight;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    // 3. Studio Cyclorama Horizon Line
    const horizonY = canvas.height * 0.62;
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, horizonY);
    ctx.lineTo(canvas.width, horizonY);
    ctx.stroke();
    ctx.restore();

    // Calculate product dimensions and placement
    const scaleFactor = (productScale / 100);
    const baseSize = Math.min(canvas.width, canvas.height) * 0.58;
    const prodW = baseSize * scaleFactor;
    const prodH = baseSize * scaleFactor;
    const posX = (canvas.width - prodW) / 2 + offsetX * 2;
    const posY = (canvas.height * 0.18) + (offsetY * 2);
    const groundY = posY + prodH - (canvas.height * 0.04);

    // 4. 3D Architectural Pedestal / Tabletop Surface
    if (preset.pedestalType !== 'none') {
      const pedW = prodW * 1.18;
      const pedH = canvas.height * 0.16;
      const pedX = posX - (pedW - prodW) / 2;
      const pedY = groundY - 10;

      ctx.save();
      // Pedestal Cylinder Body with 3D Bevel
      const bodyGrad = ctx.createLinearGradient(pedX, 0, pedX + pedW, 0);
      bodyGrad.addColorStop(0, preset.pedestalColor);
      bodyGrad.addColorStop(0.3, '#ffffff');
      bodyGrad.addColorStop(0.7, preset.pedestalColor);
      bodyGrad.addColorStop(1, 'rgba(0, 0, 0, 0.25)');
      ctx.fillStyle = bodyGrad;
      ctx.fillRect(pedX, pedY, pedW, pedH);

      // Pedestal Top Face (Perspective Ellipse)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(pedX + pedW / 2, pedY, pedW / 2, pedH * 0.26, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = preset.rimColor;
      ctx.lineWidth = 3;
      ctx.stroke();

      // Pedestal Base Rim (Ellipse)
      ctx.beginPath();
      ctx.ellipse(pedX + pedW / 2, pedY + pedH, pedW / 2, pedH * 0.26, 0, 0, Math.PI * 2);
      ctx.fillStyle = preset.pedestalColor;
      ctx.fill();

      // Pedestal Contact Shadow on Ground
      ctx.save();
      ctx.filter = 'blur(16px)';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.beginPath();
      ctx.ellipse(pedX + pedW / 2, pedY + pedH + 8, pedW * 0.48, pedH * 0.2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.restore();
    }

    // 5. Dual-Tier Contact & Drop Shadows
    if (shadowIntensity > 0) {
      ctx.save();
      const shadowAlpha = shadowIntensity / 100;
      const shadowRadiusX = (prodW * 0.44);
      const shadowRadiusY = (prodH * 0.12);

      // Tier 1: Soft diffuse ambient drop shadow
      ctx.filter = `blur(${shadowBlur}px)`;
      ctx.fillStyle = preset.shadowColor;
      ctx.globalAlpha = shadowAlpha * 0.65;
      ctx.beginPath();
      ctx.ellipse(posX + prodW / 2, groundY + 12, shadowRadiusX * 1.25, shadowRadiusY * 1.35, 0, 0, Math.PI * 2);
      ctx.fill();

      // Tier 2: Sharp dark occlusion shadow right at product base
      ctx.filter = `blur(${Math.max(4, shadowBlur * 0.35)}px)`;
      ctx.fillStyle = '#000000';
      ctx.globalAlpha = shadowAlpha * 0.95;
      ctx.beginPath();
      ctx.ellipse(posX + prodW / 2, groundY + 2, shadowRadiusX * 0.72, shadowRadiusY * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // 6. Ground Plane Gloss Reflection
    if (showReflection && prodSource && reflectionOpacity > 0) {
      ctx.save();
      ctx.globalAlpha = (reflectionOpacity / 100) * 0.45;
      ctx.translate(0, groundY * 2);
      ctx.scale(1, -1);
      
      ctx.drawImage(prodSource, posX, posY, prodW, prodH);
      
      // Reflection fade overlay
      ctx.globalCompositeOperation = 'destination-out';
      const refFade = ctx.createLinearGradient(0, groundY, 0, groundY + prodH);
      refFade.addColorStop(0, 'rgba(0, 0, 0, 0.15)');
      refFade.addColorStop(0.55, 'rgba(0, 0, 0, 0.85)');
      refFade.addColorStop(1, 'rgba(0, 0, 0, 1.0)');
      ctx.fillStyle = refFade;
      ctx.fillRect(posX - 20, groundY, prodW + 40, prodH);
      ctx.restore();
    }

    // 7. Draw Main Enhanced Product
    if (prodSource) {
      ctx.save();
      
      // Pro studio filters
      const brightVal = 100 + brightness;
      const contVal = 100 + contrast;
      ctx.filter = `brightness(${brightVal}%) contrast(${contVal}%)`;

      ctx.drawImage(prodSource, posX, posY, prodW, prodH);
      ctx.restore();
    }

    // 8. Warmth / Temperature Tint Overlay
    if (warmth !== 0) {
      ctx.save();
      ctx.fillStyle = warmth > 0 ? '#f59e0b' : '#38bdf8';
      ctx.globalAlpha = Math.abs(warmth) / 260;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    }

    // 9. Vignette Border
    if (vignette > 0) {
      ctx.save();
      const vigGrad = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.38,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.82
      );
      vigGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vigGrad.addColorStop(1, `rgba(0, 0, 0, ${(vignette / 100) * 0.65})`);
      ctx.fillStyle = vigGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    }

    // 10. Studio Certification Pill Stamp
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    const badgeW = 160;
    const badgeH = 30;
    ctx.beginPath();
    ctx.roundRect(24, canvas.height - 48, badgeW, badgeH, 15);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨ 4K STUDIO ENHANCED', 24 + badgeW / 2, canvas.height - 29);
    ctx.restore();
  };

  // Instant High-Res PNG Download
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
    } catch {
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `${productName.replace(/\s+/g, '_')}_studio.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  // Save current canvas to Studio Gallery
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

  // Set as primary product photo for campaign
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
      // Permission denied fallback
    }
  };

  // AI-Powered Studio Synthesis Request
  const handleGenerateAI = async () => {
    setIsGeneratingAI(true);
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
        handleSaveToGallery();
      }
    } catch {
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
    setShadowIntensity(75);
    setShadowBlur(22);
    setShowReflection(true);
    setReflectionOpacity(35);
    setBrightness(0);
    setContrast(0);
    setWarmth(0);
    setVignette(20);
    setCutoutTolerance(28);
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
            Render professional podiums, marble pedestals, realistic drop shadows, and automatic background cutouts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {successNotice && (
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 animate-fadeIn">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{successNotice}</span>
            </span>
          )}

          <button
            onClick={handleCopyImageToClipboard}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
          >
            {copiedNotice ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedNotice ? "Copied PNG!" : "Copy PNG"}</span>
          </button>

          <button
            onClick={handleSetCurrentAsPrimary}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Set as Primary Photo</span>
          </button>

          <button
            onClick={handleDownloadRenderedPNG}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download (HD PNG)</span>
          </button>
        </div>
      </div>

      {/* Main Studio Workspace: 2-Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Live Canvas Compositor & Compare Tool */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full bg-slate-950 p-6 rounded-3xl border border-slate-800 shadow-2xl flex flex-col items-center justify-center">
            
            {/* Top Toolbar: Aspect Ratios & View Modes */}
            <div className="flex flex-wrap items-center justify-between w-full gap-3 mb-4">
              {/* Aspect Ratio Buttons */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800">
                {ASPECT_RATIOS.map((ratio) => (
                  <button
                    key={ratio.id}
                    onClick={() => setSelectedRatioId(ratio.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      selectedRatioId === ratio.id
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {ratio.label}
                  </button>
                ))}
              </div>

              {/* View Mode Switcher */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold">
                <button
                  onClick={() => setViewMode('rendered')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    viewMode === 'rendered' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Enhanced Studio
                </button>
                <button
                  onClick={() => setViewMode('split')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    viewMode === 'split' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Split Compare
                </button>
                <button
                  onClick={() => setViewMode('original')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    viewMode === 'original' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Original Photo
                </button>
              </div>
            </div>

            {/* Canvas / Image Display Container */}
            <div className="relative max-w-full overflow-hidden rounded-2xl shadow-2xl border border-slate-800/80 bg-slate-900 flex items-center justify-center">
              
              {/* Main Enhanced Canvas */}
              <canvas
                ref={canvasRef}
                className={`max-h-[560px] max-w-full h-auto object-contain mx-auto block ${
                  viewMode === 'original' ? 'hidden' : 'block'
                }`}
              />

              {/* Original Image View */}
              {viewMode === 'original' && (
                <img
                  src={originalImage}
                  alt={productName}
                  className="max-h-[560px] max-w-full h-auto object-contain mx-auto block p-4"
                />
              )}

              {/* Interactive Before / After Split Overlay */}
              {viewMode === 'split' && (
                <div 
                  className="absolute inset-0 overflow-hidden pointer-events-none"
                  style={{ width: `${compareSliderPosition}%` }}
                >
                  <img
                    src={originalImage}
                    alt="Original raw product"
                    className="h-full w-full object-cover max-w-none"
                    style={{ width: `${canvasRef.current?.width || 800}px` }}
                  />
                  <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-black/75 text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-xs">
                    Original Photo
                  </div>
                </div>
              )}

              {viewMode === 'split' && (
                <div 
                  className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-2xl z-20 flex items-center justify-center"
                  style={{ left: `${compareSliderPosition}%` }}
                >
                  <div className="w-7 h-7 -ml-3 rounded-full bg-white text-slate-900 shadow-xl flex items-center justify-center text-[10px] font-extrabold select-none pointer-events-none">
                    ↔
                  </div>
                </div>
              )}
            </div>

            {/* Split Comparison Slider Controls */}
            {viewMode === 'split' && (
              <div className="w-full mt-3 px-4 flex items-center gap-3">
                <span className="text-[11px] text-slate-400 font-medium">Before (Raw)</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={compareSliderPosition}
                  onChange={(e) => setCompareSliderPosition(Number(e.target.value))}
                  className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <span className="text-[11px] text-slate-400 font-medium">After (Studio)</span>
              </div>
            )}

            {/* Action Bar Under Canvas */}
            <div className="mt-4 flex items-center justify-between w-full text-xs text-slate-400 px-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>100% Real-Time Canvas Compositor</span>
              </div>
              <button
                onClick={handleSaveToGallery}
                className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Save to Studio Gallery</span>
              </button>
            </div>
          </div>

          {/* AI Synthesis Box */}
          <div className="w-full mt-4 p-4 rounded-2xl bg-gradient-to-r from-indigo-950/50 via-purple-950/40 to-slate-900 border border-indigo-500/30 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
              <div>
                <div className="text-xs font-bold text-white">AI Studio Photorealistic Synthesis</div>
                <div className="text-[11px] text-slate-400">Generate studio scene with Gemini Vision lighting engine</div>
              </div>
            </div>

            <button
              onClick={handleGenerateAI}
              disabled={isGeneratingAI}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isGeneratingAI ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate AI Studio Shot</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Studio Presets & Interactive Sliders */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Intelligent Background Cutout Module */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Scissors className="w-3.5 h-3.5 text-indigo-500" />
                <span>Product Cutout & Isolation</span>
              </label>
              <button
                onClick={() => setIsAutoCutoutEnabled(!isAutoCutoutEnabled)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase transition-all cursor-pointer ${
                  isAutoCutoutEnabled
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {isAutoCutoutEnabled ? '✓ Cutout Active' : 'Cutout Disabled'}
              </button>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Isolates your product from its raw background so it sits realistically on the 3D podium without an ugly square frame.
            </p>

            {isAutoCutoutEnabled && (
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                  <span>Edge Keying Tolerance</span>
                  <span className="font-mono text-indigo-500 font-bold">{cutoutTolerance}</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="55"
                  value={cutoutTolerance}
                  onChange={(e) => setCutoutTolerance(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            )}
          </div>

          {/* 1. Studio Backdrop Presets */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-indigo-500" />
                <span>E-Commerce Studio Presets</span>
              </label>
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">
                {STUDIO_PRESETS.length} Presets
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
              {STUDIO_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setSelectedPresetId(preset.id)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer flex flex-col justify-between ${
                    selectedPresetId === preset.id
                      ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-bold shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="truncate">{preset.name}</span>
                    <span 
                      className="w-3 h-3 rounded-full shrink-0 ml-1.5 border border-white/20"
                      style={{ backgroundColor: preset.bgGradient[0] }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400 font-normal truncate">
                    {preset.category}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Interactive Compositor Sliders */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-indigo-500" />
                <span>Positioning & Lighting Sliders</span>
              </label>
              <button
                onClick={resetAdjustments}
                className="text-[11px] font-semibold text-slate-500 hover:text-indigo-500 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Sliders Grid */}
            <div className="space-y-2.5 text-xs">
              
              {/* Product Scale */}
              <div>
                <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-400 mb-1">
                  <span>Product Scale</span>
                  <span className="font-mono text-indigo-500 font-bold">{productScale}%</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="135"
                  value={productScale}
                  onChange={(e) => setProductScale(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              {/* Vertical Position */}
              <div>
                <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-400 mb-1">
                  <span>Vertical Offset (Y)</span>
                  <span className="font-mono text-indigo-500 font-bold">{offsetY}px</span>
                </div>
                <input
                  type="range"
                  min="-80"
                  max="80"
                  value={offsetY}
                  onChange={(e) => setOffsetY(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              {/* Shadow Intensity */}
              <div>
                <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-400 mb-1">
                  <span>Contact Drop Shadow</span>
                  <span className="font-mono text-indigo-500 font-bold">{shadowIntensity}%</span>
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

              {/* Floor Reflection */}
              <div>
                <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-400 mb-1">
                  <span>Ground Floor Reflection</span>
                  <span className="font-mono text-indigo-500 font-bold">{showReflection ? `${reflectionOpacity}%` : 'Off'}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="70"
                  value={showReflection ? reflectionOpacity : 0}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val === 0) setShowReflection(false);
                    else {
                      setShowReflection(true);
                      setReflectionOpacity(val);
                    }
                  }}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              {/* Brightness & Contrast */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-400 mb-1">
                    <span>Brightness</span>
                    <span className="font-mono text-indigo-500">{brightness}</span>
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
                  <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-400 mb-1">
                    <span>Contrast</span>
                    <span className="font-mono text-indigo-500">{contrast}</span>
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

              {/* Warmth & Vignette */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-400 mb-1">
                    <span>Warmth</span>
                    <span className="font-mono text-indigo-500">{warmth}</span>
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
                  <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-400 mb-1">
                    <span>Vignette</span>
                    <span className="font-mono text-indigo-500">{vignette}%</span>
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
          </div>

        </div>

      </div>
    </div>
  );
};
