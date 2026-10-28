'use client';

import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  PackageCheck,
  QrCode,
  ReceiptText,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Store,
  Zap,
} from 'lucide-react';

const features = [
  {
    icon: ShoppingCart,
    title: 'Kasir lebih cepat',
    description: 'Cari produk, atur jumlah, dan selesaikan transaksi dari satu layar yang ringkas.',
    tone: 'emerald',
  },
  {
    icon: PackageCheck,
    title: 'Stok tetap terkendali',
    description: 'Perubahan stok mengikuti transaksi sehingga tim dapat segera melihat barang menipis.',
    tone: 'amber',
  },
  {
    icon: BarChart3,
    title: 'Laporan siap dibaca',
    description: 'Pantau omzet, transaksi, laba kotor, dan tren penjualan dalam dashboard operasional.',
    tone: 'sky',
  },
  {
    icon: ShieldCheck,
    title: 'Akses sesuai peran',
    description: 'Kasir fokus melayani pelanggan, sementara admin memegang kontrol bisnis yang lebih luas.',
    tone: 'violet',
  },
];

const faqs = [
  ['Apakah Zenith POS bisa dicoba tanpa data toko asli?', 'Bisa. Gunakan mode demo untuk melihat alur POS, QRIS, stok, dan dashboard tanpa memasukkan data operasional nyata.'],
  ['Apakah QRIS dibuat berbeda untuk setiap transaksi?', 'Pada alur demo, QRIS dibuat dengan nominal dan timer per transaksi agar kasir dapat memantau status pembayaran dengan jelas.'],
  ['Siapa yang cocok memakai Zenith POS?', 'Zenith dirancang untuk retail dan UMKM yang membutuhkan kasir, inventaris, laporan, dan alur kerja yang saling terhubung.'],
];

function ProductMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[620px]">
      <div className="absolute -left-8 top-12 hidden h-36 w-36 rounded-full bg-emerald-300/30 blur-3xl sm:block" />
      <div className="absolute -right-4 bottom-4 h-40 w-40 rounded-full bg-amber-200/40 blur-3xl" />

      <div className="relative rounded-[28px] border border-[#1e2a26] bg-[#121816] p-3 shadow-[0_30px_90px_-35px_rgba(15,23,42,0.45)]">
        <div className="flex items-center justify-between border-b border-[#1e2a26] px-3 pb-3">
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-600 text-xs font-black text-white">Z</div>
            <span className="text-xs font-bold text-[#f0fdf4]">Zenith POS</span>
          </div>
          <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[9px] font-bold text-emerald-300">DEMO LIVE</span>
        </div>

        <div className="grid gap-3 p-2 sm:grid-cols-[1.25fr_.75fr]">
          <div className="rounded-2xl bg-[#0a0e0d] p-3">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400">Kasir</p>
                <p className="text-sm font-extrabold text-[#f0fdf4]">Pilih produk</p>
              </div>
              <div className="rounded-lg bg-[#121816] px-2 py-1 text-[9px] font-semibold text-[#94a3b8] shadow-sm">Semua</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {['Kopi Susu', 'Croissant', 'Matcha Latte', 'Air Mineral'].map((item, index) => (
                <div key={item} className="rounded-xl border border-[#1e2a26] bg-[#121816] p-2">
                  <div className={`mb-2 h-12 rounded-lg ${index % 2 ? 'bg-amber-500/15' : 'bg-emerald-500/15'}`} />
                  <p className="truncate text-[10px] font-bold text-[#f0fdf4]">{item}</p>
                  <p className="mt-1 text-[9px] font-semibold text-emerald-300">Rp {index === 0 ? '18.000' : index === 1 ? '22.000' : '16.000'}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-[#090c0b] p-3 text-white">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400">Pesanan aktif</p>
              <ReceiptText size={14} className="text-emerald-300" />
            </div>
            <div className="space-y-3 border-b border-white/10 pb-4">
              <div className="flex justify-between text-[10px]"><span className="text-[#cbd5e1]">Kopi Susu × 2</span><b>Rp 36.000</b></div>
              <div className="flex justify-between text-[10px]"><span className="text-[#cbd5e1]">Croissant × 1</span><b>Rp 22.000</b></div>
            </div>
            <div className="flex items-end justify-between pt-4">
              <span className="text-[10px] text-slate-400">Total</span>
              <strong className="text-lg">Rp 58.000</strong>
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-500 px-3 py-2 text-[10px] font-bold text-white">
              <QrCode size={14} /> Bayar dengan QRIS <ArrowRight size={12} className="ml-auto" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-7 right-4 hidden w-44 rounded-2xl border border-[#1e2a26] bg-[#121816] p-3 shadow-xl sm:block">
        <div className="mb-2 flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-amber-500/15 text-amber-300"><Clock3 size={14} /></div>
          <div><p className="text-[9px] font-bold text-[#f0fdf4]">Menunggu pembayaran</p><p className="text-[9px] text-slate-400">00:42 tersisa</p></div>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-[#121816]"><div className="h-full w-2/3 rounded-full bg-amber-400" /></div>
      </div>
    </div>
  );
}

function DashboardMockup() {
  return (
    <div className="rounded-[24px] border border-[#1e2a26] bg-[#090c0b] p-3 shadow-[0_30px_80px_-35px_rgba(15,23,42,0.55)]">
      <div className="flex items-center justify-between border-b border-white/10 px-2 pb-3">
        <span className="text-xs font-bold text-white">Business overview</span>
        <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-[9px] font-bold text-emerald-300">7 HARI</span>
      </div>
      <div className="grid gap-2 p-2 sm:grid-cols-3">
        {[
          ['Pendapatan', 'Rp 12,8 jt', '↑ 18%'],
          ['Transaksi', '248', 'Aktual'],
          ['Stok rendah', '6 item', 'Restock'],
        ].map(([label, value, meta], index) => (
          <div key={label} className="rounded-xl border border-white/10 bg-emerald-500/[0.05] p-3">
            <p className="text-[9px] font-semibold text-slate-400">{label}</p>
            <p className="mt-2 text-base font-extrabold text-white">{value}</p>
            <p className={`mt-1 text-[9px] font-bold ${index === 2 ? 'text-amber-300' : 'text-emerald-300'}`}>{meta}</p>
          </div>
        ))}
      </div>
      <div className="mx-2 rounded-xl border border-white/10 bg-emerald-500/[0.04] p-3">
        <div className="mb-3 flex items-center justify-between"><span className="text-[10px] font-bold text-slate-200">Trend omzet</span><BarChart3 size={14} className="text-emerald-300" /></div>
        <div className="flex h-24 items-end gap-2">
          {[32, 48, 41, 65, 53, 78, 70, 92, 82, 100].map((height, index) => <div key={index} className="flex-1 rounded-t-md bg-gradient-to-t from-emerald-600 to-emerald-300/80" style={{ height: `${height}%` }} />)}
        </div>
      </div>
    </div>
  );
}

export default function WelcomePage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#090c0b] text-[#f0fdf4]">
      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between border-b border-[#1e2a26]/80 px-5 py-5 sm:px-8">
        <Link href="/welcome" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-400 text-lg font-black text-white shadow-lg shadow-emerald-600/25">Z</span>
          <span><b className="block text-sm tracking-tight">Zenith POS</b><small className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Retail & UMKM Suite</small></span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-semibold text-[#94a3b8] md:flex">
          <a href="#fitur" className="transition hover:text-emerald-300">Fitur</a>
          <a href="#alur" className="transition hover:text-emerald-300">Alur kerja</a>
          <a href="#faq" className="transition hover:text-emerald-300">FAQ</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/pos" className="hidden rounded-xl px-3 py-2 text-xs font-bold text-emerald-300 transition hover:bg-emerald-500/15 sm:inline-flex">Demo kasir</Link>
          <Link href="/login" className="rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:bg-emerald-500">Masuk admin</Link>
        </div>
      </header>

      <main>
        <section className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-24 pt-16 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:pb-32 lg:pt-24">
          <div className="absolute left-1/2 top-0 -z-0 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-200/35 blur-3xl" />
          <div className="relative z-10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-[#121816]/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-300 shadow-sm"><Sparkles size={13} /> Operasional toko tanpa ribet</div>
            <h1 className="max-w-2xl text-4xl font-black leading-[1.04] tracking-[-0.06em] text-[#f0fdf4] sm:text-6xl">Kasir cepat. Stok rapi. <span className="bg-gradient-to-r from-emerald-600 to-teal-400 bg-clip-text text-transparent">Bisnis lebih siap tumbuh.</span></h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-[#94a3b8] sm:text-lg">Zenith POS menyatukan transaksi, QRIS, inventaris, dan laporan dalam satu alur yang mudah dipahami tim retail dan UMKM.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/pos" className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3.5 text-sm font-bold text-white shadow-xl shadow-emerald-600/25 transition hover:-translate-y-1 hover:bg-emerald-500">Coba demo kasir <ArrowRight size={16} /></Link>
              <Link href="/guide" className="inline-flex items-center gap-2 rounded-2xl border border-[#1e2a26] bg-[#121816] px-5 py-3.5 text-sm font-bold text-[#f0fdf4] transition hover:-translate-y-1 hover:border-emerald-500/30 hover:text-emerald-300">Lihat cara kerja</Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-[#94a3b8]">
              {['Demo interaktif', 'QRIS per transaksi', 'Role kasir & admin'].map((item) => <span key={item} className="inline-flex items-center gap-1.5"><Check size={14} className="text-emerald-300" /> {item}</span>)}
            </div>
          </div>
          <div className="relative z-10"><ProductMockup /></div>
        </section>

        <section className="border-y border-[#1e2a26]/80 bg-[#121816] px-5 py-7 sm:px-8">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-center text-xs font-semibold text-[#94a3b8] sm:justify-between sm:text-left">
            <span className="inline-flex items-center gap-2"><Store size={16} className="text-emerald-300" /> Dibuat untuk retail & UMKM</span>
            <span className="inline-flex items-center gap-2"><Zap size={16} className="text-amber-500" /> Alur operasional ringkas</span>
            <span className="inline-flex items-center gap-2"><CircleDollarSign size={16} className="text-emerald-300" /> Data demo mudah dipahami</span>
          </div>
        </section>

        <section id="fitur" className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <div className="max-w-2xl"><span className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">Satu pusat operasional</span><h2 className="mt-3 text-3xl font-black tracking-tight text-[#f0fdf4] sm:text-4xl">Dari transaksi harian sampai keputusan bisnis.</h2><p className="mt-4 leading-7 text-[#94a3b8]">Bukan sekadar layar kasir. Setiap aktivitas dibuat saling terhubung agar tim bekerja lebih tenang dan pemilik toko mendapat konteks yang lebih jelas.</p></div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, description, tone }) => <article key={title} className="group rounded-3xl border border-[#1e2a26] bg-[#121816] p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-xl"><div className={`mb-6 grid h-11 w-11 place-items-center rounded-2xl ${tone === 'amber' ? 'bg-amber-500/15 text-amber-300' : tone === 'sky' ? 'bg-sky-500/15 text-sky-300' : tone === 'violet' ? 'bg-violet-500/15 text-violet-300' : 'bg-emerald-500/15 text-emerald-300'}`}><Icon size={20} /></div><h3 className="text-base font-extrabold text-[#f0fdf4]">{title}</h3><p className="mt-3 text-sm leading-6 text-[#94a3b8]">{description}</p></article>)}
          </div>
        </section>

        <section id="alur" className="bg-[#090c0b] px-5 py-24 text-white sm:px-8">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[.8fr_1.2fr]">
            <div><span className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">Alur yang terasa nyata</span><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Satu transaksi, dari kasir sampai dashboard.</h2><p className="mt-5 max-w-lg leading-7 text-slate-400">Tunjukkan ke tim bagaimana produk dipilih, pembayaran dikonfirmasi, stok berkurang, dan data masuk ke ringkasan bisnis.</p><div className="mt-7 space-y-4">{[['01', 'Pilih produk', 'Kasir menambahkan item dengan pengecekan stok otomatis.'], ['02', 'Bayar QRIS', 'Nominal dan timer pembayaran tampil jelas di layar.'], ['03', 'Pantau hasil', 'Admin membaca transaksi dan tren tanpa rekap manual.']].map(([number, title, description]) => <div key={number} className="flex gap-4"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-500/15 text-xs font-bold text-emerald-300">{number}</span><div><h3 className="text-sm font-bold">{title}</h3><p className="mt-1 text-sm leading-6 text-slate-400">{description}</p></div></div>)}</div></div>
            <DashboardMockup />
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-10 px-5 py-24 sm:px-8 lg:grid-cols-2">
          <div className="rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-500 p-8 text-white shadow-xl shadow-emerald-600/20 sm:p-10"><PackageCheck size={28} /><h2 className="mt-7 text-3xl font-black tracking-tight">Lebih sedikit tebak-tebakan. Lebih banyak kendali.</h2><p className="mt-4 max-w-md leading-7 text-emerald-50">Dengan alur yang jelas, tim dapat melayani pelanggan lebih cepat, mengurangi salah catat, dan melihat prioritas restock lebih dini.</p><Link href="/pos" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#121816] px-4 py-3 text-sm font-bold text-emerald-300 transition hover:bg-emerald-500/15">Lihat demonya <ArrowRight size={15} /></Link></div>
          <div id="faq" className="rounded-3xl border border-[#1e2a26] bg-[#121816] p-7 sm:p-10"><span className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">Pertanyaan umum</span><h2 className="mt-3 text-2xl font-black tracking-tight text-[#f0fdf4]">Sebelum mulai mencoba</h2><div className="mt-6 divide-y divide-[#1e2a26]">{faqs.map(([question, answer]) => <details key={question} className="group py-4"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-[#f0fdf4]"><span>{question}</span><ChevronDown size={16} className="shrink-0 text-slate-400 transition group-open:rotate-180" /></summary><p className="mt-3 pr-6 text-sm leading-6 text-[#94a3b8]">{answer}</p></details>)}</div></div>
        </section>
      </main>

      <footer className="border-t border-[#1e2a26] bg-[#121816] px-5 py-10 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
          <div><div className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-600 text-sm font-black text-white">Z</span><b className="text-sm">Zenith POS</b></div><p className="mt-3 max-w-sm text-xs leading-5 text-[#94a3b8]">Platform demo operasional retail dan UMKM dengan POS, QRIS, inventaris, dan dashboard bisnis.</p></div>
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold text-[#94a3b8]"><Link href="/guide" className="hover:text-emerald-300">Panduan</Link><Link href="/pos" className="hover:text-emerald-300">Demo kasir</Link><Link href="/login" className="hover:text-emerald-300">Login admin</Link><span className="text-slate-400">Next.js · Tailwind CSS</span></div>
        </div>
      </footer>
    </div>
  );
}
