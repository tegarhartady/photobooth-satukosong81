export type AppStep =
  | 'HOME'
  | 'STEP_GUIDE'
  | 'START_OPTIONS'
  | 'PACKAGE_SELECTION'
  | 'QRIS_PAYMENT'
  | 'LAYOUT_SELECTION'
  | 'FRAME_SELECTION'
  | 'PHOTO_SESSION'
  | 'CUSTOMIZE'
  | 'RESULT';

export type PhotoLayoutCount = 4 | 6 | 8;

export interface PhotoLayoutOption {
  count: PhotoLayoutCount;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  columns: number;
  rows: number;
  takesNeeded: number;
  patternLabel: string;
}

export const PHOTO_LAYOUT_OPTIONS: PhotoLayoutOption[] = [
  {
    count: 4,
    title: 'Layout 4 Foto',
    subtitle: 'Classic 4-Cut Strip',
    description: 'Format vertikal 4 pose klasik. Cukup 4 kali jepret cepat.',
    badge: 'Paling Populer',
    columns: 1,
    rows: 4,
    takesNeeded: 4,
    patternLabel: '4 Pose Klasik',
  },
  {
    count: 6,
    title: 'Layout 6 Foto',
    subtitle: 'Twin Zigzag 2x3 Grid',
    description: 'Pola zigzag duplikat aesthetic. Hanya butuh 3x take foto cepat!',
    badge: '3x Take Cepat ⚡',
    columns: 2,
    rows: 3,
    takesNeeded: 3,
    patternLabel: 'Duplikat Zigzag (3 Take)',
  },
  {
    count: 8,
    title: 'Layout 8 Foto',
    subtitle: 'Deluxe Zigzag 2x4 Collage',
    description: 'Pola silang dinamis 8 slot. Hanya butuh 4x take foto seru!',
    badge: '4x Take Cepat ⚡',
    columns: 2,
    rows: 4,
    takesNeeded: 4,
    patternLabel: 'Duplikat Zigzag (4 Take)',
  },
];

export const MAX_RETAKES_PER_POSE = 2; // Maksimal 2 kali take (1x take pertama + 1x kesempatan retake)

export interface RecordedShot {
  id: string;
  frameIndex: 1 | 2; // Sesi Frame 1 atau Sesi Frame 2
  poseNumber: number; // 1, 2, 3...
  poseChar: string; // 'A', 'B', 'C', 'D'
  attempt: number; // 1, 2 (kesempatan retake)
  photoUrl: string; // Still photo (JPEG / PNG base64)
  livePhotoVideoUrl?: string; // Live Photo motion clip (WebM / video blob URL)
  isAccepted: boolean; // true jika dipilih masuk cetak strip, false jika retake/blooper
  timestamp: number;
}

export interface CustomerDeliveryInfo {
  email: string;
  notes?: string;
}

/**
 * Memetakan hasil take foto ke slot layout cetak (termasuk pola Zigzag duplikat)
 */
export function mapTakesToSlots(
  takenFrames: string[],
  layoutCount: PhotoLayoutCount
): { frame: string; takeNumber: number; poseChar: string }[] {
  if (layoutCount === 4) {
    // 4 Slots -> 4 Takes [0, 1, 2, 3]
    return [0, 1, 2, 3].map((idx) => ({
      frame: takenFrames[idx] || '',
      takeNumber: idx + 1,
      poseChar: String.fromCharCode(65 + idx), // A, B, C, D
    }));
  }

  if (layoutCount === 6) {
    // 6 Slots -> 3 Takes [0: A, 1: B, 2: C]
    // Row 1: [A, B] -> indices [0, 1]
    // Row 2: [C, A] -> indices [2, 0] (Zigzag shift A ke kanan!)
    // Row 3: [B, C] -> indices [1, 2] (Zigzag shift B & C)
    const slotIndices = [0, 1, 2, 0, 1, 2];
    return slotIndices.map((takeIdx) => ({
      frame: takenFrames[takeIdx] || '',
      takeNumber: takeIdx + 1,
      poseChar: String.fromCharCode(65 + takeIdx), // A, B, C
    }));
  }

  // layoutCount === 8
  // 8 Slots -> 4 Takes [0: A, 1: B, 2: C, 3: D]
  // Row 1: [A, B] -> indices [0, 1]
  // Row 2: [C, D] -> indices [2, 3]
  // Row 3: [B, A] -> indices [1, 0] (Zigzag swap A & B)
  // Row 4: [D, C] -> indices [3, 2] (Zigzag swap C & D)
  const slotIndices = [0, 1, 2, 3, 1, 0, 3, 2];
  return slotIndices.map((takeIdx) => ({
    frame: takenFrames[takeIdx] || '',
    takeNumber: takeIdx + 1,
    poseChar: String.fromCharCode(65 + takeIdx), // A, B, C, D
  }));
}

