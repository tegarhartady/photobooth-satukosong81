import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Download,
  Printer,
  RefreshCw,
  X,
  Sparkles,
  Layers,
  Image as ImageIcon,
  Mail,
  HardDrive,
  Film,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  Play,
} from 'lucide-react';
import { RecordedShot } from '../types/photobooth';
import { QRCodeDisplay } from './QRCodeDisplay';

interface PhotoStripResultProps {
  stripUrl1: string | null;
  stripUrl2: string | null;
  twinStripUrl: string | null;
  allShots?: RecordedShot[];
  isOpen: boolean;
  onClose: () => void;
  layoutCount?: number;
  allowedFramesCount?: 1 | 2;
  packageName?: string;
  frame1Name?: string;
  frame2Name?: string;
}

type MainTab = 'STRIPS' | 'GALLERY' | 'EMAIL_DRIVE';
type StripSubView = 'TWIN' | 'FRAME_1' | 'FRAME_2';
type GalleryFilter = 'ALL' | 'FRAME_1' | 'FRAME_2' | 'RETAKES' | 'LIVE';

export const PhotoStripResult: React.FC<PhotoStripResultProps> = ({
  stripUrl1,
  stripUrl2,
  twinStripUrl,
  allShots = [],
  isOpen,
  onClose,
  layoutCount,
  allowedFramesCount = 2,
  packageName,
  frame1Name = 'Frame 1',
  frame2Name = 'Frame 2',
}) => {
  const isSingleFrameMode = allowedFramesCount === 1;
  const [mainTab, setMainTab] = useState<MainTab>('STRIPS');
  const [stripSubView, setStripSubView] = useState<StripSubView>('TWIN');
  const [galleryFilter, setGalleryFilter] = useState<GalleryFilter>('ALL');

  // Email state
  const [emailInput, setEmailInput] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSentSuccess, setEmailSentSuccess] = useState(false);

  // Drive state
  const [isDriveSaved, setIsDriveSaved] = useState(false);
  const [copiedDriveLink, setCopiedDriveLink] = useState(false);

  // Active playing live video in gallery
  const [activePlayingVideoId, setActivePlayingVideoId] = useState<string | null>(null);

  if (!isOpen) return null;

  // Active strip URL to show in STRIPS tab
  const activeStripUrl =
    stripSubView === 'TWIN'
      ? twinStripUrl || stripUrl1
      : stripSubView === 'FRAME_1'
      ? stripUrl1
      : stripUrl2 || stripUrl1;

  // Filtered gallery shots
  const filteredShots = allShots.filter((shot) => {
    if (galleryFilter === 'FRAME_1') return shot.frameIndex === 1 && shot.isAccepted;
    if (galleryFilter === 'FRAME_2') return shot.frameIndex === 2 && shot.isAccepted;
    if (galleryFilter === 'RETAKES') return !shot.isAccepted;
    if (galleryFilter === 'LIVE') return Boolean(shot.livePhotoVideoUrl);
    return true; // ALL
  });

  const acceptedShotsCount = allShots.filter((s) => s.isAccepted).length;
  const retakesCount = allShots.filter((s) => !s.isAccepted).length;
  const livePhotosCount = allShots.filter((s) => s.livePhotoVideoUrl).length;

  const handleDownloadStrip = () => {
    if (!activeStripUrl) return;
    const link = document.createElement('a');
    link.download = `satukosong8-${stripSubView.toLowerCase()}-${Date.now()}.png`;
    link.href = activeStripUrl;
    link.click();
  };

  const handlePrint = () => {
    const urlToPrint = twinStripUrl || activeStripUrl;
    if (!urlToPrint) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.print();
      return;
    }
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Cetak SatuKosong8 Photobooth (2 Lembar)</title>
          <style>
            body { margin: 0; display: flex; justify-content: center; align-items: center; background: #fff; }
            img { max-height: 98vh; width: auto; object-fit: contain; }
            @media print {
              body { margin: 0; }
              img { max-width: 100%; height: auto; }
            }
          </style>
        </head>
        <body>
          <img src="${urlToPrint}" onload="window.print();window.close();" />
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Send to Email simulation
  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) return;

    setIsSendingEmail(true);
    setTimeout(() => {
      setIsSendingEmail(false);
      setEmailSentSuccess(true);
    }, 1200);
  };

  const driveLink = `https://drive.google.com/drive/folders/satukosong8-session-${Date.now().toString(36)}`;

  const handleCopyDriveLink = () => {
    navigator.clipboard?.writeText(driveLink);
    setCopiedDriveLink(true);
    setTimeout(() => setCopiedDriveLink(false), 2000);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-3 sm:p-5 overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.92, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.92, y: 20 }}
          className="relative flex flex-col rounded-3xl border border-white/20 bg-zinc-950/95 p-5 sm:p-7 shadow-2xl max-w-4xl w-full text-white max-h-[92vh] overflow-y-auto"
        >
          {/* Top Bar: Title & Close */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-comic text-2xl sm:text-3xl text-white">
                  SATU.KOSONG8 PHOTOBOOTH
                </h2>
                <span className="hidden sm:inline-flex rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-300 border border-emerald-500/30 items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Sesi Selesai
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                {isSingleFrameMode
                  ? `${packageName || 'Paket Hemat'} • 1 Sesi Foto (${frame1Name}) • Cetak 2 Lembar Identik`
                  : `2 Sesi Foto Berbeda • Lembar 1 (${frame1Name}) & Lembar 2 (${frame2Name})`}
              </p>
            </div>

            <button
              onClick={onClose}
              aria-label="Tutup"
              className="rounded-full bg-white/10 p-2 text-white/80 hover:bg-white/20 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Primary Navigation Tabs */}
          <div className="flex items-center gap-2 rounded-2xl bg-zinc-900/90 p-1.5 border border-white/10 mb-5 overflow-x-auto">
            <button
              onClick={() => setMainTab('STRIPS')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap flex-1 justify-center ${
                mainTab === 'STRIPS'
                  ? 'bg-white text-zinc-950 shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Layers className="h-4 w-4" />
              <span>Strip Cetak Fisik</span>
            </button>

            <button
              onClick={() => setMainTab('GALLERY')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap flex-1 justify-center ${
                mainTab === 'GALLERY'
                  ? 'bg-white text-zinc-950 shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <ImageIcon className="h-4 w-4" />
              <span>Semua Foto & Live Photo ({allShots.length})</span>
            </button>

            <button
              onClick={() => setMainTab('EMAIL_DRIVE')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap flex-1 justify-center ${
                mainTab === 'EMAIL_DRIVE'
                  ? 'bg-white text-zinc-950 shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Mail className="h-4 w-4" />
              <span>Kirim Email & Drive</span>
            </button>
          </div>

          {/* TAB 1: STRIP CETAK FISIK */}
          {mainTab === 'STRIPS' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Left Column: Strip Preview */}
              <div className="md:col-span-6 flex flex-col items-center gap-3">
                {/* View switcher between Twin / Lembar 1 / Lembar 2 */}
                <div className="flex items-center gap-1 rounded-xl bg-zinc-900 p-1 border border-white/10 text-xs font-bold w-full justify-center">
                  <button
                    onClick={() => setStripSubView('TWIN')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      stripSubView === 'TWIN'
                        ? 'bg-white text-zinc-950 shadow'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {isSingleFrameMode ? '2 Lembar Cetak (Identik)' : '2 Lembar (Twin)'}
                  </button>
                  <button
                    onClick={() => setStripSubView('FRAME_1')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      stripSubView === 'FRAME_1'
                        ? 'bg-white text-zinc-950 shadow'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {isSingleFrameMode ? `Strip Tunggal (${frame1Name})` : `Lembar 1 (${frame1Name})`}
                  </button>
                  {!isSingleFrameMode && (
                    <button
                      onClick={() => setStripSubView('FRAME_2')}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        stripSubView === 'FRAME_2'
                          ? 'bg-white text-zinc-950 shadow'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Lembar 2 ({frame2Name})
                    </button>
                  )}
                </div>

                {/* Strip Canvas / Image */}
                <div className="relative max-w-[280px] sm:max-w-[340px] max-h-[58vh] rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-black flex items-center justify-center p-1">
                  {activeStripUrl ? (
                    <img
                      src={activeStripUrl}
                      alt="Hasil Cetak Photobooth Satu.Kosong8"
                      className="w-full h-auto max-h-[56vh] object-contain rounded-xl"
                    />
                  ) : (
                    <div className="p-8 text-center text-zinc-400 text-xs">
                      Memuat pratinjau strip foto...
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Actions & Details */}
              <div className="md:col-span-6 flex flex-col gap-4 text-center md:text-left">
                <div>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 mb-1.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-zinc-200 border border-white/15">
                      <Sparkles className="h-3.5 w-3.5 text-yellow-400" /> Foto 2 Sesi Berbeda
                    </span>
                    {layoutCount && (
                      <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-xs font-bold text-blue-300 border border-blue-500/30">
                        Layout {layoutCount} Pose
                      </span>
                    )}
                  </div>

                  <h3 className="font-comic text-2xl text-white">
                    Simpan & Cetak Hasil Fisik
                  </h3>

                  <div className="mt-2 text-xs text-zinc-300 bg-white/5 p-3 rounded-2xl border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Lembar 1 Frame:</span>
                      <span className="font-bold text-white">{frame1Name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Lembar 2 Frame:</span>
                      <span className="font-bold text-white">{frame2Name}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-white/10 text-emerald-400">
                      <span>Status Foto:</span>
                      <span className="font-semibold">Masing-masing foto pose berbeda!</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5">
                  {/* 1. Primary Print Button - Signature Brand Red */}
                  <motion.button
                    onClick={handlePrint}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#b91c1c] via-[#dc2626] to-[#ef4444] px-5 py-3.5 text-sm sm:text-base font-bold text-white shadow-[0_8px_25px_rgba(220,38,38,0.5)] hover:brightness-110 cursor-pointer border border-white/20"
                  >
                    <Printer className="h-5 w-5 text-white" />
                    <span>Cetak Fisik Sekarang ({isSingleFrameMode ? '2 Lembar Identik' : '2 Lembar Frame Berbeda'})</span>
                  </motion.button>

                  {/* 2. Digital Download/Email */}
                  <button
                    onClick={() => setMainTab('EMAIL_DRIVE')}
                    className="flex items-center justify-center gap-2 rounded-xl border border-purple-500/40 bg-purple-500/20 px-5 py-2.5 text-sm font-semibold text-purple-200 hover:bg-purple-500/30 cursor-pointer"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Kirim Semua Foto & Video ke Email / Scan QR ke HP</span>
                  </button>

                  {/* 3. Finish Session & Return to Home (No Free Re-Shoot Loophole) */}
                  <button
                    onClick={onClose}
                    className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-black/60 px-5 py-2.5 text-sm font-bold text-zinc-300 hover:bg-white/10 hover:text-white cursor-pointer"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Selesai Sesi (Keluar ke Halaman Awal)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SEMUA FOTO & LIVE PHOTO GALLERY */}
          {mainTab === 'GALLERY' && (
            <div className="flex flex-col gap-4">
              {/* Header Info & Filter Chips */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div>
                  <h3 className="font-comic text-xl text-white">
                    Semua Foto Hasil Sesi & Bloopers
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Termasuk foto terpilih, retake/bloopers yang tersimpan, dan Live Photo motion!
                  </p>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => setGalleryFilter('ALL')}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      galleryFilter === 'ALL'
                        ? 'bg-white text-zinc-950'
                        : 'bg-white/10 text-zinc-300 hover:bg-white/20'
                    }`}
                  >
                    Semua ({allShots.length})
                  </button>
                  <button
                    onClick={() => setGalleryFilter('FRAME_1')}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      galleryFilter === 'FRAME_1'
                        ? 'bg-white text-zinc-950'
                        : 'bg-white/10 text-zinc-300 hover:bg-white/20'
                    }`}
                  >
                    {isSingleFrameMode ? 'Foto Utama' : 'Lembar 1'}
                  </button>
                  {!isSingleFrameMode && (
                    <button
                      onClick={() => setGalleryFilter('FRAME_2')}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        galleryFilter === 'FRAME_2'
                          ? 'bg-white text-zinc-950'
                          : 'bg-white/10 text-zinc-300 hover:bg-white/20'
                      }`}
                    >
                      Lembar 2
                    </button>
                  )}
                  <button
                    onClick={() => setGalleryFilter('RETAKES')}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      galleryFilter === 'RETAKES'
                        ? 'bg-white text-zinc-950'
                        : 'bg-white/10 text-zinc-300 hover:bg-white/20'
                    }`}
                  >
                    Bloopers / Retake ({retakesCount})
                  </button>
                  <button
                    onClick={() => setGalleryFilter('LIVE')}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      galleryFilter === 'LIVE'
                        ? 'bg-yellow-400 text-zinc-950'
                        : 'bg-white/10 text-zinc-300 hover:bg-white/20'
                    }`}
                  >
                    ⚡ Live Photo ({livePhotosCount})
                  </button>
                </div>
              </div>

              {/* Photo Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[50vh] overflow-y-auto p-1">
                {filteredShots.map((shot) => {
                  const isPlaying = activePlayingVideoId === shot.id;
                  return (
                    <div
                      key={shot.id}
                      className="group relative flex flex-col rounded-2xl overflow-hidden border border-white/15 bg-zinc-900 shadow-md"
                    >
                      <div className="relative aspect-[4/3] w-full bg-black overflow-hidden">
                        {shot.livePhotoVideoUrl && isPlaying ? (
                          <video
                            src={shot.livePhotoVideoUrl}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src={shot.photoUrl}
                            alt={`Pose ${shot.poseChar}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        )}

                        {/* Top Badges */}
                        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
                          <span className="rounded bg-black/75 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm border border-white/20">
                            L{shot.frameIndex} • Pose {shot.poseChar}
                          </span>
                          {!shot.isAccepted && (
                            <span className="rounded bg-amber-500/90 px-1.5 py-0.5 text-[9px] font-black text-zinc-950 uppercase tracking-tight">
                              Blooper / Retake
                            </span>
                          )}
                        </div>

                        {/* Live Photo Button / Toggle */}
                        {shot.livePhotoVideoUrl && (
                          <button
                            onClick={() =>
                              setActivePlayingVideoId(isPlaying ? null : shot.id)
                            }
                            className="absolute top-2 right-2 rounded-full bg-yellow-400/95 text-zinc-950 p-1.5 shadow-md hover:bg-yellow-300 transition-colors cursor-pointer"
                            title={isPlaying ? 'Hentikan Live Photo' : 'Putar Live Photo'}
                          >
                            {isPlaying ? (
                              <Film className="h-3 w-3" />
                            ) : (
                              <Play className="h-3 w-3 fill-current" />
                            )}
                          </button>
                        )}
                      </div>

                      {/* Card Footer: Metadata & Download */}
                      <div className="p-2 flex items-center justify-between bg-zinc-900/90 text-[11px]">
                        <span className="text-zinc-400">Take #{shot.attempt}</span>

                        <div className="flex items-center gap-1.5">
                          {shot.livePhotoVideoUrl && (
                            <a
                              href={shot.livePhotoVideoUrl}
                              download={`live-photo-L${shot.frameIndex}-pose-${shot.poseChar}.webm`}
                              className="text-yellow-400 hover:text-yellow-300 p-1 rounded hover:bg-white/10"
                              title="Unduh Klip Live Photo"
                            >
                              <Film className="h-3.5 w-3.5" />
                            </a>
                          )}
                          <a
                            href={shot.photoUrl}
                            download={`foto-L${shot.frameIndex}-pose-${shot.poseChar}-take-${shot.attempt}.jpg`}
                            className="text-zinc-300 hover:text-white p-1 rounded hover:bg-white/10"
                            title="Unduh Foto Resolusi Penuh"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Email & Drive Trigger */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-white/5 p-3.5 rounded-2xl border border-white/10">
                <div className="text-xs text-zinc-300">
                  Total Tersimpan: <strong className="text-white">{acceptedShotsCount} Foto Utama</strong> +{' '}
                  <strong className="text-amber-400">{retakesCount} Bloopers</strong> +{' '}
                  <strong className="text-yellow-400">{livePhotosCount} Live Videos</strong>
                </div>

                <button
                  onClick={() => setMainTab('EMAIL_DRIVE')}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-purple-600 text-white px-4 py-2 text-xs font-bold hover:bg-purple-500 transition-colors cursor-pointer shadow-md"
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>Kirim Semua ke Email / Scan QR Drive</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: KIRIM VIA EMAIL & GOOGLE DRIVE */}
          {mainTab === 'EMAIL_DRIVE' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Left Column: Email Delivery Form */}
              <div className="md:col-span-7 flex flex-col gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="h-5 w-5 text-purple-400" />
                    <h3 className="font-comic text-lg text-white">
                      Kirim Semua Foto ke Email Pelanggan
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-400 mb-4">
                    Kami akan mengirimkan paket lengkap berisi 2 lembar strip foto, semua foto mentah
                    tiap take, foto bloopers retake, dan video Live Photo ke email kamu!
                  </p>

                  {emailSentSuccess ? (
                    <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-200 text-xs flex flex-col gap-2">
                      <div className="flex items-center gap-2 font-bold text-emerald-300 text-sm">
                        <CheckCircle2 className="h-5 w-5" />
                        Terkirim Berhasil ke {emailInput}!
                      </div>
                      <p>
                        Cek folder Inbox atau Spam email kamu. Tautan unduhan dan arsip digital
                        Satu.Kosong8 photobooth telah dikirimkan.
                      </p>
                      <button
                        onClick={() => setEmailSentSuccess(false)}
                        className="mt-1 text-xs underline text-emerald-400 hover:text-emerald-300 self-start cursor-pointer"
                      >
                        Kirim ke email lain
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSendEmail} className="flex flex-col gap-3">
                      <div>
                        <label className="block text-xs font-bold text-zinc-300 mb-1">
                          Alamat Email Tujuan:
                        </label>
                        <input
                          type="email"
                          required
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          placeholder="contoh: customer@gmail.com"
                          className="w-full rounded-xl bg-black/60 border border-white/20 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/50"
                        />
                      </div>

                      {/* Summary of Included Assets */}
                      <div className="rounded-xl bg-zinc-900/80 p-3 text-xs text-zinc-300 space-y-1.5 border border-white/5">
                        <div className="font-bold text-white text-[11px] uppercase tracking-wider mb-1">
                          Paket yang akan dikirim:
                        </div>
                        <div className="flex items-center justify-between text-zinc-300">
                          <span>• 2 Lembar Strip Cetak (Twin & Per-Frame)</span>
                          <span className="font-mono text-emerald-400">HD PNG</span>
                        </div>
                        <div className="flex items-center justify-between text-zinc-300">
                          <span>• Foto Mentah Per Take ({acceptedShotsCount} Pose)</span>
                          <span className="font-mono text-emerald-400">Asli JPEG</span>
                        </div>
                        <div className="flex items-center justify-between text-zinc-300">
                          <span>• Foto Retake & Bloopers ({retakesCount} Take)</span>
                          <span className="font-mono text-amber-400">Tersimpan</span>
                        </div>
                        <div className="flex items-center justify-between text-zinc-300">
                          <span>• Video Klip Live Photo ({livePhotosCount} Klip)</span>
                          <span className="font-mono text-yellow-400">WebM Motion</span>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSendingEmail || !emailInput}
                        className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-comic text-sm py-3 px-5 transition-colors cursor-pointer shadow-lg disabled:opacity-50"
                      >
                        <Mail className="h-4 w-4" />
                        <span>{isSendingEmail ? 'Mengirim Berkas...' : 'Kirim Sekarang ke Email'}</span>
                      </button>
                    </form>
                  )}
                </div>

                {/* Photobox Kiosk Physical & Cloud Pickup Guide */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3.5">
                  <div className="h-10 w-10 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
                    <Printer className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      Pengambilan Cetak Fisik & Arsip Digital Kiosk
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
                      Ambil 2 lembar hasil cetakan dari slot printer di bawah bilik booth. Gunakan scan QR di samping untuk menyimpan arsip foto digital ke HP kamu.
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Google Drive & QR Code Scan */}
              <div className="md:col-span-5 flex flex-col gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center text-center">
                  <div className="flex items-center gap-2 mb-2">
                    <HardDrive className="h-5 w-5 text-blue-400" />
                    <h3 className="font-comic text-lg text-white">
                      Akses Google Drive Sesi
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-400 mb-3 max-w-xs">
                    Scan QR code ini dari kamera HP untuk langsung membuka dan menyimpan folder cloud
                    sesi photobooth kamu:
                  </p>

                  {/* QR Code for Mobile Phone Camera */}
                  <div className="my-1">
                    <QRCodeDisplay value={driveLink} size={140} />
                  </div>

                  <span className="text-[11px] text-zinc-400 mt-2">
                    Scan dengan kamera HP kamu 📱
                  </span>

                  {/* Copy Link / Open Drive button */}
                  <div className="flex items-center gap-2 w-full mt-3">
                    <button
                      onClick={handleCopyDriveLink}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/10 py-2 px-3 text-xs font-semibold text-white hover:bg-white/20 transition-colors cursor-pointer"
                    >
                      {copiedDriveLink ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Salin Link</span>
                        </>
                      )}
                    </button>

                    <a
                      href={driveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1 rounded-xl bg-blue-600 hover:bg-blue-500 text-white py-2 px-3 text-xs font-semibold transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>Buka Drive</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
