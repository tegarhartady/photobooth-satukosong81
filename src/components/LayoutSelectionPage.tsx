import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Check, Sparkles, LayoutGrid } from 'lucide-react';
import { PHOTO_LAYOUT_OPTIONS, PhotoLayoutCount, PhotoLayoutOption } from '../types/photobooth';

interface LayoutSelectionPageProps {
  selectedLayout: PhotoLayoutCount;
  onSelectLayout: (layout: PhotoLayoutCount) => void;
  onNext: () => void;
  onBack: () => void;
}

export const LayoutSelectionPage: React.FC<LayoutSelectionPageProps> = ({
  selectedLayout,
  onSelectLayout,
  onNext,
  onBack,
}) => {
  // Render miniature layout schematic
  const renderLayoutSchematic = (item: PhotoLayoutOption) => {
    if (item.count === 4) {
      // 1 column x 4 rows
      return (
        <div className="w-20 h-40 bg-zinc-950 border border-white/20 rounded-xl p-1.5 flex flex-col justify-between shadow-inner">
          <div className="h-1 w-6 bg-white/40 rounded-full mx-auto" />
          <div className="space-y-1 my-1">
            {['A', 'B', 'C', 'D'].map((letter, i) => (
              <div
                key={i}
                className="h-6 rounded bg-zinc-800 border border-white/20 flex items-center justify-center text-[9px] font-bold text-zinc-200"
              >
                Pose {letter}
              </div>
            ))}
          </div>
          <div className="text-[6px] text-center font-bold text-zinc-400">SATU.KOSONG8</div>
        </div>
      );
    }

    if (item.count === 6) {
      // 2 columns x 3 rows with Zigzag [A, B], [C, A], [B, C]
      const zigzagSlots = [
        { label: 'Pose A', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
        { label: 'Pose B', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
        { label: 'Pose C', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
        { label: 'Pose A ↗', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-black' },
        { label: 'Pose B ↗', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30 font-black' },
        { label: 'Pose C ↗', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30 font-black' },
      ];

      return (
        <div className="w-32 h-40 bg-zinc-950 border border-white/20 rounded-xl p-1.5 flex flex-col justify-between shadow-inner">
          <div className="h-1 w-8 bg-white/40 rounded-full mx-auto" />
          <div className="grid grid-cols-2 gap-1 my-1">
            {zigzagSlots.map((slot, i) => (
              <div
                key={i}
                className={`h-7 rounded border flex items-center justify-center text-[8px] font-bold ${slot.color}`}
              >
                {slot.label}
              </div>
            ))}
          </div>
          <div className="text-[6px] text-center font-bold text-emerald-400">⚡ 3X TAKE ZIGZAG</div>
        </div>
      );
    }

    // 8 photos: 2 columns x 4 rows with Zigzag [A, B], [C, D], [B, A], [D, C]
    const zigzagSlots8 = [
      { label: 'Pose A', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
      { label: 'Pose B', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
      { label: 'Pose C', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
      { label: 'Pose D', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
      { label: 'Pose B ⇄', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30 font-black' },
      { label: 'Pose A ⇄', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-black' },
      { label: 'Pose D ⇄', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30 font-black' },
      { label: 'Pose C ⇄', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30 font-black' },
    ];

    return (
      <div className="w-32 h-40 bg-zinc-950 border border-white/20 rounded-xl p-1.5 flex flex-col justify-between shadow-inner">
        <div className="h-1 w-8 bg-white/40 rounded-full mx-auto" />
        <div className="grid grid-cols-2 gap-1 my-1">
          {zigzagSlots8.map((slot, i) => (
            <div
              key={i}
              className={`h-5 rounded border flex items-center justify-center text-[7px] font-bold ${slot.color}`}
            >
              {slot.label}
            </div>
          ))}
        </div>
        <div className="text-[6px] text-center font-bold text-blue-400">⚡ 4X TAKE ZIGZAG</div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -15 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-20 flex flex-col items-center justify-center max-w-5xl w-full px-3 py-4"
    >
      <div className="relative w-full rounded-[36px] border border-white/20 bg-black/75 p-6 sm:p-8 md:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl text-center">
        {/* Step Badge */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/20 px-3.5 py-1 text-xs font-bold text-blue-300 border border-blue-500/30">
            <LayoutGrid className="h-3.5 w-3.5" /> Langkah 1: Pilihan Layout
          </span>
        </div>

        {/* Title */}
        <h1 className="font-comic text-2xl sm:text-4xl text-white tracking-wide">
          Pilih Layout Foto
        </h1>
        <h3 className="font-sans text-sm sm:text-base text-zinc-300 mt-1 max-w-xl mx-auto font-medium">
          Tentukan jumlah pose foto kamu: pilihan layout <span className="text-white font-bold">4, 6, atau 8 foto</span> sebelum memilih frame.
        </h3>

        {/* Layout Selection Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          {PHOTO_LAYOUT_OPTIONS.map((item) => {
            const isSelected = selectedLayout === item.count;
            return (
              <motion.div
                key={item.count}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectLayout(item.count)}
                className={`relative rounded-3xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-white bg-white/15 shadow-[0_10px_30px_rgba(255,255,255,0.2)]'
                    : 'border-white/10 bg-zinc-900/60 hover:border-white/30 hover:bg-zinc-900/80'
                }`}
              >
                {/* Header row with badge & check */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/10 text-white border border-white/15">
                      {item.badge}
                    </span>
                    <div
                      className={`h-6 w-6 rounded-full flex items-center justify-center border transition-all ${
                        isSelected
                          ? 'bg-white border-white text-black shadow-md'
                          : 'border-white/30 bg-black/40 text-transparent'
                      }`}
                    >
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    </div>
                  </div>

                  {/* Title & subtitle */}
                  <div className="flex items-baseline gap-2">
                    <span className="font-comic text-3xl sm:text-4xl text-white">
                      {item.count}
                    </span>
                    <span className="font-comic text-lg sm:text-xl text-white">
                      Pose Foto
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-zinc-300 mt-0.5">
                    {item.subtitle}
                  </p>

                  <p className="text-xs text-zinc-400 mt-2 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                {/* Schematic visual */}
                <div className="mt-5 flex items-center justify-center p-3 rounded-2xl bg-black/40 border border-white/5">
                  {renderLayoutSchematic(item)}
                </div>

                {/* Footer status */}
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-zinc-300">
                    {item.count === 4 && '1 Kolom Vertikal'}
                    {item.count === 6 && '2 Kolom x 3 Baris'}
                    {item.count === 8 && '2 Kolom x 4 Baris'}
                  </span>
                  <span
                    className={`text-xs font-bold ${
                      isSelected ? 'text-white' : 'text-zinc-500'
                    }`}
                  >
                    {isSelected ? 'Terpilih' : 'Klik untuk Pilih'}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Action Bottom Bar */}
        <div className="mt-8 pt-5 border-t border-white/10 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-5 py-3 text-xs sm:text-sm font-semibold text-zinc-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer w-full sm:w-auto justify-center"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali</span>
          </button>

          <motion.button
            onClick={onNext}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 rounded-2xl bg-white px-8 py-3.5 font-comic text-base sm:text-lg text-zinc-950 shadow-[0_10px_25px_rgba(255,255,255,0.25)] hover:bg-zinc-100 transition-all cursor-pointer w-full sm:w-auto justify-center"
          >
            <span>Lanjut ke Pemilihan Frame</span>
            <ArrowRight className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
