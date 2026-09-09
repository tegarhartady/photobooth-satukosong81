import { VoucherCode } from '../types/photobooth';

const STORAGE_KEY = 'satukosong8_vouchers_v1';

// Daftar kode bawaan sistem SATU.KOSONG8
export const DEFAULT_VOUCHERS: VoucherCode[] = [
  {
    code: '108101',
    label: 'Paket Hemat',
    packageName: 'Paket Hemat (1 Frame)',
    framesCount: 1,
    sessionsCount: 1,
    sheetsCount: 2,
    priceFormatted: 'Rp 25.000',
    isUsed: false,
  },
  {
    code: '108102',
    label: 'Paket Hemat',
    packageName: 'Paket Hemat (1 Frame)',
    framesCount: 1,
    sessionsCount: 1,
    sheetsCount: 2,
    priceFormatted: 'Rp 25.000',
    isUsed: false,
  },
  {
    code: '108108',
    label: 'Paket Combo',
    packageName: 'Paket Combo (2 Frame Berbeda)',
    framesCount: 2,
    sessionsCount: 2,
    sheetsCount: 4,
    priceFormatted: 'Rp 35.000',
    isUsed: false,
  },
  {
    code: '108202',
    label: 'Paket Combo',
    packageName: 'Paket Combo (2 Frame Berbeda)',
    framesCount: 2,
    sessionsCount: 2,
    sheetsCount: 4,
    priceFormatted: 'Rp 35.000',
    isUsed: false,
  },
  {
    code: '999999',
    label: 'Paket Combo (Expired)',
    packageName: 'Paket Combo (2 Frame)',
    framesCount: 2,
    sessionsCount: 2,
    sheetsCount: 4,
    priceFormatted: 'Rp 35.000',
    isUsed: true,
    usedAt: 1788950000000,
    usedAtFormatted: '09 Sep 2026, 10:15 WIB',
  },
];

/**
 * Mengambil daftar kode voucher dari localStorage (atau inisialisasi awal)
 */
export function getAllVouchers(): VoucherCode[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_VOUCHERS));
      return [...DEFAULT_VOUCHERS];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (e) {
    console.warn('Gagal membaca voucher dari localStorage:', e);
  }
  return [...DEFAULT_VOUCHERS];
}

/**
 * Menyimpan daftar kode voucher ke localStorage
 */
export function saveAllVouchers(vouchers: VoucherCode[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vouchers));
  } catch (e) {
    console.warn('Gagal menyimpan voucher ke localStorage:', e);
  }
}

export interface VerificationResult {
  success: boolean;
  voucher?: VoucherCode;
  errorType?: 'INVALID_FORMAT' | 'NOT_FOUND' | 'EXPIRED';
  message: string;
}

/**
 * Memverifikasi dan me-redeem kode struk / voucher:
 * - Jika kode sudah pernah digunakan (isUsed === true), tolak dengan status EXPIRED!
 * - Jika kode valid & belum digunakan, tandai sebagai isUsed = true, catat waktu usedAt, simpan!
 */
export function verifyAndRedeemVoucher(code: string): VerificationResult {
  const cleanCode = code.trim();
  if (cleanCode.length !== 6 || !/^\d{6}$/.test(cleanCode)) {
    return {
      success: false,
      errorType: 'INVALID_FORMAT',
      message: 'Kode harus terdiri dari 6 angka digit lengkap.',
    };
  }

  const vouchers = getAllVouchers();
  let existingIndex = vouchers.findIndex((v) => v.code === cleanCode);

  // Jika kode belum ada di list bawaan, daftarkan secara dinamis (kode struk baru)
  if (existingIndex === -1) {
    // Tentukan jumlah frame berdasarkan digit (misal: jika berakhiran ganjil -> 1 frame, genap -> 2 frame)
    const lastDigit = parseInt(cleanCode.slice(-1), 10);
    const framesCount: 1 | 2 = lastDigit % 2 === 1 ? 1 : 2;
    const isHemat = framesCount === 1;

    const newVoucher: VoucherCode = {
      code: cleanCode,
      label: isHemat ? 'Paket Hemat' : 'Paket Combo',
      packageName: isHemat
        ? 'Paket Hemat (1 Frame)'
        : 'Paket Combo (2 Frame Berbeda)',
      framesCount,
      sessionsCount: framesCount,
      sheetsCount: isHemat ? 2 : 4,
      priceFormatted: isHemat ? 'Rp 25.000' : 'Rp 35.000',
      isUsed: false,
    };
    vouchers.push(newVoucher);
    existingIndex = vouchers.length - 1;
  }

  const voucher = vouchers[existingIndex];

  // Cek apakah sudah pernah digunakan
  if (voucher.isUsed) {
    const timeUsed = voucher.usedAtFormatted || 'sesi sebelumnya';
    return {
      success: false,
      errorType: 'EXPIRED',
      voucher,
      message: `Kode ${voucher.code} SUDAH DIGUNAKAN (Expired) pada ${timeUsed} dan tidak dapat digunakan kembali!`,
    };
  }

  // Tandai sebagai SUDAH DIGUNAKAN (Expired untuk penggunaan selanjutnya)
  const now = Date.now();
  const timeFormatted = new Date().toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }) + ' WIB';

  voucher.isUsed = true;
  voucher.usedAt = now;
  voucher.usedAtFormatted = timeFormatted;

  vouchers[existingIndex] = voucher;
  saveAllVouchers(vouchers);

  return {
    success: true,
    voucher,
    message: `Kode valid! ${voucher.packageName} berhasil diaktifkan.`,
  };
}

/**
 * Reset voucher demo ke kondisi awal (berguna untuk pengujian ulang)
 */
export function resetDemoVouchers(): VoucherCode[] {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_VOUCHERS));
  } catch (e) {
    console.warn(e);
  }
  return [...DEFAULT_VOUCHERS];
}
