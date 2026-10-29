'use client';

import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  Layers,
  PackageCheck,
  Printer,
  QrCode,
  ShieldCheck,
  ShoppingCart,
  TrendingUp,
} from 'lucide-react';

const features = [
  {
    icon: ShoppingCart,
    index: '01',
    title: 'Eksekusi Kasir Tanpa Hambatan',
    description:
      'Pencarian katalog instan, kalkulasi diskon member CRM otomatis, dan pencetakan struk thermal 58mm/80mm.',
    metric: 'Respons Instan',
  },
  {
    icon: PackageCheck,
    index: '02',
    title: 'Sinkronisasi Stok & HPP Presisi',
    description:
      'Pemotongan inventaris otomatis saat transaksi lunas, lengkap dengan peringatan batas stok rendah.',
    metric: 'Real-Time Ledger',
  },
  {
    icon: BarChart3,
    index: '03',
    title: 'Analitik Laba Kotor Aktual',
    description:
      'Bukan sekadar omzet kotor. Pantau selisih harga jual terhadap HPP dan rekonsiliasi kas per shift.',
    metric: 'Audit-Ready CSV',
  },
  {
    icon: ShieldCheck,
    index: '04',
    title: 'Otorisasi Multi-Peran (RBAC)',
    description:
      'Pemisahan ruang kerja yang ketat antara operasional staf kasir dan kendali penuh manajemen toko.',
    metric: 'Role Guarded',
  },
];

const workflowSteps = [
  {
    number: '01',
    icon: ShoppingCart,
    title: 'Transaksi & Pemindaian Produk',
    description:
      'Kasir memilih produk atau memindai kode SKU dengan validasi ketersediaan stok gudang secara langsung serta penerapan diskon tier member CRM.',
    highlights: ['Validasi stok otomatis', 'Diskon tier member Silver & Gold'],
  },
  {
    number: '02',
    icon: QrCode,
    title: 'Otorisasi QRIS Dinamis & Tunai',
    description:
      'Setiap tagihan dikunci secara presisi. Begitu pembayaran dikonfirmasi, pesanan diteruskan ke Layar Dapur (KDS) dan struk siap dicetak.',
    highlights: ['Penerusan instan ke Layar Dapur (KDS)', 'Cetak struk thermal 58mm / 80mm & WA'],
  },
  {
    number: '03',
    icon: TrendingUp,
    title: 'Analitik Laba & Rekonsiliasi Shift',
    description:
      'Manajemen memantau pendapatan bersih, laba kotor aktual (omzet dikurangi HPP), riwayat retur barang, serta rekonsiliasi uang fisik kasir.',
    highlights: ['Kalkulasi HPP & margin laba kotor', 'Ekspor laporan CSV siap audit'],
  },
];

const heroPillars = [
  {
    icon: Printer,
    value: '58 / 80mm',
    label: 'Struk Thermal & Kirim WA',
  },
  {
    icon: TrendingUp,
    value: 'Auto-HPP',
    label: 'Analitik Laba Kotor Aktual',
  },
  {
    icon: QrCode,
    value: 'Real-Time',
    label: 'Sinkronisasi Stok & KDS',
  },
  {
    icon: ShieldCheck,
    value: 'Multi-Role',
    label: 'Otorisasi Kasir & Admin',
  },
];

const faqs = [
  [
    'Bagaimana integrasi antara Kasir POS, QRIS, dan Layar Dapur (KDS)?',
    'Setiap transaksi yang diselesaikan melalui kasir maupun pembayaran QRIS Dinamis langsung tercatat di riwayat transaksi, memotong stok produk di gudang, dan mengirimkan tiket pesanan ke Layar Dapur (KDS) secara real-time.',
  ],
  [
    'Bagaimana sistem menghitung Laba Kotor pada Dashboard?',
    'Setiap produk memiliki atribut Harga Jual dan Harga Modal (HPP). Laba kotor dihitung secara akurat dari selisih pendapatan bersih terhadap total HPP barang yang terjual.',
  ],
  [
    'Apakah sistem mendukung rekonsiliasi kasir dan retur barang?',
    'Ya. Kasir membuka shift dengan modal awal dan menutup shift dengan perhitungan uang fisik aktual. Jika terjadi retur barang, stok dikembalikan ke gudang dan nilai transaksi disesuaikan otomatis.',
  ],
];

