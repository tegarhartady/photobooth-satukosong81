import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Maximize2, Minimize2, FlipHorizontal } from 'lucide-react';
import { LiveCameraBackground } from './components/LiveCameraBackground';
import { CenterCard } from './components/CenterCard';
import { PhotoboothStepGuide } from './components/PhotoboothStepGuide';
import { StartSessionPage } from './components/StartSessionPage';
import { EnterCodeModal } from './components/EnterCodeModal';
import { PackageSelectionPage } from './components/PackageSelectionPage';
import { QrisPaymentModal } from './components/QrisPaymentModal';
import { LayoutSelectionPage } from './components/LayoutSelectionPage';
import { FrameSelectionPage } from './components/FrameSelectionPage';
import { PhotoStripResult } from './components/PhotoStripResult';
import { QuickPoseReviewModal } from './components/QuickPoseReviewModal';
import { InterSessionTransition } from './components/InterSessionTransition';
import {
  AppStep,
  PhotoboothPackage,
  PhotoLayoutCount,
  PhotoFrameOption,
  PHOTO_FRAME_OPTIONS,
  mapTakesToSlots,
  MAX_RETAKES_PER_POSE,
  RecordedShot,
  VoucherCode,
} from './types/photobooth';

type FilterType = 'normal' | 'warm' | 'vintage' | 'bw';

interface ReviewState {
  photoUrl: string;
  livePhotoVideoUrl?: string;
  shotIdx: number;
  attempt: number;
  secondsLeft: number;
  sessionIndex: 1 | 2;
}

