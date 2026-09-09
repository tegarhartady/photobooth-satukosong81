import React from 'react';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ value, size = 150 }) => {
  // Use quick Google Chart API or safe dynamic SVG for QR code
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(
    value
  )}&margin=10&color=18-18-27&bgcolor=ffffff`;

  return (
    <div className="rounded-2xl overflow-hidden border-2 border-white/20 bg-white p-2 shadow-lg inline-block">
      <img
        src={qrUrl}
        alt={`QR Code: ${value}`}
        width={size}
        height={size}
        className="w-full h-full object-contain rounded-lg"
        onError={(e) => {
          // Fallback if offline
          const target = e.currentTarget;
          target.style.display = 'none';
        }}
      />
    </div>
  );
};
