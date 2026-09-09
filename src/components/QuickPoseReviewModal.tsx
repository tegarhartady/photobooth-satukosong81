import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, RefreshCw, Sparkles, AlertCircle, Play, Film, ShieldCheck } from 'lucide-react';

interface QuickPoseReviewModalProps {
  isOpen: boolean;
  frameIndex: 1 | 2;
  frameName: string;
  currentPoseIndex: number; // 1-based index (e.g. 1)
  totalPoses: number; // total takes needed (e.g. 3 or 4)
  poseChar: string; // 'A', 'B', 'C', 'D'
  photoUrl: string;
  livePhotoVideoUrl?: string;
  currentAttempt: number; // 1 or 2
  maxAttempts: number; // 2
  secondsRemaining: number; // e.g. 4..0
  onAccept: () => void;
  onRetake: () => void;
}

export const QuickPoseReviewModal: React.FC<QuickPoseReviewModalProps> = ({
  isOpen,
  frameIndex,
  frameName,
  currentPoseIndex,
  totalPoses,
  poseChar,
  photoUrl,
  livePhotoVideoUrl,
  currentAttempt,
  maxAttempts,
  secondsRemaining,
  onAccept,
  onRetake,
}) => {
  const [isPlayingLive, setIsPlayingLive] = useState(false);

  if (!isOpen || !photoUrl) return null;

  const canRetake = currentAttempt < maxAttempts;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: -15 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-lg rounded-3xl border border-white/20 bg-zinc-950/95 p-5 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.85)] text-center flex flex-col items-center"
      >
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between w-full gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-300 border border-blue-500/30">
              <Sparkles className="h-3 w-3 text-blue-400" />
              Lembar {frameIndex} ({frameName})
            </span>
            <span className="text-xs font-bold text-white bg-white/10 px-2.5 py-1 rounded-full border border-white/15">
              Pose {currentPoseIndex}/{totalPoses} ({poseChar})
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {canRetake ? (
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Sisa 1x Retake
              </span>
            ) : (
              <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-bold text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Batas 2x Terpakai
              </span>
            )}
            <span className="text-xs text-zinc-400 font-mono bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
              Take {currentAttempt}/{maxAttempts}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-comic text-xl sm:text-2xl text-white mb-1">
          Review Hasil Pose {poseChar}
        </h3>
        <p className="text-xs text-zinc-400 mb-3 max-w-sm">
          {canRetake
            ? 'Hasil fotonya sudah oke atau mau foto ulang? Maksimal 2x take agar antrean tetap tertib.'
            : 'Jatah retake 2x sudah maksimal. Foto ini akan otomatis dipakai!'}
        </p>

        {/* Photo / Live Photo Preview Box */}
        <div className="relative w-full max-w-xs sm:max-w-sm aspect-[4/3] rounded-2xl overflow-hidden border-2 border-white/25 bg-black shadow-xl mb-2.5 group">
          {livePhotoVideoUrl && isPlayingLive ? (
            <video
              src={livePhotoVideoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={photoUrl}
              alt={`Review Pose ${poseChar}`}
              className="w-full h-full object-cover"
            />
          )}

          {/* Pose Tag */}
          <div className="absolute top-2.5 left-2.5 rounded-lg bg-black/60 backdrop-blur-sm px-2.5 py-1 text-xs font-bold text-white border border-white/20">
            POSE {poseChar}
          </div>

          {/* Live Photo Toggle Badge */}
          {livePhotoVideoUrl && (
            <button
              onClick={() => setIsPlayingLive(!isPlayingLive)}
              className="absolute top-2.5 right-2.5 flex items-center gap-1.5 rounded-full bg-yellow-400/90 text-zinc-950 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider shadow-md hover:bg-yellow-300 transition-colors cursor-pointer"
            >
              {isPlayingLive ? <Film className="h-3 w-3" /> : <Play className="h-3 w-3 fill-current" />}
              <span>{isPlayingLive ? 'Stop Live' : 'Play Live Photo'}</span>
            </button>
          )}
        </div>

        {/* Bloopers & Retake Safe Notice */}
        <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 mb-3 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
          <span>Jika di-retake, foto sebelumnya tetap tersimpan di arsip email & drive!</span>
        </div>

        {/* Auto Proceed Notice */}
        <div className="flex items-center justify-center gap-2 mb-4 text-xs font-medium text-zinc-300">
          <div className="h-2 w-2 rounded-full bg-white animate-ping" />
          <span>
            Otomatis lanjut dalam{' '}
            <span className="font-mono font-bold text-white text-sm">
              {secondsRemaining}
            </span>{' '}
            detik...
          </span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 w-full">
          {/* Retake Button */}
          <button
            onClick={onRetake}
            disabled={!canRetake}
            className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold transition-all ${
              canRetake
                ? 'bg-white/10 hover:bg-white/20 text-white border border-white/25 cursor-pointer shadow-md'
                : 'bg-zinc-900 text-zinc-600 border border-white/5 cursor-not-allowed opacity-50'
            }`}
          >
            <RefreshCw className="h-4 w-4" />
            <span>{canRetake ? 'Foto Ulang (1x)' : 'Batas Habis'}</span>
          </button>

          {/* Accept Button */}
          <button
            onClick={onAccept}
            className="flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-xs sm:text-sm font-comic text-zinc-950 shadow-[0_5px_20px_rgba(255,255,255,0.3)] hover:bg-zinc-100 transition-all cursor-pointer"
          >
            <Check className="h-4 w-4 stroke-[3]" />
            <span>Lanjut (Suka)</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
