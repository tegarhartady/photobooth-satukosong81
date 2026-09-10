import { PhotoFrameOption, PHOTO_FRAME_OPTIONS } from '../types/photobooth';

const FRAMES_STORAGE_KEY = 'satukosong8_dynamic_frames_v1';

// Base URL POS backend (dapat dikonfigurasi via env VITE_POS_API_URL)
const POS_API_BASE_URL =
  ((import.meta as unknown as { env?: Record<string, string> }).env?.VITE_POS_API_URL as string) ||
  '';

/**
 * Payload data untuk membuat / menambah frame baru
 */
export interface CreateFramePayload {
  name: string;
  tagline: string;
  bgColor: string;
  textColor: string;
  subTextColor?: string;
  borderColor?: string;
  photoBorderColor?: string;
  badgeBg?: string;
  badgeTextColor?: string;
  accentColor?: string;
  frameImageUrl?: string;
  category?: string;
}

/**
 * Mengambil daftar frame gabungan (Frame Default bawaan + Frame Dinamis dari API / LocalStorage)
 */
export async function fetchAllFrames(): Promise<PhotoFrameOption[]> {
  let customFrames: PhotoFrameOption[] = [];

  // 1. Coba fetch dari backend POS jika API URL dikonfigurasi
  if (POS_API_BASE_URL) {
    try {
      const response = await fetch(`${POS_API_BASE_URL}/api/frames`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        const json = await response.json();
        const apiFrames: PhotoFrameOption[] = Array.isArray(json) ? json : json.data || [];
        if (apiFrames.length > 0) {
          // Simpan cache ke localStorage untuk offline resilience
          saveFramesToLocalCache(apiFrames);
          return mergeFrames(PHOTO_FRAME_OPTIONS, apiFrames);
        }
      }
    } catch (err) {
      console.warn('Gagal fetch frame dari POS API, menggunakan cache lokal:', err);
    }
  }

  // 2. Baca dari cache localStorage
  try {
    const raw = localStorage.getItem(FRAMES_STORAGE_KEY);
    if (raw) {
      customFrames = JSON.parse(raw);
    }
  } catch (e) {
    console.error('Gagal membaca frame dari localStorage:', e);
  }

  return mergeFrames(PHOTO_FRAME_OPTIONS, customFrames);
}

/**
 * API untuk Menambahkan Frame Baru (Dipanggil dari POS atau Admin Kiosk)
 * POST /api/frames
 */
export async function addNewFrame(payload: CreateFramePayload): Promise<PhotoFrameOption> {
  const newId = `frame-${Date.now()}-${payload.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

  const completeFrame: PhotoFrameOption = {
    id: newId,
    name: payload.name.trim(),
    tagline: payload.tagline.trim() || 'Custom Edition',
    bgColor: payload.bgColor || '#18181b',
    textColor: payload.textColor || '#ffffff',
    subTextColor: payload.subTextColor || payload.textColor || '#a1a1aa',
    borderColor: payload.borderColor || payload.bgColor || '#3f3f46',
    photoBorderColor: payload.photoBorderColor || '#ffffff',
    badgeBg: payload.badgeBg || payload.textColor || '#ffffff',
    badgeTextColor: payload.badgeTextColor || payload.bgColor || '#000000',
    accentColor: payload.accentColor || '#ef4444',
    frameImageUrl: payload.frameImageUrl,
    isCustom: true,
    createdAt: Date.now(),
    category: payload.category || 'Custom POS',
  };

  // 1. Tembak ke API POS backend jika terkonfigurasi
  if (POS_API_BASE_URL) {
    try {
      const response = await fetch(`${POS_API_BASE_URL}/api/frames`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(completeFrame),
      });

      if (response.ok) {
        const result = await response.json();
        const serverFrame = result.data || result;
        saveSingleFrameToLocal(serverFrame);
        return serverFrame;
      }
    } catch (err) {
      console.warn('Gagal menembak POST frame ke POS backend, menyimpan lokal:', err);
    }
  }

  // 2. Simpan lokal & fallback
  saveSingleFrameToLocal(completeFrame);
  return completeFrame;
}

/**
 * Menghapus frame custom
 * DELETE /api/frames/:id
 */
export async function deleteCustomFrame(frameId: string): Promise<boolean> {
  if (POS_API_BASE_URL) {
    try {
      await fetch(`${POS_API_BASE_URL}/api/frames/${frameId}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.warn('Gagal menghapus frame di backend:', err);
    }
  }

  try {
    const raw = localStorage.getItem(FRAMES_STORAGE_KEY);
    if (raw) {
      const frames: PhotoFrameOption[] = JSON.parse(raw);
      const updated = frames.filter((f) => f.id !== frameId);
      localStorage.setItem(FRAMES_STORAGE_KEY, JSON.stringify(updated));
    }
    return true;
  } catch (e) {
    console.error('Gagal menghapus frame lokal:', e);
    return false;
  }
}

/**
 * Reset kembali ke daftar frame standar
 */
export function resetFramesToDefault(): PhotoFrameOption[] {
  localStorage.removeItem(FRAMES_STORAGE_KEY);
  return [...PHOTO_FRAME_OPTIONS];
}

// Helper penyimpanan lokal
function saveFramesToLocalCache(frames: PhotoFrameOption[]) {
  try {
    localStorage.setItem(FRAMES_STORAGE_KEY, JSON.stringify(frames));
  } catch (e) {
    console.warn('Gagal menyimpan cache frame:', e);
  }
}

function saveSingleFrameToLocal(frame: PhotoFrameOption) {
  try {
    const raw = localStorage.getItem(FRAMES_STORAGE_KEY);
    const existing: PhotoFrameOption[] = raw ? JSON.parse(raw) : [];
    // Hindari duplikasi ID
    const updated = [...existing.filter((f) => f.id !== frame.id), frame];
    localStorage.setItem(FRAMES_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Gagal menyimpan single frame:', e);
  }
}

function mergeFrames(defaults: PhotoFrameOption[], custom: PhotoFrameOption[]): PhotoFrameOption[] {
  const map = new Map<string, PhotoFrameOption>();
  defaults.forEach((f) => map.set(f.id, f));
  custom.forEach((f) => map.set(f.id, f));
  return Array.from(map.values());
}
