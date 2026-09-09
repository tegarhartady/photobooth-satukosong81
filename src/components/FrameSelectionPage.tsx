import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Camera, Check, Palette, Sparkles, Layers, Copy } from 'lucide-react';
import {
  PHOTO_FRAME_OPTIONS,
  PhotoFrameOption,
  PhotoLayoutCount,
  mapTakesToSlots,
} from '../types/photobooth';

interface FrameSelectionPageProps {
  selectedLayout: PhotoLayoutCount;
  allowedFramesCount?: 1 | 2;
  activePackageName?: string;
  selectedFrame1: PhotoFrameOption;
  selectedFrame2: PhotoFrameOption;
  onSelectFrame1: (frame: PhotoFrameOption) => void;
  onSelectFrame2: (frame: PhotoFrameOption) => void;
  onStartPhotoSession: () => void;
  onBack: () => void;
}

export const FrameSelectionPage: React.FC<FrameSelectionPageProps> = ({
  selectedLayout,
  allowedFramesCount = 2,
  activePackageName,
  selectedFrame1,
  selectedFrame2,
  onSelectFrame1,
  onSelectFrame2,
  onStartPhotoSession,
  onBack,
}) => {
  const [activeFrameTab, setActiveFrameTab] = useState<1 | 2>(1);

  const isSingleFrameMode = allowedFramesCount === 1;

  const dummyFrames = ['takeA', 'takeB', 'takeC', 'takeD'];
  const mappedSlots = mapTakesToSlots(dummyFrames, selectedLayout);
  const totalTakesNeeded = selectedLayout === 6 ? 3 : selectedLayout === 8 ? 4 : 4;

  const currentActiveFrame = isSingleFrameMode
    ? selectedFrame1
    : activeFrameTab === 1
    ? selectedFrame1
    : selectedFrame2;

  // Render a single strip preview
  const renderSingleStripPreview = (frame: PhotoFrameOption, label: string, isCurrentTab: boolean) => {
    return (
      <div
        className={`relative rounded-2xl p-3 shadow-2xl transition-all duration-300 border flex flex-col justify-between ${
          isCurrentTab ? 'ring-2 ring-white/60 scale-[1.02]' : 'opacity-85'
        }`}
        style={{
          backgroundColor: frame.bgColor,
          borderColor: frame.borderColor,
          color: frame.textColor,
          width: selectedLayout === 4 ? '145px' : '175px',
          minHeight: '290px',
        }}
      >
        {/* Label Tag on Top */}
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-10">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider shadow-md border ${
              isCurrentTab
                ? 'bg-white text-zinc-950 border-white'
                : 'bg-black/80 text-white border-white/20'
            }`}
          >
            {label}
          </span>
        </div>

        {/* Header Branding */}
        <div className="text-center pt-1 pb-1.5">
          <div
            className="font-comic text-[10px] uppercase tracking-wider font-black"
            style={{ color: frame.textColor }}
          >
            SATU.KOSONG8
          </div>
          <div
            className="font-comic text-[7px] uppercase tracking-widest font-bold opacity-80"
            style={{ color: frame.subTextColor }}
          >
            THE PHOTOBOOTH
          </div>
        </div>

        {/* Photos Grid preview */}
        <div
          className={`grid gap-1 my-1 ${
            selectedLayout === 4 ? 'grid-cols-1' : 'grid-cols-2'
          }`}
        >
          {mappedSlots.map((slot, idx) => (
            <div
              key={idx}
              className="relative aspect-[4/3] rounded-md overflow-hidden flex items-center justify-center border transition-all"
              style={{
                backgroundColor: '#27272a',
                borderColor: frame.photoBorderColor,
              }}
            >
              {/* Pose badge with letter */}
              <div className="flex flex-col items-center justify-center">
                <span className="text-[10px] font-comic font-black text-white/95">
                  Pose {slot.poseChar}
                </span>
                <span className="text-[6px] text-zinc-400 font-bold uppercase tracking-wider">
                  #{slot.takeNumber}
                </span>
              </div>

              {/* Corner accent dot */}
              <div
                className="absolute bottom-0.5 right-0.5 h-1 w-1 rounded-full"
                style={{ backgroundColor: frame.accentColor }}
              />
            </div>
          ))}
        </div>

        {/* Footer Branding & Date */}
        <div className="text-center pt-1 border-t border-black/10">
          <div
            className="text-[7px] font-bold tracking-tight"
            style={{ color: frame.textColor }}
          >
            SATU.KOSONG8 PHOTOBOOTH
          </div>
          <div
            className="text-[6px] opacity-75 font-mono"
            style={{ color: frame.subTextColor }}
          >
            {new Date().toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </div>
        </div>
      </div>
    );
  };

  const handleFrameSelect = (frame: PhotoFrameOption) => {
    if (isSingleFrameMode) {
      onSelectFrame1(frame);
      onSelectFrame2(frame); // synchronize both for identical twin prints
    } else {
      if (activeFrameTab === 1) {
        onSelectFrame1(frame);
      } else {
        onSelectFrame2(frame);
      }
    }
  };

  const handleDuplicateFrame1To2 = () => {
    onSelectFrame2(selectedFrame1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -15 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-20 flex flex-col items-center justify-center max-w-5xl w-full px-3 py-3"
    >
      <div className="relative w-full rounded-[36px] border border-white/20 bg-black/80 p-6 sm:p-8 md:p-9 shadow-[0_25px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl text-center">
        {/* Step Badge */}
        <div className="flex items-center justify-center gap-2 mb-2 flex-wrap">
          <span className="inline-flex items-center gap-1 rounded-full bg-pink-500/20 px-3.5 py-1 text-xs font-bold text-pink-300 border border-pink-500/30">
            <Palette className="h-3.5 w-3.5" />
            {isSingleFrameMode ? 'Langkah 2: Pilihan 1 Frame' : 'Langkah 2: Pilihan 2 Frame Berbeda'}
          </span>
          <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-300 border border-blue-500/30 flex items-center gap-1">
            <Layers className="h-3 w-3" />
            {isSingleFrameMode ? '1 Sesi • 2 Lembar Cetak' : '2 Sesi Berbeda • 4 Lembar Cetak'}
          </span>
          {activePackageName && (
            <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-300 border border-amber-500/30">
              {activePackageName}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="font-comic text-2xl sm:text-4xl text-white tracking-wide">
          {isSingleFrameMode ? 'Pilih 1 Frame Fotomu' : 'Pilih 2 Frame Berbeda'}
        </h1>
        <p className="font-sans text-xs sm:text-sm text-zinc-300 mt-1 max-w-xl mx-auto font-medium">
          {isSingleFrameMode
            ? 'Paket kamu mencakup 1 desain frame favorit untuk sesi pemotretan ini (dicetak 2 lembar identik).'
            : 'Setiap sesi menghasilkan strip cetak 2 versi. Kamu bisa memilih 2 warna frame berbeda untuk masing-masing strip foto!'}
        </p>

        {/* Frame Selector Tabs / Single Frame Indicator */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
          {isSingleFrameMode ? (
            <div className="flex items-center gap-2 rounded-2xl bg-white/15 px-5 py-2.5 text-xs sm:text-sm font-bold text-white border border-white/30 shadow-lg">
              <div
                className="h-4 w-4 rounded-full border border-black/40 shadow-sm"
                style={{ backgroundColor: selectedFrame1.bgColor }}
              />
              <span>Frame Aktif: {selectedFrame1.name} ({selectedFrame1.tagline})</span>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setActiveFrameTab(1)}
                className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer border ${
                  activeFrameTab === 1
                    ? 'bg-white text-zinc-950 border-white shadow-[0_4px_20px_rgba(255,255,255,0.25)] scale-105'
                    : 'bg-zinc-900/80 text-zinc-300 border-white/15 hover:bg-zinc-800'
                }`}
              >
                <div
                  className="h-3.5 w-3.5 rounded-full border border-black/30 shadow-sm"
                  style={{ backgroundColor: selectedFrame1.bgColor }}
                />
                <span>Lembar 1: {selectedFrame1.name}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveFrameTab(2)}
                className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer border ${
                  activeFrameTab === 2
                    ? 'bg-white text-zinc-950 border-white shadow-[0_4px_20px_rgba(255,255,255,0.25)] scale-105'
                    : 'bg-zinc-900/80 text-zinc-300 border-white/15 hover:bg-zinc-800'
                }`}
              >
                <div
                  className="h-3.5 w-3.5 rounded-full border border-black/30 shadow-sm"
                  style={{ backgroundColor: selectedFrame2.bgColor }}
                />
                <span>Lembar 2: {selectedFrame2.name}</span>
              </button>

              {selectedFrame1.id !== selectedFrame2.id && (
                <button
                  type="button"
                  onClick={handleDuplicateFrame1To2}
                  title="Samakan Frame 2 dengan Frame 1"
                  className="flex items-center gap-1.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 px-3 py-2 text-xs font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>Samakan Keduanya</span>
                </button>
              )}
            </>
          )}
        </div>

        {/* Main Content: Left Frame Grid, Right Twin Preview */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Frame Options (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-3 text-left">
            <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
              <span>
                {isSingleFrameMode ? (
                  <>Pilih tema warna frame fotomu:</>
                ) : (
                  <>
                    Memilih tema untuk{' '}
                    <strong className="text-white">
                      {activeFrameTab === 1 ? 'Lembar 1' : 'Lembar 2'}
                    </strong>
                    :
                  </>
                )}
              </span>
              <span className="text-[11px] font-mono text-zinc-400">
                {currentActiveFrame.name}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {PHOTO_FRAME_OPTIONS.map((frame) => {
                const isSelected = currentActiveFrame.id === frame.id;
                return (
                  <motion.div
                    key={frame.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleFrameSelect(frame)}
                    className={`relative rounded-2xl p-3 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-white bg-white/15 shadow-[0_10px_25px_rgba(255,255,255,0.2)]'
                        : 'border-white/10 bg-zinc-900/60 hover:border-white/25 hover:bg-zinc-900/80'
                    }`}
                  >
                    {/* Swatch Circle & Check */}
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className="h-7 w-7 rounded-full border border-black/30 shadow-md flex items-center justify-center"
                        style={{ backgroundColor: frame.bgColor }}
                      >
                        {isSelected && (
                          <Check
                            className="h-4 w-4 stroke-[3]"
                            style={{
                              color:
                                frame.bgColor === '#ffffff' ||
                                frame.bgColor === '#fef08a' ||
                                frame.bgColor === '#cbd5e1' ||
                                frame.bgColor === '#e9d5ff'
                                  ? '#000000'
                                  : '#ffffff',
                            }}
                          />
                        )}
                      </div>

                      <span
                        className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: frame.badgeBg,
                          color: frame.badgeTextColor,
                        }}
                      >
                        {frame.tagline}
                      </span>
                    </div>

                    {/* Frame Name */}
                    <div>
                      <div className="font-comic text-xs sm:text-sm text-white font-bold">
                        {frame.name}
                      </div>
                      <div className="text-[10px] text-zinc-400 mt-0.5">
                        {frame.tagline}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right: Twin Frame Live Preview Side-by-Side (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center bg-zinc-950/60 rounded-3xl p-4 sm:p-5 border border-white/10">
            <div className="text-center mb-3">
              <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center justify-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-yellow-400" />
                {isSingleFrameMode ? 'Pratinjau Hasil Cetak (2 Lembar Identik)' : 'Pratinjau 2 Lembar Cetak Berbeda'}
              </span>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                {isSingleFrameMode
                  ? 'Strip foto identik siap dipotong di tengah'
                  : 'Strip berdampingan siap dipotong di tengah'}
              </p>
            </div>

            {/* Strip Preview Container */}
            <div className="relative flex items-center justify-center gap-3 sm:gap-4 p-3 bg-black/40 rounded-2xl border border-white/10 overflow-x-auto max-w-full">
              {/* Strip 1 */}
              <div
                onClick={() => !isSingleFrameMode && setActiveFrameTab(1)}
                className="cursor-pointer transition-transform"
                title={isSingleFrameMode ? 'Frame Pilihan' : 'Klik untuk ubah Lembar 1'}
              >
                {renderSingleStripPreview(
                  selectedFrame1,
                  isSingleFrameMode ? 'Cetak 1' : 'Lembar 1',
                  isSingleFrameMode || activeFrameTab === 1
                )}
              </div>

              {/* Dotted Cut Line in Middle */}
              <div className="flex flex-col items-center justify-center h-56 my-auto text-zinc-500">
                <div className="w-[1px] h-full border-l-2 border-dashed border-zinc-600" />
                <span className="text-[8px] font-mono font-bold text-zinc-400 py-1 rotate-90 whitespace-nowrap">
                  ✂ POTONG
                </span>
                <div className="w-[1px] h-full border-l-2 border-dashed border-zinc-600" />
              </div>

              {/* Strip 2 */}
              <div
                onClick={() => !isSingleFrameMode && setActiveFrameTab(2)}
                className="cursor-pointer transition-transform"
                title={isSingleFrameMode ? 'Frame Pilihan (Salinan)' : 'Klik untuk ubah Lembar 2'}
              >
                {renderSingleStripPreview(
                  isSingleFrameMode ? selectedFrame1 : selectedFrame2,
                  isSingleFrameMode ? 'Cetak 2' : 'Lembar 2',
                  isSingleFrameMode || activeFrameTab === 2
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/15">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 rounded-full border border-white/20 bg-black/50 px-5 py-2.5 text-xs sm:text-sm font-semibold text-zinc-300 hover:bg-black/75 hover:text-white backdrop-blur-md transition-all cursor-pointer w-full sm:w-auto justify-center"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Ganti Pilihan Layout</span>
          </button>

          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onStartPhotoSession}
            className="flex items-center gap-2.5 rounded-2xl bg-white px-8 py-3.5 font-comic text-base sm:text-lg text-zinc-950 shadow-[0_10px_30px_rgba(255,255,255,0.3)] hover:bg-zinc-100 transition-all cursor-pointer w-full sm:w-auto justify-center"
          >
            <Camera className="h-5 w-5 text-[#c40e1e]" />
            <span>
              {isSingleFrameMode
                ? `Mulai Foto (${totalTakesNeeded}x Take • 1 Frame Selesai Sekaligus)`
                : `Mulai Foto (${totalTakesNeeded}x Take • 2 Frame Berbeda)`}
            </span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
