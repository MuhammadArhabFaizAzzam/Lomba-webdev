'use client';

import { useEffect, useState, useMemo } from 'react';
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
  TrendingUp,
  Clock,
  ShieldCheck,
  Tag,
  AlertTriangle,
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
  Tooltip,
  Legend,
  LabelList,
} from 'recharts';
import { formatRupiah } from './utils/formatCurrency';
import { LOW_STOCK_MAX, ensureInitialCatalog, normalizeProduct, normalizeTransaction, readStoredArray, removeStoredArray, transactionGrossProfit } from './utils/storage';

const COLORS = ['#10B981', '#38BDF8', '#34D399', '#FBBF24', '#F87171'];

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl text-xs text-white">
        <p className="font-bold text-emerald-400 mb-1">{data.date} ({data.day})</p>
        <p className="text-slate-200">Omzet: <span className="font-bold text-emerald-400">{formatRupiah(data.value)}</span></p>
        <p className="text-slate-300">Transaksi: <span className="font-bold">{data.count}x</span></p>
      </div>
    );
  }
  return null;
}

function useAnimatedNumber(target, duration = 620) {
  const [displayValue, setDisplayValue] = useState(target);

  useEffect(() => {
    const endValue = Number(target || 0);
    if (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ) {
      setDisplayValue(endValue);
      return;
    }

    let rafId = null;
    const startValue = Number(displayValue || 0);
    if (startValue === endValue) return;
    const startTime = performance.now();

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.round(startValue + (endValue - startValue) * eased);
      setDisplayValue(current);
      if (progress < 1) {
        rafId = window.requestAnimationFrame(step);
      }
    };

    rafId = window.requestAnimationFrame(step);
    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [target, duration]);

  return displayValue;
}

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [activeShift, setActiveShift] = useState(null);
  const [timeRange, setTimeRange] = useState('7days'); // 'today' | '7days' | '30days' | 'all'
  const [toastMessage, setToastMessage] = useState('');
  const [dailyTarget, setDailyTarget] = useState(1500000);
  const [editingTarget, setEditingTarget] = useState(false);
  const [targetInput, setTargetInput] = useState('1500000');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  useEffect(() => {
    const authUser = localStorage.getItem('zenith_auth_user');
    if (authUser) {
      try {
        setCurrentUser(JSON.parse(authUser));
      } catch {
        setCurrentUser(null);
      }
    }

    const loadedProducts = ensureInitialCatalog();
    const loadedTransactions = readStoredArray('transactions').map(normalizeTransaction);
    setProducts(loadedProducts);
    setTransactions(loadedTransactions);

    const savedTarget = Number(localStorage.getItem('zenith_daily_target'));
    if (Number.isFinite(savedTarget) && savedTarget > 0) {
      setDailyTarget(savedTarget);
      setTargetInput(String(savedTarget));
    }

    const savedShift = localStorage.getItem('zenith_active_shift');
    if (savedShift) {
      try {
        setActiveShift(JSON.parse(savedShift));
      } catch {
        setActiveShift(null);
      }
    }
  }, []);

  const isAdmin = currentUser?.role === 'management';

  // Filtered transactions based on timeRange
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    now.setHours(23, 59, 59, 999);

    if (timeRange === 'today') {
      const todayStr = new Date().toDateString();
      return transactions.filter(tx => new Date(tx.createdAt || tx.date).toDateString() === todayStr);
    }
    if (timeRange === '7days') {
      const limit = new Date();
      limit.setDate(limit.getDate() - 7);
      return transactions.filter(tx => new Date(tx.createdAt || tx.date) >= limit);
    }
    if (timeRange === '30days') {
      const limit = new Date();
      limit.setDate(limit.getDate() - 30);
      return transactions.filter(tx => new Date(tx.createdAt || tx.date) >= limit);
    }
    return transactions;
  }, [transactions, timeRange]);

  const salesTransactions = useMemo(
    () => filteredTransactions.filter((tx) => tx.status !== 'Retur'),
    [filteredTransactions],
  );

  // Analytics Calculations
  const totalRevenue = useMemo(() => salesTransactions.reduce((sum, tx) => sum + Number(tx.total || 0), 0), [salesTransactions]);
  const totalTransactionsCount = salesTransactions.length;
  const averageTransaction = totalTransactionsCount > 0 ? totalRevenue / totalTransactionsCount : 0;

  const todayStr = new Date().toDateString();
  const todayRevenue = useMemo(() => transactions
    .filter(tx => tx.status !== 'Retur' && new Date(tx.createdAt || tx.date).toDateString() === todayStr)
    .reduce((sum, tx) => sum + Number(tx.total || 0), 0), [transactions, todayStr]);

  const lowStockCount = useMemo(() => products.filter(p => Number(p.stock || 0) <= LOW_STOCK_MAX).length, [products]);
  const totalProductsCount = products.length;

  const grossProfit = useMemo(
    () => salesTransactions.reduce((sum, tx) => sum + transactionGrossProfit(tx, products), 0),
    [salesTransactions, products],
  );

  // Top Selling Products
  const topSellingProducts = useMemo(() => {
    const map = {};
    salesTransactions.forEach(tx => {
      if (Array.isArray(tx.items)) {
        tx.items.forEach(item => {
          const key = item.name || 'Produk';
          if (!map[key]) {
            map[key] = { name: key, qty: 0, revenue: 0 };
          }
          map[key].qty += Number(item.qty || 0);
          map[key].revenue += Number(item.price || 0) * Number(item.qty || 0);
        });
      }
    });
    return Object.values(map).sort((a, b) => b.qty - a.qty).slice(0, 5);
  }, [salesTransactions]);

  // Stock Turnover Ratio Calculation
  const stockTurnover = useMemo(() => {
    const totalSold = salesTransactions.flatMap(tx => tx.items || []).reduce((sum, i) => sum + Number(i.qty || 0), 0);
    const totalStock = products.reduce((sum, p) => sum + Number(p.stock || 0), 0);
    if (totalStock === 0 && totalSold === 0) return '0.0x';
    const ratio = (totalSold / Math.max(totalStock, 1)).toFixed(1);
    return `${ratio}x`;
  }, [salesTransactions, products]);

  // Payment Mix
  const paymentMix = useMemo(() => {
    const counts = salesTransactions.reduce((acc, tx) => {
      const method = tx.payment || 'QRIS';
      acc[method] = (acc[method] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [salesTransactions]);

  // Category Mix
  const categoryMix = useMemo(() => {
    const counts = salesTransactions.flatMap(tx => tx.items || []).reduce((acc, item) => {
      const prod = products.find(p => p.id === item.id || p.name === item.name);
      const cat = prod?.category || 'Lainnya';
      acc[cat] = (acc[cat] || 0) + Number(item.qty || 0);
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [salesTransactions, products]);

  // Chart Data (7 days or daily breakdown for selected range)
  const chartData = useMemo(() => {
    const daysCount = timeRange === '30days' ? 30 : 7;
    const days = Array.from({ length: daysCount }, (_, index) => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (daysCount - 1 - index));
      return date;
    });

    return days.map((day) => {
      const dayStr = day.toDateString();
      const dayTxs = transactions.filter(tx => tx.status !== 'Retur' && new Date(tx.createdAt || tx.date).toDateString() === dayStr);
      const value = dayTxs.reduce((sum, tx) => sum + Number(tx.total || 0), 0);
      return {
        date: day.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
        day: day.toLocaleDateString('id-ID', { weekday: 'short' }),
        value,
        count: dayTxs.length,
      };
    });
  }, [transactions, timeRange]);

  const animatedRevenue = useAnimatedNumber(totalRevenue);
  const animatedTxCount = useAnimatedNumber(totalTransactionsCount);
  const animatedGrossProfit = useAnimatedNumber(grossProfit);
  const animatedTodayRevenue = useAnimatedNumber(todayRevenue);

  const dailyProgressPct = Math.min(
    100,
    Math.round((todayRevenue / Math.max(dailyTarget, 1)) * 100)
  );
  const grossMarginPct =
    totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100).toFixed(1) : '0.0';

  const handleSaveTarget = (e) => {
    e.preventDefault();
    const cleaned = Number(String(targetInput).replace(/\D/g, ''));
    if (cleaned > 0) {
      setDailyTarget(cleaned);
      localStorage.setItem('zenith_daily_target', String(cleaned));
      setEditingTarget(false);
      showToast(`Target omzet harian diperbarui ke ${formatRupiah(cleaned)}`);
    }
  };

  const metrics = [
    { label: 'Total Pendapatan', value: formatRupiah(animatedRevenue), trend: timeRange === 'today' ? 'Hari Ini' : timeRange === '7days' ? '7 Hari' : 'Semua', icon: DollarSign, tone: 'primary' },
    { label: 'Total Transaksi', value: String(animatedTxCount), trend: 'Aktual', icon: BarChart3, tone: 'secondary' },
    { label: 'Produk Stok Rendah', value: String(lowStockCount), trend: lowStockCount > 0 ? 'Perlu Restock' : 'Aman', icon: Warehouse, tone: 'warning' },
    { label: 'Laba Kotor', value: formatRupiah(animatedGrossProfit), trend: `Margin ${grossMarginPct}%`, icon: TrendingUp, tone: 'danger' },
  ];

  const quickActions = [
    { label: 'Buka Kasir', value: 'Mulai transaksi baru', icon: ShoppingCart, href: '/pos' },
    { label: 'Manajemen Stok', value: `${lowStockCount} item perlu restock`, icon: Warehouse, href: '/inventory?filter=low' },
    { label: 'Riwayat Transaksi', value: `${transactions.length} total tercatat`, icon: BarChart3, href: '/transactions' },
  ];

  const handleResetData = () => {
    if (confirm('Yakin ingin mereset seluruh data ke kondisi awal (0)?')) {
      localStorage.setItem('zenith_initialized', 'true');
      removeStoredArray('products');
      removeStoredArray('transactions');
      removeStoredArray('shift_history');
      removeStoredArray('kds_statuses');
      localStorage.removeItem('zenith_active_shift');
      setProducts([]);
      setTransactions([]);
      setActiveShift(null);
      showToast('Seluruh data berhasil direset ke 0.');
    }
  };

  return (
    <div className="dashboard-wrap text-slate-100">
      {toastMessage && (
        <div className="zenith-toast fixed top-5 right-5 z-50 bg-slate-900/95 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-2xl text-sm font-semibold border border-emerald-500/40">
          {toastMessage}
        </div>
      )}

      {/* Low Stock Alert Banner (Clickable) */}
      {lowStockCount > 0 && (
        <Link href="/inventory?filter=low" className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/35 text-amber-300 flex items-center justify-between shadow-lg hover:bg-amber-500/15 hover:-translate-y-0.5 transition-all duration-200 group">
          <div className="flex items-center space-x-3">
            <AlertTriangle size={22} className="text-amber-400 shrink-0 animate-pulse" />
            <div>
              <p className="font-bold text-sm">Perhatian: {lowStockCount} Produk Menipis/Habis!</p>
              <p className="text-xs text-amber-200/80">Klik di sini untuk segera lakukan restock barang di menu Manajemen Stok.</p>
            </div>
          </div>
          <span className="px-4 py-2 bg-amber-500 group-hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition shadow-md">
            Cek Inventaris &rarr;
          </span>
        </Link>
      )}

      {/* Active Shift Summary Banner */}
      {activeShift && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 flex flex-wrap items-center justify-between gap-3 shadow-md">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Clock size={18} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm text-white">Shift Kasir Aktif</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">ONLINE</span>
              </div>
              <p className="text-xs text-emerald-300">Mulai: {activeShift.startTime} | Kas Awal: {formatRupiah(activeShift.startingCash)} | Total Trx Shift: {activeShift.transactionsCount}x</p>
            </div>
          </div>
          <Link href="/pos" className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition">
            Buka Kasir &rarr;
          </Link>
        </div>
      )}

      {/* Hero Section */}
      <div className="dashboard-hero">
        <div className="hero-copy">
          <span className="eyebrow">Zenith POS · Business Overview</span>
          <h2>Ambil keputusan dari data toko hari ini.</h2>
          <p>Pantau omzet, transaksi, stok, dan laba kotor dari satu dashboard operasional yang mudah dipahami tim.</p>
        </div>

        <div className="hero-actions">
          {isAdmin && (
            <button className="btn-secondary" type="button" onClick={handleResetData} title="Reset seluruh data ke 0">
              <Plus size={15} />
              Reset Data
            </button>
          )}
          <Link href="/pos" className="btn-primary">
            <ShoppingCart size={15} />
            Buka Kasir
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
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

      {/* Daily Revenue Target & Profit Margin Progress Widget */}
      <div className="spotlight-card bg-[#11141B] border border-white/[0.08] rounded-2xl p-5 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-emerald-400 font-semibold">
                Target Operasional Harian
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                {dailyProgressPct}% Tercapai
              </span>
            </div>
            <div className="text-sm text-slate-300">
              Omzet Hari Ini:{' '}
              <strong className="text-white font-mono">{formatRupiah(animatedTodayRevenue)}</strong>{' '}
              dari target <strong className="text-slate-200 font-mono">{formatRupiah(dailyTarget)}</strong>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && !editingTarget && (
              <button
                type="button"
                onClick={() => {
                  setTargetInput(String(dailyTarget));
                  setEditingTarget(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition"
              >
                Atur Target Harian
              </button>
            )}
            {isAdmin && editingTarget && (
              <form onSubmit={handleSaveTarget} className="flex items-center gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  value={targetInput}
                  onChange={(e) => setTargetInput(e.target.value.replace(/\D/g, ''))}
                  className="w-36 bg-[#0B0D11] border border-white/15 rounded-xl px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Rp Target..."
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition"
                >
                  Simpan
                </button>
                <button
                  type="button"
                  onClick={() => setEditingTarget(false)}
                  className="px-2.5 py-1.5 rounded-xl bg-white/[0.05] text-slate-400 hover:text-white text-xs font-semibold"
                >
                  Batal
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-3.5 w-full h-2.5 rounded-full bg-[#08090C] border border-white/[0.07] overflow-hidden relative">
          <div
            className="progress-shimmer h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-300 relative overflow-hidden transition-all duration-700 ease-out"
            style={{ width: `${Math.max(dailyProgressPct, todayRevenue > 0 ? 4 : 0)}%` }}
          />
        </div>
      </div>

      {/* Main Analytics Section (Trend & Quick Actions) */}
      <div className="dashboard-main">
        <div className="summary-panel">
          <div className="panel-head">
            <div>
              <h3 className="panel-title">Trend Pendapatan &amp; Omzet</h3>
              <p className="text-xs text-slate-400 mt-0.5">Grafik interaktif kinerja penjualan</p>
            </div>
            <div className="flex items-center space-x-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
              <button
                type="button"
                onClick={() => setTimeRange('today')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${timeRange === 'today' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Hari Ini
              </button>
              <button
                type="button"
                onClick={() => setTimeRange('7days')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${timeRange === '7days' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                7 Hari
              </button>
              <button
                type="button"
                onClick={() => setTimeRange('30days')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${timeRange === '30days' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                30 Hari
              </button>
            </div>
          </div>

          <div className="summary-figure">
            <strong>{formatRupiah(totalRevenue)}</strong>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
              {totalTransactionsCount > 0 ? `${totalTransactionsCount} Transaksi (${timeRange})` : 'Belum ada transaksi'}
            </span>
          </div>

          <div style={{ width: '100%', height: 210 }}>
            {totalTransactionsCount === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs text-center p-6 border border-dashed border-slate-700 rounded-2xl">
                <BarChart3 size={32} className="text-[#94a3b8] mb-2" />
                <span className="font-semibold text-slate-300">Belum ada data transaksi pada periode ini</span>
                <span className="text-[11px] text-[#94a3b8] mt-1">Lakukan transaksi di Kasir (POS) untuk melihat grafik pendapatan</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <defs>
                    <linearGradient id="zenithLineGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="50%" stopColor="#34D399" />
                      <stop offset="100%" stopColor="#38BDF8" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(148, 163, 184, 0.14)" vertical={false} />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: '#94A3B8', fontSize: 11 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94A3B8', fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="url(#zenithLineGradient)"
                    strokeWidth={3.5}
                    dot={{ r: 4, fill: '#10B981', strokeWidth: 2, stroke: '#090c0b' }}
                    activeDot={{ r: 7, fill: '#34D399', stroke: '#fff', strokeWidth: 2 }}
                    animationDuration={900}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="summary-actions">
            <Link href="/transactions" className="btn-secondary">Lihat riwayat lengkap</Link>
            <Link href="/transactions" className="btn-primary">Ekspor Laporan (CSV)</Link>
          </div>
        </div>

        <div className="quick-panel">
          <div className="panel-head">
            <h3 className="panel-title">Aksi Cepat &amp; Navigasi</h3>
          </div>

          {quickActions.map(({ label, value, icon: Icon, href }) => (
            <Link key={label} href={href} className="quick-card group hover:bg-slate-800/40 p-2.5 rounded-xl transition-all duration-200 block text-inherit no-underline hover:translate-x-1">
              <div className="quick-meta">
                <span className="quick-badge transition-transform duration-200 group-hover:scale-110"><Icon size={16} /></span>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{label}</div>
                  <div className="quick-value">{value}</div>
                </div>
              </div>
              <ArrowUpRight size={14} className="text-[#94a3b8] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-emerald-300" />
            </Link>
          ))}
        </div>
      </div>

      {/* Secondary Stats Grid */}
      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-label-row">
            <span className="stat-label">Omzet Hari Ini</span>
            <span className="metric-trend"><ArrowUpRight size={12} />{todayRevenue > 0 ? 'Aktual' : '0'}</span>
          </div>
          <p className="stat-value">{formatRupiah(todayRevenue)}</p>
        </div>

        <div className="stat-box">
          <div className="stat-label-row">
            <span className="stat-label">Rata-rata Trx</span>
            <span className="metric-trend"><ArrowUpRight size={12} />Per Order</span>
          </div>
          <p className="stat-value">{formatRupiah(averageTransaction)}</p>
        </div>

        <div className="stat-box">
          <div className="stat-label-row">
            <span className="stat-label">Total Produk Aktif</span>
            <span className="metric-trend"><ArrowUpRight size={12} />Gudang</span>
          </div>
          <p className="stat-value">{totalProductsCount} Item</p>
        </div>

        <div className="stat-box">
          <div className="stat-label-row">
            <span className="stat-label">Turnover Stok</span>
            <span className="metric-trend"><ArrowUpRight size={12} />Rasio</span>
          </div>
          <p className="stat-value">{stockTurnover}</p>
        </div>
      </div>

      {/* Top Selling Products & Category / Payment Mix */}
      <div className="stats-grid" style={{ marginTop: 8, gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
        {/* Top Selling Products */}
        <div className="chart-card" style={{ padding: 18 }}>
          <div className="panel-head" style={{ marginBottom: 12 }}>
            <h3 className="panel-title">Produk Terlaris</h3>
            <span className="text-[11px] text-slate-400">Berdasarkan Qty</span>
          </div>
          <div className="space-y-3">
            {topSellingProducts.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                Belum ada data produk terjual.
              </div>
            ) : (
              topSellingProducts.map((p, idx) => {
                const maxQty = Math.max(1, topSellingProducts[0]?.qty || 1);
                const pct = Math.min(100, Math.round((p.qty / maxQty) * 100));
                return (
                  <div key={p.name} className="p-2.5 bg-slate-800/40 hover:bg-slate-800/70 rounded-xl border border-slate-700/60 hover:border-emerald-500/35 text-xs transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5 truncate">
                        <span className="w-5 h-5 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">{idx + 1}</span>
                        <span className="font-bold text-white truncate">{p.name}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-bold text-emerald-400">{p.qty} terjual</div>
                        <div className="text-[10px] text-slate-400">{formatRupiah(p.revenue)}</div>
                      </div>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-950/70">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-300 transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Payment Mix Bar Chart */}
        <div className="chart-card" style={{ padding: 18 }}>
          <div className="panel-head" style={{ marginBottom: 10 }}>
            <h3 className="panel-title">Metode Pembayaran</h3>
            <span className="text-[11px] text-slate-400">QRIS / Tunai / Lainnya</span>
          </div>
          <div style={{ width: '100%', height: 200 }}>
            {paymentMix.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs text-center p-4">
                <span className="font-semibold text-slate-300">Belum ada data pembayaran</span>
                <span className="text-[11px] text-[#94a3b8] mt-1">Grafik akan otomatis terisi saat ada transaksi kasir</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={paymentMix}>
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#CBD5E1', fontSize: 11 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94A3B8', fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid #334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    <LabelList dataKey="value" position="top" fill="#F8FAFC" fontSize={12} fontWeight="bold" />
                    {paymentMix.map((entry, index) => (
                      <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Category Mix Pie Chart */}
        <div className="chart-card" style={{ padding: 18 }}>
          <div className="panel-head" style={{ marginBottom: 10 }}>
            <h3 className="panel-title">Kategori Terjual</h3>
            <span className="text-[11px] text-slate-400">Distribusi Kategori</span>
          </div>
          <div style={{ width: '100%', height: 200 }}>
            {categoryMix.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs text-center p-4">
                <span className="font-semibold text-slate-300">Belum ada kategori terjual</span>
                <span className="text-[11px] text-[#94a3b8] mt-1">Diagram lingkaran akan terbentuk setelah transaksi pertama</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid #334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }} />
                  <Pie data={categoryMix} dataKey="value" nameKey="name" innerRadius={42} outerRadius={62} paddingAngle={4} label>
                    {categoryMix.map((entry, index) => (
                      <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend iconSize={10} wrapperStyle={{ fontSize: '11px', color: '#CBD5E1' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
