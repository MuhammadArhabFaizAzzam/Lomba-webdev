'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  DollarSign,
  PackageCheck,
  Plus,
  ShoppingCart,
  Warehouse,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { formatRupiah } from './utils/formatCurrency';

const chartLineData = [
  { day: 'Sen', value: 1200000 },
  { day: 'Sel', value: 1800000 },
  { day: 'Rab', value: 1450000 },
  { day: 'Kam', value: 2250000 },
  { day: 'Jum', value: 2100000 },
  { day: 'Sab', value: 2600000 },
  { day: 'Min', value: 2300000 },
];

const paymentData = [
  { name: 'QRIS', value: 64 },
  { name: 'Cash', value: 36 },
];

const categoryData = [
  { name: 'Minuman', value: 36 },
  { name: 'Makanan', value: 28 },
  { name: 'Cemilan', value: 22 },
  { name: 'Lainnya', value: 14 },
];

const COLORS = ['#8B5CF6', '#5EEAD4', '#60A5FA', '#FBBF24'];

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalTransactions: 0,
    totalProducts: 0,
    lowStockCount: 0,
  });
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  useEffect(() => {
    const savedProducts = localStorage.getItem('zenith_products') || localStorage.getItem('umkm_products');
    const savedTransactions = localStorage.getItem('zenith_transactions') || localStorage.getItem('umkm_transactions');

    const products = savedProducts ? JSON.parse(savedProducts) : [];
    const transactions = savedTransactions ? JSON.parse(savedTransactions) : [];

    const totalRevenue = transactions.reduce((sum, curr) => sum + Number(curr.total || 0), 0);
    const lowStockCount = products.filter((product) => Number(product.stock || 0) <= 5).length;

    setStats({
      totalRevenue,
      totalTransactions: transactions.length,
      totalProducts: products.length,
      lowStockCount,
    });
  }, []);

  const metrics = [
    { label: 'Total Pendapatan', value: formatRupiah(stats.totalRevenue), trend: '+12.4%', icon: DollarSign, tone: 'primary' },
    { label: 'Total Transaksi', value: String(stats.totalTransactions), trend: '+8.1%', icon: BarChart3, tone: 'secondary' },
    { label: 'Produk Stok Rendah', value: String(stats.lowStockCount), trend: '-2.3%', icon: Warehouse, tone: 'warning' },
    { label: 'Produk Aktif', value: String(stats.totalProducts), trend: '+5.8%', icon: PackageCheck, tone: 'danger' },
  ];

  const quickActions = [
    { label: 'Buka Kasir', value: '3 menit terakhir', icon: ShoppingCart },
    { label: 'Stok Menipis', value: '6 item butuh cek', icon: Warehouse },
    { label: 'Laporan Harian', value: 'Ready to export', icon: BarChart3 },
  ];

  const handleResetData = () => {
    if (confirm('Yakin ingin mereset seluruh data ke kondisi awal (0)?')) {
      localStorage.removeItem('zenith_products');
      localStorage.removeItem('umkm_products');
      localStorage.removeItem('zenith_transactions');
      localStorage.removeItem('umkm_transactions');
      window.location.reload();
    }
  };

  return (
    <div className="dashboard-wrap">
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl text-sm font-semibold border border-slate-700 animate-bounce">
          {toastMessage}
        </div>
      )}

      <div className="dashboard-hero">
        <div className="hero-copy">
          <span className="eyebrow">Zenith POS Analytics Hub</span>
          <h2>Dashboard Performa Bisnis</h2>
          <p>Sistem operasional kasir dan manajemen inventaris real-time untuk mendukung performa bisnis retail Anda.</p>
        </div>

        <div className="hero-actions">
          <button className="btn-secondary" type="button" onClick={handleResetData}>
            <Plus size={15} />
            Reset data
          </button>
          <Link href="/pos" className="btn-primary">
            <ShoppingCart size={15} />
            Buka Kasir
          </Link>
        </div>
      </div>

