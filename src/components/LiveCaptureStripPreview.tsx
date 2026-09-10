import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Sparkles, Check, ChevronRight, ChevronLeft, Eye, Layers } from 'lucide-react';
import {
  PhotoFrameOption,
  PhotoLayoutCount,
  mapTakesToSlots,
} from '../types/photobooth';

interface LiveCaptureStripPreviewProps {
  currentFrame: PhotoFrameOption;
  selectedLayout: PhotoLayoutCount;
  capturedPhotos: string[];
  currentShotIndex: number;
  totalTakesNeeded: number;
  countdown: number | null;
  currentSessionIndex: 1 | 2;
  allowedFramesCount: 1 | 2;
  frame1: PhotoFrameOption;
  frame2: PhotoFrameOption;
  capturedPhotosSession1: string[];
  capturedPhotosSession2: string[];
}

export const LiveCaptureStripPreview: React.FC<LiveCaptureStripPreviewProps> = ({
  currentFrame,
  selectedLayout,
  capturedPhotos,
  currentShotIndex,
  totalTakesNeeded,
  countdown,
  currentSessionIndex,
  allowedFramesCount,
  frame1,
  frame2,
  capturedPhotosSession1,
  capturedPhotosSession2,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [viewedSessionTab, setViewedSessionTab] = useState<1 | 2>(currentSessionIndex);

  // Sync tab with current session if session changes
  React.useEffect(() => {
    setViewedSessionTab(currentSessionIndex);
  }, [currentSessionIndex]);

  const isViewingCurrentActiveSession = viewedSessionTab === currentSessionIndex;
  const activeFrame = viewedSessionTab === 1 ? frame1 : frame2;
  const activePhotos = viewedSessionTab === 1 ? capturedPhotosSession1 : capturedPhotosSession2;

  const mappedSlots = mapTakesToSlots(activePhotos, selectedLayout);

  const formattedDate = new Date().toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="pointer-events-auto fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-40 flex items-center">
      {/* Minimized Toggle Button for Mobile / Small Screens */}
      {isMinimized ? (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsMinimized(false)}
          className="flex flex-col items-center gap-1.5 rounded-2xl border border-white/30 bg-black/80 p-2.5 sm:p-3 text-white shadow-2xl backdrop-blur-xl hover:bg-black/95 transition-all cursor-pointer"
        >
          <div className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
          <Eye className="h-5 w-5 text-red-500" />
          <span className="text-[9px] font-bold uppercase tracking-wider text-white [writing-mode:vertical-rl] rotate-180">
            Preview Frame
          </span>
          <ChevronLeft className="h-4 w-4 text-zinc-400" />
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, x: 40, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 40, scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative flex flex-col items-center max-h-[88vh] overflow-hidden rounded-[26px] border border-white/20 bg-zinc-950/90 p-2.5 sm:p-3 shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-xl"
        >
          {/* Header Panel */}
          <div className="w-full flex items-center justify-between gap-2 pb-2 mb-2 border-b border-white/10">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
              <span className="text-[10px] font-mono font-black uppercase tracking-wider text-white">
                Live Frame Preview
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsMinimized(true)}
              title="Kecilkan pratinjau"
              className="rounded-lg p-1 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Session Switcher if 2 frames mode */}
          {allowedFramesCount === 2 && (
            <div className="w-full grid grid-cols-2 gap-1 mb-2 bg-zinc-900/90 p-1 rounded-xl border border-white/10 text-[10px]">
              <button
                type="button"
                onClick={() => setViewedSessionTab(1)}
                className={`px-2 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  viewedSessionTab === 1
                    ? 'bg-white text-zinc-950 shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <span>Lembar 1</span>
                {currentSessionIndex === 1 && (
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setViewedSessionTab(2)}
                className={`px-2 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  viewedSessionTab === 2
                    ? 'bg-white text-zinc-950 shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <span>Lembar 2</span>
                {currentSessionIndex === 2 && (
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
                )}
              </button>
            </div>
          )}

          {/* Frame Name & Progress Pill */}
          <div className="w-full flex items-center justify-between text-[10px] text-zinc-400 mb-2 px-1">
            <span className="font-semibold text-white truncate max-w-[110px]">
              {activeFrame.name}
            </span>
            <span className="font-mono text-zinc-300">
              {activePhotos.length}/{totalTakesNeeded} Foto
            </span>
          </div>

          {/* The Physical Photo Strip Mockup */}
          <div
            className="relative rounded-2xl p-2.5 sm:p-3 shadow-2xl transition-all border flex flex-col justify-between overflow-y-auto max-h-[64vh]"
            style={{
              backgroundColor: activeFrame.bgColor,
              borderColor: activeFrame.borderColor,
              color: activeFrame.textColor,
              width: selectedLayout === 4 ? '135px' : '165px',
            }}
          >
            {/* Header Branding */}
            <div className="text-center pt-0.5 pb-1">
              <div
                className="font-comic text-[9px] uppercase tracking-wider font-black"
                style={{ color: activeFrame.textColor }}
              >
                SATU.KOSONG8
              </div>
              <div
                className="font-comic text-[6px] uppercase tracking-widest font-bold opacity-80"
                style={{ color: activeFrame.subTextColor }}
              >
                THE PHOTOBOOTH
              </div>
            </div>

            {/* Photo Slots Grid */}
            <div
              className={`grid gap-1.5 my-1 ${
                selectedLayout === 4 ? 'grid-cols-1' : 'grid-cols-2'
              }`}
            >
              {mappedSlots.map((slot, idx) => {
                const isThisSlotActiveNow =
                  isViewingCurrentActiveSession && slot.takeNumber === currentShotIndex;
                const hasPhoto = Boolean(slot.frame);

                return (
                  <div
                    key={idx}
                    className={`relative aspect-[4/3] rounded-md overflow-hidden flex items-center justify-center border transition-all ${
                      isThisSlotActiveNow && !hasPhoto
                        ? 'ring-2 ring-red-500 ring-offset-1 ring-offset-black animate-pulse'
                        : ''
                    }`}
                    style={{
                      backgroundColor: hasPhoto ? '#000000' : '#27272a',
                      borderColor: isThisSlotActiveNow
                        ? '#ef4444'
                        : activeFrame.photoBorderColor,
                    }}
                  >
                    {hasPhoto ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 1.08 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="relative h-full w-full"
                      >
                        <img
                          src={slot.frame}
                          alt={`Slot ${slot.poseChar}`}
                          className="h-full w-full object-cover"
                        />
                        {/* Done check badge */}
                        <div className="absolute top-1 right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                          <Check className="h-2.5 w-2.5 stroke-[3]" />
                        </div>
                      </motion.div>
                    ) : isThisSlotActiveNow ? (
                      /* Currently Active Slot (being captured right now) */
                      <div className="flex flex-col items-center justify-center text-center p-1">
                        {countdown !== null ? (
                          <motion.span
                            key={countdown}
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1.2, opacity: 1 }}
                            className="font-comic text-base font-black text-yellow-300 drop-shadow"
                          >
                            {countdown}
                          </motion.span>
                        ) : (
                          <Camera className="h-4 w-4 text-red-400 animate-bounce" />
                        )}
                        <span className="text-[7px] font-bold text-white uppercase tracking-wider mt-0.5">
                          Pose {slot.poseChar}
                        </span>
                        <span className="text-[6px] font-mono font-bold text-red-400">
                          SEKARANG
                        </span>
                      </div>
                    ) : (
                      /* Upcoming Slot */
                      <div className="flex flex-col items-center justify-center text-zinc-500">
                        <span className="text-[9px] font-comic font-black text-zinc-400">
                          Pose {slot.poseChar}
                        </span>
                        <span className="text-[6px] font-mono text-zinc-500">
                          #{slot.takeNumber}
                        </span>
                      </div>
                    )}

                    {/* Corner Accent Dot */}
                    <div
                      className="absolute bottom-0.5 right-0.5 h-1 w-1 rounded-full"
                      style={{ backgroundColor: activeFrame.accentColor }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Footer Branding */}
            <div className="text-center pt-1 border-t border-black/10">
              <div
                className="text-[6px] font-bold tracking-tight"
                style={{ color: activeFrame.textColor }}
              >
                SATU.KOSONG8 PHOTOBOOTH
              </div>
              <div
                className="text-[5px] opacity-75 font-mono"
                style={{ color: activeFrame.subTextColor }}
              >
                {formattedDate} • KIOSK
              </div>
            </div>
          </div>

          {/* Quick Info under Strip */}
          <div className="mt-2 text-center">
            <span className="text-[9px] text-zinc-400 font-medium">
              {isViewingCurrentActiveSession
                ? `Mengisi Pose ${String.fromCharCode(65 + currentShotIndex - 1)}...`
                : `Menampilkan Lembar ${viewedSessionTab}`}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};
