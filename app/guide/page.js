'use client';

import Link from 'next/link';

export default function GuidePage() {
  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto py-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-xl border border-slate-800">
        <span className="bg-indigo-500/30 text-indigo-200 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
          Panduan Evaluasi Juri
        </span>
        <h2 className="text-2xl md:text-3xl font-bold mt-2">Panduan Penggunaan & Fitur UMKM-Pro 📖</h2>
        <p className="text-slate-300 text-sm md:text-base mt-2">
          Dokumentasi singkat alur pengujian aplikasi untuk memudahkan dewan juri mengeksplorasi seluruh fitur transformasi digital UMKM.
        </p>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Step 1 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-lg mb-4">
              1
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Manajemen Stok & Produk</h3>
            <p className="text-slate-600 text-sm mb-4">
              Mulai dengan mengecek ketersediaan barang. Anda dapat menambah produk baru, mengubah harga, atau menyesuaikan stok (tambah/kurang unit). Tersedia juga tombol <strong className="text-slate-800">Reset Data Demo</strong> jika ingin mengembalikan data ke kondisi awal.
            </p>
          </div>
          <Link
            href="/inventory"
            className="inline-flex items-center justify-center py-2.5 px-4 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-indigo-600 transition"
          >
            Buka Manajemen Stok &rarr;
          </Link>
        </div>

        {/* Step 2 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 font-bold flex items-center justify-center text-lg mb-4">
              2
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Kasir Point of Sale (POS)</h3>
            <p className="text-slate-600 text-sm mb-4">
              Simulasikan transaksi penjualan langsung. Pilih produk dari katalog, atur jumlah di keranjang, pilih metode pembayaran (QRIS/Tunai/Transfer), dan proses pembayaran. Sistem akan <strong className="text-slate-800">otomatis mencetak struk belanja</strong> dan memotong stok gudang.
            </p>
          </div>
          <Link
            href="/pos"
            className="inline-flex items-center justify-center py-2.5 px-4 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-500 transition"
          >
            Buka Kasir POS &rarr;
          </Link>
        </div>

        {/* Step 3 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 font-bold flex items-center justify-center text-lg mb-4">
              3
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Riwayat & Export Laporan</h3>
            <p className="text-slate-600 text-sm mb-4">
              Semua transaksi yang berhasil di kasir akan terekam otomatis di menu Riwayat Transaksi. Juri dapat menguji fitur <strong className="text-slate-800">Export CSV</strong> untuk mendownload laporan pembukuan ke format Excel.
            </p>
          </div>
          <Link
            href="/transactions"
            className="inline-flex items-center justify-center py-2.5 px-4 bg-sky-600 text-white rounded-xl text-xs font-semibold hover:bg-sky-500 transition"
          >
            Buka Riwayat Transaksi &rarr;
          </Link>
        </div>

        {/* Step 4 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 font-bold flex items-center justify-center text-lg mb-4">
              4
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Dashboard Bisnis</h3>
            <p className="text-slate-600 text-sm mb-4">
              Pusat monitoring performa bisnis secara real-time. Menampilkan total pendapatan, jumlah transaksi, ringkasan produk terlaris, dan <strong className="text-slate-800">peringatan otomatis stok menipis (⚠️)</strong>.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center py-2.5 px-4 bg-amber-600 text-white rounded-xl text-xs font-semibold hover:bg-amber-500 transition"
          >
            Buka Dashboard &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
