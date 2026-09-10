import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  RotateCcw,
  Palette,
  Sliders,
  Smile,
  ArrowLeftRight,
  Check,
  CheckCircle2,
} from 'lucide-react';
import {
  PhotoFrameOption,
  PhotoLayoutCount,
  mapTakesToSlots,
  RecordedShot,
} from '../types/photobooth';

export interface StickerItem {
  id: string;
  emoji: string;
  label: string;
  xPct: number;
  yPct: number;
}

export const AVAILABLE_STICKERS = [
  { emoji: '❤️', label: 'Love' },
  { emoji: '⭐', label: 'Star' },
  { emoji: '✨', label: 'Sparkle' },
  { emoji: '🐾', label: 'Paw' },
  { emoji: '🎀', label: 'Bow' },
  { emoji: '🕶️', label: 'Cool' },
  { emoji: '🔥', label: 'Fire' },
  { emoji: '📸', label: 'Camera' },
];

export type CustomFilter = 'normal' | 'warm' | 'vintage' | 'bw';

interface PhotoCustomizationPageProps {
  layoutCount: PhotoLayoutCount;
  allowedFramesCount: 1 | 2;
  frame1: PhotoFrameOption;
  frame2: PhotoFrameOption;
  allAvailableFrames: PhotoFrameOption[];
  session1Photos: string[];
  session2Photos: string[];
  allRecordedShots: RecordedShot[];
  onFinishCustomization: (customizedData: {
    finalPhotos1: string[];
    finalPhotos2: string[];
    customFrame1: PhotoFrameOption;
    customFrame2: PhotoFrameOption;
    filter: CustomFilter;
    stickers1: StickerItem[];
    stickers2: StickerItem[];
  }) => void;
}

