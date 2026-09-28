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
import { normalizeProduct, normalizeTransaction, readStoredArray, removeStoredArray } from './utils/storage';

const COLORS = ['#8B5CF6', '#5EEAD4', '#60A5FA', '#FBBF24'];

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalTransactions: 0,
    totalProducts: 0,
    lowStockCount: 0,
    todayRevenue: 0,
    averageTransaction: 0,
    topCategory: '-',
  });
  const [toastMessage, setToastMessage] = useState('');
  const [chartData, setChartData] = useState([]);
  const [paymentMix, setPaymentMix] = useState([]);
  const [categoryMix, setCategoryMix] = useState([]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  useEffect(() => {
    const products = readStoredArray('products').map(normalizeProduct);
    const transactions = readStoredArray('transactions').map(normalizeTransaction);

    const totalRevenue = transactions.reduce((sum, curr) => sum + Number(curr.total || 0), 0);
    const lowStockCount = products.filter((product) => Number(product.stock || 0) <= 5).length;
    const today = new Date().toDateString();
    const todayRevenue = transactions
      .filter((transaction) => new Date(transaction.createdAt || transaction.date).toDateString() === today)
      .reduce((sum, transaction) => sum + Number(transaction.total || 0), 0);
    const paymentCounts = transactions.reduce((result, transaction) => {
      result[transaction.payment] = (result[transaction.payment] || 0) + 1;
      return result;
    }, {});
    const categoryCounts = transactions.flatMap((transaction) => transaction.items).reduce((result, item) => {
      const category = products.find((product) => product.id === item.id)?.category || 'Lainnya';
      result[category] = (result[category] || 0) + Number(item.qty || 0);
      return result;
    }, {});
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (6 - index));
      return date;
    });
    setChartData(days.map((day) => ({
      day: day.toLocaleDateString('id-ID', { weekday: 'short' }),
      value: transactions
        .filter((transaction) => new Date(transaction.createdAt || transaction.date).toDateString() === day.toDateString())
        .reduce((sum, transaction) => sum + Number(transaction.total || 0), 0),
    })));
    setPaymentMix(Object.entries(paymentCounts).map(([name, value]) => ({ name, value })));
    setCategoryMix(Object.entries(categoryCounts).map(([name, value]) => ({ name, value })));

    setStats({
      totalRevenue,
      totalTransactions: transactions.length,
      totalProducts: products.length,
      lowStockCount,
      todayRevenue,
      averageTransaction: totalRevenue / Math.max(transactions.length, 1),
      topCategory: Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '-',
    });
  }, []);

  const metrics = [
    { label: 'Total Pendapatan', value: formatRupiah(stats.totalRevenue), trend: 'Aktual', icon: DollarSign, tone: 'primary' },
    { label: 'Total Transaksi', value: String(stats.totalTransactions), trend: 'Aktual', icon: BarChart3, tone: 'secondary' },
    { label: 'Produk Stok Rendah', value: String(stats.lowStockCount), trend: 'Perlu cek', icon: Warehouse, tone: 'warning' },
    { label: 'Produk Aktif', value: String(stats.totalProducts), trend: 'Tersimpan', icon: PackageCheck, tone: 'danger' },
  ];

  const quickActions = [
    { label: 'Buka Kasir', value: 'Mulai transaksi baru', icon: ShoppingCart },
    { label: 'Stok Menipis', value: `${stats.lowStockCount} item perlu cek`, icon: Warehouse },
    { label: 'Laporan Harian', value: `${stats.totalTransactions} transaksi tercatat`, icon: BarChart3 },
  ];

  const handleResetData = () => {
    if (confirm('Yakin ingin mereset seluruh data ke kondisi awal (0)?')) {
      removeStoredArray('products');
      removeStoredArray('transactions');
      window.location.reload();
    }
  };

  return (
    <div className="dashboard-wrap text-slate-100">
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl text-sm font-semibold border border-slate-700 animate-bounce">
          {toastMessage}
        </div>
      )}

      {stats.lowStockCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-3">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="font-bold text-sm">Perhatian: {stats.lowStockCount} Produk Menipis/Habis!</p>
              <p className="text-xs text-amber-200/80">Segera lakukan restock barang di menu Manajemen Stok agar operasional kasir tidak terganggu.</p>
            </div>
          </div>
          <Link href="/inventory" className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition shadow-md">
            Cek Inventaris &rarr;
          </Link>
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

      <div className="metric-grid">
        {metrics.map(({ label, value, trend, icon: Icon, tone }) => (
          <div key={label} className={`metric-card ${tone}`}>
            <div className="card-header">
              <span className="metric-label">{label}</span>
              <span className="metric-icon"><Icon size={18} /></span>
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
            <span>{stats.totalTransactions ? 'Data aktual' : 'Belum ada data'}</span>
          </div>

          <div style={{ width: '100%', height: 210 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
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
            <span className="metric-trend"><ArrowUpRight size={12} />{stats.todayRevenue ? 'Aktual' : '-'}</span>
          </div>
          <p className="stat-value">{formatRupiah(stats.todayRevenue)}</p>
        </div>

        <div className="stat-box">
          <div className="stat-label-row">
            <span className="stat-label">Rata-rata Trx</span>
            <span className="metric-trend"><ArrowUpRight size={12} />Aktual</span>
          </div>
          <p className="stat-value">{formatRupiah(stats.averageTransaction)}</p>
        </div>

        <div className="stat-box">
          <div className="stat-label-row">
            <span className="stat-label">Kategori Terlaris</span>
            <span className="metric-trend"><ArrowUpRight size={12} />Terlaris</span>
          </div>
          <p className="stat-value">{stats.topCategory}</p>
        </div>

        <div className="stat-box">
          <div className="stat-label-row">
            <span className="stat-label">Turnover Stok</span>
            <span className="metric-trend"><ArrowDownRight size={12} />Demo</span>
          </div>
          <p className="stat-value">-</p>
        </div>
      </div>

      <div className="stats-grid" style={{ marginTop: 8 }}>
        <div className="chart-card" style={{ padding: 18 }}>
          <div className="panel-head" style={{ marginBottom: 10 }}>
            <h3 className="panel-title">Metode Pembayaran</h3>
          </div>
          <div style={{ width: '100%', height: 200 }}>
            {paymentMix.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs text-center p-4">
                <span className="font-semibold text-slate-300">Belum ada data pembayaran</span>
                <span className="text-[11px] text-slate-500 mt-1">Grafik akan otomatis terisi saat ada transaksi kasir</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={paymentMix}>
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#CBD5E1', fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {paymentMix.map((entry, index) => (
                      <Cell key={entry.name} fill={index === 0 ? '#8B5CF6' : '#5EEAD4'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="chart-card" style={{ padding: 18 }}>
          <div className="panel-head" style={{ marginBottom: 10 }}>
            <h3 className="panel-title">Kategori Produk</h3>
          </div>
          <div style={{ width: '100%', height: 200 }}>
            {categoryMix.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs text-center p-4">
                <span className="font-semibold text-slate-300">Belum ada kategori terjual</span>
                <span className="text-[11px] text-slate-500 mt-1">Diagram lingkaran akan terbentuk setelah transaksi pertama</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryMix} dataKey="value" nameKey="name" innerRadius={44} outerRadius={66} paddingAngle={4}>
                    {categoryMix.map((entry, index) => (
                      <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
