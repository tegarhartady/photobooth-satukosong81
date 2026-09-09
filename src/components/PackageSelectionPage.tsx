import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Check, Sparkles, Layers, Image, Camera, ArrowRight } from 'lucide-react';
import { PhotoboothPackage, PHOTOBOOTH_PACKAGES } from '../types/photobooth';

interface PackageSelectionPageProps {
  onSelectPackage: (pkg: PhotoboothPackage) => void;
  onBack: () => void;
}

export const PackageSelectionPage: React.FC<PackageSelectionPageProps> = ({
  onSelectPackage,
  onBack,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -15 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="relative z-20 flex flex-col items-center justify-center max-w-4xl w-full px-4"
    >
      {/* Back button */}
      <div className="w-full flex justify-start mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-full border border-white/20 bg-black/50 px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-black/75 hover:text-white backdrop-blur-md transition-all cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Pilihan Sesi</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="w-full rounded-[32px] border border-white/20 bg-black/65 p-8 sm:p-12 shadow-[0_25px_60px_rgba(0,0,0,0.7)] backdrop-blur-2xl text-center">
        {/* Header */}
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1 text-xs font-bold text-zinc-200 border border-white/15">
          <Sparkles className="h-3.5 w-3.5 text-yellow-400" /> Pilih Paket Sesi Foto
        </span>
        <h1 className="mt-3 font-comic text-3xl sm:text-4xl md:text-5xl text-white tracking-wide drop-shadow-md">
          Pilih Paket Photobooth
        </h1>
        <p className="mt-2 text-sm sm:text-base text-zinc-300 max-w-lg mx-auto">
          Pilih paket yang paling sesuai dengan kebutuhan memorimu bersama teman atau pasangan!
        </p>

        {/* 2 Package Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {PHOTOBOOTH_PACKAGES.map((pkg) => {
            const isCombo = pkg.id === 'combo';

            return (
              <motion.div
                key={pkg.id}
                whileHover={{ scale: 1.02, y: -4 }}
                className={`relative flex flex-col justify-between rounded-3xl p-7 transition-all border-2 ${
                  isCombo
                    ? 'border-yellow-400/70 bg-gradient-to-b from-zinc-900/90 to-zinc-950/95 shadow-[0_15px_40px_rgba(234,179,8,0.15)]'
                    : 'border-white/20 bg-zinc-900/80 shadow-xl'
                }`}
              >
                {/* Popular Badge */}
                {isCombo && (
                  <div className="absolute -top-3.5 right-6">
                    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-zinc-950 shadow-lg">
                      <Sparkles className="h-3 w-3" /> Paling Populer
                    </span>
                  </div>
                )}

                <div>
                  {/* Package Title & Price */}
                  <div className="flex flex-col gap-1 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Opsi Paket #{pkg.id === 'hemat' ? '1' : '2'}
                    </span>
                    <h2 className="font-comic text-2xl sm:text-3xl text-white">
                      {pkg.name}
                    </h2>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="font-comic text-3xl sm:text-4xl text-white font-extrabold tracking-tight">
                        {pkg.priceFormatted}
                      </span>
                    </div>
                  </div>

                  {/* Tagline exactly as requested */}
                  <p className="text-xs sm:text-sm text-zinc-300 min-h-[38px] leading-relaxed border-b border-white/10 pb-4">
                    {pkg.tagline}
                  </p>

                  {/* Features list exactly as requested */}
                  <div className="mt-5 space-y-3">
                    <div className="flex items-center gap-3 text-sm text-zinc-200">
                      <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${isCombo ? 'bg-yellow-400/20 text-yellow-400' : 'bg-white/10 text-white'}`}>
                        <Camera className="h-4 w-4" />
                      </div>
                      <span className="font-medium">
                        <strong className="text-white font-bold">{pkg.sessions} sesi</strong> pemotretan
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-zinc-200">
                      <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${isCombo ? 'bg-yellow-400/20 text-yellow-400' : 'bg-white/10 text-white'}`}>
                        <Image className="h-4 w-4" />
                      </div>
                      <span className="font-medium">
                        <strong className="text-white font-bold">{pkg.sheets} lembar foto</strong> cetak
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-zinc-200">
                      <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${isCombo ? 'bg-yellow-400/20 text-yellow-400' : 'bg-white/10 text-white'}`}>
                        <Layers className="h-4 w-4" />
                      </div>
                      <span className="font-medium">
                        <strong className="text-white font-bold">{pkg.frames} frame</strong> pilihan
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom CTA Button */}
                <div className="mt-8 pt-4 border-t border-white/10">
                  <motion.button
                    onClick={() => onSelectPackage(pkg)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 font-comic text-base sm:text-lg shadow-lg transition-all cursor-pointer ${
                      isCombo
                        ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-zinc-950 hover:from-yellow-300 hover:to-amber-400'
                        : 'bg-white text-zinc-950 hover:bg-zinc-200'
                    }`}
                  >
                    <span>Pilih {pkg.name}</span>
                    <ArrowRight className="h-5 w-5" />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
