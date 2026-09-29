'use client';

import Link from 'next/link';

export default function WelcomePage() {
  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-4 py-16 animate-fadeIn overflow-hidden bg-slate-50">
      {/* Ambient Radial Glow Background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Top Tag / Pill */}
      <div className="relative inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-white text-slate-700 text-xs font-semibold uppercase tracking-wider mb-6 border border-slate-200/80 shadow-xs">
        <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
        <span>Zenith POS Enterprise Suite v2.0</span>
      </div>

      {/* Main Heading */}
      <h1 className="relative text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl leading-tight">
        Sistem Operasional Retail & <span className="text-indigo-600 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Kasir Profesional</span>
      </h1>

      <p className="relative mt-5 text-base md:text-lg text-slate-600 max-w-2xl font-normal leading-relaxed">
        Platform manajemen kasir (POS) dan kontrol inventaris gudang secara real-time. Dirancang dengan standar industri untuk efisiensi bisnis Anda.
      </p>

      {/* Feature Highlight Pills */}
      <div className="relative mt-8 flex flex-wrap justify-center gap-3 max-w-2xl text-xs font-semibold text-slate-600">
        <span className="px-4 py-2 bg-white border border-slate-200/80 rounded-xl shadow-2xs flex items-center space-x-2 hover:border-indigo-200 transition">
          <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>Transaksi Cepat &amp; Akurat</span>
        </span>
        <span className="px-4 py-2 bg-white border border-slate-200/80 rounded-xl shadow-2xs flex items-center space-x-2 hover:border-indigo-200 transition">
          <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <span>Kontrol Stok Otomatis</span>
        </span>
        <span className="px-4 py-2 bg-white border border-slate-200/80 rounded-xl shadow-2xs flex items-center space-x-2 hover:border-indigo-200 transition">
          <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span>Laporan Keuangan Real-time</span>
        </span>
      </div>

      {/* Login CTA Button */}
      <div className="relative mt-10">
        <Link
          href="/login"
          className="inline-flex items-center space-x-2.5 px-9 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm shadow-xl shadow-indigo-600/30 transition-all duration-300 hover:-translate-y-0.5"
        >
          <span>Login Sistem</span>
          <span>&rarr;</span>
        </Link>
      </div>

      {/* Feature Cards Grid (Static & Beautifully Styled with Top Accent Lines) */}
      <div className="relative mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full text-left">
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
          <div className="h-1.5 w-full bg-indigo-600"></div>
          <div className="p-7">
            <div className="w-11 h-11 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-2xs border border-indigo-100/60 group-hover:scale-105 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5 tracking-tight">POS Kasir Cepat</h3>
            <p className="text-slate-500 text-xs font-normal leading-relaxed">
              Kasir digital interaktif untuk melayani transaksi pembeli dengan kalkulasi kembalian otomatis.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
          <div className="h-1.5 w-full bg-emerald-600"></div>
          <div className="p-7">
            <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4 shadow-2xs border border-emerald-100/60 group-hover:scale-105 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5 tracking-tight">Manajemen Stok</h3>
            <p className="text-slate-500 text-xs font-normal leading-relaxed">
              Kelola data produk, atur harga, dan pantau ketersediaan barang dengan preset retail instan.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
          <div className="h-1.5 w-full bg-sky-600"></div>
          <div className="p-7">
            <div className="w-11 h-11 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center mb-4 shadow-2xs border border-sky-100/60 group-hover:scale-105 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5 tracking-tight">Riwayat &amp; Ekspor</h3>
            <p className="text-slate-500 text-xs font-normal leading-relaxed">
              Pantau laporan transaksi harian dan ekspor data dengan mudah ke format CSV.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="relative mt-20 pt-6 border-t border-slate-200/80 text-slate-400 text-xs flex flex-wrap justify-center items-center gap-3 font-medium">
        <span>Dibangun dengan Next.js &amp; Tailwind CSS</span>
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
