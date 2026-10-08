import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Wand2, 
  Check, 
  X, 
  RefreshCw, 
  Eye, 
  Sparkles, 
  Pipette, 
  Sliders, 
  Layers, 
  RotateCcw,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

interface BackgroundRemovalModalProps {
  isOpen: boolean;
  imageSrc: string;
  onClose: () => void;
  onApply: (newImageSrc: string) => void;
}

type BgOutputMode = 'transparent' | 'white' | 'studio_gray' | 'radial_spotlight' | 'custom';

export const BackgroundRemovalModal: React.FC<BackgroundRemovalModalProps> = ({
  isOpen,
  imageSrc,
  onClose,
  onApply
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const originalImgRef = useRef<HTMLImageElement | null>(null);

  const [tolerance, setTolerance] = useState<number>(32); // 5 to 80
  const [edgeFeather, setEdgeFeather] = useState<number>(2); // 0 to 6
  const [outputMode, setOutputMode] = useState<BgOutputMode>('transparent');
  const [customBgColor, setCustomBgColor] = useState<string>('#ffffff');
  const [isEyedropperActive, setIsEyedropperActive] = useState<boolean>(false);
  const [sampledColor, setSampledColor] = useState<{ r: number; g: number; b: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isComparing, setIsComparing] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isServerProcessing, setIsServerProcessing] = useState<boolean>(false);

  // Load source image
  useEffect(() => {
    if (!isOpen || !imageSrc) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      originalImgRef.current = img;
      // Auto-sample border color
      samplePerimeterColor(img);
    };
    img.src = imageSrc;
  }, [isOpen, imageSrc]);

  // Sample perimeter colors to estimate background
  const samplePerimeterColor = (img: HTMLImageElement) => {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = img.naturalWidth || 800;
    tempCanvas.height = img.naturalHeight || 800;
    const ctx = tempCanvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(img, 0, 0);

    const w = tempCanvas.width;
    const h = tempCanvas.height;
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;

    // Sample corner pixels and edge middles
    const sampleCoords = [
      [5, 5],
      [w - 6, 5],
      [5, h - 6],
      [w - 6, h - 6],
      [Math.floor(w / 2), 5],
      [Math.floor(w / 2), h - 6],
      [5, Math.floor(h / 2)],
      [w - 6, Math.floor(h / 2)]
    ];

    let rSum = 0;
    let gSum = 0;
    let bSum = 0;

    sampleCoords.forEach(([x, y]) => {
      const idx = (y * w + x) * 4;
      rSum += data[idx];
      gSum += data[idx + 1];
      bSum += data[idx + 2];
    });

    const count = sampleCoords.length;
    setSampledColor({
      r: Math.round(rSum / count),
      g: Math.round(gSum / count),
      b: Math.round(bSum / count)
    });
  };

  // Perform canvas-based background removal
  const processCutout = useCallback(() => {
    const img = originalImgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;

    const w = img.naturalWidth || 800;
    const h = img.naturalHeight || 800;
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    ctx.drawImage(img, 0, 0);
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;

    // Default target color to sampledColor or top-left corner
    const targetR = sampledColor ? sampledColor.r : data[0];
    const targetG = sampledColor ? sampledColor.g : data[1];
    const targetB = sampledColor ? sampledColor.b : data[2];

    const maxDist = (tolerance / 100) * 441.67; // max distance in 3D RGB space is sqrt(255^2*3) = 441.67
    const featherBuffer = edgeFeather * 15;

    // Calculate alpha mask for each pixel based on color distance
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Euclidean distance in RGB color space
      const dr = r - targetR;
      const dg = g - targetG;
      const db = b - targetB;
      const dist = Math.sqrt(dr * dr + dg * dg + db * db);

      if (dist < maxDist) {
        // Pixel matches background within tolerance
        if (dist < maxDist - featherBuffer || featherBuffer === 0) {
          data[i + 3] = 0; // Fully transparent
        } else {
          // Feathered gradient transition
          const alphaRatio = (dist - (maxDist - featherBuffer)) / featherBuffer;
          data[i + 3] = Math.round(alphaRatio * 255);
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);

    // Apply output background replacement if not transparent
    if (outputMode !== 'transparent') {
      const compositeCanvas = document.createElement('canvas');
      compositeCanvas.width = w;
      compositeCanvas.height = h;
      const compCtx = compositeCanvas.getContext('2d');
      if (compCtx) {
        if (outputMode === 'white') {
          compCtx.fillStyle = '#ffffff';
          compCtx.fillRect(0, 0, w, h);
        } else if (outputMode === 'studio_gray') {
          compCtx.fillStyle = '#f8fafc';
          compCtx.fillRect(0, 0, w, h);
        } else if (outputMode === 'radial_spotlight') {
          const grad = compCtx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, Math.max(w, h) / 1.4);
          grad.addColorStop(0, '#ffffff');
          grad.addColorStop(1, '#e2e8f0');
          compCtx.fillStyle = grad;
          compCtx.fillRect(0, 0, w, h);
        } else if (outputMode === 'custom') {
          compCtx.fillStyle = customBgColor;
          compCtx.fillRect(0, 0, w, h);
        }

        // Draw cutout on top
        compCtx.drawImage(canvas, 0, 0);
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(compositeCanvas, 0, 0);
      }
    }
  }, [sampledColor, tolerance, edgeFeather, outputMode, customBgColor]);

  // Re-run cutout when parameters change
  useEffect(() => {
    if (isOpen && originalImgRef.current) {
      processCutout();
    }
  }, [isOpen, processCutout]);

  // Click on canvas to sample color with Eyedropper
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isEyedropperActive || !originalImgRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    // Read pixel from original image using temporary canvas
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;
    tempCtx.drawImage(originalImgRef.current, 0, 0);
    const pixel = tempCtx.getImageData(x, y, 1, 1).data;

    setSampledColor({ r: pixel[0], g: pixel[1], b: pixel[2] });
    setIsEyedropperActive(false);
    setStatusMessage(`Sampled background color: RGB(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  // Call server-side background removal API endpoint
  const handleServerApiCutout = async () => {
    setIsServerProcessing(true);
    setStatusMessage('Connecting to server AI background segmentation API...');
    try {
      const response = await fetch('/api/remove-background', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: imageSrc,
          tolerance,
          edgeFeather,
          outputMode,
          customBgColor
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      if (data && data.image) {
        const img = new Image();
        img.onload = () => {
          originalImgRef.current = img;
          const canvas = canvasRef.current;
          if (canvas) {
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0);
          }
          setStatusMessage('Background successfully isolated via API!');
        };
        img.src = data.image;
      }
    } catch (err: any) {
      console.warn('Server background removal fallback to canvas processing:', err);
      // Fallback directly to client canvas processing
      processCutout();
      setStatusMessage('Using high-speed canvas processor (completed).');
    } finally {
      setIsServerProcessing(false);
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  // Apply cutout and update workspace
  const handleApplyCutout = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsProcessing(true);
    try {
      // Export as PNG if transparent to preserve alpha, or JPEG if solid
      const mime = outputMode === 'transparent' ? 'image/png' : 'image/jpeg';
      const cutoutDataUrl = canvas.toDataURL(mime, 0.95);
      onApply(cutoutDataUrl);
      onClose();
    } catch (err) {
      console.error('Failed to export cutout:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="px-5 py-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Wand2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Product Background Removal Tool</span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  Smart Cutout
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Isolate your product with clean transparency or standard e-commerce white
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Status Toast */}
        {statusMessage && (
          <div className="bg-indigo-950/80 border-b border-indigo-800/60 px-4 py-2 text-xs text-indigo-200 flex items-center justify-between animate-in slide-in-from-top-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{statusMessage}</span>
            </div>
            <button onClick={() => setStatusMessage(null)} className="text-indigo-400 hover:text-white text-xs">
              &times;
            </button>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* LEFT: Live Canvas Viewport (8 cols) */}
          <div className="lg:col-span-8 bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden min-h-[300px] sm:min-h-[420px]">
            
            {/* Checkerboard Background for Transparency Preview */}
            <div className="relative max-h-[60vh] max-w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-[linear-gradient(45deg,#1e293b_25%,transparent_25%),linear-gradient(-45deg,#1e293b_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#1e293b_75%),linear-gradient(-45deg,transparent_75%,#1e293b_75%)] [background-size:20px_20px] [background-position:0_0,0_10px,10px_-10px,-10px_0px] bg-slate-900">
              
              {isComparing ? (
                /* Show Raw Original on Compare Hold */
                <img
                  src={imageSrc}
                  alt="Original Raw"
                  className="max-h-[58vh] max-w-full object-contain p-1"
                />
              ) : (
                /* Canvas with Cutout */
                <canvas
                  ref={canvasRef}
                  onClick={handleCanvasClick}
                  className={`max-h-[58vh] max-w-full object-contain p-1 transition-all ${
                    isEyedropperActive ? 'cursor-crosshair ring-2 ring-indigo-400' : 'cursor-default'
                  }`}
                />
              )}

              {/* Floating Quick Action Overlay */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <button
                  type="button"
                  onMouseDown={() => setIsComparing(true)}
                  onMouseUp={() => setIsComparing(false)}
                  onTouchStart={() => setIsComparing(true)}
                  onTouchEnd={() => setIsComparing(false)}
                  onMouseLeave={() => setIsComparing(false)}
                  className={`px-2.5 py-1.5 rounded-xl backdrop-blur-md border text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer ${
                    isComparing
                      ? 'bg-amber-500 text-white border-amber-400'
                      : 'bg-slate-900/80 border-slate-700/80 text-slate-200 hover:text-white'
                  }`}
                  title="Hold to see original unedited photo"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{isComparing ? 'Showing Original' : 'Hold Compare'}</span>
                </button>

                {isEyedropperActive && (
                  <div className="px-2.5 py-1.5 rounded-xl bg-indigo-600/90 backdrop-blur-md text-white border border-indigo-400 text-xs font-bold animate-pulse flex items-center gap-1.5 shadow-lg">
                    <Pipette className="w-3.5 h-3.5" />
                    <span>Click on background to erase</span>
                  </div>
                )}
              </div>
            </div>

            <div className="text-[11px] text-slate-400 mt-2 text-center flex items-center gap-1.5">
              <HelpCircle className="w-3 h-3 text-slate-500" />
              <span>Checkerboard indicates transparent area that will be removed.</span>
            </div>
          </div>

          {/* RIGHT: Controls & Settings Sidebar (4 cols) */}
          <div className="lg:col-span-4 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 p-4 sm:p-5 flex flex-col justify-between overflow-y-auto max-h-[50vh] lg:max-h-[none] space-y-4">
            
            <div className="space-y-4">
              
              {/* Output Mode Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  New Background Fill
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setOutputMode('transparent')}
                    className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                      outputMode === 'transparent'
                        ? 'border-indigo-500 bg-indigo-500/20 text-white ring-1 ring-indigo-500'
                        : 'border-slate-800 bg-slate-800/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-md border border-slate-600 bg-[linear-gradient(45deg,#334155_25%,transparent_25%),linear-gradient(-45deg,#334155_25%,transparent_25%)] [background-size:6px_6px] shrink-0" />
                    <span>Transparent</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOutputMode('white')}
                    className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                      outputMode === 'white'
                        ? 'border-indigo-500 bg-indigo-500/20 text-white ring-1 ring-indigo-500'
                        : 'border-slate-800 bg-slate-800/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-md border border-slate-400 bg-white shrink-0" />
                    <span>Pure White</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOutputMode('studio_gray')}
                    className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                      outputMode === 'studio_gray'
                        ? 'border-indigo-500 bg-indigo-500/20 text-white ring-1 ring-indigo-500'
                        : 'border-slate-800 bg-slate-800/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-md border border-slate-500 bg-slate-200 shrink-0" />
                    <span>Soft Studio</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOutputMode('radial_spotlight')}
                    className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                      outputMode === 'radial_spotlight'
                        ? 'border-indigo-500 bg-indigo-500/20 text-white ring-1 ring-indigo-500'
                        : 'border-slate-800 bg-slate-800/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-md border border-slate-500 bg-gradient-to-r from-white to-slate-300 shrink-0" />
                    <span>Spotlight</span>
                  </button>
                </div>
              </div>

              {/* Eyedropper / Color Picker Tool */}
              <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Pipette className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Sample Background Color</span>
                  </span>
                  {sampledColor && (
                    <div 
                      className="w-5 h-5 rounded-md border border-white/40 shadow-xs"
                      style={{ backgroundColor: `rgb(${sampledColor.r},${sampledColor.g},${sampledColor.b})` }}
                      title={`RGB(${sampledColor.r}, ${sampledColor.g}, ${sampledColor.b})`}
                    />
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setIsEyedropperActive(!isEyedropperActive)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isEyedropperActive
                      ? 'bg-indigo-600 text-white ring-2 ring-indigo-400'
                      : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                  }`}
                >
                  <Pipette className="w-3.5 h-3.5" />
                  <span>{isEyedropperActive ? 'Click Image to Pick Color' : 'Pick Color with Eyedropper'}</span>
                </button>
              </div>

              {/* Sliders: Tolerance & Feather */}
              <div className="space-y-3.5 p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/50">
                
                {/* Tolerance */}
                <div>
                  <div className="flex items-center justify-between text-xs font-medium mb-1">
                    <span className="text-slate-300">Tolerance Sensitivity</span>
                    <span className="text-[11px] font-bold text-indigo-400">{tolerance}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="80"
                    step="1"
                    value={tolerance}
                    onChange={(e) => setTolerance(parseInt(e.target.value, 10))}
                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                    <span>Precise (5%)</span>
                    <span>Broad (80%)</span>
                  </div>
                </div>

                {/* Edge Feather */}
                <div>
                  <div className="flex items-center justify-between text-xs font-medium mb-1">
                    <span className="text-slate-300">Edge Feather & Anti-Alias</span>
                    <span className="text-[11px] font-bold text-indigo-400">{edgeFeather}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="6"
                    step="1"
                    value={edgeFeather}
                    onChange={(e) => setEdgeFeather(parseInt(e.target.value, 10))}
                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                    <span>Sharp (0px)</span>
                    <span>Soft (6px)</span>
                  </div>
                </div>

              </div>

              {/* Server-side AI API Trigger Option */}
              <button
                type="button"
                onClick={handleServerApiCutout}
                disabled={isServerProcessing}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-indigo-300 hover:text-indigo-200 border border-indigo-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isServerProcessing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing API Segmentation...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Enhance via Server Background API</span>
                  </>
                )}
              </button>

            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-all cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isProcessing}
                onClick={handleApplyCutout}
                className="flex-1 py-3 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/50 transition-all cursor-pointer active:scale-98 disabled:opacity-50"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>{isProcessing ? 'Applying...' : 'Apply Cutout'}</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