export interface PhotoFrameOption {
  id: string;
  name: string;
  tagline: string;
  bgColor: string;
  textColor: string;
  subTextColor: string;
  borderColor: string;
  photoBorderColor: string;
  badgeBg: string;
  badgeTextColor: string;
  accentColor: string;
  isCustom?: boolean;
  category?: string;
  createdAt?: number;
  frameImageUrl?: string;
}

export const PHOTO_FRAME_OPTIONS: PhotoFrameOption[] = [
  {
    id: 'studio-white',
    name: 'Studio White',
    tagline: 'Clean & Minimalist',
    bgColor: '#ffffff',
    textColor: '#18181b',
    subTextColor: '#52525b',
    borderColor: '#e4e4e7',
    photoBorderColor: '#09090b',
    badgeBg: '#18181b',
    badgeTextColor: '#ffffff',
    accentColor: '#c40e1e',
  },
  {
    id: 'satu-red',
    name: 'Satu.Kosong8 Red',
    tagline: 'Signature & Energetic',
    bgColor: '#c40e1e',
    textColor: '#ffffff',
    subTextColor: '#fecaca',
    borderColor: '#ef4444',
    photoBorderColor: '#ffffff',
    badgeBg: '#ffffff',
    badgeTextColor: '#c40e1e',
    accentColor: '#facc15',
  },
  {
    id: 'noir-charcoal',
    name: 'Noir Charcoal',
    tagline: 'Dark Luxury & Modern',
    bgColor: '#121214',
    textColor: '#ffffff',
    subTextColor: '#a1a1aa',
    borderColor: '#27272a',
    photoBorderColor: '#ffffff',
    badgeBg: '#27272a',
    badgeTextColor: '#ffffff',
    accentColor: '#e4e4e7',
  },
  {
    id: 'butter-pastel',
    name: 'Butter Pastel',
    tagline: 'Retro Warm Vibes',
    bgColor: '#fef08a',
    textColor: '#422006',
    subTextColor: '#713f12',
    borderColor: '#facc15',
    photoBorderColor: '#422006',
    badgeBg: '#713f12',
    badgeTextColor: '#fef08a',
    accentColor: '#ca8a04',
  },
  {
    id: 'y2k-silver',
    name: 'Y2K Cyber Chrome',
    tagline: 'Metallic & Futuristic',
    bgColor: '#cbd5e1',
    textColor: '#0f172a',
    subTextColor: '#334155',
    borderColor: '#94a3b8',
    photoBorderColor: '#0f172a',
    badgeBg: '#0f172a',
    badgeTextColor: '#f8fafc',
    accentColor: '#2563eb',
  },
  {
    id: 'sweet-lilac',
    name: 'Sweet Lilac',
    tagline: 'Dreamy & Aesthetic',
    bgColor: '#e9d5ff',
    textColor: '#3b0764',
    subTextColor: '#581c87',
    borderColor: '#d8b4fe',
    photoBorderColor: '#3b0764',
    badgeBg: '#581c87',
    badgeTextColor: '#faf5ff',
    accentColor: '#9333ea',
  },
];

export interface PhotoboothPackage {
  id: 'hemat' | 'combo';
  name: string;
  priceFormatted: string;
  priceNumber: number;
  tagline: string;
  sessions: number;
  sheets: number;
  frames: number;
  isPopular?: boolean;
}

export const PHOTOBOOTH_PACKAGES: PhotoboothPackage[] = [
  {
    id: 'hemat',
    name: 'Paket Hemat',
    priceFormatted: 'Rp 25.000',
    priceNumber: 25000,
    tagline: 'Cocok untuk yang mau abadikan moment dengan 1 versi',
    sessions: 1,
    sheets: 2,
    frames: 1,
  },
  {
    id: 'combo',
    name: 'Paket Combo',
    priceFormatted: 'Rp 35.000',
    priceNumber: 35000,
    tagline: 'Cocok untuk yang mau lebih banyak kenangan dengan versi berbeda',
    sessions: 2,
    sheets: 4,
    frames: 2,
    isPopular: true,
  },
];

export interface VoucherCode {
  code: string;
  label: string;
  packageName: string;
  framesCount: 1 | 2;
  sessionsCount: 1 | 2;
  sheetsCount: number;
  priceFormatted: string;
  isUsed: boolean;
  usedAt?: number;
  usedAtFormatted?: string;
  createdBy?: string;
}
