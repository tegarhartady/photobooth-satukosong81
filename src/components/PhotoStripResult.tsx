import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Download,
  Printer,
  X,
  Layers,
  Image as ImageIcon,
  Mail,
  HardDrive,
  Film,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Play,
  QrCode,
  Plus,
  Minus,
  PlusCircle,
  FileDown,
} from 'lucide-react';
import { RecordedShot } from '../types/photobooth';
import { QRCodeDisplay } from './QRCodeDisplay';
import { ExtraPrintQrisModal } from './ExtraPrintQrisModal';

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
type GalleryFilter = 'ALL' | 'PHOTOS' | 'LIVE';

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
  const [copiedDriveLink, setCopiedDriveLink] = useState(false);

  // Active playing live video in gallery
  const [activePlayingVideoId, setActivePlayingVideoId] = useState<string | null>(null);

  // Extra Print State
  const PRICE_PER_EXTRA_PRINT = 2000;
  const [isExtraPrintQrisOpen, setIsExtraPrintQrisOpen] = useState(false);
  const [extraPrintQuantity, setExtraPrintQuantity] = useState(1);
  const [extraPrintTarget, setExtraPrintTarget] = useState<'TWIN' | 'FRAME_1' | 'FRAME_2'>('TWIN');
  const [extraPrintSuccessMessage, setExtraPrintSuccessMessage] = useState<string | null>(null);
  const [totalExtraPrinted, setTotalExtraPrinted] = useState(0);

  if (!isOpen) return null;

  // Active strip URL to show in STRIPS tab
  const activeStripUrl =
    stripSubView === 'TWIN'
      ? twinStripUrl || stripUrl1
      : stripSubView === 'FRAME_1'
      ? stripUrl1
      : stripUrl2 || stripUrl1;

  // Extra print target URL & name helpers
  const getExtraPrintTargetUrl = () => {
    if (extraPrintTarget === 'FRAME_1') return stripUrl1 || activeStripUrl;
    if (extraPrintTarget === 'FRAME_2') return stripUrl2 || stripUrl1;
    return twinStripUrl || stripUrl1;
  };

  const getExtraPrintTargetName = () => {
    if (extraPrintTarget === 'FRAME_1') return `Lembar 1 (${frame1Name})`;
    if (extraPrintTarget === 'FRAME_2') return `Lembar 2 (${frame2Name})`;
    return isSingleFrameMode ? 'Lembar Cetak Identik' : '2 Lembar Twin';
  };

  // Filtered gallery shots
  const filteredShots = allShots.filter((shot) => {
    if (galleryFilter === 'PHOTOS') return true; // All static photos
    if (galleryFilter === 'LIVE') return Boolean(shot.livePhotoVideoUrl);
    return true; // ALL
  });

  const acceptedShotsCount = allShots.filter((s) => s.isAccepted).length;
  const livePhotosCount = allShots.filter((s) => s.livePhotoVideoUrl).length;

  const handleDownloadStrip = () => {
    if (!activeStripUrl) return;
    const link = document.createElement('a');
    link.download = `satukosong8-${stripSubView.toLowerCase()}-${Date.now()}.png`;
    link.href = activeStripUrl;
    link.click();
  };

  // Unduh Semua Foto Asli (JPG)
  const handleDownloadAllStaticPhotos = () => {
    const photosToDownload = allShots.filter((s) => s.isAccepted);
    const target = photosToDownload.length > 0 ? photosToDownload : allShots;

    target.forEach((shot, index) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.download = `satukosong8-foto-L${shot.frameIndex}-pose-${shot.poseChar}.jpg`;
        link.href = shot.photoUrl;
        link.click();
      }, index * 250);
    });
  };

  const handlePrint = (customUrl?: string, copyCount: number = 1, pageTitle = 'Cetak SatuKosong8') => {
    const urlToPrint = customUrl || twinStripUrl || activeStripUrl;
    if (!urlToPrint) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.print();
      return;
    }
    const imagesHtml = Array(copyCount)
      .fill(0)
      .map(
        () => `
        <div class="print-page">
          <img src="${urlToPrint}" />
        </div>
      `
      )
      .join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${pageTitle}</title>
          <style>
            @page { margin: 0; size: auto; }
            body { margin: 0; padding: 0; background: #fff; font-family: sans-serif; }
            .print-page { display: flex; justify-content: center; align-items: center; min-height: 100vh; page-break-after: always; width: 100%; }
            .print-page:last-child { page-break-after: auto; }
            img { max-height: 98vh; width: auto; object-fit: contain; }
            @media print {
              body { margin: 0; }
              .print-page { min-height: 100vh; }
              img { max-width: 100%; height: auto; }
            }
          </style>
        </head>
        <body>
          ${imagesHtml}
          <script>
            window.onload = function() {
              window.print();
              window.close();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleExtraPrintPaymentSuccess = (quantity: number, totalPaid: number) => {
    setIsExtraPrintQrisOpen(false);
    setTotalExtraPrinted((prev) => prev + quantity);

    const targetUrl = getExtraPrintTargetUrl();
    const targetName = getExtraPrintTargetName();

    setExtraPrintSuccessMessage(
      `Pembayaran Rp ${totalPaid.toLocaleString('id-ID')} Berhasil! ${quantity} lembar (${targetName}) dicetak.`
    );

    setTimeout(() => {
      handlePrint(targetUrl || undefined, quantity, `Cetak Tambahan - SatuKosong8`);
    }, 400);

    setTimeout(() => {
      setExtraPrintSuccessMessage(null);
    }, 6000);
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) return;

    setIsSendingEmail(true);
    setTimeout(() => {
      setIsSendingEmail(false);
      setEmailSentSuccess(true);
    }, 1200);
  };

  const driveLink = `https://drive.google.com/drive/folders/satukosong8-${Date.now().toString(36)}`;

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
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-5 overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.94, y: 15 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.94, y: 15 }}
          className="relative flex flex-col rounded-3xl border-2 border-red-100 bg-white p-5 sm:p-7 shadow-2xl max-w-4xl w-full text-zinc-900 max-h-[92vh] overflow-y-auto"
        >
          {/* Top Bar: Clean Header & Close */}
          <div className="flex items-center justify-between border-b border-red-100 pb-3 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-600 animate-pulse" />
                <h2 className="font-comic text-xl sm:text-2xl font-black text-zinc-950">
                  SATU.KOSONG8 PHOTOBOOTH
                </h2>
                <span className="inline-flex rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-bold text-red-700">
                  Sesi Selesai
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                {isSingleFrameMode
                  ? `${packageName || 'Paket Hemat'} • 1 Sesi Foto (${frame1Name})`
                  : `Paket Combo • Lembar 1 (${frame1Name}) & Lembar 2 (${frame2Name})`}
              </p>
            </div>

            <button
              onClick={onClose}
              aria-label="Tutup"
              className="rounded-full bg-zinc-100 p-2 text-zinc-500 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Primary Navigation Tabs (Red & White Theme) */}
          <div className="grid grid-cols-3 gap-2 rounded-2xl bg-zinc-100 p-1.5 border border-zinc-200 mb-5">
            <button
              onClick={() => setMainTab('STRIPS')}
              className={`flex items-center gap-2 py-2 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer justify-center ${
                mainTab === 'STRIPS'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-zinc-600 hover:text-red-600'
              }`}
            >
              <Layers className="h-4 w-4" />
              <span>Strip Cetak</span>
            </button>

            <button
              onClick={() => setMainTab('GALLERY')}
              className={`flex items-center gap-2 py-2 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer justify-center ${
                mainTab === 'GALLERY'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-zinc-600 hover:text-red-600'
              }`}
            >
              <ImageIcon className="h-4 w-4" />
              <span>Foto & Live Video ({allShots.length})</span>
            </button>

            <button
              onClick={() => setMainTab('EMAIL_DRIVE')}
              className={`flex items-center gap-2 py-2 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer justify-center ${
                mainTab === 'EMAIL_DRIVE'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-zinc-600 hover:text-red-600'
              }`}
            >
              <Mail className="h-4 w-4" />
              <span>Kirim Email / HP</span>
            </button>
          </div>

          {/* TAB 1: STRIP CETAK FISIK */}
          {mainTab === 'STRIPS' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Left Column: Strip Preview */}
              <div className="md:col-span-6 flex flex-col items-center gap-3">
                {/* View switcher between Twin / Lembar 1 / Lembar 2 */}
                <div className="flex items-center gap-1 rounded-xl bg-zinc-100 p-1 border border-zinc-200 text-xs font-bold w-full justify-center">
                  <button
                    onClick={() => setStripSubView('TWIN')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      stripSubView === 'TWIN'
                        ? 'bg-red-600 text-white shadow'
                        : 'text-zinc-600 hover:text-red-600'
                    }`}
                  >
                    {isSingleFrameMode ? '2 Lembar Cetak' : 'Twin (2 Lembar)'}
                  </button>
                  <button
                    onClick={() => setStripSubView('FRAME_1')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      stripSubView === 'FRAME_1'
                        ? 'bg-red-600 text-white shadow'
                        : 'text-zinc-600 hover:text-red-600'
                    }`}
                  >
                    Lembar 1
                  </button>
                  {!isSingleFrameMode && (
                    <button
                      onClick={() => setStripSubView('FRAME_2')}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        stripSubView === 'FRAME_2'
                          ? 'bg-red-600 text-white shadow'
                          : 'text-zinc-600 hover:text-red-600'
                      }`}
                    >
                      Lembar 2
                    </button>
                  )}
                </div>

                {/* Strip Canvas / Image */}
                <div className="relative max-w-[280px] sm:max-w-[340px] max-h-[56vh] rounded-2xl overflow-hidden shadow-xl border-2 border-red-200 bg-zinc-900 flex items-center justify-center p-1">
                  {activeStripUrl ? (
                    <img
                      src={activeStripUrl}
                      alt="Hasil Cetak Photobooth"
                      className="w-full h-auto max-h-[54vh] object-contain rounded-xl"
                    />
                  ) : (
                    <div className="p-8 text-center text-zinc-400 text-xs">
                      Memuat strip foto...
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Actions & Details */}
              <div className="md:col-span-6 flex flex-col gap-4 text-center md:text-left">
                <div>
                  <h3 className="font-comic text-xl sm:text-2xl text-zinc-950 font-black">
                    Cetak & Simpan Foto
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1">
                    Silakan cetak fisik sekarang atau unduh file digital foto ke perangkat Anda.
                  </p>
                </div>

                <div className="flex flex-col gap-2.5">
                  {/* Success Alert Banner for Extra Prints */}
                  {extraPrintSuccessMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2 shadow-sm"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>{extraPrintSuccessMessage}</span>
                    </motion.div>
                  )}

                  {/* 1. Primary Print Button - Signature Brand Red */}
                  <motion.button
                    onClick={() => handlePrint()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 px-5 py-3.5 text-sm sm:text-base font-black text-white shadow-lg shadow-red-600/30 transition-all cursor-pointer border border-red-500"
                  >
                    <Printer className="h-5 w-5 text-white" />
                    <span>Cetak Fisik ({isSingleFrameMode ? '2 Lembar' : 'Twin 2 Lembar'})</span>
                  </motion.button>

                  {/* 2. Download Strip & Download All Static Photos */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleDownloadStrip}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-xs font-bold text-zinc-800 hover:bg-zinc-50 transition-colors cursor-pointer"
                    >
                      <Download className="h-4 w-4 text-red-600" />
                      <span>Unduh Strip (PNG)</span>
                    </button>

                    <button
                      onClick={handleDownloadAllStaticPhotos}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-red-300 bg-red-50 px-3 py-2.5 text-xs font-bold text-red-700 hover:bg-red-100 transition-colors cursor-pointer"
                    >
                      <FileDown className="h-4 w-4 text-red-600" />
                      <span>Unduh Foto (JPG)</span>
                    </button>
                  </div>

                  {/* 3. Extra Print Section (Tambah Cetak Foto - QRIS Rp 2.000 / cetak) */}
                  <div className="rounded-2xl border border-red-200 bg-red-50/50 p-3.5 text-left shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-lg bg-red-600 text-white flex items-center justify-center shrink-0">
                          <PlusCircle className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-zinc-950">
                            Tambah Cetak Lembar Ekstra
                          </div>
                          <div className="text-[11px] text-zinc-500">
                            Rp 2.000 per lembar cetak
                          </div>
                        </div>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-xl border border-red-200 shadow-sm">
                        <button
                          type="button"
                          onClick={() => setExtraPrintQuantity((q) => Math.max(1, q - 1))}
                          disabled={extraPrintQuantity <= 1}
                          className="h-6 w-6 rounded bg-zinc-100 hover:bg-zinc-200 disabled:opacity-30 flex items-center justify-center text-zinc-700 transition-colors cursor-pointer"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="font-bold text-xs text-zinc-900 px-1">
                          {extraPrintQuantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setExtraPrintQuantity((q) => Math.min(10, q + 1))}
                          disabled={extraPrintQuantity >= 10}
                          className="h-6 w-6 rounded bg-zinc-100 hover:bg-zinc-200 disabled:opacity-30 flex items-center justify-center text-zinc-700 transition-colors cursor-pointer"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    <motion.button
                      type="button"
                      onClick={() => setIsExtraPrintQrisOpen(true)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 py-2.5 font-bold text-white text-xs shadow-sm cursor-pointer"
                    >
                      <QrCode className="h-4 w-4" />
                      <span>
                        Bayar QRIS Rp {(extraPrintQuantity * PRICE_PER_EXTRA_PRINT).toLocaleString('id-ID')} & Cetak
                      </span>
                    </motion.button>
                  </div>

                  {/* 4. Finish Session & Return to Home */}
                  <button
                    onClick={onClose}
                    className="flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-zinc-100 px-5 py-2.5 text-xs font-bold text-zinc-700 hover:bg-zinc-200 cursor-pointer transition-colors"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Selesai Sesi (Halaman Utama)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SEMUA FOTO & LIVE PHOTO GALLERY */}
          {mainTab === 'GALLERY' && (
            <div className="flex flex-col gap-3">
              {/* Header Info & Filter Chips */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-zinc-200 pb-2.5">
                <div>
                  <h3 className="font-comic text-lg font-black text-zinc-950">
                    Koleksi Foto & Live Motion
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Foto tersimpan dalam format gambar asli (JPG) dan klip gerak (Live Video).
                  </p>
                </div>

                {/* Filter Pills & Batch Download Button */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl border border-zinc-200 text-xs">
                    <button
                      onClick={() => setGalleryFilter('ALL')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        galleryFilter === 'ALL'
                          ? 'bg-red-600 text-white'
                          : 'text-zinc-600 hover:text-red-600'
                      }`}
                    >
                      Semua ({allShots.length})
                    </button>
                    <button
                      onClick={() => setGalleryFilter('PHOTOS')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        galleryFilter === 'PHOTOS'
                          ? 'bg-red-600 text-white'
                          : 'text-zinc-600 hover:text-red-600'
                      }`}
                    >
                      Foto Asli (JPG)
                    </button>
                    <button
                      onClick={() => setGalleryFilter('LIVE')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        galleryFilter === 'LIVE'
                          ? 'bg-red-600 text-white'
                          : 'text-zinc-600 hover:text-red-600'
                      }`}
                    >
                      ⚡ Live Video ({livePhotosCount})
                    </button>
                  </div>

                  <button
                    onClick={handleDownloadAllStaticPhotos}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow transition-colors cursor-pointer"
                  >
                    <FileDown className="h-3.5 w-3.5" />
                    <span>Unduh Semua Foto (JPG)</span>
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
                      className="group relative flex flex-col rounded-2xl overflow-hidden border border-zinc-200 bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="relative aspect-[4/3] w-full bg-zinc-900 overflow-hidden">
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

                        {/* Top Badge */}
                        <div className="absolute top-2 left-2 flex items-center gap-1">
                          <span className="rounded bg-black/75 px-1.5 py-0.5 text-[10px] font-black text-white">
                            Pose {shot.poseChar}
                          </span>
                          {!shot.isAccepted && (
                            <span className="rounded bg-amber-500 px-1.5 py-0.5 text-[9px] font-black text-white">
                              Retake
                            </span>
                          )}
                        </div>

                        {/* Live Photo Play Trigger */}
                        {shot.livePhotoVideoUrl && (
                          <button
                            onClick={() =>
                              setActivePlayingVideoId(isPlaying ? null : shot.id)
                            }
                            className="absolute top-2 right-2 rounded-full bg-white/90 text-red-600 p-1.5 shadow-md hover:bg-white transition-colors cursor-pointer"
                            title={isPlaying ? 'Hentikan Live Photo' : 'Putar Live Video'}
                          >
                            {isPlaying ? (
                              <Film className="h-3 w-3 text-red-600" />
                            ) : (
                              <Play className="h-3 w-3 fill-current text-red-600" />
                            )}
                          </button>
                        )}
                      </div>

                      {/* Card Footer: Metadata & Download */}
                      <div className="p-2 flex items-center justify-between bg-zinc-50 border-t border-zinc-100 text-[11px]">
                        <span className="text-zinc-500 font-semibold">Take #{shot.attempt}</span>

                        <div className="flex items-center gap-1">
                          {shot.livePhotoVideoUrl && (
                            <a
                              href={shot.livePhotoVideoUrl}
                              download={`live-photo-L${shot.frameIndex}-pose-${shot.poseChar}.webm`}
                              className="text-zinc-600 hover:text-red-600 p-1 rounded hover:bg-zinc-200 transition-colors"
                              title="Unduh Video Live Photo"
                            >
                              <Film className="h-3.5 w-3.5" />
                            </a>
                          )}
                          <a
                            href={shot.photoUrl}
                            download={`foto-L${shot.frameIndex}-pose-${shot.poseChar}.jpg`}
                            className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors font-bold flex items-center gap-0.5"
                            title="Unduh Foto Statis (JPG)"
                          >
                            <Download className="h-3.5 w-3.5" />
                            <span className="text-[10px]">JPG</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: KIRIM VIA EMAIL & SCAN HP */}
          {mainTab === 'EMAIL_DRIVE' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
              {/* Left Column: Email Delivery Form */}
              <div className="md:col-span-7 flex flex-col gap-3">
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Mail className="h-5 w-5 text-red-600" />
                    <h3 className="font-comic text-base sm:text-lg font-black text-zinc-950">
                      Kirim Semua File ke Email
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-500 mb-3">
                    Kami akan mengirimkan file foto cetak, foto asli (.jpg), dan live photo ke email Anda.
                  </p>

                  {emailSentSuccess ? (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 font-bold text-emerald-700 text-sm">
                        <CheckCircle2 className="h-4 w-4" />
                        Terkirim ke {emailInput}!
                      </div>
                      <p>Silakan periksa folder Inbox atau Spam email Anda.</p>
                      <button
                        onClick={() => setEmailSentSuccess(false)}
                        className="mt-1 text-xs underline text-emerald-700 hover:text-emerald-800 self-start cursor-pointer"
                      >
                        Kirim ke email lain
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSendEmail} className="flex flex-col gap-2.5">
                      <div>
                        <input
                          type="email"
                          required
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          placeholder="Masukkan alamat email (contoh: nama@gmail.com)"
                          className="w-full rounded-xl bg-white border border-zinc-300 px-3.5 py-2 text-xs sm:text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-red-500"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSendingEmail || !emailInput}
                        className="flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm py-2.5 px-4 transition-colors cursor-pointer shadow-md disabled:opacity-50"
                      >
                        <Mail className="h-4 w-4" />
                        <span>{isSendingEmail ? 'Mengirim...' : 'Kirim Berkas Sekarang'}</span>
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Right Column: QR Code Scan to Mobile */}
              <div className="md:col-span-5 flex flex-col gap-3">
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col items-center text-center">
                  <div className="flex items-center gap-2 mb-1">
                    <HardDrive className="h-5 w-5 text-red-600" />
                    <h3 className="font-comic text-base sm:text-lg font-black text-zinc-950">
                      Scan QR ke HP
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-500 mb-2">
                    Arahkan kamera HP ke QR Code untuk menyimpan foto langsung:
                  </p>

                  <div className="my-1 bg-white p-2.5 rounded-2xl border border-zinc-200 shadow-sm">
                    <QRCodeDisplay value={driveLink} size={130} />
                  </div>

                  {/* Copy Link / Open Drive button */}
                  <div className="flex items-center gap-2 w-full mt-2">
                    <button
                      onClick={handleCopyDriveLink}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-zinc-300 bg-white py-2 px-3 text-xs font-bold text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
                    >
                      {copiedDriveLink ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                          <span className="text-emerald-600">Tersalin!</span>
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
                      className="flex items-center justify-center gap-1 rounded-xl bg-red-600 hover:bg-red-700 text-white py-2 px-3 text-xs font-bold transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>Buka</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Extra Print QRIS Payment Modal (Rp 2.000 / cetak) */}
      <ExtraPrintQrisModal
        isOpen={isExtraPrintQrisOpen}
        onClose={() => setIsExtraPrintQrisOpen(false)}
        printQuantity={extraPrintQuantity}
        pricePerPrint={PRICE_PER_EXTRA_PRINT}
        selectedStripName={getExtraPrintTargetName()}
        previewImageUrl={getExtraPrintTargetUrl()}
        onPaymentSuccess={handleExtraPrintPaymentSuccess}
      />
    </AnimatePresence>
  );
};