<<<<<<< HEAD
      <div className="metric-grid">
        {metrics.map(({ label, value, trend, icon: Icon, tone }) => (
          <div key={label} className={`metric-card ${tone}`}>
            <div className="card-header">
              <span className="metric-label">{label}</span>
              <span className="metric-icon"><Icon size={18} /></span>
=======
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
        <div className="h-48 lg:h-56 flex items-end justify-between gap-2 pt-6 px-2 border-b border-slate-100">
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
>>>>>>> ace681d7ed129e49a4af4dc75983e4dbc153218c
            </div>

            <p className="metric-value">{value}</p>

            <div className="metric-trend">
              {trend.startsWith('-') ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
              {trend}
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-main">
        <div className="summary-panel">
          <div className="panel-head">
            <h3 className="panel-title">Trend Penjualan</h3>
            <button className="pill-button" type="button">7 Hari</button>
          </div>

          <div className="summary-figure">
            <strong>{formatRupiah(stats.totalRevenue)}</strong>
            <span>+12.4%</span>
          </div>

          <div style={{ width: '100%', height: 210 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartLineData}>
                <CartesianGrid stroke="rgba(148, 163, 184, 0.15)" vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                <Line type="monotone" dataKey="value" stroke="#8B5CF6" strokeWidth={3} dot={{ r: 4, fill: '#5EEAD4' }} activeDot={{ r: 6, fill: '#5EEAD4' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="summary-actions">
            <Link href="/transactions" className="btn-secondary">Lihat laporan</Link>
            <button className="btn-primary" type="button">Ekspor data</button>
          </div>
        </div>

        <div className="quick-panel">
          <div className="panel-head">
            <h3 className="panel-title">Aksi Cepat</h3>
          </div>

          {quickActions.map(({ label, value, icon: Icon }) => (
            <div key={label} className="quick-card">
              <div className="quick-meta">
                <span className="quick-badge"><Icon size={16} /></span>
                <div>
                  <div style={{ fontWeight: 700 }}>{label}</div>
                  <div className="quick-value">{value}</div>
                </div>
              </div>
              <ArrowUpRight size={14} color="var(--text-tertiary)" />
            </div>
          ))}
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-label-row">
            <span className="stat-label">Omzet Hari Ini</span>
            <span className="metric-trend"><ArrowUpRight size={12} />12.4%</span>
          </div>
          <p className="stat-value">{formatRupiah(stats.totalRevenue * 0.42)}</p>
        </div>

        <div className="stat-box">
          <div className="stat-label-row">
            <span className="stat-label">Rata-rata Trx</span>
            <span className="metric-trend"><ArrowUpRight size={12} />8.1%</span>
          </div>
          <p className="stat-value">{formatRupiah(stats.totalRevenue / Math.max(stats.totalTransactions, 1))}</p>
        </div>

        <div className="stat-box">
          <div className="stat-label-row">
            <span className="stat-label">Kategori Terlaris</span>
            <span className="metric-trend"><ArrowUpRight size={12} />36%</span>
          </div>
          <p className="stat-value">Minuman</p>
        </div>

        <div className="stat-box">
          <div className="stat-label-row">
            <span className="stat-label">Turnover Stok</span>
            <span className="metric-trend"><ArrowDownRight size={12} />2.3%</span>
          </div>
          <p className="stat-value">68%</p>
        </div>
      </div>

      <div className="stats-grid" style={{ marginTop: 8 }}>
        <div className="chart-card" style={{ padding: 18 }}>
          <div className="panel-head" style={{ marginBottom: 10 }}>
            <h3 className="panel-title">Metode Pembayaran</h3>
          </div>
          <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={paymentData}>
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#CBD5E1', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {paymentData.map((entry, index) => (
                    <Cell key={entry.name} fill={index === 0 ? '#8B5CF6' : '#5EEAD4'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card" style={{ padding: 18 }}>
          <div className="panel-head" style={{ marginBottom: 10 }}>
            <h3 className="panel-title">Kategori Produk</h3>
          </div>
          <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={44} outerRadius={66} paddingAngle={4}>
                  {categoryData.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
