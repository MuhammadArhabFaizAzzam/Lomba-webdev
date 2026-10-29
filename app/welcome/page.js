'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Check,
  CheckCircle2,
  ChefHat,
  ChevronDown,
  Clock3,
  Coffee,
  Croissant,
  CupSoda,
  Flame,
  Layers,
  PackageCheck,
  Plus,
  QrCode,
  ReceiptText,
  ShieldCheck,
  ShoppingCart,
  Utensils,
} from 'lucide-react';

const features = [
  {
    icon: ShoppingCart,
    index: '01',
    title: 'Eksekusi Kasir Tanpa Hambatan',
    description: 'Pencarian katalog instan, kalkulasi diskon member CRM otomatis, dan pencetakan struk thermal 58mm/80mm.',
    metric: '< 1.2 dtk / transaksi',
  },
  {
    icon: PackageCheck,
    index: '02',
    title: 'Sinkronisasi Stok & HPP Presisi',
    description: 'Pemotongan inventaris otomatis saat transaksi lunas, lengkap dengan peringatan batas stok rendah.',
    metric: 'Real-Time Ledger',
  },
  {
    icon: BarChart3,
    index: '03',
    title: 'Analitik Laba Kotor Aktual',
    description: 'Bukan sekadar omzet kotor. Pantau selisih harga jual terhadap HPP dan rekonsiliasi kas per shift.',
    metric: 'Audit-Ready CSV',
  },
  {
    icon: ShieldCheck,
    index: '04',
    title: 'Otorisasi Multi-Peran (RBAC)',
    description: 'Pemisahan ruang kerja yang ketat antara operasional staf kasir dan kendali penuh manajemen toko.',
    metric: 'Role Guarded',
  },
];

const faqs = [
  [
    'Apakah Zenith POS bisa langsung diuji tanpa input data manual?',
    'Ya. Tersedia fitur Preset Data Retail Instan dan Data Simulasi 7 Hari yang langsung mengisi katalog produk, HPP, serta riwayat grafik transaksi.',
  ],
  [
    'Bagaimana cara kerja QRIS Dinamis dan Layar Dapur (KDS)?',
    'Setiap checkout QRIS menghasilkan sesi pembayaran dengan nominal terkunci dan hitung mundur. Begitu terverifikasi, pesanan otomatis tampil di Layar Dapur (KDS) dan memotong stok gudang.',
  ],
  [
    'Apakah laporan keuangan mendukung perhitungan HPP dan Retur?',
    'Seluruh transaksi mencatat harga jual sekaligus harga modal (HPP) per item. Jika terjadi retur barang, stok dikembalikan ke gudang dan nilai transaksi otomatis dikeluarkan dari omzet bersih.',
  ],
];

const STUDIO_ITEMS = [
  { id: 'SKU-101', name: 'Espresso Double Shot', price: 22000, cost: 9500, tag: 'Signature', icon: Coffee },
  { id: 'SKU-102', name: 'Artisan Butter Croissant', price: 26000, cost: 12000, tag: 'Pastry', icon: Croissant },
  { id: 'SKU-103', name: 'Uji Matcha Cold Whisk', price: 28000, cost: 13000, tag: 'Beverage', icon: CupSoda },
  { id: 'SKU-104', name: 'Truffle Egg Brioche', price: 34000, cost: 16500, tag: 'Kitchen', icon: Utensils },
];

const TICKER_EVENTS = [
  { code: 'TRX-9041', label: 'Espresso Double Shot ×2', meta: 'QRIS Terverifikasi · Rp 44.000', dot: 'emerald' },
  { code: 'KDS-LIVE', label: 'Order #9041 masuk antrean dapur', meta: 'Status: Sedang Dimasak', dot: 'amber' },
  { code: 'INV-SYNC', label: 'Stok Artisan Croissant diperbarui', meta: 'Tersisa 24 unit · Aman', dot: 'emerald' },
  { code: 'CRM-GOLD', label: 'Member Budi Santoso (+4 Poin)', meta: 'Diskon Tier 5% Diterapkan', dot: 'sky' },
  { code: 'SHIFT-01', label: 'Rekonsiliasi Kasir Pagi', meta: 'Selisih Kas: Rp 0 (Akurat)', dot: 'emerald' },
];

