/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { Camera, Image as ImageIcon, X, RefreshCw, Check, Sparkles, AlertCircle } from 'lucide-react';

interface CameraPhotoUploaderProps {
  label?: string;
  hint?: string;
  photoUrl: string | null;
  onPhotoChange: (url: string | null) => void;
  required?: boolean;
}

export default function CameraPhotoUploader({
  label = 'Add a Photo of the Meal / Eatery',
  hint = 'Take a live photo using your phone or web camera, or choose from files.',
  photoUrl,
  onPhotoChange,
  required = false,
}: CameraPhotoUploaderProps) {
  const [isLiveCameraOpen, setIsLiveCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isStartingStream, setIsStartingStream] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop media stream on close or unmount
  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      stopStream();
    };
  }, []);

  // Launch live camera viewfinder
  const startLiveCamera = async (mode: 'environment' | 'user' = facingMode) => {
    stopStream();
    setCameraError(null);
    setIsStartingStream(true);
    setIsLiveCameraOpen(true);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not available in this browser. Please use the camera input button.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err: any) {
      console.warn('Live camera stream error:', err);
      setCameraError(
        err.name === 'NotAllowedError'
          ? 'Camera permission was denied. You can still use the direct camera capture button below.'
          : 'Could not access camera stream. Please use the direct camera upload option.'
      );
    } finally {
      setIsStartingStream(false);
    }
  };

  const handleFlipCamera = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startLiveCamera(nextMode);
  };

  // Capture frame from video stream
  const handleSnapPhoto = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      onPhotoChange(dataUrl);
      closeLiveCamera();
    }
  };

  const closeLiveCamera = () => {
    stopStream();
    setIsLiveCameraOpen(false);
    setCameraError(null);
  };

  // Handle direct file or native mobile camera input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Selected photo is too large. Please select an image under 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onPhotoChange(result);
      }
    };
    reader.readAsDataURL(file);
    // Reset inputs
    e.target.value = '';
  };

  return (
    <div className="space-y-2">
      {/* Label and Hint */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-black uppercase tracking-wider text-gray-700">
          {label} {required && <span className="text-[#00843D]">*</span>}
        </label>
        {photoUrl && (
          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Check className="w-3 h-3 text-[#00843D]" />
            <span>Photo Attached</span>
          </span>
        )}
      </div>

      {hint && <p className="text-[11px] text-gray-500 font-medium">{hint}</p>}

      {/* Hidden file inputs for direct device camera & gallery */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Photo Preview Mode */}
      {photoUrl ? (
        <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500/40 bg-gray-900 group shadow-md aspect-[16/9]">
          <img src={photoUrl} alt="Meal or Eatery Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 opacity-90 group-hover:opacity-100 transition-opacity" />

          {/* Top badge */}
          <div className="absolute top-2.5 left-2.5 bg-[#00843D] text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
            <Camera className="w-3 h-3 text-[#F5BA13]" />
            <span>Captured Meal Photo</span>
          </div>

          {/* Action buttons on image */}
          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-2">
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="py-1.5 px-3 rounded-lg bg-black/60 hover:bg-black text-white text-xs font-bold backdrop-blur-md border border-white/20 transition-all flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3 text-[#F5BA13]" />
              <span>Retake</span>
            </button>

            <button
              type="button"
              onClick={() => onPhotoChange(null)}
              className="py-1.5 px-3 rounded-lg bg-red-600/80 hover:bg-red-700 text-white text-xs font-bold transition-all flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      ) : (
        /* Capture Selector Buttons */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* 1. Live Camera Button */}
          <button
            type="button"
            onClick={() => startLiveCamera('environment')}
            className="flex items-center justify-center gap-2 p-3 rounded-xl border border-emerald-500/30 bg-emerald-50/60 hover:bg-emerald-100 text-emerald-900 text-xs font-bold transition-all shadow-sm active:scale-95 group"
          >
            <div className="w-7 h-7 rounded-lg bg-[#00843D] text-white flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
              <Camera className="w-4 h-4 text-[#F5BA13]" />
            </div>
            <div className="text-left">
              <div className="text-xs font-black text-[#00843D]">Open Device Camera</div>
              <div className="text-[10px] text-gray-500 font-normal">Snap live with camera</div>
            </div>
          </button>

          {/* 2. Choose File / Gallery */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 p-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold transition-all shadow-sm active:scale-95 group"
          >
            <div className="w-7 h-7 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <ImageIcon className="w-4 h-4 text-[#00843D]" />
            </div>
            <div className="text-left">
              <div className="text-xs font-black text-gray-800">Upload from Gallery</div>
              <div className="text-[10px] text-gray-500 font-normal">PNG, JPG up to 10MB</div>
            </div>
          </button>
        </div>
      )}

      {/* LIVE CAMERA VIEWFINDER MODAL */}
      {isLiveCameraOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative bg-[#081C15] w-full max-w-lg rounded-3xl p-5 shadow-2xl text-white border border-emerald-500/30 overflow-hidden space-y-4 animate-scale-up">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping" />
                <h4 className="text-sm font-black uppercase tracking-wider text-emerald-200">
                  Live Viewfinder • 100 Bob Meal Photo
                </h4>
              </div>
              <button
                type="button"
                onClick={closeLiveCamera}
                className="p-1.5 rounded-full text-gray-400 hover:text-white bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Error fallback message if live stream blocked */}
            {cameraError ? (
              <div className="p-5 text-center space-y-3 bg-red-950/40 rounded-2xl border border-red-500/40">
                <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
                <p className="text-xs text-red-200 font-medium">{cameraError}</p>
                <button
                  type="button"
                  onClick={() => {
                    closeLiveCamera();
                    cameraInputRef.current?.click();
                  }}
                  className="py-2.5 px-4 rounded-xl bg-[#00843D] hover:bg-[#006e33] text-white text-xs font-black uppercase tracking-wider shadow-md"
                >
                  Use Native Device Camera
                </button>
              </div>
            ) : (
              /* Live Video Stream Canvas */
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-[4/3] flex items-center justify-center border border-emerald-500/30">
                {isStartingStream && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-xs text-emerald-300">
                    <RefreshCw className="w-6 h-6 animate-spin text-[#F5BA13]" />
                    <span>Connecting camera sensor...</span>
                  </div>
                )}

                <video
                  ref={videoRef}
                  playsInline
                  autoPlay
                  muted
                  className="w-full h-full object-cover"
                />

                {/* Viewfinder Target Reticle */}
                <div className="absolute inset-8 pointer-events-none border-2 border-white/30 rounded-2xl flex items-center justify-center">
                  <div className="w-8 h-8 border-t-2 border-l-2 border-[#F5BA13] absolute top-2 left-2" />
                  <div className="w-8 h-8 border-t-2 border-r-2 border-[#F5BA13] absolute top-2 right-2" />
                  <div className="w-8 h-8 border-b-2 border-l-2 border-[#F5BA13] absolute bottom-2 left-2" />
                  <div className="w-8 h-8 border-b-2 border-r-2 border-[#F5BA13] absolute bottom-2 right-2" />
                  <span className="text-[11px] font-black uppercase tracking-wider text-white/70 bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
                    Frame Your Plate
                  </span>
                </div>
              </div>
            )}

            {/* Hidden canvas for snapshot rendering */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Controls Bar */}
            {!cameraError && (
              <div className="flex items-center justify-between pt-1">
                {/* Flip camera button */}
                <button
                  type="button"
                  onClick={handleFlipCamera}
                  className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-emerald-100 font-bold border border-white/10"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#F5BA13]" />
                  <span>Flip</span>
                </button>

                {/* Main Shutter Button */}
                <button
                  type="button"
                  onClick={handleSnapPhoto}
                  className="w-14 h-14 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center p-1 shadow-2xl active:scale-90 transition-transform border-4 border-[#00843D]"
                >
                  <div className="w-10 h-10 rounded-full bg-[#00843D] flex items-center justify-center">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                </button>

                {/* Fallback to native camera input */}
                <button
                  type="button"
                  onClick={() => {
                    closeLiveCamera();
                    cameraInputRef.current?.click();
                  }}
                  className="text-xs text-emerald-300 hover:text-white underline font-semibold py-1 px-2"
                >
                  Native Camera
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
