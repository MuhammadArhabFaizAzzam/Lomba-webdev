'use client';

import Link from 'next/link';

export default function WelcomePage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-600 selection:text-white">
      {/* Ambient Radial Glow Background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-indigo-500/10 blur-[140px] rounded-full pointer-events-none"></div>

      {/* Header Navigation */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-5 flex items-center justify-between border-b border-slate-200/80">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-indigo-600/30">
            Z
          </div>
          <div>
            <span className="font-extrabold text-slate-900 tracking-tight text-base block">Zenith POS</span>
            <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase block -mt-1">Retail & UMKM Suite</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-semibold text-slate-600">
          <Link href="/guide" className="hover:text-indigo-600 transition">Panduan</Link>
          <Link href="/pos" className="hover:text-indigo-600 transition">Demo Kasir</Link>
          <Link href="/transactions" className="hover:text-indigo-600 transition">Riwayat Admin</Link>
        </nav>

        <div className="flex items-center space-x-3">
          <Link
            href="/pos"
            className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl transition border border-indigo-200/60"
          >
            Buka Kasir
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition"
          >
            Login Admin
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative flex-1 flex flex-col items-center justify-center text-center px-4 py-16 max-w-5xl mx-auto">
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
          Platform manajemen kasir interaktif dengan QRIS per transaksi, kontrol stok otomatis, dan sinkronisasi laporan real-time ke admin.
        </p>

        {/* Feature Highlight Pills */}
        <div className="relative mt-8 flex flex-wrap justify-center gap-3 max-w-3xl text-xs font-semibold text-slate-600">
          <span className="px-4 py-2 bg-white border border-slate-200/80 rounded-xl shadow-2xs flex items-center space-x-2 hover:border-indigo-200 transition">
            <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Transaksi &amp; POS Cepat</span>
          </span>
          <span className="px-4 py-2 bg-white border border-slate-200/80 rounded-xl shadow-2xs flex items-center space-x-2 hover:border-indigo-200 transition">
            <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            <span>QRIS per Transaksi (Auto ke Admin)</span>
          </span>
          <span className="px-4 py-2 bg-white border border-slate-200/80 rounded-xl shadow-2xs flex items-center space-x-2 hover:border-indigo-200 transition">
            <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>Kontrol Stok &amp; Ekspor CSV</span>
          </span>
        </div>

        {/* Dual CTA Buttons for Demo / Judge */}
        <div className="relative mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/pos"
            className="inline-flex items-center space-x-2.5 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm shadow-xl shadow-indigo-600/30 transition-all duration-300 hover:-translate-y-0.5"
          >
            <span>Lihat Demo Kasir (POS)</span>
            <span>&rarr;</span>
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center space-x-2.5 px-8 py-4 bg-white hover:bg-slate-100 text-slate-800 font-bold rounded-xl text-sm shadow-md border border-slate-200 transition-all duration-300 hover:-translate-y-0.5"
          >
            <span>Masuk sebagai Admin</span>
          </Link>
        </div>

        {/* 4-Step Operational Workflow Cards */}
        <div className="relative mt-20 text-left w-full">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">Alur Sistem</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-2">Bagaimana Zenith POS Bekerja</h2>
            <p className="text-slate-500 text-sm mt-1">4 langkah mudah dari kasir hingga laporan admin.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 hover:shadow-lg transition">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-sm mb-4 border border-indigo-100">1</div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Pilih Produk</h3>
              <p className="text-slate-500 text-xs leading-relaxed">Kasir memilih item dari katalog dengan pengecekan stok otomatis.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 hover:shadow-lg transition">
              <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-bold text-sm mb-4 border border-amber-100">2</div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Bayar QRIS Dinamis</h3>
              <p className="text-slate-500 text-xs leading-relaxed">Sistem membuat QR code unik per transaksi dengan nominal &amp; timer.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 hover:shadow-lg transition">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-sm mb-4 border border-emerald-100">3</div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Stok Berkurang</h3>
              <p className="text-slate-500 text-xs leading-relaxed">Inventaris gudang langsung terpotong akurat saat pembayaran lunas.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 hover:shadow-lg transition">
              <div className="w-10 h-10 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center font-bold text-sm mb-4 border border-sky-100">4</div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Admin Terima Status</h3>
              <p className="text-slate-500 text-xs leading-relaxed">Transaksi &amp; rekap langsung masuk ke dashboard bisnis &amp; riwayat admin.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="relative mt-20 py-6 border-t border-slate-200/80 bg-white text-slate-500 text-xs flex flex-wrap justify-center items-center gap-4 font-medium">
        <span>Zenith POS v2.0</span>
        <span>•</span>
        <span>Role Kasir &amp; Admin</span>
        <span>•</span>
        <span>Stok Real-time</span>
        <span>•</span>
        <span>Ekspor Laporan CSV</span>
        <span>•</span>
        <span>Dibangun dengan Next.js &amp; Tailwind CSS</span>
      </footer>
    </div>
  );
}
