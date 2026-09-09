import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Camera, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { PhotoFrameOption } from '../types/photobooth';

interface InterSessionTransitionProps {
  completedFrame: PhotoFrameOption;
  nextFrame: PhotoFrameOption;
  completedPhotos: string[];
  totalTakesNeeded: number;
  onStartNextSession: () => void;
}

export const InterSessionTransition: React.FC<InterSessionTransitionProps> = ({
  completedFrame,
  nextFrame,
  completedPhotos,
  totalTakesNeeded,
  onStartNextSession,
}) => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onStartNextSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onStartNextSession]);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -20 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-xl rounded-3xl border border-white/20 bg-zinc-950/95 p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9)] text-center text-white"
      >
        {/* Celebration Header Badge */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-4 py-1.5 text-xs font-bold text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="h-4 w-4" /> Sesi Lembar 1 Selesai!
          </span>
          <span className="rounded-full bg-purple-500/20 px-3 py-1.5 text-xs font-bold text-purple-300 border border-purple-500/30 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-purple-400" /> Lembar 2 Siap
          </span>
        </div>

        <h2 className="font-comic text-2xl sm:text-3xl font-black text-white">
          Waktunya Gaya Baru untuk Lembar 2!
        </h2>
        <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-md mx-auto">
          Foto untuk frame <strong className="text-white font-semibold">{completedFrame.name}</strong> sudah aman.
          Sekarang kita ambil foto pose berbeda untuk frame{' '}
          <strong className="text-white font-semibold">{nextFrame.name}</strong>!
        </p>

        {/* Thumbnail Preview of Completed Session 1 */}
        <div className="mt-5 p-3 rounded-2xl bg-white/5 border border-white/10">
          <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2 text-left px-1 flex items-center justify-between">
            <span>Foto Lembar 1 ({completedFrame.name}):</span>
            <span className="text-emerald-400 font-mono">Tersimpan ✔</span>
          </div>
          <div className="flex items-center justify-center gap-2 overflow-x-auto py-1">
            {completedPhotos.map((photo, idx) => (
              <div
                key={idx}
                className="relative aspect-[4/3] w-20 sm:w-24 rounded-lg overflow-hidden border border-white/20 shadow-md bg-zinc-900 flex-shrink-0"
              >
                <img
                  src={photo}
                  alt={`Sesi 1 Pose ${String.fromCharCode(65 + idx)}`}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1 py-0.5 text-[9px] font-bold text-white">
                  {String.fromCharCode(65 + idx)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Next Session Callout */}
        <div className="mt-5 flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/40 to-blue-950/40 border border-purple-500/30 text-left">
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-xl border border-black/30 shadow-md flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: nextFrame.bgColor }}
            >
              <Camera
                className="h-5 w-5"
                style={{
                  color:
                    nextFrame.bgColor === '#ffffff' ||
                    nextFrame.bgColor === '#fef08a' ||
                    nextFrame.bgColor === '#cbd5e1' ||
                    nextFrame.bgColor === '#e9d5ff'
                      ? '#000000'
                      : '#ffffff',
                }}
              />
            </div>
            <div>
              <div className="text-xs font-bold text-white">
                Sesi 2: {nextFrame.name}
              </div>
              <div className="text-[11px] text-zinc-400">
                {totalTakesNeeded} pose baru dengan Live Photo & Retake jatah 2x
              </div>
            </div>
          </div>

          <span className="font-mono text-xs font-bold text-purple-300 bg-purple-500/20 px-2.5 py-1 rounded-full border border-purple-500/30">
            {countdown}s
          </span>
        </div>

        {/* Button */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onStartNextSession}
            className="flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-3.5 font-comic text-base text-zinc-950 shadow-[0_10px_30px_rgba(255,255,255,0.3)] hover:bg-zinc-100 transition-all cursor-pointer w-full sm:w-auto"
          >
            <span>Mulai Foto Sesi 2 Sekarang</span>
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