export const PhotoCustomizationPage: React.FC<PhotoCustomizationPageProps> = ({
  layoutCount,
  allowedFramesCount,
  frame1,
  frame2,
  allAvailableFrames,
  session1Photos,
  session2Photos,
  allRecordedShots,
  onFinishCustomization,
}) => {
  // Active Sheet tab (for 2-frame mode)
  const [activeSheetTab, setActiveSheetTab] = useState<1 | 2>(1);

  // Photos state for each sheet
  const [photosSheet1, setPhotosSheet1] = useState<string[]>([...session1Photos]);
  const [photosSheet2, setPhotosSheet2] = useState<string[]>([...session2Photos]);

  // Selected frame options
  const [currentFrame1, setCurrentFrame1] = useState<PhotoFrameOption>(frame1);
  const [currentFrame2, setCurrentFrame2] = useState<PhotoFrameOption>(frame2);

  // Global Filter
  const [filter, setFilter] = useState<CustomFilter>('normal');

  // Stickers placed on strips
  const [stickers1, setStickers1] = useState<StickerItem[]>([]);
  const [stickers2, setStickers2] = useState<StickerItem[]>([]);

  // Selected slot for swapping or replacing
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);

  // Active Tool panel
  const [activeTool, setActiveTool] = useState<'SWAP' | 'FRAME' | 'FILTER' | 'STICKER'>('SWAP');

  const activePhotos = activeSheetTab === 1 ? photosSheet1 : photosSheet2;
  const setPhotosForActive = (updater: (prev: string[]) => string[]) => {
    if (activeSheetTab === 1) {
      setPhotosSheet1(updater);
    } else {
      setPhotosSheet2(updater);
    }
  };

  const activeFrame = activeSheetTab === 1 ? currentFrame1 : currentFrame2;
  const setFrameForActive = (f: PhotoFrameOption) => {
    if (activeSheetTab === 1) {
      setCurrentFrame1(f);
    } else {
      setCurrentFrame2(f);
    }
  };

  const activeStickers = activeSheetTab === 1 ? stickers1 : stickers2;
  const setStickersForActive = (updater: (prev: StickerItem[]) => StickerItem[]) => {
    if (activeSheetTab === 1) {
      setStickers1(updater);
    } else {
      setStickers2(updater);
    }
  };

  // Map slots for visual strip
  const mappedSlots = mapTakesToSlots(activePhotos, layoutCount);

  // Handle swapping two slots or replacing with an alternate take
  const handleSlotClick = (clickedSlotTakeNumber: number) => {
    const clickedIdx = clickedSlotTakeNumber - 1;
    if (selectedSlotIndex === null) {
      setSelectedSlotIndex(clickedIdx);
    } else if (selectedSlotIndex === clickedIdx) {
      setSelectedSlotIndex(null);
    } else {
      // Swap two slots!
      setPhotosForActive((prev) => {
        const next = [...prev];
        const temp = next[selectedSlotIndex];
        next[selectedSlotIndex] = next[clickedIdx];
        next[clickedIdx] = temp;
        return next;
      });
      setSelectedSlotIndex(null);
    }
  };

  const handlePickAlternatePhoto = (photoUrl: string) => {
    if (selectedSlotIndex === null) return;
    setPhotosForActive((prev) => {
      const next = [...prev];
      next[selectedSlotIndex] = photoUrl;
      return next;
    });
    setSelectedSlotIndex(null);
  };

  // Add sticker to strip
  const handleAddSticker = (emoji: string, label: string) => {
    const newSticker: StickerItem = {
      id: `stk-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      emoji,
      label,
      xPct: 20 + Math.random() * 60,
      yPct: 20 + Math.random() * 60,
    };
    setStickersForActive((prev) => [...prev, newSticker]);
  };

  const handleRemoveSticker = (id: string) => {
    setStickersForActive((prev) => prev.filter((s) => s.id !== id));
  };

  // Filter CSS mapping
  const getFilterStyle = (f: CustomFilter) => {
    switch (f) {
      case 'warm':
        return 'contrast(106%) saturate(125%) sepia(12%) brightness(102%)';
      case 'bw':
        return 'grayscale(100%) contrast(120%) brightness(104%)';
      case 'vintage':
        return 'sepia(35%) contrast(110%) brightness(96%) saturate(110%)';
      case 'normal':
      default:
        return 'none';
    }
  };

  // Finish customization
  const handleConfirm = () => {
    onFinishCustomization({
      finalPhotos1: photosSheet1,
      finalPhotos2: allowedFramesCount === 1 ? photosSheet1 : photosSheet2,
      customFrame1: currentFrame1,
      customFrame2: allowedFramesCount === 1 ? currentFrame1 : currentFrame2,
      filter,
      stickers1,
      stickers2: allowedFramesCount === 1 ? stickers1 : stickers2,
    });
  };

  return (
    <div className="relative z-30 mx-auto w-full max-w-5xl px-4 py-4 md:py-6 text-zinc-900">
      {/* Header Bar */}
      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-red-100 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-600 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest text-red-600">
              SATU.KOSONG8
            </span>
          </div>
          <h1 className="font-comic text-xl sm:text-2xl font-black text-zinc-950 mt-0.5">
            Kustomisasi Frame & Foto
          </h1>
        </div>

        {/* Primary Action Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleConfirm}
          className="flex items-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 px-6 py-3 text-sm font-black text-white shadow-lg shadow-red-600/30 transition-all cursor-pointer border border-red-500"
        >
          <span>Selesai & Lanjut Cetak</span>
          <ArrowRight className="h-4 w-4 stroke-[3]" />
        </motion.button>
      </div>

      {/* Main Grid: Strip Preview on Left, Tools on Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
        {/* Left Column: Strip Preview (4-5 cols) */}
        <div className="md:col-span-5 flex flex-col items-center bg-white p-4 sm:p-5 rounded-3xl border border-red-100 shadow-md">
          {/* Sheet Selector (if 2 frames) */}
          {allowedFramesCount === 2 && (
            <div className="w-full grid grid-cols-2 gap-2 mb-3">
              <button
                type="button"
                onClick={() => {
                  setActiveSheetTab(1);
                  setSelectedSlotIndex(null);
                }}
                className={`py-2 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 border ${
                  activeSheetTab === 1
                    ? 'bg-red-600 text-white border-red-600 shadow-sm'
                    : 'bg-zinc-100 text-zinc-600 border-zinc-200 hover:bg-zinc-200'
                }`}
              >
                <span>Lembar 1 ({currentFrame1.name})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveSheetTab(2);
                  setSelectedSlotIndex(null);
                }}
                className={`py-2 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 border ${
                  activeSheetTab === 2
                    ? 'bg-red-600 text-white border-red-600 shadow-sm'
                    : 'bg-zinc-100 text-zinc-600 border-zinc-200 hover:bg-zinc-200'
                }`}
              >
                <span>Lembar 2 ({currentFrame2.name})</span>
              </button>
            </div>
          )}

          {/* Hint */}
          <div className="w-full text-center text-xs text-zinc-500 mb-2">
            {selectedSlotIndex !== null ? (
              <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                Klik slot lain untuk menukar posisi foto ini
              </span>
            ) : (
              <span>Klik pada foto di strip untuk menukar posisinya</span>
            )}
          </div>

          {/* Physical Strip Card Preview */}
          <div
            className="relative rounded-2xl p-3 shadow-xl transition-all border flex flex-col justify-between"
            style={{
              backgroundColor: activeFrame.bgColor,
              borderColor: activeFrame.borderColor,
              color: activeFrame.textColor,
              width: layoutCount === 4 ? '190px' : '230px',
              minHeight: '380px',
            }}
          >
            {/* Header Branding */}
            <div className="text-center pt-1 pb-1">
              <div
                className="font-comic text-xs uppercase tracking-wider font-black"
                style={{ color: activeFrame.textColor }}
              >
                SATU.KOSONG8
              </div>
              <div
                className="font-comic text-[8px] uppercase tracking-widest font-bold opacity-80"
                style={{ color: activeFrame.subTextColor }}
              >
                THE PHOTOBOOTH
              </div>
            </div>

            {/* Photo Slots Grid */}
            <div
              className={`grid gap-1.5 my-1.5 ${
                layoutCount === 4 ? 'grid-cols-1' : 'grid-cols-2'
              }`}
            >
              {mappedSlots.map((slot, idx) => {
                const isSelected = selectedSlotIndex === slot.takeNumber - 1;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSlotClick(slot.takeNumber)}
                    className={`group relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'ring-4 ring-red-600 scale-[1.03] z-10'
                        : 'hover:opacity-90'
                    }`}
                    style={{
                      borderColor: isSelected ? '#dc2626' : activeFrame.photoBorderColor,
                    }}
                  >
                    {slot.frame ? (
                      <img
                        src={slot.frame}
                        alt={`Pose ${slot.poseChar}`}
                        className="h-full w-full object-cover"
                        style={{ filter: getFilterStyle(filter) }}
                      />
                    ) : (
                      <div className="h-full w-full bg-zinc-800 flex items-center justify-center text-xs text-white">
                        Pose {slot.poseChar}
                      </div>
                    )}

                    {/* Slot badge */}
                    <div className="absolute top-1 left-1 rounded bg-black/75 px-1.5 py-0.5 text-[9px] font-black text-white">
                      Pose {slot.poseChar}
                    </div>

                    {/* Selection Indicator */}
                    {isSelected && (
                      <div className="absolute inset-0 bg-red-600/20 flex items-center justify-center">
                        <span className="rounded-full bg-red-600 p-1 text-white shadow-lg">
                          <ArrowLeftRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Stickers Overlay */}
            {activeStickers.map((stk) => (
              <div
                key={stk.id}
                onClick={() => handleRemoveSticker(stk.id)}
                title="Klik untuk hapus stiker"
                className="absolute text-xl select-none cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-transform"
                style={{ left: `${stk.xPct}%`, top: `${stk.yPct}%` }}
              >
                {stk.emoji}
              </div>
            ))}

            {/* Footer Branding */}
            <div className="text-center pt-1.5 border-t border-black/10">
              <div
                className="text-[8px] font-bold tracking-tight"
                style={{ color: activeFrame.textColor }}
              >
                SATU.KOSONG8 PHOTOBOOTH
              </div>
              <div
                className="text-[7px] opacity-75 font-mono"
                style={{ color: activeFrame.subTextColor }}
              >
                {new Date().toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Customization Controls (7 cols) */}
        <div className="md:col-span-7 flex flex-col gap-4">
          {/* Tool Navigation Tabs */}
          <div className="grid grid-cols-4 gap-1.5 bg-white p-1.5 rounded-2xl border border-red-100 shadow-sm">
            <button
              type="button"
              onClick={() => setActiveTool('SWAP')}
              className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                activeTool === 'SWAP'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              <ArrowLeftRight className="h-3.5 w-3.5" />
              <span>Tukar Foto</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTool('FRAME')}
              className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                activeTool === 'FRAME'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              <Palette className="h-3.5 w-3.5" />
              <span>Warna Frame</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTool('FILTER')}
              className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                activeTool === 'FILTER'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              <Sliders className="h-3.5 w-3.5" />
              <span>Filter</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTool('STICKER')}
              className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                activeTool === 'STICKER'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              <Smile className="h-3.5 w-3.5" />
              <span>Stiker</span>
            </button>
          </div>

          {/* Tool Card Content */}
          <div className="bg-white p-5 rounded-3xl border border-red-100 shadow-md min-h-[340px]">
            {/* 1. SWAP / REORDER TOOL */}
            {activeTool === 'SWAP' && (
              <div className="flex flex-col gap-3">
                <div>
                  <h3 className="font-bold text-zinc-900 text-sm">
                    Ganti Foto atau Tukar Urutan
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Pilih slot di strip kiri, lalu klik foto di bawah ini untuk memasukkannya ke slot tersebut.
                  </p>
                </div>

                {/* Available Shots Roll */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-56 overflow-y-auto p-1">
                  {allRecordedShots.map((shot, idx) => (
                    <button
                      key={shot.id}
                      type="button"
                      disabled={selectedSlotIndex === null}
                      onClick={() => handlePickAlternatePhoto(shot.photoUrl)}
                      className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        selectedSlotIndex === null
                          ? 'opacity-80 hover:opacity-100'
                          : 'hover:scale-105 border-red-500 shadow-md ring-2 ring-red-400'
                      }`}
                    >
                      <img
                        src={shot.photoUrl}
                        alt="Take"
                        className="h-full w-full object-cover"
                        style={{ filter: getFilterStyle(filter) }}
                      />
                      <div className="absolute bottom-1 left-1 rounded bg-black/75 px-1.5 py-0.5 text-[8px] font-bold text-white">
                        L{shot.frameIndex} #{shot.poseChar} (Take {shot.attempt})
                      </div>
                      {!shot.isAccepted && (
                        <div className="absolute top-1 right-1 rounded bg-amber-500 px-1 text-[7px] font-black text-zinc-950 uppercase">
                          Retake
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {selectedSlotIndex === null && (
                  <div className="rounded-xl bg-zinc-50 p-3 text-center text-xs text-zinc-500 border border-dashed border-zinc-300">
                    👈 <strong>Tips:</strong> Klik salah satu foto di frame sebelah kiri dulu untuk memilih slot yang mau diganti.
                  </div>
                )}
              </div>
            )}

            {/* 2. FRAME COLOR / THEME TOOL */}
            {activeTool === 'FRAME' && (
              <div className="flex flex-col gap-3">
                <div>
                  <h3 className="font-bold text-zinc-900 text-sm">
                    Pilihan Warna Frame
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Ganti warna bingkai untuk {allowedFramesCount === 2 ? `Lembar ${activeSheetTab}` : 'cetakanmu'}.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto p-1">
                  {allAvailableFrames.map((f) => {
                    const isSelected = activeFrame.id === f.id;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setFrameForActive(f)}
                        className={`flex items-center gap-2 p-2 rounded-xl border transition-all cursor-pointer text-left ${
                          isSelected
                            ? 'border-red-600 bg-red-50/50 shadow-sm ring-2 ring-red-500'
                            : 'border-zinc-200 hover:border-zinc-300 bg-white'
                        }`}
                      >
                        <span
                          className="h-6 w-6 rounded-full border border-black/10 shadow-sm shrink-0 flex items-center justify-center"
                          style={{ backgroundColor: f.bgColor }}
                        >
                          {isSelected && <Check className="h-3.5 w-3.5 text-zinc-950" />}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-zinc-900 truncate">
                            {f.name}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. FILTER TOOL */}
            {activeTool === 'FILTER' && (
              <div className="flex flex-col gap-3">
                <div>
                  <h3 className="font-bold text-zinc-900 text-sm">
                    Tone Warna / Filter Foto
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Filter diterapkan merata ke semua foto dalam frame.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(
                    [
                      { id: 'normal', name: 'Asli (Normal)', desc: 'Warna natural kamera' },
                      { id: 'warm', name: 'Hangat (Warm)', desc: 'Nuansa cerah lembut' },
                      { id: 'vintage', name: 'Vintage 90s', desc: 'Tone film klasik' },
                      { id: 'bw', name: 'Monochrome', desc: 'Hitam & putih elegan' },
                    ] as const
                  ).map((fil) => (
                    <button
                      key={fil.id}
                      type="button"
                      onClick={() => setFilter(fil.id)}
                      className={`flex flex-col p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        filter === fil.id
                          ? 'border-red-600 bg-red-50 text-red-700 shadow-sm ring-2 ring-red-500'
                          : 'border-zinc-200 hover:border-zinc-300 bg-white text-zinc-700'
                      }`}
                    >
                      <span className="font-bold text-xs">{fil.name}</span>
                      <span className="text-[10px] text-zinc-400 mt-0.5">{fil.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 4. STICKER TOOL */}
            {activeTool === 'STICKER' && (
              <div className="flex flex-col gap-3">
                <div>
                  <h3 className="font-bold text-zinc-900 text-sm">
                    Tambah Stiker Photobooth
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Klik stiker untuk menempelkannya ke frame. Klik stiker di preview untuk menghapusnya.
                  </p>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
                  {AVAILABLE_STICKERS.map((stk) => (
                    <button
                      key={stk.label}
                      type="button"
                      onClick={() => handleAddSticker(stk.emoji, stk.label)}
                      className="flex flex-col items-center justify-center p-3 rounded-2xl border border-zinc-200 hover:border-red-400 hover:bg-red-50/40 transition-all cursor-pointer"
                    >
                      <span className="text-2xl">{stk.emoji}</span>
                      <span className="text-[10px] font-medium text-zinc-600 mt-1">
                        {stk.label}
                      </span>
                    </button>
                  ))}
                </div>

                {activeStickers.length > 0 && (
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
                    <span className="text-xs text-zinc-500">
                      {activeStickers.length} stiker terpasang
                    </span>
                    <button
                      type="button"
                      onClick={() => setStickersForActive(() => [])}
                      className="text-xs text-red-600 hover:underline font-semibold cursor-pointer"
                    >
                      Hapus Semua Stiker
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
