import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Plus,
  Palette,
  Sparkles,
  Code2,
  RefreshCw,
  Trash2,
  Check,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { PhotoFrameOption } from '../types/photobooth';
import { posApi } from '../services/posApi';
import { CreateFramePayload } from '../services/frameApi';

interface AddFrameModalProps {
  isOpen: boolean;
  onClose: () => void;
  frames: PhotoFrameOption[];
  onFrameAdded: (newFrame: PhotoFrameOption) => void;
  onFrameDeleted: (frameId: string) => void;
  onRefreshFromApi: () => Promise<void>;
}

export const AddFrameModal: React.FC<AddFrameModalProps> = ({
  isOpen,
  onClose,
  frames,
  onFrameAdded,
  onFrameDeleted,
  onRefreshFromApi,
}) => {
  const [activeTab, setActiveTab] = useState<'NEW_FRAME' | 'API_DOCS' | 'LIST'>('NEW_FRAME');

  // Form states for creating new frame
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [bgColor, setBgColor] = useState('#064e3b'); // default emerald
  const [textColor, setTextColor] = useState('#ffffff');
  const [borderColor, setBorderColor] = useState('#10b981');
  const [photoBorderColor, setPhotoBorderColor] = useState('#ffffff');
  const [accentColor, setAccentColor] = useState('#34d399');
  const [category, setCategory] = useState('Theme POS');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [copiedCurl, setCopiedCurl] = useState(false);

  if (!isOpen) return null;

  // Preset theme inspirations
  const PRESET_THEMES = [
    {
      name: 'Matcha Forest',
      tagline: 'Earthy & Calm Vibes',
      bgColor: '#143621',
      textColor: '#ecfdf5',
      borderColor: '#10b981',
      photoBorderColor: '#ffffff',
      accentColor: '#34d399',
    },
    {
      name: 'Electric Cyberpunk',
      tagline: 'Neon Glitch 2077',
      bgColor: '#09090b',
      textColor: '#22d3ee',
      borderColor: '#06b6d4',
      photoBorderColor: '#a855f7',
      accentColor: '#ec4899',
    },
    {
      name: 'Sunset Terracotta',
      tagline: 'Warm Tropical Horizon',
      bgColor: '#7c2d12',
      textColor: '#ffedd5',
      borderColor: '#f97316',
      photoBorderColor: '#ffffff',
      accentColor: '#fbbf24',
    },
    {
      name: 'Barbie Flamingo',
      tagline: 'Y2K Pretty in Pink',
      bgColor: '#f43f5e',
      textColor: '#ffffff',
      borderColor: '#fb7185',
      photoBorderColor: '#ffffff',
      accentColor: '#ffe4e6',
    },
    {
      name: 'Midnight Navy',
      tagline: 'Deep Ocean Elegance',
      bgColor: '#0f172a',
      textColor: '#e2e8f0',
      borderColor: '#38bdf8',
      photoBorderColor: '#ffffff',
      accentColor: '#60a5fa',
    },
  ];

  const handleApplyPreset = (preset: typeof PRESET_THEMES[0]) => {
    setName(preset.name);
    setTagline(preset.tagline);
    setBgColor(preset.bgColor);
    setTextColor(preset.textColor);
    setBorderColor(preset.borderColor);
    setPhotoBorderColor(preset.photoBorderColor);
    setAccentColor(preset.accentColor);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      const payload: CreateFramePayload = {
        name,
        tagline: tagline || 'Special Edition',
        bgColor,
        textColor,
        subTextColor: textColor,
        borderColor,
        photoBorderColor,
        badgeBg: textColor,
        badgeTextColor: bgColor,
        accentColor,
        category,
      };

      const newFrame = await posApi.createFrame(payload);
      onFrameAdded(newFrame);
      setSuccessMessage(`Frame "${newFrame.name}" berhasil ditambahkan ke Photobooth!`);

      // Reset form
      setName('');
      setTagline('');

      setTimeout(() => {
        setSuccessMessage(null);
      }, 4000);
    } catch (err) {
      console.error('Gagal menambahkan frame:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefreshFromApi();
    setIsRefreshing(false);
    setSuccessMessage('Daftar frame berhasil disinkronkan dari server POS!');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const sampleCurl = `curl -X POST "https://pos-api.yourdomain.com/api/frames" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Matcha Forest",
    "tagline": "Earthy & Calm Vibes",
    "bgColor": "#143621",
    "textColor": "#ecfdf5",
    "subTextColor": "#a7f3d0",
    "borderColor": "#10b981",
    "photoBorderColor": "#ffffff",
    "badgeBg": "#ecfdf5",
    "badgeTextColor": "#143621",
    "accentColor": "#34d399",
    "category": "Event Series"
  }'`;

  const copyCurlToClipboard = () => {
    navigator.clipboard.writeText(sampleCurl);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const customFrames = frames.filter((f) => f.isCustom);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-4 backdrop-blur-xl"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -15 }}
          className="relative w-full max-w-2xl max-h-[92vh] overflow-hidden rounded-[28px] border border-white/20 bg-zinc-950 p-5 sm:p-6 shadow-2xl text-left flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
                <Palette className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-urban text-lg sm:text-xl text-white font-black tracking-wide flex items-center gap-2">
                  KELOLA & TAMBAH FRAME POS
                  <span className="text-[10px] font-mono font-bold text-red-400 bg-red-500/15 border border-red-500/25 px-2 py-0.5 rounded-full">
                    API READY
                  </span>
                </h2>
                <p className="text-xs text-zinc-400">
                  Frame photobooth bersifat dinamis dan dapat ditambah langsung dari backend POS.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 pt-3 pb-3 border-b border-white/10 shrink-0 overflow-x-auto text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('NEW_FRAME')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'NEW_FRAME'
                  ? 'bg-white text-zinc-950 shadow'
                  : 'bg-white/5 text-zinc-400 hover:text-white'
              }`}
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Input Frame Baru</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('LIST')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'LIST'
                  ? 'bg-white text-zinc-950 shadow'
                  : 'bg-white/5 text-zinc-400 hover:text-white'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Daftar Frame ({frames.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('API_DOCS')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'API_DOCS'
                  ? 'bg-white text-zinc-950 shadow'
                  : 'bg-white/5 text-zinc-400 hover:text-white'
              }`}
            >
              <Code2 className="h-3.5 w-3.5" />
              <span>Dokumentasi API POS</span>
            </button>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Tarik frame terbaru dari POS"
              className="ml-auto px-3 py-1.5 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30 font-bold transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Sync API</span>
            </button>
          </div>

          {/* Alert Message */}
          {successMessage && (
            <div className="mt-3 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
              <Check className="h-4 w-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Tab 1: Input Frame Baru */}
          <div className="overflow-y-auto py-3 flex-1 pr-1">
            {activeTab === 'NEW_FRAME' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Presets Quick Picker */}
                <div>
                  <label className="text-xs text-zinc-400 font-bold uppercase tracking-wider block mb-1.5">
                    ⚡ Preset Inspirasi Cepat:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_THEMES.map((theme) => (
                      <button
                        key={theme.name}
                        type="button"
                        onClick={() => handleApplyPreset(theme)}
                        className="px-2.5 py-1 rounded-lg border border-white/15 bg-zinc-900 hover:border-white/30 text-xs text-zinc-300 flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: theme.bgColor }}
                        />
                        <span>{theme.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Name */}
                  <div>
                    <label className="text-xs text-zinc-300 font-semibold block mb-1">
                      Nama Frame <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Sakura Spring Blossom"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-white/20 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  {/* Tagline */}
                  <div>
                    <label className="text-xs text-zinc-300 font-semibold block mb-1">
                      Tagline / Mood
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Floral & Warm Aesthetic"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      className="w-full rounded-xl border border-white/20 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Color Pickers */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-zinc-900/60 p-3.5 rounded-2xl border border-white/10">
                  {/* Background Color */}
                  <div>
                    <label className="text-[11px] text-zinc-400 font-semibold block mb-1 truncate">
                      Warna Background
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="h-8 w-8 rounded-lg cursor-pointer border-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-full font-mono text-xs rounded bg-black/60 px-1.5 py-1 text-white border border-white/15"
                      />
                    </div>
                  </div>

                  {/* Text Color */}
                  <div>
                    <label className="text-[11px] text-zinc-400 font-semibold block mb-1 truncate">
                      Warna Tulisan
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="h-8 w-8 rounded-lg cursor-pointer border-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-full font-mono text-xs rounded bg-black/60 px-1.5 py-1 text-white border border-white/15"
                      />
                    </div>
                  </div>

                  {/* Border Color */}
                  <div>
                    <label className="text-[11px] text-zinc-400 font-semibold block mb-1 truncate">
                      Garis Strip
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={borderColor}
                        onChange={(e) => setBorderColor(e.target.value)}
                        className="h-8 w-8 rounded-lg cursor-pointer border-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={borderColor}
                        onChange={(e) => setBorderColor(e.target.value)}
                        className="w-full font-mono text-xs rounded bg-black/60 px-1.5 py-1 text-white border border-white/15"
                      />
                    </div>
                  </div>

                  {/* Accent Color */}
                  <div>
                    <label className="text-[11px] text-zinc-400 font-semibold block mb-1 truncate">
                      Warna Aksen
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        className="h-8 w-8 rounded-lg cursor-pointer border-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        className="w-full font-mono text-xs rounded bg-black/60 px-1.5 py-1 text-white border border-white/15"
                      />
                    </div>
                  </div>
                </div>

                {/* Live Preview Mini Strip */}
                <div className="bg-black/50 p-3.5 rounded-2xl border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white mb-0.5">Live Preview Strip</div>
                    <div className="text-[11px] text-zinc-400">
                      Tampilan strip foto dengan kombinasi warna di atas
                    </div>
                  </div>

                  <div
                    className="h-24 w-12 rounded-lg border flex flex-col justify-between p-1 shadow-lg text-center"
                    style={{
                      backgroundColor: bgColor,
                      borderColor: borderColor,
                      color: textColor,
                    }}
                  >
                    <div className="text-[6px] font-black leading-none">SATU.K08</div>
                    <div className="space-y-0.5">
                      <div
                        className="h-3 w-full rounded-sm"
                        style={{ backgroundColor: photoBorderColor }}
                      />
                      <div
                        className="h-3 w-full rounded-sm"
                        style={{ backgroundColor: photoBorderColor }}
                      />
                    </div>
                    <div
                      className="text-[4px] font-bold"
                      style={{ color: accentColor }}
                    >
                      PHOTOBOOTH
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || !name.trim()}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-4 py-3 text-sm font-bold text-white shadow-lg hover:brightness-110 disabled:opacity-50 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{isSubmitting ? 'Menyimpan...' : 'Simpan & Tambahkan Frame ke Photobox'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* Tab 2: Daftar Frame Aktif */}
            {activeTab === 'LIST' && (
              <div className="space-y-2.5">
                <div className="text-xs text-zinc-400 mb-2 flex items-center justify-between">
                  <span>Total {frames.length} frame aktif di sistem</span>
                  <span>{customFrames.length} frame kustom dari API</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {frames.map((frame) => (
                    <div
                      key={frame.id}
                      className="rounded-xl border border-white/10 bg-zinc-900/80 p-3 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="h-9 w-9 rounded-xl border flex items-center justify-center shadow"
                          style={{
                            backgroundColor: frame.bgColor,
                            borderColor: frame.borderColor,
                            color: frame.textColor,
                          }}
                        >
                          <span className="text-[10px] font-black">108</span>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span>{frame.name}</span>
                            {frame.isCustom && (
                              <span className="text-[9px] bg-red-500/20 border border-red-500/30 text-red-400 px-1.5 py-0.2 rounded">
                                DARI POS
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-zinc-400">{frame.tagline}</div>
                        </div>
                      </div>

                      {frame.isCustom && (
                        <button
                          type="button"
                          onClick={() => onFrameDeleted(frame.id)}
                          title="Hapus frame kustom ini"
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Dokumentasi API POS */}
            {activeTab === 'API_DOCS' && (
              <div className="space-y-3.5 text-xs">
                <div className="rounded-xl bg-zinc-900 p-3.5 border border-white/10">
                  <div className="font-bold text-white text-sm mb-1 flex items-center justify-between">
                    <span>Format REST API untuk POS / Dashboard Anda</span>
                    <button
                      type="button"
                      onClick={copyCurlToClipboard}
                      className="flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300 font-mono cursor-pointer"
                    >
                      {copiedCurl ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedCurl ? 'Tersalin!' : 'Salin cURL'}</span>
                    </button>
                  </div>
                  <p className="text-zinc-400 text-[11px] leading-relaxed mb-3">
                    Dashboard POS Anda cukup memanggil endpoint <code className="text-red-400 font-mono">POST /api/frames</code> untuk menambah frame baru, atau Photobox akan memanggil <code className="text-red-400 font-mono">GET /api/frames</code> secara periodik.
                  </p>

                  <div className="rounded-lg bg-black/80 p-2.5 font-mono text-[11px] text-zinc-300 overflow-x-auto border border-white/5">
                    <pre>{sampleCurl}</pre>
                  </div>
                </div>

                <div className="rounded-xl bg-zinc-900/60 p-3 border border-white/10 space-y-2">
                  <div className="font-bold text-white text-xs">Konfigurasi Environment Kiosk:</div>
                  <div className="font-mono text-[11px] text-emerald-400 bg-black/60 p-2 rounded border border-white/10">
                    VITE_POS_API_URL=https://api-pos.satukosong8.com
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    Jika variabel ini diisi, photobox akan otomatis sync frame, cek voucher kasir, dan lapor pemotongan kertas ke URL backend POS Anda.
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
