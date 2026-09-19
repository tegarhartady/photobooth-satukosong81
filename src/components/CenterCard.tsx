import React from 'react';
import { motion } from 'motion/react';

interface CenterCardProps {
  onStart: () => void;
}

/**
 * CenterCard
 * Menampilkan kartu kaca transparan di tengah dengan tipografi 3D
 * "SATU.KOSONG8 THE PHOTOBOOTH" dan tombol "Mulai" merah
 * persis seperti pada gambar referensi Home.png.
 */
export const CenterCard: React.FC<CenterCardProps> = ({ onStart }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.93, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -15 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-20 flex flex-col items-center justify-center w-full max-w-lg px-4"
    >
      {/* Translucent Glassmorphic Card */}
      <div
        id="home-glass-card"
        className="relative w-full rounded-[28px] sm:rounded-[36px] border border-white/35 bg-[#250306]/35 p-7 sm:p-10 md:p-12 shadow-[0_25px_60px_rgba(0,0,0,0.65)] backdrop-blur-xl text-center flex flex-col items-center justify-center"
      >
        {/* Ambient subtle warm glow */}
        <div className="pointer-events-none absolute inset-0 rounded-[36px] bg-gradient-to-b from-white/5 via-transparent to-black/30" />

        {/* 3D Stylized Logo matching Home.png */}
        <div className="relative w-full max-w-[420px] select-none flex justify-center items-center py-2">
          <svg
            viewBox="0 0 460 220"
            className="w-full h-auto drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* White Face Gradient with subtle glossy sheen */}
              <linearGradient id="whiteGloss" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="70%" stopColor="#f5f5f5" />
                <stop offset="100%" stopColor="#e2e2e2" />
              </linearGradient>

              {/* Red 3D Extrusion Gradient */}
              <linearGradient id="red3d" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#d81622" />
                <stop offset="50%" stopColor="#b30e18" />
                <stop offset="100%" stopColor="#6e050c" />
              </linearGradient>

              {/* Red Face for THE */}
              <linearGradient id="theRed" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ef2330" />
                <stop offset="100%" stopColor="#b30e18" />
              </linearGradient>

              {/* Filter for comic extrusion drop shadow */}
              <filter id="comicShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#350205" floodOpacity="0.8" />
              </filter>
            </defs>

            {/* ==================================================== */}
            {/* 1. "SATU.KOSONG8" TOP ARC */}
            {/* ==================================================== */}
            {/* Deep Red 3D Base Layers (Extrusions) */}
            <g filter="url(#comicShadow)">
              {[12, 10, 8, 6, 4, 2].map((offset) => (
                <text
                  key={`satu-ext-${offset}`}
                  x="230"
                  y={68 + offset}
                  textAnchor="middle"
                  fontFamily="'Impact', 'Arial Black', sans-serif"
                  fontWeight="900"
                  fontSize="48"
                  letterSpacing="1.5"
                  fill="#75080e"
                  stroke="#400206"
                  strokeWidth="8"
                  strokeLinejoin="round"
                  transform="rotate(-2 230 70)"
                >
                  SATU.KOSONG8
                </text>
              ))}

              {/* Mid Red 3D Layer */}
              <text
                x="230"
                y="71"
                textAnchor="middle"
                fontFamily="'Impact', 'Arial Black', sans-serif"
                fontWeight="900"
                fontSize="48"
                letterSpacing="1.5"
                fill="url(#red3d)"
                stroke="#9a0c14"
                strokeWidth="6"
                strokeLinejoin="round"
                transform="rotate(-2 230 70)"
              >
                SATU.KOSONG8
              </text>

              {/* Dark Outlining Behind White Letters */}
              <text
                x="230"
                y="68"
                textAnchor="middle"
                fontFamily="'Impact', 'Arial Black', sans-serif"
                fontWeight="900"
                fontSize="48"
                letterSpacing="1.5"
                fill="#ffffff"
                stroke="#69060b"
                strokeWidth="5"
                strokeLinejoin="round"
                transform="rotate(-2 230 70)"
              >
                SATU.KOSONG8
              </text>

              {/* Front White Face Letters */}
              <text
                x="230"
                y="68"
                textAnchor="middle"
                fontFamily="'Impact', 'Arial Black', sans-serif"
                fontWeight="900"
                fontSize="48"
                letterSpacing="1.5"
                fill="url(#whiteGloss)"
                transform="rotate(-2 230 70)"
              >
                SATU.KOSONG8
              </text>
            </g>

            {/* ==================================================== */}
            {/* 2. "THE" CENTER BADGE */}
            {/* ==================================================== */}
            <g filter="url(#comicShadow)">
              {/* Dark Extrusion */}
              {[6, 4, 2].map((offset) => (
                <text
                  key={`the-ext-${offset}`}
                  x="230"
                  y={118 + offset}
                  textAnchor="middle"
                  fontFamily="'Impact', 'Arial Black', sans-serif"
                  fontWeight="900"
                  fontSize="32"
                  letterSpacing="4"
                  fill="#540409"
                  stroke="#380104"
                  strokeWidth="7"
                  strokeLinejoin="round"
                >
                  THE
                </text>
              ))}

              {/* White Outline */}
              <text
                x="230"
                y="118"
                textAnchor="middle"
                fontFamily="'Impact', 'Arial Black', sans-serif"
                fontWeight="900"
                fontSize="32"
                letterSpacing="4"
                fill="url(#theRed)"
                stroke="#ffffff"
                strokeWidth="2.5"
                strokeLinejoin="round"
              >
                THE
              </text>

              {/* Red Face */}
              <text
                x="230"
                y="118"
                textAnchor="middle"
                fontFamily="'Impact', 'Arial Black', sans-serif"
                fontWeight="900"
                fontSize="32"
                letterSpacing="4"
                fill="url(#theRed)"
              >
                THE
              </text>
            </g>

            {/* ==================================================== */}
            {/* 3. "PHOTOBOOTH" BOTTOM ARC */}
            {/* ==================================================== */}
            <g filter="url(#comicShadow)">
              {/* Deep Red 3D Extrusions */}
              {[12, 10, 8, 6, 4, 2].map((offset) => (
                <text
                  key={`photo-ext-${offset}`}
                  x="230"
                  y={174 + offset}
                  textAnchor="middle"
                  fontFamily="'Impact', 'Arial Black', sans-serif"
                  fontWeight="900"
                  fontSize="48"
                  letterSpacing="1.2"
                  fill="#75080e"
                  stroke="#400206"
                  strokeWidth="8"
                  strokeLinejoin="round"
                >
                  PHOTOBOOTH
                </text>
              ))}

              {/* Mid Red 3D Layer */}
              <text
                x="230"
                y="177"
                textAnchor="middle"
                fontFamily="'Impact', 'Arial Black', sans-serif"
                fontWeight="900"
                fontSize="48"
                letterSpacing="1.2"
                fill="url(#red3d)"
                stroke="#9a0c14"
                strokeWidth="6"
                strokeLinejoin="round"
              >
                PHOTOBOOTH
              </text>

              {/* Dark Red Outline */}
              <text
                x="230"
                y="174"
                textAnchor="middle"
                fontFamily="'Impact', 'Arial Black', sans-serif"
                fontWeight="900"
                fontSize="48"
                letterSpacing="1.2"
                fill="#ffffff"
                stroke="#69060b"
                strokeWidth="5"
                strokeLinejoin="round"
              >
                PHOTOBOOTH
              </text>

              {/* Front White Face Letters */}
              <text
                x="230"
                y="174"
                textAnchor="middle"
                fontFamily="'Impact', 'Arial Black', sans-serif"
                fontWeight="900"
                fontSize="48"
                letterSpacing="1.2"
                fill="url(#whiteGloss)"
              >
                PHOTOBOOTH
              </text>
            </g>
          </svg>
        </div>

        {/* Clean Rounded Red Button "Mulai" Matching Home.png */}
        <div className="mt-7 flex justify-center w-full">
          <motion.button
            id="btn-mulai-home"
            onClick={onStart}
            whileHover={{ scale: 1.05, filter: 'brightness(1.08)' }}
            whileTap={{ scale: 0.96 }}
            className="w-full max-w-[220px] rounded-2xl bg-[#d71920] hover:bg-[#c2141a] px-8 py-3.5 sm:py-4 text-white font-bold text-lg sm:text-xl shadow-[0_8px_25px_rgba(215,25,32,0.5)] border border-white/40 transition-all cursor-pointer select-none"
          >
            Mulai
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
