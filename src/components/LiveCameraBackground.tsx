import React, { useEffect, useState } from 'react';
import { Camera, RefreshCw } from 'lucide-react';

interface LiveCameraBackgroundProps {
  facingMode: 'user' | 'environment';
  onToggleFacingMode: () => void;
  filter: 'normal' | 'warm' | 'vintage' | 'bw';
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isCapturing?: boolean;
}

export const LiveCameraBackground: React.FC<LiveCameraBackgroundProps> = ({
  facingMode,
  filter,
  videoRef,
}) => {
  const [streamActive, setStreamActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let currentStream: MediaStream | null = null;
    let isMounted = true;

    async function initCamera() {
      setErrorMessage(null);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode,
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        });

        if (!isMounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        currentStream = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
        setStreamActive(true);
      } catch (err: unknown) {
        console.warn('Unable to access webcam:', err);
        if (isMounted) {
          setErrorMessage('Kamera belum diizinkan atau tidak ditemukan.');
        }
      }
    }

    initCamera();

    return () => {
      isMounted = false;
      if (currentStream) {
        currentStream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [facingMode, videoRef]);

  const getFilterStyle = () => {
    switch (filter) {
      case 'warm':
        return 'contrast(106%) saturate(125%) sepia(12%) brightness(102%)';
      case 'vintage':
        return 'sepia(35%) contrast(110%) brightness(96%) saturate(110%)';
      case 'bw':
        return 'grayscale(100%) contrast(120%) brightness(104%)';
      case 'normal':
      default:
        return 'none';
    }
  };

  return (
    <div className="absolute inset-0 z-0 h-full w-full overflow-hidden bg-[#0d0d11]">
      {/* Live Video Feed Element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          filter: getFilterStyle(),
          transform: facingMode === 'user' ? 'scaleX(-1)' : 'none',
        }}
        className={`h-full w-full object-cover transition-all duration-300 ${
          streamActive ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Fallback View if camera is unavailable or loading */}
      {!streamActive && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 text-center p-6">
          <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-white/5 shadow-2xl">
            <Camera className="h-10 w-10 text-white/80 animate-pulse" />
          </div>
          <h3 className="font-comic text-2xl md:text-3xl text-white tracking-wide">
            LIVE PHOTO PHOTOBOOTH
          </h3>
          <p className="mt-2 max-w-md text-sm text-zinc-400">
            {errorMessage || 'Mengaktifkan kamera live photobooth...'}
          </p>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => {
                setErrorMessage(null);
                navigator.mediaDevices
                  ?.getUserMedia({ video: true })
                  .then((st) => {
                    if (videoRef.current) {
                      videoRef.current.srcObject = st;
                      videoRef.current.play().catch(() => {});
                      setStreamActive(true);
                    }
                  })
                  .catch(() => {
                    setErrorMessage('Izin kamera ditolak. Silakan izinkan kamera di browser.');
                  });
              }}
              className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-zinc-900 shadow-lg hover:bg-zinc-200 cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              Izinkan Akses Kamera
            </button>
          </div>
        </div>
      )}

      {/* Subtle photobooth vignette */}
      <div className="pointer-events-none absolute inset-0 bg-radial from-transparent via-black/10 to-black/55" />

      {/* Viewfinder Target Framing Marks (Aesthetic photobox corners) */}
      <div className="pointer-events-none absolute inset-10 md:inset-16 border border-white/15 rounded-3xl" />
      <div className="pointer-events-none absolute top-12 left-12 md:top-20 md:left-20 h-6 w-6 border-t-2 border-l-2 border-white/40 rounded-tl-lg" />
      <div className="pointer-events-none absolute top-12 right-12 md:top-20 md:right-20 h-6 w-6 border-t-2 border-r-2 border-white/40 rounded-tr-lg" />
      <div className="pointer-events-none absolute bottom-12 left-12 md:bottom-20 md:left-20 h-6 w-6 border-b-2 border-l-2 border-white/40 rounded-bl-lg" />
      <div className="pointer-events-none absolute bottom-12 right-12 md:bottom-20 md:right-20 h-6 w-6 border-b-2 border-r-2 border-white/40 rounded-br-lg" />

      {/* Live Indicator Pill on top-left */}
      <div className="pointer-events-none absolute top-5 left-5 z-20 flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3.5 py-1.5 backdrop-blur-md text-xs font-semibold text-white">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
        </span>
        <span className="tracking-wide">LIVE PHOTO CAMERA</span>
      </div>
    </div>
  );
};
