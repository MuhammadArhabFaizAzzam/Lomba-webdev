'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, ChefHat, Clock, Flame, Utensils, AlertTriangle, FileText, UtensilsCrossed } from 'lucide-react';
import { formatRupiah } from '../utils/formatCurrency';
import { readStoredArray, writeStoredArray, normalizeTransaction } from '../utils/storage';

const runViewTransition = (callback) => {
  if (typeof document !== 'undefined' && document.startViewTransition) {
    document.startViewTransition(() => {
      callback();
    });
  } else {
    callback();
  }
};

const toSafeTransitionId = (id) =>
  `kds-${String(id ?? 'ticket').replace(/[^a-zA-Z0-9_-]/g, '_')}`;

export default function KDSPage() {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadOrders = () => {
      const txs = readStoredArray('transactions').map(normalizeTransaction);
      const kdsStatuses = readStoredArray('kds_statuses');

      const statusMap = kdsStatuses.reduce((acc, curr) => {
        acc[curr.id] = curr;
        return acc;
      }, {});

      const formatted = txs
        .filter((tx) => statusMap[tx.id] && tx.status !== 'Retur')
        .map((tx) => {
          const entry = statusMap[tx.id];
          const parsedTime = tx.createdAt ? Date.parse(tx.createdAt) : NaN;
          const idTimestamp = String(tx.id || '').startsWith('TRX-')
            ? Number(String(tx.id).replace('TRX-', ''))
            : NaN;
          const startMs = Number.isFinite(parsedTime)
            ? parsedTime
            : Number.isFinite(idTimestamp)
            ? idTimestamp
            : Date.now();

          return {
            id: tx.id,
            date: tx.date || tx.createdAt,
            startMs,
            items: tx.items || [],
            payment: tx.payment,
            total: tx.total,
            tableLabel: tx.tableLabel || entry?.tableLabel || '',
            orderNotes: tx.orderNotes || entry?.orderNotes || '',
            customerName: tx.customerName || 'Umum',
            status: entry.status,
          };
        });

      setOrders(formatted);
    };

    loadOrders();
    const interval = setInterval(loadOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = (orderId, newStatus) => {
    runViewTransition(() => {
      const updated = orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      );
      setOrders(updated);
      const statusesToSave = updated.map((o) => ({
        id: o.id,
        status: o.status,
        tableLabel: o.tableLabel,
        orderNotes: o.orderNotes,
      }));
      writeStoredArray('kds_statuses', statusesToSave);
    });
  };

  const statusCounts = useMemo(() => {
    return orders.reduce(
      (acc, o) => {
        if (o.status === 'PENDING') acc.pending += 1;
        else if (o.status === 'COOKING') acc.cooking += 1;
        else if (o.status === 'READY') acc.ready += 1;
        return acc;
      },
      { pending: 0, cooking: 0, ready: 0 }
    );
  }, [orders]);

  const filteredOrders = orders.filter((order) => {
    if (filterStatus === 'ALL') return order.status !== 'COMPLETED';
    return order.status === filterStatus;
  });

  const getSlaBadge = (startMs) => {
    const elapsedSec = Math.max(0, Math.floor((nowMs - startMs) / 1000));
    const mins = Math.floor(elapsedSec / 60);
    const secs = elapsedSec % 60;
    const formatted = `${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}d`;

    if (mins >= 10) {
      return (
        <span className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold bg-rose-500/15 text-rose-300 border border-rose-500/35 flex items-center gap-1.5 animate-pulse">
          <AlertTriangle size={12} />
          <span>SLA {formatted}</span>
        </span>
      );
    }
    if (mins >= 5) {
      return (
        <span className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/35 flex items-center gap-1.5">
          <Clock size={12} />
          <span>{formatted}</span>
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 flex items-center gap-1.5">
        <Clock size={12} />
        <span>{formatted}</span>
      </span>
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full text-xs font-semibold flex items-center gap-1.5"><Clock size={13} /> Menunggu</span>;
      case 'COOKING':
        return <span className="px-3 py-1 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-full text-xs font-semibold flex items-center gap-1.5"><Flame size={13} /> Sedang Dimasak</span>;
      case 'READY':
        return <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-semibold flex items-center gap-1.5"><CheckCircle2 size={13} /> Siap Saji</span>;
      case 'COMPLETED':
        return <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-semibold flex items-center gap-1.5">Selesai</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#08090C] text-slate-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="p-2.5 bg-[#11141B] hover:bg-[#171B24] border border-white/10 rounded-xl transition text-slate-300 hover:text-white"
              title="Kembali ke Dashboard"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <div className="flex items-center gap-2 text-emerald-400 font-medium text-sm mb-1">
                <ChefHat size={18} />
                <span>Kitchen Display System (KDS) · SLA Telemetry</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">Layar Pesanan Dapur &amp; Bar</h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {['ALL', 'PENDING', 'COOKING', 'READY'].map((st) => (
              <button
                key={st}
                onClick={() => runViewTransition(() => setFilterStatus(st))}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  filterStatus === st
                    ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                    : 'bg-[#11141B] text-slate-400 hover:bg-[#171B24] hover:text-white border border-white/[0.08]'
                }`}
              >
                {st === 'ALL'
                  ? `Semua Aktif (${statusCounts.pending + statusCounts.cooking + statusCounts.ready})`
                  : st === 'PENDING'
                  ? `Menunggu (${statusCounts.pending})`
                  : st === 'COOKING'
                  ? `Dimasak (${statusCounts.cooking})`
                  : `Siap Saji (${statusCounts.ready})`}
              </button>
            ))}
          </div>
        </header>

        {/* Live Kitchen Queue Summary Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="spotlight-card bg-[#11141B] border border-white/[0.08] rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Antrean Menunggu</span>
              <div className="text-2xl font-black text-amber-400 font-mono mt-0.5">{statusCounts.pending} Tiket</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <Clock size={18} />
            </div>
          </div>
          <div className="spotlight-card bg-[#11141B] border border-white/[0.08] rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Sedang Dimasak</span>
              <div className="text-2xl font-black text-orange-400 font-mono mt-0.5">{statusCounts.cooking} Tiket</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400 flex items-center justify-center">
              <Flame size={18} />
            </div>
          </div>
          <div className="spotlight-card bg-[#11141B] border border-white/[0.08] rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Siap Disajikan</span>
              <div className="text-2xl font-black text-emerald-400 font-mono mt-0.5">{statusCounts.ready} Tiket</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 size={18} />
            </div>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-20 bg-[#11141B] border border-white/[0.08] rounded-3xl backdrop-blur-sm animate-fadeIn">
            <Utensils className="mx-auto h-12 w-12 text-[#94a3b8] mb-4" />
            <h3 className="text-lg font-bold text-white">Tidak ada pesanan aktif</h3>
            <p className="text-slate-400 text-sm mt-1">Pesanan baru dari kasir akan langsung muncul di sini secara real-time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-grid">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                style={{ viewTransitionName: toSafeTransitionId(order.id) }}
                className="spotlight-card vt-kds-ticket bg-[#11141B] border border-white/[0.08] rounded-2xl p-6 shadow-xl flex flex-col justify-between relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />
                
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono font-bold text-emerald-400 text-xs bg-emerald-950/50 px-3 py-1 rounded-lg border border-emerald-800/40">
                      {order.id}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {getSlaBadge(order.startMs)}
                      {getStatusBadge(order.status)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                    <span className="flex items-center gap-1.5">
                      <Clock size={12} />
                      <span>{order.date}</span>
                    </span>
                    {order.tableLabel && (
                      <span className="px-2.5 py-0.5 rounded-md bg-white/[0.06] border border-white/10 text-white font-semibold flex items-center gap-1">
                        <UtensilsCrossed size={11} className="text-emerald-400" />
                        <span>{order.tableLabel}</span>
                      </span>
                    )}
                  </div>

                  {order.orderNotes && (
                    <div className="mb-4 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2">
                      <FileText size={14} className="text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-amber-300 block text-[10px] uppercase tracking-wider">Catatan Dapur:</span>
                        <span>{order.orderNotes}</span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3 mb-6">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-white/[0.08] pb-1.5">Daftar Item Pesanan:</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm bg-[#0B0D11] p-2.5 rounded-xl border border-white/[0.06]">
                          <span className="font-medium text-white">{item.name}</span>
                          <span className="font-mono font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/25 px-2.5 py-0.5 rounded-md">
                            {item.qty}x
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Total:</span>
                    <span className="font-bold text-white font-mono">{formatRupiah(order.total)}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {order.status === 'PENDING' && (
                      <button
                        onClick={() => updateStatus(order.id, 'COOKING')}
                        className="col-span-2 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-600/20 transition flex items-center justify-center gap-2"
                      >
                        <Flame size={16} /> Mulai Masak
                      </button>
                    )}
                    {order.status === 'COOKING' && (
                      <button
                        onClick={() => updateStatus(order.id, 'READY')}
                        className="col-span-2 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 size={16} /> Siap Saji
                      </button>
                    )}
                    {order.status === 'READY' && (
                      <button
                        onClick={() => updateStatus(order.id, 'COMPLETED')}
                        className="col-span-2 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2"
                      >
                        Selesaikan Pesanan
                      </button>
                    )}
                    {order.status === 'COMPLETED' && (
                      <span className="col-span-2 text-center text-xs text-[#94a3b8] py-2">Pesanan telah selesai</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
