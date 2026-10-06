'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, ChefHat, Clock, Flame, Utensils } from 'lucide-react';
import { formatRupiah } from '../utils/formatCurrency';
import { readStoredArray, writeStoredArray, normalizeTransaction } from '../utils/storage';

export default function KDSPage() {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    const loadOrders = () => {
      // We load transactions and map them to KDS status if not already stored in zenith_kds_orders
      const txs = readStoredArray('transactions').map(normalizeTransaction);
      const kdsStatuses = readStoredArray('kds_statuses'); // Map of txId -> status ('PENDING', 'COOKING', 'READY', 'COMPLETED')

      const statusMap = kdsStatuses.reduce((acc, curr) => {
        acc[curr.id] = curr.status;
        return acc;
      }, {});

      const formatted = txs.map((tx, idx) => ({
        id: tx.id,
        date: tx.date || tx.createdAt,
        items: tx.items || [],
        payment: tx.payment,
        total: tx.total,
        status: statusMap[tx.id] || (idx < 3 ? 'COOKING' : 'READY'), // Default initial demo statuses
      }));

      setOrders(formatted);
    };

    loadOrders();
    const interval = setInterval(loadOrders, 3000); // Poll for new orders
    return () => clearInterval(interval);
  }, []);

  const updateStatus = (orderId, newStatus) => {
    const updated = orders.map((order) =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updated);
    const statusesToSave = updated.map((o) => ({ id: o.id, status: o.status }));
    writeStoredArray('kds_statuses', statusesToSave);
  };

  const filteredOrders = orders.filter((order) => {
    if (filterStatus === 'ALL') return order.status !== 'COMPLETED';
    return order.status === filterStatus;
  });

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
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition text-slate-300 hover:text-white"
              title="Kembali ke Dashboard"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <div className="flex items-center gap-2 text-emerald-400 font-medium text-sm mb-1">
                <ChefHat size={18} />
                <span>Kitchen Display System (KDS)</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">Layar Pesanan Dapur & Bar</h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {['ALL', 'PENDING', 'COOKING', 'READY'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                  filterStatus === st
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                {st === 'ALL' ? 'Aktif' : st === 'PENDING' ? 'Menunggu' : st === 'COOKING' ? 'Dimasak' : 'Siap Saji'}
              </button>
            ))}
          </div>
        </header>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/50 border border-slate-800/80 rounded-3xl backdrop-blur-sm">
            <Utensils className="mx-auto h-12 w-12 text-slate-600 mb-4" />
            <h3 className="text-lg font-bold text-white">Tidak ada pesanan aktif</h3>
            <p className="text-slate-400 text-sm mt-1">Pesanan baru dari kasir akan langsung muncul di sini secara real-time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-amber-400" />
                
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono font-bold text-emerald-400 text-sm bg-emerald-950/50 px-3 py-1 rounded-lg border border-emerald-800/40">
                      {order.id}
                    </span>
                    {getStatusBadge(order.status)}
                  </div>

                  <div className="text-xs text-slate-400 mb-4 flex items-center gap-1.5">
                    <Clock size={13} />
                    <span>{order.date}</span>
                  </div>

                  <div className="space-y-3 mb-6">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1">Daftar Item Pesanan:</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/50">
                          <span className="font-medium text-white">{item.name}</span>
                          <span className="font-mono font-bold text-teal-400 bg-teal-950/50 px-2.5 py-0.5 rounded-md">
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
                      <span className="col-span-2 text-center text-xs text-slate-500 py-2">Pesanan telah selesai</span>
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
