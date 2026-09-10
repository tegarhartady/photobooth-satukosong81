import React from 'react';
import { motion } from 'motion/react';
import { FlipHorizontal, SlidersHorizontal, ArrowRight, Camera } from 'lucide-react';

interface CenterCardProps {
  onStart: () => void;
  filter: 'normal' | 'warm' | 'vintage' | 'bw';
  setFilter: (f: 'normal' | 'warm' | 'vintage' | 'bw') => void;
  onFlipCamera: () => void;
}

export const CenterCard: React.FC<CenterCardProps> = ({
  onStart,
  filter,
  setFilter,
  onFlipCamera,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.88, y: -20 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-20 flex flex-col items-center justify-center max-w-3xl w-full px-4 py-6"
    >
      {/* Frosted Streetwear Kiosk Panel */}
      <div
        id="main-photobooth-card"
        className="relative w-full rounded-[36px] border border-red-500/25 bg-black/75 p-6 sm:p-10 md:p-12 shadow-[0_25px_60px_rgba(0,0,0,0.85)] backdrop-blur-2xl text-center overflow-hidden"
      >
        {/* Subtle Ambient Red Glow in Kiosk Corner */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-red-600/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-red-600/15 blur-3xl" />

        {/* Top Streetwear Brand Tag */}
        {/*<div className="flex items-center justify-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 border border-red-500/30 px-3.5 py-1 text-[11px] font-esports font-bold tracking-widest text-red-400 uppercase">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
            LIVE PHOTOBOOTH EXPERIENCE // EST. 2024
          </span>
        </div>*/}

        {/* Urban / Streetwear & E-Sports Typography Title */}
        <div className="flex flex-col items-center select-none text-center">
          {/* Main Title: SATU.KOSONG8 */}
          <div className="relative group">
            <h1 className="font-urban text-4xl sm:text-6xl md:text-7xl tracking-wider uppercase text-white urban-text-3d transition-transform duration-200 hover:scale-[1.01]">
              SATU<span className="text-red-500">.</span>KOSONG8
            </h1>
          </div>

          {/* Authentic Streetwear Red Box-Logo "THE" */}
          <div className="my-1.5 sm:my-2.5">
            <div className="streetwear-box-logo inline-flex items-center justify-center rounded px-6 py-0.5 border border-white/30">
              <span className="font-street text-xl sm:text-2xl md:text-3xl uppercase tracking-widest text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]">
                THE
              </span>
            </div>
          </div>

          {/* Secondary Title: PHOTOBOOTH */}
          <div className="relative">
            <h2 className="font-urban text-3xl sm:text-5xl md:text-6xl tracking-widest uppercase text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              PHOTOBOOTH
            </h2>
          </div>

          {/* Streetwear Tech Subtitle */}
          <p className="mt-2 font-esports text-xs sm:text-sm font-semibold tracking-widest text-zinc-300 uppercase">
            DUAL FRAME STRIP <span className="text-red-500">•</span> LIVE MOTION PHOTO <span className="text-red-500">•</span> INSTANT CLOUD DRIVE
          </p>
        </div>

        {/* Big Signature Streetwear RED "Mulai" Button */}
        <div className="mt-8 sm:mt-10 flex flex-col items-center gap-3">
          <motion.button
            id="start-photobooth-btn"
            onClick={onStart}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="group relative flex items-center justify-center gap-3 min-w-[260px] sm:min-w-[340px] rounded-2xl bg-gradient-to-r from-[#b91c1c] via-[#dc2626] to-[#ef4444] px-8 sm:px-12 py-4 sm:py-5 text-white shadow-[0_12px_40px_rgba(220,38,38,0.55)] border-2 border-white/25 transition-all hover:brightness-110 hover:shadow-[0_16px_50px_rgba(239,68,68,0.75)] cursor-pointer"
          >
            <Camera className="h-6 w-6 text-white group-hover:rotate-12 transition-transform" />
            <span className="font-urban text-2xl sm:text-3xl uppercase tracking-wider text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              SENTUH UNTUK MULAI
            </span>
            <ArrowRight className="h-6 w-6 text-white group-hover:translate-x-1.5 transition-transform" />
          </motion.button>
          <span className="font-esports text-xs tracking-wider text-zinc-400">
            Sentuh layar untuk melihat panduan & memilih sesi foto
          </span>
        </div>
      </div>

      {/* Camera Live Controls (Filter & Flip Camera) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-4 flex flex-wrap items-center justify-center gap-2.5 rounded-full border border-red-500/20 bg-black/60 px-4 py-2 backdrop-blur-md text-xs sm:text-sm text-white shadow-xl"
      >
        <div className="flex items-center gap-1.5">
          <span className="flex items-center gap-1 text-zinc-300 font-medium text-xs">
            <SlidersHorizontal className="h-3 w-3 text-red-400" />
            Filter Kamera:
          </span>
          {(
            [
              { id: 'normal', label: 'Natural' },
              { id: 'warm', label: 'Warm' },
              { id: 'vintage', label: 'Vintage' },
              { id: 'bw', label: 'B&W' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id)}
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold transition-all cursor-pointer ${
                filter === item.id
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-zinc-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="h-3.5 w-[1px] bg-white/20 mx-1 hidden sm:block" />

        <button
          onClick={onFlipCamera}
          title="Balik Kamera Depan / Belakang"
          className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-zinc-200 hover:bg-white/20 hover:text-white transition-colors cursor-pointer"
        >
          <FlipHorizontal className="h-3.5 w-3.5 text-red-400" />
          <span>Balik Kamera</span>
        </button>
      </motion.div>
    </motion.div>
  );
};
