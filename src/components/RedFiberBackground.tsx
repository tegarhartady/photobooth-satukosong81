import React, { useEffect, useRef } from 'react';

/**
 * RedFiberBackground
 * Menghasilkan background merah pekat dengan motif garis-garis fiber/jarum
 * geometris oranye-merah bercahaya persis seperti pada referensi Home.png.
 */
export const RedFiberBackground: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      const width = (canvas.width = window.innerWidth);
      const height = (canvas.height = window.innerHeight);

      // 1. Base Dark Crimson / Ruby Gradient
      const baseGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        Math.min(width, height) * 0.15,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.75
      );
      baseGrad.addColorStop(0, '#5a060b'); // Center glowing ruby red
      baseGrad.addColorStop(0.45, '#3b0307'); // Deep crimson
      baseGrad.addColorStop(0.85, '#200103'); // Dark burgundy edge
      baseGrad.addColorStop(1, '#0e0002'); // Deep black vignette

      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Dense Geometric Intersecting Fiber / Needle Lines along Edges and Corners
      // Keeping the center area clean and empty for the glass card
      ctx.save();
      ctx.globalCompositeOperation = 'screen'; // Luminous glow intersection

      const centerX = width / 2;
      const centerY = height / 2;
      // Elliptical safe zone around the center card
      const safeRadiusX = Math.max(width * 0.22, 260);
      const safeRadiusY = Math.max(height * 0.26, 210);

      const isInCenterZone = (x: number, y: number) => {
        const dx = (x - centerX) / safeRadiusX;
        const dy = (y - centerY) / safeRadiusY;
        return dx * dx + dy * dy < 1.0;
      };

      // Generate rich yet balanced burst clusters along corners, sides, and outer perimeter
      const clusters = [
        // Top-Left Corner & Flank
        { cx: width * 0.05, cy: height * 0.08, count: 120, spread: width * 0.14 },
        // Top-Right Corner & Flank
        { cx: width * 0.95, cy: height * 0.08, count: 120, spread: width * 0.14 },
        // Bottom-Left Corner & Flank
        { cx: width * 0.05, cy: height * 0.92, count: 130, spread: width * 0.14 },
        // Bottom-Right Corner & Flank
        { cx: width * 0.95, cy: height * 0.92, count: 130, spread: width * 0.14 },
        // Left Edge Flank
        { cx: width * 0.03, cy: height * 0.5, count: 85, spread: width * 0.1 },
        // Right Edge Flank
        { cx: width * 0.97, cy: height * 0.5, count: 85, spread: width * 0.1 },
        // Top Perimeter Accent
        { cx: width * 0.5, cy: height * 0.04, count: 70, spread: width * 0.1 },
        // Bottom Perimeter Accent
        { cx: width * 0.5, cy: height * 0.96, count: 70, spread: width * 0.1 },
      ];

      // PRNG seeded for consistent crisp pattern
      let seed = 108;
      const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
      };

      const lineColors = [
        'rgba(255, 65, 0, 0.48)',   // Vivid red-orange
        'rgba(255, 115, 0, 0.55)',  // Fiery orange
        'rgba(255, 160, 25, 0.65)', // Bright amber/gold
        'rgba(230, 35, 15, 0.42)',  // Crimson
        'rgba(255, 190, 60, 0.7)',   // Luminous golden spark
        'rgba(190, 25, 25, 0.32)',  // Darker background strand
      ];

      for (const cluster of clusters) {
        for (let i = 0; i < cluster.count; i++) {
          const angle = random() * Math.PI * 2;
          const length = 85 + random() * (Math.max(width, height) * 0.35);
          const startDist = random() * cluster.spread;

          const x1 = cluster.cx + Math.cos(angle) * startDist + (random() - 0.5) * 55;
          const y1 = cluster.cy + Math.sin(angle) * startDist + (random() - 0.5) * 55;

          // If starting point is in center zone, push it outward
          if (isInCenterZone(x1, y1)) continue;

          // Calculate end point
          const dirAngle = angle + (random() - 0.5) * 0.4;
          let x2 = x1 + Math.cos(dirAngle) * length;
          let y2 = y1 + Math.sin(dirAngle) * length;

          // If end point crosses into center zone, trim it before entering
          if (isInCenterZone(x2, y2)) {
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;
            if (isInCenterZone(midX, midY)) {
              continue; // Drop line if it directly cuts across center
            }
            x2 = midX;
            y2 = midY;
          }

          const strokeWidth = 0.5 + random() * 1.5;
          const color = lineColors[Math.floor(random() * lineColors.length)];

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = color;
          ctx.lineWidth = strokeWidth;
          ctx.stroke();
        }
      }

      // Perimeter razor needles hugging the window edges (subtle accent lines)
      for (let i = 0; i < 130; i++) {
        // Pick an edge (0: top, 1: bottom, 2: left, 3: right)
        const edge = Math.floor(random() * 4);
        let x1 = 0;
        let y1 = 0;
        if (edge === 0) {
          x1 = random() * width;
          y1 = random() * (height * 0.16);
        } else if (edge === 1) {
          x1 = random() * width;
          y1 = height - random() * (height * 0.16);
        } else if (edge === 2) {
          x1 = random() * (width * 0.16);
          y1 = random() * height;
        } else {
          x1 = width - random() * (width * 0.16);
          y1 = random() * height;
        }

        if (isInCenterZone(x1, y1)) continue;

        const angle = random() * Math.PI * 2;
        const length = 95 + random() * 260;
        let x2 = x1 + Math.cos(angle) * length;
        let y2 = y1 + Math.sin(angle) * length;

        if (isInCenterZone(x2, y2)) continue;

        const strokeWidth = 0.5 + random() * 1.4;
        const color = lineColors[Math.floor(random() * lineColors.length)];

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = color;
        ctx.lineWidth = strokeWidth;
        ctx.stroke();
      }

      ctx.restore();

      // 3. Clear the Center Area (Soft Radial Falloff)
      // Memberikan ruang kosong bersih di bagian tengah agar kartu dan logo sangat jelas
      ctx.save();
      const clearGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        safeRadiusY * 0.35,
        centerX,
        centerY,
        safeRadiusY * 1.35
      );
      clearGrad.addColorStop(0, 'rgba(90, 6, 11, 0.95)');    // Deep glowing ruby red
      clearGrad.addColorStop(0.55, 'rgba(59, 3, 7, 0.75)'); // Soft crimson
      clearGrad.addColorStop(0.85, 'rgba(32, 1, 3, 0.25)'); // Fade out towards edges
      clearGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');        // Transparent at perimeter

      ctx.fillStyle = clearGrad;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      // 3. Vignette Overlay (Darkened outer edges)
      const vignette = ctx.createRadialGradient(
        width / 2,
        height / 2,
        Math.min(width, height) * 0.25,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.68
      );
      vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vignette.addColorStop(0.65, 'rgba(15, 1, 3, 0.45)');
      vignette.addColorStop(1, 'rgba(5, 0, 1, 0.88)');

      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);
    };

    render();

    const handleResize = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 h-full w-full pointer-events-none select-none ${className}`}
      style={{ zIndex: 0 }}
    />
  );
};
