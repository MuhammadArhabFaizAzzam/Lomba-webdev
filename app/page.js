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
    <div className="dashboard-wrap text-slate-100">
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
