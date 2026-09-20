import React from 'react';
import { motion } from 'motion/react';

interface CenterCardProps {
  onStart: () => void;
}

/**
 * CenterCard
 * Komponen halaman awal/login sesuai dengan file nyoba.html:
 * - Card 600px x 442px
 * - Background: rgba(255, 255, 255, 0.05)
 * - Outline: 1px rgba(255, 255, 255, 0.70) solid
 * - Border-radius: 20px
 * - Box-shadow: 0px 6px 6px rgba(0, 0, 0, 0.30)
 * - Logo: satu08.png (height: 265.78px)
 * - Tombol Mulai: width 268px, background #F1F1F1, border-radius 20px,
 *   text #C2171D, font-size 36px, font Roboto 900
 */
export const CenterCard: React.FC<CenterCardProps> = ({ onStart }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -12 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-20 flex flex-col items-center justify-center w-full max-w-[600px] px-4"
    >
      {/* Translucent Glassmorphic Card exactly matching nyoba.html */}
      <div
        id="home-glass-card"
        className="relative w-full max-w-[600px] min-h-[380px] sm:min-h-[442px] rounded-[20px] p-6 sm:p-8 md:p-10 flex flex-col items-center justify-center gap-6 sm:gap-8 md:gap-[40px] text-center"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          boxShadow: '0px 6px 6px rgba(0, 0, 0, 0.30)',
          outline: '1px rgba(255, 255, 255, 0.70) solid',
          outlineOffset: '-1px',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        {/* Official SATU.KOSONG8 Logo Image from satu08.png */}
        <div className="w-full flex items-center justify-center">
          <img
            src="/satu08.png"
            alt="SATU.KOSONG8 THE PHOTOBOOTH"
            className="w-full max-w-[500px] h-[180px] sm:h-[220px] md:h-[265.78px] object-contain select-none pointer-events-none drop-shadow-md"
            draggable={false}
          />
        </div>

        {/* Clean Rounded Button "Mulai" matching nyoba.html */}
        <div className="flex justify-center w-full">
          <motion.button
            id="btn-mulai-home"
            type="button"
            onClick={onStart}
            whileHover={{ scale: 1.05, filter: 'brightness(1.03)' }}
            whileTap={{ scale: 0.96 }}
            className="w-[268px] max-w-full px-6 py-3 rounded-[20px] bg-[#F1F1F1] hover:bg-white flex items-center justify-center cursor-pointer select-none transition-all shadow-[0_6px_20px_rgba(0,0,0,0.25)] active:shadow-sm"
            style={{
              minHeight: '72px',
            }}
          >
            <span
              style={{
                color: '#C2171D',
                fontSize: '36px',
                fontFamily: "'Roboto', sans-serif",
                fontWeight: 900,
                lineHeight: '1',
              }}
            >
              Mulai
            </span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