function InteractiveStudioMockup() {
  const [activeTab, setActiveTab] = useState('pos'); // 'pos' | 'qris' | 'kds'
  const [counts, setCounts] = useState({
    'Espresso Double Shot': 2,
    'Artisan Butter Croissant': 1,
    'Uji Matcha Cold Whisk': 0,
    'Truffle Egg Brioche': 0,
  });
  const [qrisPaid, setQrisPaid] = useState(false);
  const [kdsStatus, setKdsStatus] = useState('COOKING'); // 'PENDING' | 'COOKING' | 'READY'

  const handleTapItem = (name) => {
    setQrisPaid(false);
    setCounts((prev) => ({
      ...prev,
      [name]: ((prev[name] || 0) + 1) % 5,
    }));
  };

  const activeItems = STUDIO_ITEMS.filter((item) => (counts[item.name] || 0) > 0);
  const totalAmount = activeItems.reduce((sum, item) => sum + item.price * (counts[item.name] || 0), 0);
  const totalCost = activeItems.reduce((sum, item) => sum + item.cost * (counts[item.name] || 0), 0);
  const estProfit = totalAmount - totalCost;

  return (
    <div className="relative mx-auto w-full max-w-[640px]">
      {/* Subtle Architectural Backlight */}
      <div className="pointer-events-none absolute -inset-4 rounded-[36px] bg-gradient-to-b from-emerald-500/[0.08] via-transparent to-transparent blur-2xl" />

      {/* Floating Telemetry Badge - Top Left */}
      <div className="animate-float-slow absolute -left-6 -top-5 z-20 hidden items-center gap-3 rounded-2xl border border-white/12 bg-[#11141B]/95 px-4 py-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:flex">
        <span className="flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
        <div>
          <p className="text-[10px] font-semibold tracking-wide text-white">Sinkronisasi Gudang &amp; KDS</p>
          <p className="font-mono text-[9px] text-slate-400">Estimasi Laba: +Rp {estProfit.toLocaleString('id-ID')}</p>
        </div>
      </div>

      {/* Main Studio Window */}
      <div className="spotlight-card relative rounded-[26px] border border-white/[0.11] bg-[#0D1016] p-3.5 shadow-[0_36px_90px_-20px_rgba(0,0,0,0.88),0_1px_0_0_rgba(255,255,255,0.12)_inset]">
        {/* Window Top Chrome & Mode Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.07] px-2.5 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5 mr-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            </div>
            <span className="font-mono text-[10px] font-medium text-slate-400">zenith://terminal-studio</span>
          </div>

          {/* Interactive 3-Stage Mode Switcher */}
          <div className="flex items-center gap-1 rounded-xl bg-[#08090C] p-1 border border-white/[0.07]">
            {[
              { id: 'pos', label: '01 · Kasir' },
              { id: 'qris', label: '02 · QRIS' },
              { id: 'kds', label: '03 · Dapur' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-lg px-2.5 py-1 text-[10px] font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white/[0.1] text-white shadow-xs border border-white/10'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Studio Body */}
        {activeTab === 'pos' && (
          <div className="grid gap-3 pt-3 sm:grid-cols-[1.22fr_.78fr] animate-fadeIn">
            <div className="rounded-2xl bg-[#08090C] p-3.5 border border-white/[0.06]">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-slate-500">Katalog Interaktif</p>
                  <p className="text-xs font-bold text-white mt-0.5">Klik item untuk tambah ke nota</p>
                </div>
                <span className="rounded-md bg-white/[0.05] border border-white/[0.08] px-2 py-0.5 font-mono text-[9px] font-medium text-emerald-400">
                  LIVE DEMO
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {STUDIO_ITEMS.map((item) => {
                  const qty = counts[item.name] || 0;
                  const ItemIcon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleTapItem(item.name)}
                      className={`group text-left rounded-xl border p-3 transition-all duration-200 active:scale-[0.97] ${
                        qty > 0
                          ? 'border-emerald-500/40 bg-emerald-500/[0.06] shadow-[inset_0_1px_0_rgba(52,211,153,0.15)]'
                          : 'border-white/[0.07] bg-[#11141B] hover:border-white/20'
                      }`}
                    >
                      <div className="mb-2.5 flex items-center justify-between">
                        <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/[0.04] border border-white/[0.08] text-slate-300 transition-transform duration-200 group-hover:scale-105 group-hover:text-emerald-300">
                          <ItemIcon size={15} />
                        </span>
                        {qty > 0 ? (
                          <span className="rounded-md bg-emerald-500 px-1.5 py-0.5 font-mono text-[9px] font-bold text-slate-950">
                            {qty}×
                          </span>
                        ) : (
                          <span className="grid h-6 w-6 place-items-center rounded-md bg-white/[0.03] text-slate-500 group-hover:text-white">
                            <Plus size={11} />
                          </span>
                        )}
                      </div>
                      <p className="font-mono text-[8px] uppercase tracking-wider text-slate-500">{item.id}</p>
                      <p className="truncate text-[11px] font-semibold text-white mt-0.5">{item.name}</p>
                      <p className="mt-1 font-mono text-[10px] font-medium text-emerald-400">
                        Rp {item.price.toLocaleString('id-ID')}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl bg-[#08090C] border border-white/[0.06] p-3.5 text-white flex flex-col justify-between">
              <div>
                <div className="mb-3 flex items-center justify-between border-b border-white/[0.06] pb-2.5">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-slate-500">Ringkasan Nota</p>
                    <p className="font-mono text-[10px] font-semibold text-slate-300 mt-0.5">#INV-9042</p>
                  </div>
                  <ReceiptText size={14} className="text-slate-400" />
                </div>
                <div className="space-y-2 min-h-[96px]">
                  {activeItems.length === 0 ? (
                    <p className="text-[10px] text-slate-500 py-6 text-center">Pilih produk di sebelah kiri untuk melihat kalkulasi instan</p>
                  ) : (
                    activeItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-[10px] animate-fadeIn">
                        <span className="text-slate-300 truncate pr-2">
                          {item.name} <span className="font-mono text-slate-500">×{counts[item.name]}</span>
                        </span>
                        <span className="text-white font-mono font-medium shrink-0">
                          Rp {(item.price * counts[item.name]).toLocaleString('id-ID')}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="border-t border-white/[0.07] pt-3">
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span>Estimasi Laba HPP</span>
                  <span className="font-mono text-emerald-400">+Rp {estProfit.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-[10px] font-medium text-slate-400">Total Tagihan</span>
                  <strong className="text-base font-mono font-bold text-white">
                    Rp {totalAmount.toLocaleString('id-ID')}
                  </strong>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('qris')}
                  className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-3 py-2.5 text-[11px] font-bold text-slate-950 transition-all shadow-lg shadow-emerald-500/15"
                >
                  <QrCode size={13} />
                  <span>Generate QRIS</span>
                  <ArrowRight size={12} className="ml-auto" />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'qris' && (
          <div className="pt-3 animate-fadeIn">
            <div className="rounded-2xl bg-[#08090C] border border-white/[0.06] p-5 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2.5 flex-1">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 font-mono text-[9px] font-semibold text-emerald-300">
                  DYNAMIC QRIS · NMID-ID102499
                </span>
                <h4 className="text-base font-bold text-white">
                  {qrisPaid ? 'Pembayaran Terverifikasi Lunas' : 'Menunggu Pemindaian Pelanggan'}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Nominal sebesar <strong className="font-mono text-white">Rp {totalAmount.toLocaleString('id-ID')}</strong> dikunci otomatis pada kode QRIS.
                </p>
                <div className="pt-2 flex flex-wrap gap-2">
                  {!qrisPaid ? (
                    <button
                      type="button"
                      onClick={() => setQrisPaid(true)}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition shadow-md"
                    >
                      Simulasikan Webhook Lunas
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActiveTab('kds')}
                      className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/15 text-xs font-semibold transition inline-flex items-center gap-1.5"
                    >
                      <span>Lihat Tiket di Layar Dapur (KDS)</span>
                      <ArrowRight size={13} />
                    </button>
                  )}
                </div>
              </div>

              <div className="relative w-40 h-40 rounded-2xl bg-white p-3.5 flex items-center justify-center shadow-2xl shrink-0 overflow-hidden">
                {!qrisPaid && <div className="qris-laser-line" />}
                {qrisPaid ? (
                  <div className="text-center animate-fadeIn">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                      <CheckCircle2 size={28} />
                    </div>
                    <span className="font-mono text-[10px] font-bold text-slate-900 block">LUNAS</span>
                    <span className="font-mono text-[9px] text-slate-500">Stok Dipotong</span>
                  </div>
                ) : (
                  <QrCode size={112} className="text-slate-900" />
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'kds' && (
          <div className="pt-3 animate-fadeIn">
            <div className="rounded-2xl bg-[#08090C] border border-white/[0.06] p-5">
              <div className="flex items-center justify-between border-b border-white/[0.07] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <ChefHat size={16} className="text-emerald-400" />
                  <span className="text-xs font-bold text-white">Kitchen Display System · Tiket #INV-9042</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-semibold border ${
                  kdsStatus === 'READY'
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                }`}>
                  {kdsStatus === 'READY' ? 'SIAP SAJI' : 'SEDANG DIMASAK'}
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-2.5 mb-4">
                {activeItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-xl bg-[#11141B] border border-white/[0.06] px-3 py-2 text-xs">
                    <span className="text-slate-200 font-medium">{item.name}</span>
                    <span className="font-mono font-bold text-emerald-400">{counts[item.name]}×</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                <span className="text-[11px] text-slate-400">Klik tombol untuk ubah status dapur:</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setKdsStatus('COOKING')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                      kdsStatus === 'COOKING' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-white/[0.05] text-slate-300'
                    }`}
                  >
                    <Flame size={12} /> Dimasak
                  </button>
                  <button
                    type="button"
                    onClick={() => setKdsStatus('READY')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                      kdsStatus === 'READY' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-white/[0.05] text-slate-300'
                    }`}
                  >
                    <CheckCircle2 size={12} /> Siap Saji
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Bottom Status Card */}
      <div className="animate-float-delayed absolute -bottom-6 right-5 z-20 hidden items-center gap-3 rounded-2xl border border-white/12 bg-[#11141B]/95 px-4 py-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-xl sm:flex">
        <div className="grid h-7 w-7 place-items-center rounded-lg bg-white/[0.06] text-emerald-400">
          <Clock3 size={14} />
        </div>
        <div>
          <p className="text-[10px] font-semibold text-white">Mode Interaktif Aktif</p>
          <p className="font-mono text-[9px] text-slate-400">Klik produk atau tab di atas</p>
        </div>
      </div>
    </div>
  );
}

const WEEKLY_DATA = [
  { day: 'Sen', rev: 'Rp 1,45 jt', profit: 'Rp 540 rb', trx: 32, height: 48 },
  { day: 'Sel', rev: 'Rp 1,82 jt', profit: 'Rp 690 rb', trx: 41, height: 62 },
  { day: 'Rab', rev: 'Rp 1,64 jt', profit: 'Rp 610 rb', trx: 37, height: 55 },
  { day: 'Kam', rev: 'Rp 2,15 jt', profit: 'Rp 820 rb', trx: 49, height: 74 },
  { day: 'Jum', rev: 'Rp 2,48 jt', profit: 'Rp 960 rb', trx: 58, height: 86 },
  { day: 'Sab', rev: 'Rp 2,95 jt', profit: 'Rp 1,18 jt', trx: 68, height: 100 },
  { day: 'Min', rev: 'Rp 2,72 jt', profit: 'Rp 1,05 jt', trx: 63, height: 92 },
];

function DashboardMockup() {
  const [selectedIdx, setSelectedIdx] = useState(5);
  const activeDay = WEEKLY_DATA[selectedIdx] || WEEKLY_DATA[5];

  return (
    <div className="spotlight-card rounded-[26px] border border-white/[0.1] bg-[#0D1016] p-5 shadow-[0_32px_80px_-25px_rgba(0,0,0,0.85),0_1px_0_0_rgba(255,255,255,0.1)_inset]">
      <div className="flex items-center justify-between border-b border-white/[0.07] pb-3.5">
        <div className="flex items-center gap-2.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="text-xs font-semibold text-white">Executive Telemetry</span>
          <span className="font-mono text-[10px] text-slate-500">· Klik grafik batang</span>
        </div>
        <span className="rounded-md border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 font-mono text-[9px] font-medium text-slate-300">
           HARI: {activeDay.day.toUpperCase()}
        </span>
      </div>

      <div className="grid gap-3 py-4 sm:grid-cols-3">
        {[
          ['Omzet Terpilih', activeDay.rev, `${activeDay.trx} Transaksi Lunas`],
          ['Laba Kotor (HPP)', activeDay.profit, 'Margin Bersih +39%'],
          ['Akurasi Kas Shift', '100%', 'Tanpa Selisih Laci'],
        ].map(([label, value, meta]) => (
          <div
            key={label}
            className="rounded-xl border border-white/[0.07] bg-[#11141B] p-3.5 transition hover:border-white/15"
          >
            <p className="font-mono text-[9px] uppercase tracking-wider text-slate-400">{label}</p>
            <p className="mt-1.5 text-base font-bold text-white font-mono">{value}</p>
            <p className="mt-1 text-[10px] font-medium text-emerald-400">{meta}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-white/[0.07] bg-[#08090C] p-4">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300">Distribusi Pendapatan 7 Hari</span>
          <span className="font-mono text-[10px] text-emerald-400">Total: Rp 15,21 jt</span>
        </div>
        <div className="flex h-32 items-end gap-3 pt-2">
          {WEEKLY_DATA.map((item, index) => {
            const isSelected = index === selectedIdx;
            return (
              <button
                key={item.day}
                type="button"
                onMouseEnter={() => setSelectedIdx(index)}
                onClick={() => setSelectedIdx(index)}
                className="group relative flex-1 flex flex-col items-center h-full justify-end focus:outline-none"
              >
                <div
                  className={`w-full rounded-t-lg transition-all duration-300 ${
                    isSelected
                      ? 'bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.35)]'
                      : 'bg-white/[0.12] hover:bg-white/[0.22]'
                  }`}
                  style={{ height: `${item.height}%` }}
                />
                <span className={`mt-2 font-mono text-[9px] ${isSelected ? 'text-white font-bold' : 'text-slate-500'}`}>
                  {item.day}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function WelcomePage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#08090C] text-[#F8FAFC] relative selection:bg-emerald-500/30 selection:text-white">
      {/* Subtle Architectural Dot Matrix */}
      <div className="zenith-bg-grid pointer-events-none absolute inset-0 opacity-65" />
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[380px] bg-emerald-500/[0.05] blur-[130px] rounded-full" />

      {/* Top Navigation */}
      <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#08090C]/80 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/welcome" className="group flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#11141B] border border-white/15 text-sm font-extrabold text-emerald-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] transition-transform duration-300 group-hover:scale-105">
              Z
            </span>
            <span>
              <b className="block text-sm font-bold tracking-tight text-white">Zenith POS</b>
              <small className="block font-mono text-[9px] uppercase tracking-[0.18em] text-slate-400">
                Commerce Operating System
              </small>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-xs font-medium text-slate-400 md:flex">
            <a href="#fitur" className="transition hover:text-white">Arsitektur</a>
            <a href="#alur" className="transition hover:text-white">Alur Kerja</a>
            <a href="#faq" className="transition hover:text-white">Spesifikasi</a>
            <Link href="/guide" className="transition hover:text-white">Dokumentasi</Link>
          </nav>

          <div className="flex items-center gap-2.5">
            <Link
              href="/pos"
              className="hidden rounded-xl border border-white/[0.1] bg-white/[0.03] px-3.5 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/[0.07] hover:border-white/20 sm:inline-flex"
            >
              Buka Terminal
            </Link>
            <Link
              href="/login"
              className="btn-primary rounded-xl bg-emerald-500 hover:bg-emerald-400 px-4 py-2 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition"
            >
              Portal Akses
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-14 sm:px-8 lg:grid-cols-[.92fr_1.08fr] lg:pb-24 lg:pt-20">
          <div className="relative z-10 animate-fadeIn">
            <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/[0.1] bg-white/[0.03] px-3.5 py-1.5 text-[11px] font-medium text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Sistem Point of Sale &amp; Inventaris Terpadu</span>
            </div>

            <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.06] tracking-[-0.04em] text-white sm:text-6xl">
              Presisi operasional untuk bisnis yang{' '}
              <span className="font-editorial italic font-normal text-emerald-300 tracking-normal">
                tumbuh elegan.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-[17px]">
              Dirancang dengan arsitektur kelas finansial. Satukan terminal kasir, QRIS dinamis, layar dapur (KDS), akuntansi HPP, dan manajemen stok dalam satu antarmuka yang tenang dan responsif.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/pos"
                className="btn-primary inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-6 py-3.5 text-xs font-bold text-slate-950 shadow-xl shadow-emerald-500/20 transition hover:-translate-y-0.5"
              >
                <span>Eksplorasi Terminal POS</span>
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/guide"
                className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-[#11141B] px-6 py-3.5 text-xs font-semibold text-slate-200 transition hover:-translate-y-0.5 hover:border-white/20 hover:text-white"
              >
                <span>Panduan Evaluasi Sistem</span>
                <ArrowUpRight size={15} className="text-slate-400" />
              </Link>
            </div>

            <div className="mt-9 pt-6 border-t border-white/[0.07] grid grid-cols-3 gap-4 max-w-lg">
              <div>
                <p className="font-mono text-lg font-bold text-white">58/80mm</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Thermal Receipt</p>
              </div>
              <div>
                <p className="font-mono text-lg font-bold text-white">Auto-HPP</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Kalkulasi Laba Kotor</p>
              </div>
              <div>
                <p className="font-mono text-lg font-bold text-emerald-400">Real-Time</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Sinkronisasi KDS</p>
              </div>
            </div>
          </div>

          <div className="relative z-10">
            <InteractiveStudioMockup />
          </div>
        </section>

        {/* Continuous Smooth Live Activity Ticker */}
        <section className="border-y border-white/[0.07] bg-[#0B0D11]/90 py-3.5 overflow-hidden">
          <div className="animate-marquee flex items-center gap-6">
            {[...TICKER_EVENTS, ...TICKER_EVENTS].map((ev, idx) => (
              <div
                key={`${ev.code}-${idx}`}
                className="inline-flex items-center gap-3 rounded-full border border-white/[0.07] bg-[#11141B] px-4 py-1.5 text-xs"
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    ev.dot === 'amber' ? 'bg-amber-400' : ev.dot === 'sky' ? 'bg-sky-400' : 'bg-emerald-400'
                  }`}
                />
                <span className="font-mono text-[10px] font-semibold text-slate-400">{ev.code}</span>
                <span className="font-medium text-slate-200">{ev.label}</span>
                <span className="text-slate-600">·</span>
                <span className="font-mono text-[10px] text-emerald-400">{ev.meta}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Architectural Feature Grid */}
        <section id="fitur" className="scroll-reveal mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-400">
                01 / Arsitektur Sistem
              </span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Dirancang untuk kecepatan kasir dan{' '}
                <span className="font-editorial italic font-normal text-slate-300">ketenangan pemilik.</span>
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-slate-400">
              Setiap komponen bekerja sebagai satu kesatuan—mulai dari pemindaian barcode hingga laporan laba bersih.
            </p>
          </div>

          <div className="stagger-grid grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, index, title, description, metric }) => (
              <article
                key={title}
                className="welcome-card group rounded-2xl border border-white/[0.08] bg-[#11141B] p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-200 transition-colors duration-300 group-hover:border-emerald-500/40 group-hover:text-emerald-400">
                      <Icon size={18} />
                    </div>
                    <span className="font-mono text-[10px] font-medium text-slate-500">{index}</span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {title}
                  </h3>
                  <p className="mt-2.5 text-xs leading-relaxed text-slate-400">{description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="font-mono text-[10px] font-medium text-emerald-400">{metric}</span>
                  <ArrowUpRight size={13} className="text-slate-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Interactive Workflow & Telemetry Section */}
        <section id="alur" className="scroll-reveal border-t border-white/[0.07] bg-[#0B0D11] px-5 py-24 text-white sm:px-8">
          <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[.88fr_1.12fr]">
            <div>
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-400">
                02 / Alur Kerja Terintegrasi
              </span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Satu transaksi menggerakkan seluruh ekosistem.
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-400">
                Tidak ada lagi rekonsiliasi manual di akhir hari. Setiap pembayaran otomatis memperbarui stok gudang, antrean dapur, dan buku besar keuangan.
              </p>

              <div className="mt-8 space-y-3">
                {[
                  ['01', 'Input & Pindai Barcode', 'Kasir memilih produk atau member CRM dengan validasi stok real-time.'],
                  ['02', 'Otorisasi QRIS Dinamis', 'Nominal terkunci otomatis disertai pemicu antrean Kitchen Display System (KDS).'],
                  ['03', 'Audit Laba & Rekonsiliasi Shift', 'Manajemen memantau laba kotor (omzet dikurangi HPP) dan ekspor CSV.'],
                ].map(([number, title, description]) => (
                  <div
                    key={number}
                    className="group flex gap-4 rounded-2xl border border-white/[0.06] bg-[#11141B]/70 p-4 transition hover:border-white/15 hover:bg-[#11141B]"
                  >
                    <span className="font-mono text-xs font-bold text-emerald-400 pt-0.5">{number}</span>
                    <div>
                      <h3 className="text-sm font-bold text-white">{title}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-slate-400">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <DashboardMockup />
          </div>
        </section>

        {/* Call to Action & Specification FAQ */}
        <section className="scroll-reveal mx-auto grid max-w-7xl gap-8 px-5 py-24 sm:px-8 lg:grid-cols-2">
          <div className="spotlight-card relative overflow-hidden rounded-3xl border border-white/[0.1] bg-gradient-to-b from-[#141923] to-[#0D1016] p-8 text-white sm:p-10 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/25 px-3 py-1 font-mono text-[10px] font-semibold text-emerald-300">
                <Layers size={13} /> SIAPUJI · TANPA KONFIGURASI RUMIT
              </div>
              <h2 className="mt-6 text-3xl font-extrabold tracking-tight">
                Kendali penuh atas inventaris dan kas toko Anda.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400">
                Masuk menggunakan akun demo Kasir maupun Administrator untuk menguji langsung alur transaksi, cetak nota, hingga manajemen Purchase Order.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="btn-primary inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-5 py-3 text-xs font-bold text-slate-950 transition"
              >
                <span>Masuk Portal Demo</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/pos"
                className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/[0.04] hover:bg-white/[0.08] px-5 py-3 text-xs font-semibold text-white transition"
              >
                <span>Buka Kasir Langsung</span>
              </Link>
            </div>
          </div>

          <div id="faq" className="rounded-3xl border border-white/[0.08] bg-[#11141B] p-7 sm:p-10">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-400">
              03 / Spesifikasi &amp; FAQ
            </span>
            <h2 className="mt-2.5 text-2xl font-bold tracking-tight text-white">Informasi Teknis</h2>
            <div className="mt-6 divide-y divide-white/[0.07]">
              {faqs.map(([question, answer]) => (
                <details key={question} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-xs font-semibold text-slate-200 transition hover:text-white">
                    <span>{question}</span>
                    <ChevronDown
                      size={15}
                      className="shrink-0 text-slate-500 transition-transform duration-300 group-open:rotate-180 group-open:text-emerald-400"
                    />
                  </summary>
                  <p className="mt-3 pr-6 text-xs leading-relaxed text-slate-400 animate-fadeIn">{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/[0.07] bg-[#0B0D11] px-5 py-10 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#141820] border border-white/15 text-xs font-extrabold text-emerald-400">
              Z
            </span>
            <div>
              <b className="text-xs font-bold text-white block">Zenith POS</b>
              <span className="text-[11px] text-slate-500">Sistem Kasir, Inventaris &amp; Analitik Retail</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-slate-400">
            <Link href="/guide" className="transition hover:text-white">Panduan</Link>
            <Link href="/pos" className="transition hover:text-white">Terminal POS</Link>
            <Link href="/login" className="transition hover:text-white">Portal Login</Link>
            <span className="font-mono text-[11px] text-slate-500">v2.0 Architecture</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
