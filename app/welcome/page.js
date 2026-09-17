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
      <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wider mb-6 border border-slate-200">
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

      {/* Role / Feature Selection Cards */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
        <Link
          href="/"
          className="bg-white p-7 rounded-xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col items-start text-left group"
        >
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">Dashboard Bisnis</h3>
          <p className="text-slate-500 text-xs mb-6 font-normal leading-relaxed">
            Pantau total pendapatan, riwayat transaksi, dan peringatan stok menipis secara terpusat.
          </p>
          <span className="mt-auto inline-flex items-center text-xs font-bold text-indigo-600 group-hover:underline">
            Masuk Dashboard &rarr;
          </span>
        </Link>

        <Link
          href="/pos"
          className="bg-white p-7 rounded-xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col items-start text-left group"
        >
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">Kasir (POS)</h3>
          <p className="text-slate-500 text-xs mb-6 font-normal leading-relaxed">
            Sistem kasir digital interaktif untuk melayani transaksi pembeli dengan cepat dan akurat.
          </p>
          <span className="mt-auto inline-flex items-center text-xs font-bold text-emerald-600 group-hover:underline">
            Buka Kasir POS &rarr;
          </span>
        </Link>

        <Link
          href="/inventory"
          className="bg-white p-7 rounded-xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col items-start text-left group"
        >
          <div className="w-10 h-10 bg-sky-50 text-sky-600 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">Manajemen Stok</h3>
          <p className="text-slate-500 text-xs mb-6 font-normal leading-relaxed">
            Kelola data produk, atur harga, dan pantau ketersediaan barang di gudang secara efisien.
          </p>
          <span className="mt-auto inline-flex items-center text-xs font-bold text-sky-600 group-hover:underline">
            Kelola Stok &rarr;
          </span>
        </Link>
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
