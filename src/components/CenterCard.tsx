import React from 'react';
import { motion } from 'motion/react';
import { FlipHorizontal, SlidersHorizontal, ArrowRight, QrCode, LayoutGrid, Palette, Camera, Sparkles } from 'lucide-react';

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
  const steps = [
    {
      step: '01',
      title: 'Mulai Sesi',
      sub: 'Kode Struk / QRIS',
      desc: 'Masukkan 6 digit kode struk atau scan QRIS langsung.',
      icon: QrCode,
      illustration: (
        <svg viewBox="0 0 160 100" className="w-full h-16 text-white">
          <rect x="15" y="15" width="55" height="70" rx="6" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />
          <rect x="23" y="25" width="39" height="14" rx="3" fill="#27272a" stroke="#71717a" strokeWidth="1" strokeDasharray="2 2" />
          <circle cx="31" cy="32" r="2" fill="#ef4444" />
          <circle cx="38" cy="32" r="2" fill="#ef4444" />
          <circle cx="45" cy="32" r="2" fill="#ef4444" />
          <circle cx="53" cy="32" r="2" fill="#ef4444" />
          <rect x="23" y="60" width="39" height="14" rx="3" fill="#ffffff" />
          <text x="42" y="70" fill="#000000" fontSize="7" fontWeight="bold" textAnchor="middle">KODE</text>

          <rect x="90" y="15" width="55" height="70" rx="6" fill="#18181b" stroke="#c40e1e" strokeWidth="1.5" />
          <rect x="100" y="24" width="35" height="35" rx="3" fill="#ffffff" />
          <rect x="104" y="28" width="10" height="10" fill="#000" />
          <rect x="106" y="30" width="6" height="6" fill="#fff" />
          <rect x="108" y="32" width="2" height="2" fill="#000" />
          <rect x="121" y="28" width="10" height="10" fill="#000" />
          <rect x="123" y="30" width="6" height="6" fill="#fff" />
          <rect x="104" y="45" width="10" height="10" fill="#000" />
          <rect x="119" y="44" width="5" height="5" fill="#000" />
          <rect x="116" y="51" width="8" height="4" fill="#000" />
          <text x="117" y="72" fill="#ef4444" fontSize="8" fontWeight="bold" textAnchor="middle">QRIS PAY</text>
        </svg>
      ),
    },
    {
      step: '02',
      title: 'Pilih Layout',
      sub: 'Grid Kolase Foto',
      desc: 'Pilihan 4 Pose strip atau kolase 6 & 8 foto zigzag.',
      icon: LayoutGrid,
      illustration: (
        <svg viewBox="0 0 160 100" className="w-full h-16 text-white">
          <rect x="25" y="10" width="32" height="80" rx="4" fill="#18181b" stroke="#c40e1e" strokeWidth="1.5" />
          <rect x="29" y="16" width="24" height="18" rx="2" fill="#ef4444" />
          <rect x="29" y="38" width="24" height="18" rx="2" fill="#b91c1c" />
          <rect x="29" y="60" width="24" height="18" rx="2" fill="#7f1d1d" />

          <rect x="75" y="10" width="44" height="80" rx="4" fill="#18181b" stroke="#52525b" strokeWidth="1" />
          <rect x="80" y="17" width="15" height="28" rx="2" fill="#3f3f46" />
          <rect x="99" y="17" width="15" height="28" rx="2" fill="#3f3f46" />
          <rect x="80" y="51" width="15" height="28" rx="2" fill="#3f3f46" />
          <rect x="99" y="51" width="15" height="28" rx="2" fill="#3f3f46" />
        </svg>
      ),
    },
    {
      step: '03',
      title: 'Pilih Frame',
      sub: 'Warna & Desain',
      desc: 'Pilih 1 atau 2 warna bingkai aesthetic sesuai paket.',
      icon: Palette,
      illustration: (
        <svg viewBox="0 0 160 100" className="w-full h-16 text-white">
          <rect x="25" y="12" width="32" height="76" rx="4" fill="#ffffff" stroke="#ffffff" strokeWidth="1.5" />
          <rect x="29" y="18" width="24" height="16" rx="2" fill="#27272a" />
          <rect x="29" y="38" width="24" height="16" rx="2" fill="#27272a" />
          <rect x="29" y="58" width="24" height="16" rx="2" fill="#27272a" />

          <rect x="70" y="12" width="32" height="76" rx="4" fill="#991b1b" stroke="#ef4444" strokeWidth="1.5" />
          <rect x="74" y="18" width="24" height="16" rx="2" fill="#27272a" />
          <rect x="74" y="38" width="24" height="16" rx="2" fill="#27272a" />
          <rect x="74" y="58" width="24" height="16" rx="2" fill="#27272a" />

          <rect x="115" y="12" width="32" height="76" rx="4" fill="#18181b" stroke="#71717a" strokeWidth="1.5" />
          <rect x="119" y="18" width="24" height="16" rx="2" fill="#27272a" />
          <rect x="119" y="38" width="24" height="16" rx="2" fill="#27272a" />
          <rect x="119" y="58" width="24" height="16" rx="2" fill="#27272a" />
        </svg>
      ),
    },
    {
      step: '04',
      title: 'Pose & Cetak',
      sub: 'Live Photo & Print',
      desc: 'Ambil foto, simpan Live Photo & print 2 lembar cetak.',
      icon: Camera,
      illustration: (
        <svg viewBox="0 0 160 100" className="w-full h-16 text-white">
          {/* Person left */}
          <circle cx="55" cy="38" r="11" fill="#fed7aa" />
          <path d="M55,29 Q47,27 45,38 Q49,47 55,47 Q61,47 65,38 Q63,27 55,29 Z" fill="#09090b" />
          <path d="M40,75 C40,58 70,58 70,75 Z" fill="#dc2626" />
          {/* Peace sign */}
          <line x1="38" y1="52" x2="34" y2="43" stroke="#fed7aa" strokeWidth="2" strokeLinecap="round" />
          <line x1="41" y1="52" x2="41" y2="41" stroke="#fed7aa" strokeWidth="2" strokeLinecap="round" />

          {/* Person right */}
          <circle cx="95" cy="35" r="12" fill="#fbcfe8" />
          <path d="M95,25 Q82,23 83,35 Q88,46 95,46 Q102,46 107,35 Q108,23 95,25 Z" fill="#27272a" />
          <path d="M80,75 C80,56 110,56 110,75 Z" fill="#18181b" />
          <line x1="112" y1="54" x2="112" y2="46" stroke="#fbcfe8" strokeWidth="2.5" strokeLinecap="round" />

          {/* Flash star red */}
          <polygon points="80,14 83,21 90,21 85,26 87,33 80,29 73,33 75,26 70,21 77,21" fill="#ef4444" />

          {/* Printer strip right */}
          <rect x="122" y="52" width="26" height="18" rx="3" fill="#27272a" stroke="#71717a" />
          <rect x="125" y="60" width="20" height="28" rx="2" fill="#ffffff" />
          <rect x="127" y="63" width="16" height="7" fill="#dc2626" />
          <rect x="127" y="73" width="16" height="7" fill="#18181b" />
        </svg>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.88, y: -20 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-20 flex flex-col items-center justify-center max-w-5xl w-full px-3 py-4"
    >
      {/* Frosted Streetwear Kiosk Panel */}
      <div
        id="main-photobooth-card"
        className="relative w-full rounded-[36px] border border-red-500/25 bg-black/75 p-6 sm:p-8 md:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.85)] backdrop-blur-2xl text-center overflow-hidden"
      >
        {/* Subtle Ambient Red Glow in Kiosk Corner */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-red-600/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-red-600/15 blur-3xl" />

        {/* Top Streetwear Brand Tag */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 border border-red-500/30 px-3.5 py-1 text-[11px] font-esports font-bold tracking-widest text-red-400 uppercase">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
            LIVE PHOTOBOOTH EXPERIENCE // EST. 2024
          </span>
        </div>

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

        {/* 4 Steps Guide styled with Streetwear/Techwear Cards */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="text-center mb-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-esports font-bold tracking-widest text-zinc-300 uppercase bg-zinc-900/90 px-4 py-1 rounded-full border border-red-500/20">
              <Sparkles className="h-3 w-3 text-red-400" />
              PANDUAN 4 LANGKAH PHOTOBOX
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-left">
            {steps.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="rounded-2xl border border-white/10 bg-zinc-950/70 p-3.5 flex flex-col justify-between hover:border-red-500/40 hover:bg-zinc-900/80 transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-esports text-[10px] font-bold text-red-400 bg-red-500/15 border border-red-500/20 px-2 py-0.5 rounded">
                        STEP {item.step}
                      </span>
                      <Icon className="h-3.5 w-3.5 text-zinc-400 group-hover:text-red-400 transition-colors" />
                    </div>
                    <div className="rounded-xl bg-black/60 p-1.5 border border-white/5 my-1.5 flex items-center justify-center">
                      {item.illustration}
                    </div>
                    <h3 className="font-urban text-sm sm:text-base text-white mt-1 tracking-wide">
                      {item.title}
                    </h3>
                    <p className="font-esports text-[10px] font-bold text-red-400 uppercase tracking-wider">
                      {item.sub}
                    </p>
                    <p className="text-[11px] text-zinc-300 mt-0.5 line-clamp-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Big Signature Streetwear RED "Mulai" Button */}
        <div className="mt-8 flex flex-col items-center gap-2.5">
          <motion.button
            id="start-photobooth-btn"
            onClick={onStart}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="group relative flex items-center justify-center gap-3 min-w-[260px] sm:min-w-[320px] rounded-2xl bg-gradient-to-r from-[#b91c1c] via-[#dc2626] to-[#ef4444] px-10 py-4 text-white shadow-[0_12px_40px_rgba(220,38,38,0.55)] border-2 border-white/25 transition-all hover:brightness-110 hover:shadow-[0_16px_50px_rgba(239,68,68,0.75)] cursor-pointer"
          >
            <Camera className="h-6 w-6 text-white group-hover:rotate-12 transition-transform" />
            <span className="font-urban text-2xl sm:text-3xl uppercase tracking-wider text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              SENTUH UNTUK MULAI
            </span>
            <ArrowRight className="h-6 w-6 text-white group-hover:translate-x-1.5 transition-transform" />
          </motion.button>
          <span className="font-esports text-xs tracking-wider text-zinc-400">
            Tekan tombol untuk memasukkan kode struk kasir atau scan QRIS
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
