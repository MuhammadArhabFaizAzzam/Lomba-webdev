'use client';

import Link from 'next/link';

export default function GuidePage() {
  const modules = [
    {
      step: '1',
      title: 'Manajemen Stok, HPP & Preset Retail',
      description:
        'Kelola katalog produk lengkap dengan Harga Jual dan Harga Modal (HPP) untuk perhitungan Laba Kotor akurat. Gunakan fitur Preset Data Instan (Warung Sembako, Mini Market, Kantin) atau simpan preset kustom toko Anda.',
      href: '/inventory',
      buttonText: 'Buka Manajemen Stok →',
      tone: 'emerald',
    },
    {
      step: '2',
      title: 'Kasir POS, Shift Kasir & QRIS Dinamis',
      description:
        'Buka shift kasir dengan modal awal laci, scan barcode produk, pilih member CRM untuk diskon otomatis, dan proses pembayaran via Tunai atau QRIS Dinamis (lengkap dengan cetak struk thermal 58mm/80mm & rekonsiliasi tutup shift).',
      href: '/pos',
      buttonText: 'Buka Kasir POS →',
      tone: 'emerald',
    },
    {
      step: '3',
      title: 'Kitchen Display System (Layar Dapur / KDS)',
      description:
        'Setiap pesanan dari kasir langsung terhubung secara real-time ke layar dapur. Staf dapur dapat memperbarui status pesanan mulai dari Menunggu, Sedang Dimasak, Siap Saji, hingga Selesai.',
      href: '/kds',
      buttonText: 'Buka Layar Dapur (KDS) →',
      tone: 'amber',
    },
    {
      step: '4',
      title: 'Pelanggan & Member Loyalty (CRM)',
      description:
        'Kelola database pelanggan beserta tingkatan tier member (Bronze, Silver diskon 3%, Gold diskon 5%). Setiap transaksi otomatis menambah poin loyalitas (1 poin tiap kelipatan Rp10.000) dan menaikkan tier member.',
      href: '/customers',
      buttonText: 'Buka Pelanggan & CRM →',
      tone: 'emerald',
    },
    {
      step: '5',
      title: 'Manajemen Supplier & Purchase Order (PO)',
      description:
        'Buat pesanan pembelian (Purchase Order) ke vendor pemasok saat stok gudang menipis. Saat barang diterima (Terima Barang), jumlah stok produk di gudang otomatis bertambah.',
      href: '/suppliers',
      buttonText: 'Buka Supplier & PO →',
      tone: 'emerald',
    },
    {
      step: '6',
      title: 'Riwayat Transaksi, Retur & Dashboard Bisnis',
      description:
        'Pantau grafik tren omzet, laba kotor aktual (harga jual dikurangi HPP & diskon), verifikasi pembayaran QRIS, proses Retur Barang (otomatis mengembalikan stok gudang), serta ekspor laporan CSV kompatibel Excel.',
      href: '/transactions',
      buttonText: 'Buka Riwayat Transaksi →',
      tone: 'amber',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto py-4">
      {/* Header */}
      <div className="spotlight-card bg-[#11141B] rounded-2xl p-6 md:p-8 text-white shadow-xl border border-white/[0.08]">
        <span className="bg-white/[0.05] text-emerald-300 border border-white/[0.1] font-mono text-[10px] font-semibold px-3 py-1 rounded-full uppercase tracking-[0.16em]">
          Panduan Evaluasi Juri
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold mt-3 tracking-tight">Panduan Penggunaan &amp; Fitur Zenith POS</h2>
        <p className="text-slate-400 text-sm md:text-base mt-2 leading-relaxed">
          Dokumentasi alur pengujian end-to-end untuk memudahkan dewan juri mengeksplorasi seluruh ekosistem transformasi digital UMKM pada Zenith POS v2.0.
        </p>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-grid">
        {modules.map((mod) => (
          <div
            key={mod.step}
            className="spotlight-card bg-[#11141B] p-6 rounded-2xl border border-white/[0.08] shadow-xs flex flex-col justify-between group"
          >
            <div>
              <div
                className={`w-10 h-10 rounded-xl font-mono font-bold flex items-center justify-center text-sm mb-4 transition-transform duration-300 group-hover:scale-105 ${
                  mod.tone === 'amber'
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                0{mod.step}
              </div>
              <h3 className="text-base font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">{mod.title}</h3>
              <p className="text-slate-400 text-xs mb-5 leading-relaxed">{mod.description}</p>
            </div>
            <Link
              href={mod.href}
              className="inline-flex items-center justify-center py-2.5 px-4 bg-white/[0.05] hover:bg-emerald-500 text-slate-200 hover:text-slate-950 border border-white/[0.09] hover:border-emerald-400 rounded-xl text-xs font-bold transition-all"
            >
              {mod.buttonText}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
