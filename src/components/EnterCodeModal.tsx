import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  KeyRound,
  CheckCircle2,
  Delete,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { VoucherCode } from '../types/photobooth';
import {
  verifyAndRedeemVoucher,
  getAllVouchers,
  resetDemoVouchers,
} from '../utils/voucherCodes';

interface EnterCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCodeVerified: (voucher: VoucherCode) => void;
}

export const EnterCodeModal: React.FC<EnterCodeModalProps> = ({
  isOpen,
  onClose,
  onCodeVerified,
}) => {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isExpiredError, setIsExpiredError] = useState(false);
  const [successVoucher, setSuccessVoucher] = useState<VoucherCode | null>(null);
  const [showVoucherList, setShowVoucherList] = useState(false);
  const [vouchersState, setVouchersState] = useState<VoucherCode[]>([]);
  // Dev mode toggle: default true during development, can be toggled to clean Kiosk/Production mode
  const [isDevTestingMode, setIsDevTestingMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('satukosong8_dev_mode');
    return saved === null ? true : saved === 'true';
  });
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      setDigits(['', '', '', '', '', '']);
      setErrorMessage(null);
      setIsExpiredError(false);
      setSuccessVoucher(null);
      setShowVoucherList(false);
      setVouchersState(getAllVouchers());
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 150);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDigitChange = (index: number, val: string) => {
    const clean = val.replace(/[^0-9]/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = clean;
    setDigits(newDigits);
    setErrorMessage(null);
    setIsExpiredError(false);

    if (clean && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  // Virtual Keypad click for photobox touchscreen convenience
  const handleKeypadPress = (num: string) => {
    const firstEmptyIndex = digits.findIndex((d) => d === '');
    if (firstEmptyIndex !== -1) {
      handleDigitChange(firstEmptyIndex, num);
    }
  };

  const handleKeypadBackspace = () => {
    const lastFilledIndex = [...digits].reverse().findIndex((d) => d !== '');
    if (lastFilledIndex !== -1) {
      const realIndex = 5 - lastFilledIndex;
      const newDigits = [...digits];
      newDigits[realIndex] = '';
      setDigits(newDigits);
      inputRefs.current[realIndex]?.focus();
    }
  };

  const handleSubmit = (codeToVerify?: string) => {
    const fullCode = codeToVerify || digits.join('');
    if (fullCode.length < 6) {
      setErrorMessage('Harap masukkan 6 digit kode lengkap dari strukmu.');
      setIsExpiredError(false);
      return;
    }

    const result = verifyAndRedeemVoucher(fullCode);

    if (!result.success) {
      setErrorMessage(result.message);
      setIsExpiredError(result.errorType === 'EXPIRED');
      setVouchersState(getAllVouchers());
      return;
    }

    if (result.voucher) {
      setSuccessVoucher(result.voucher);
      setErrorMessage(null);
      setIsExpiredError(false);
      setVouchersState(getAllVouchers());

      setTimeout(() => {
        onCodeVerified(result.voucher!);
      }, 750);
    }
  };

  const handleSelectPredefinedCode = (codeStr: string) => {
    const arr = codeStr.split('').slice(0, 6);
    setDigits(arr);
    setErrorMessage(null);
    setIsExpiredError(false);
    handleSubmit(codeStr);
  };

  const handleResetVouchers = () => {
    const reset = resetDemoVouchers();
    setVouchersState(reset);
    setErrorMessage(null);
    setIsExpiredError(false);
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
          className="relative w-full max-w-lg rounded-[32px] border border-white/20 bg-zinc-950/95 p-6 sm:p-7 shadow-2xl text-white my-auto max-h-[95vh] overflow-y-auto"
        >
          {/* Top Controls: Mode Switcher & Close button */}
          <div className="flex items-center justify-between mb-2">
            {/* Photobox Kiosk vs Dev Mode Toggle */}
            <button
              type="button"
              onClick={() => {
                const nextMode = !isDevTestingMode;
                setIsDevTestingMode(nextMode);
                localStorage.setItem('satukosong8_dev_mode', nextMode ? 'true' : 'false');
              }}
              className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full border transition-all cursor-pointer ${
                isDevTestingMode
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
              }`}
              title="Klik untuk beralih mode Photobox Kiosk (Tampilan Bersih) / Dev Testing"
            >
              <span className={`h-2 w-2 rounded-full ${isDevTestingMode ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
              <span>{isDevTestingMode ? '🛠️ Mode Dev: Pengujian' : '🔒 Mode Kiosk Photobox (Bersih)'}</span>
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              className="rounded-full bg-white/10 p-2 text-zinc-400 hover:bg-white/20 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-white/10 text-white border border-white/15 mb-2.5">
              <KeyRound className="h-6 w-6 text-white" />
            </div>
            <h2 className="font-comic text-2xl sm:text-3xl text-white">
              Masukkan Kode Sesi
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-zinc-300 max-w-sm">
              Ketik 6 digit kode dari strukmu. Jumlah pilihan frame (1 atau 2 frame) otomatis menyesuaikan paket kodemu!
            </p>
          </div>

          {/* 6 Digit Input Boxes */}
          <div className="mt-5 flex justify-center gap-2 sm:gap-2.5">
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className={`h-12 w-10 sm:h-14 sm:w-12 rounded-xl border-2 text-center text-xl sm:text-2xl font-bold transition-all outline-none ${
                  digit
                    ? 'border-white bg-white/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                    : 'border-white/20 bg-white/5 text-zinc-400 focus:border-white focus:bg-white/10'
                }`}
              />
            ))}
          </div>

          {/* Error / Expired Banner */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-3 rounded-2xl p-3 border text-xs text-center flex items-start sm:items-center gap-2 ${
                isExpiredError
                  ? 'bg-red-950/80 border-red-500/60 text-red-200'
                  : 'bg-amber-950/70 border-amber-500/50 text-amber-200'
              }`}
            >
              <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5 sm:mt-0" />
              <div className="text-left font-medium leading-relaxed">
                <span className="font-bold block text-red-300">
                  {isExpiredError ? 'KODE EXPIRED (SUDAH DIGUNAKAN)' : 'PERIKSA KODE'}
                </span>
                {errorMessage}
              </div>
            </motion.div>
          )}

          {/* Success Banner */}
          {successVoucher && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/60 p-3.5 text-center text-emerald-200"
            >
              <div className="flex items-center justify-center gap-2 text-sm font-bold text-emerald-300">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <span>Kode Valid! Mengaktifkan {successVoucher.packageName}</span>
              </div>
              <p className="text-xs text-emerald-200/90 mt-1">
                {successVoucher.framesCount === 1
                  ? '✓ Mode 1 Frame • 1 Sesi Pemotretan • 2 Lembar Cetak'
                  : '✓ Mode 2 Frame Berbeda • 2 Sesi Pemotretan • 4 Lembar Cetak'}
              </p>
            </motion.div>
          )}

          {/* Quick Demo Code Shortcuts & Dev Tools (Only shown in Dev Mode) */}
          {isDevTestingMode && (
            <div className="mt-4 pt-3 border-t border-amber-500/20 bg-amber-500/5 -mx-2 px-3 py-2 rounded-2xl">
              <div className="text-center mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                  ⚡ Kode Pengujian Cepat (Mode Dev):
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {/* Option 1 Frame */}
                <button
                  type="button"
                  onClick={() => handleSelectPredefinedCode('108101')}
                  className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 transition-all text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-1 text-xs font-bold text-white group-hover:text-yellow-300">
                    <Sparkles className="h-3 w-3 text-yellow-400" />
                    <span>108101</span>
                  </div>
                  <span className="text-[10px] text-zinc-300 mt-0.5">1 Frame (Hemat)</span>
                </button>

                {/* Option 2 Frames */}
                <button
                  type="button"
                  onClick={() => handleSelectPredefinedCode('108108')}
                  className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 transition-all text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-1 text-xs font-bold text-white group-hover:text-yellow-300">
                    <Layers className="h-3 w-3 text-blue-400" />
                    <span>108108</span>
                  </div>
                  <span className="text-[10px] text-zinc-300 mt-0.5">2 Frame (Combo)</span>
                </button>

                {/* Option Expired */}
                <button
                  type="button"
                  onClick={() => handleSelectPredefinedCode('999999')}
                  className="flex flex-col items-center justify-center p-2 rounded-xl bg-red-950/40 hover:bg-red-900/50 border border-red-500/30 transition-all text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-1 text-xs font-bold text-red-300">
                    <AlertTriangle className="h-3 w-3 text-red-400" />
                    <span>999999</span>
                  </div>
                  <span className="text-[10px] text-red-200/80 mt-0.5">Coba Expired</span>
                </button>
              </div>

              {/* Toggle View Voucher Storage & Reset Button */}
              <div className="mt-3 flex items-center justify-between text-xs text-zinc-400 px-1">
                <button
                  type="button"
                  onClick={() => setShowVoucherList(!showVoucherList)}
                  className="hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Status Kode ({vouchersState.filter((v) => !v.isUsed).length} Aktif / {vouchersState.filter((v) => v.isUsed).length} Expired)</span>
                  {showVoucherList ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                </button>

                <button
                  type="button"
                  onClick={handleResetVouchers}
                  title="Reset semua status voucher ke awal"
                  className="flex items-center gap-1 text-zinc-400 hover:text-yellow-300 cursor-pointer transition-colors"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset Demo</span>
                </button>
              </div>

              {/* Expandable Voucher List */}
              {showVoucherList && (
                <div className="mt-2 rounded-xl bg-black/50 border border-white/10 p-2.5 max-h-36 overflow-y-auto text-[11px] space-y-1.5">
                  {vouchersState.map((v) => (
                    <div
                      key={v.code}
                      className="flex items-center justify-between py-1 px-2 rounded-lg bg-white/5"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white">{v.code}</span>
                        <span className="text-zinc-400">({v.framesCount} Frame)</span>
                      </div>
                      {v.isUsed ? (
                        <span className="rounded bg-red-500/20 px-2 py-0.5 font-bold text-red-400 border border-red-500/30">
                          EXPIRED • {v.usedAtFormatted?.split(',')[0] || 'Terpakai'}
                        </span>
                      ) : (
                        <span className="rounded bg-emerald-500/20 px-2 py-0.5 font-bold text-emerald-400 border border-emerald-500/30">
                          AKTIF (Bisa Dipakai)
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Virtual Photobox Touch Keypad */}
          <div className="mt-4 grid grid-cols-3 gap-2 max-w-[280px] mx-auto">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleKeypadPress(num)}
                className="h-10 rounded-xl bg-white/10 text-lg font-bold text-white hover:bg-white/25 active:scale-95 transition-all cursor-pointer"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setDigits(['', '', '', '', '', '']);
                setErrorMessage(null);
                setIsExpiredError(false);
              }}
              className="h-10 rounded-xl bg-white/5 text-[11px] font-bold text-zinc-400 hover:bg-white/15 hover:text-white active:scale-95 transition-all cursor-pointer uppercase"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => handleKeypadPress('0')}
              className="h-10 rounded-xl bg-white/10 text-lg font-bold text-white hover:bg-white/25 active:scale-95 transition-all cursor-pointer"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleKeypadBackspace}
              className="h-10 flex items-center justify-center rounded-xl bg-white/5 text-zinc-400 hover:bg-white/15 hover:text-white active:scale-95 transition-all cursor-pointer"
            >
              <Delete className="h-5 w-5" />
            </button>
          </div>

          {/* Action Button */}
          <div className="mt-5">
            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={Boolean(successVoucher)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-3.5 font-comic text-base sm:text-lg text-zinc-950 shadow-lg hover:bg-zinc-200 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
            >
              <span>Verifikasi & Mulai Sesi</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
