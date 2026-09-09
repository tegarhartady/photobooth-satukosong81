import JSZip from 'jszip';
import { RecordedShot } from '../types/photobooth';

export function dataURItoBlob(dataURI: string): Blob {
  const parts = dataURI.split(',');
  const byteString = atob(parts[1]);
  const mimeString = parts[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

export function sanitize(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '-');
}

/**
 * Generate a complete ZIP archive of the entire session:
 * - Print-ready strips (Twin, Frame 1, Frame 2)
 * - Raw photos per take (Accepted)
 * - Retakes / Bloopers (Unused photos)
 * - Live Photo video clips (.webm)
 * - Readme session receipt
 */
export async function createSessionZip(data: {
  twinStripUrl: string | null;
  stripUrl1: string | null;
  stripUrl2: string | null;
  allShots: RecordedShot[];
  frame1Name: string;
  frame2Name: string;
}): Promise<Blob> {
  const zip = new JSZip();

  // 1. Folder Strip Cetak Fisik
  const printFolder = zip.folder('strip-cetak-fisik');
  if (printFolder) {
    if (data.twinStripUrl) {
      printFolder.file('00-twin-print-2-lembar.png', dataURItoBlob(data.twinStripUrl));
    }
    if (data.stripUrl1) {
      printFolder.file(
        `01-strip-lembar-1-${sanitize(data.frame1Name)}.png`,
        dataURItoBlob(data.stripUrl1)
      );
    }
    if (data.stripUrl2) {
      printFolder.file(
        `02-strip-lembar-2-${sanitize(data.frame2Name)}.png`,
        dataURItoBlob(data.stripUrl2)
      );
    }
  }

  // 2. Folder Foto Mentah Per Take (Terpilih)
  const acceptedFolder = zip.folder('foto-per-take-terpilih');
  // 3. Folder Foto Retake / Bloopers (Tetap disimpan untuk kenangan!)
  const retakesFolder = zip.folder('foto-retake-bloopers');
  // 4. Folder Live Photo Video Clips
  const liveFolder = zip.folder('live-photos-video');

  for (const shot of data.allShots) {
    const fileName = `lembar-${shot.frameIndex}-pose-${shot.poseChar}-take-${shot.attempt}.jpg`;
    const targetFolder = shot.isAccepted ? acceptedFolder : retakesFolder;

    if (targetFolder && shot.photoUrl && shot.photoUrl.startsWith('data:')) {
      targetFolder.file(fileName, dataURItoBlob(shot.photoUrl));
    }

    if (liveFolder && shot.livePhotoVideoUrl) {
      try {
        const vidBlob = await fetch(shot.livePhotoVideoUrl).then((r) => r.blob());
        if (vidBlob) {
          liveFolder.file(
            `live-lembar-${shot.frameIndex}-pose-${shot.poseChar}-take-${shot.attempt}.webm`,
            vidBlob
          );
        }
      } catch (err) {
        console.warn('Could not add live photo video to zip:', err);
      }
    }
  }

  // 5. Digital receipt text file
  const dateStr = new Date().toLocaleString('id-ID', {
    dateStyle: 'full',
    timeStyle: 'medium',
  });
  const receiptText = `================================================
  SATU.KOSONG8 - THE PHOTOBOOTH
================================================
Waktu Sesi      : ${dateStr}
Lembar 1 Frame  : ${data.frame1Name}
Lembar 2 Frame  : ${data.frame2Name}
Total Foto Ambil: ${data.allShots.length} foto (termasuk retake & bloopers)

ISI ARSIP FOLDER INI:
1. /strip-cetak-fisik/       -> Strip resolusi tinggi siap cetak & potong
2. /foto-per-take-terpilih/  -> Foto pose terpilih resolusi asli tanpa frame
3. /foto-retake-bloopers/    -> Foto-foto saat retake (ekspresi lucu & bloopers)
4. /live-photos-video/       -> Video klip Live Photo saat detik-detik berpose

Simpan kenangan ini selamanya. Terima kasih telah mampir ke Satu.Kosong8!
================================================`;

  zip.file('INFO-SESI-SATUKOSONG8.txt', receiptText);

  return await zip.generateAsync({ type: 'blob' });
}
