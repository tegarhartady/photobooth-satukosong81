import React from 'react';
import { motion } from 'motion/react';
import { QrCode, LayoutGrid, Palette, Camera, Sparkles, ArrowRight } from 'lucide-react';

interface PhotoboothStepGuideProps {
  onStartClick: () => void;
}

export const PhotoboothStepGuide: React.FC<PhotoboothStepGuideProps> = ({ onStartClick }) => {
  const steps = [
    {
      stepNumber: 1,
      title: 'Mulai Sesi',
      sub: 'Kode / QR Pay',
      desc: 'Masukkan 6 digit kode dari struk atau bayar instan lewat scan QRIS.',
      badge: 'Langkah 1',
      icon: QrCode,
      illustration: (
        <svg viewBox="0 0 200 130" className="w-full h-24 text-white">
          {/* Card 1: Input Kode */}
          <rect x="15" y="25" width="75" height="85" rx="8" fill="#18181b" stroke="#3f3f46" strokeWidth="2" />
          <rect x="25" y="38" width="55" height="18" rx="4" fill="#27272a" stroke="#a1a1aa" strokeWidth="1" strokeDasharray="3 2" />
          <circle cx="35" cy="47" r="3" fill="#ffffff" />
          <circle cx="45" cy="47" r="3" fill="#ffffff" />
          <circle cx="55" cy="47" r="3" fill="#ffffff" />
          <circle cx="65" cy="47" r="3" fill="#ffffff" />
          <rect x="25" y="66" width="22" height="10" rx="3" fill="#ef4444" />
          <rect x="52" y="66" width="28" height="10" rx="3" fill="#3f3f46" />
          <rect x="25" y="84" width="55" height="16" rx="4" fill="#ffffff" />
          <text x="52" y="96" fill="#000000" fontSize="8" fontWeight="bold" textAnchor="middle">KODE</text>

          {/* Card 2: QRIS Pay */}
          <rect x="110" y="25" width="75" height="85" rx="8" fill="#18181b" stroke="#3f3f46" strokeWidth="2" />
          <rect x="122" y="35" width="51" height="51" rx="4" fill="#ffffff" />
          {/* Mini QR matrix */}
          <rect x="127" y="40" width="16" height="16" fill="#000000" />
          <rect x="130" y="43" width="10" height="10" fill="#ffffff" />
          <rect x="133" y="46" width="4" height="4" fill="#000000" />
          <rect x="151" y="40" width="16" height="16" fill="#000000" />
          <rect x="154" y="43" width="10" height="10" fill="#ffffff" />
          <rect x="157" y="46" width="4" height="4" fill="#000000" />
          <rect x="127" y="64" width="16" height="16" fill="#000000" />
          <rect x="130" y="67" width="10" height="10" fill="#ffffff" />
          <rect x="133" y="70" width="4" height="4" fill="#000000" />
          <rect x="148" y="62" width="6" height="6" fill="#000000" />
          <rect x="158" y="66" width="8" height="8" fill="#000000" />
          <rect x="150" y="74" width="12" height="6" fill="#000000" />
          <text x="147" y="100" fill="#10b981" fontSize="9" fontWeight="bold" textAnchor="middle">QRIS PAY</text>
        </svg>
      ),
    },
    {
      stepNumber: 2,
      title: 'Pilih Layout',
      sub: 'Format Foto',
      desc: 'Pilih susunan strip foto, mulai dari 3-grid vertikal hingga format kolase.',
      badge: 'Langkah 2',
      icon: LayoutGrid,
      illustration: (
        <svg viewBox="0 0 200 130" className="w-full h-24 text-white">
          {/* Layout Strip 1 */}
          <rect x="30" y="18" width="38" height="94" rx="6" fill="#18181b" stroke="#60a5fa" strokeWidth="2" />
          <rect x="35" y="24" width="28" height="22" rx="3" fill="#3b82f6" />
          <rect x="35" y="50" width="28" height="22" rx="3" fill="#60a5fa" />
          <rect x="35" y="76" width="28" height="22" rx="3" fill="#93c5fd" />

          {/* Layout 2x2 Grid */}
          <rect x="80" y="18" width="50" height="94" rx="6" fill="#18181b" stroke="#a1a1aa" strokeWidth="1.5" />
          <rect x="86" y="26" width="18" height="34" rx="3" fill="#3f3f46" />
          <rect x="106" y="26" width="18" height="34" rx="3" fill="#3f3f46" />
          <rect x="86" y="66" width="18" height="34" rx="3" fill="#3f3f46" />
          <rect x="106" y="66" width="18" height="34" rx="3" fill="#3f3f46" />

          {/* Layout Wide */}
          <rect x="140" y="28" width="45" height="74" rx="6" fill="#18181b" stroke="#a1a1aa" strokeWidth="1.5" />
          <rect x="146" y="35" width="33" height="26" rx="3" fill="#3f3f46" />
          <rect x="146" y="66" width="33" height="26" rx="3" fill="#3f3f46" />
        </svg>
      ),
    },
    {
      stepNumber: 3,
      title: 'Pilih Frame',
      sub: 'Warna & Tema',
      desc: 'Pilih bingkai aesthetic yang disukai: Classic White, Dark Studio, hingga Pop Art.',
      badge: 'Langkah 3',
      icon: Palette,
      illustration: (
        <svg viewBox="0 0 200 130" className="w-full h-24 text-white">
          {/* Frame 1: Classic White */}
          <rect x="25" y="20" width="40" height="90" rx="5" fill="#f4f4f5" stroke="#ffffff" strokeWidth="2" />
          <rect x="29" y="26" width="32" height="20" rx="2" fill="#27272a" />
          <rect x="29" y="50" width="32" height="20" rx="2" fill="#27272a" />
          <rect x="29" y="74" width="32" height="20" rx="2" fill="#27272a" />

          {/* Frame 2: Crimson Red */}
          <rect x="80" y="20" width="40" height="90" rx="5" fill="#991b1b" stroke="#ef4444" strokeWidth="2" />
          <rect x="84" y="26" width="32" height="20" rx="2" fill="#27272a" />
          <rect x="84" y="50" width="32" height="20" rx="2" fill="#27272a" />
          <rect x="84" y="74" width="32" height="20" rx="2" fill="#27272a" />

          {/* Frame 3: Pastel Yellow */}
          <rect x="135" y="20" width="40" height="90" rx="5" fill="#fef08a" stroke="#eab308" strokeWidth="2" />
          <rect x="139" y="26" width="32" height="20" rx="2" fill="#27272a" />
          <rect x="139" y="50" width="32" height="20" rx="2" fill="#27272a" />
          <rect x="139" y="74" width="32" height="20" rx="2" fill="#27272a" />
        </svg>
      ),
    },
    {
      stepNumber: 4,
      title: 'Bersiap Foto & Cetak',
      sub: 'Pose & Kirim',
      desc: 'Bersiap foto saat hitung mundur, hasil langsung dicetak dan dapat diunduh.',
      badge: 'Langkah 4',
      icon: Camera,
      illustration: (
        <svg viewBox="0 0 200 130" className="w-full h-24 text-white">
          {/* Flash glow */}
          <circle cx="100" cy="50" r="30" fill="url(#flashGlow)" opacity="0.6" />
          <defs>
            <radialGradient id="flashGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Vector person 1 (left) */}
          <circle cx="70" cy="45" r="13" fill="#fbcfe8" />
          <path d="M70,35 Q60,33 58,45 Q63,55 70,55 Q77,55 82,45 Q80,33 70,35 Z" fill="#1e1b4b" />
          <path d="M52,85 C52,65 88,65 88,85 Z" fill="#ec4899" />
          {/* Peace hand sign */}
          <circle cx="50" cy="62" r="4" fill="#fbcfe8" />
          <line x1="48" y1="62" x2="44" y2="52" stroke="#fbcfe8" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="52" y1="62" x2="52" y2="50" stroke="#fbcfe8" strokeWidth="2.5" strokeLinecap="round" />

          {/* Vector person 2 (right) */}
          <circle cx="120" cy="42" r="14" fill="#fed7aa" />
          <path d="M120,30 Q105,28 106,42 Q112,54 120,54 Q128,54 134,42 Q135,28 120,30 Z" fill="#422006" />
          <path d="M102,85 C102,64 138,64 138,85 Z" fill="#3b82f6" />
          {/* Smile thumb up */}
          <circle cx="140" cy="62" r="4" fill="#fed7aa" />
          <line x1="140" y1="62" x2="140" y2="53" stroke="#fed7aa" strokeWidth="3" strokeLinecap="round" />

          {/* Camera Flash Icon Center */}
          <polygon points="100,20 104,28 112,28 106,34 108,42 100,37 92,42 94,34 88,28 96,28" fill="#fbbf24" />

          {/* Printer Strip on the right */}
          <rect x="156" y="70" width="34" height="22" rx="4" fill="#27272a" stroke="#52525b" />
          <line x1="162" y1="76" x2="184" y2="76" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
          <rect x="160" y="80" width="26" height="38" rx="2" fill="#ffffff" />
          <rect x="163" y="84" width="20" height="9" rx="1" fill="#ec4899" />
          <rect x="163" y="96" width="20" height="9" rx="1" fill="#3b82f6" />
        </svg>
      ),
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
      {/* Header section */}
      <div className="text-center mb-6">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-4 py-1 text-xs font-bold text-zinc-200 backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-yellow-400" /> Panduan Langkah Photobooth
        </span>
        <h2 className="mt-2 font-comic text-2xl sm:text-3xl md:text-4xl text-white tracking-wide drop-shadow-md">
          CARA MUDAH FOTO DI SATU.KOSONG8
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-zinc-300 max-w-md mx-auto">
          Ikuti 4 langkah seru ini sebelum memulai sesi photobox favoritmu!
        </p>
      </div>

      {/* 4 Steps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full px-2">
        {steps.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.stepNumber}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.4 }}
              className="relative flex flex-col rounded-2xl border border-white/15 bg-black/55 backdrop-blur-xl p-4 shadow-xl hover:border-white/30 transition-all group"
            >
              {/* Step Badge */}
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-white/15 px-2.5 py-0.5 text-[11px] font-bold text-white uppercase tracking-wider">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 mr-1" />
                  {item.badge}
                </span>
                <div className="rounded-full bg-white/10 p-1.5 text-zinc-300 group-hover:text-white transition-colors">
                  <Icon className="h-4 w-4" />
                </div>
              </div>

              {/* Vector Illustration */}
              <div className="my-1 rounded-xl bg-zinc-950/60 p-2 border border-white/10 flex items-center justify-center overflow-hidden">
                {item.illustration}
              </div>

              {/* Content */}
              <div className="mt-2.5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-comic text-base sm:text-lg text-white group-hover:text-zinc-100">
                    {item.title}
                  </h4>
                  <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide">
                    {item.sub}
                  </p>
                  <p className="mt-1 text-xs text-zinc-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Action Button */}
      <div className="mt-8 flex flex-col items-center">
        <motion.button
          onClick={onStartClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center gap-3 min-w-[240px] md:min-w-[280px] rounded-2xl bg-white px-8 py-4 shadow-[0_10px_35px_rgba(255,255,255,0.25)] hover:bg-zinc-100 transition-all cursor-pointer group"
        >
          <span className="font-comic text-2xl md:text-3xl text-[#c40e1e] group-hover:text-[#a00010] transition-colors">
            Mulai
          </span>
          <ArrowRight className="h-6 w-6 text-[#c40e1e] group-hover:translate-x-1 transition-transform" />
        </motion.button>
        <span className="mt-2 text-xs text-zinc-400">
          Tekan Mulai untuk memilih metode sesi Anda
        </span>
      </div>
    </div>
  );
};
