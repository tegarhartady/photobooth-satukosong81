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
      <div className="w-full rounded-[32px] border border-white/20 bg-black/75 p-6 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl text-center">
        {/* Header */}
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600/20 px-4 py-1 text-xs font-bold text-red-400 border border-red-500/30">
          <Sparkles className="h-3.5 w-3.5 text-red-400" /> PILIH PAKET
        </span>
        <h1 className="mt-2 font-urban text-3xl sm:text-5xl text-white tracking-wide">
          PILIH PAKET PHOTOBOOTH
        </h1>

        {/* 2 Package Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {PHOTOBOOTH_PACKAGES.map((pkg) => {
            const isCombo = pkg.id === 'combo';

            return (
              <motion.div
                key={pkg.id}
                whileHover={{ scale: 1.02, y: -4 }}
                className={`relative flex flex-col justify-between rounded-3xl p-6 sm:p-8 transition-all border-2 ${
                  isCombo
                    ? 'border-red-500 bg-zinc-950/90 shadow-[0_15px_40px_rgba(239,68,68,0.2)]'
                    : 'border-white/20 bg-zinc-950/70 shadow-lg'
                }`}
              >
                {/* Popular Badge */}
                {isCombo && (
                  <div className="absolute -top-3.5 right-6">
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-600 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-white shadow-lg">
                      <Sparkles className="h-3 w-3" /> Rekomendasi
                    </span>
                  </div>
                )}

                <div>
                  <h2 className="font-urban text-2xl sm:text-3xl text-white">
                    {pkg.name}
                  </h2>
                  <div className="mt-1">
                    <span className="font-urban text-3xl sm:text-4xl text-red-500 font-extrabold">
                      {pkg.priceFormatted}
                    </span>
                  </div>

                  {/* Simple Features */}
                  <div className="mt-6 space-y-2.5 text-sm text-zinc-200">
                    <div className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 text-red-500 shrink-0" />
                      <span><strong>{pkg.frames} Frame</strong> pilihan</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 text-red-500 shrink-0" />
                      <span><strong>{pkg.sheets} Lembar</strong> cetak fisik</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 text-red-500 shrink-0" />
                      <span><strong>{pkg.sessions} Sesi</strong> foto bebas</span>
                    </div>
                  </div>
                </div>

                {/* Bottom CTA Button */}
                <div className="mt-8 pt-4 border-t border-white/10">
                  <motion.button
                    onClick={() => onSelectPackage(pkg)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 font-urban text-lg font-bold shadow-lg transition-all cursor-pointer ${
                      isCombo
                        ? 'bg-red-600 text-white hover:bg-red-700 shadow-red-600/30'
                        : 'bg-white text-zinc-950 hover:bg-zinc-200'
                    }`}
                  >
                    <span>PILIH PAKET INI</span>
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
