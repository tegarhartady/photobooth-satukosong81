# 📸 Panduan Pembuatan Frame Photobooth (Satu.Kosong8)

Dokumen ini merupakan panduan teknis dan desain untuk membuat serta menambahkan **Frame (Bingkai Cetak)** ke dalam sistem Kiosk Photobooth Satu.Kosong8, baik melalui **Admin Kiosk UI**, **Backend API POS**, maupun **Source Code**.

---

## 📑 Daftar Isi
1. [Standar Ukuran & Rasio Kanvas](#1-standar-ukuran--rasio-kanvas)
2. [Anatomi Tata Letak (Layout Anatomy)](#2-anatomi-tata-letak-layout-anatomy)
3. [Skema Data Frame (JSON Specification)](#3-skema-data-frame-json-specification)
4. [Tiga Cara Menambahkan Frame Baru](#4-tiga-cara-menambahkan-frame-baru)
   - [Metode A: Melalui Menu Kiosk UI](#metode-a-melalui-menu-kiosk-ui)
   - [Metode B: Melalui Backend API POS](#metode-b-melalui-backend-api-pos)
   - [Metode C: Melalui Source Code](#metode-c-melalui-source-code)
5. [Panduan Desain Grafis (Canva / Photoshop / Illustrator)](#5-panduan-desain-grafis-canva--photoshop--illustrator)
6. [Koleksi Template Warna Siap Pakai](#6-koleksi-template-warna-siap-pakai)

---

## 1. Standar Ukuran & Rasio Kanvas

Aplikasi ini menggunakan kanvas resolusi tinggi agar hasil cetak di printer thermal/sublimasi photobooth (seperti **DNP DS-RX1HS, Citizen CY-02, Hiti P525L, atau Epson L-Series**) tajam dan tidak pecah (300 DPI ready).

| Tipe Layout | Dimensi Kanvas (Px) | Ukuran Slot Foto (Px) | Keterangan Cetak |
| :--- | :--- | :--- | :--- |
| **Layout 4 Foto (Classic Strip)** | **`600 × 1885 px`** | `520 × 390 px` (Rasio 4:3) | Format klasik 1 kolom vertikal (2x6 inch strip) |
| **Layout 6 Foto (Twin Zigzag)** | **`860 × 1285 px`** | `390 × 292 px` (Rasio 4:3) | Format 2 kolom × 3 baris grid dinamis |
| **Layout 8 Foto (Deluxe Zigzag)** | **`860 × 1600 px`** | `390 × 292 px` (Rasio 4:3) | Format 2 kolom × 4 baris kolase |
| **Twin Sheet Print (Kertas 4R)** | **`1268 × 1933 px`** | Menggabungkan 2 Strip | Dicetak pada kertas 4x6 inch dengan garis potong gunting di tengah |

> 💡 **Ketentuan Safe Zone (Margin Aman):**
> Sisakan jarak minimal **16 - 24 px** dari tepi luar kanvas ke elemen penting (teks, logo) agar tidak terpotong oleh pisau pemotong (*cutter margin*) printer.

---

## 2. Anatomi Tata Letak (Layout Anatomy)

Setiap lembar strip foto memiliki 3 zona utama:

```
┌──────────────────────────────────────┐
│  [TOP HEADER] Tinggi: ~145 px        │  <- Logo "SATU.KOSONG8" & "THE PHOTOBOOTH"
├──────────────────────────────────────┤
│  ┌────────────────────────────────┐  │
│  │                                │  │  <- Slot Foto 1 (Border mount 4px)
│  │           FOTO POSE A          │  │     Badge pose bulat: [ A ]
│  │                                │  │
│  └────────────────────────────────┘  │
│               [GAP 20px]             │
│  ┌────────────────────────────────┐  │
│  │           FOTO POSE B          │  │
│  └────────────────────────────────┘  │
│               [GAP 20px]             │
│  ┌────────────────────────────────┐  │
│  │           FOTO POSE C          │  │
│  └────────────────────────────────┘  │
│               [GAP 20px]             │
│  ┌────────────────────────────────┐  │
│  │           FOTO POSE D          │  │
│  └────────────────────────────────┘  │
├──────────────────────────────────────┤
│  [BOTTOM FOOTER] Tinggi: ~120 px     │  <- Teks "SATU.KOSONG8 PHOTOBOOTH"
│  Tanggal Otomatis (Contoh: 19 Sept)  │     & Tanggal sesi cetak
└──────────────────────────────────────┘
```

---

## 3. Skema Data Frame (JSON Specification)

Setiap objek frame didefinisikan dengan atribut berikut:

```typescript
export interface PhotoFrameOption {
  id: string;              // ID unik (contoh: "frame-wedding-gold")
  name: string;            // Nama tema yang tampil di layar
  tagline: string;         // Deskripsi singkat tema (contoh: "Luxury & Elegant")
  bgColor: string;         // Warna latar belakang strip (Hex code)
  textColor: string;       // Warna teks utama & logo atas (Hex code)
  subTextColor: string;    // Warna sub-teks & tanggal (Hex code)
  borderColor: string;     // Warna garis tepi luar frame (Hex code)
  photoBorderColor: string;// Warna border/mount di sekeliling foto (Hex code)
  badgeBg: string;         // Warna latar badge pose [A, B, C]
  badgeTextColor: string;  // Warna huruf di dalam badge pose
  accentColor: string;     // Warna aksen tombol/highlight
  category?: string;       // Kategori (misal: "Event", "Minimalist", "Seasonal")
  frameImageUrl?: string;  // (Opsional) URL gambar overlay PNG transparan
  isCustom?: boolean;      // true jika ditambahkan lewat admin/API
  createdAt?: number;      // Timestamp pembuatan
}
```

---

## 4. Tiga Cara Menambahkan Frame Baru

### Metode A: Melalui Menu Kiosk UI (Paling Cepat)
1. Jalankan aplikasi kiosk dan klik tombol **Mulai**.
2. Pilih Paket & Layout hingga tiba di halaman **"Pilih Frame Foto"**.
3. Di sudut kanan atas terdapat tombol **`+ Tambah Frame POS`**.
4. Masukkan **Nama Frame** dan **Tagline**.
5. **Upload Gambar Frame:**
   - Klik kotak upload **"Upload Gambar Frame Kustom (.PNG Transparan)"** dan pilih file gambar desain PNG Anda (atau drag & drop). File otomatis dikonversi dan disimpan langsung di browser tanpa perlu hosting luar.
   - Atau Anda bisa memasukkan URL gambar jika di-host di CDN/server online.
6. Tentukan warna dasar background dan teks menggunakan color picker (atau pilih preset).
7. Periksa tampilan pada kotak **Live Preview Strip**.
8. Klik **"Simpan & Terapkan Frame"**. Frame baru langsung aktif di sesi foto dan siap dicetak!

---

### Metode B: Melalui Backend API POS (Otomatis dari Kasir/Admin)
Jika Anda menghubungkan backend POS (via `VITE_POS_API_URL`), backend Anda cukup menyediakan endpoint REST API berikut:

#### 1. Tambah Frame Baru:
- **Method:** `POST`
- **Endpoint:** `/api/frames`
- **Request Body (JSON):**
```json
{
  "name": "Sakura Bloom Edition",
  "tagline": "Spring Festival 2025",
  "bgColor": "#fff1f2",
  "textColor": "#9f1239",
  "subTextColor": "#e11d48",
  "borderColor": "#fda4af",
  "photoBorderColor": "#ffffff",
  "badgeBg": "#9f1239",
  "badgeTextColor": "#ffffff",
  "accentColor": "#f43f5e",
  "frameImageUrl": "https://domain-anda.com/assets/frames/sakura-bloom-600x1885.png",
  "category": "Seasonal Event"
}
```
- **Response Berhasil (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "frame-1726720000-emerald-matcha",
    "name": "Emerald Matcha",
    ...
  }
}
```

#### 2. Ambil Semua Frame Aktif:
- **Method:** `GET`
- **Endpoint:** `/api/frames`
- Kiosk akan otomatis melakukan sinkronisasi daftar frame saat aplikasi dibuka.

#### 3. Hapus Frame:
- **Method:** `DELETE`
- **Endpoint:** `/api/frames/:id`

---

### Metode C: Melalui Source Code (Permanen)
Buka file `src/types/photobooth.ts` dan tambahkan objek baru ke dalam array `PHOTO_FRAME_OPTIONS`:

```typescript
// src/types/photobooth.ts

export const PHOTO_FRAME_OPTIONS: PhotoFrameOption[] = [
  // ... frame yang sudah ada ...
  {
    id: 'korean-aesthetic',
    name: 'Korean Aesthetic',
    tagline: 'Soft Cream & Warm Tones',
    bgColor: '#fdfbf7',
    textColor: '#292524',
    subTextColor: '#78716c',
    borderColor: '#e7e5e4',
    photoBorderColor: '#ffffff',
    badgeBg: '#292524',
    badgeTextColor: '#fdfbf7',
    accentColor: '#d97706',
    category: 'Minimalist',
  },
];
```

---

## 5. Panduan Desain Grafis (Canva / Photoshop / Illustrator)

Jika Anda ingin membuat frame bergambar kustom (ilustrasi, maskot, event sponsor, logo pernikahan):

1. **Ukuran File Desain (Canvas Size):**
   - Buat kanvas baru berukuran **`600 px × 1885 px`** (untuk strip 4 foto) atau **`860 px × 1285 px`** (untuk strip 6 foto).
   - Color Mode: **RGB**, Resolusi: **300 DPI**.

2. **Area Lubang Foto (Transparan):**
   - Area di mana foto pelanggan akan muncul harus dibiarkan **bolong / transparan (Alpha Channel)**.
   - Simpan desain dalam format **`.PNG-24` Transparan**.

3. **Posisi Lubang Foto (Layout 4 Vertikal):**
   - Lebar Tiap Lubang Foto: `520 px`
   - Tinggi Tiap Lubang Foto: `390 px`
   - Posisi X: `40 px` (Tepat di tengah kanvas)
   - Posisi Y:
     - Foto 1: `Y = 145 px`
     - Foto 2: `Y = 555 px` (145 + 390 + 20)
     - Foto 3: `Y = 965 px` (555 + 390 + 20)
     - Foto 4: `Y = 1375 px` (965 + 390 + 20)
   - Area Footer (Bebas untuk hiasan/logo event): `Y = 1785 s/d 1885 px`.

---

## 6. Koleksi Template Warna Siap Pakai

Berikut formula kode hex warna yang sudah teruji estetis dan kontras untuk dicetak:

### 1. Wedding / Luxury Gold
- **Background (`bgColor`):** `#18181b` (Noir Black)
- **Teks (`textColor`):** `#fef08a` (Warm Champagne)
- **Border (`borderColor`):** `#ca8a04` (Metallic Gold)
- **Border Foto (`photoBorderColor`):** `#ffffff` (Pure White)

### 2. Y2K Cyber Neon
- **Background (`bgColor`):** `#09090b` (Deep Space)
- **Teks (`textColor`):** `#22d3ee` (Electric Cyan)
- **Border (`borderColor`):** `#ec4899` (Hot Pink)
- **Border Foto (`photoBorderColor`):** `#a855f7` (Neon Purple)

### 3. Sunset Terracotta
- **Background (`bgColor`):** `#7c2d12` (Earthy Rust)
- **Teks (`textColor`):** `#ffedd5` (Warm Cream)
- **Border (`borderColor`):** `#f97316` (Vivid Tangerine)
- **Border Foto (`photoBorderColor`):** `#ffffff`

### 4. Minimalist Korean Cream
- **Background (`bgColor`):** `#faf8f5` (Warm Ivory)
- **Teks (`textColor`):** `#1c1917` (Stone Black)
- **Border (`borderColor`):** `#e7e5e4` (Soft Gray)
- **Border Foto (`photoBorderColor`):** `#1c1917` (Bold Charcoal Rim)
