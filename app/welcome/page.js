'use client';

import Link from 'next/link';

export default function WelcomePage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 animate-fadeIn">
      {/* Hero Badge */}
      <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-6 border border-indigo-200/60 shadow-xs">
        <span>Next-Generation Retail POS & Inventory Suite</span>
      </div>

      {/* Main Heading */}
      <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight max-w-3xl leading-tight">
        Solusi Cerdas Operasional & Manajemen <span className="text-indigo-600">Zenith POS</span>
      </h1>

      <p className="mt-6 text-base md:text-lg text-slate-600 max-w-2xl font-normal leading-relaxed">
        Platform digital all-in-one untuk kasir kilat (POS), kontrol inventaris otomatis, dan pemantauan performa bisnis secara real-time. Dirancang untuk efisiensi maksimal usaha Anda.
      </p>

      {/* Role / Feature Selection Cards */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
        <Link
          href="/"
          className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs hover:shadow-xl hover:border-indigo-500 transition-all duration-200 flex flex-col items-center text-center group"
        >
          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-105 transition">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Dashboard Bisnis</h3>
          <p className="text-slate-500 text-sm mb-6 font-normal">
            Pantau total pendapatan, riwayat transaksi, dan peringatan stok menipis secara terpusat.
          </p>
          <span className="mt-auto px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold group-hover:bg-indigo-600 transition">
            Masuk Dashboard &rarr;
          </span>
        </Link>

        <Link
          href="/pos"
          className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs hover:shadow-xl hover:border-indigo-500 transition-all duration-200 flex flex-col items-center text-center group"
        >
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-105 transition">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Kasir (POS)</h3>
          <p className="text-slate-500 text-sm mb-6 font-normal">
            Sistem kasir digital interaktif untuk melayani transaksi pembeli dengan cepat dan akurat.
          </p>
          <span className="mt-auto px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold group-hover:bg-emerald-600 transition">
            Buka Kasir POS &rarr;
          </span>
        </Link>

        <Link
          href="/inventory"
          className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs hover:shadow-xl hover:border-indigo-500 transition-all duration-200 flex flex-col items-center text-center group"
        >
          <div className="w-14 h-14 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-105 transition">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Manajemen Stok</h3>
          <p className="text-slate-500 text-sm mb-6 font-normal">
            Kelola data produk, atur harga, dan pantau ketersediaan barang di gudang secara efisien.
          </p>
          <span className="mt-auto px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold group-hover:bg-sky-600 transition">
            Kelola Stok &rarr;
          </span>
        </Link>
      </div>

      {/* Footer Info */}
      <div className="mt-16 pt-8 border-t border-slate-200 text-slate-400 text-xs flex flex-col sm:flex-row justify-center items-center gap-4 font-medium">
        <span>Dibangun dengan Next.js & Tailwind CSS</span>
        <span>•</span>
        <span>Enterprise-Grade Architecture</span>
        <span>•</span>
        <span>Zenith POS v2.0</span>
      </div>
    </div>
  );
}
