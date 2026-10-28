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
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-xl border border-slate-800">
        <span className="bg-emerald-500/30 text-emerald-200 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
          Panduan Evaluasi Juri
        </span>
        <h2 className="text-2xl md:text-3xl font-bold mt-2">Panduan Penggunaan &amp; Fitur Zenith POS</h2>
        <p className="text-slate-300 text-sm md:text-base mt-2">
          Dokumentasi alur pengujian end-to-end untuk memudahkan dewan juri mengeksplorasi seluruh ekosistem transformasi digital UMKM pada Zenith POS v2.0.
        </p>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((mod) => (
          <div
            key={mod.step}
            className="bg-[#121816] p-6 rounded-2xl border border-[#1e2a26] shadow-xs flex flex-col justify-between hover:border-emerald-300 transition"
          >
            <div>
              <div
                className={`w-10 h-10 rounded-xl font-bold flex items-center justify-center text-lg mb-4 ${
                  mod.tone === 'amber'
                    ? 'bg-amber-50 text-amber-600 border border-amber-200/60'
                    : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {mod.step}
              </div>
              <h3 className="text-lg font-bold text-[#f0fdf4] mb-2">{mod.title}</h3>
              <p className="text-[#94a3b8] text-sm mb-5 leading-relaxed">{mod.description}</p>
            </div>
            <Link
              href={mod.href}
              className={`inline-flex items-center justify-center py-2.5 px-4 text-white rounded-xl text-xs font-semibold transition ${
                mod.tone === 'amber'
                  ? 'bg-amber-600 hover:bg-amber-500'
                  : 'bg-emerald-600 hover:bg-emerald-500'
              }`}
            >
              {mod.buttonText}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