export default function App() {
  // Navigation step
  const [currentStep, setCurrentStep] = useState<AppStep>('HOME');

  // Package & Allowed Frames Count (1 frame for Hemat, 2 frames for Combo/Default)
  const [allowedFramesCount, setAllowedFramesCount] = useState<1 | 2>(2);
  const [activePackageName, setActivePackageName] = useState<string>('Paket Combo (2 Frame Berbeda)');

  // Layout & 2 Frame choices
  const [selectedLayout, setSelectedLayout] = useState<PhotoLayoutCount>(4);
  const [selectedFrame1, setSelectedFrame1] = useState<PhotoFrameOption>(PHOTO_FRAME_OPTIONS[0]);
  const [selectedFrame2, setSelectedFrame2] = useState<PhotoFrameOption>(PHOTO_FRAME_OPTIONS[1]);

  // Camera & Filter
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [filter, setFilter] = useState<FilterType>('normal');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Modals
  const [isEnterCodeOpen, setIsEnterCodeOpen] = useState(false);
  const [selectedPackageForQris, setSelectedPackageForQris] = useState<PhotoboothPackage | null>(null);

  // 2 Separate Photo Sessions for Frame 1 and Frame 2
  const [currentSessionFrameIndex, setCurrentSessionFrameIndex] = useState<1 | 2>(1);
  const [capturedFramesSession1, setCapturedFramesSession1] = useState<string[]>([]);
  const [capturedFramesSession2, setCapturedFramesSession2] = useState<string[]>([]);

  // Roll of ALL recorded shots (accepted + retakes/bloopers + live photos)
  const [allRecordedShots, setAllRecordedShots] = useState<RecordedShot[]>([]);

  // Intermission transition between Session 1 & Session 2
  const [isIntermissionOpen, setIsIntermissionOpen] = useState(false);

  // Active shooting state
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [currentShotIndex, setCurrentShotIndex] = useState(0);
  const [flashActive, setFlashActive] = useState(false);

  // Generated final strips (Twin + Frame 1 + Frame 2)
  const [finalStripUrl1, setFinalStripUrl1] = useState<string | null>(null);
  const [finalStripUrl2, setFinalStripUrl2] = useState<string | null>(null);
  const [finalTwinStripUrl, setFinalTwinStripUrl] = useState<string | null>(null);

  // Quick Review & Retake state (Maksimal 2x per pose)
  const [reviewState, setReviewState] = useState<ReviewState | null>(null);
  const [shotAttempts, setShotAttempts] = useState<Record<string, number>>({});
  const reviewTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Media references
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Fullscreen toggle
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (reviewTimerRef.current) {
        clearInterval(reviewTimerRef.current);
      }
    };
  }, []);

  // Filter CSS mapping
  const getFilterCSS = (f: FilterType) => {
    switch (f) {
      case 'warm':
        return 'contrast(106%) saturate(125%) sepia(12%) brightness(102%)';
      case 'bw':
        return 'grayscale(100%) contrast(120%) brightness(104%)';
      case 'vintage':
        return 'sepia(35%) contrast(110%) brightness(96%) saturate(110%)';
      case 'normal':
      default:
        return 'none';
    }
  };

  // Start Live Photo video recording during countdown
  const startLivePhotoRecording = () => {
    recordedChunksRef.current = [];
    if (typeof MediaRecorder === 'undefined') return;

    if (videoRef.current && videoRef.current.srcObject) {
      try {
        const stream = videoRef.current.srcObject as MediaStream;
        let mimeType = 'video/webm';
        if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
          mimeType = 'video/webm;codecs=vp9';
        } else if (MediaRecorder.isTypeSupported('video/webm')) {
          mimeType = 'video/webm';
        } else if (MediaRecorder.isTypeSupported('video/mp4')) {
          mimeType = 'video/mp4';
        }

        const recorder = new MediaRecorder(stream, { mimeType });
        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            recordedChunksRef.current.push(e.data);
          }
        };
        recorder.start(100);
        mediaRecorderRef.current = recorder;
      } catch (err) {
        console.warn('Live photo recording could not be started:', err);
      }
    }
  };

  // Stop Live Photo video recording and return blob URL
  const stopLivePhotoRecording = (): Promise<string | undefined> => {
    return new Promise((resolve) => {
      const recorder = mediaRecorderRef.current;
      if (recorder && recorder.state !== 'inactive') {
        recorder.onstop = () => {
          try {
            const blob = new Blob(recordedChunksRef.current, {
              type: recorder.mimeType || 'video/webm',
            });
            if (blob.size > 800) {
              const videoUrl = URL.createObjectURL(blob);
              resolve(videoUrl);
              return;
            }
          } catch (e) {
            console.warn('Error packing live photo blob:', e);
          }
          resolve(undefined);
        };
        try {
          recorder.stop();
        } catch {
          resolve(undefined);
        }
        mediaRecorderRef.current = null;
      } else {
        resolve(undefined);
      }
    });
  };

  // Capture frame directly from video element
  const captureFrameFromVideo = (): string => {
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 960;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    if (video && video.videoWidth > 0) {
      ctx.filter = getFilterCSS(filter);
      if (facingMode === 'user') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = '#18181b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 44px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(
        `SATU.KOSONG8 LIVE PHOTO #${currentShotIndex}`,
        canvas.width / 2,
        canvas.height / 2
      );
    }

    return canvas.toDataURL('image/jpeg', 0.95);
  };

  // Calculate takes needed based on selectedLayout (Layout 6 -> 3 takes, Layout 8 -> 4 takes, Layout 4 -> 4 takes)
  const totalTakesNeeded = selectedLayout === 6 ? 3 : selectedLayout === 8 ? 4 : 4;

  // Render a single strip canvas
  const renderSingleStripCanvas = (
    frames: string[],
    layoutCount: PhotoLayoutCount,
    frame: PhotoFrameOption
  ): Promise<HTMLCanvasElement> => {
    return new Promise((resolve) => {
      const stripCanvas = document.createElement('canvas');

      let stripW = 600;
      let photoW = 520;
      let photoH = 390;
      const topH = 145;
      const bottomH = 120;
      const gap = 20;
      let stripH = 1880;

      if (layoutCount === 4) {
        // 1 Column x 4 Rows
        stripW = 600;
        photoW = 520;
        photoH = 390;
        stripH = topH + 4 * photoH + 3 * gap + bottomH;
      } else if (layoutCount === 6) {
        // 2 Columns x 3 Rows
        stripW = 860;
        photoW = 390;
        photoH = 292;
        stripH = topH + 3 * photoH + 2 * gap + bottomH;
      } else if (layoutCount === 8) {
        // 2 Columns x 4 Rows
        stripW = 860;
        photoW = 390;
        photoH = 292;
        stripH = topH + 4 * photoH + 3 * gap + bottomH;
      }

      stripCanvas.width = stripW;
      stripCanvas.height = stripH;
      const ctx = stripCanvas.getContext('2d');
      if (!ctx) {
        resolve(stripCanvas);
        return;
      }

      // Frame Background
      ctx.fillStyle = frame.bgColor;
      ctx.fillRect(0, 0, stripW, stripH);

      // Frame Border
      ctx.strokeStyle = frame.borderColor;
      ctx.lineWidth = 4;
      ctx.strokeRect(16, 16, stripW - 32, stripH - 32);

      // Logo: "SATU.KOSONG8"
      ctx.textAlign = 'center';
      ctx.fillStyle = frame.textColor;
      ctx.font = '900 44px "Titan One", "Luckiest Guy", sans-serif';
      ctx.fillText('SATU.KOSONG8', stripW / 2, 70);

      // "THE PHOTOBOOTH"
      ctx.fillStyle = frame.subTextColor;
      ctx.font = '700 19px "Titan One", "Luckiest Guy", sans-serif';
      ctx.fillText('THE PHOTOBOOTH', stripW / 2, 106);

      // Apply Zigzag Slot Mapping
      const mappedSlots = mapTakesToSlots(frames, layoutCount);
      let loaded = 0;

      mappedSlots.forEach((slot, idx) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          let x = 0;
          let y = 0;

          if (layoutCount === 4) {
            x = (stripW - photoW) / 2;
            y = topH + idx * (photoH + gap);
          } else {
            // 2 columns
            const col = idx % 2;
            const row = Math.floor(idx / 2);
            const paddingX = (stripW - (2 * photoW + gap)) / 2;
            x = paddingX + col * (photoW + gap);
            y = topH + row * (photoH + gap);
          }

          // Photo border mount
          ctx.fillStyle = frame.photoBorderColor;
          ctx.fillRect(x - 4, y - 4, photoW + 8, photoH + 8);

          // Render photo
          ctx.drawImage(img, x, y, photoW, photoH);

          // Pose letter badge (Pose A, B, C, D)
          ctx.fillStyle = 'rgba(0, 0, 0, 0.72)';
          ctx.beginPath();
          ctx.arc(x + 28, y + 28, 16, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 15px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(slot.poseChar, x + 28, y + 33);

          loaded++;
          if (loaded === mappedSlots.length) {
            const footerY = stripH - 52;
            ctx.fillStyle = frame.textColor;
            ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
            ctx.fillText('SATU.KOSONG8 PHOTOBOOTH', stripW / 2, footerY);

            const dateStr = new Date().toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            });
            ctx.fillStyle = frame.subTextColor;
            ctx.font = '13px "Plus Jakarta Sans", sans-serif';
            ctx.fillText(dateStr, stripW / 2, footerY + 24);

            resolve(stripCanvas);
          }
        };
        img.onerror = () => {
          loaded++;
          if (loaded === mappedSlots.length) resolve(stripCanvas);
        };
        img.src = slot.frame;
      });
    });
  };

  // Build a Twin Sheet canvas containing both Strip 1 and Strip 2 with a clean dashed scissor cut line
  const buildTwinSheetCanvas = (
    c1: HTMLCanvasElement,
    c2: HTMLCanvasElement
  ): HTMLCanvasElement => {
    const twinCanvas = document.createElement('canvas');
    const dividerW = 44;
    const padding = 24;
    twinCanvas.width = c1.width * 2 + dividerW + padding * 2;
    twinCanvas.height = Math.max(c1.height, c2.height) + padding * 2;

    const ctx = twinCanvas.getContext('2d');
    if (!ctx) return twinCanvas;

    // Clean neutral background for twin print sheet
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, twinCanvas.width, twinCanvas.height);

    // Draw strip 1
    ctx.drawImage(c1, padding, padding);

    // Draw strip 2
    const x2 = padding + c1.width + dividerW;
    ctx.drawImage(c2, x2, padding);

    // Draw scissor dashed cut line in the middle
    const middleX = padding + c1.width + dividerW / 2;
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([12, 10]);
    ctx.beginPath();
    ctx.moveTo(middleX, padding);
    ctx.lineTo(middleX, twinCanvas.height - padding);
    ctx.stroke();

    // Center scissor cutting label
    ctx.setLineDash([]);
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('✂ POTONG DI SINI', middleX, padding + 35);
    ctx.fillText('✂ POTONG DI SINI', middleX, twinCanvas.height - padding - 20);
    ctx.restore();

    return twinCanvas;
  };

  // Generate both frames and twin canvas using DISTINCT photos for each frame!
  const generateAllStrips = async (frames1: string[], frames2: string[]) => {
    try {
      const [c1, c2] = await Promise.all([
        renderSingleStripCanvas(frames1, selectedLayout, selectedFrame1),
        renderSingleStripCanvas(frames2, selectedLayout, selectedFrame2),
      ]);

      const twinCanvas = buildTwinSheetCanvas(c1, c2);

      setFinalStripUrl1(c1.toDataURL('image/png'));
      setFinalStripUrl2(c2.toDataURL('image/png'));
      setFinalTwinStripUrl(twinCanvas.toDataURL('image/png'));
      setIsCapturing(false);
      setCurrentStep('RESULT');
    } catch (err) {
      console.error('Error generating photo strips:', err);
    }
  };

  // Start shooting session (Starts with Frame 1)
  const startCaptureSequence = () => {
    if (reviewTimerRef.current) {
      clearInterval(reviewTimerRef.current);
      reviewTimerRef.current = null;
    }
    setShotAttempts({});
    setReviewState(null);
    setCapturedFramesSession1([]);
    setCapturedFramesSession2([]);
    setAllRecordedShots([]);
    setFinalStripUrl1(null);
    setFinalStripUrl2(null);
    setFinalTwinStripUrl(null);
    setCurrentSessionFrameIndex(1);
    setIsIntermissionOpen(false);
    setIsCapturing(true);
    setCurrentStep('PHOTO_SESSION');
    runShot(0, [], 1);
  };

  // Run countdown & capture for specific shot index and session
  const runShot = (shotIdx: number, existingFrames: string[], sessionIndex: 1 | 2) => {
    setCurrentSessionFrameIndex(sessionIndex);
    setCurrentShotIndex(shotIdx + 1);

    // Start live photo recording at countdown start
    startLivePhotoRecording();

    let count = 3;
    setCountdown(count);

    const interval = setInterval(async () => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
      } else {
        clearInterval(interval);
        setCountdown(null);

        // Stop live photo recording
        const liveVideoUrl = await stopLivePhotoRecording();

        // Shutter flash
        setFlashActive(true);
        setTimeout(() => setFlashActive(false), 200);

        const frameData = captureFrameFromVideo();
        const attemptKey = `s${sessionIndex}_p${shotIdx}`;
        const currentAttempt = shotAttempts[attemptKey] || 1;

        // Open quick review for 4 seconds
        let secLeft = 4;
        const newReviewState: ReviewState = {
          photoUrl: frameData,
          livePhotoVideoUrl: liveVideoUrl,
          shotIdx,
          attempt: currentAttempt,
          secondsLeft: secLeft,
          sessionIndex,
        };
        setReviewState(newReviewState);

        if (reviewTimerRef.current) {
          clearInterval(reviewTimerRef.current);
        }

        reviewTimerRef.current = setInterval(() => {
          secLeft -= 1;
          if (secLeft > 0) {
            setReviewState((prev) => (prev ? { ...prev, secondsLeft: secLeft } : null));
          } else {
            if (reviewTimerRef.current) {
              clearInterval(reviewTimerRef.current);
              reviewTimerRef.current = null;
            }
            // Auto accept on timeout
            handleAcceptPose(newReviewState, existingFrames);
          }
        }, 1000);
      }
    }, 1000);
  };

  // Accept pose and continue
  const handleAcceptPose = (stateToAccept?: ReviewState, baseFrames?: string[]) => {
    const activeState = stateToAccept || reviewState;
    if (!activeState) return;

    if (reviewTimerRef.current) {
      clearInterval(reviewTimerRef.current);
      reviewTimerRef.current = null;
    }

    const sessionIdx = activeState.sessionIndex;
    const currentArr =
      baseFrames || (sessionIdx === 1 ? capturedFramesSession1 : capturedFramesSession2);
    const updated = [...currentArr];
    updated[activeState.shotIdx] = activeState.photoUrl;

    // Record as ACCEPTED shot in full roll
    const acceptedShot: RecordedShot = {
      id: `shot-L${sessionIdx}-P${activeState.shotIdx + 1}-T${activeState.attempt}-${Date.now()}`,
      frameIndex: sessionIdx,
      poseNumber: activeState.shotIdx + 1,
      poseChar: String.fromCharCode(65 + activeState.shotIdx),
      attempt: activeState.attempt,
      photoUrl: activeState.photoUrl,
      livePhotoVideoUrl: activeState.livePhotoVideoUrl,
      isAccepted: true,
      timestamp: Date.now(),
    };
    setAllRecordedShots((prev) => [...prev, acceptedShot]);
    setReviewState(null);

    if (sessionIdx === 1) {
      setCapturedFramesSession1(updated);
      if (activeState.shotIdx + 1 < totalTakesNeeded) {
        // Continue to next pose in Session 1
        setTimeout(() => {
          runShot(activeState.shotIdx + 1, updated, 1);
        }, 600);
      } else {
        // Selesai Sesi 1
        if (allowedFramesCount === 1) {
          // Selesai untuk Paket 1 Frame: langsung buat strip cetak (2 lembar identik)
          setTimeout(() => {
            generateAllStrips(updated, updated);
          }, 400);
        } else {
          // Paket 2 Frame: Buka Layar Transisi Bersiap ke Sesi 2 (Pose Baru untuk Frame 2!)
          setTimeout(() => {
            setIsIntermissionOpen(true);
          }, 500);
        }
      }
    } else {
      // sessionIdx === 2
      setCapturedFramesSession2(updated);
      if (activeState.shotIdx + 1 < totalTakesNeeded) {
        // Continue to next pose in Session 2
        setTimeout(() => {
          runShot(activeState.shotIdx + 1, updated, 2);
        }, 600);
      } else {
        // Selesai Sesi 2 -> Buat strip Lembar 1 (foto sesi 1) & Lembar 2 (foto sesi 2)!
        setTimeout(() => {
          generateAllStrips(capturedFramesSession1, updated);
        }, 400);
      }
    }
  };

  // Retake pose (maks. 2x attempt) - Catat foto sebelumnya sebagai blooper/retake agar TIDAK HILANG!
  const handleRetakePose = () => {
    if (!reviewState) return;
    if (reviewState.attempt >= MAX_RETAKES_PER_POSE) return;

    if (reviewTimerRef.current) {
      clearInterval(reviewTimerRef.current);
      reviewTimerRef.current = null;
    }

    const sessionIdx = reviewState.sessionIndex;
    const targetShotIdx = reviewState.shotIdx;

    // Simpan foto yang di-retake ini sebagai Blooper / Retake ke arsip galeri!
    const blooperShot: RecordedShot = {
      id: `shot-L${sessionIdx}-P${targetShotIdx + 1}-T${reviewState.attempt}-blooper-${Date.now()}`,
      frameIndex: sessionIdx,
      poseNumber: targetShotIdx + 1,
      poseChar: String.fromCharCode(65 + targetShotIdx),
      attempt: reviewState.attempt,
      photoUrl: reviewState.photoUrl,
      livePhotoVideoUrl: reviewState.livePhotoVideoUrl,
      isAccepted: false,
      timestamp: Date.now(),
    };
    setAllRecordedShots((prev) => [...prev, blooperShot]);

    const nextAttempt = reviewState.attempt + 1;
    const attemptKey = `s${sessionIdx}_p${targetShotIdx}`;
    setShotAttempts((prev) => ({ ...prev, [attemptKey]: nextAttempt }));
    setReviewState(null);

    const currentArr = sessionIdx === 1 ? capturedFramesSession1 : capturedFramesSession2;

    // Langsung hitung mundur ulang untuk pose tersebut
    setTimeout(() => {
      runShot(targetShotIdx, currentArr, sessionIdx);
    }, 400);
  };

  // Start Session 2 from Intermission
  const handleStartSession2 = () => {
    setIsIntermissionOpen(false);
    setCurrentSessionFrameIndex(2);
    setShotAttempts({});
    setTimeout(() => {
      runShot(0, [], 2);
    }, 400);
  };

  const activeCapturedFrames =
    currentSessionFrameIndex === 1 ? capturedFramesSession1 : capturedFramesSession2;
  const currentFrameOption =
    currentSessionFrameIndex === 1 ? selectedFrame1 : selectedFrame2;

  return (
    <main className="relative h-screen w-screen overflow-hidden font-body select-none">
      {/* 1. Fullscreen Live Camera Background */}
      <LiveCameraBackground
        facingMode={facingMode}
        onToggleFacingMode={() =>
          setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'))
        }
        filter={filter}
        videoRef={videoRef}
        isCapturing={isCapturing}
      />

      {/* Top Floating Control Bar */}
      <header className="absolute top-5 right-5 z-30 flex items-center gap-2">
        <button
          onClick={() =>
            setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'))
          }
          title="Balik Kamera Depan / Belakang"
          aria-label="Balik Kamera Depan / Belakang"
          className="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/50 px-3.5 py-2 text-xs font-semibold text-white/90 shadow-lg backdrop-blur-md transition-all hover:bg-black/70 hover:text-white cursor-pointer"
        >
          <FlipHorizontal className="h-4 w-4 text-white" />
          <span className="hidden sm:inline">Balik Kamera</span>
        </button>

        <button
          onClick={handleToggleFullscreen}
          title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
          aria-label={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
          className="rounded-full border border-white/20 bg-black/50 p-2 text-white/90 shadow-lg backdrop-blur-md transition-all hover:bg-black/70 hover:text-white cursor-pointer"
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4 text-zinc-300" />
          ) : (
            <Maximize2 className="h-4 w-4 text-zinc-300" />
          )}
        </button>
      </header>

      {/* 2. Main Content Screens based on currentStep */}
      <div className="relative z-20 flex h-full w-full items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Step 1: HOME / Standby Screen */}
        {currentStep === 'HOME' && !isCapturing && (
          <CenterCard
            onStart={() => setCurrentStep('STEP_GUIDE')}
            filter={filter}
            setFilter={setFilter}
            onFlipCamera={() =>
              setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'))
            }
          />
        )}

        {/* Step 2: Separate 4 Steps Guide (after "Sentuh untuk Mulai") */}
        {currentStep === 'STEP_GUIDE' && !isCapturing && (
          <PhotoboothStepGuide
            onNext={() => setCurrentStep('START_OPTIONS')}
            onBack={() => setCurrentStep('HOME')}
          />
        )}

        {/* Step 3: START_OPTIONS (Mari mulai sesi anda) */}
        {currentStep === 'START_OPTIONS' && !isCapturing && (
          <StartSessionPage
            onSelectHaveCode={() => setIsEnterCodeOpen(true)}
            onSelectNoCode={() => setCurrentStep('PACKAGE_SELECTION')}
            onBack={() => setCurrentStep('STEP_GUIDE')}
          />
        )}

        {/* Step 3: PACKAGE_SELECTION (Pilih Paket Photobooth) */}
        {currentStep === 'PACKAGE_SELECTION' && !isCapturing && (
          <PackageSelectionPage
            onSelectPackage={(pkg) => setSelectedPackageForQris(pkg)}
            onBack={() => setCurrentStep('START_OPTIONS')}
          />
        )}

        {/* Step 4: LAYOUT_SELECTION (Pilihan Layout 4, 6, 8) */}
        {currentStep === 'LAYOUT_SELECTION' && !isCapturing && (
          <LayoutSelectionPage
            selectedLayout={selectedLayout}
            onSelectLayout={(layout) => setSelectedLayout(layout)}
            onNext={() => setCurrentStep('FRAME_SELECTION')}
            onBack={() => setCurrentStep('START_OPTIONS')}
          />
        )}

        {/* Step 5: FRAME_SELECTION (Pilihan Frame Berdasarkan Paket: 1 atau 2 Frame) */}
        {currentStep === 'FRAME_SELECTION' && !isCapturing && (
          <FrameSelectionPage
            selectedLayout={selectedLayout}
            allowedFramesCount={allowedFramesCount}
            activePackageName={activePackageName}
            selectedFrame1={selectedFrame1}
            selectedFrame2={selectedFrame2}
            onSelectFrame1={(frame) => setSelectedFrame1(frame)}
            onSelectFrame2={(frame) => setSelectedFrame2(frame)}
            onStartPhotoSession={() => startCaptureSequence()}
            onBack={() => setCurrentStep('LAYOUT_SELECTION')}
          />
        )}
      </div>

      {/* Pop-up Masuk Kode (when choosing "Punya Kode?") */}
      <EnterCodeModal
        isOpen={isEnterCodeOpen}
        onClose={() => setIsEnterCodeOpen(false)}
        onCodeVerified={(voucher: VoucherCode) => {
          setIsEnterCodeOpen(false);
          setAllowedFramesCount(voucher.framesCount);
          setActivePackageName(voucher.packageName);
          if (voucher.framesCount === 1) {
            setSelectedFrame2(selectedFrame1);
          }
          setCurrentStep('LAYOUT_SELECTION');
        }}
      />

      {/* Pop-up QRIS Payment (when choosing a package from "Belum punya kode?") */}
      <QrisPaymentModal
        pkg={selectedPackageForQris}
        isOpen={Boolean(selectedPackageForQris)}
        onClose={() => setSelectedPackageForQris(null)}
        onPaymentSuccess={(pkg: PhotoboothPackage) => {
          setSelectedPackageForQris(null);
          setAllowedFramesCount(pkg.frames as 1 | 2);
          setActivePackageName(`${pkg.name} (${pkg.frames} Frame)`);
          if (pkg.frames === 1) {
            setSelectedFrame2(selectedFrame1);
          }
          setCurrentStep('LAYOUT_SELECTION');
        }}
      />

      {/* 3. Active Live Shooting HUD (When capturing on live camera) */}
      <AnimatePresence>
        {isCapturing && !isIntermissionOpen && (
          <div className="pointer-events-none fixed inset-0 z-30 flex flex-col justify-between p-6 md:p-10">
            {/* Top HUD: Shot indicator & Active Frame info */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex items-center justify-between"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                {/* Active Frame Badge */}
                <div className="flex items-center gap-2 rounded-full border border-white/20 bg-black/80 px-4 py-2 text-sm font-bold text-white shadow-xl backdrop-blur-md">
                  <span className="h-3 w-3 rounded-full bg-red-500 animate-ping" />
                  <span>
                    {allowedFramesCount === 1
                      ? `FRAME: ${currentFrameOption.name}`
                      : `LEMBAR ${currentSessionFrameIndex} / 2: ${currentFrameOption.name}`}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-300 border border-blue-500/30">
                  <span>
                    Pose {currentShotIndex}/{totalTakesNeeded} ({String.fromCharCode(65 + currentShotIndex - 1)})
                  </span>
                </div>

                {countdown !== null && (
                  <span className="hidden sm:inline-flex rounded-full bg-yellow-400/20 px-3 py-1 text-xs font-bold text-yellow-300 border border-yellow-400/40 animate-pulse">
                    ⚡ Live Photo Recording
                  </span>
                )}
              </div>

              {/* Thumbnail strip of taken shots for this session */}
              <div className="flex gap-1.5 sm:gap-2 flex-wrap max-w-xs sm:max-w-md justify-end">
                {Array.from({ length: totalTakesNeeded }).map((_, idx) => (
                  <div
                    key={idx}
                    className="h-14 w-10 sm:h-16 sm:w-12 overflow-hidden rounded-lg border border-white/40 bg-black/70 shadow-lg flex flex-col items-center justify-center text-xs font-bold text-zinc-400"
                  >
                    {activeCapturedFrames[idx] ? (
                      <img
                        src={activeCapturedFrames[idx]}
                        alt={`Pose ${String.fromCharCode(65 + idx)}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <>
                        <span className="text-white text-xs font-black">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="text-[8px] text-zinc-500">#{idx + 1}</span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Center Countdown */}
            <div className="flex items-center justify-center">
              {countdown !== null && (
                <motion.div
                  key={countdown}
                  initial={{ scale: 0.3, opacity: 0 }}
                  animate={{ scale: 1.3, opacity: 1 }}
                  exit={{ scale: 2.2, opacity: 0 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  className="relative flex h-40 w-40 md:h-52 md:w-52 items-center justify-center rounded-full border-4 border-white bg-black/50 shadow-[0_0_60px_rgba(255,255,255,0.4)] backdrop-blur-md"
                >
                  <span className="font-comic text-7xl md:text-8xl text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
                    {countdown}
                  </span>
                </motion.div>
              )}
            </div>

            {/* Bottom guide text */}
            <div className="text-center">
              <span className="rounded-full bg-black/75 px-6 py-2 text-xs sm:text-sm font-semibold text-white shadow-lg backdrop-blur-md border border-white/15">
                {allowedFramesCount === 1
                  ? `Pose ${currentShotIndex} dari ${totalTakesNeeded} — Gaya bebas & senyum terbaik! 📸`
                  : `Lembar ${currentSessionFrameIndex} • Pose ${currentShotIndex} dari ${totalTakesNeeded} — Gaya bebas & senyum terbaik! 📸`}
                <span className="text-zinc-400 ml-1.5 hidden sm:inline">
                  • Retake & Live Photo tersimpan otomatis
                </span>
              </span>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Transition Between Session 1 and Session 2 */}
      {isIntermissionOpen && (
        <InterSessionTransition
          completedFrame={selectedFrame1}
          nextFrame={selectedFrame2}
          completedPhotos={capturedFramesSession1}
          totalTakesNeeded={totalTakesNeeded}
          onStartNextSession={handleStartSession2}
        />
      )}

      {/* Quick Review & Retake Overlay per Pose */}
      {reviewState && !isIntermissionOpen && (
        <QuickPoseReviewModal
          isOpen={Boolean(reviewState)}
          frameIndex={reviewState.sessionIndex}
          frameName={
            reviewState.sessionIndex === 1 ? selectedFrame1.name : selectedFrame2.name
          }
          currentPoseIndex={reviewState.shotIdx + 1}
          totalPoses={totalTakesNeeded}
          poseChar={String.fromCharCode(65 + reviewState.shotIdx)}
          photoUrl={reviewState.photoUrl}
          livePhotoVideoUrl={reviewState.livePhotoVideoUrl}
          currentAttempt={reviewState.attempt}
          maxAttempts={MAX_RETAKES_PER_POSE}
          secondsRemaining={reviewState.secondsLeft}
          onAccept={() => handleAcceptPose()}
          onRetake={() => handleRetakePose()}
        />
      )}

      {/* Shutter White Flash effect */}
      <AnimatePresence>
        {flashActive && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="pointer-events-none fixed inset-0 z-50 bg-white"
          />
        )}
      </AnimatePresence>

      {/* 4. Photobooth Strip Result Modal (Twin + Lembar 1 + Lembar 2 + All Raw Photos + Bloopers + Live Photos + Email/Drive) */}
      <PhotoStripResult
        stripUrl1={finalStripUrl1}
        stripUrl2={finalStripUrl2}
        twinStripUrl={finalTwinStripUrl}
        allShots={allRecordedShots}
        isOpen={Boolean(finalTwinStripUrl || finalStripUrl1)}
        layoutCount={selectedLayout}
        allowedFramesCount={allowedFramesCount}
        packageName={activePackageName}
        frame1Name={selectedFrame1.name}
        frame2Name={selectedFrame2.name}
        onClose={() => {
          setFinalStripUrl1(null);
          setFinalStripUrl2(null);
          setFinalTwinStripUrl(null);
          setCapturedFramesSession1([]);
          setCapturedFramesSession2([]);
          setAllRecordedShots([]);
          setShotAttempts({});
          setCurrentStep('HOME');
        }}
      />
    </main>
  );
}
