/**
 * SATU.KOSONG8 PHOTOBOOTH - POS API CLIENT & SPECIFICATION
 * 
 * Modul ini menghubungkan Photobooth Kiosk dengan Backend POS / Dashboard Admin.
 * Base URL dapat diatur melalui environment variable `VITE_POS_API_URL`
 * Contoh: VITE_POS_API_URL=https://pos.satukosong8.com
 */

import { PhotoFrameOption } from '../types/photobooth';
import { CreateFramePayload, fetchAllFrames, addNewFrame, deleteCustomFrame } from './frameApi';

const POS_API_BASE =
  ((import.meta as unknown as { env?: Record<string, string> }).env?.VITE_POS_API_URL as string) ||
  '';

export interface PosVoucherResponse {
  valid: boolean;
  code: string;
  packageName: string;
  framesCount: 1 | 2;
  sessionsCount: number;
  sheetsCount: number;
  priceFormatted: string;
  message?: string;
}

export interface PosQrisCreateRequest {
  type: 'SESSION' | 'EXTRA_PRINT';
  amount: number;
  packageName?: string;
  extraPrintQuantity?: number;
  kioskId?: string;
}

export interface PosQrisCreateResponse {
  transactionId: string;
  qrString: string;
  qrImageUrl?: string;
  amount: number;
  expiresAt: number;
}

export interface PosSessionFinishPayload {
  kioskId?: string;
  voucherCode?: string;
  packageId?: string;
  layoutCount: number;
  framesUsed: string[];
  totalPrints: number;
  extraPrints: number;
  timestamp: number;
}

export const posApi = {
  // =====================
  // 1. FRAME MANAGEMENT API
  // =====================
  
  /**
   * GET /api/frames
   * Mengambil semua frame yang aktif (bisa bertambah dari POS)
   */
  async getFrames(): Promise<PhotoFrameOption[]> {
    return await fetchAllFrames();
  },

  /**
   * POST /api/frames
   * Menambahkan frame baru dari POS / Admin Kiosk
   */
  async createFrame(payload: CreateFramePayload): Promise<PhotoFrameOption> {
    return await addNewFrame(payload);
  },

  /**
   * DELETE /api/frames/:id
   * Menghapus frame custom
   */
  async deleteFrame(frameId: string): Promise<boolean> {
    return await deleteCustomFrame(frameId);
  },

  // =====================
  // 2. VOUCHER KASIR API
  // =====================

  /**
   * POST /api/voucher/verify
   * Memverifikasi kode 6 digit dari struk kasir
   */
  async verifyVoucher(code: string): Promise<PosVoucherResponse> {
    if (POS_API_BASE) {
      try {
        const res = await fetch(`${POS_API_BASE}/api/voucher/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn('POS API offline, fallback to local verification:', err);
      }
    }

    // Local Fallback simulation (jika POS backend belum aktif)
    const { verifyAndRedeemVoucher } = await import('../utils/voucherCodes');
    const local = verifyAndRedeemVoucher(code);
    return {
      valid: local.success,
      code,
      packageName: local.voucher?.packageName || 'Paket Photobooth',
      framesCount: local.voucher?.framesCount || 1,
      sessionsCount: local.voucher?.sessionsCount || 1,
      sheetsCount: local.voucher?.sheetsCount || 2,
      priceFormatted: local.voucher?.priceFormatted || 'Rp 25.000',
      message: local.message,
    };
  },

  /**
   * POST /api/voucher/claim
   * Menandai kode sudah terpakai
   */
  async claimVoucher(code: string): Promise<boolean> {
    if (POS_API_BASE) {
      try {
        const res = await fetch(`${POS_API_BASE}/api/voucher/claim`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, kioskId: 'KIOSK-01', claimedAt: Date.now() }),
        });
        return res.ok;
      } catch (err) {
        console.warn('POS API claim voucher failed:', err);
      }
    }

    const { verifyAndRedeemVoucher } = await import('../utils/voucherCodes');
    verifyAndRedeemVoucher(code);
    return true;
  },

  // =====================
  // 3. QRIS DYNAMIC API
  // =====================

  /**
   * POST /api/qris/create
   * Meminta string/gambar QRIS dinamis dari POS
   */
  async createQris(payload: PosQrisCreateRequest): Promise<PosQrisCreateResponse> {
    if (POS_API_BASE) {
      try {
        const res = await fetch(`${POS_API_BASE}/api/qris/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn('POS API create QRIS failed, using simulated QRIS:', err);
      }
    }

    // Default simulated QRIS
    return {
      transactionId: `TRX-${Date.now()}`,
      qrString: `00020101021126580014ID.LINKAJA.WWW0118936009180000000000520458125303360540${payload.amount}5802ID5916SATU KOSONG8 KIOSK6007JAKARTA62070703A016304ABCD`,
      amount: payload.amount,
      expiresAt: Date.now() + 5 * 60 * 1000,
    };
  },

  /**
   * POST /api/kiosk/session-finish
   * Melaporkan sesi selesai & memotong counter stok kertas printer di POS
   */
  async reportSessionFinish(payload: PosSessionFinishPayload): Promise<void> {
    if (POS_API_BASE) {
      try {
        await fetch(`${POS_API_BASE}/api/kiosk/session-finish`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch (err) {
        console.warn('Failed to send session finish to POS:', err);
      }
    }
  },
};
