'use client';

import Link from 'next/link';
import { ArrowRight, BarChart3, Package, ShoppingCart, Sparkles } from 'lucide-react';

const destinations = [
  {
    href: '/',
    label: 'Dashboard Bisnis',
    description: 'Pantau pendapatan, transaksi, dan kesehatan stok dari satu ruang kendali.',
    icon: BarChart3,
    accent: 'violet',
    action: 'Masuk Dashboard',
  },
  {
    href: '/pos',
    label: 'Kasir (POS)',
    description: 'Layani transaksi dengan katalog cepat, keranjang ringkas, dan checkout yang jelas.',
    icon: ShoppingCart,
    accent: 'teal',
    action: 'Buka Kasir POS',
  },
  {
    href: '/inventory',
    label: 'Manajemen Stok',
    description: 'Kelola produk, harga, dan ketersediaan barang dengan kontrol yang sederhana.',
    icon: Package,
    accent: 'blue',
    action: 'Kelola Stok',
  },
];

export default function WelcomePage() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4 py-8 animate-fadeIn">
      {/* Top Tag / Pill */}
      <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wider mb-6 border border-slate-200 shadow-2xs">
        <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
        <span>Zenith POS Enterprise Suite v2.0</span>
      </div>

      {/* Main Heading */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl leading-tight">
        Sistem Operasional Retail & <span className="text-indigo-600">Kasir Profesional</span>
      </h1>

      <p className="mt-5 text-base md:text-lg text-slate-600 max-w-2xl font-normal leading-relaxed">
        Platform manajemen kasir (POS) dan kontrol inventaris gudang secara real-time. Dirancang dengan standar industri untuk efisiensi bisnis Anda.
      </p>

      {/* Feature Highlight Pills */}
      <div className="mt-8 flex flex-wrap justify-center gap-3 max-w-2xl text-xs font-semibold text-slate-600">
        <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-2xs">⚡ Transaksi Cepat & Akurat</span>
        <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-2xs">📦 Kontrol Stok Otomatis</span>
        <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-2xs">📊 Laporan Keuangan Real-time</span>
      </div>

      {/* Login CTA Button */}
      <div className="mt-10">
        <Link
          href="/login"
          className="inline-flex items-center space-x-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-indigo-600/30 transition"
        >
          <span>Login Sistem</span>
          <span>&rarr;</span>
        </Link>
      </div>

      {/* Feature Cards Grid */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full text-left">
        <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4 font-bold">
            ⚡
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">POS Kasir Cepat</h3>
          <p className="text-slate-500 text-xs font-normal leading-relaxed">
            Kasir digital interaktif untuk melayani transaksi pembeli dengan kalkulasi kembalian otomatis.
          </p>
        </div>

        <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4 font-bold">
            📦
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">Manajemen Stok</h3>
          <p className="text-slate-500 text-xs font-normal leading-relaxed">
            Kelola data produk, atur harga, dan pantau ketersediaan barang dengan preset retail instan.
          </p>
        </div>

        <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition">
          <div className="w-10 h-10 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center mb-4 font-bold">
            📊
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">Riwayat & Ekspor</h3>
          <p className="text-slate-500 text-xs font-normal leading-relaxed">
            Pantau laporan transaksi harian dan ekspor data dengan mudah ke format CSV.
          </p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-16 pt-6 border-t border-slate-200 text-slate-400 text-xs flex flex-col sm:flex-row justify-center items-center gap-4 font-medium">
        <span>Dibangun dengan Next.js & Tailwind CSS</span>
        <span>•</span>
        <span>Enterprise-Grade Architecture</span>
        <span>•</span>
        <span>Zenith POS v2.0</span>
        <span>•</span>
        <span>Retail &amp; Business Hub</span>
        <span>•</span>
        <span>Built for focused operations</span>
      </div>
    </div>
  );
}
