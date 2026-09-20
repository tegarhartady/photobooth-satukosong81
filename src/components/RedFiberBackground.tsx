import React from 'react';

interface RedFiberBackgroundProps {
  className?: string;
}

/**
 * RedFiberBackground
 * Menghasilkan background merah pekat dengan aset bgsilet.png dan glowing orb
 * persis sesuai spesifikasi dan styling file nyoba.html:
 * - Background color: #4B090B
 * - Background image: /bgsilet.png
 * - Red glowing blur orb: #D71920 (blur effect behind card)
 */
export const RedFiberBackground: React.FC<RedFiberBackgroundProps> = ({ className = '' }) => {
  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 h-full w-full pointer-events-none select-none overflow-hidden bg-[#4B090B] ${className}`}
      style={{ zIndex: 0 }}
    >
      {/* 1. Official bgsilet.png background image */}
      <img
        src="/bgsilet.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* 2. Glowing Red Blurred Orb matching nyoba.html */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          width: 'min(1000px, 95vw)',
          height: 'min(1000px, 95vh)',
          backgroundColor: '#D71920',
          filter: 'blur(min(280px, 25vw))',
          opacity: 0.95,
        }}
      />

      {/* 3. Subtle ambient edge vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(18,2,4,0.5)_100%)] pointer-events-none" />
    </div>
  );
};
