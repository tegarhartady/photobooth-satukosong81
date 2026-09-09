import React from 'react';
import { motion } from 'motion/react';
import { KeyRound, QrCode, ArrowLeft, ChevronRight, ReceiptText, Wallet } from 'lucide-react';

interface StartSessionPageProps {
  onSelectHaveCode: () => void;
  onSelectNoCode: () => void;
  onBack: () => void;
}

export const StartSessionPage: React.FC<StartSessionPageProps> = ({
  onSelectHaveCode,
  onSelectNoCode,
  onBack,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -15 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="relative z-20 flex flex-col items-center justify-center max-w-3xl w-full px-4"
    >
      {/* Back button */}
      <div className="w-full flex justify-start mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-full border border-white/20 bg-black/50 px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-black/75 hover:text-white backdrop-blur-md transition-all cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali</span>
        </button>
      </div>

      {/* Main Glass Panel */}
      <div className="w-full rounded-[32px] border border-white/20 bg-black/60 p-8 sm:p-12 shadow-[0_25px_60px_rgba(0,0,0,0.7)] backdrop-blur-2xl text-center">
        {/* Exact tag requested: h1 "Mari mulai sesi anda" */}
        <h1 className="font-comic text-3xl sm:text-4xl md:text-5xl text-white tracking-wide drop-shadow-md">
          Mari mulai sesi anda
        </h1>

        {/* Exact tag requested: h3 "Pilih salah satu untuk mulai sesi foto." */}
        <h3 className="mt-2 text-sm sm:text-base md:text-lg text-zinc-300 font-medium max-w-md mx-auto">
          Pilih salah satu untuk mulai sesi foto.
        </h3>

        {/* 2 Choice Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
          {/* Card 1: Punya Kode? */}
          <motion.button
            id="card-have-code"
            onClick={onSelectHaveCode}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="group relative flex flex-col justify-between rounded-2xl border-2 border-white/20 bg-zinc-900/80 p-6 shadow-xl transition-all hover:border-white hover:bg-zinc-800/90 cursor-pointer overflow-hidden"
          >
            <div className="absolute top-0 right-0 h-28 w-28 bg-white/5 rounded-full blur-2xl -mr-6 -mt-6 group-hover:bg-white/10 transition-colors" />

            <div>
              {/* Icon badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-zinc-950 shadow-md">
                  <KeyRound className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-zinc-300 border border-white/10">
                  Struk Pembelian
                </span>
              </div>

              {/* Title & Description */}
              <h2 className="font-comic text-2xl text-white group-hover:text-zinc-100 flex items-center gap-2">
                Punya Kode?
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Ketik 6 digit kode dari struk pembelian atau scan QR strukmu.
              </p>
            </div>

            {/* Bottom Call to action indicator */}
            <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
              <span className="text-xs font-semibold text-zinc-400 group-hover:text-white transition-colors flex items-center gap-1.5">
                <ReceiptText className="h-3.5 w-3.5" />
                Masukkan Kode Struk
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white group-hover:bg-white group-hover:text-zinc-950 transition-all">
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          </motion.button>

          {/* Card 2: Belum punya kode? */}
          <motion.button
            id="card-no-code"
            onClick={onSelectNoCode}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="group relative flex flex-col justify-between rounded-2xl border-2 border-white/20 bg-zinc-900/80 p-6 shadow-xl transition-all hover:border-emerald-400/80 hover:bg-zinc-800/90 cursor-pointer overflow-hidden"
          >
            <div className="absolute top-0 right-0 h-28 w-28 bg-emerald-500/10 rounded-full blur-2xl -mr-6 -mt-6 group-hover:bg-emerald-500/20 transition-colors" />

            <div>
              {/* Icon badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 text-zinc-950 shadow-md">
                  <QrCode className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-[11px] font-bold text-emerald-400 border border-emerald-500/30">
                  Instant QRIS
                </span>
              </div>

              {/* Title & Description */}
              <h2 className="font-comic text-2xl text-white group-hover:text-emerald-300 flex items-center gap-2">
                Belum punya kode?
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Pilih paket & bayar QRIS (GoPay, OVO, DANA, m-bangking).
              </p>
            </div>

            {/* Bottom Call to action indicator */}
            <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
              <span className="text-xs font-semibold text-emerald-400 group-hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                <Wallet className="h-3.5 w-3.5" />
                Pilih Paket & Bayar
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-zinc-950 transition-all">
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
