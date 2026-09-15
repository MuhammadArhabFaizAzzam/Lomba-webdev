'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalTransactions: 0,
    totalProducts: 0,
    lowStockCount: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);

  useEffect(() => {
    // Load initial mock or localStorage data
    const savedProducts = localStorage.getItem('umkm_products');
    const savedTransactions = localStorage.getItem('umkm_transactions');

    const products = savedProducts ? JSON.parse(savedProducts) : [
      { id: 1, name: 'Kopi Susu Gula Aren (Cup)', category: 'Minuman', price: 18000, stock: 45 },
      { id: 2, name: 'Roti Bakar Special Keju', category: 'Makanan', price: 25000, stock: 4 },
      { id: 3, name: 'Nasi Goreng Rempah UMKM', category: 'Makanan', price: 22000, stock: 12 },
      { id: 4, name: 'Es Teh Manis Segar', category: 'Minuman', price: 5000, stock: 80 },
      { id: 5, name: 'Dimsum Ayam (isi 4)', category: 'Cemilan', price: 15000, stock: 3 },
    ];

    const transactions = savedTransactions ? JSON.parse(savedTransactions) : [
      { id: 'TRX-1003', date: '2026-09-15 10:30', items: 'Kopi Susu (2), Roti Bakar (1)', total: 61000, payment: 'QRIS' },
      { id: 'TRX-1002', date: '2026-09-15 09:15', items: 'Nasi Goreng (1), Es Teh (2)', total: 32000, payment: 'Tunai' },
      { id: 'TRX-1001', date: '2026-09-14 19:45', items: 'Dimsum (3)', total: 45000, payment: 'Transfer' },
    ];

    if (!savedProducts) localStorage.setItem('umkm_products', JSON.stringify(products));
    if (!savedTransactions) localStorage.setItem('umkm_transactions', JSON.stringify(transactions));

    // Calculate metrics
    const rev = transactions.reduce((acc, curr) => acc + curr.total, 0);
    const lowStock = products.filter(p => p.stock <= 5);

    setStats({
      totalRevenue: rev,
      totalTransactions: transactions.length,
      totalProducts: products.length,
      lowStockCount: lowStock.length,
    });

    setRecentTransactions(transactions.slice(0, 5));
    setLowStockItems(lowStock);
  }, []);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="bg-blue-500/30 text-blue-100 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            Transformasi Digital UMKM
          </span>
          <h2 className="text-2xl md:text-3xl font-bold mt-2">Selamat Datang di UMKM-Pro 🚀</h2>
          <p className="text-blue-100 text-sm md:text-base mt-1 max-w-xl">
            Solusi cerdas sistem operasional bisnis, kasir (POS), dan manajemen inventaris untuk meningkatkan produktivitas usaha Anda.
          </p>
        </div>
        <div className="flex space-x-3">
          <Link
            href="/pos"
            className="bg-white text-blue-700 font-semibold px-5 py-3 rounded-xl shadow-md hover:bg-blue-50 transition duration-200 text-sm flex items-center space-x-2"
          >
            <span>🛒 Buka Kasir</span>
          </Link>
          <Link
            href="/inventory"
            className="bg-blue-800/60 text-white font-semibold px-5 py-3 rounded-xl border border-blue-400/30 hover:bg-blue-800 transition duration-200 text-sm flex items-center space-x-2"
          >
            <span>📦 Kelola Stok</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Pendapatan</p>
            <h3 className="text-2xl font-extrabold text-slate-800 mt-1">{formatRupiah(stats.totalRevenue)}</h3>
            <span className="text-xs text-emerald-600 font-medium mt-1 inline-block">↑ 12% dari kemarin</span>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl">
            💰
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Transaksi</p>
            <h3 className="text-2xl font-extrabold text-slate-800 mt-1">{stats.totalTransactions} Transaksi</h3>
            <span className="text-xs text-blue-600 font-medium mt-1 inline-block">Terverifikasi sistem</span>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl">
            🧾
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Jenis Produk</p>
            <h3 className="text-2xl font-extrabold text-slate-800 mt-1">{stats.totalProducts} Produk</h3>
            <span className="text-xs text-slate-500 font-medium mt-1 inline-block">Aktif di etalase</span>
          </div>
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl">
            🏷️
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Peringatan Stok Menipis</p>
            <h3 className={`text-2xl font-extrabold mt-1 ${stats.lowStockCount > 0 ? 'text-amber-600' : 'text-slate-800'}`}>
              {stats.lowStockCount} Produk
            </h3>
            <span className="text-xs text-amber-600 font-medium mt-1 inline-block">Perlu restock segera</span>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center text-2xl">
            ⚠️
          </div>
        </div>
      </div>

      {/* Grid for Alerts & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">Transaksi Penjualan Terbaru</h3>
            <Link href="/pos" className="text-xs font-semibold text-blue-600 hover:underline">
              Buka Kasir POS →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 font-semibold">ID TRX</th>
                  <th className="pb-3 font-semibold">Waktu</th>
                  <th className="pb-3 font-semibold">Detail Item</th>
                  <th className="pb-3 font-semibold">Metode</th>
                  <th className="pb-3 font-semibold text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 font-semibold text-blue-600">{tx.id}</td>
                    <td className="py-3 text-slate-500 text-xs">{tx.date}</td>
                    <td className="py-3 text-slate-700">{tx.items}</td>
                    <td className="py-3">
                      <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                        {tx.payment}
                      </span>
                    </td>
                    <td className="py-3 text-right font-bold text-slate-800">{formatRupiah(tx.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Warning Box */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800">Stok Menipis (⚠️)</h3>
              <Link href="/inventory" className="text-xs font-semibold text-blue-600 hover:underline">
                Kelola Stok →
              </Link>
            </div>
            <p className="text-xs text-slate-500 mb-4">Produk berikut memiliki sisa stok kurang dari atau sama dengan 5 unit.</p>
            
            {lowStockItems.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm">
                ✅ Semua stok produk aman!
              </div>
            ) : (
              <div className="space-y-3">
                {lowStockItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-amber-50/60 border border-amber-200/60 rounded-xl">
                    <div>
                      <h4 className="font-semibold text-slate-800 text-sm">{item.name}</h4>
                      <span className="text-xs text-slate-500">{item.category}</span>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2.5 py-1 bg-amber-100 text-amber-800 font-bold text-xs rounded-lg">
                        Sisa: {item.stock}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <Link
              href="/inventory"
              className="w-full block py-2.5 px-4 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition"
            >
              Tambah Stok Produk
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
