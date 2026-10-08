import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Camera, 
  CameraOff, 
  RefreshCw, 
  FlipHorizontal, 
  Check, 
  X, 
  AlertCircle, 
  Zap, 
  ZapOff, 
  Grid, 
  Timer, 
  RotateCcw, 
  UploadCloud,
  Layers,
  ChevronDown
} from 'lucide-react';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageDataUrl: string) => void;
  onSelectFromFile?: () => void;
}

type AspectRatioMode = 'original' | '1:1' | '4:3';

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
  onSelectFromFile
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [aspectRatio, setAspectRatio] = useState<AspectRatioMode>('1:1');
  const [hasTorch, setHasTorch] = useState<boolean>(false);
  const [isTorchOn, setIsTorchOn] = useState<boolean>(false);
  const [timerDuration, setTimerDuration] = useState<0 | 3 | 5>(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [shutterFlash, setShutterFlash] = useState<boolean>(false);

  // Stop camera tracks cleanly
  const stopCameraStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (_) {}
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsTorchOn(false);
  }, []);

  // Start camera stream with given constraints
  const startCameraStream = useCallback(async (preferredFacing: 'environment' | 'user' = facingMode, deviceId?: string) => {
    stopCameraStream();
    setIsLoading(true);
    setCameraError(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Camera access is not supported by your browser. Please use file upload.');
      setIsLoading(false);
      return;
    }

    try {
      let stream: MediaStream;
      
      const idealVideoConstraints: MediaTrackConstraints = deviceId
        ? { deviceId: { exact: deviceId }, width: { ideal: 1920 }, height: { ideal: 1080 } }
        : { facingMode: { ideal: preferredFacing }, width: { ideal: 1920 }, height: { ideal: 1080 } };

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: idealVideoConstraints
        });
      } catch (firstErr) {
        // Fallback to basic video constraint if specific facingMode fails
        console.warn('Initial camera constraints failed, attempting fallback:', firstErr);
        stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: true
        });
      }

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
        } catch (playErr) {
          console.warn('Video element play error:', playErr);
        }
      }

      // Check torch capability
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        try {
          const capabilities = (videoTrack.getCapabilities?.() || {}) as any;
          setHasTorch(Boolean(capabilities.torch));
        } catch (_) {
          setHasTorch(false);
        }

        // Detect actual facing mode or deviceId if available
        try {
          const settings = videoTrack.getSettings?.();
          if (settings?.deviceId) {
            setSelectedDeviceId(settings.deviceId);
          }
        } catch (_) {}
      }

      // Enumerate all available camera devices
      try {
        const enumerated = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = enumerated.filter((d) => d.kind === 'videoinput');
        setDevices(videoInputs);
      } catch (_) {}

    } catch (err: any) {
      console.error('Camera stream access failed:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera permission was denied. Please allow camera permissions in your browser address bar.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No camera found on this device. Please connect a camera or upload an image file.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setCameraError('Camera is already in use by another application or tab.');
      } else {
        setCameraError(err.message || 'Unable to access your device camera.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [facingMode, stopCameraStream]);

  // When modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCapturedImage(null);
      setCountdown(null);
      startCameraStream(facingMode);
    } else {
      stopCameraStream();
      setCapturedImage(null);
      setCountdown(null);
    }

    return () => {
      stopCameraStream();
    };
  }, [isOpen]);

  // Flip front/rear camera
  const handleFlipCamera = () => {
    const nextFacing = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextFacing);
    startCameraStream(nextFacing);
  };

  // Switch specific device ID
  const handleSelectDevice = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
    startCameraStream(facingMode, deviceId);
  };

  // Toggle torch / flash
  const handleToggleTorch = async () => {
    if (!streamRef.current) return;
    const videoTrack = streamRef.current.getVideoTracks()[0];
    if (!videoTrack) return;

    try {
      const nextTorch = !isTorchOn;
      await (videoTrack as any).applyConstraints({
        advanced: [{ torch: nextTorch }]
      });
      setIsTorchOn(nextTorch);
    } catch (err) {
      console.warn('Torch toggle failed:', err);
    }
  };

  // Take the snapshot from video feed
  const executeCapture = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    const vWidth = video.videoWidth || 1280;
    const vHeight = video.videoHeight || 720;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Calculate crop rectangle based on selected aspect ratio
    let cropX = 0;
    let cropY = 0;
    let cropW = vWidth;
    let cropH = vHeight;

    if (aspectRatio === '1:1') {
      const minDim = Math.min(vWidth, vHeight);
      cropX = (vWidth - minDim) / 2;
      cropY = (vHeight - minDim) / 2;
      cropW = minDim;
      cropH = minDim;
      canvas.width = minDim;
      canvas.height = minDim;
    } else if (aspectRatio === '4:3') {
      const targetRatio = 4 / 3;
      const currentRatio = vWidth / vHeight;
      if (currentRatio > targetRatio) {
        // Video is wider than 4:3
        cropH = vHeight;
        cropW = vHeight * targetRatio;
        cropX = (vWidth - cropW) / 2;
        cropY = 0;
      } else {
        // Video is taller than 4:3
        cropW = vWidth;
        cropH = vWidth / targetRatio;
        cropX = 0;
        cropY = (vHeight - cropH) / 2;
      }
      canvas.width = Math.round(cropW);
      canvas.height = Math.round(cropH);
    } else {
      // Original
      canvas.width = vWidth;
      canvas.height = vHeight;
    }

    // Trigger visual shutter flash
    setShutterFlash(true);
    setTimeout(() => setShutterFlash(false), 250);

    // Draw video frame to canvas with mirror if user facing
    ctx.save();
    if (facingMode === 'user') {
      // Mirror horizontally for natural selfie view
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, cropX, cropY, cropW, cropH, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    setCapturedImage(dataUrl);
  };

  // Shutter button click with optional countdown timer
  const handleShutterClick = () => {
    if (isLoading || cameraError) return;

    if (timerDuration > 0) {
      setCountdown(timerDuration);
      let remaining = timerDuration;
      const interval = setInterval(() => {
        remaining -= 1;
        if (remaining <= 0) {
          clearInterval(interval);
          setCountdown(null);
          executeCapture();
        } else {
          setCountdown(remaining);
        }
      }, 1000);
    } else {
      executeCapture();
    }
  };

  // Accept and use captured photo
  const handleAcceptCapture = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      stopCameraStream();
      onClose();
    }
  };

  // Retake photo
  const handleRetake = () => {
    setCapturedImage(null);
    setCountdown(null);
    // Restart camera if needed
    if (!streamRef.current || !streamRef.current.active) {
      startCameraStream(facingMode);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="px-5 py-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Capture Product Photo</span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Live Camera
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Position your product centered in good lighting</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Aspect Ratio Toggle */}
            <div className="hidden sm:flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700 text-xs">
              <button
                type="button"
                onClick={() => setAspectRatio('1:1')}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                  aspectRatio === '1:1'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Square 1:1 format"
              >
                1:1
              </button>
              <button
                type="button"
                onClick={() => setAspectRatio('4:3')}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                  aspectRatio === '4:3'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Product 4:3 format"
              >
                4:3
              </button>
              <button
                type="button"
                onClick={() => setAspectRatio('original')}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                  aspectRatio === 'original'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Full camera view"
              >
                Full
              </button>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all ml-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Viewfinder / Preview Screen */}
        <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[340px] sm:min-h-[420px]">
          
          {/* Shutter White Flash Effect */}
          {shutterFlash && (
            <div className="absolute inset-0 bg-white z-40 animate-out fade-out duration-250 pointer-events-none" />
          )}

          {/* Countdown Indicator */}
          {countdown !== null && (
            <div className="absolute z-30 inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs pointer-events-none">
              <div className="w-24 h-24 rounded-full bg-indigo-600/90 text-white flex items-center justify-center text-5xl font-black shadow-2xl animate-ping duration-1000">
                {countdown}
              </div>
            </div>
          )}

          {/* Error State */}
          {cameraError ? (
            <div className="p-6 text-center max-w-md mx-auto space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
                <CameraOff className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white mb-1">Camera Access Issue</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{cameraError}</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => startCameraStream(facingMode)}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>

                {onSelectFromFile && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onSelectFromFile();
                    }}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Upload Image File Instead</span>
                  </button>
                )}
              </div>
            </div>
          ) : capturedImage ? (
            /* Review Captured Photo */
            <div className="relative w-full h-full flex items-center justify-center bg-slate-950 p-2">
              <img
                src={capturedImage}
                alt="Captured product snapshot"
                className="max-h-[60vh] max-w-full object-contain rounded-xl shadow-2xl border border-slate-800"
              />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-emerald-400 text-xs font-semibold border border-emerald-500/30 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> Photo Snapped
              </div>
            </div>
          ) : (
            /* Live Camera Feed */
            <div className="relative w-full h-full flex items-center justify-center">
              {isLoading && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950 text-white gap-3">
                  <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs text-slate-400 font-medium">Starting camera...</p>
                </div>
              )}

              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover transition-transform ${
                  facingMode === 'user' ? 'scale-x-[-1]' : ''
                }`}
              />

              {/* Viewfinder Overlays */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                {/* Aspect ratio frame preview border */}
                <div
                  className={`border-2 border-white/60 rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.45)] transition-all ${
                    aspectRatio === '1:1'
                      ? 'w-[78vmin] h-[78vmin] max-w-[340px] max-h-[340px] sm:max-w-[380px] sm:max-h-[380px]'
                      : aspectRatio === '4:3'
                      ? 'w-[84vmin] h-[63vmin] max-w-[420px] max-h-[315px]'
                      : 'w-[90%] h-[90%]'
                  }`}
                >
                  {/* Rule of Thirds Grid Overlay */}
                  {showGrid && (
                    <div className="w-full h-full grid grid-cols-3 grid-rows-3 opacity-30">
                      <div className="border-r border-b border-white"></div>
                      <div className="border-r border-b border-white"></div>
                      <div className="border-b border-white"></div>
                      <div className="border-r border-b border-white"></div>
                      <div className="border-r border-b border-white"></div>
                      <div className="border-b border-white"></div>
                      <div className="border-r border-white"></div>
                      <div className="border-r border-white"></div>
                      <div></div>
                    </div>
                  )}

                  {/* Corner Targeting Brackets */}
                  <div className="absolute -top-1 -left-1 w-5 h-5 border-t-4 border-l-4 border-indigo-400 rounded-tl-md"></div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 border-t-4 border-r-4 border-indigo-400 rounded-tr-md"></div>
                  <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-4 border-l-4 border-indigo-400 rounded-bl-md"></div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-4 border-r-4 border-indigo-400 rounded-br-md"></div>
                  
                  {/* Center focus indicator */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full border border-white/50"></div>
                  </div>
                </div>
              </div>

              {/* Viewfinder Controls Floating Over Video */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-auto">
                <div className="flex items-center gap-2">
                  {/* Grid Toggle */}
                  <button
                    type="button"
                    onClick={() => setShowGrid(!showGrid)}
                    className={`p-2 rounded-xl backdrop-blur-md border text-xs font-medium transition-all ${
                      showGrid 
                        ? 'bg-indigo-600/80 border-indigo-400 text-white' 
                        : 'bg-slate-900/60 border-slate-700/60 text-slate-300 hover:text-white'
                    }`}
                    title="Toggle alignment grid"
                  >
                    <Grid className="w-4 h-4" />
                  </button>

                  {/* Timer Toggle */}
                  <button
                    type="button"
                    onClick={() => {
                      if (timerDuration === 0) setTimerDuration(3);
                      else if (timerDuration === 3) setTimerDuration(5);
                      else setTimerDuration(0);
                    }}
                    className={`px-2.5 py-1.5 rounded-xl backdrop-blur-md border text-xs font-semibold flex items-center gap-1 transition-all ${
                      timerDuration > 0
                        ? 'bg-amber-500/80 border-amber-400 text-white'
                        : 'bg-slate-900/60 border-slate-700/60 text-slate-300 hover:text-white'
                    }`}
                    title="Self-timer delay"
                  >
                    <Timer className="w-3.5 h-3.5" />
                    <span>{timerDuration > 0 ? `${timerDuration}s` : 'Off'}</span>
                  </button>

                  {/* Torch Toggle if supported */}
                  {hasTorch && (
                    <button
                      type="button"
                      onClick={handleToggleTorch}
                      className={`p-2 rounded-xl backdrop-blur-md border text-xs font-medium transition-all ${
                        isTorchOn 
                          ? 'bg-amber-500/90 border-amber-300 text-slate-950' 
                          : 'bg-slate-900/60 border-slate-700/60 text-slate-300 hover:text-white'
                      }`}
                      title={isTorchOn ? 'Turn flashlight off' : 'Turn flashlight on'}
                    >
                      {isTorchOn ? <Zap className="w-4 h-4 fill-current" /> : <ZapOff className="w-4 h-4" />}
                    </button>
                  )}
                </div>

                {/* Flip Camera Button */}
                <button
                  type="button"
                  onClick={handleFlipCamera}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-900/70 hover:bg-slate-900 backdrop-blur-md border border-slate-700/70 text-slate-200 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                  title="Switch front / rear camera"
                >
                  <FlipHorizontal className="w-4 h-4" />
                  <span className="hidden sm:inline">Flip</span>
                </button>
              </div>

              {/* Multiple Cameras selector if > 1 device */}
              {devices.length > 1 && (
                <div className="absolute bottom-3 left-3 z-10">
                  <div className="relative">
                    <select
                      value={selectedDeviceId}
                      onChange={(e) => handleSelectDevice(e.target.value)}
                      className="text-[11px] font-medium bg-slate-900/80 backdrop-blur-md text-slate-200 border border-slate-700/80 rounded-xl px-2.5 py-1 pr-6 appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      {devices.map((device, idx) => (
                        <option key={device.deviceId || idx} value={device.deviceId} className="bg-slate-900 text-white">
                          {device.label || `Camera ${idx + 1}`}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Control / Shutter Bar */}
        <div className="p-4 sm:p-5 bg-slate-900 border-t border-slate-800 z-20">
          {capturedImage ? (
            /* Review Actions */
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleRetake}
                className="flex-1 py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer active:scale-98"
              >
                <RotateCcw className="w-4 h-4 text-amber-400" />
                <span>Retake Photo</span>
              </button>

              <button
                type="button"
                onClick={handleAcceptCapture}
                className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 transition-all cursor-pointer active:scale-98"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Use This Photo</span>
              </button>
            </div>
          ) : (
            /* Shutter and Alternative Controls */
            <div className="flex items-center justify-between gap-4">
              {/* Left action: File chooser fallback */}
              {onSelectFromFile ? (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onSelectFromFile();
                  }}
                  className="text-xs text-slate-400 hover:text-indigo-400 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span className="hidden sm:inline">Upload file instead</span>
                  <span className="sm:hidden">Files</span>
                </button>
              ) : (
                <div className="w-16"></div>
              )}

              {/* Shutter Button (Center) */}
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  disabled={isLoading || Boolean(cameraError) || countdown !== null}
                  onClick={handleShutterClick}
                  className={`w-16 h-16 sm:w-18 sm:h-18 rounded-full border-4 border-white flex items-center justify-center p-1 shadow-2xl transition-all cursor-pointer active:scale-95 ${
                    isLoading || cameraError
                      ? 'opacity-40 cursor-not-allowed bg-slate-800'
                      : 'hover:border-indigo-400 bg-white/20 hover:scale-105'
                  }`}
                  title="Snap photo"
                >
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center shadow-inner hover:bg-slate-100 transition-colors">
                    <Camera className="w-6 h-6 text-slate-900" />
                  </div>
                </button>
                <span className="text-[11px] text-slate-400 font-medium mt-1">Tap to capture</span>
              </div>

              {/* Right action: Aspect Ratio dropdown or toggle for mobile */}
              <div className="flex sm:hidden items-center">
                <button
                  type="button"
                  onClick={() => {
                    setAspectRatio(aspectRatio === '1:1' ? '4:3' : aspectRatio === '4:3' ? 'original' : '1:1');
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-[11px] font-semibold text-slate-300 border border-slate-700"
                >
                  {aspectRatio === '1:1' ? '1:1' : aspectRatio === '4:3' ? '4:3' : 'Full'}
                </button>
              </div>
              <div className="hidden sm:block w-16"></div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
