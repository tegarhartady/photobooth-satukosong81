import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, QrCode, CheckCircle2, Timer, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { PhotoboothPackage } from '../types/photobooth';

interface QrisPaymentModalProps {
  pkg: PhotoboothPackage | null;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (pkg: PhotoboothPackage) => void;
}

export const QrisPaymentModal: React.FC<QrisPaymentModalProps> = ({
  pkg,
  isOpen,
  onClose,
  onPaymentSuccess,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(300); // 5 minutes
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSecondsLeft(300);
      setIsProcessing(false);
      setIsSuccess(false);
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen || !pkg) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onPaymentSuccess(pkg);
      }, 900);
    }, 700);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.92, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.92, y: 20 }}
          className="relative w-full max-w-md rounded-[32px] border border-white/20 bg-zinc-950 p-6 sm:p-8 shadow-2xl text-white text-center"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 rounded-full bg-white/10 p-2 text-zinc-400 hover:bg-white/20 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header */}
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30">
              <QrCode className="h-3.5 w-3.5" /> Pembayaran QRIS Standar
            </span>
            <h2 className="mt-2 font-comic text-2xl sm:text-3xl text-white">
              {pkg.name}
            </h2>
            <div className="mt-1 flex items-center justify-center gap-2">
              <span className="font-comic text-3xl text-emerald-400">
                {pkg.priceFormatted}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-center gap-2">
              <span className="rounded-full bg-white/10 px-3 py-0.5 text-xs font-bold text-zinc-300 border border-white/10">
                {pkg.frames === 1 ? '1 Pilihan Frame (1 Sesi)' : '2 Pilihan Frame Berbeda (2 Sesi)'}
              </span>
              <span className="rounded-full bg-blue-500/20 px-3 py-0.5 text-xs font-bold text-blue-300 border border-blue-500/30">
                {pkg.sheets} Lembar Cetak
              </span>
            </div>
          </div>

          {/* QRIS Container */}
          <div className="mt-5 rounded-2xl bg-white p-4 text-zinc-950 shadow-xl border-4 border-zinc-900 mx-auto max-w-[280px]">
            {/* Header QRIS Logo Banner */}
            <div className="flex items-center justify-between border-b border-zinc-200 pb-2 mb-3">
              <span className="font-black text-xs tracking-wider text-red-600">QRIS</span>
              <span className="text-[10px] text-zinc-500 font-semibold">SATU.KOSONG8 PHOTOBOOTH</span>
            </div>

            {/* QR Code Matrix Display */}
            <div className="relative flex items-center justify-center bg-zinc-100 rounded-xl p-3 border border-zinc-200">
              <svg viewBox="0 0 100 100" className="w-48 h-48">
                {/* Outer finder 1 */}
                <rect x="5" y="5" width="28" height="28" fill="#000000" rx="3" />
                <rect x="9" y="9" width="20" height="20" fill="#ffffff" rx="2" />
                <rect x="13" y="13" width="12" height="12" fill="#000000" rx="1" />

                {/* Outer finder 2 */}
                <rect x="67" y="5" width="28" height="28" fill="#000000" rx="3" />
                <rect x="71" y="9" width="20" height="20" fill="#ffffff" rx="2" />
                <rect x="75" y="13" width="12" height="12" fill="#000000" rx="1" />

                {/* Outer finder 3 */}
                <rect x="5" y="67" width="28" height="28" fill="#000000" rx="3" />
                <rect x="9" y="71" width="20" height="20" fill="#ffffff" rx="2" />
                <rect x="13" y="75" width="12" height="12" fill="#000000" rx="1" />

                {/* Dense patterns */}
                <rect x="38" y="8" width="8" height="8" fill="#000" />
                <rect x="50" y="12" width="6" height="12" fill="#000" />
                <rect x="40" y="24" width="18" height="6" fill="#000" />
                <rect x="8" y="38" width="12" height="6" fill="#000" />
                <rect x="24" y="42" width="8" height="14" fill="#000" />
                <rect x="38" y="38" width="24" height="24" fill="#000" />
                <rect x="42" y="42" width="16" height="16" fill="#fff" />
                <rect x="46" y="46" width="8" height="8" fill="#000" />
                <rect x="68" y="38" width="10" height="8" fill="#000" />
                <rect x="82" y="44" width="10" height="12" fill="#000" />
                <rect x="38" y="68" width="12" height="8" fill="#000" />
                <rect x="54" y="72" width="8" height="16" fill="#000" />
                <rect x="68" y="68" width="14" height="14" fill="#000" />
                <rect x="86" y="70" width="8" height="22" fill="#000" />
                <rect x="70" y="86" width="12" height="8" fill="#000" />
              </svg>
            </div>

            {/* Supported Payment Logos */}
            <div className="mt-3 pt-2 border-t border-zinc-200 flex items-center justify-around text-[10px] font-bold text-zinc-600">
              <span>GoPay</span>
              <span>•</span>
              <span>OVO</span>
              <span>•</span>
              <span>DANA</span>
              <span>•</span>
              <span>BCA</span>
              <span>•</span>
              <span>Mandiri</span>
            </div>
          </div>

          {/* Timer */}
          <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-zinc-400">
            <Timer className="h-4 w-4 text-yellow-400 animate-spin" />
            <span>Selesaikan pembayaran dalam: </span>
            <span className="font-mono font-bold text-yellow-400 text-sm">{timeFormatted}</span>
          </div>

          {/* Success state indicator */}
          {isSuccess && (
            <div className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-emerald-500/20 py-2 text-emerald-400 font-bold text-xs">
              <CheckCircle2 className="h-4 w-4" />
              <span>Pembayaran QRIS Berhasil! Memulai sesi foto...</span>
            </div>
          )}

          {/* Simulate Payment Button */}
          <div className="mt-5 flex flex-col gap-2">
            <motion.button
              onClick={handleSimulatePayment}
              disabled={isProcessing || isSuccess}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3.5 font-comic text-base sm:text-lg text-zinc-950 shadow-lg hover:bg-emerald-400 transition-all cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Memverifikasi Transaksi...</span>
              ) : (
                <>
                  <ShieldCheck className="h-5 w-5" />
                  <span>Simulasi Bayar Berhasil</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </motion.button>
            <span className="text-[11px] text-zinc-400">
              Ketik atau scan kode QRIS langsung melalui e-wallet Anda
            </span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
