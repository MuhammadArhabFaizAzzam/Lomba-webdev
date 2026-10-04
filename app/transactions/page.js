'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ReceiptText, Search, WalletCards, Eye, Printer, CheckCircle2, Clock, AlertCircle, Filter } from 'lucide-react';
import { formatRupiah } from '../utils/formatCurrency';
import { normalizeTransaction, readStoredArray, writeStoredArray } from '../utils/storage';

const formatProductName = (name) => {
  if (!name) return '';
  return String(name)
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState('Semua');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [dateFilter, setDateFilter] = useState('Semua'); // 'Semua' | 'Hari Ini'

  // Detail Modal State
  const [selectedTx, setSelectedTx] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  useEffect(() => {
    const loadTransactions = window.setTimeout(() => {
      const parsed = readStoredArray('transactions').map(normalizeTransaction);
      // Ensure each transaction has a status ('Lunas' by default if not set)
      const enhanced = parsed.map(tx => ({
        ...tx,
        status: tx.status || (tx.payment?.includes('QRIS') ? 'Menunggu' : 'Lunas'),
        cashier: tx.cashier || 'Kasir Staff',
      }));
      setTransactions(enhanced);
    }, 0);
    return () => window.clearTimeout(loadTransactions);
  }, []);

  const saveTransactions = (nextTxs) => {
    setTransactions(nextTxs);
    writeStoredArray('transactions', nextTxs);
  };

  const handleMarkAsPaid = (txId, e) => {
    e.stopPropagation();
    const updated = transactions.map(tx => tx.id === txId ? { ...tx, status: 'Lunas' } : tx);
    saveTransactions(updated);
    showToast(`Transaksi ${txId} berhasil ditandai Lunas!`);
    if (selectedTx && selectedTx.id === txId) {
      setSelectedTx(prev => ({ ...prev, status: 'Lunas' }));
    }
  };

  const filteredTransactions = useMemo(() => {
    const query = searchTerm.toLowerCase();
    const todayStr = new Date().toDateString();

    return transactions.filter((tx) => {
      const matchId = String(tx.id || '').toLowerCase().includes(query);
      const matchPayment = String(tx.payment || '').toLowerCase().includes(query);
      const matchItems = Array.isArray(tx.items) && tx.items.some(item =>
        String(item?.name || '').toLowerCase().includes(query)
      );
      const matchesSearch = matchId || matchPayment || matchItems;

      const matchesMethod = methodFilter === 'Semua' || String(tx.payment || '').toLowerCase().includes(methodFilter.toLowerCase());
      const matchesStatus = statusFilter === 'Semua' || tx.status === statusFilter;
      const matchesDate = dateFilter === 'Semua' || new Date(tx.createdAt || tx.date).toDateString() === todayStr;

      return matchesSearch && matchesMethod && matchesStatus && matchesDate;
    });
  }, [transactions, searchTerm, methodFilter, statusFilter, dateFilter]);

  // Summary Metrics
  const summary = useMemo(() => {
    const todayStr = new Date().toDateString();
    const totalCount = filteredTransactions.length;
    const todayRevenue = filteredTransactions
      .filter(tx => new Date(tx.createdAt || tx.date).toDateString() === todayStr && tx.status === 'Lunas')
      .reduce((sum, tx) => sum + Number(tx.total || 0), 0);
    const qrisCount = filteredTransactions.filter(tx => String(tx.payment || '').includes('QRIS')).length;
    const pendingCount = filteredTransactions.filter(tx => tx.status === 'Menunggu').length;
    const totalRevenue = filteredTransactions
      .filter(tx => tx.status === 'Lunas')
      .reduce((sum, tx) => sum + Number(tx.total || 0), 0);

    return { totalCount, todayRevenue, qrisCount, pendingCount, totalRevenue };
  }, [filteredTransactions]);

  const exportToCSV = () => {
    if (filteredTransactions.length === 0) return;

    const headers = ['ID Transaksi', 'Waktu', 'Kasir', 'Detail Item', 'Metode Pembayaran', 'Status', 'Total'];
    const rows = filteredTransactions.map(tx => {
      const itemsSummary = Array.isArray(tx.items)
        ? tx.items.map(i => `${formatProductName(i.name)} (${i.qty}x)`).join(', ')
        : String(tx.items || '');
      return [
        `"${String(tx.id).replace(/"/g, '""')}"`,
        `"${String(tx.date).replace(/"/g, '""')}"`,
        `"${String(tx.cashier || 'Kasir Staff').replace(/"/g, '""')}"`,
        `"${itemsSummary.replace(/"/g, '""')}"`,
        `"${String(tx.payment).replace(/"/g, '""')}"`,
        `"${String(tx.status).replace(/"/g, '""')}"`,
        `"${String(tx.total).replace(/"/g, '""')}"`
      ];
    });

    const csvContent = [
      headers.map(h => `"${h}"`).join(','),
      ...rows.map(row => row.join(','))
    ].join('\r\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `laporan-transaksi-zenith-pos-${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status) => {
    if (status === 'Lunas') {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 inline-flex items-center space-x-1">
          <CheckCircle2 size={12} />
          <span>Lunas</span>
        </span>
      );
    }
    if (status === 'Menunggu') {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 inline-flex items-center space-x-1">
          <Clock size={12} />
          <span>Menunggu</span>
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30 inline-flex items-center space-x-1">
        <AlertCircle size={12} />
        <span>Gagal</span>
      </span>
    );
  };

  return (
    <div className="page-stack">
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl text-sm font-semibold border border-slate-700 animate-bounce">
          {toastMessage}
        </div>
      )}

      <div className="page-heading">
        <div>
          <span className="eyebrow">Finance log</span>
          <h2>Riwayat &amp; Status Transaksi</h2>
          <p>Pantau status pembayaran QRIS real-time, kasir bertugas, dan rekap keuangan.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <button
            onClick={exportToCSV}
            disabled={filteredTransactions.length === 0}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl shadow-md shadow-emerald-600/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Export CSV ({filteredTransactions.length})</span>
          </button>
        </div>
      </div>

      {/* Summary Cards Above Table */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Transaksi</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-extrabold text-white">{summary.totalCount}</span>
            <span className="text-xs text-indigo-400 font-semibold">{formatRupiah(summary.totalRevenue)}</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Masuk Hari Ini</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-extrabold text-emerald-400">{formatRupiah(summary.todayRevenue)}</span>
            <span className="text-xs text-slate-400 font-semibold">Aktual</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total QRIS</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-extrabold text-sky-400">{summary.qrisCount} Trx</span>
            <span className="text-xs text-slate-400 font-semibold">Digital</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Menunggu Bayar</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-extrabold text-amber-400">{summary.pendingCount}</span>
            <span className="text-xs text-amber-300 font-semibold">{summary.pendingCount > 0 ? 'Perlu Cek' : 'Aman'}</span>
          </div>
        </div>
      </div>

      {/* Advanced Filter Toolbar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col lg:flex-row gap-3 items-center justify-between">
        <div className="search-field w-full lg:w-80">
          <Search size={17} />
          <label htmlFor="transaction-search" className="sr-only">Cari transaksi</label>
          <input
            id="transaction-search"
            type="text"
            placeholder="Cari ID, item, atau pembayaran..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* Method Filter */}
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl focus:outline-none focus:border-indigo-500"
          >
            <option value="Semua">Semua Metode</option>
            <option value="QRIS">QRIS</option>
            <option value="Tunai">Tunai</option>
            <option value="Transfer">Transfer</option>
            <option value="Kartu">Kartu Kredit / Debit</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl focus:outline-none focus:border-indigo-500"
          >
            <option value="Semua">Semua Status</option>
            <option value="Lunas">Lunas</option>
            <option value="Menunggu">Menunggu</option>
            <option value="Gagal">Gagal</option>
          </select>

          {/* Date Filter */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl focus:outline-none focus:border-indigo-500"
          >
            <option value="Semua">Semua Waktu</option>
            <option value="Hari Ini">Hari Ini</option>
          </select>

          <span className="record-count ml-auto">{filteredTransactions.length} data</span>
        </div>
      </div>

      <div className="data-panel">
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID Transaksi</th>
                <th>Waktu</th>
                <th>Kasir</th>
                <th>Detail Item</th>
                <th>Metode</th>
                <th>Status</th>
                <th className="align-right">Total</th>
                <th className="align-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="8">
                    <div className="table-empty">
                      <span className="empty-icon"><ReceiptText size={22} /></span>
                      <strong>Belum ada riwayat transaksi</strong>
                      <p>Transaksi dari kasir akan muncul di sini secara otomatis.</p>
                      <Link href="/pos" className="btn-primary">Buka Kasir <ArrowRight size={15} /></Link>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    onClick={() => { setSelectedTx(tx); setShowModal(true); }}
                    className="cursor-pointer hover:bg-slate-800/40 transition"
                  >
                    <td className="transaction-id font-mono text-indigo-400 font-bold">{tx.id}</td>
                    <td className="muted-cell text-xs">{tx.date}</td>
                    <td className="text-xs font-semibold text-slate-300">{tx.cashier || 'Kasir Staff'}</td>
                    <td className="item-cell text-xs">
                      {Array.isArray(tx.items)
                        ? tx.items.map((item) => `${formatProductName(item.name)} × ${item.qty}`).join(', ')
                        : String(tx.items || '')}
                    </td>
                    <td>
                      <span className="payment-badge"><WalletCards size={13} />{tx.payment}</span>
                    </td>
                    <td>{getStatusBadge(tx.status)}</td>
                    <td className="align-right amount-cell font-bold text-white">{formatRupiah(tx.total)}</td>
                    <td className="align-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center space-x-1.5">
                        <button
                          type="button"
                          onClick={() => { setSelectedTx(tx); setShowModal(true); }}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-400 rounded-lg transition"
                          title="Lihat Detail"
                        >
                          <Eye size={15} />
                        </button>
                        {tx.status === 'Menunggu' && (
                          <button
                            type="button"
                            onClick={(e) => handleMarkAsPaid(tx.id, e)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold rounded-lg transition"
                            title="Tandai Lunas"
                          >
                            Lunas?
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Detail Modal */}
      {showModal && selectedTx && (
        <div className="modal-backdrop">
          <div className="modal-card max-w-lg w-full p-6 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl text-slate-100">
            <div className="flex justify-between items-start pb-4 border-b border-slate-800 mb-4">
              <div>
                <span className="eyebrow" style={{ color: 'var(--accent-secondary)' }}>Detail Transaksi</span>
                <h3 className="text-xl font-extrabold text-white font-mono mt-1">{selectedTx.id}</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
                <div>
                  <span className="text-slate-400 block">Waktu Transaksi</span>
                  <strong className="text-white text-sm">{selectedTx.date}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Kasir Bertugas</span>
                  <strong className="text-white text-sm">{selectedTx.cashier || 'Kasir Staff'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Metode Pembayaran</span>
                  <strong className="text-white text-sm">{selectedTx.payment}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Status Pembayaran</span>
                  <div className="mt-1">{getStatusBadge(selectedTx.status)}</div>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-300 uppercase tracking-wider block mb-2">Rincian Barang</span>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {Array.isArray(selectedTx.items) && selectedTx.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2.5 bg-slate-800/40 rounded-xl border border-slate-700/50">
                      <div>
                        <div className="font-bold text-white">{formatProductName(item.name)}</div>
                        <div className="text-slate-400 text-[11px]">{formatRupiah(item.price)} × {item.qty}</div>
                      </div>
                      <div className="font-bold text-indigo-400 font-mono">
                        {formatRupiah(item.price * item.qty)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-sm font-bold">
                <span className="text-slate-300">Total Pembayaran:</span>
                <span className="text-emerald-400 text-lg font-mono">{formatRupiah(selectedTx.total)}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
              {selectedTx.status === 'Menunggu' && (
                <button
                  type="button"
                  onClick={(e) => handleMarkAsPaid(selectedTx.id, e)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition shadow-md"
                >
                  Tandai Pembayaran Lunas
                </button>
              )}
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition shadow-md flex items-center space-x-1.5"
              >
                <Printer size={14} />
                <span>Cetak Struk</span>
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
