import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, QrCode, CheckCircle2, Timer, Printer, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

interface ExtraPrintQrisModalProps {
  isOpen: boolean;
  onClose: () => void;
  printQuantity: number;
  pricePerPrint?: number;
  selectedStripName: string;
  previewImageUrl?: string | null;
  onPaymentSuccess: (quantity: number, totalPaid: number) => void;
}

export const ExtraPrintQrisModal: React.FC<ExtraPrintQrisModalProps> = ({
  isOpen,
  onClose,
  printQuantity,
  pricePerPrint = 2000,
  selectedStripName,
  previewImageUrl,
  onPaymentSuccess,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(300); // 5 minutes
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const totalAmount = printQuantity * pricePerPrint;
  const formattedTotal = `Rp ${totalAmount.toLocaleString('id-ID')}`;
  const formattedPerPrint = `Rp ${pricePerPrint.toLocaleString('id-ID')}`;

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

  if (!isOpen) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onPaymentSuccess(printQuantity, totalAmount);
      }, 1000);
    }, 800);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-3 sm:p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.92, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.92, y: 20 }}
          className="relative w-full max-w-md rounded-[32px] border border-amber-500/30 bg-zinc-950 p-5 sm:p-7 shadow-2xl text-white text-center my-auto max-h-[95vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 rounded-full bg-white/10 p-2 text-zinc-400 hover:bg-white/20 hover:text-white transition-colors cursor-pointer"
            aria-label="Tutup Modal QRIS"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header */}
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3.5 py-1 text-xs font-bold text-amber-400 border border-amber-500/30">
              <QrCode className="h-3.5 w-3.5" /> Pembayaran QRIS Cetak Tambahan
            </span>
            <h2 className="mt-2 font-street tracking-wider text-2xl sm:text-3xl text-white">
              TAMBAH CETAK FOTO
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Tarif: <strong className="text-amber-400">{formattedPerPrint}</strong> per lembar cetak
            </p>

            {/* Price & Quantity Summary Pill */}
            <div className="mt-3 p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-left">
              <div>
                <div className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider">
                  Total Tagihan QRIS
                </div>
                <div className="font-comic text-2xl sm:text-3xl text-amber-400">
                  {formattedTotal}
                </div>
              </div>
              <div className="text-right">
                <span className="inline-block rounded-lg bg-red-600/30 border border-red-500/40 px-2.5 py-1 text-xs font-bold text-red-200">
                  {printQuantity} Lembar Cetak
                </span>
                <div className="text-[10px] text-zinc-400 mt-1 max-w-[130px] truncate">
                  {selectedStripName}
                </div>
              </div>
            </div>
          </div>

          {/* QRIS Code Box */}
          <div className="mt-4 rounded-2xl bg-white p-3.5 text-zinc-950 shadow-xl border-4 border-zinc-900 mx-auto max-w-[260px]">
            {/* Header QRIS Logo Banner */}
            <div className="flex items-center justify-between border-b border-zinc-200 pb-1.5 mb-2.5">
              <span className="font-black text-xs tracking-wider text-red-600">QRIS</span>
              <span className="text-[9px] text-zinc-500 font-bold uppercase">SATU.KOSONG8 KIOSK</span>
            </div>

            {/* QR Code Matrix Display */}
            <div className="relative flex items-center justify-center bg-zinc-100 rounded-xl p-2.5 border border-zinc-200">
              <svg viewBox="0 0 100 100" className="w-40 h-40">
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

              {/* Center Badge with Nominal */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="rounded bg-white/95 px-1.5 py-0.5 border border-red-500 shadow text-[9px] font-black text-red-600">
                  {formattedTotal}
                </div>
              </div>
            </div>

            {/* Supported Payment Logos */}
            <div className="mt-2.5 pt-2 border-t border-zinc-200 flex items-center justify-around text-[9px] font-bold text-zinc-600">
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
          <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-zinc-400">
            <Timer className="h-3.5 w-3.5 text-amber-400 animate-spin" />
            <span>Selesaikan pembayaran dalam: </span>
            <span className="font-mono font-bold text-amber-400 text-sm">{timeFormatted}</span>
          </div>

          {/* Success state indicator */}
          {isSuccess && (
            <div className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-emerald-500/20 py-2.5 px-3 text-emerald-400 font-bold text-xs border border-emerald-500/30">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Pembayaran {formattedTotal} Berhasil! Mengirim {printQuantity} lembar ke printer...</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-4 flex flex-col gap-2">
            <motion.button
              onClick={handleSimulatePayment}
              disabled={isProcessing || isSuccess}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 via-red-600 to-red-700 py-3 font-comic text-base text-white shadow-lg hover:brightness-110 transition-all cursor-pointer disabled:opacity-50 border border-white/20"
            >
              {isProcessing ? (
                <span>Memverifikasi Transaksi {formattedTotal}...</span>
              ) : isSuccess ? (
                <>
                  <Printer className="h-5 w-5 animate-pulse" />
                  <span>Mencetak ke Printer...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-5 w-5" />
                  <span>Simulasi Bayar {formattedTotal}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </motion.button>
            <span className="text-[11px] text-zinc-400">
              Scan barcode di atas menggunakan e-wallet atau aplikasi mobile banking Anda
            </span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
