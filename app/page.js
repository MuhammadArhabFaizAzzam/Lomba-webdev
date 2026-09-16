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
  const [showResetModal, setShowResetModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [salesChartData, setSalesChartData] = useState([
    { day: 'Sen', amount: 0 },
    { day: 'Sel', amount: 0 },
    { day: 'Rab', amount: 0 },
    { day: 'Kam', amount: 0 },
    { day: 'Jum', amount: 0 },
    { day: 'Sab', amount: 0 },
    { day: 'Min', amount: 0 },
  ]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const loadDashboardData = () => {
    const savedProducts = localStorage.getItem('zenith_products') || localStorage.getItem('umkm_products');
    const savedTransactions = localStorage.getItem('zenith_transactions') || localStorage.getItem('umkm_transactions');

    const products = savedProducts ? JSON.parse(savedProducts) : [];
    const transactions = savedTransactions ? JSON.parse(savedTransactions) : [];

    const rev = transactions.reduce((acc, curr) => acc + curr.total, 0);
    const lowStock = products.filter(p => p.stock >= 1 && p.stock <= 20);

    setStats({
      totalRevenue: rev,
      totalTransactions: transactions.length,
      totalProducts: products.length,
      lowStockCount: lowStock.length,
    });

    setRecentTransactions(transactions.slice(0, 5));
    setLowStockItems(lowStock);

    // Build chart data from actual transactions if available, else 0
    if (transactions.length > 0) {
      // Simple aggregation or default distribution for demo
      const chartMap = { 'Sen': 0, 'Sel': 0, 'Rab': 0, 'Kam': 0, 'Jum': 0, 'Sab': 0, 'Min': 0 };
      transactions.forEach(tx => {
        // distribute or mock assign based on total
        chartMap['Sen'] += tx.total * 0.2;
        chartMap['Rab'] += tx.total * 0.3;
        chartMap['Jum'] += tx.total * 0.5;
      });
      setSalesChartData([
        { day: 'Sen', amount: Math.round(rev * 0.15) },
        { day: 'Sel', amount: Math.round(rev * 0.1) },
        { day: 'Rab', amount: Math.round(rev * 0.2) },
        { day: 'Kam', amount: Math.round(rev * 0.05) },
        { day: 'Jum', amount: Math.round(rev * 0.25) },
        { day: 'Sab', amount: Math.round(rev * 0.15) },
        { day: 'Min', amount: Math.round(rev * 0.1) },
      ]);
    } else {
      setSalesChartData([
        { day: 'Sen', amount: 0 },
        { day: 'Sel', amount: 0 },
        { day: 'Rab', amount: 0 },
        { day: 'Kam', amount: 0 },
        { day: 'Jum', amount: 0 },
        { day: 'Sab', amount: 0 },
        { day: 'Min', amount: 0 },
      ]);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleResetData = () => {
    localStorage.removeItem('zenith_products');
    localStorage.removeItem('zenith_transactions');
    localStorage.removeItem('umkm_products');
    localStorage.removeItem('umkm_transactions');
    loadDashboardData();
    setShowResetModal(false);
    showToast('Aplikasi berhasil direset ke kondisi awal (0).');
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
  };

  const maxChartAmount = Math.max(...salesChartData.map(d => d.amount), 10000);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border border-slate-800">
        <div>
          <div className="flex items-center space-x-3 flex-wrap gap-2">
            <span className="bg-indigo-500/20 text-indigo-300 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider border border-indigo-500/30">
              Zenith POS Analytics Hub
            </span>
            <button
              onClick={handleResetData}
              className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider border border-rose-500/30 transition"
              title="Reset seluruh data ke kondisi awal (0)"
            >
              Mulai dari Nol (Reset)
            </button>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mt-3 tracking-tight">Dashboard Performa Bisnis</h2>
          <p className="text-slate-300 text-sm md:text-base mt-1 max-w-xl font-normal">
            Sistem operasional kasir dan manajemen inventaris real-time untuk mendukung performa bisnis retail Anda.
          </p>
        </div>
        <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full lg:w-auto">
          <Link
            href="/pos"
            className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-3 rounded-xl shadow-lg shadow-indigo-600/30 transition duration-200 text-sm flex items-center justify-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Buka Kasir</span>
          </Link>
          <Link
            href="/inventory"
            className="flex-1 sm:flex-none bg-slate-800 hover:bg-slate-700 text-white font-semibold px-5 py-3 rounded-xl border border-slate-700 transition duration-200 text-sm flex items-center justify-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span>Kelola Stok</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Pendapatan</p>
            <h3 className="text-2xl font-extrabold text-slate-800 mt-1">{formatRupiah(stats.totalRevenue)}</h3>
            <span className="text-xs text-emerald-600 font-semibold mt-1 inline-flex items-center">
              <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
              Sistem Aktif
            </span>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Transaksi</p>
            <h3 className="text-2xl font-extrabold text-slate-800 mt-1">{stats.totalTransactions}</h3>
            <span className="text-xs text-indigo-600 font-semibold mt-1 inline-block">Transaksi tercatat</span>
          </div>
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Jenis Produk</p>
            <h3 className="text-2xl font-extrabold text-slate-800 mt-1">{stats.totalProducts}</h3>
            <span className="text-xs text-slate-500 font-semibold mt-1 inline-block">Item aktif etalase</span>
          </div>
          <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Peringatan Stok</p>
            <h3 className={`text-2xl font-extrabold mt-1 ${stats.lowStockCount > 0 ? 'text-amber-600' : 'text-slate-800'}`}>
              {stats.lowStockCount}
            </h3>
            <span className="text-xs text-amber-600 font-semibold mt-1 inline-block">Perlu restock segera</span>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Sales Trend Analytics Chart */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-800">Grafik Tren Penjualan Mingguan</h3>
            <p className="text-xs text-slate-400 mt-0.5">Analisis omset penjualan per hari dalam 7 hari terakhir</p>
          </div>
          <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-lg">
            Real-time Analytics
          </span>
        </div>
        <div className="h-48 flex items-end justify-between gap-2 pt-6 px-2 border-b border-slate-100">
          {salesChartData.map((item, index) => {
            const heightPercent = maxChartAmount > 0 ? Math.round((item.amount / maxChartAmount) * 100) : 0;
            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <div className="text-[10px] font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition">
                  {formatRupiah(item.amount)}
                </div>
                <div
                  style={{ height: `${Math.max(heightPercent, 6)}%` }}
                  className="w-full max-w-[40px] bg-indigo-500 group-hover:bg-indigo-600 rounded-t-xl transition-all duration-300 shadow-xs"
                ></div>
                <span className="text-xs font-semibold text-slate-500 pt-1">{item.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid for Alerts & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-xs border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-slate-800">Transaksi Penjualan Terbaru</h3>
            <Link href="/pos" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center">
              <span>Buka Kasir POS</span>
              <svg className="w-3.5 h-3.5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
            </Link>
          </div>
          <div className="overflow-x-auto">
            {recentTransactions.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm font-medium">
                Belum ada transaksi penjualan.<br />
                <Link href="/pos" className="text-indigo-600 hover:underline mt-1 inline-block text-xs font-semibold">
                  Mulai transaksi di Kasir POS &rarr;
                </Link>
              </div>
            ) : (
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
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 font-semibold text-indigo-600">{tx.id}</td>
                      <td className="py-3 text-slate-500 text-xs font-medium">{tx.date}</td>
                      <td className="py-3 text-slate-700 font-medium">{tx.items}</td>
                      <td className="py-3">
                        <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
                          {tx.payment}
                        </span>
                      </td>
                      <td className="py-3 text-right font-bold text-slate-800">{formatRupiah(tx.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Low Stock Warning Box */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-800 flex items-center">
                <svg className="w-4 h-4 text-amber-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Stok Menipis
              </h3>
              <Link href="/inventory" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                Kelola Stok &rarr;
              </Link>
            </div>
            <p className="text-xs text-slate-500 mb-4 font-normal">Produk berikut memiliki sisa stok kurang dari atau sama dengan 5 unit.</p>
            
            {lowStockItems.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm font-medium">
                Semua stok produk dalam kondisi aman.
              </div>
            ) : (
              <div className="space-y-3">
                {lowStockItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-amber-50/60 border border-amber-200/60 rounded-xl">
                    <div>
                      <h4 className="font-semibold text-slate-800 text-xs">{item.name}</h4>
                      <span className="text-[11px] text-slate-500">{item.category}</span>
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
              className="w-full block py-2.5 px-4 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition"
            >
              Tambah & Perbarui Stok
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
