import React from 'react';
import { motion } from 'motion/react';
import { QrCode, LayoutGrid, Palette, Camera, ArrowRight, ArrowLeft } from 'lucide-react';

interface PhotoboothStepGuideProps {
  onNext: () => void;
  onBack: () => void;
}

export const PhotoboothStepGuide: React.FC<PhotoboothStepGuideProps> = ({ onNext, onBack }) => {
  const steps = [
    {
      step: '01',
      title: 'Mulai Sesi',
      desc: 'Masukkan kode kasir atau scan QRIS.',
      icon: QrCode,
    },
    {
      step: '02',
      title: 'Pilih Layout',
      desc: 'Pilih jumlah pose foto (4, 6, atau 8).',
      icon: LayoutGrid,
    },
    {
      step: '03',
      title: 'Pilih Frame',
      desc: 'Pilih warna bingkai favoritmu.',
      icon: Palette,
    },
    {
      step: '04',
      title: 'Pose & Kustom',
      desc: 'Ambil foto, tukar posisi & cetak.',
      icon: Camera,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, y: -15 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="relative z-20 flex flex-col items-center justify-center max-w-4xl w-full px-4 py-4"
    >
      {/* Back Button */}
      <div className="w-full flex justify-start mb-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-xs font-bold text-zinc-700 hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali</span>
        </button>
      </div>

      {/* Main White Card with Red Accents */}
      <div className="relative w-full rounded-3xl border-2 border-red-100 bg-white p-6 sm:p-8 shadow-xl text-center overflow-hidden">
        {/* Brand Tag */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
          <span className="text-xs font-black uppercase tracking-widest text-red-600">
            SATU.KOSONG8 PHOTOBOOTH
          </span>
        </div>

        {/* Title */}
        <h1 className="font-comic text-2xl sm:text-3xl font-black text-zinc-950">
          Panduan 4 Langkah
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1 max-w-md mx-auto">
          Ikuti langkah mudah ini untuk berfoto dan mencetak strip fotomu.
        </p>

        {/* 4 Steps Grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index, duration: 0.25 }}
                className="rounded-2xl border border-red-100 bg-red-50/40 p-4 flex flex-col justify-between hover:border-red-300 hover:bg-red-50 transition-all shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[11px] font-black text-white bg-red-600 px-2 py-0.5 rounded-md">
                      {item.step}
                    </span>
                    <Icon className="h-5 w-5 text-red-600" />
                  </div>
                  <h3 className="font-comic text-base text-zinc-950 font-bold">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Big Action Button to Continue */}
        <div className="mt-6 sm:mt-8 flex flex-col items-center gap-2">
          <motion.button
            onClick={onNext}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2.5 min-w-[260px] sm:min-w-[300px] rounded-2xl bg-red-600 hover:bg-red-700 px-8 py-3.5 text-white font-black text-sm sm:text-base shadow-lg shadow-red-600/30 transition-all cursor-pointer border border-red-500"
          >
            <span>Lanjut Mulai Sesi</span>
            <ArrowRight className="h-5 w-5 text-white" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