const TICKER_HIGHLIGHTS = [
  { code: 'POS TERMINAL', label: 'Pencetakan Struk Thermal 58mm & 80mm', meta: 'Cetak & Kirim WhatsApp', dot: 'emerald' },
  { code: 'DYNAMIC QRIS', label: 'Verifikasi Pembayaran Otomatis', meta: 'Sinkronisasi Kas & Stok', dot: 'emerald' },
  { code: 'KITCHEN DISPLAY', label: 'Pemantauan Pesanan Dapur Real-Time', meta: 'Antrean Terstruktur', dot: 'amber' },
  { code: 'CRM LOYALTY', label: 'Manajemen Member Bronze, Silver & Gold', meta: 'Kalkulasi Poin & Diskon', dot: 'sky' },
  { code: 'PROCUREMENT', label: 'Manajemen Supplier & Purchase Order', meta: 'Restock Gudang Terintegrasi', dot: 'emerald' },
];

export default function WelcomePage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#08090C] text-[#F8FAFC] relative selection:bg-emerald-500/30 selection:text-white">
      {/* Subtle Architectural Dot Matrix & Ambient Glow */}
      <div className="zenith-bg-grid pointer-events-none absolute inset-0 opacity-60" />
      <div className="animate-aurora pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[960px] h-[440px] bg-emerald-500/[0.06] blur-[140px] rounded-full" />

      {/* Top Navigation */}
      <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#08090C]/85 backdrop-blur-2xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/welcome" className="group flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#11141B] border border-white/15 text-sm font-extrabold text-emerald-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] transition-transform duration-300 group-hover:scale-105">
              Z
            </span>
            <span>
              <b className="block text-sm font-bold tracking-tight text-white">Zenith POS</b>
              <small className="block font-mono text-[9px] uppercase tracking-[0.18em] text-slate-400">
                Point of Sale &amp; Inventory Suite
              </small>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-xs font-medium text-slate-400 md:flex">
            <a href="#fitur" className="transition hover:text-white">Fitur Utama</a>
            <a href="#alur" className="transition hover:text-white">Alur Kerja</a>
            <a href="#faq" className="transition hover:text-white">Informasi Sistem</a>
            <Link href="/guide" className="transition hover:text-white">Panduan</Link>
          </nav>

          <div className="flex items-center gap-2.5">
            <Link
              href="/pos"
              className="hidden rounded-xl border border-white/[0.1] bg-white/[0.03] px-3.5 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/[0.07] hover:border-white/20 sm:inline-flex"
            >
              Buka Kasir POS
            </Link>
            <Link
              href="/login"
              className="btn-primary rounded-xl bg-emerald-500 hover:bg-emerald-400 px-4 py-2 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition"
            >
              Masuk Sistem
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* Centered Editorial Hero Section (No Simulation Box) */}
        <section className="relative mx-auto max-w-5xl px-5 pb-20 pt-16 sm:px-8 lg:pb-28 lg:pt-24 text-center">
          <div className="relative z-10 animate-fadeIn flex flex-col items-center">
            <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-white/[0.1] bg-white/[0.03] px-4 py-1.5 text-[11px] font-medium text-slate-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              <span>Manajemen Operasional Retail &amp; F&amp;B Modern</span>
            </div>

            <h1 className="max-w-4xl text-4xl font-extrabold leading-[1.06] tracking-[-0.04em] text-white sm:text-6xl lg:text-[64px]">
              Presisi operasional untuk bisnis yang{' '}
              <span className="font-editorial italic font-normal text-emerald-300 tracking-normal">
                tumbuh elegan.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
              Zenith POS menyatukan transaksi kasir, pembayaran QRIS dinamis, layar pesanan dapur (KDS), akuntansi HPP, dan pengendalian stok gudang dalam satu platform yang cepat dan terukur.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5">
              <Link
                href="/pos"
                className="btn-primary inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-7 py-3.5 text-xs font-bold text-slate-950 shadow-xl shadow-emerald-500/20 transition hover:-translate-y-0.5"
              >
                <span>Buka Kasir POS</span>
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/guide"
                className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-[#11141B] px-7 py-3.5 text-xs font-semibold text-slate-200 transition hover:-translate-y-0.5 hover:border-white/20 hover:text-white"
              >
                <span>Pelajari Panduan Sistem</span>
                <ArrowUpRight size={15} className="text-slate-400" />
              </Link>
            </div>

            {/* Architectural 4-Pillar Highlights Bar */}
            <div className="stagger-grid mt-16 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
              {heroPillars.map(({ icon: PillarIcon, value, label }) => (
                <div
                  key={value}
                  className="spotlight-card rounded-2xl border border-white/[0.08] bg-[#11141B]/90 p-5 flex items-center gap-4"
                >
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/[0.04] border border-white/[0.08] text-emerald-400">
                    <PillarIcon size={18} />
                  </div>
                  <div>
                    <p className="font-mono text-base font-bold text-white">{value}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Continuous Smooth Capability Ticker */}
        <section className="border-y border-white/[0.07] bg-[#0B0D11]/90 py-3.5 overflow-hidden">
          <div className="animate-marquee flex items-center gap-6">
            {[...TICKER_HIGHLIGHTS, ...TICKER_HIGHLIGHTS].map((ev, idx) => (
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
              Setiap modul saling terhubung secara otomatis—mulai dari pemindaian produk hingga rekonsiliasi laporan keuangan.
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
                  <ArrowUpRight
                    size={13}
                    className="text-slate-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white"
                  />
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Clean 3-Column Integrated Workflow Section (No Simulation Box) */}
        <section id="alur" className="scroll-reveal border-t border-white/[0.07] bg-[#0B0D11] px-5 py-24 text-white sm:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div className="max-w-2xl">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-400">
                  02 / Alur Kerja Terintegrasi
                </span>
                <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                  Satu transaksi menggerakkan seluruh ekosistem.
                </h2>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-slate-400">
                Tidak ada lagi rekapitulasi manual di akhir hari. Setiap pembayaran otomatis memperbarui stok gudang, antrean dapur, dan laporan laba kotor.
              </p>
            </div>

            <div className="stagger-grid grid gap-6 lg:grid-cols-3">
              {workflowSteps.map(({ number, icon: StepIcon, title, description, highlights }) => (
                <div
                  key={number}
                  className="spotlight-card group rounded-2xl border border-white/[0.08] bg-[#11141B] p-7 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="inline-flex items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/25 px-3 py-1 font-mono text-xs font-bold text-emerald-300">
                        TAHAP {number}
                      </span>
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-300 group-hover:text-emerald-400 transition-colors">
                        <StepIcon size={18} />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {title}
                    </h3>
                    <p className="mt-2.5 text-xs leading-relaxed text-slate-400">{description}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/[0.06] space-y-2">
                    {highlights.map((item) => (
                      <div key={item} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action & FAQ */}
        <section className="scroll-reveal mx-auto grid max-w-7xl gap-8 px-5 py-24 sm:px-8 lg:grid-cols-2">
          <div className="spotlight-card relative overflow-hidden rounded-3xl border border-white/[0.1] bg-gradient-to-b from-[#141923] to-[#0D1016] p-8 text-white sm:p-10 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/25 px-3 py-1 font-mono text-[10px] font-semibold text-emerald-300">
                <Layers size={13} /> EKOSISTEM RETAIL TERPADU
              </div>
              <h2 className="mt-6 text-3xl font-extrabold tracking-tight">
                Kendali penuh atas inventaris dan kas toko Anda.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400">
                Mulai kelola transaksi kasir, cetak struk thermal, pantau stok gudang, dan evaluasi pertumbuhan bisnis dari satu pusat kendali.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="btn-primary inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-5 py-3 text-xs font-bold text-slate-950 transition"
              >
                <span>Masuk ke Sistem</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/pos"
                className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/[0.04] hover:bg-white/[0.08] px-5 py-3 text-xs font-semibold text-white transition"
              >
                <span>Buka Kasir POS</span>
              </Link>
            </div>
          </div>

          <div id="faq" className="rounded-3xl border border-white/[0.08] bg-[#11141B] p-7 sm:p-10">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-400">
              03 / Spesifikasi &amp; FAQ
            </span>
            <h2 className="mt-2.5 text-2xl font-bold tracking-tight text-white">Informasi Sistem</h2>
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
              <span className="text-[11px] text-slate-500">Sistem Kasir, Inventaris &amp; Analitik Bisnis</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-slate-400">
            <Link href="/guide" className="transition hover:text-white">Panduan</Link>
            <Link href="/pos" className="transition hover:text-white">Kasir POS</Link>
            <Link href="/login" className="transition hover:text-white">Login</Link>
            <span className="font-mono text-[11px] text-slate-500">Zenith POS v2.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
